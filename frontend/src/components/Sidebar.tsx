import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, Briefcase, PlusCircle, User, LogOut 
} from 'lucide-react';

interface SidebarProps {
  setView: (view: string) => void;
  activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setView, activeView }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setView('landing');
  };

  const handleAddClick = () => {
    setView('add-application');
  };

  // Only render sidebar if user is authenticated
  if (!user) return null;

  return (
    <aside className="sidebar">
      {/* Sidebar Brand Header */}
      <div className="sidebar-logo">
        <Briefcase size={28} style={{ color: 'var(--primary)' }} />
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>
            CareerTrack<span style={{ fontWeight: 400, opacity: 0.8 }}>Lite</span>
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Professional Tracker
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-menu">
        <button 
          onClick={() => setView('dashboard')}
          className={`sidebar-item ${activeView === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button 
          onClick={() => setView('applications')}
          className={`sidebar-item ${activeView === 'applications' ? 'active' : ''}`}
        >
          <Briefcase size={18} />
          Applications
        </button>

        <button 
          onClick={handleAddClick}
          className="sidebar-item"
        >
          <PlusCircle size={18} />
          Add New
        </button>

        <button 
          onClick={() => setView('profile')}
          className={`sidebar-item ${activeView === 'profile' ? 'active' : ''}`}
        >
          <User size={18} />
          Profile
        </button>

        <button 
          onClick={handleLogout}
          className="sidebar-item"
          style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}
        >
          <LogOut size={18} style={{ color: 'var(--color-rejected)' }} />
          <span style={{ color: 'var(--color-rejected)' }}>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
