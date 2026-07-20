import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  jobTitle: string;
  submitting: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  companyName,
  jobTitle,
  submitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <h2 className="modal-title" style={{ color: 'var(--color-rejected)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={22} />
            Delete Application?
          </h2>
          <button className="modal-close-btn" onClick={onClose} disabled={submitting}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body" style={{ paddingBottom: '8px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.4' }}>
            Are you sure you want to delete your application for <strong>{jobTitle}</strong> at <strong>{companyName}</strong>?
          </p>
          <p style={{ color: 'var(--color-rejected)', fontSize: '0.8rem', marginTop: '8px', fontWeight: 500 }}>
            This action is permanent and cannot be undone.
          </p>
        </div>
        <div className="modal-footer" style={{ borderTop: 'none', background: 'none' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose} 
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={onConfirm} 
            disabled={submitting}
            style={{ background: 'var(--color-rejected)', color: 'white' }}
          >
            {submitting ? 'Deleting...' : 'Delete Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
