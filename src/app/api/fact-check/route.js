import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js'; 
import { pipeline } from '@xenova/transformers';

// --- INITIALIZATION ---
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

let extractor;
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// --- 🛡️ ENVIRONMENT SHIELD FOR AI MODEL ---
if (typeof self === 'undefined') {
  global.self = global;
}

// --- FREE SEMANTIC EMBEDDING FUNCTION ---
async function getEmbedding(text) {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// --- NEW & OPTIMIZED: Semantic Database Check (Supabase) ---
async function checkSemanticClaims(text) {
  try {
    const vector = await getEmbedding(text);
    
    // 🔽 Threshold ০.৫০ এ নামিয়ে আনা হয়েছে যাতে ডাটাবেস থেকে সম্ভাব্য সব ম্যাচ আসে
    const { data: matches, error } = await supabase.rpc('match_reports', {
      query_embedding: vector,
      match_threshold: 0.50, 
      match_count: 1
    });

    if (error) {
        console.error("Supabase RPC Error:", error);
        return { found: false };
    }

    if (matches && matches.length > 0) {
      const score = matches[0].similarity;
      
      // 💡 আপনার VS Code Terminal-এ এই লগটি দেখতে পাবেন
      console.log(`\n--- 🔍 AI SEARCH DEBUG ---`);
      console.log(`Input: "${text}"`);
      console.log(`Matched With: "${matches[0].content}"`);
      console.log(`Similarity Score: ${(score * 100).toFixed(2)}%`);
      console.log(`--------------------------\n`);

      // বাংলার ক্ষেত্রে নামের বানানভেদে ০.৬০-০.৭০ স্কোর পাওয়া স্বাভাবিক। 
      // আমরা ০.৬২ এর বেশি হলে সেটিকে সঠিক ম্যাচ হিসেবে গ্রহণ করব।
      if (score >= 0.62) {
        return {
          found: true,
          verdict: matches[0].status,
          explanation: matches[0].verdict_text,
          similarity: score
        };
      }
    }
    return { found: false };
  } catch (err) {
    console.error("Semantic search error:", err);
    return { found: false };
  }
}

// --- YOUR ORIGINAL LOGIC: analyzeContent (UNCHANGED) ---
function analyzeContent(text) {
  const lowerText = text.toLowerCase();
  const fakeNewsIndicators = [
    'ব্রেকিং', 'জরুরি', 'শকিং', 'আগে মুছে যাবে', 'দ্রুত শেয়ার',
    'breaking', 'urgent', 'shocking', 'before deleted', 'share immediately',
    'doctors hate', 'one weird trick', 'you won\'t believe'
  ];
  const reliableIndicators = [
    'research', 'study', 'university', 'official',
    'গবেষণা', 'বিশ্ববিদ্যালয়', 'সরকারি'
  ];
  const hasShortUrl = /bit\.ly|tinyurl|goo\.gl/i.test(text);
  const hasReliableSource = /\.gov|\.edu|who\.int|bbc\.com|reuters\.com/i.test(text);
  
  let suspicionScore = 0;
  let reliabilityScore = 0;
  
  fakeNewsIndicators.forEach(indicator => { if (lowerText.includes(indicator)) suspicionScore += 2; });
  reliableIndicators.forEach(indicator => { if (lowerText.includes(indicator)) reliabilityScore += 2; });
  
  if (hasShortUrl) suspicionScore += 3;
  if (hasReliableSource) reliabilityScore += 3;
  
  const wordCount = text.split(/\s+/).length;
  const lineCount = text.split('\n').length;
  if (wordCount > 100 && lineCount > 5) suspicionScore += 1;
  if (text.includes('http') || text.includes('www')) suspicionScore += 1;
  
  let verdict, confidence, isFake;
  if (suspicionScore > reliabilityScore + 3) {
    verdict = 'false'; isFake = true; confidence = Math.min(85, 60 + suspicionScore * 5);
  } else if (reliabilityScore > suspicionScore + 2) {
    verdict = 'true'; isFake = false; confidence = Math.min(80, 55 + reliabilityScore * 5);
  } else {
    verdict = 'uncertain'; isFake = false; confidence = 50;
  }
  
  return { verdict, isFake, isVerified: !isFake && verdict === 'true', confidence, suspicionScore, reliabilityScore, indicators: { hasShortUrl, hasReliableSource, wordCount, lineCount } };
}

// --- YOUR ORIGINAL LOGIC: generateExplanation (UNCHANGED) ---
function generateExplanation(analysis, text) {
  const explanations = [];
  if (analysis.verdict === 'false') {
    explanations.push('এই বার্তায় মিথ্যা তথ্যের বৈশিষ্ট্য পাওয়া গেছে।');
    if (analysis.indicators.hasShortUrl) explanations.push('সংক্ষিপ্ত URL ব্যবহৃত হয়েছে যা সন্দেহজনক হতে পারে।');
    if (analysis.suspicionScore > 5) explanations.push('বার্তায় একাধিক সতর্কতা সংকেত পাওয়া গেছে।');
    explanations.push('অনুগ্রহ করে বিশ্বস্ত সূত্র থেকে যাচাই করুন।');
  } else if (analysis.verdict === 'true') {
    explanations.push('এই বার্তায় বিশ্বস্ত তথ্যের বৈশিষ্ট্য রয়েছে।');
    if (analysis.indicators.hasReliableSource) explanations.push('বিশ্বস্ত উৎস থেকে তথ্য পাওয়া গেছে।');
  } else {
    explanations.push('এই বার্তার সত্যতা নিশ্চিত করা যায়নি। আরও যাচাই প্রয়োজন।');
  }
  return explanations.join(' ');
}

// --- YOUR ORIGINAL LOGIC: checkExistingClaims ---
async function checkExistingClaims(text) {
  try {
    const textPreview = text.substring(0, 50).toLowerCase();
    const reportsRef = collection(db, 'reports');
    // সব ভেরিফাইড স্ট্যাটাস চেক করা হচ্ছে
    const q = query(reportsRef, where('status', 'in', ['verified', 'false', 'misleading', 'reviewed']), limit(5));
    const snapshot = await getDocs(q);
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const claimPreview = data.claim?.substring(0, 50).toLowerCase() || '';
      if (claimPreview && textPreview.includes(claimPreview)) {
        return { found: true, verdict: data.status, explanation: data.verdict || 'পূর্বে যাচাই করা হয়েছে।', reviewedBy: data.reviewedBy };
      }
    }
    return { found: false };
  } catch (error) { return { found: false }; }
}

