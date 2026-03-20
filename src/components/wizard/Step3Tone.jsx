import { motion } from 'framer-motion';
import useStore from '../../store/useStore';
import { TONES } from '../../data/tones';
import { SOUNDSCAPES } from '../../data/soundscapes';
import './WizardSteps.css';

export default function Step3Tone() {
  const selectedTone = useStore(s => s.wizardTone);
  const setTone = useStore(s => s.setWizardTone);
  const selectedSoundscape = useStore(s => s.wizardSoundscape);
  const setSoundscape = useStore(s => s.setWizardSoundscape);
  const setStep = useStore(s => s.setWizardStep);

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-header-row">
          <div>
            <span className="text-label">Tone Selection</span>
            <h2 className="step-title" style={{ marginTop: 4 }}>Set the tone:</h2>
          </div>
        </div>
        <p className="step-desc">How should the message feel?</p>
      </div>

      <div className="tone-grid">
        {TONES.map((tone) => (
          <motion.button
            key={tone.id}
            whileTap={{ scale: 0.95 }}
            className={`tone-card ${selectedTone === tone.id ? 'selected' : ''}`}
            onClick={() => setTone(tone.id)}
            style={{ background: tone.background }}
          >
            <div className="tone-card-content">
              <span className="tone-emoji">{tone.emoji}</span>
              <span className="tone-name" style={{ color: tone.textColor }}>{tone.name}</span>
            </div>
            {selectedTone === tone.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="tone-check"
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="step-header" style={{ marginTop: 32 }}>
        <div className="step-header-row">
          <div>
            <span className="text-label">Soundscape</span>
            <h3 style={{ marginTop: 4, fontSize: '1.2rem', fontWeight: 600 }}>Set the audio:</h3>
          </div>
        </div>
        <p className="step-desc">An immersive background track.</p>
      </div>

      <div className="soundscape-list" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40, paddingBottom: 60 }}>
        {SOUNDSCAPES.map(s => (
          <button
            key={s.id}
            className={`card ${selectedSoundscape === s.id ? 'card-selected' : ''}`}
            onClick={() => setSoundscape(s.id)}
            style={{ 
              display: 'flex', alignItems: 'center', padding: 16, cursor: 'pointer', 
              background: selectedSoundscape === s.id ? 'var(--soft-coral)' : '#fff', 
              color: selectedSoundscape === s.id ? '#fff' : 'inherit',
              transition: 'all 0.2s',
              border: 'none',
              borderRadius: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" dangerouslySetInnerHTML={{ __html: `<path d="${s.icon}"/>` }} />
            <span style={{ marginLeft: 16, fontWeight: 500, fontSize: '1rem' }}>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="step-footer sticky-footer">
        <button
          className="btn-primary"
          disabled={!selectedTone}
          onClick={() => setStep(4)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
