'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import AddReportForm from '@/components/admin/AddReportForm'; // <-- NEW IMPORT
import { 
  Shield, RefreshCw, Trash2, Link as LinkIcon, LogOut, Loader2,
  CheckCircle, XCircle, AlertTriangle, Clock, Save
} from 'lucide-react';

export default function AdminReportsPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reports, setReports] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) fetchReports();
    });
    return () => unsubscribe();
  }, []);

  const fetchReports = async () => {
    setDataLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'reports'));
      const reportsData = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        reportsData.push({ 
          id: docSnap.id, 
          ...data,
          // Create local temp fields for editing
          tempSourceUrl: data.verifiedSourceUrl || '', 
          tempVerdict: data.verdict || '',
          tempClaim: data.claim || '', // Temporary state for editing the claim
        });
      });
      reportsData.sort((a, b) => (b.submittedAt?.toDate?.() || 0) - (a.submittedAt?.toDate?.() || 0));
      setReports(reportsData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome Back');
    } catch (error) {
      toast.error('Invalid Credentials');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out');
  };

  // Handler for the proof link input
  const handleLinkChange = (id, value) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, tempSourceUrl: value } : r));
  };

  // Handler for the verdict input
  const handleVerdictChange = (id, value) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, tempVerdict: value } : r));
  };

  // Handler for the claim input
  const handleClaimChange = (id, value) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, tempClaim: value } : r));
  };


  const updateStatus = async (report) => {
    try {
      // Validation checks...
      if ((report.status === 'verified' || report.status === 'false') && !report.tempSourceUrl) {
        toast.error("Please add a Verified Source Link first!");
        return;
      }
      
      if ((report.status === 'verified' || report.status === 'false' || report.status === 'misleading') && !report.tempVerdict) {
         toast.error("Please add a Detailed Verdict/Explanation!");
         return;
      }
      
      if (!report.tempClaim) {
         toast.error("The claim/title cannot be empty!");
         return;
      }

      await updateDoc(doc(db, 'reports', String(report.id)), {
        claim: report.tempClaim, // <-- SAVE EDITED CLAIM
        status: report.status,
        verifiedSourceUrl: report.tempSourceUrl,
        verdict: report.tempVerdict,
        reviewedAt: new Date(),
        reviewedBy: user.email
      });
      
      toast.success(`Updated: ${report.status}`);
      fetchReports(); // <-- REFRESH LIST AFTER UPDATE
    } catch (error) {
      console.error(error);
      toast.error('Update failed');
    }
  };

  const changeLocalStatus = (id, newStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const deleteReport = async (reportId) => {
    if (!confirm('Permanently delete this report?')) return;
    try {
      setReports(prev => prev.filter(r => r.id !== reportId));
      await deleteDoc(doc(db, 'reports', reportId));
      toast.success('Deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="Password" required />
            <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-xl font-bold">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Verification Dashboard</h2>
          <div className="flex gap-4 items-center">
            <AddReportForm userEmail={user.email} onReportAdded={fetchReports} /> {/* <-- INTEGRATED FORM */}
            <button onClick={handleLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold">Logout</button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'verified', 'false', 'misleading'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600'}`}>{f}</button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Info Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${String(report.status) === 'false' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>{report.status || 'Pending'}</span>
                     <span className="text-xs text-gray-400">ID: {String(report.id ?? '').slice(0, 6)}</span>
                  </div>
                  
                  {/* Claim/Title Input */}
                  <div className="mb-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Claim/Title</label>
                    <input
                      type="text"
                      placeholder="The Claim in Bengali" 
                      value={report.tempClaim}
                      onChange={(e) => handleClaimChange(report.id, e.target.value)}
                      className="w-full p-2 border rounded-lg text-base font-bold font-bengali"
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded break-all mb-4">
                    <strong>User Report Link:</strong> {report.sourceUrl || 'N/A'}
                  </div>

                  {/* Verdict Input */}
                  <div className="mb-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Detailed Verdict/Explanation (Bangla)</label>
                    <textarea
                      placeholder="এই দাবিটি..." 
                      value={report.tempVerdict}
                      onChange={(e) => handleVerdictChange(report.id, e.target.value)}
                      className="w-full p-2 border rounded-lg text-sm min-h-[100px] font-bengali"
                    />
                  </div>
                  
                </div>

                {/* Action Side */}
                <div className="lg:w-80 flex flex-col gap-3 border-l pl-6">
                  
                  {/* 2. Status Dropdown */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Set Verdict</label>
                    <select 
                      value={report.status || 'pending'} 
                      onChange={(e) => changeLocalStatus(report.id, e.target.value)}
                      className="w-full p-2 border rounded-lg text-sm font-bold"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="verified">✅ Verified True</option>
                      <option value="false">❌ Verified False</option>
                      <option value="misleading">⚠️ Misleading</option>
                    </select>
                  </div>

                  {/* 3. Truth Link Input */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Verified Proof Link (Required)</label>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-gray-400" />
                      <input 
                        type="url" 
                        placeholder="https://thedailystar.net/..." 
                        value={report.tempSourceUrl}
                        onChange={(e) => handleLinkChange(report.id, e.target.value)}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* 4. Save Button */}
                  <button 
                    onClick={() => updateStatus(report)}
                    className="w-full py-2 bg-green-600 text-white rounded-lg font-bold text-sm flex justify-center items-center gap-2 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" /> Save Verification
                  </button>
                  
                  <button onClick={() => deleteReport(report.id)} className="text-xs text-red-500 underline text-center">Delete Report</button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}