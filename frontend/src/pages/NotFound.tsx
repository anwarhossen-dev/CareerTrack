import React from 'react';
import { FileQuestion, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NotFoundProps {
  setView: (view: string) => void;
}

const NotFound: React.FC<NotFoundProps> = ({ setView }) => {
  const { user } = useAuth();

  return (
    <div className="container page-container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="glass-card" style={{ padding: '48px 32px', textAlign: 'center', maxWidth: '480px', width: '100%' }}>
        <div style={{ 
          display: 'inline-flex', 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          background: 'rgba(239, 68, 68, 0.1)', 
          color: 'var(--color-rejected)', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: '20px' 
        }}>
          <FileQuestion size={36} />
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>404 - Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '0.95rem' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button 
          onClick={() => setView(user ? 'dashboard' : 'landing')} 
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          <Home size={18} />
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
