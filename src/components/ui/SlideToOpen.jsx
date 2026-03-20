import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import './SlideToOpen.css';

export default function SlideToOpen({ onComplete }) {
  const [completed, setCompleted] = useState(false);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const bgOpacity = useTransform(x, [0, 250], [0.15, 0.4]);

  const playSuccessSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // High C
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15); // Higher C
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // AudioContext might be blocked or unsupported
    }
  };

  const handleDragEnd = (_, info) => {
    if (info.point.x > 280 || info.offset.x > 220) {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      playSuccessSound();
      setCompleted(true);
      onComplete?.();
    }
  };

  return (
    <div className="slide-track" ref={constraintsRef}>
      <motion.div
        className="slide-bg"
        style={{ opacity: bgOpacity }}
      />
      {!completed ? (
        <>
          <motion.div
            className="slide-thumb"
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0}
            onDragEnd={handleDragEnd}
            style={{ x }}
            whileTap={{ scale: 1.05 }}
          >
            <Heart size={22} fill="white" stroke="white" />
          </motion.div>
          <div className="slide-label">
            <span>Slide to open</span>
            <ChevronRight size={16} />
            <ChevronRight size={16} style={{ marginLeft: -8, opacity: 0.5 }} />
          </div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="slide-done"
        >
          ✓
        </motion.div>
      )}
    </div>
  );
}
