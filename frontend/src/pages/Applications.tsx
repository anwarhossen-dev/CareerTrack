import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Plus, Calendar, Building, Briefcase, 
  ExternalLink, Edit, Trash2, Eye, Loader2, 
  AlertCircle, X, FileText, LayoutGrid, List
} from 'lucide-react';

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string | null;
  source: string;
  status: string;
  applicationDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApplicationsProps {
  showToast: (message: string, type: 'success' | 'error') => void;
}

export interface ApplicationsRef {
  openAddModal: () => void;
}

const Applications = forwardRef<ApplicationsRef, ApplicationsProps>(({ showToast }, ref) => {
  const { apiFetch } = useAuth();
  
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Form Fields State
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [source, setSource] = useState('LinkedIn');
  const [status, setStatus] = useState('Saved');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const SOURCES = ['LinkedIn', 'Bdjobs', 'Indeed', 'Wellfound', 'Facebook', 'Referral', 'Other'];
  const STATUSES = ['Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer'];

  // Expose opening Add Modal externally (e.g. from Dashboard)
  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      resetForm();
      setIsAddModalOpen(true);
    }
  }));

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('source', sourceFilter);
      if (sortOrder) params.append('sort', sortOrder);

      const res = await apiFetch(`/applications?${params.toString()}`);
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
    // Debounce search slightly to avoid hammering the API
    const delayDebounceFn = setTimeout(() => {
      fetchApplications();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, sourceFilter, sortOrder]);

  const resetForm = () => {
    setCompanyName('');
    setJobTitle('');
    setJobUrl('');
    setSource('LinkedIn');
    setStatus('Saved');
    setApplicationDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setFormError(null);
    setFormSubmitting(false);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!companyName.trim() || !jobTitle.trim() || !applicationDate) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      await apiFetch('/applications', {
        method: 'POST',
        body: JSON.stringify({
          companyName,
          jobTitle,
          jobUrl: jobUrl || null,
          source,
          status,
          applicationDate,
          notes: notes || null
        })
      });
      showToast('Job application added successfully!', 'success');
      setIsAddModalOpen(false);
      resetForm();
      fetchApplications();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to add application.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const openEditModal = (app: Application) => {
    setSelectedApp(app);
    setCompanyName(app.companyName);
    setJobTitle(app.jobTitle);
    setJobUrl(app.jobUrl || '');
    setSource(app.source);
    setStatus(app.status);
    setApplicationDate(app.applicationDate.split('T')[0]);
    setNotes(app.notes || '');
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedApp) return;

    if (!companyName.trim() || !jobTitle.trim() || !applicationDate) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      await apiFetch(`/applications/${selectedApp.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          companyName,
          jobTitle,
          jobUrl: jobUrl || null,
          source,
          status,
          applicationDate,
          notes: notes || null
        })
      });
      showToast('Job application updated successfully!', 'success');
      setIsEditModalOpen(false);
      resetForm();
      fetchApplications();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to update application.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const openDeleteConfirm = (app: Application) => {
    setSelectedApp(app);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedApp) return;

    setFormSubmitting(true);
    try {
      await apiFetch(`/applications/${selectedApp.id}`, {
        method: 'DELETE'
      });
      showToast('Job application deleted successfully!', 'success');
      setIsDeleteModalOpen(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete application', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const openDetailModal = (app: Application) => {
    setSelectedApp(app);
    setIsDetailModalOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Saved': return 'badge badge-saved';
      case 'Applied': return 'badge badge-applied';
      case 'Assessment': return 'badge badge-assessment';
      case 'Interview': return 'badge badge-interview';
      case 'Rejected': return 'badge badge-rejected';
      case 'Offer': return 'badge badge-offer';
      default: return 'badge';
    }
  };

  return (
    <div className="container page-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Job Applications</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Track, organize, and update your active applications.</p>
        </div>
        <button onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="btn btn-primary">
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
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite', marginBottom: '12px', display: 'inline-block' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading job list...</p>
        </div>
      ) : error ? (
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', borderLeft: '4px solid var(--color-rejected)', maxWidth: '600px', margin: '0 auto' }}>
          <AlertCircle size={40} style={{ color: 'var(--color-rejected)', marginBottom: '12px' }} />
          <h3 style={{ marginBottom: '8px' }}>Failed to Load Applications</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error}</p>
          <button onClick={fetchApplications} className="btn btn-primary">Try Again</button>
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
                    <span className={getStatusBadgeClass(app.status)}>{app.status}</span>
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
                      <button onClick={() => openDetailModal(app)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="View details">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => openEditModal(app)} className="btn btn-secondary" style={{ padding: '6px 10px', color: 'var(--primary)' }} title="Edit">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => openDeleteConfirm(app)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
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
            <div key={app.id} className="glass-card app-card card-scale">
              <div className="app-card-header">
                <div>
                  <h3 className="app-card-title">{app.jobTitle}</h3>
                  <div className="app-card-company">{app.companyName}</div>
                </div>
                <span className={getStatusBadgeClass(app.status)}>{app.status}</span>
              </div>
              
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <strong>Source:</strong> {app.source}
              </div>

              {app.jobUrl && (
                <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Open Job Post <ExternalLink size={12} />
                </a>
              )}

              {app.notes && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {app.notes}
                </div>
              )}

              <div className="app-card-meta">
                <div className="app-card-date">
                  <Calendar size={12} />
                  <span>{new Date(app.applicationDate).toLocaleDateString()}</span>
                </div>
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <button onClick={() => openDetailModal(app)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                    <Eye size={12} />
                  </button>
                  <button onClick={() => openEditModal(app)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--primary)' }}>
                    <Edit size={12} />
                  </button>
                  <button onClick={() => openDeleteConfirm(app)} className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL DIALOGS ================= */}

      {/* 1. Add Application Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Track New Application</h2>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="form-error-alert">
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Google, Bdjobs, Vercel"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={formSubmitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Software Engineer, React Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    disabled={formSubmitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Post URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="e.g. https://linkedin.com/jobs/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    disabled={formSubmitting}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Source *</label>
                    <select
                      className="form-select"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      disabled={formSubmitting}
                    >
                      {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={formSubmitting}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Application Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    disabled={formSubmitting}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Add details, contact person, interview remarks..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={formSubmitting}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)} disabled={formSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Application Modal */}
      {isEditModalOpen && selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Job Application</h2>
              <button className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="form-error-alert">
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={formSubmitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    disabled={formSubmitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Post URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    disabled={formSubmitting}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Source *</label>
                    <select
                      className="form-select"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      disabled={formSubmitting}
                    >
                      {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={formSubmitting}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Application Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    disabled={formSubmitting}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    className="form-textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={formSubmitting}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)} disabled={formSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Detail Preview Modal */}
      {isDetailModalOpen && selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Application Details</h2>
              <button className="modal-close-btn" onClick={() => setIsDetailModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem' }}>{selectedApp.jobTitle}</h2>
                  <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <Building size={16} />
                    {selectedApp.companyName}
                  </div>
                </div>
                <span className={getStatusBadgeClass(selectedApp.status)} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                  {selectedApp.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="detail-item">
                  <div className="detail-label">Application Source</div>
                  <div className="detail-value">{selectedApp.source}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Applied Date</div>
                  <div className="detail-value">{new Date(selectedApp.applicationDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                </div>
              </div>

              {selectedApp.jobUrl && (
                <div className="detail-item">
                  <div className="detail-label">Job Posting URL</div>
                  <div className="detail-value">
                    <a href={selectedApp.jobUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', wordBreak: 'break-all' }}>
                      {selectedApp.jobUrl}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )}

              <div className="detail-item">
                <div className="detail-label">Notes</div>
                {selectedApp.notes ? (
                  <div className="detail-notes-box">{selectedApp.notes}</div>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No notes provided for this job.</div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div>Tracked on: {new Date(selectedApp.createdAt).toLocaleString()}</div>
                <div style={{ textAlign: 'right' }}>Last updated: {new Date(selectedApp.updatedAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => { setIsDetailModalOpen(false); openDeleteConfirm(selectedApp); }}
              >
                <Trash2 size={16} />
                Delete
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => { setIsDetailModalOpen(false); openEditModal(selectedApp); }}
                >
                  <Edit size={16} />
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <h2 className="modal-title" style={{ color: 'var(--color-rejected)' }}>Delete Application?</h2>
              <button className="modal-close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ paddingBottom: '8px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Are you sure you want to delete your application for <strong>{selectedApp.jobTitle}</strong> at <strong>{selectedApp.companyName}</strong>?
              </p>
              <p style={{ color: 'var(--color-rejected)', fontSize: '0.8rem', marginTop: '8px', fontWeight: 500 }}>
                This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', background: 'none' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={formSubmitting}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteSubmit} disabled={formSubmitting} style={{ background: 'var(--color-rejected)', color: 'white' }}>
                {formSubmitting ? 'Deleting...' : 'Delete Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
});

export default Applications;
