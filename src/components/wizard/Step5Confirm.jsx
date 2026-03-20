import { motion } from 'framer-motion';
import { Eye, Lock, Shield } from 'lucide-react';
import useStore from '../../store/useStore';
import { getTone } from '../../data/tones';
import './WizardSteps.css';

export default function Step5Confirm() {
  const type = useStore(s => s.wizardType);
  const content = useStore(s => s.wizardContent);
  const toneName = useStore(s => s.wizardTone);
  const isLocked = useStore(s => s.wizardIsLocked);
  const wizardExpires = useStore(s => s.wizardExpires);
  const setStep = useStore(s => s.setWizardStep);
  const createHeartScript = useStore(s => s.createHeartScript);

  const tone = getTone(toneName);

  const setCreatedId = useStore(s => s.setWizardCreatedId);

  const handleSend = async () => {
    const newHs = await createHeartScript({
      type,
      content,
      tone: toneName,
      is_locked: isLocked,
      password: useStore.getState().wizardPassword,
      password_hint: useStore.getState().wizardPasswordHint,
      expires: wizardExpires
    });
    
    if (newHs) {
      setCreatedId(newHs.id);
      setStep(6);
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Review your<br />message</h2>
        <p className="step-desc">Make sure everything looks perfect.</p>
      </div>

      <div className="confirm-sections">
        {/* Preview Card */}
        <div className="confirm-card">
          <div className="confirm-card-label">
            <Eye size={14} />
            <span>Final Preview</span>
          </div>
          <div className="confirm-preview" style={{ background: tone.background }}>
            <p
              className={`confirm-preview-text ${tone.fontClass}`}
              style={{ color: tone.textColor }}
            >
              {content}
            </p>
            {type === 'pop_question' && (
              <div className="confirm-preview-buttons">
                <span className="confirm-yes">Yes ❤️</span>
                <span className="confirm-no">No ❌</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="confirm-details">
          <div className="confirm-detail-row">
            <span className="text-label">Message Type</span>
            <span className="confirm-detail-value">{type === 'pop_question' ? 'Pop Question' : 'Custom Message'}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="text-label">Tone</span>
            <span className="confirm-detail-value">{tone.emoji} {tone.name}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="text-label">Privacy</span>
            <span className="confirm-detail-value">
              {isLocked ? (
                <><Lock size={12} /> Password Protected</>
              ) : (
                <><Shield size={12} /> Open Access</>
              )}
            </span>
          </div>
          <div className="confirm-detail-row">
            <span className="text-label">Expiry</span>
            <span className="confirm-detail-value">
              {wizardExpires ? '24 Hours' : 'Never'}
            </span>
          </div>
        </div>
      </div>

      <div className="step-footer confirm-footer">
        <button className="btn-secondary" onClick={() => setStep(1)}>
          Repass
        </button>
        <button className="btn-primary" onClick={handleSend}>
          Send Message
        </button>
      </div>
    </div>
  );
}
