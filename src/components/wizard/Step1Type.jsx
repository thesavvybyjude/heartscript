import { motion } from 'framer-motion';
import { MessageSquare, FileText } from 'lucide-react';
import useStore from '../../store/useStore';
import './WizardSteps.css';

export default function Step1Type() {
  const type = useStore(s => s.wizardType);
  const setType = useStore(s => s.setWizardType);
  const setStep = useStore(s => s.setWizardStep);

  const handleSelect = (selected) => {
    setType(selected);
    setStep(2);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">How do you<br />want to ask?</h2>
        <p className="step-desc">Choose the format of your HeartScript.</p>
      </div>

      <div className="step-options">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`card card-interactive type-card ${type === 'pop_question' ? 'card-selected' : ''}`}
          onClick={() => handleSelect('pop_question')}
        >
          <div className="type-card-icon pop">
            <MessageSquare size={30} />
          </div>
          <div className="type-card-text">
            <h3>Pop Question</h3>
            <p>Quick yes/no questions for fun reveals.</p>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`card card-interactive type-card ${type === 'custom' ? 'card-selected' : ''}`}
          onClick={() => handleSelect('custom')}
        >
          <div className="type-card-icon custom">
            <FileText size={30} />
          </div>
          <div className="type-card-text">
            <h3>Custom Message</h3>
            <p>Write your own words and set the mood.</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
