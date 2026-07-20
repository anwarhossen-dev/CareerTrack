import React from 'react';
import type { Application } from '../types';
import { 
  ArrowLeft, Edit, Trash2, Archive, Link2, ExternalLink, Globe, Mail, 
  Briefcase, ChevronRight
} from 'lucide-react';

interface ApplicationDetailsProps {
  application: Application | null;
  setView: (view: string) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
  setView,
  onEdit,
  onDelete,
  showToast
}) => {
  if (!application) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No application selected.</p>
        <button onClick={() => setView('applications')} className="btn btn-primary">Back to Applications</button>
      </div>
    );
  }

  const handleArchiveClick = () => {
    showToast('Application archived successfully', 'success');
  };

  const getSourceIcon = (src: string) => {
    switch (src) {
      case 'LinkedIn':
        return <Link2 size={16} style={{ color: '#0256d6' }} />;
      case 'Direct Site':
      case 'Indeed':
      case 'Glassdoor':
        return <Globe size={16} style={{ color: '#475569' }} />;
      case 'Referral':
        return <Mail size={16} style={{ color: '#ea580c' }} />;
      default:
        return <Briefcase size={16} style={{ color: '#94a3b8' }} />;
    }
  };

  // Helper to generate dynamic company profiles based on company name
  const getCompanyDescription = (companyName: string) => {
    return `${companyName} is a leading provider of innovative industry solutions, focusing on customer-centric design, scaled cloud integrations, and robust workflow automation. They are expanding their core tech teams to support high-growth global platforms and modern enterprise architectures.`;
  };

  // Helper to calculate progress strength bar based on notes length or hardcoded seed
  const getStrengthPercent = () => {
    if (!application.notes) return 45;
    if (application.notes.length > 100) return 85;
    return 65;
  };

  // Dynamic timeline generator based on status
  const getTimelineSteps = () => {
    const formattedDate = new Date(application.applicationDate).toLocaleDateString(undefined, { 
      month: 'short', day: '2-digit', year: 'numeric' 
    });
    
    switch (application.status) {
      case 'Saved':
        return [
          { title: 'Draft Opportunity Compiled', desc: 'Saved opportunity inside tracking cabinet.', date: formattedDate, color: 'var(--primary)' }
        ];
      case 'Applied':
        return [
          { title: 'Application Submitted', desc: `Online job tracking sent via ${application.source}.`, date: formattedDate, color: 'var(--primary)' }
        ];
      case 'Assessment':
        return [
          { title: 'Assessment Scheduled', desc: 'Received technical question set or coding challenge invitation.', date: 'Pending Date', color: 'var(--primary)' },
          { title: 'Application Submitted', desc: `Online job tracking sent via ${application.source}.`, date: formattedDate, color: '#16a34a' }
        ];
      case 'Interview':
        return [
          { title: 'Interview Scheduled', desc: 'Technical Whiteboard Session and recruiter panel rounds.', date: 'Upcoming Days', color: 'var(--primary)' },
          { title: 'Screening Call Completed', desc: 'Passed initial recruiter matching review.', date: formattedDate, color: '#16a34a' },
          { title: 'Application Submitted', desc: `Online job tracking sent via ${application.source}.`, date: formattedDate, color: '#16a34a' }
        ];
      case 'Rejected':
        return [
          { title: 'Application Closed', desc: 'Hiring pipeline paused or decision received.', date: 'Process Concluded', color: 'var(--color-rejected)' },
          { title: 'Application Submitted', desc: `Online job tracking sent via ${application.source}.`, date: formattedDate, color: '#16a34a' }
        ];
      case 'Offer':
        return [
          { title: 'Job Offer Received!', desc: 'Formal compensation proposal package delivered.', date: 'Final Decision', color: 'var(--color-offer)' },
          { title: 'Interview Cycles Passed', desc: 'Completed final round presentations.', date: formattedDate, color: '#16a34a' },
          { title: 'Application Submitted', desc: `Online job tracking sent via ${application.source}.`, date: formattedDate, color: '#16a34a' }
        ];
      default:
        return [];
    }
  };

  const timelineSteps = getTimelineSteps();
  const strengthPercent = getStrengthPercent();

  // Color mapping matching tag values in mockup
  const getPhaseTagColor = (status: string) => {
    switch (status) {
      case 'Saved': return { bg: 'rgba(2, 86, 214, 0.05)', border: 'rgba(2, 86, 214, 0.2)', text: 'var(--primary)', label: 'Saved Draft' };
      case 'Applied': return { bg: 'rgba(99, 102, 241, 0.05)', border: 'rgba(99, 102, 241, 0.2)', text: 'var(--color-applied)', label: 'Applied Stage' };
      case 'Assessment': return { bg: 'rgba(217, 119, 6, 0.05)', border: 'rgba(217, 119, 6, 0.2)', text: 'var(--color-assessment)', label: 'Assessment Phase' };
      case 'Interview': return { bg: 'rgba(234, 88, 12, 0.05)', border: 'rgba(234, 88, 12, 0.2)', text: 'var(--color-interview)', label: 'Interview Phase' };
      case 'Rejected': return { bg: 'rgba(220, 38, 38, 0.05)', border: 'rgba(220, 38, 38, 0.2)', text: 'var(--color-rejected)', label: 'Process Closed' };
      case 'Offer': return { bg: 'rgba(22, 163, 74, 0.05)', border: 'rgba(22, 163, 74, 0.2)', text: 'var(--color-offer)', label: 'Offer Stage' };
      default: return { bg: 'rgba(0,0,0,0.03)', border: 'rgba(0,0,0,0.1)', text: 'var(--text-secondary)', label: 'Tracking' };
    }
  };

  const tagStyle = getPhaseTagColor(application.status);
  const initials = application.companyName.charAt(0).toUpperCase();

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      {/* Back button Link */}
      <button 
        onClick={() => setView('applications')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          padding: 0,
          marginBottom: '24px'
        }}
      >
        <ArrowLeft size={16} />
        Back to Applications
      </button>

      {/* Main Grid Content Layout */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.25fr 0.75fr', 
          gap: '32px', 
          alignItems: 'start' 
        }}
      >
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main info header card */}
          <div className="glass-card" style={{ padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              backgroundColor: tagStyle.bg,
              color: tagStyle.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.8rem',
              flexShrink: 0,
              border: `1px solid ${tagStyle.border}`
            }}>
              {initials}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0', lineHeight: 1.15 }}>
                    {application.jobTitle}
                  </h1>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {application.companyName}
                  </span>
                </div>

                {/* Styled Phase Tag */}
                <div style={{
                  padding: '6px 14px',
                  borderRadius: '30px',
                  background: tagStyle.bg,
                  border: `1px solid ${tagStyle.border}`,
                  color: tagStyle.text,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}>
                  {tagStyle.label}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '20px', paddingTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Applied on <strong>{new Date(application.applicationDate).toLocaleDateString(undefined, { 
                  month: 'short', day: '2-digit', year: 'numeric' 
                })}</strong>
              </div>
            </div>
          </div>

          {/* Details list card */}
          <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Metadata Rows */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>APPLICATION SOURCE</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {getSourceIcon(application.source)}
                  <span>{application.source} Job Board</span>
                </div>
              </div>

              {application.jobUrl && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LISTING URL</h4>
                  <a 
                    href={application.jobUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      color: 'var(--primary)', 
                      fontWeight: 600, 
                      textDecoration: 'none',
                      fontSize: '0.95rem'
                    }}
                  >
                    <span>{application.jobUrl.replace(/(^\w+:|^)\/\//, '').split('/')[0]}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>APPLICATION NOTES</h4>
              {application.notes ? (
                <div 
                  style={{ 
                    padding: '16px 20px', 
                    background: '#f8fafc', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {application.notes}
                </div>
              ) : (
                <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No application notes details recorded yet.
                </p>
              )}
            </div>

          </div>

          {/* Activity Timeline Card */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>
              Activity Timeline
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: '24px' }}>
              {/* Vertical connector line */}
              <div style={{
                position: 'absolute',
                left: '6px',
                top: '6px',
                bottom: '6px',
                width: '2px',
                backgroundColor: 'var(--border-color)',
                zIndex: 0
              }}></div>

              {timelineSteps.map((step, idx) => (
                <div key={idx} style={{ position: 'relative', marginBottom: idx === timelineSteps.length - 1 ? 0 : '24px' }}>
                  {/* Timeline circle point */}
                  <div style={{
                    position: 'absolute',
                    left: '-24px',
                    top: '4px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: step.color,
                    border: '3px solid #ffffff',
                    zIndex: 2,
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.05)'
                  }}></div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{step.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{step.date}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Manage Actions & Sidebar Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Actions Management Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MANAGE APPLICATION</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => onEdit(application)} 
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  borderRadius: '8px' 
                }}
              >
                <Edit size={16} />
                Edit Details
              </button>

              <button 
                onClick={handleArchiveClick} 
                className="btn btn-secondary"
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.02)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
              >
                <Archive size={16} />
                Archive Application
              </button>

              <button 
                onClick={() => onDelete(application)} 
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  borderRadius: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-rejected)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} />
                Delete Application
              </button>
            </div>
            
            {/* Strength Matching checklist mockup */}
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Application Strength</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>{strengthPercent}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', borderRadius: '4px', background: 'var(--border-color)', overflow: 'hidden' }}>
                <div style={{ width: `${strengthPercent}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Your profile matches {strengthPercent > 65 ? '4 out of 5' : '3 out of 5'} required skills for this role.
              </p>
            </div>
          </div>

          {/* About Company Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ABOUT {application.companyName.toUpperCase()}
            </h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {getCompanyDescription(application.companyName)}
            </p>
            <a 
              href={`https://google.com/search?q=${encodeURIComponent(application.companyName)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none'
              }}
            >
              <span>View Company Profile</span>
              <ChevronRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
