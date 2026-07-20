import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import type { ApplicationsRef } from './pages/Applications';
import AddEditApplication from './pages/AddEditApplication';
import ApplicationDetails from './pages/ApplicationDetails';
import Profile from './pages/Profile';
import { deleteApplication } from './api/applications.api';
import type { Application } from './types';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';
import { CheckCircle2, AlertCircle, Briefcase } from 'lucide-react';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setView] = useState<string>('landing');
  const [toast, setToast] = useState<Toast | null>(null);
  
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  
  const applicationsRef = useRef<ApplicationsRef>(null);

  // Show Toast Utility
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle protected page routing redirects
  useEffect(() => {
    if (loading) return;

    const authViews = ['login', 'register', 'landing'];
    const protectedViews = ['dashboard', 'applications'];

    if (!user && protectedViews.includes(currentView)) {
      // Redirect unauthenticated user
      setView('landing');
    } else if (user && authViews.includes(currentView)) {
      // Redirect authenticated user
      setView('dashboard');
    }
  }, [user, currentView, loading]);

  // Callback to trigger Add Application Page from Dashboard
  const triggerAddApplication = () => {
    setEditApp(null);
    setView('add-application');
  };

  const renderActiveView = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <Loader2Spinner />
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Initializing application...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'landing':
        return <Landing setView={setView} isAuthenticated={!!user} />;
      case 'login':
        return <Login setView={setView} showToast={showToast} />;
      case 'register':
        return <Register setView={setView} showToast={showToast} />;
      case 'dashboard':
        return (
          <Dashboard 
            setView={setView} 
            onAddApplicationClick={triggerAddApplication} 
          />
        );
      case 'applications':
        return (
          <Applications 
            ref={applicationsRef} 
            showToast={showToast} 
            setView={setView}
            setSelectedApp={setSelectedApp}
            setEditApp={setEditApp}
          />
        );
      case 'add-application':
        return (
          <AddEditApplication 
            setView={setView} 
            showToast={showToast} 
            initialData={null}
            refreshList={() => {
              if (applicationsRef.current) {
                applicationsRef.current.refreshList();
              }
            }}
          />
        );
      case 'edit-application':
        return (
          <AddEditApplication 
            setView={setView} 
            showToast={showToast} 
            initialData={editApp}
            refreshList={() => {
              if (applicationsRef.current) {
                applicationsRef.current.refreshList();
              }
            }}
          />
        );
      case 'application-details':
        return (
          <ApplicationDetails 
            application={selectedApp} 
            setView={setView} 
            onEdit={(app) => {
              setEditApp(app);
              setView('edit-application');
            }}
            onDelete={async (app) => {
              try {
                await deleteApplication(app.id);
                showToast('Application deleted successfully', 'success');
                setView('applications');
              } catch (err: any) {
                showToast(err.message || 'Failed to delete application', 'error');
              }
            }}
            showToast={showToast}
          />
        );
      case 'profile':
        return <Profile setView={setView} />;
      default:
        return <NotFound setView={setView} />;
    }
  };

  // Authenticated Dashboard Layout
  if (user) {
    return (
      <div className="app-container">
        <Sidebar 
          setView={setView} 
          activeView={currentView} 
        />
        <div className="main-content-pane">
          <Header activeView={currentView} />
          <main style={{ flex: 1, padding: '24px 32px 40px', display: 'flex', flexDirection: 'column' }}>
            {renderActiveView()}
          </main>
          <Footer />
        </div>
        
        {/* Floating Toast Notification */}
        {toast && (
          <div className="toast-container">
            <div className={`toast toast-${toast.type}`}>
              {toast.type === 'success' ? (
                <CheckCircle2 size={20} style={{ color: 'var(--color-offer)' }} />
              ) : (
                <AlertCircle size={20} style={{ color: 'var(--color-rejected)' }} />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Unauthenticated Guest Layout (Landing, Login, Register)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {currentView !== 'landing' && (
        <header style={{ height: '70px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 24px', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={26} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
              CareerTrack<span style={{ fontWeight: 400, opacity: 0.8 }}>Lite</span>
            </h2>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
            <button onClick={() => setView('login')} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Log In</button>
            <button onClick={() => setView('register')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Sign Up</button>
          </div>
        </header>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderActiveView()}
      </main>

      <Footer />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} style={{ color: 'var(--color-offer)' }} />
            ) : (
              <AlertCircle size={20} style={{ color: 'var(--color-rejected)' }} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper spin loader component
const Loader2Spinner = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="40" 
    height="40" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="animate-spin"
    style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite', display: 'inline-block' }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const App: React.FC = () => {
  return <AppContent />;
};

export default App;
