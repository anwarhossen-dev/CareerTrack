import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, Settings } from 'lucide-react';

interface HeaderProps {
  activeView: string;
}

const Header: React.FC<HeaderProps> = ({ activeView }) => {
  const { user } = useAuth();

  if (!user) return null;

  const getGreeting = () => {
    switch (activeView) {
      case 'dashboard':
        return `Welcome back, ${user.name}!`;
      case 'applications':
        return 'Job Applications';
      case 'profile':
        return 'My Profile';
      default:
        return 'CareerTrack Lite';
    }
  };

  // Static avatar image or letter circle
  const initials = user.name.charAt(0).toUpperCase();

  return (
    <header className="header-bar">
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {getGreeting()}
        </h2>
      </div>

      <div className="header-user">
        <button className="header-icon-btn" title="Notifications">
          <Bell size={18} />
        </button>
        <button className="header-icon-btn" title="Settings">
          <Settings size={18} />
        </button>
        
        {/* User Profile Avatar Mockup */}
        <div 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            background: 'var(--primary)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          title={user.name}
        >
          {initials}
        </div>
      </div>
    </header>
  );
};

export default Header;
