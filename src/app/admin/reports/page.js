'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function AdminReportsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // Filter state

  // Fetch reports manually
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching reports from Firestore...');
      const querySnapshot = await getDocs(collection(db, 'reports'));
      const reportsData = [];
      
      querySnapshot.forEach((docSnap) => {
        console.log('Found report:', docSnap.id, docSnap.data());
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
      toast.success('✅ Logged in');
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
      fetchReports(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const deleteReport = async (reportId) => {
    if (!confirm('Delete this report?')) return;
    
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'reports', reportId));
      toast.success('Report deleted');
      fetchReports();
    } catch (error) {
      toast.error('Failed to delete');
      console.error(error);
    }
  };

  // Filter reports based on selected filter
  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.status === filter);

  // Count reports by status
  const statusCounts = {
    all: reports.length,
    pending: reports.filter(r => !r.status || r.status === 'pending').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    verified: reports.filter(r => r.status === 'verified').length,
    false: reports.filter(r => r.status === 'false').length,
    misleading: reports.filter(r => r.status === 'misleading').length,
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
        <Header />
        
        <main className="max-w-md mx-auto px-4 py-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reports Dashboard
              </h2>
              <p className="text-sm text-gray-600">
                Admin access required
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
                  placeholder="Password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700"
              >
                Login
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link 
                href="/admin" 
                className="text-sm text-blue-600 hover:underline mb-2 inline-block"
              >
                ← Back to Admin Panel
              </Link>
              <h2 className="text-3xl font-bold text-gray-900">
                📋 Extension Reports ({filteredReports.length})
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', 'pending', 'reviewing', 'verified', 'false', 'misleading'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  filter === status
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? '🗂️ All' :
                 status === 'pending' ? '⏳ Pending' :
                 status === 'reviewing' ? '👀 Reviewing' :
                 status === 'verified' ? '✅ Verified' :
                 status === 'false' ? '❌ False' :
                 '⚠️ Misleading'}
                <span className="ml-1 text-xs opacity-75">({statusCounts[status]})</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-600 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold">Error: {error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-500">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500">
                {filter === 'all' ? 'No reports found' : `No ${filter} reports`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  View All Reports
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-red-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          (!report.status || report.status === 'pending') ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                          report.status === 'verified' ? 'bg-green-100 text-green-800' :
                          report.status === 'false' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {(report.status || 'pending').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {report.id.slice(0, 8)}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">{report.claim}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                        <span className="bg-gray-100 px-2 py-1 rounded">📂 {report.category}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">⚠️ {report.urgency}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">📱 {report.source}</span>
                      </div>
                      {report.sourceUrl && (
                        <a 
                          href={report.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline block mb-2 truncate"
                        >
                          🔗 {report.sourceUrl}
                        </a>
                      )}
                      <div className="text-xs text-gray-500">
                        📅 {report.submittedAt?.toDate?.()?.toLocaleString('en-US') || 'Unknown date'}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <select
                        value={report.status || 'pending'}
                        onChange={(e) => updateStatus(report.id, e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold focus:border-red-600 focus:outline-none"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="reviewing">👀 Reviewing</option>
                        <option value="verified">✅ Verified</option>
                        <option value="false">❌ False</option>
                        <option value="misleading">⚠️ Misleading</option>
                      </select>
                      
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}