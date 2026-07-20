import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { 
  listApplications, deleteApplication 
} from '../api/applications.api';
import type { Application } from '../types';
import StatusBadge from '../components/StatusBadge';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, Plus, Briefcase, Edit, Trash2, Eye, AlertCircle, FileText, 
  ChevronLeft, ChevronRight, Globe, Link2, Mail
} from 'lucide-react';

interface ApplicationsProps {
  showToast: (message: string, type: 'success' | 'error') => void;
  setView: (view: string) => void;
  setSelectedApp: (app: Application | null) => void;
  setEditApp: (app: Application | null) => void;
}

export interface ApplicationsRef {
  refreshList: () => void;
}

const STATUSES = ['Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer'];
const SOURCES = ['LinkedIn', 'Indeed', 'Glassdoor', 'Direct Site', 'Referral', 'Other'];

const Applications = forwardRef<ApplicationsRef, ApplicationsProps>(({ 
  showToast, setView, setSelectedApp, setEditApp 
}, ref) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Delete modal state
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);

  const fetchList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listApplications({
        search,
        status: statusFilter,
        source: sourceFilter,
        sort: sortOrder
      });
      setApplications(res.applications);
      setCurrentPage(1); // Reset to page 1 on filter trigger
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to retrieve applications.');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshList: fetchList
  }));

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchList();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, sourceFilter, sortOrder]);

  const handleAddNewClick = () => {
    setEditApp(null); // Clear edit context
    setView('add-application');
  };

  const handleEditClick = (app: Application) => {
    setEditApp(app);
    setView('edit-application');
  };

  const handleViewClick = (app: Application) => {
    setSelectedApp(app);
    setView('application-details');
  };

  const handleDeleteClick = (app: Application) => {
    setAppToDelete(app);
  };

  const confirmDelete = async () => {
    if (!appToDelete) return;
    try {
      await deleteApplication(appToDelete.id);
      showToast('Application deleted successfully', 'success');
      setAppToDelete(null);
      fetchList();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete application', 'error');
    }
  };

  // Helper for source column icon
  const getSourceIcon = (src: string) => {
    switch (src) {
      case 'LinkedIn':
        return <Link2 size={14} style={{ color: '#0256d6' }} />;
      case 'Direct Site':
      case 'Indeed':
      case 'Glassdoor':
        return <Globe size={14} style={{ color: '#475569' }} />;
      case 'Referral':
        return <Mail size={14} style={{ color: '#ea580c' }} />;
      default:
        return <Briefcase size={14} style={{ color: '#94a3b8' }} />;
    }
  };

  // Pagination slice calculations
  const totalItems = applications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = applications.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

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
      {/* Search & Filter Toolbar */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '16px 20px', 
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div className="search-input-wrapper" style={{ flex: 1, minWidth: '240px' }}>
          <Search size={18} className="search-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by company or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: '130px', borderRadius: '8px', padding: '8px 12px', background: '#ffffff', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <option value="">Status: All</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            className="form-select"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            style={{ minWidth: '130px', borderRadius: '8px', padding: '8px 12px', background: '#ffffff', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <option value="">Source: All</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ minWidth: '140px', borderRadius: '8px', padding: '8px 12px', background: '#ffffff', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="created_asc">Sort: Created Date</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-card" style={{ padding: '24px', width: '100%' }}>
        {loading && applications.length === 0 ? (
          <LoadingSpinner fullHeight label="Loading your opportunities..." />
        ) : error ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <AlertCircle size={40} style={{ color: 'var(--color-rejected)', marginBottom: '12px' }} />
            <h3 style={{ marginBottom: '8px' }}>Failed to retrieve data</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </div>
        ) : totalItems === 0 ? (
          <div className="empty-state" style={{ border: 'none', background: 'none', padding: '40px 0' }}>
            <div className="empty-state-icon" style={{ margin: '0 auto 16px' }}>
              <FileText size={32} />
            </div>
            <h3 className="empty-state-title">No applications found</h3>
            <p className="empty-state-desc">Start adding new job tracker entries or relax filters.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive" style={{ border: 'none', background: 'none' }}>
              <table className="app-table">
                <thead>
                  <tr>
                    <th style={{ background: 'none', paddingLeft: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>COMPANY NAME</th>
                    <th style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>JOB TITLE</th>
                    <th style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>SOURCE</th>
                    <th style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>DATE APPLIED</th>
                    <th style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>STATUS</th>
                    <th style={{ background: 'none', textAlign: 'right', paddingRight: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((app) => {
                    const badgeStyle = getInitialsStyle(app.status);

                    return (
                      <tr key={app.id}>
                        <td style={{ paddingLeft: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
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
                              {app.companyName.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ color: 'var(--text-primary)' }}>{app.companyName}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-secondary)' }}>{app.jobTitle}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {getSourceIcon(app.source)}
                            <span>{app.source}</span>
                          </div>
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
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: 0 }}>
                          <div className="app-table-actions" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                            <button 
                              onClick={() => handleViewClick(app)} 
                              style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              title="View Details"
                            >
                              <Eye size={13} />
                            </button>
                            <button 
                              onClick={() => handleEditClick(app)} 
                              style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(2, 86, 214, 0.05)', border: '1px solid rgba(2, 86, 214, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              title="Edit"
                            >
                              <Edit size={13} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(app)} 
                              style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.1)', color: 'var(--color-rejected)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '20px', 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '16px' 
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, totalItems)}</strong> of <strong>{totalItems}</strong> applications
              </span>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: currentPage === 1 ? 'rgba(0,0,0,0.02)' : '#ffffff',
                    color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  const isActive = currentPage === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: isActive ? 'none' : '1px solid var(--border-color)',
                        background: isActive ? 'var(--primary)' : '#ffffff',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: currentPage === totalPages ? 'rgba(0,0,0,0.02)' : '#ffffff',
                    color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-secondary)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button (FAB) (matching mockup style) */}
      <button 
        onClick={handleAddNewClick}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(2, 86, 214, 0.4)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 99,
          transition: 'transform 0.2s ease'
        }}
        className="card-scale"
        title="Track New Opportunity"
      >
        <Plus size={24} />
      </button>

      {/* Delete Confirmation Modal */}
      {appToDelete && (
        <DeleteConfirmModal
          isOpen={!!appToDelete}
          onClose={() => setAppToDelete(null)}
          onConfirm={confirmDelete}
          companyName={appToDelete.companyName}
          jobTitle={appToDelete.jobTitle}
          submitting={false}
        />
      )}
    </div>
  );
});

export default Applications;
