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
  // Helper to get status accent color
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Saved': return 'var(--color-saved)';
      case 'Applied': return 'var(--color-applied)';
      case 'Assessment': return 'var(--color-assessment)';
      case 'Interview': return 'var(--color-interview)';
      case 'Rejected': return 'var(--color-rejected)';
      case 'Offer': return 'var(--color-offer)';
      default: return 'var(--primary)';
    }
  };

  const statusColor = getStatusColor(application.status);
  const companyInitial = application.companyName.charAt(0).toUpperCase();

  return (
    <div 
      className="glass-card app-card card-scale" 
      style={{ 
        position: 'relative', 
        padding: '20px', 
        borderLeft: `4px solid ${statusColor}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'hidden'
      }}
    >
      {/* Top section: Company logo placeholder & title */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div 
          style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '10px', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid var(--border-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: statusColor,
            flexShrink: 0
          }}
        >
          {companyInitial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="app-card-title" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {application.jobTitle}
          </h3>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
            {application.companyName}
          </div>
        </div>
      </div>

      {/* Middle row: Status and Source */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          via <strong>{application.source}</strong>
        </span>
        <StatusBadge status={application.status} />
      </div>

      {/* Notes / Details */}
      {application.notes ? (
        <div 
          style={{ 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary)', 
            background: 'rgba(0, 0, 0, 0.2)', 
            padding: '10px', 
            borderRadius: '6px', 
            border: '1px solid rgba(255, 255, 255, 0.03)',
            height: '56px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4'
          }}
        >
          {application.notes}
        </div>
      ) : (
        <div 
          style={{ 
            fontSize: '0.85rem', 
            color: 'var(--text-muted)', 
            fontStyle: 'italic',
            height: '56px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          No notes added.
        </div>
      )}

      {/* Footer bar: Date, job post URL and actions */}
      <div 
        style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          paddingTop: '12px', 
          marginTop: '4px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Calendar size={13} />
          <span>{new Date(application.applicationDate).toLocaleDateString()}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {application.jobUrl && (
            <a 
              href={application.jobUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                background: 'rgba(99, 102, 241, 0.1)', 
                color: 'var(--primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              title="Open Job Link"
            >
              <ExternalLink size={13} />
            </a>
          )}
          
          <button 
            onClick={() => onView(application)} 
            style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--text-secondary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            title="View Details"
          >
            <Eye size={13} />
          </button>
          
          <button 
            onClick={() => onEdit(application)} 
            style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: 'rgba(99, 102, 241, 0.05)', 
              border: '1px solid rgba(99, 102, 241, 0.1)',
              color: 'var(--primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            title="Edit"
          >
            <Edit size={13} />
          </button>

          <button 
            onClick={() => onDelete(application)} 
            style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: 'rgba(239, 68, 68, 0.05)', 
              border: '1px solid rgba(239, 68, 68, 0.1)',
              color: 'var(--color-rejected)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
