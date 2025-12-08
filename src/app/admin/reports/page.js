'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { 
  Shield, Lock, ArrowLeft, RefreshCw, LogOut, Filter, Clock, Eye, 
  CheckCircle, XCircle, AlertTriangle, Trash2, ExternalLink, Calendar, 
  Layers, AlertOctagon, FileText, Sparkles, ArrowRight, BrainCircuit
} from 'lucide-react';

export default function AdminReportsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  // AI State
  const [analyzingId, setAnalyzingId] = useState(null);
  const [aiInsights, setAiInsights] = useState({});

  // --- LOGIC SECTION ---

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'reports'));
      const reportsData = [];
      querySnapshot.forEach((docSnap) => {
        reportsData.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort by newest
      reportsData.sort((a, b) => (b.submittedAt?.toDate?.() || 0) - (a.submittedAt?.toDate?.() || 0));
      setReports(reportsData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchReports();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Logged in');
    } else {
      toast.error('Wrong password');
    }
  };

  const updateStatus = async (reportId, newStatus) => {
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status: newStatus,
        reviewedAt: new Date(),
      });
      toast.success(`Status updated to ${newStatus}`);
      fetchReports(); 
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const deleteReport = async (reportId) => {
    if (!confirm('Delete this report?')) return;
    try {
      await deleteDoc(doc(db, 'reports', reportId));
      toast.success('Deleted');
      fetchReports();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  // --- AI ANALYSIS FUNCTION (UPDATED) ---
  const analyzeWithAI = async (report) => {
    setAnalyzingId(report.id);
    
    try {
      console.log('📤 Sending to AI:', { 
        claim: report.claim, 
        sourceUrl: report.sourceUrl 
      });
      
      const res = await fetch('/api/ai-check', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          claim: report.claim, 
          sourceUrl: report.sourceUrl || '' 
        }),
      });
      
      const data = await res.json();
      console.log('📥 AI Response:', data);

      // Check if response is OK
      if (!res.ok) {
        throw new Error(data.details || data.error || 'AI analysis failed');
      }

      // Even if status is 500, check if we got fallback data
      if (data.verdict && data.explanation) {
        setAiInsights(prev => ({ ...prev, [report.id]: data }));
        
        if (data.error) {
          // Show warning but still display the fallback result
          toast.error(`AI had issues but provided fallback analysis`);
        } else {
          toast.success('✨ AI Analysis Complete!');
        }
      } else {
        throw new Error('Invalid AI response format');
      }
      
    } catch (error) {
      console.error('❌ AI Analysis Error:', error);
      toast.error(`AI Failed: ${error.message}`);
    } finally {
      setAnalyzingId(null);
    }
  };

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  // --- UI SECTION ---

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-xl mx-auto flex items-center justify-center text-white mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Enter Password"
            />
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Reports Dashboard</h2>
          <button onClick={fetchReports} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl hover:bg-gray-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'verified', 'false', 'misleading'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      report.status === 'false' ? 'bg-red-100 text-red-800' :
                      report.status === 'verified' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status || 'pending'}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">ID: {String(report.id).slice(0, 8)}</span>
                    <span className="text-xs text-gray-400">
                      {report.submittedAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{report.claim}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {report.category && <span className="bg-gray-100 px-2 py-1 rounded text-xs">📂 {report.category}</span>}
                    {report.urgency && <span className="bg-gray-100 px-2 py-1 rounded text-xs">⚠️ {report.urgency}</span>}
                    {report.sourceUrl && (
                      <a href={report.sourceUrl} target="_blank" className="text-blue-600 text-xs hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Source
                      </a>
                    )}
                  </div>

                  {/* --- AI SECTION START --- */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {!aiInsights[report.id] ? (
                      <button
                        onClick={() => analyzeWithAI(report)}
                        disabled={analyzingId === report.id}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {analyzingId === report.id ? (
                          <><span className="animate-spin">✨</span> Analyzing...</>
                        ) : (
                          <><Sparkles className="w-3 h-3" /> Analyze with AI</>
                        )}
                      </button>
                    ) : (
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                          <BrainCircuit className="w-16 h-16 text-purple-600" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-purple-700 uppercase">
                              <Sparkles className="w-3 h-3" /> AI Suggestion
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                              aiInsights[report.id].verdict === 'False' ? 'bg-red-50 text-red-700 border-red-200' : 
                              aiInsights[report.id].verdict === 'True' ? 'bg-green-50 text-green-700 border-green-200' :
                              aiInsights[report.id].verdict === 'Misleading' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {aiInsights[report.id].verdict}
                              {aiInsights[report.id].confidence > 0 && 
                                ` (${aiInsights[report.id].confidence}%)`
                              }
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">
                            {aiInsights[report.id].explanation}
                          </p>
                          
                          {/* Risk Warning */}
                          {aiInsights[report.id].riskLevel === 'High' && (
                            <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5 flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0" />
                              <span className="text-xs text-red-700 font-medium">
                                High Risk: May incite violence or panic
                              </span>
                            </div>
                          )}
                          
                          {/* Quick Apply */}
                          <div className="mt-3 flex gap-2">
                            <button 
                              onClick={() => {
                                const verdictMap = {
                                  'True': 'verified',
                                  'False': 'false',
                                  'Misleading': 'misleading',
                                  'Unverified': 'pending'
                                };
                                const status = verdictMap[aiInsights[report.id].verdict] || 'pending';
                                updateStatus(report.id, status);
                              }}
                              className="px-3 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-50 flex items-center gap-1 transition-colors"
                            >
                              Apply Verdict <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                setAiInsights(prev => {
                                  const newInsights = { ...prev };
                                  delete newInsights[report.id];
                                  return newInsights;
                                });
                                toast.success('AI suggestion cleared');
                              }}
                              className="px-3 py-1.5 text-gray-600 text-xs hover:text-gray-800"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* --- AI SECTION END --- */}

                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[200px] border-t lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0">
                  <label className="text-xs font-bold text-gray-400 uppercase">Manual Action</label>
                  <select
                    value={report.status || 'pending'}
                    onChange={(e) => updateStatus(report.id, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm font-semibold outline-none focus:border-red-500"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="verified">✅ Verified True</option>
                    <option value="false">❌ Verified False</option>
                    <option value="misleading">⚠️ Misleading</option>
                  </select>
                  <button onClick={() => deleteReport(report.id)} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
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