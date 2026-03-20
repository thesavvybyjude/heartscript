import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import useStore from '../store/useStore';
import ProgressBar from '../components/ui/ProgressBar';
import Step1Type from '../components/wizard/Step1Type';
import Step2PopQuestion from '../components/wizard/Step2PopQuestion';
import Step2CustomMessage from '../components/wizard/Step2CustomMessage';
import Step3Tone from '../components/wizard/Step3Tone';
import Step4Lock from '../components/wizard/Step4Lock';
import Step5Confirm from '../components/wizard/Step5Confirm';
import Step6Success from '../components/wizard/Step6Success';
import './Wizard.css';

export default function Wizard() {
  const navigate = useNavigate();
  const step = useStore(s => s.wizardStep);
  const type = useStore(s => s.wizardType);
  const setStep = useStore(s => s.setWizardStep);
  const resetWizard = useStore(s => s.resetWizard);

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else {
      resetWizard();
      navigate('/dashboard');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Type />;
      case 2: return type === 'pop_question' ? <Step2PopQuestion /> : <Step2CustomMessage />;
      case 3: return <Step3Tone />;
      case 4: return <Step4Lock />;
      case 5: return <Step5Confirm />;
      case 6: return <Step6Success />;
      default: return <Step1Type />;
    }
  };

  // After success, hide back/progress
  const showHeader = step < 6;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="wizard-page"
    >
      {showHeader && (
        <header className="wizard-header">
          <button className="wizard-back" onClick={handleBack}>
            <ChevronLeft size={22} />
          </button>

          <div className="wizard-step-info">
            <span className="text-label">Step</span>
            <span className="badge badge-rose">{step} of 6</span>
          </div>

          <div style={{ width: 44 }} />
        </header>
      )}

      {showHeader && (
        <div className="wizard-progress">
          <ProgressBar current={step} total={6} />
        </div>
      )}

      <main className="wizard-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="wizard-step"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
