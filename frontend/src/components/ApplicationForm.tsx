import React, { useState, useEffect } from 'react';
import type { Application } from '../types';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ApplicationFormProps {
  onSubmit: (data: {
    companyName: string;
    jobTitle: string;
    jobUrl: string;
    source: string;
    status: string;
    applicationDate: string;
    notes: string;
  }) => void;
  initialData?: Application | null;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onSubmit,
  initialData,
  submitting,
  error,
  onCancel
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

  const SOURCES = ['LinkedIn', 'Bdjobs', 'Indeed', 'Wellfound', 'Facebook', 'Referral', 'Other'];
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
      // Reset form
      setCompanyName('');
      setJobTitle('');
      setJobUrl('');
      setSource('LinkedIn');
      setStatus('Saved');
      setApplicationDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim() || !applicationDate) return;

    onSubmit({
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      jobUrl: jobUrl.trim(),
      source,
      status,
      applicationDate,
      notes: notes.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="form-error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="companyName">Company Name *</label>
        <input
          type="text"
          id="companyName"
          className="form-input"
          placeholder="e.g. Google, Bdjobs, company site"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={submitting}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="jobTitle">Job Title *</label>
        <input
          type="text"
          id="jobTitle"
          className="form-input"
          placeholder="e.g. Front-End Engineer, Web Developer"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          disabled={submitting}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="jobUrl">Job Post URL</label>
        <input
          type="url"
          id="jobUrl"
          className="form-input"
          placeholder="e.g. https://linkedin.com/jobs/..."
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="source">Application Source *</label>
          <select
            id="source"
            className="form-select"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={submitting}
          >
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="status">Application Status *</label>
          <select
            id="status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={submitting}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="appDate">Application Date *</label>
        <input
          type="date"
          id="appDate"
          className="form-input"
          value={applicationDate}
          onChange={(e) => setApplicationDate(e.target.value)}
          disabled={submitting}
          required
        />
      </div>

      <div className="form-group" style={{ marginBottom: '24px' }}>
        <label className="form-label" htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          className="form-textarea"
          placeholder="Interview schedule, salary package details, tech stack notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel} 
          disabled={submitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={submitting || !companyName.trim() || !jobTitle.trim()}
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
  );
};

export default ApplicationForm;
