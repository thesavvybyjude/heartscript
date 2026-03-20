import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, X } from 'lucide-react';
import useStore from '../store/useStore';
import { getTone } from '../data/tones';
import SlideToOpen from '../components/ui/SlideToOpen';
import { decryptMessage } from '../utils/crypto';
import { playSoundscape } from '../data/soundscapes';
import './ViewHeartScript.css';

export default function ViewHeartScript() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchHeartScript = useStore(s => s.fetchHeartScript);
  const addResponse = useStore(s => s.addResponse);
  const updateOpenedAt = useStore(s => s.updateOpenedAt);

  const [heartscript, setHeartscript] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [decryptedContent, setDecryptedContent] = useState('');
  const [soundscape, setSoundscape] = useState('none');
  
  const [viewState, setViewState] = useState('landing'); // landing | unlock | reveal | thankyou
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (viewState === 'reveal' && soundscape !== 'none') {
      const cleanup = playSoundscape(soundscape);
      return () => { if (cleanup) cleanup(); };
    }
  }, [viewState, soundscape]);

  useEffect(() => {
    async function load() {
      const data = await fetchHeartScript(id);
      setHeartscript(data);
      setIsFetching(false);
    }
    load();
  }, [id, fetchHeartScript]);

  if (isFetching) {
    return (
      <div className="view-page flex-center" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Heart size={40} className="skeleton-shimmer" stroke="var(--soft-coral)" style={{ animation: 'heart-pulse 1.5s infinite' }} />
      </div>
    );
  }

  if (!heartscript) {
    return (
      <div className="view-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 300 }}>
          <h2 style={{ marginBottom: 8 }}>Message not found</h2>
          <p className="text-muted text-sm">The link might be broken or expired.</p>
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const tone = getTone(heartscript.tone);

  const requestFullScreen = () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.warn("Fullscreen request denied", err));
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen failed", err);
    }
  };

  const handleOpen = () => {
    requestFullScreen();
    if (heartscript.is_locked) {
      setViewState('unlock');
    } else {
      const parts = heartscript.content.split('|||');
      setDecryptedContent(parts[0]);
      setSoundscape(parts[1] || 'none');
      setViewState('reveal');
      updateOpenedAt(heartscript.id);
    }
  };

  const handleUnlock = async () => {
    try {
      const parts = heartscript.content.split('|||');
      const ciphertext = parts[0];
      const selectedSoundscape = parts[1] || 'none';

      const decrypted = await decryptMessage(ciphertext, password);
      setDecryptedContent(decrypted);
      setSoundscape(selectedSoundscape);
      
      requestFullScreen();
      setViewState('reveal');
      setError('');
      updateOpenedAt(heartscript.id);
    } catch {
      setError('Incorrect password. Try again.');
    }
  };

  const handleResponse = (response) => {
    addResponse(heartscript.id, response);
    setTimeout(() => setViewState('thankyou'), 600);
  };

  return (
    <div className="view-page">
      <AnimatePresence mode="wait">

        {/* ===== LANDING ===== */}
        {viewState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="view-landing"
          >
            <div className="view-landing-top">
              <Heart size={28} fill="var(--rose-red)" stroke="var(--rose-red)" />
              <p className="text-label" style={{ marginTop: 8 }}>HeartScript from</p>
              <h2 className="view-sender">{heartscript.sender}</h2>
            </div>

            {/* Floating envelope */}
            <div className="view-envelope animate-float">
              <div className="view-envelope-flap" />
              <div className="view-envelope-seal">
                {heartscript.is_locked ? <Lock size={20} /> : <Heart size={20} fill="white" stroke="white" />}
              </div>
            </div>

            <div className="view-landing-bottom">
              {heartscript.is_locked && (
                <p className="view-locked-label">
                  <Lock size={14} />
                  This message is locked.
                </p>
              )}
              <h2 className="view-ready">Ready to open?</h2>
              <SlideToOpen onComplete={handleOpen} />
              <p className="text-label" style={{ marginTop: 12 }}>End-to-End Encrypted</p>
            </div>
          </motion.div>
        )}

        {/* ===== UNLOCK ===== */}
        {viewState === 'unlock' && (
          <motion.div
            key="unlock"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="view-unlock"
          >
            <button className="view-close" onClick={() => setViewState('landing')}>
              <X size={20} />
            </button>

            <div className="view-unlock-icon">
              <Lock size={36} />
            </div>

            <h2>This message is locked.</h2>
            <p className="text-muted text-sm" style={{ marginBottom: 8 }}>
              Enter the password provided by the sender.
            </p>
            {heartscript.password_hint && (
              <p className="view-hint">Hint: {heartscript.password_hint}</p>
            )}

            <div className="view-unlock-form">
              <input
                type="password"
                placeholder="Enter password"
                className="input-field"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem' }}
              />
              {error && <p className="view-error">{error}</p>}
              <button className="btn-primary" onClick={handleUnlock}>
                Unlock Message
              </button>
              <button className="view-back-link" onClick={() => setViewState('landing')}>
                Go Back
              </button>
            </div>
          </motion.div>
        )}

        {/* ===== REVEAL ===== */}
        {viewState === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="view-reveal"
            style={{ background: tone.background }}
          >
            <div className="view-reveal-content">
              <p
                className={`view-reveal-text ${tone.fontClass}`}
                style={{ color: tone.textColor }}
              >
                {decryptedContent}
              </p>

              {heartscript.type === 'pop_question' && (
                <div className="view-response-buttons">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="view-yes-btn"
                    style={{ color: tone.textColor }}
                    onClick={() => handleResponse('yes')}
                  >
                    Yes ❤️
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="view-no-btn"
                    style={{ color: tone.textColor }}
                    onClick={() => handleResponse('no')}
                  >
                    No ❌
                  </motion.button>
                  <button
                    className="view-maybe-btn"
                    style={{ color: tone.textColor }}
                    onClick={() => handleResponse('maybe')}
                  >
                    Maybe Later
                  </button>
                </div>
              )}

              {heartscript.type === 'custom' && (
                <button
                  className="view-send-own"
                  style={{ color: tone.textColor }}
                  onClick={() => navigate('/create')}
                >
                  Send your own HeartScript
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== THANK YOU ===== */}
        {viewState === 'thankyou' && (
          <motion.div
            key="thankyou"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="view-thankyou"
          >
            <div className="view-thankyou-icon">
              <Heart size={48} fill="var(--rose-red)" stroke="var(--rose-red)" />
            </div>

            <span className="text-label" style={{ marginBottom: 8 }}>HeartScript</span>
            <h1 className="view-thankyou-title">Awesome! You've<br />responded.</h1>
            <p className="text-muted text-sm">Your response has been sent<br />successfully to the sender.</p>

            <button className="btn-primary" style={{ marginTop: 32 }} onClick={() => navigate('/create')}>
              Send your own HeartScript
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
