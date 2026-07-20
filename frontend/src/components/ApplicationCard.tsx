import React from 'react';
import type { Application } from '../types';
import StatusBadge from './StatusBadge';
import { Calendar, ExternalLink, Eye, Edit, Trash2 } from 'lucide-react';

interface ApplicationCardProps {
  application: Application;
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="glass-card app-card card-scale">
      <div className="app-card-header">
        <div>
          <h3 className="app-card-title">{application.jobTitle}</h3>
          <div className="app-card-company">{application.companyName}</div>
        </div>
        <StatusBadge status={application.status} />
      </div>
      
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <strong>Source:</strong> {application.source}
      </div>

      {application.jobUrl && (
        <a 
          href={application.jobUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            fontSize: '0.85rem', 
            color: 'var(--primary)', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px' 
          }}
        >
          Open Job Post <ExternalLink size={12} />
        </a>
      )}

      {application.notes && (
        <div 
          style={{ 
            fontSize: '0.85rem', 
            color: 'var(--text-muted)', 
            background: 'rgba(0,0,0,0.15)', 
            padding: '8px', 
            borderRadius: '4px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical' 
          }}
        >
          {application.notes}
        </div>
      )}

      <div className="app-card-meta">
        <div className="app-card-date">
          <Calendar size={12} />
          <span>{new Date(application.applicationDate).toLocaleDateString()}</span>
        </div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onView(application)} 
            className="btn btn-secondary" 
            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
            title="View details"
          >
            <Eye size={12} />
          </button>
          <button 
            onClick={() => onEdit(application)} 
            className="btn btn-secondary" 
            style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--primary)' }}
            title="Edit details"
          >
            <Edit size={12} />
          </button>
          <button 
            onClick={() => onDelete(application)} 
            className="btn btn-danger" 
            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
