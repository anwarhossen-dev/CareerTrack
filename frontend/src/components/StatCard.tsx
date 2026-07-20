import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  type: 'total' | 'saved' | 'applied' | 'assessment' | 'interview' | 'rejected' | 'offer';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, type }) => {
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
    <div className={getCardClass()}>
      <div className="stat-label">{label}</div>
      <div className="stat-val" style={{ color: getValueColor() }}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;
