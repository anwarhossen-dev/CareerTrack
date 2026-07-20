import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchDashboardStats } from '../api/applications.api';
import type { DashboardData } from '../types';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Plus, AlertCircle, FileText, Calendar, Sparkles, Building, Briefcase 
} from 'lucide-react';

interface DashboardProps {
  setView: (view: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  onAddApplicationClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, showToast, onAddApplicationClick }) => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDashboardStats();
      setData(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load dashboard statistics.');
      showToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner fullHeight label="Loading dashboard metrics..." />;
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

  return (
    <div className="container page-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Welcome, {user?.name}!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Here is an overview of your job search progress.</p>
        </div>
        <button onClick={onAddApplicationClick} className="btn btn-primary">
          <Plus size={18} />
          Add Job Application
        </button>
      </div>

      {/* Stats Cards Grid using StatCard */}
      <div className="dashboard-grid">
        <StatCard label="Total" value={total} type="total" />
        <StatCard label="Saved" value={stats.Saved} type="saved" />
        <StatCard label="Applied" value={stats.Applied} type="applied" />
        <StatCard label="Assessments" value={stats.Assessment} type="assessment" />
        <StatCard label="Interviews" value={stats.Interview} type="interview" />
        <StatCard label="Rejections" value={stats.Rejected} type="rejected" />
        <StatCard label="Offers" value={stats.Offer} type="offer" />
      </div>

      {/* Recent Applications Section */}
      <div style={{ marginTop: '16px' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} style={{ color: 'var(--secondary)' }} />
          Recently Added Applications
        </h2>

        {recent.length === 0 ? (
          <div className="glass-card empty-state" style={{ maxWidth: '100%' }}>
            <div className="empty-state-icon">
              <FileText size={32} />
            </div>
            <h3 className="empty-state-title">No applications tracked yet</h3>
            <p className="empty-state-desc">Start tracking your job search by adding your first job application details.</p>
            <button onClick={onAddApplicationClick} className="btn btn-primary" style={{ marginTop: '8px' }}>
              <Plus size={16} />
              Add Your First Application
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job Title</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Applied Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <Building size={16} style={{ color: 'var(--text-secondary)' }} />
                        {app.companyName}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Briefcase size={16} style={{ color: 'var(--text-muted)' }} />
                        {app.jobTitle}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>{app.source}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <Calendar size={14} />
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => setView('applications')} 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
