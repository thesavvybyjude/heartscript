export const SOUNDSCAPES = [
  { id: 'none', label: 'Silence', icon: 'M4.9 19.1C3.1 17.3 2 14.8 2 12C2 9.2 3.1 6.7 4.9 4.9L6.3 6.3C4.9 7.8 4 9.8 4 12C4 14.2 4.9 16.2 6.3 17.7...' },
  { id: 'ocean', label: 'Ocean Waves', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5l5-3.5-5-3.5v7z' },
  { id: 'chimes', label: 'Crystal Chimes', icon: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' }
];

export const playSoundscape = (id) => {
  if (id === 'none') return () => {};

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    if (id === 'ocean') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.15; // slow waves

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 400;

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.3; // Gentle ocean

      noise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      noise.start();
      lfo.start();

      return () => {
        noise.stop();
        lfo.stop();
        ctx.close();
      };
    }

    if (id === 'chimes') {
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.15;
      masterGain.connect(ctx.destination);

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      let interval;

      const playChime = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'sine';
        const freq = notes[Math.floor(Math.random() * notes.length)];
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 3);
      };

      playChime(); // Play first instantly
      interval = setInterval(() => {
        if (Math.random() > 0.3) playChime();
      }, 1500);

      return () => {
        clearInterval(interval);
        ctx.close();
      };
    }

  } catch(e) {
    console.warn("Audio generation failed", e);
    return () => {};
  }
};
