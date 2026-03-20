import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import useStore from './store/useStore';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Wizard from './pages/Wizard';
import Profile from './pages/Profile';
import ViewHeartScript from './pages/ViewHeartScript';
import Alerts from './pages/Alerts';
import { useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const user = useStore(s => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login?returnUrl=${location.pathname}`} replace />;
  }
  return children;
}

function App() {
  const location = useLocation();
  const initializeAuth = useStore(s => s.initializeAuth);
  const isInitializing = useStore(s => s.isInitializing);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitializing) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--warm-ivory)' }}>
        <div className="skeleton-icon skeleton-shimmer" style={{ width: 64, height: 64, borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Toaster position="bottom-center" toastOptions={{ className: 'hs-toast' }} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><Wizard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="/view/:id" element={<ViewHeartScript />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
