import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Heart, ChevronRight, MessageSquare, FileText, Clock } from 'lucide-react';
import useStore from '../store/useStore';
import BottomNav from '../components/ui/BottomNav';
import './Dashboard.css'; // Reuse dashboard styles for consistency
import '../skeleton.css';

export default function Alerts() {
  const navigate = useNavigate();
  const heartscripts = useStore(s => s.heartscripts);
  const fetchDashboardScripts = useStore(s => s.fetchDashboardScripts);
  const isLoading = useStore(s => s.isLoading);

  // Filter for only ones with a response
  const alerts = heartscripts.filter(h => h.response);

  useEffect(() => {
    fetchDashboardScripts();
  }, [fetchDashboardScripts]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="dashboard-page"
    >
      <header className="dash-header">
        <div>
          <p className="dash-greeting">Your Notifications</p>
          <h1 className="dash-username">Alerts</h1>
        </div>
        <div className="dash-avatar" style={{ background: 'rgba(255, 77, 109, 0.1)', color: 'var(--rose-red)' }}>
          <Bell size={24} />
        </div>
      </header>

      <div className="dash-section-header">
        <span className="text-label">Responses Received</span>
        <span className="text-label">{alerts.length}</span>
      </div>

      <main className="dash-content">
        {isLoading ? (
          <div className="dash-list">
             <div className="dash-card card skeleton-card">
                <div className="skeleton-icon skeleton-shimmer" />
                <div className="dash-card-body">
                   <div className="skeleton-text skeleton-shimmer" style={{ width: '40%', marginBottom: 8 }} />
                </div>
             </div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">
              <Bell size={48} stroke="var(--soft-coral)" strokeWidth={1} />
            </div>
            <h3 className="dash-empty-title">No alerts yet</h3>
            <p className="dash-empty-desc">When someone responds to your HeartScript, it will appear here.</p>
          </div>
        ) : (
          <div className="dash-list">
            {alerts.map((h, index) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="dash-card card card-interactive"
                onClick={() => navigate(`/view/${h.id}`)}
              >
                <div className="dash-card-icon" data-type={h.type} style={{ background: 'var(--positive-green)', color: 'white' }}>
                  {h.type === 'pop_question' ? <MessageSquare size={22} /> : <FileText size={22} />}
                </div>

                <div className="dash-card-body">
                  <div className="dash-card-top">
                    <span className="dash-card-tone">{h.tone} Tone</span>
                    <span className="badge badge-rose">New Response</span>
                  </div>
                  <p className="dash-card-content truncate">
                    <strong>{h.sender}:</strong> {h.response === 'yes' ? 'Said Yes! ❤️' : h.response === 'no' ? 'Said No ❌' : 'Replied to your message'}
                  </p>
                  <div className="dash-card-meta">
                    <span className="dash-card-date">
                      <Clock size={12} />
                      {new Date(h.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} className="dash-card-arrow" />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </motion.div>
  );
}
