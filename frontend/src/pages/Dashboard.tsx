import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchDashboardStats, fetchAdminStats } from '../api/applications.api';
import type { DashboardData, AdminDashboardData } from '../types';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Plus, AlertCircle, FileText, Calendar, Sparkles, Building, Briefcase,
  Users, Layers, Settings, ShieldAlert
} from 'lucide-react';

interface DashboardProps {
  setView: (view: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  onAddApplicationClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, showToast, onAddApplicationClick }) => {
  const { user } = useAuth();
  
  // Tab control: 'personal' | 'admin'
  const [activeTab, setActiveTab] = useState<'personal' | 'admin'>('personal');

  // Personal Stats state
  const [personalData, setPersonalData] = useState<DashboardData | null>(null);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState<string | null>(null);

  // Admin Stats state
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const fetchPersonalStats = async () => {
    try {
      setPersonalLoading(true);
      setPersonalError(null);
      const res = await fetchDashboardStats();
      setPersonalData(res);
    } catch (err: any) {
      console.error(err);
      setPersonalError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setPersonalLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      setAdminLoading(true);
      setAdminError(null);
      const res = await fetchAdminStats();
      setAdminData(res);
    } catch (err: any) {
      console.error(err);
      setAdminError(err.message || 'Failed to load system administrative statistics.');
      showToast(err.message || 'Error fetching admin data', 'error');
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalStats();
    if (user?.role === 'ADMIN' && activeTab === 'admin') {
      fetchSystemStats();
    }
  }, [activeTab, user]);

  const handleTabChange = (tab: 'personal' | 'admin') => {
    setActiveTab(tab);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="container page-container animate-fade-in">
      {/* Upper header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Welcome, {user?.name}! 
            {isAdmin && (
              <span className="badge badge-offer" style={{ fontSize: '0.75rem', padding: '4px 8px', textTransform: 'uppercase', verticalAlign: 'middle' }}>
                Admin Session
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {activeTab === 'personal' 
              ? 'Here is an overview of your job search progress.'
              : 'System-wide analytics monitor.'
            }
          </p>
        </div>

        {activeTab === 'personal' && (
          <button onClick={onAddApplicationClick} className="btn btn-primary">
            <Plus size={18} />
            Add Job Application
          </button>
        )}
      </div>

      {/* Admin Toggle Tabs */}
      {isAdmin && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', gap: '16px' }}>
          <button 
            onClick={() => handleTabChange('personal')}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: '12px 16px', 
              color: activeTab === 'personal' ? 'var(--primary)' : 'var(--text-secondary)', 
              fontWeight: 600,
              fontSize: '1rem',
              borderBottom: activeTab === 'personal' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Briefcase size={16} />
            My Dashboard
          </button>
          <button 
            onClick={() => handleTabChange('admin')}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: '12px 16px', 
              color: activeTab === 'admin' ? 'var(--secondary)' : 'var(--text-secondary)', 
              fontWeight: 600,
              fontSize: '1rem',
              borderBottom: activeTab === 'admin' ? '2px solid var(--secondary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Settings size={16} />
            System Administration
          </button>
        </div>
      )}

      {/* ================= MY DASHBOARD TAB ================= */}
      {activeTab === 'personal' && (
        <>
          {personalLoading ? (
            <LoadingSpinner fullHeight label="Loading your dashboard..." />
          ) : personalError ? (
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center', borderLeft: '4px solid var(--color-rejected)', maxWidth: '600px', margin: '40px auto' }}>
              <AlertCircle size={40} style={{ color: 'var(--color-rejected)', marginBottom: '12px' }} />
              <h2 style={{ marginBottom: '8px' }}>Dashboard Error</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{personalError}</p>
              <button onClick={fetchPersonalStats} className="btn btn-primary">Try Again</button>
            </div>
          ) : (
            <>
              {/* Personal Dashboard Grid */}
              <div className="dashboard-grid">
                <StatCard label="Total" value={personalData?.total || 0} type="total" />
                <StatCard label="Saved" value={personalData?.stats.Saved || 0} type="saved" />
                <StatCard label="Applied" value={personalData?.stats.Applied || 0} type="applied" />
                <StatCard label="Assessments" value={personalData?.stats.Assessment || 0} type="assessment" />
                <StatCard label="Interviews" value={personalData?.stats.Interview || 0} type="interview" />
                <StatCard label="Rejections" value={personalData?.stats.Rejected || 0} type="rejected" />
                <StatCard label="Offers" value={personalData?.stats.Offer || 0} type="offer" />
              </div>

              {/* Recent Entries */}
              <div style={{ marginTop: '16px' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} style={{ color: 'var(--secondary)' }} />
                  Recently Added Applications
                </h2>

                {!personalData?.recentApplications || personalData.recentApplications.length === 0 ? (
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
                        {personalData.recentApplications.map((app) => (
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
            </>
          )}
        </>
      )}

      {/* ================= SYSTEM ADMINISTRATION TAB ================= */}
      {isAdmin && activeTab === 'admin' && (
        <>
          {adminLoading ? (
            <LoadingSpinner fullHeight label="Fetching system-wide dashboard metrics..." />
          ) : adminError ? (
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center', borderLeft: '4px solid var(--color-rejected)', maxWidth: '600px', margin: '40px auto' }}>
              <ShieldAlert size={40} style={{ color: 'var(--color-rejected)', marginBottom: '12px' }} />
              <h2 style={{ marginBottom: '8px' }}>Admin Load Error</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{adminError}</p>
              <button onClick={fetchSystemStats} className="btn btn-primary">Try Again</button>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* System summary cards grid */}
              <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '24px' }}>
                <div className="glass-card stat-card stat-total card-scale" style={{ borderLeft: '4px solid var(--secondary)' }}>
                  <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={16} /> Total System Users
                  </div>
                  <div className="stat-val" style={{ color: 'var(--secondary)' }}>{adminData?.totalUsers || 0}</div>
                </div>

                <div className="glass-card stat-card stat-total card-scale" style={{ borderLeft: '4px solid var(--primary)' }}>
                  <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={16} /> Total System Applications
                  </div>
                  <div className="stat-val" style={{ color: 'var(--primary)' }}>{adminData?.totalApplications || 0}</div>
                </div>
              </div>

              {/* Systemwide status distributions */}
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>System-Wide Status Totals</h3>
              <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
                <StatCard label="Saved" value={adminData?.statusStats.Saved || 0} type="saved" />
                <StatCard label="Applied" value={adminData?.statusStats.Applied || 0} type="applied" />
                <StatCard label="Assessments" value={adminData?.statusStats.Assessment || 0} type="assessment" />
                <StatCard label="Interviews" value={adminData?.statusStats.Interview || 0} type="interview" />
                <StatCard label="Rejections" value={adminData?.statusStats.Rejected || 0} type="rejected" />
                <StatCard label="Offers" value={adminData?.statusStats.Offer || 0} type="offer" />
              </div>

              {/* Registered Users Table */}
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Registered Users Registry</h3>
              
              {!adminData?.usersList || adminData.usersList.length === 0 ? (
                <div className="glass-card empty-state">
                  <p>No registered users found in the system database.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="app-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email Address</th>
                        <th>Role</th>
                        <th>Date Registered</th>
                        <th style={{ textAlign: 'right' }}>Tracked Applications</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminData.usersList.map((sysUser) => (
                        <tr key={sysUser.id}>
                          <td style={{ fontWeight: 600 }}>{sysUser.name}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{sysUser.email}</td>
                          <td>
                            <span className={`badge ${sysUser.role === 'ADMIN' ? 'badge-offer' : 'badge-saved'}`} style={{ fontSize: '0.75rem' }}>
                              {sysUser.role}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                              <Calendar size={14} />
                              {new Date(sysUser.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                            {sysUser._count.applications}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
