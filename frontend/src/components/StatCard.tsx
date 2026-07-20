import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  type: 'total' | 'saved' | 'applied' | 'assessment' | 'interview' | 'rejected' | 'offer';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, type }) => {
  const getCardClass = () => {
    switch (type) {
      case 'total': return 'stat-card stat-total';
      case 'saved': return 'stat-card stat-saved';
      case 'applied': return 'stat-card stat-applied';
      case 'assessment': return 'stat-card stat-assessment';
      case 'interview': return 'stat-card stat-interview';
      case 'rejected': return 'stat-card stat-rejected';
      case 'offer': return 'stat-card stat-offer';
      default: return 'stat-card';
    }
  };

  return (
    <div className={getCardClass()} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 20px' }}>
      <div className="stat-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        {label}
      </div>
      <div className="stat-val" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;
