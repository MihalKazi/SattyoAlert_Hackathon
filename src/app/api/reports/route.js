// src/app/api/reports/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Handle POST requests from extension
export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('Received report:', body);
    
    // Validate required fields
    if (!body.claim || !body.category || !body.urgency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add report to Firestore
    const reportData = {
      claim: body.claim,
      category: body.category,
      urgency: body.urgency,
      sourceUrl: body.sourceUrl || '',
      source: body.source || 'browser-extension',
      status: 'pending',
      submittedAt: serverTimestamp(),
      reviewedBy: null,
      reviewedAt: null,
      verdict: '',
    };

    const docRef = await addDoc(collection(db, 'reports'), reportData);

    console.log('Report saved with ID:', docRef.id);

    return NextResponse.json(
      { 
        success: true, 
        reportId: docRef.id,
        message: 'Report submitted successfully'
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

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}