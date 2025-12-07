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
  Layers, AlertOctagon, FileText
} from 'lucide-react';

export default function AdminReportsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // --- LOGIC SECTION ---

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching reports from Firestore...');
      const querySnapshot = await getDocs(collection(db, 'reports'));
      const reportsData = [];
      
      querySnapshot.forEach((docSnap) => {
        reportsData.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });
      
      // Sort by newest first
      reportsData.sort((a, b) => {
        const dateA = a.submittedAt?.toDate?.() || new Date(0);
        const dateB = b.submittedAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      
      console.log('Total reports found:', reportsData.length);
      setReports(reportsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('✅ Logged in successfully');
    } else {
      toast.error('❌ Wrong password');
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
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const deleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await deleteDoc(doc(db, 'reports', reportId));
      toast.success('Report deleted');
      fetchReports();
    } catch (error) {
      toast.error('Failed to delete');
      console.error(error);
    }
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.status === filter);

  const statusCounts = {
    all: reports.length,
    pending: reports.filter(r => !r.status || r.status === 'pending').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    verified: reports.filter(r => r.status === 'verified').length,
    false: reports.filter(r => r.status === 'false').length,
    misleading: reports.filter(r => r.status === 'misleading').length,
  };

  // --- UI SECTION ---

  const BackgroundLayers = () => (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-purple-50 z-0"></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-red-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{
        backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}></div>
    </>
  );

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white flex flex-col">
        <BackgroundLayers />
        <div className="relative z-10"><Header /></div>
        
        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 rounded-2xl p-8 animate-slide-up">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg transform rotate-3">
                <Shield className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reports Dashboard
              </h2>
              <p className="text-sm text-gray-600">
                Admin access required to view user reports
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
                    placeholder="Enter Password"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                Login
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen relative overflow-hidden bg-white pb-24">
      <BackgroundLayers />
      
      <div className="relative z-10">
        <Header />
      
        <main className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Link 
                href="/admin" 
                className="p-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reports Management</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                   <FileText className="w-4 h-4" /> Total Reports: <span className="font-bold text-gray-900">{filteredReports.length}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchReports}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-semibold text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-sm border border-gray-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { id: 'all', label: 'All', icon: Layers },
              { id: 'pending', label: 'Pending', icon: Clock },
              { id: 'reviewing', label: 'Reviewing', icon: Eye },
              { id: 'verified', label: 'Verified', icon: CheckCircle },
              { id: 'false', label: 'False', icon: XCircle },
              { id: 'misleading', label: 'Misleading', icon: AlertTriangle }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = filter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-red-600 text-white border-red-600 shadow-md transform scale-105'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {statusCounts[item.id]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-700 animate-slide-up">
              <AlertOctagon className="w-5 h-5" />
              <p className="font-semibold">Error: {error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur rounded-2xl border border-dashed border-gray-300">
              <RefreshCw className="w-10 h-10 text-gray-300 animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Syncing with Firestore...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            // Empty State
            <div className="text-center py-20 bg-white/50 backdrop-blur rounded-2xl border border-dashed border-gray-300 animate-fade-in">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-600 mb-1">No reports found</h3>
              <p className="text-gray-400 text-sm mb-4">
                {filter === 'all' ? 'Database is empty' : `No reports with "${filter}" status`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="px-6 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : (
            // Reports List
            <div className="space-y-4 animate-slide-up">
              {filteredReports.map((report) => (
                <div 
                  key={report.id} 
                  className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    
                    {/* Content Section */}
                    <div className="flex-1 space-y-3 w-full">
                      {/* Meta Header */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                          (!report.status || report.status === 'pending') ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                          report.status === 'verified' ? 'bg-green-100 text-green-800' :
                          report.status === 'false' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {(!report.status || report.status === 'pending') && <Clock className="w-3 h-3" />}
                          {report.status === 'verified' && <CheckCircle className="w-3 h-3" />}
                          {report.status === 'false' && <XCircle className="w-3 h-3" />}
                          {(report.status || 'pending')}
                        </span>
                        
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                          {/* ✅ FIX IS HERE: String() wrapper added */}
                          <Shield className="w-3 h-3" /> ID: {String(report.id).slice(0, 8)}
                        </span>
                        
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> 
                          {report.submittedAt?.toDate?.()?.toLocaleString('en-US') || 'Unknown date'}
                        </span>
                      </div>

                      {/* Main Content */}
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-snug mb-2">
                          {report.claim}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                          {report.category && (
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">
                              📂 {report.category}
                            </span>
                          )}
                          {report.urgency && (
                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                              report.urgency === 'High' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              ⚠️ {report.urgency}
                            </span>
                          )}
                          {report.source && (
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">
                              📱 {report.source}
                            </span>
                          )}
                        </div>

                        {report.sourceUrl && (
                          <a 
                            href={report.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
                          >
                            <ExternalLink className="w-3 h-3" /> 
                            Open Source Link
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Controls */}
                    <div className="flex flex-col gap-3 w-full lg:w-auto min-w-[220px] border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Update Status</label>
                      <div className="relative">
                        <select
                          value={report.status || 'pending'}
                          onChange={(e) => updateStatus(report.id, e.target.value)}
                          className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:bg-white focus:border-red-500 focus:outline-none transition-all cursor-pointer shadow-sm hover:border-gray-300"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="reviewing">👀 Reviewing</option>
                          <option value="verified">✅ Verified True</option>
                          <option value="false">❌ Verified False</option>
                          <option value="misleading">⚠️ Misleading</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          ▼
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all group-hover:border-red-300 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Report
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}