// --- MAIN POST HANDLER ---
export async function POST(request) {
  try {
    const body = await request.json();
    const { text, source, url } = body;
    
    if (!text || text.trim().length < 5) {
      return NextResponse.json({ error: 'Text is too short' }, { status: 400, headers: corsHeaders });
    }
    
    // 1. STEP 1: Firestore Exact Check
    const existingClaim = await checkExistingClaims(text);
    if (existingClaim.found) {
      return NextResponse.json({
        success: true,
        verdict: existingClaim.verdict,
        explanation: existingClaim.explanation,
        isFake: existingClaim.verdict === 'false',
        isVerified: existingClaim.verdict === 'verified' || existingClaim.verdict === 'true',
        source: 'database_exact',
        cached: true
      }, { headers: corsHeaders });
    }

    // 2. STEP 2: Semantic AI Match
    const semanticMatch = await checkSemanticClaims(text);
    if (semanticMatch.found) {
      return NextResponse.json({
        success: true,
        verdict: semanticMatch.verdict,
        explanation: semanticMatch.explanation,
        isFake: semanticMatch.verdict === 'false',
        isVerified: semanticMatch.verdict === 'verified' || semanticMatch.verdict === 'true',
        source: 'database_semantic',
        confidence: Math.round(semanticMatch.similarity * 100)
      }, { headers: corsHeaders });
    }
    
    // 3. STEP 3: Fallback AI Scoring Analysis
    const analysis = analyzeContent(text);
    const explanation = generateExplanation(analysis, text);
    
    // Save new checks to Firestore
    try {
      await addDoc(collection(db, 'fact-checks'), {
        text: text.substring(0, 500),
        verdict: analysis.verdict,
        confidence: analysis.confidence,
        checkedAt: serverTimestamp(),
        status: 'auto-checked'
      });
    } catch (e) {}
    
    return NextResponse.json({
      success: true,
      verdict: analysis.verdict,
      isFake: analysis.isFake,
      isVerified: analysis.isVerified,
      confidence: analysis.confidence,
      explanation: explanation,
      sources: getSources(analysis.verdict),
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Fact-check error:', error);
    return NextResponse.json({ error: 'Failed to process' }, { status: 500, headers: corsHeaders });
  }
}

// --- REMAINING HELPERS ---
function getSources(verdict) {
  const sources = {
    'false': ['সতর্কতা: এই ধরনের বার্তা প্রায়ই মিথ্যা হয়', 'বিশ্বস্ত সংবাদ সূত্র পরীক্ষা করুন'],
    'true': ['বিশ্বস্ত উৎস থেকে নিশ্চিত', 'যাচাইকৃত তথ্য'],
    'uncertain': ['আরও তথ্য প্রয়োজন', 'স্বাধীন যাচাই করুন']
  };
  return sources[verdict] || sources['uncertain'];
}

export async function GET(request) {
  return NextResponse.json({ status: 'Fact-check API is running', version: '1.2.6' }, { headers: corsHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}