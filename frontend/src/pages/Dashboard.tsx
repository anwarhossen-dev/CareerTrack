import React, { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../api/applications.api';
import type { DashboardData } from '../types';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Plus, AlertCircle, Search, SlidersHorizontal, FileText
} from 'lucide-react';

interface DashboardProps {
  setView: (view: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  onAddApplicationClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, onAddApplicationClick }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dashboard search filter state
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDashboardStats();
      setData(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner fullHeight label="Loading your dashboard metrics..." />;
  }

  if (error) {
    return (
      <div className="container page-container">
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', borderLeft: '4px solid var(--color-rejected)', maxWidth: '600px', margin: '40px auto' }}>
          <AlertCircle size={40} style={{ color: 'var(--color-rejected)', marginBottom: '12px' }} />
          <h2 style={{ marginBottom: '8px' }}>Dashboard Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error}</p>
          <button onClick={fetchStats} className="btn btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  const stats = data?.stats || { Saved: 0, Applied: 0, Assessment: 0, Interview: 0, Rejected: 0, Offer: 0 };
  const total = data?.total || 0;
  const recent = data?.recentApplications || [];

  // Filter recent applications client-side for the dashboard quick-search bar
  const filteredRecent = recent.filter(app => 
    app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper for company initial letter box styling matching status colors
  const getInitialsStyle = (status: string) => {
    switch (status) {
      case 'Saved': return { bg: 'var(--bg-saved)', color: 'var(--color-saved)' };
      case 'Applied': return { bg: 'var(--bg-applied)', color: 'var(--color-applied)' };
      case 'Assessment': return { bg: 'var(--bg-assessment)', color: 'var(--color-assessment)' };
      case 'Interview': return { bg: 'var(--bg-interview)', color: 'var(--color-interview)' };
      case 'Rejected': return { bg: 'var(--bg-rejected)', color: 'var(--color-rejected)' };
      case 'Offer': return { bg: 'var(--bg-offer)', color: 'var(--color-offer)' };
      default: return { bg: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' };
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      {/* 1. Stats Grid (7 columns matching mockup) */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <StatCard label="Total" value={total} type="total" />
        <StatCard label="Saved" value={stats.Saved} type="saved" />
        <StatCard label="Applied" value={stats.Applied} type="applied" />
        <StatCard label="Assessment" value={stats.Assessment} type="assessment" />
        <StatCard label="Interview" value={stats.Interview} type="interview" />
        <StatCard label="Rejected" value={stats.Rejected} type="rejected" />
        <StatCard label="Offer" value={stats.Offer} type="offer" />
      </div>

      {/* 2. Quick Search & Add Action row (matching mockup) */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center', 
          marginBottom: '24px', 
          flexWrap: 'wrap' 
        }}
      >
        <div className="search-input-wrapper" style={{ flex: 1, minWidth: '240px', maxWidth: '500px' }}>
          <Search size={18} className="search-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: '8px' }}
          />
        </div>

        <button 
          onClick={() => setView('applications')}
          className="btn btn-secondary" 
          style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        <button 
          onClick={onAddApplicationClick} 
          className="btn btn-primary" 
          style={{ 
            marginLeft: 'auto', 
            padding: '10px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            borderRadius: '8px' 
          }}
        >
          <Plus size={18} />
          Add New Application
        </button>
      </div>

      {/* 3. Recent Applications Card (matching mockup style) */}
      <div className="glass-card" style={{ padding: '24px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Recent Applications
          </h2>
          <button 
            onClick={() => setView('applications')} 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px' }}
          >
            View All
          </button>
        </div>

        {filteredRecent.length === 0 ? (
          <div className="empty-state" style={{ maxWidth: '100%', border: 'none', background: 'none', padding: '24px' }}>
            <div className="empty-state-icon" style={{ margin: '0 auto 12px' }}>
              <FileText size={24} />
            </div>
            <h3 className="empty-state-title" style={{ fontSize: '1.1rem' }}>No recent applications</h3>
            <p className="empty-state-desc" style={{ fontSize: '0.85rem' }}>Start tracking by clicking the add button above.</p>
          </div>
        ) : (
          <div className="table-responsive" style={{ border: 'none', background: 'none' }}>
            <table className="app-table">
              <thead>
                <tr>
                  <th style={{ background: 'none', paddingLeft: 0 }}>Company</th>
                  <th style={{ background: 'none' }}>Title</th>
                  <th style={{ background: 'none' }}>Date Applied</th>
                  <th style={{ background: 'none', textAlign: 'right', paddingRight: 0 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecent.map((app) => {
                  const initial = app.companyName.charAt(0).toUpperCase();
                  const badgeStyle = getInitialsStyle(app.status);

                  return (
                    <tr key={app.id}>
                      <td style={{ paddingLeft: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                          {/* Company letter indicator prefix box */}
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: badgeStyle.bg,
                            color: badgeStyle.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            flexShrink: 0
                          }}>
                            {initial}
                          </div>
                          <span style={{ color: 'var(--text-primary)' }}>{app.companyName}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-secondary)' }}>{app.jobTitle}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          {new Date(app.applicationDate).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: '2-digit', 
                            year: 'numeric' 
                          })}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 0 }}>
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
