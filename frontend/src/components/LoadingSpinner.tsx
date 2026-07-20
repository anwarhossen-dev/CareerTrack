import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  label?: string;
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  label = 'Loading...', 
  fullHeight = false 
}) => {
  const content = (
    <div style={{ textAlign: 'center', padding: '24px' }}>
      <Loader2 
        size={size} 
        className="animate-spin" 
        style={{ 
          color: 'var(--primary)', 
          animation: 'spin 1s linear infinite', 
          marginBottom: label ? '12px' : 0,
          display: 'inline-block' 
        }} 
      />
      {label && <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{label}</p>}
    </div>
  );

  if (fullHeight) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', width: '100%' }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
