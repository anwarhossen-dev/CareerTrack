import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LayoutDashboard, ListTodo, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setView(user ? 'dashboard' : 'landing')}>
          <Briefcase size={24} className="primary-icon" style={{ stroke: 'url(#primary-grad)' }} />
          <span>CareerTrack<span style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.8, marginLeft: '4px' }}>Lite</span></span>
        </div>

        {user ? (
          <div className="navbar-links">
            <button
              onClick={() => setView('dashboard')}
              className={`btn btn-secondary navbar-link ${currentView === 'dashboard' ? 'active' : ''}`}
              style={{ padding: '6px 12px', border: 'none', background: 'none' }}
            >
              <LayoutDashboard size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              <span style={{ verticalAlign: 'middle' }}>Dashboard</span>
            </button>
            <button
              onClick={() => setView('applications')}
              className={`btn btn-secondary navbar-link ${currentView === 'applications' ? 'active' : ''}`}
              style={{ padding: '6px 12px', border: 'none', background: 'none' }}
            >
              <ListTodo size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              <span style={{ verticalAlign: 'middle' }}>Applications</span>
            </button>
            <span className="user-tag">{user.name}</span>
            <button
              onClick={() => {
                logout();
                setView('landing');
              }}
              className="btn btn-danger"
              style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center' }}
            >
              <LogOut size={16} />
              <span style={{ marginLeft: '4px' }}>Logout</span>
            </button>
          </div>
        ) : (
          <div className="navbar-links">
            <button
              onClick={() => setView('login')}
              className={`btn btn-secondary ${currentView === 'login' ? 'active' : ''}`}
              style={{ padding: '6px 16px' }}
            >
              Log In
            </button>
            <button
              onClick={() => setView('register')}
              className="btn btn-primary"
              style={{ padding: '6px 16px' }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
      
      {/* SVG Gradient definition for Lucide icons */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </svg>
    </nav>
  );
};

export default Navbar;
