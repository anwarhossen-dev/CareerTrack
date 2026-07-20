import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../api/auth.api';
import { AlertCircle, LogIn, Loader2 } from 'lucide-react';

interface LoginProps {
  setView: (view: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const Login: React.FC<LoginProps> = ({ setView, showToast }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);

    try {
      const data = await loginUser(email, password);
      login(data.token, data.user);
      showToast('Logged in successfully!', 'success');
      setView('dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper animate-fade-in">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Log in to manage your job applications</p>
        </div>

        {error && (
          <div className="form-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Logging In...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Log In
              </>
            )}
          </button>
        </form>

        <p className="auth-footer-link">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setView('register'); }}>
            Sign up
          </a>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
