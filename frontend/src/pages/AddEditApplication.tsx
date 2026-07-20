import React from 'react';
import type { Application } from '../types';
import ApplicationForm from '../components/ApplicationForm';
import { X } from 'lucide-react';

interface AddEditApplicationProps {
  isOpen: boolean;
  onClose: () => void;
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
}

const AddEditApplication: React.FC<AddEditApplicationProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  submitting,
  error
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? 'Edit Job Application' : 'Track New Application'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} disabled={submitting}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <ApplicationForm
            onSubmit={onSubmit}
            initialData={initialData}
            submitting={submitting}
            error={error}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEditApplication;
