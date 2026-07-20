import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Mail, Shield, Award, Bookmark, Briefcase } from 'lucide-react';

interface ProfileProps {
  setView: (view: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ setView }) => {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.name.charAt(0).toUpperCase();

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          My Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
          Manage your account information and preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* User Card */}
        <div className="glass-card" style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
          {/* Large Avatar */}
          <div 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'var(--primary-gradient)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: 800,
              boxShadow: '0 4px 10px rgba(2, 86, 214, 0.2)'
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              {user.name}
            </h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={14} />
                {user.email}
              </span>
              <span style={{ height: '12px', width: '1px', background: 'var(--border-color)' }}></span>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                padding: '2px 10px', 
                borderRadius: '12px', 
                background: user.role === 'ADMIN' ? 'rgba(2, 86, 214, 0.08)' : 'rgba(71, 85, 105, 0.08)',
                color: user.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Shield size={12} />
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Credentials and Meta details */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} style={{ color: 'var(--primary)' }} />
            Developer Info & Credentials
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Developer Name</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>MD. Anwar hossen</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Student ID</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>22-48211-3</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Course Details</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Advanced Agentic Web App Coding (LeadBond AI)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Application Stack</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>React</span>
                <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>TypeScript</span>
                <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Vite</span>
                <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Express</span>
                <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Prisma</span>
                <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>PostgreSQL</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Shortcut Navigation */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => setView('dashboard')}
            className="btn btn-primary"
            style={{ padding: '12px 20px', borderRadius: '8px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Bookmark size={16} />
            Go to Dashboard
          </button>
          
          <button 
            onClick={() => setView('applications')}
            className="btn btn-secondary"
            style={{ padding: '12px 20px', borderRadius: '8px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <Briefcase size={16} />
            Manage Applications
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
