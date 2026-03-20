import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Shield, Globe, HelpCircle, LogOut } from 'lucide-react';
import useStore from '../store/useStore';
import { AVATARS, getAvatar } from '../data/avatars';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const user = useStore(s => s.user);
  const updateProfile = useStore(s => s.updateProfile);
  const logout = useStore(s => s.logout);
  const [username, setUsername] = useState(user?.username || '');

  const currentAvatar = getAvatar(user?.avatarId || 1);

  const handleAvatarSelect = (id) => {
    updateProfile({ avatarId: id });
  };

  const handleUsernameBlur = () => {
    if (username.trim()) {
      updateProfile({ username: username.trim() });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const settingsItems = [
    { icon: Heart, label: 'HeartScripts', action: () => navigate('/dashboard') },
    { icon: Shield, label: 'Privacy & Security', action: () => {} },
    { icon: Globe, label: 'Language', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="profile-page"
    >
      <header className="profile-header">
        <button className="wizard-back" onClick={() => navigate('/dashboard')}>
          <ChevronLeft size={22} />
        </button>
        <span className="text-label" style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}>Profile</span>
        <div style={{ width: 44 }} />
      </header>

      <div className="profile-body">
        {/* Avatar display */}
        <div className="profile-avatar-display">
          <div className="profile-avatar-large" style={{ background: currentAvatar.bg }}>
            <span>{currentAvatar.emoji}</span>
          </div>
          <div className="profile-heart-badge">
            <Heart size={12} fill="white" stroke="white" />
          </div>
        </div>

        {/* Avatar grid */}
        <div className="profile-section">
          <span className="text-label">Choose your avatar</span>
          <div className="profile-avatar-grid">
            {AVATARS.map(a => (
              <motion.button
                key={a.id}
                whileTap={{ scale: 0.9 }}
                className={`profile-avatar-option ${user?.avatarId === a.id ? 'selected' : ''}`}
                style={{ background: a.bg }}
                onClick={() => handleAvatarSelect(a.id)}
              >
                <span>{a.emoji}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Username */}
        <div className="profile-section">
          <span className="text-label">Username</span>
          <input
            type="text"
            className="input-field"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onBlur={handleUsernameBlur}
            placeholder="Your username"
          />
        </div>

        {/* Settings */}
        <div className="profile-section">
          <span className="text-label">Settings</span>
          <div className="profile-settings-list">
            {settingsItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={i} className="profile-settings-item" onClick={item.action}>
                  <div className="profile-settings-icon">
                    <Icon size={18} />
                  </div>
                  <span>{item.label}</span>
                  <ChevronLeft size={16} style={{ transform: 'rotate(180deg)', marginLeft: 'auto', opacity: 0.3 }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <button className="profile-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>

        <p className="profile-version">HeartScript v1.0</p>
      </div>
    </motion.div>
  );
}
