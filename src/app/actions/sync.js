"use server";

import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

const supabase = createClient(
  process.env.SUPABASE_URL || "https://rziehpqtglubqwzrctca.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6aWVocHF0Z2x1YnF3enJjdGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTc1NTIyNSwiZXhwIjoyMDgxMzMxMjI1fQ.7ZvW2mNHScwFgmGEJ02C2XudZXoC6wVU7rvgbFZfuWM"
);

export async function syncToVectorAction(firebaseId, claimText, status, verdictText) {
  try {
    const workerPath = path.join(process.cwd(), 'src', 'lib', 'ai-worker.js');
    const { stdout, stderr } = await execPromise(`node "${workerPath}" "${claimText.replace(/"/g, '\\"')}"`);

    if (stderr && !stdout) throw new Error(stderr);
    const vector = JSON.parse(stdout);

    // ✅ FIXED: We add { onConflict: 'firebase_id' }
    // This tells Supabase: "If firebase_id exists, just update the row."
    const { error: dbError } = await supabase
      .from('report_vectors')
      .upsert(
        {
          firebase_id: firebaseId,
          content: claimText,
          embedding: vector,
          status: status,
          verdict_text: verdictText
        },
        { onConflict: 'firebase_id' } 
      );

    if (dbError) throw dbError;
    return { success: true };
  } catch (err) {
    console.error("❌ Sync Action Error:", err.message);
    return { success: false, error: err.message };
  }
}