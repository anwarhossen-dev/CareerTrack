import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import type { Application } from '../types';
import { 
  listApplications, 
  createApplication, 
  updateApplication, 
  deleteApplication 
} from '../api/applications.api';
import StatusBadge from '../components/StatusBadge';
import ApplicationCard from '../components/ApplicationCard';
import AddEditApplication from './AddEditApplication';
import ApplicationDetails from './ApplicationDetails';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, Plus, Calendar, Building, Briefcase, 
  Edit, Trash2, Eye, AlertCircle, FileText, LayoutGrid, List
} from 'lucide-react';

interface ApplicationsProps {
  showToast: (message: string, type: 'success' | 'error') => void;
}

export interface ApplicationsRef {
  openAddModal: () => void;
}

const Applications = forwardRef<ApplicationsRef, ApplicationsProps>(({ showToast }, ref) => {
  // Data State
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest' | 'created_asc'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  
  // Action state
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const SOURCES = ['LinkedIn', 'Bdjobs', 'Indeed', 'Wellfound', 'Facebook', 'Referral', 'Other'];
  const STATUSES = ['Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer'];

  // Expose opening Add Modal externally (e.g. from Dashboard)
  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setSelectedApp(null);
      setFormError(null);
      setIsFormModalOpen(true);
    }
  }));

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
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch applications.');
      showToast(err.message || 'Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchList();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, sourceFilter, sortOrder]);

  const handleFormSubmit = async (formData: {
    companyName: string;
    jobTitle: string;
    jobUrl: string;
    source: string;
    status: string;
    applicationDate: string;
    notes: string;
  }) => {
    setFormError(null);
    setFormSubmitting(true);

    try {
      if (selectedApp) {
        // Edit flow
        await updateApplication(selectedApp.id, formData);
        showToast('Application updated successfully!', 'success');
      } else {
        // Add flow
        await createApplication(formData);
        showToast('Application added successfully!', 'success');
      }
      setIsFormModalOpen(false);
      setSelectedApp(null);
      fetchList();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to save application.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedApp) return;

    setFormSubmitting(true);
    try {
      await deleteApplication(selectedApp.id);
      showToast('Application deleted successfully!', 'success');
      setIsDeleteModalOpen(false);
      setSelectedApp(null);
      fetchList();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete application', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditClick = (app: Application) => {
    setSelectedApp(app);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (app: Application) => {
    setSelectedApp(app);
    setIsDeleteModalOpen(true);
  };

  const handleViewClick = (app: Application) => {
    setSelectedApp(app);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="container page-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Job Applications</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Track, organize, and update your active applications.</p>
        </div>
        <button onClick={() => { setSelectedApp(null); setFormError(null); setIsFormModalOpen(true); }} className="btn btn-primary">
          <Plus size={18} />
          Add Application
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card search-filter-panel">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by company or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select 
            className="form-select filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            className="form-select filter-select"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">All Sources</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            className="form-select filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Applied Date: Newest First</option>
            <option value="oldest">Applied Date: Oldest First</option>
            <option value="created_asc">Created Date: Oldest First</option>
          </select>

          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Applications Data Render */}
      {loading && applications.length === 0 ? (
        <LoadingSpinner fullHeight label="Loading job list..." />
      ) : error ? (
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', borderLeft: '4px solid var(--color-rejected)', maxWidth: '600px', margin: '0 auto' }}>
          <AlertCircle size={40} style={{ color: 'var(--color-rejected)', marginBottom: '12px' }} />
          <h3 style={{ marginBottom: '8px' }}>Failed to Load Applications</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error}</p>
          <button onClick={fetchList} className="btn btn-primary">Try Again</button>
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">
            <FileText size={32} />
          </div>
          <h3 className="empty-state-title">No applications found</h3>
          <p className="empty-state-desc">Try resetting your search query or filters, or add a new job tracker entry.</p>
          {(search || statusFilter || sourceFilter) && (
            <button 
              onClick={() => { setSearch(''); setStatusFilter(''); setSourceFilter(''); }} 
              className="btn btn-secondary"
              style={{ marginTop: '8px' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="table-responsive animate-fade-in">
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
              {applications.map((app) => (
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
                    <div className="app-table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => handleViewClick(app)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="View details">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => handleEditClick(app)} className="btn btn-secondary" style={{ padding: '6px 10px', color: 'var(--primary)' }} title="Edit">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDeleteClick(app)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="app-cards-grid animate-fade-in">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* ================= REFACTORED MODALS ================= */}

      {/* 1. Add / Edit Application Form Modal */}
      <AddEditApplication
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setSelectedApp(null); }}
        onSubmit={handleFormSubmit}
        initialData={selectedApp}
        submitting={formSubmitting}
        error={formError}
      />

      {/* 2. Details Modal */}
      <ApplicationDetails
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setSelectedApp(null); }}
        application={selectedApp}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* 3. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedApp(null); }}
        onConfirm={handleConfirmDelete}
        companyName={selectedApp?.companyName || ''}
        jobTitle={selectedApp?.jobTitle || ''}
        submitting={formSubmitting}
      />
    </div>
  );
});

export default Applications;
