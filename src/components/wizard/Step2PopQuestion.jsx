import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, PlusCircle } from 'lucide-react';
import useStore from '../../store/useStore';
import { PRESET_QUESTIONS } from '../../data/questions';
import './WizardSteps.css';

export default function Step2PopQuestion() {
  const content = useStore(s => s.wizardContent);
  const setContent = useStore(s => s.setWizardContent);
  const setStep = useStore(s => s.setWizardStep);
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Choose a<br />question:</h2>
        <p className="step-desc">Pick one or write your own.</p>
      </div>

      <div className="question-list">
        {PRESET_QUESTIONS.map((q, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.97 }}
            className={`question-option ${content === q ? 'selected' : ''}`}
            onClick={() => setContent(q)}
          >
            <Heart size={16} fill={content === q ? 'var(--rose-red)' : 'none'} stroke="var(--rose-red)" />
            <span>{q}</span>
          </motion.button>
        ))}

        {!showCustom ? (
          <button className="question-custom-btn" onClick={() => setShowCustom(true)}>
            <PlusCircle size={16} />
            <span>Create your own question</span>
          </button>
        ) : (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
          >
            <textarea
              className="textarea-field"
              placeholder="Type your custom question..."
              value={PRESET_QUESTIONS.includes(content) ? '' : content}
              onChange={e => setContent(e.target.value)}
              autoFocus
              style={{ minHeight: 100 }}
            />
          </motion.div>
        )}
      </div>

      <div className="step-footer">
        <button
          className="btn-primary"
          disabled={!content.trim()}
          onClick={() => setStep(3)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
