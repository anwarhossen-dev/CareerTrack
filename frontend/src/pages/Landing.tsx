import React from 'react';
import { Briefcase, BarChart3, Search, ShieldCheck, ArrowRight } from 'lucide-react';

interface LandingProps {
  setView: (view: string) => void;
  isAuthenticated: boolean;
}

const Landing: React.FC<LandingProps> = ({ setView, isAuthenticated }) => {
  return (
    <div className="container page-container animate-fade-in">
      <div className="hero">
        <div className="logo" style={{ fontSize: '2rem', marginBottom: '8px' }}>
          <Briefcase size={40} className="primary-icon" style={{ stroke: 'url(#primary-grad)' }} />
          <span style={{ fontSize: '2rem' }}>CareerTrack<span style={{ fontWeight: 400, opacity: 0.8 }}>Lite</span></span>
        </div>
        <h1 className="hero-title">
          Track Your Job Search. <br />
          <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Elevate Your Career.
          </span>
        </h1>
        <p className="hero-subtitle">
          An elegant, full-stack job application tracker built to streamline your interviews, optimize follow-ups, and accelerate your job search.
        </p>
        
        <div style={{ marginTop: '16px' }}>
          {isAuthenticated ? (
            <button onClick={() => setView('dashboard')} className="btn btn-primary">
              Go to Dashboard
              <ArrowRight size={18} />
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setView('register')} className="btn btn-primary">
                Get Started Free
                <ArrowRight size={18} />
              </button>
              <button onClick={() => setView('login')} className="btn btn-secondary">
                Log In
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="features-grid">
        <div className="glass-card feature-card">
          <div className="feature-icon">
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Secure JWT Authentication</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Your credentials and job search data are fully isolated. Password hashing with bcrypt ensures robust protection for your account.
          </p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon">
            <BarChart3 size={24} />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Dashboard Analytics</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Visualize your application flow with stats showing total jobs, applications, pending assessments, scheduled interviews, and offers.
          </p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon">
            <Search size={24} />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Search & Filter</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Instantly search by company or position, and filter your lists by status or source to keep track of every conversation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
