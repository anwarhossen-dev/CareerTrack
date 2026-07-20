import React from 'react';
import type { Application } from '../types';
import StatusBadge from '../components/StatusBadge';
import { X, Building, ExternalLink, Trash2, Edit } from 'lucide-react';

interface ApplicationDetailsProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !application) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Application Details</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body animate-fade-in">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            marginBottom: '20px', 
            borderBottom: '1px solid var(--border-color)', 
            paddingBottom: '16px' 
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{application.jobTitle}</h2>
              <div style={{ 
                fontSize: '1.05rem', 
                color: 'var(--text-secondary)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                marginTop: '4px' 
              }}>
                <Building size={16} />
                {application.companyName}
              </div>
            </div>
            <StatusBadge status={application.status} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="detail-item">
              <div className="detail-label">Application Source</div>
              <div className="detail-value">{application.source}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Applied Date</div>
              <div className="detail-value">
                {new Date(application.applicationDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </div>
            </div>
          </div>

          {application.jobUrl && (
            <div className="detail-item">
              <div className="detail-label">Job Posting URL</div>
              <div className="detail-value">
                <a 
                  href={application.jobUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    color: 'var(--primary)', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    wordBreak: 'break-all' 
                  }}
                >
                  {application.jobUrl}
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}

          <div className="detail-item">
            <div className="detail-label">Notes</div>
            {application.notes ? (
              <div className="detail-notes-box">{application.notes}</div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No notes provided for this job.
              </div>
            )}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px', 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '16px', 
            fontSize: '0.75rem', 
            color: 'var(--text-muted)' 
          }}>
            <div>Tracked on: {new Date(application.createdAt).toLocaleString()}</div>
            <div style={{ textAlign: 'right' }}>Last updated: {new Date(application.updatedAt).toLocaleString()}</div>
          </div>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={() => { onClose(); onDelete(application); }}
          >
            <Trash2 size={16} />
            Delete
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => { onClose(); onEdit(application); }}
            >
              <Edit size={16} />
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
