import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL || "https://rziehpqtglubqwzrctca.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
);

export async function syncToVectorDB(firebaseId, claimText, status, verdictText) {
  return new Promise((resolve) => {
    // 1. Point to the external worker script
    const workerPath = path.join(process.cwd(), 'src/lib/ai-worker.js');
    
    // 2. Run the AI task in a separate process
    exec(`node ${workerPath} "${claimText.replace(/"/g, '\\"')}"`, async (error, stdout, stderr) => {
      if (error || stderr) {
        console.error("❌ AI Worker Error:", stderr || error.message);
        return resolve({ success: false, error: "AI Processing Failed" });
      }

      try {
        const vector = JSON.parse(stdout);

        // 3. Save to Supabase
        const { error: dbError } = await supabase.from('report_vectors').upsert({
          firebase_id: firebaseId,
          content: claimText,
          embedding: vector,
          status: status,
          verdict_text: verdictText
        });

        if (dbError) throw dbError;
        resolve({ success: true });
      } catch (parseErr) {
        resolve({ success: false, error: "Data Sync Failed" });
      }
    });
  });
}