// src/app/api/reports/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// Handle POST requests from extension
export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('Received report:', {
      source: body.source,
      category: body.category,
      textLength: body.claim?.length
    });
    
    // Validate required fields
    if (!body.claim) {
      return NextResponse.json(
        { error: 'Claim text is required' },
        { status: 400 }
      );
    }

    // Determine if this is a WhatsApp report
    const isWhatsApp = body.source === 'whatsapp' || body.sourceUrl?.includes('whatsapp');

    // Add report to Firestore
    const reportData = {
      claim: body.claim,
      category: body.category || (isWhatsApp ? 'Social Media' : 'General'),
      urgency: body.urgency || 'medium',
      sourceUrl: body.sourceUrl || '',
      source: body.source || 'browser-extension',
      platform: isWhatsApp ? 'whatsapp' : 'web',
      status: 'pending',
      submittedAt: serverTimestamp(),
      reviewedBy: null,
      reviewedAt: null,
      verdict: '',
      votes: {
        helpful: 0,
        notHelpful: 0
      },
      metadata: {
        userAgent: body.userAgent || '',
        timestamp: new Date().toISOString(),
        claimLength: body.claim.length,
        hasUrl: body.claim.includes('http'),
        isWhatsApp: isWhatsApp
      }
    };

    const docRef = await addDoc(collection(db, 'reports'), reportData);

    console.log('Report saved with ID:', docRef.id);

    // If it's a WhatsApp message, also check for quick verdict
    let quickVerdict = null;
    if (isWhatsApp) {
      quickVerdict = await getQuickVerdict(body.claim);
    }

    return NextResponse.json(
      { 
        success: true, 
        reportId: docRef.id,
        message: isWhatsApp 
          ? 'WhatsApp বার্তা সফলভাবে রিপোর্ট করা হয়েছে' 
          : 'Report submitted successfully',
        quickVerdict: quickVerdict,
        isWhatsApp: isWhatsApp
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json(
      { error: 'Failed to submit report', details: error.message },
      { status: 500 }
    );
  }
}

// Handle GET requests - fetch reports
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const status = searchParams.get('status');
    const limitNum = parseInt(searchParams.get('limit') || '20');

    let q = query(
      collection(db, 'reports'),
      orderBy('submittedAt', 'desc'),
      limit(limitNum)
    );

    // Filter by source if provided
    if (source) {
      q = query(
        collection(db, 'reports'),
        where('source', '==', source),
        orderBy('submittedAt', 'desc'),
        limit(limitNum)
      );
    }

    // Filter by status if provided
    if (status) {
      q = query(
        collection(db, 'reports'),
        where('status', '==', status),
        orderBy('submittedAt', 'desc'),
        limit(limitNum)
      );
    }

    const snapshot = await getDocs(q);
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate().toISOString()
    }));

    return NextResponse.json({
      success: true,
      count: reports.length,
      reports: reports
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports', details: error.message },
      { status: 500 }
    );
  }
}

// Quick verdict check for common fake news
async function getQuickVerdict(text) {
  try {
    const lowerText = text.toLowerCase();
    
    // Check for known fake news patterns in database
    const reportsRef = collection(db, 'reports');
    const q = query(
      reportsRef,
      where('status', '==', 'reviewed'),
      where('verdict', 'in', ['false', 'true']),
      orderBy('reviewedAt', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    
    // Simple text similarity check
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const claimText = data.claim?.toLowerCase() || '';
      
      // If 60% of words match, consider it similar
      const similarity = calculateSimilarity(lowerText, claimText);
      
      if (similarity > 0.6) {
        return {
          verdict: data.verdict,
          confidence: Math.round(similarity * 100),
          explanation: data.explanation || 'পূর্বে যাচাই করা হয়েছে',
          matched: true
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting quick verdict:', error);
    return null;
  }
}

// Calculate text similarity (simple Jaccard similarity)
function calculateSimilarity(text1, text2) {
  const words1 = new Set(text1.split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(text2.split(/\s+/).filter(w => w.length > 3));
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}