import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, Chrome, Apple } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import './Login.css';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const login = useStore(s => s.login);

  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('returnUrl');

  useState(() => {
    if (returnUrl) {
      setIsSignUp(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (isSignUp) {
      if (!username.trim()) { toast.error('Username is required'); return; }
      if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
      if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    }

    const attemptLogin = async () => {
      setLoading(true);
      try {
        await login({
          email,
          password,
          isSignUp,
          username: isSignUp ? username.trim() : null,
        });
        toast.success(isSignUp ? 'Account created' : 'Welcome back');
        navigate(returnUrl || '/dashboard');
      } catch (err) {
        toast.error(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    attemptLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="login-page"
    >
      <header className="login-header">
        <button onClick={() => navigate('/')} className="login-back">
          <Heart size={24} fill="var(--soft-coral)" stroke="var(--soft-coral)" />
        </button>
        <span className="login-brand">HeartScript</span>
        <div style={{ width: 40 }} />
      </header>

      <div className="login-body">
        <h1 className="login-title">Welcome</h1>
        <p className="login-desc">Please enter your details to continue.</p>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${!isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(false); setError(''); }}
          >
            Sign In
            {!isSignUp && <motion.div layoutId="tab-indicator" className="login-tab-bar" />}
          </button>
          <button
            className={`login-tab ${isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(true); setError(''); }}
          >
            Sign Up
            {isSignUp && <motion.div layoutId="tab-indicator" className="login-tab-bar" />}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-with-icon">
            <Mail size={20} className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {isSignUp && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="input-with-icon"
            >
              <User size={20} className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                className="input-field"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </motion.div>
          )}

          <div className="input-with-icon">
            <Lock size={20} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {isSignUp && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="input-with-icon"
            >
              <Lock size={20} className="input-icon" />
              <input
                type="password"
                placeholder="Confirm password"
                className="input-field"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </motion.div>
          )}



          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <div className="spinner" />
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="login-divider">
          <div className="login-divider-line" />
          <span className="login-divider-text">Or continue with</span>
          <div className="login-divider-line" />
        </div>

        <div className="login-social">
          <button className="btn-outline" onClick={handleSubmit}>
            <Chrome size={20} /> Google
          </button>
          <button className="btn-outline" onClick={handleSubmit}>
            <Apple size={20} /> Apple
          </button>
        </div>
      </div>
    </motion.div>
  );
}
