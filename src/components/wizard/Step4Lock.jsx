import { motion } from 'framer-motion';
import { Lock, Unlock, AlertTriangle } from 'lucide-react';
import useStore from '../../store/useStore';
import './WizardSteps.css';

export default function Step4Lock() {
  const isLocked = useStore(s => s.wizardIsLocked);
  const setIsLocked = useStore(s => s.setWizardIsLocked);
  const password = useStore(s => s.wizardPassword);
  const setPassword = useStore(s => s.setWizardPassword);
  const confirmPassword = useStore(s => s.wizardConfirmPassword);
  const setConfirmPassword = useStore(s => s.setWizardConfirmPassword);
  const hint = useStore(s => s.wizardPasswordHint);
  const setHint = useStore(s => s.setWizardPasswordHint);
  const setStep = useStore(s => s.setWizardStep);

  const canProceed = !isLocked || (password.length >= 4 && password === confirmPassword);

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Lock this<br />message?</h2>
        <p className="step-desc">Add an extra layer of privacy by setting a password.</p>
      </div>

      <div className="lock-section">
        {/* Toggle Card */}
        <div
          className={`card lock-toggle ${isLocked ? 'card-selected' : ''}`}
          onClick={() => setIsLocked(!isLocked)}
        >
          <div className={`lock-toggle-icon ${isLocked ? 'active' : ''}`}>
            {isLocked ? <Lock size={22} /> : <Unlock size={22} />}
          </div>
          <div className="lock-toggle-text">
            <h3>Lock Message</h3>
            <p>Receiver needs a password to open</p>
          </div>
          <div className={`toggle-track ${isLocked ? 'active' : 'inactive'}`}>
            <motion.div
              className="toggle-thumb"
              animate={{ x: isLocked ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </div>
        </div>

        {/* Expiry Toggle Card */}
        <div
          className={`card lock-toggle ${useStore(s => s.wizardExpires) ? 'card-selected' : ''}`}
          onClick={() => useStore.getState().setWizardExpires(!useStore.getState().wizardExpires)}
          style={{ marginTop: 12 }}
        >
          <div className={`lock-toggle-icon ${useStore(s => s.wizardExpires) ? 'active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="lock-toggle-text">
            <h3>24-Hour Expiry</h3>
            <p>Message self-destructs after 24h</p>
          </div>
          <div className={`toggle-track ${useStore(s => s.wizardExpires) ? 'active' : 'inactive'}`}>
            <motion.div
              className="toggle-thumb"
              animate={{ x: useStore.getState().wizardExpires ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </div>
        </div>

        {/* Password fields */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lock-fields"
          >
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Enter password"
                className="input-field"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Confirm password"
                className="input-field"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <input
              type="text"
              placeholder="Password hint (optional)"
              className="input-field"
              value={hint}
              onChange={e => setHint(e.target.value)}
            />

            <div className="lock-warning">
              <AlertTriangle size={14} />
              <span>Words are always encrypted. Don't forget the password — we can't recover it.</span>
            </div>

            {password && confirmPassword && password !== confirmPassword && (
              <p style={{ color: '#e53e3e', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
                Passwords don't match
              </p>
            )}
          </motion.div>
        )}
      </div>

      <div className="step-footer">
        <button
          className="btn-primary"
          disabled={!canProceed}
          onClick={() => setStep(5)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
