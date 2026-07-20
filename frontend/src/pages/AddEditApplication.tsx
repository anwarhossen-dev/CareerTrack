import React, { useState, useEffect } from 'react';
import type { Application } from '../types';
import { createApplication, updateApplication } from '../api/applications.api';
import { AlertCircle, Loader2, Lightbulb, Link } from 'lucide-react';

interface AddEditApplicationProps {
  setView: (view: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  initialData?: Application | null;
  refreshList: () => void;
}

const AddEditApplication: React.FC<AddEditApplicationProps> = ({
  setView,
  showToast,
  initialData,
  refreshList
}) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [source, setSource] = useState('LinkedIn');
  const [status, setStatus] = useState('Saved');
  const [applicationDate, setApplicationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SOURCES = ['LinkedIn', 'Indeed', 'Glassdoor', 'Direct Site', 'Referral', 'Bdjobs', 'Wellfound', 'Facebook', 'Other'];
  const STATUSES = ['Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer'];

  // Fill form if editing
  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName);
      setJobTitle(initialData.jobTitle);
      setJobUrl(initialData.jobUrl || '');
      setSource(initialData.source);
      setStatus(initialData.status);
      setApplicationDate(initialData.applicationDate.split('T')[0]);
      setNotes(initialData.notes || '');
    } else {
      setCompanyName('');
      setJobTitle('');
      setJobUrl('');
      setSource('LinkedIn');
      setStatus('Saved');
      setApplicationDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setError(null);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim() || !applicationDate) return;

    try {
      setSubmitting(true);
      setError(null);
      
      const payload = {
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobUrl: jobUrl.trim(),
        source,
        status,
        applicationDate,
        notes: notes.trim()
      };

      if (initialData) {
        await updateApplication(initialData.id, payload);
        showToast('Application updated successfully', 'success');
      } else {
        await createApplication(payload);
        showToast('Application tracked successfully', 'success');
      }
      
      refreshList();
      setView('applications');
    } catch (err: any) {
      setError(err.message || 'Failed to save application.');
      showToast(err.message || 'Error saving application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {/* Breadcrumbs trail */}
      <div style={{ display: 'flex', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 500 }}>
        <span style={{ cursor: 'pointer' }} onClick={() => setView('applications')}>Applications</span>
        <span>&gt;</span>
        <span style={{ color: 'var(--primary)' }}>{initialData ? 'Edit Application' : 'Add New Application'}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {initialData ? 'Edit Opportunity' : 'Track New Opportunity'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
          Keep your career journey organized. Fill in the details of your latest job application.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
        {error && (
          <div className="form-error-alert" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Row 1: Company & Title */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="companyName" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Company Name *</label>
            <input
              type="text"
              id="companyName"
              className="form-input"
              placeholder="e.g. Google, Stripe"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={submitting}
              required
              style={{ borderRadius: '8px' }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="jobTitle" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Job Title *</label>
            <input
              type="text"
              id="jobTitle"
              className="form-input"
              placeholder="e.g. Senior Frontend Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={submitting}
              required
              style={{ borderRadius: '8px' }}
            />
          </div>
        </div>

        {/* Row 2: Job URL */}
        <div className="form-group" style={{ marginBottom: '20px', position: 'relative' }}>
          <label className="form-label" htmlFor="jobUrl" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Job Post URL</label>
          <div style={{ position: 'relative' }}>
            <Link size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="url"
              id="jobUrl"
              className="form-input"
              placeholder="https://linkedin.com/jobs/..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              disabled={submitting}
              style={{ paddingLeft: '38px', borderRadius: '8px' }}
            />
          </div>
        </div>

        {/* Row 3: Source, Date, Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="source" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Application Source *</label>
            <select
              id="source"
              className="form-select"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              disabled={submitting}
              style={{ borderRadius: '8px', padding: '8px 12px', background: '#ffffff', border: '1px solid var(--border-color)' }}
            >
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="appDate" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Application Date *</label>
            <input
              type="date"
              id="appDate"
              className="form-input"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              disabled={submitting}
              required
              style={{ borderRadius: '8px' }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="status" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Application Status *</label>
            <select
              id="status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={submitting}
              style={{ borderRadius: '8px', padding: '8px 12px', background: '#ffffff', border: '1px solid var(--border-color)' }}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Row 4: Notes */}
        <div className="form-group" style={{ marginBottom: '28px' }}>
          <label className="form-label" htmlFor="notes" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Notes (Optional)</label>
          <textarea
            id="notes"
            className="form-textarea"
            placeholder="Mention key interviewers, referral names, or prep notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={submitting}
            style={{ borderRadius: '8px', minHeight: '120px' }}
          />
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setView('applications')} 
            disabled={submitting}
            style={{ padding: '10px 24px', borderRadius: '8px' }}
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting || !companyName.trim() || !jobTitle.trim()}
            style={{ padding: '10px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Saving...
              </>
            ) : (
              'Save Application'
            )}
          </button>
        </div>
      </form>

      {/* Pro Tip Card Callout */}
      <div 
        style={{ 
          backgroundColor: 'var(--bg-saved)', 
          border: '1px solid rgba(2, 86, 214, 0.1)', 
          borderRadius: '12px', 
          padding: '16px 20px', 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center' 
        }}
      >
        <div 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            background: 'rgba(2, 86, 214, 0.15)', 
            color: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0 
          }}
        >
          <Lightbulb size={18} fill="var(--primary)" style={{ color: '#ffffff' }} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>Pro Tip: Track the interviewers</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Applications with detailed notes on interviewers and follow-ups have a 25% higher success rate in our data analysis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddEditApplication;
