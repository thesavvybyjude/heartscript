import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import useStore from '../store/useStore';
import './Splash.css';

export default function Splash() {
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();
  const user = useStore(s => s.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigate('/dashboard');
      } else {
        setShowButton(true);
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="splash-page">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="splash-content"
      >
        <div className="splash-icon-box animate-pulse">
          <Heart size={64} fill="var(--rose-red)" stroke="var(--rose-red)" />
        </div>

        <h1 className="splash-title">HeartScript</h1>
        <p className="splash-subtitle">Write words that matter.</p>
      </motion.div>

      <div className="splash-button-area">
        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="splash-cta"
              onClick={() => navigate('/login')}
            >
              Create a HeartScript
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating hearts decoration */}
      <div className="splash-hearts">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="splash-heart-float"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: -200, opacity: [0, 0.4, 0] }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeOut',
            }}
            style={{ left: `${15 + i * 13}%` }}
          >
            <Heart size={12 + i * 3} fill="white" stroke="none" opacity={0.3} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
