import { Clock, Lock, ChevronRight, MessageSquare, FileText, Heart, Trash2, Search as SearchIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import { supabase } from '../lib/supabase';
import { getAvatar } from '../data/avatars';
import BottomNav from '../components/ui/BottomNav';
import './Dashboard.css';
import '../skeleton.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useStore(s => s.user);
  const heartscripts = useStore(s => s.heartscripts);
  const fetchDashboardScripts = useStore(s => s.fetchDashboardScripts);
  const revokeHeartScript = useStore(s => s.revokeHeartScript);
  const isLoading = useStore(s => s.isLoading);
  const avatar = getAvatar(user?.avatarId || 1);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Show search if more than 5 items
  const isSearchVisible = heartscripts.length > 5;

  const filteredScripts = heartscripts.filter(h => 
    h.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.tone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchDashboardScripts();

    if (!user?.username) return;

    const channel = supabase
      .channel('public:heartscripts')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'heartscripts',
        filter: `sender=eq.${user.username}`
      }, (payload) => {
        if (payload.new.response && payload.new.response !== payload.old.response) {
          toast.success('Someone responded to your HeartScript! 💌', { duration: 5000 });
        }
        fetchDashboardScripts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDashboardScripts, user?.username]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="dashboard-page"
    >
      {/* Header */}
      <header className="dash-header">
        <div>
          <p className="dash-greeting">Hello,</p>
          <h1 className="dash-username">{user?.username || 'Sweetheart'}</h1>
        </div>
        <button className="dash-avatar" onClick={() => navigate('/profile')}>
          <span className="dash-avatar-emoji">{avatar.emoji}</span>
        </button>
      </header>

      {/* Section label */}
      <div className="dash-section-header">
        <span className="text-label">
          {searchQuery ? 'Search results' : (isSearchVisible ? 'Search your HeartScripts' : 'Your HeartScripts')}
        </span>
        <span className="text-label">{filteredScripts.length}</span>
      </div>

      {/* Search Bar */}
      {isSearchVisible && (
        <div className="dash-search">
          <SearchIcon size={18} className="dash-search-icon" />
          <input 
            type="text" 
            placeholder="Search by message, sender or tone..."
            className="dash-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Content */}
      <main className="dash-content">
        {isLoading ? (
          <div className="dash-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="dash-card card skeleton-card">
                <div className="skeleton-icon skeleton-shimmer" />
                <div className="dash-card-body">
                  <div className="skeleton-text skeleton-shimmer" style={{ width: '40%', marginBottom: 8 }} />
                  <div className="skeleton-text skeleton-shimmer" style={{ width: '90%', marginBottom: 12 }} />
                  <div className="skeleton-text skeleton-shimmer" style={{ width: '30%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : heartscripts.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">
              <Heart size={48} stroke="var(--soft-coral)" strokeWidth={1} />
            </div>
            <h3 className="dash-empty-title">No messages sent yet</h3>
            <p className="dash-empty-desc">Your first HeartScript is just a tap away.</p>
            <button className="btn-primary" onClick={() => navigate('/create')} style={{ marginTop: 24 }}>
              Create HeartScript
            </button>
          </div>
        ) : (
          <div className="dash-list">
            {filteredScripts.map((h, index) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="dash-card card card-interactive"
                onClick={() => navigate(`/view/${h.id}`)}
              >
                <div className="dash-card-icon" data-type={h.type}>
                  {h.type === 'pop_question' ? <MessageSquare size={22} /> : <FileText size={22} />}
                </div>

                <div className="dash-card-body">
                  <div className="dash-card-top">
                    <span className="dash-card-tone">{h.tone} Tone</span>
                    {h.response ? (
                      <span className="badge" style={{ background: '#E2E8F0', color: '#64748B' }}>Replied</span>
                    ) : (
                      <span className="badge badge-live">
                        <span className="badge-dot" />
                        Live
                      </span>
                    )}
                  </div>
                  <p className="dash-card-content truncate">{h.content}</p>
                  <div className="dash-card-meta">
                    <span className="dash-card-date">
                      <Clock size={12} />
                      {new Date(h.created_at).toLocaleDateString()}
                    </span>
                    {h.is_locked && (
                      <span className="dash-card-locked">
                        <Lock size={12} />
                        Locked
                      </span>
                    )}
                    {h.opened_at && !h.response && (
                      <span className="dash-card-date" style={{ color: 'var(--positive-green)', fontWeight: 600 }}>
                        <Heart size={10} fill="var(--positive-green)" /> Read
                      </span>
                    )}
                  </div>
                </div>

                {!h.opened_at ? (
                  <button 
                    style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 10 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to revoke this message? It will be permanently deleted from the cloud.")) {
                        revokeHeartScript(h.id).then(success => {
                           if (success) toast.success("Message revoked successfully");
                           else toast.error("Could not revoke message");
                        });
                      }
                    }}
                  >
                    <Trash2 size={18} stroke="var(--soft-coral)" />
                  </button>
                ) : (
                  <ChevronRight size={18} className="dash-card-arrow" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </motion.div>
  );
}
