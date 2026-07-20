import React from 'react';
import { 
  Bookmark, Send, ClipboardCheck, Calendar, XCircle, Trophy, Layers 
} from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  type: 'total' | 'saved' | 'applied' | 'assessment' | 'interview' | 'rejected' | 'offer';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, type }) => {
  const getIcon = () => {
    const size = 20;
    switch (type) {
      case 'total': return <Layers size={size} style={{ color: 'var(--text-primary)' }} />;
      case 'saved': return <Bookmark size={size} style={{ color: 'var(--color-saved)' }} />;
      case 'applied': return <Send size={size} style={{ color: 'var(--color-applied)' }} />;
      case 'assessment': return <ClipboardCheck size={size} style={{ color: 'var(--color-assessment)' }} />;
      case 'interview': return <Calendar size={size} style={{ color: 'var(--color-interview)' }} />;
      case 'rejected': return <XCircle size={size} style={{ color: 'var(--color-rejected)' }} />;
      case 'offer': return <Trophy size={size} style={{ color: 'var(--color-offer)' }} />;
      default: return null;
    }
  };

  const getCardClass = () => {
    switch (type) {
      case 'total': return 'glass-card stat-card stat-total card-scale';
      case 'saved': return 'glass-card stat-card stat-saved card-scale';
      case 'applied': return 'glass-card stat-card stat-applied card-scale';
      case 'assessment': return 'glass-card stat-card stat-assessment card-scale';
      case 'interview': return 'glass-card stat-card stat-interview card-scale';
      case 'rejected': return 'glass-card stat-card stat-rejected card-scale';
      case 'offer': return 'glass-card stat-card stat-offer card-scale';
      default: return 'glass-card stat-card card-scale';
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'saved': return 'var(--color-saved)';
      case 'applied': return 'var(--color-applied)';
      case 'assessment': return 'var(--color-assessment)';
      case 'interview': return 'var(--color-interview)';
      case 'rejected': return 'var(--color-rejected)';
      case 'offer': return 'var(--color-offer)';
      default: return 'var(--text-primary)';
    }
  };

  return (
    <div className={getCardClass()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '38px', 
          height: '38px', 
          borderRadius: '50%', 
          background: 'rgba(255, 255, 255, 0.03)', 
          marginBottom: '8px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        {getIcon()}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-val" style={{ color: getValueColor(), fontSize: '1.75rem', fontWeight: 800 }}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;
