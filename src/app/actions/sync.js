"use server";

import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

// ✅ SAFE: Only uses environment variables
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function syncToVectorAction(firebaseId, claimText, status, verdictText) {
  try {
    const workerPath = path.join(process.cwd(), 'src', 'lib', 'ai-worker.js');
    
    // Execute the AI Worker
    const { stdout, stderr } = await execPromise(`node "${workerPath}" "${claimText.replace(/"/g, '\\"')}"`);

    if (stderr && !stdout) throw new Error(stderr);

    const vector = JSON.parse(stdout);

    const { error: dbError } = await supabase.from('report_vectors').upsert({
      firebase_id: firebaseId,
      content: claimText,
      embedding: vector,
      status: status,
      verdict_text: verdictText
    }, { onConflict: 'firebase_id' });

    if (dbError) throw dbError;
    return { success: true };
  } catch (err) {
    console.error("❌ Sync Action Error:", err.message);
    return { success: false, error: err.message };
  }
}
