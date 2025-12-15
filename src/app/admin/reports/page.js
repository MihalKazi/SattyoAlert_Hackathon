'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
// ✅ FIXED: Changed import from @/lib/syncEngine to the Server Action
import { syncToVectorAction } from '@/app/actions/sync'; 
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import AddReportForm from '@/components/admin/AddReportForm'; 
import { 
  Shield, RefreshCw, Trash2, Link as LinkIcon, LogOut, Loader2,
  CheckCircle, XCircle, AlertTriangle, Clock, Save, ExternalLink, Search
} from 'lucide-react';

export default function AdminReportsPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reports, setReports] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null); 
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
      const reportsData = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return { 
          id: docSnap.id, 
          ...data,
          tempSourceUrl: data.verifiedSourceUrl || '', 
          tempVerdict: data.verdict || '',
          tempClaim: data.claim || '',
        };
      });
      reportsData.sort((a, b) => (b.submittedAt?.toDate?.() || 0) - (a.submittedAt?.toDate?.() || 0));
      setReports(reportsData);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Access Granted');
    } catch (error) {
      toast.error('Invalid Credentials');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out');
  };

  const handleInputChange = (id, field, value) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const updateStatus = async (report) => {
    if ((report.status === 'verified' || report.status === 'false') && !report.tempSourceUrl) {
      toast.error("Verified Source Link is required!");
      return;
    }
    if (!report.tempVerdict || !report.tempClaim) {
      toast.error("Claim and Verdict cannot be empty!");
      return;
    }

    setIsUpdating(report.id);
    const tid = toast.loading("Updating database & AI search...");

    try {
      // 1. Update Firestore
      const updateData = {
        claim: report.tempClaim,
        status: report.status,
        verifiedSourceUrl: report.tempSourceUrl,
        verdict: report.tempVerdict,
        reviewedAt: new Date(),
        reviewedBy: user.email
      };

      await updateDoc(doc(db, 'reports', String(report.id)), updateData);

      // 2. ✅ FIXED: Use the Server Action instead of the engine library
      if (report.status !== 'pending') {
        await syncToVectorAction(report.id, updateData.claim, report.status, report.verdict);
      }
      
      toast.success(`Report Verified as: ${report.status}`, { id: tid });
      fetchReports();
    } catch (error) {
      console.error(error);
      toast.error('Update failed', { id: tid });
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteReport = async (reportId) => {
    if (!confirm('Permanently delete this report?')) return;
    try {
      await deleteDoc(doc(db, 'reports', reportId));
      setReports(prev => prev.filter(r => r.id !== reportId));
      toast.success('Deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  // ... (Login UI remains exactly the same)
  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-red-600" /></div>;
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl max-w-md w-full border border-white">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600 p-4 rounded-2xl shadow-lg rotate-3"><Shield className="text-white w-10 h-10" /></div>
          </div>
          <h2 className="text-3xl font-black text-center mb-2 text-slate-900">Admin Portal</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 font-bold" placeholder="Admin Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 font-bold" placeholder="Password" required />
            <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black hover:bg-red-600 transition-all shadow-xl active:scale-95">LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  // ... (Dashboard UI remains exactly the same)
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans antialiased">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Verification Dashboard</h2>
            <p className="text-slate-500 font-bold mt-1">Review user submissions and update the truth database.</p>
          </div>
          <div className="flex gap-3">
            <AddReportForm userEmail={user.email} onReportAdded={fetchReports} />
            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-red-50 hover:text-red-600 transition-all shadow-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {['all', 'pending', 'verified', 'false', 'misleading'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all capitalize whitespace-nowrap shadow-sm border ${filter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-6">
          {dataLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <RefreshCw className="animate-spin w-10 h-10 mb-4" />
               <p className="font-bold">Syncing with Cloud...</p>
            </div>
          ) : filteredReports.map((report) => (
            <div key={report.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                     <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${report.status === 'false' ? 'bg-red-100 text-red-600' : report.status === 'verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                       {report.status || 'Pending'}
                     </span>
                     <span className="text-[10px] font-mono text-slate-300">UID: {report.id}</span>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">The Claim (Edit if needed)</label>
                      <input type="text" value={report.tempClaim} onChange={(e) => handleInputChange(report.id, 'tempClaim', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-lg text-slate-800 focus:ring-2 focus:ring-red-500" placeholder="Enter the claim text..." />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                        <LinkIcon className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-600 truncate">Original Source: {report.sourceUrl || 'None'}</span>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Official Verdict / Explanation</label>
                      <textarea value={report.tempVerdict} onChange={(e) => handleInputChange(report.id, 'tempVerdict', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-medium text-slate-700 focus:ring-2 focus:ring-red-500 min-h-[120px] leading-relaxed" placeholder="Explain why this is true or false..." />
                    </div>
                  </div>
                </div>

                <div className="lg:w-80 flex flex-col gap-6 lg:border-l lg:pl-10 border-slate-100">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Set Official Status</label>
                    <div className="grid grid-cols-1 gap-2">
                       {['pending', 'verified', 'false', 'misleading'].map((s) => (
                         <button key={s} onClick={() => setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: s } : r))} className={`p-3 rounded-xl text-xs font-black uppercase tracking-tighter text-left border-2 transition-all ${report.status === s ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}>
                           {s === 'pending' ? '⏳ ' : s === 'verified' ? '✅ ' : s === 'false' ? '❌ ' : '⚠️ '} {s}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Verified Evidence Link</label>
                    <input type="url" placeholder="https://official-news.com/..." value={report.tempSourceUrl} onChange={(e) => handleInputChange(report.id, 'tempSourceUrl', e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-xl text-xs font-bold text-blue-600 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button onClick={() => updateStatus(report)} disabled={isUpdating === report.id} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm flex justify-center items-center gap-3 hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:bg-slate-300">
                    {isUpdating === report.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    PUBLISH TRUTH
                  </button>
                  <button onClick={() => deleteReport(report.id)} className="flex items-center justify-center gap-2 text-xs font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Remove Report
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