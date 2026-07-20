import React from 'react';
import { 
  Briefcase, BarChart3, List, Bell, Play, ArrowRight 
} from 'lucide-react';

interface LandingProps {
  setView: (view: string) => void;
  isAuthenticated: boolean;
}

const Landing: React.FC<LandingProps> = ({ setView, isAuthenticated }) => {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', width: '100%' }}>
      {/* Mockup Top Header Navbar */}
      <header 
        style={{ 
          height: '80px', 
          borderBottom: '1px solid var(--border-color)', 
          padding: '0 40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Briefcase size={28} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
            CareerTrack<span style={{ fontWeight: 400, opacity: 0.8 }}>Lite</span>
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none', fontSize: '0.95rem' }}>Features</a>
          <button 
            onClick={() => setView(isAuthenticated ? 'dashboard' : 'login')} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Dashboard
          </button>
          
          {isAuthenticated ? (
            <button 
              onClick={() => setView('dashboard')} 
              className="btn btn-primary"
              style={{ borderRadius: '8px', padding: '8px 20px', fontSize: '0.9rem' }}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button 
                onClick={() => setView('login')} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', fontSize: '0.95rem' }}
              >
                Login
              </button>
              <button 
                onClick={() => setView('register')} 
                className="btn btn-primary"
                style={{ borderRadius: '8px', padding: '8px 20px', fontSize: '0.9rem' }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Hero Container */}
      <div 
        style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '80px 40px', 
          display: 'grid', 
          gridTemplateColumns: '1.1fr 0.9fr', 
          gap: '60px', 
          alignItems: 'center' 
        }}
      >
        {/* Left Column: Hero Text */}
        <div>
          <h1 
            style={{ 
              fontSize: '3.1rem', 
              fontWeight: 800, 
              color: 'var(--text-primary)', 
              lineHeight: '1.15', 
              letterSpacing: '-0.02em', 
              marginBottom: '20px',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            Track your job applications, organize your search, and land your next role.
          </h1>
          <p 
            style={{ 
              fontSize: '1.15rem', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6', 
              marginBottom: '32px',
              maxWidth: '520px'
            }}
          >
            The minimal, high-efficiency dashboard designed to help you navigate your career transition without the clutter.
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setView(isAuthenticated ? 'dashboard' : 'register')} 
              className="btn btn-primary"
              style={{ 
                padding: '14px 28px', 
                fontSize: '1rem', 
                fontWeight: 600, 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
              <ArrowRight size={18} />
            </button>
            
            <a 
              href="#features" 
              className="btn btn-secondary"
              style={{ 
                padding: '14px 24px', 
                fontSize: '1rem', 
                fontWeight: 600, 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                background: 'rgba(0,0,0,0.02)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                textDecoration: 'none'
              }}
            >
              <Play size={16} fill="var(--text-secondary)" />
              See How It Works
            </a>
          </div>
        </div>

        {/* Right Column: Mini Dashboard Preview Mockup Card */}
        <div style={{ position: 'relative' }}>
          <div 
            style={{ 
              background: '#f8fafc', 
              border: '1px solid var(--border-color)', 
              borderRadius: '16px', 
              padding: '24px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
              transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Mockup header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }}></span>
              </div>
              <div style={{ height: '8px', width: '80px', borderRadius: '4px', background: 'rgba(0,0,0,0.05)' }}></div>
            </div>

            {/* Mockup body statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', borderLeft: '3px solid var(--primary)' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Total</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>47</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', borderLeft: '3px solid #ea580c' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Interviews</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>8</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', borderLeft: '3px solid #16a34a' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Offers</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>2</div>
              </div>
            </div>

            {/* Mockup list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Google</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Software Engineer</div>
                </div>
                <span style={{ fontSize: '0.65rem', background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>Interview</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Stripe</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Frontend Dev</div>
                </div>
                <span style={{ fontSize: '0.65rem', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>Offer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Showcase Section */}
      <section 
        id="features" 
        style={{ 
          backgroundColor: '#f8fafc', 
          borderTop: '1px solid var(--border-color)', 
          padding: '80px 40px' 
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 
              style={{ 
                fontSize: '2rem', 
                fontWeight: 800, 
                color: 'var(--text-primary)', 
                marginBottom: '12px',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              Everything you need to stay ahead
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
              Focus on your skills, let us handle the logistics of your job hunt.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {/* Card 1 */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '10px', 
                  background: 'rgba(2, 86, 214, 0.08)', 
                  color: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '20px' 
                }}
              >
                <List size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Centralized Tracking
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                Keep all your applications, interview notes, and contact details organized in one centralized hub.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '10px', 
                  background: 'rgba(99, 102, 241, 0.08)', 
                  color: 'var(--color-applied)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '20px' 
                }}
              >
                <Bell size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Status Updates
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                Track your progress across multiple recruitment stages, from initial application to final offer.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '10px', 
                  background: 'rgba(22, 163, 74, 0.08)', 
                  color: 'var(--color-offer)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '20px' 
                }}
              >
                <BarChart3 size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Statistics & Insights
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                Visualize your application history with key metrics that help you optimize your conversion rates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
