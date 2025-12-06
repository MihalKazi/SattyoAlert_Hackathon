// src/app/api/fact-check/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';

// Simple keyword-based fact-checking (you can enhance this with AI later)
function analyzeContent(text) {
  const lowerText = text.toLowerCase();
  
  // Fake news indicators
  const fakeNewsIndicators = [
    'ব্রেকিং', 'জরুরি', 'শকিং', 'আগে মুছে যাবে', 'দ্রুত শেয়ার',
    'breaking', 'urgent', 'shocking', 'before deleted', 'share immediately',
    'doctors hate', 'one weird trick', 'you won\'t believe'
  ];
  
  // Reliable source indicators
  const reliableIndicators = [
    'research', 'study', 'university', 'official',
    'গবেষণা', 'বিশ্ববিদ্যালয়', 'সরকারি'
  ];
  
  // URL patterns
  const hasShortUrl = /bit\.ly|tinyurl|goo\.gl/i.test(text);
  const hasReliableSource = /\.gov|\.edu|who\.int|bbc\.com|reuters\.com/i.test(text);
  
  // Score calculation
  let suspicionScore = 0;
  let reliabilityScore = 0;
  
  fakeNewsIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) suspicionScore += 2;
  });
  
  reliableIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) reliabilityScore += 2;
  });
  
  if (hasShortUrl) suspicionScore += 3;
  if (hasReliableSource) reliabilityScore += 3;
  
  // Message length and structure analysis
  const wordCount = text.split(/\s+/).length;
  const lineCount = text.split('\n').length;
  
  if (wordCount > 100 && lineCount > 5) suspicionScore += 1;
  if (text.includes('http') || text.includes('www')) suspicionScore += 1;
  
  // Determine verdict
  let verdict, confidence, isFake;
  
  if (suspicionScore > reliabilityScore + 3) {
    verdict = 'false';
    isFake = true;
    confidence = Math.min(85, 60 + suspicionScore * 5);
  } else if (reliabilityScore > suspicionScore + 2) {
    verdict = 'true';
    isFake = false;
    confidence = Math.min(80, 55 + reliabilityScore * 5);
  } else {
    verdict = 'uncertain';
    isFake = false;
    confidence = 50;
  }
  
  return {
    verdict,
    isFake,
    isVerified: !isFake && verdict === 'true',
    confidence,
    suspicionScore,
    reliabilityScore,
    indicators: {
      hasShortUrl,
      hasReliableSource,
      wordCount,
      lineCount
    }
  };
}

// Generate explanation based on analysis
function generateExplanation(analysis, text) {
  const explanations = [];
  
  if (analysis.verdict === 'false') {
    explanations.push('এই বার্তায় মিথ্যা তথ্যের বৈশিষ্ট্য পাওয়া গেছে।');
    
    if (analysis.indicators.hasShortUrl) {
      explanations.push('সংক্ষিপ্ত URL ব্যবহৃত হয়েছে যা সন্দেহজনক হতে পারে।');
    }
    
    if (analysis.suspicionScore > 5) {
      explanations.push('বার্তায় একাধিক সতর্কতা সংকেত পাওয়া গেছে।');
    }
    
    explanations.push('অনুগ্রহ করে বিশ্বস্ত সূত্র থেকে যাচাই করুন।');
  } else if (analysis.verdict === 'true') {
    explanations.push('এই বার্তায় বিশ্বস্ত তথ্যের বৈশিষ্ট্য রয়েছে।');
    
    if (analysis.indicators.hasReliableSource) {
      explanations.push('বিশ্বস্ত উৎস থেকে তথ্য পাওয়া গেছে।');
    }
  } else {
    explanations.push('এই বার্তার সত্যতা নিশ্চিত করা যায়নি।');
    explanations.push('আরও যাচাই প্রয়োজন।');
  }
  
  return explanations.join(' ');
}

// Check if similar claim exists in database
async function checkExistingClaims(text) {
  try {
    // Simple text matching (you can use embeddings/similarity for better results)
    const textPreview = text.substring(0, 100).toLowerCase();
    
    const reportsRef = collection(db, 'reports');
    const q = query(
      reportsRef,
      where('status', '==', 'reviewed'),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const claimPreview = data.claim?.substring(0, 100).toLowerCase() || '';
      
      // Simple similarity check
      if (claimPreview && textPreview.includes(claimPreview.substring(0, 50))) {
        return {
          found: true,
          verdict: data.verdict,
          explanation: data.explanation || 'পূর্বে যাচাই করা হয়েছে।',
          reviewedBy: data.reviewedBy
        };
      }
    }
    
    return { found: false };
  } catch (error) {
    console.error('Error checking existing claims:', error);
    return { found: false };
  }
}

// Handle POST requests for fact-checking
export async function POST(request) {
  try {
    const body = await request.json();
    const { text, source, url } = body;
    
    console.log('Fact-check request:', { 
      textLength: text?.length, 
      source, 
      url 
    });
    
    // Validate input
    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Text is too short for fact-checking' },
        { status: 400 }
      );
    }
    
    // Check if claim already exists in database
    const existingClaim = await checkExistingClaims(text);
    
    if (existingClaim.found) {
      return NextResponse.json({
        success: true,
        verdict: existingClaim.verdict,
        explanation: existingClaim.explanation,
        isFake: existingClaim.verdict === 'false',
        isVerified: existingClaim.verdict === 'true',
        source: 'database',
        reviewedBy: existingClaim.reviewedBy,
        cached: true
      });
    }
    
    // Perform content analysis
    const analysis = analyzeContent(text);
    const explanation = generateExplanation(analysis, text);
    
    // Save to database for future reference
    const checkData = {
      text: text.substring(0, 500), // Store first 500 chars
      verdict: analysis.verdict,
      confidence: analysis.confidence,
      source: source || 'unknown',
      sourceUrl: url || '',
      explanation: explanation,
      indicators: analysis.indicators,
      checkedAt: serverTimestamp(),
      status: 'auto-checked'
    };
    
    try {
      await addDoc(collection(db, 'fact-checks'), checkData);
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      // Continue even if DB save fails
    }
    
    // Return response
    return NextResponse.json({
      success: true,
      verdict: analysis.verdict,
      isFake: analysis.isFake,
      isVerified: analysis.isVerified,
      confidence: analysis.confidence,
      explanation: explanation,
      sources: getSources(analysis.verdict),
      indicators: analysis.indicators,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Fact-check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process fact-check',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Get relevant sources based on verdict
function getSources(verdict) {
  const sources = {
    'false': [
      'সতর্কতা: এই ধরনের বার্তা প্রায়ই মিথ্যা হয়',
      'বিশ্বস্ত সংবাদ সূত্র পরীক্ষা করুন'
    ],
    'true': [
      'বিশ্বস্ত উৎস থেকে নিশ্চিত',
      'যাচাইকৃত তথ্য'
    ],
    'uncertain': [
      'আরও তথ্য প্রয়োজন',
      'স্বাধীন যাচাই করুন'
    ]
  };
  
  return sources[verdict] || sources['uncertain'];
}

// Handle GET requests (optional - for testing)
export async function GET(request) {
  return NextResponse.json({
    status: 'Fact-check API is running',
    endpoints: {
      POST: '/api/fact-check - Submit text for fact-checking'
    },
    version: '1.0.0'
  });
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