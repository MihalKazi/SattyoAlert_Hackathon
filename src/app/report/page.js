'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { syncToVectorAction } from '@/app/actions/sync'; // ✅ Using Server Action
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import AddReportForm from '@/components/admin/AddReportForm';
import { 
  Shield, RefreshCw, Trash2, Link as LinkIcon, LogOut, Loader2, Save
} from 'lucide-react';

export default function AdminReportsPage() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchReports();
    });
  }, []);

  const fetchReports = async () => {
    setDataLoading(true);
    const querySnapshot = await getDocs(collection(db, 'reports'));
    const reportsData = querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
      tempSourceUrl: docSnap.data().verifiedSourceUrl || '',
      tempVerdict: docSnap.data().verdict || '',
      tempClaim: docSnap.data().claim || '',
    }));
    setReports(reportsData);
    setDataLoading(false);
  };

  const updateStatus = async (report) => {
    setIsUpdating(report.id);
    const tid = toast.loading("Saving to Firebase & AI Search...");
    try {
      const updateData = {
        claim: report.tempClaim,
        status: report.status,
        verifiedSourceUrl: report.tempSourceUrl,
        verdict: report.tempVerdict,
        reviewedAt: new Date(),
        reviewedBy: user.email
      };

      // 1. Update Firestore
      await updateDoc(doc(db, 'reports', report.id), updateData);

      // 2. Update AI Search Index
      if (report.status !== 'pending') {
        await syncToVectorAction(report.id, report.tempClaim, report.status, report.tempVerdict);
      }
      
      toast.success("Verification Published", { id: tid });
      fetchReports();
    } catch (error) {
      toast.error("Error updating", { id: tid });
    } finally {
      setIsUpdating(null);
    }
  };

  const changeLocalField = (id, field, value) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  if (!user) return <div className="p-20 text-center">Please Login to Admin Panel</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-8">
          <h2 className="text-3xl font-bold">Verification Dashboard</h2>
          <AddReportForm userEmail={user.email} onReportAdded={fetchReports} />
        </div>

        <div className="grid gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <input 
                    className="w-full p-2 mb-2 font-bold border rounded"
                    value={report.tempClaim}
                    onChange={(e) => changeLocalField(report.id, 'tempClaim', e.target.value)}
                  />
                  <textarea 
                    className="w-full p-2 h-24 border rounded text-sm"
                    value={report.tempVerdict}
                    onChange={(e) => changeLocalField(report.id, 'tempVerdict', e.target.value)}
                    placeholder="Explanation..."
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <select 
                    value={report.status} 
                    onChange={(e) => changeLocalField(report.id, 'status', e.target.value)}
                    className="p-2 border rounded font-bold"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="verified">✅ True</option>
                    <option value="false">❌ False</option>
                  </select>
                  <input 
                    className="p-2 border rounded text-xs"
                    value={report.tempSourceUrl}
                    onChange={(e) => changeLocalField(report.id, 'tempSourceUrl', e.target.value)}
                    placeholder="Proof Link..."
                  />
                  <button 
                    onClick={() => updateStatus(report)}
                    disabled={isUpdating === report.id}
                    className="bg-green-600 text-white p-2 rounded font-bold flex items-center justify-center gap-2"
                  >
                    {isUpdating === report.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Save & Sync
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}