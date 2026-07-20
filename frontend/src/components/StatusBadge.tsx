import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeClass = (s: string) => {
    switch (s) {
      case 'Saved': return 'badge badge-saved';
      case 'Applied': return 'badge badge-applied';
      case 'Assessment': return 'badge badge-assessment';
      case 'Interview': return 'badge badge-interview';
      case 'Rejected': return 'badge badge-rejected';
      case 'Offer': return 'badge badge-offer';
      default: return 'badge';
    }
  };

  return (
    <span className={getBadgeClass(status)}>
      {status}
    </span>
  );
};

export default StatusBadge;
