import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import type { ApplicationsRef } from './pages/Applications';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setView] = useState<string>('landing');
  const [toast, setToast] = useState<Toast | null>(null);
  
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

  // Callback to trigger Add Application Modal from Dashboard
  const triggerAddApplication = () => {
    setView('applications');
    // Allow React time to switch view and mount/render the Applications component
    setTimeout(() => {
      if (applicationsRef.current) {
        applicationsRef.current.openAddModal();
      }
    }, 100);
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
            showToast={showToast} 
            onAddApplicationClick={triggerAddApplication} 
          />
        );
      case 'applications':
        return (
          <Applications 
            ref={applicationsRef} 
            showToast={showToast} 
          />
        );
      default:
        return <NotFound setView={setView} />;
    }
  };

  return (
    <div className="app-layout">
      <Navbar currentView={currentView} setView={setView} />
      
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
