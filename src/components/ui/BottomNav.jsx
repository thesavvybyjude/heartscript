import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, PlusCircle, Search, Bell, User } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const items = [
    { icon: Home, label: 'Home', to: '/dashboard' },
    { icon: Search, label: 'Search', to: '/dashboard' },
    { icon: null, label: 'Create', to: '/create' }, // center fab
    { icon: Bell, label: 'Alerts', to: '/dashboard' },
    { icon: User, label: 'Profile', to: '/profile' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item, i) => {
        if (item.icon === null) {
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.88 }}
              className="bottom-nav-create"
              onClick={() => navigate(item.to)}
            >
              <PlusCircle size={28} />
            </motion.button>
          );
        }
        const Icon = item.icon;
        const isActive = path === item.to;
        return (
          <button
            key={i}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.to)}
          >
            <Icon size={22} />
            <span className="bottom-nav-item-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
