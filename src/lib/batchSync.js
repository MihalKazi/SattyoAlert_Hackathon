import { db } from './firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
// ✅ Import from the actions folder using a relative path
import { syncToVectorAction } from '../app/actions/sync'; 

export async function runBulkSync() {
  let successCount = 0;
  let failCount = 0;

  try {
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, where('status', 'in', ['verified', 'false', 'misleading']));
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const result = await syncToVectorAction(
        doc.id, 
        data.claim, 
        data.status, 
        data.verdict
      );

      if (result.success) successCount++;
      else failCount++;
    }

    return { 
      message: `Sync Complete: ${successCount} successful, ${failCount} failed.`,
      success: true 
    };
  } catch (error) {
    return { error: error.message, success: false };
  }
}