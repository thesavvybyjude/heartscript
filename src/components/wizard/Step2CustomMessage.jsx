import { Heart } from 'lucide-react';
import useStore from '../../store/useStore';
import './WizardSteps.css';

export default function Step2CustomMessage() {
  const content = useStore(s => s.wizardContent);
  const setContent = useStore(s => s.setWizardContent);
  const setStep = useStore(s => s.setWizardStep);

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Write your<br />message:</h2>
        <p className="step-desc">What do you want to say to them?</p>
      </div>

      <div className="custom-msg-area">
        <textarea
          className="textarea-field"
          placeholder="Dearest Sarah, I wanted to reach out and let you know how much your support meant to me during that time. You have a heart of gold."
          value={content}
          onChange={e => setContent(e.target.value.slice(0, 300))}
          autoFocus
        />
        <div className="custom-msg-footer">
          <Heart size={14} fill="var(--soft-coral)" stroke="none" />
          <span className="text-label">{content.length}/300 chars</span>
        </div>
      </div>

      <div className="step-footer">
        <button
          className="btn-primary"
          disabled={!content.trim()}
          onClick={() => setStep(3)}
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
