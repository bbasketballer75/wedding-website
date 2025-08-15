'use client';

/**
 * 🎵 AMBIENT WEDDING SOUND SYSTEM ✨
 *
 * Creates an immersive audio experience with nature sounds, gentle melodies,
 * and contextual audio feedback for user interactions throughout the wedding website.
 */

import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// Sound Library - Wedding themed ambient sounds
const SOUND_LIBRARY = {
  // Ambient Background Sounds
  GENTLE_RAIN: {
    id: 'gentle_rain',
    name: 'Gentle Rain',
    description: 'Soft rain sounds for peaceful moments',
    loop: true,
    volume: 0.3,
    category: 'ambient',
  },
  BIRDS_CHIRPING: {
    id: 'birds_chirping',
    name: 'Birds Chirping',
    description: 'Cheerful bird songs for joy',
    loop: true,
    volume: 0.25,
    category: 'ambient',
  },
  OCEAN_WAVES: {
    id: 'ocean_waves',
    name: 'Ocean Waves',
    description: 'Calming ocean waves',
    loop: true,
    volume: 0.35,
    category: 'ambient',
  },
  SOFT_PIANO: {
    id: 'soft_piano',
    name: 'Soft Piano',
    description: 'Gentle piano melody',
    loop: true,
    volume: 0.4,
    category: 'ambient',
  },

  // Interaction Sounds
  BUTTON_HOVER: {
    id: 'button_hover',
    name: 'Button Hover',
    description: 'Subtle hover sound',
    loop: false,
    volume: 0.2,
    category: 'interaction',
  },
  BUTTON_CLICK: {
    id: 'button_click',
    name: 'Button Click',
    description: 'Satisfying click sound',
    loop: false,
    volume: 0.3,
    category: 'interaction',
  },
  PAGE_TRANSITION: {
    id: 'page_transition',
    name: 'Page Transition',
    description: 'Smooth page change sound',
    loop: false,
    volume: 0.25,
    category: 'interaction',
  },

  // Special Wedding Sounds
  BELL_CHIME: {
    id: 'bell_chime',
    name: 'Wedding Bells',
    description: 'Celebratory bell chimes',
    loop: false,
    volume: 0.4,
    category: 'celebration',
  },
  HEART_BEAT: {
    id: 'heart_beat',
    name: 'Heartbeat',
    description: 'Gentle heartbeat rhythm',
    loop: true,
    volume: 0.2,
    category: 'love',
  },
  CONFETTI_POP: {
    id: 'confetti_pop',
    name: 'Confetti Pop',
    description: 'Joyful confetti sound',
    loop: false,
    volume: 0.35,
    category: 'celebration',
  },
};

// Audio Context for Sound Generation
class SoundGenerator {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.sounds = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.setValueAtTime(0.7, this.audioContext.currentTime);

      this.initialized = true;
      return true;
    } catch (error) {
      console.warn('Audio context not available:', error);
      return false;
    }
  }

  // Generate procedural ambient sounds
  createAmbientSound(type, duration = Infinity) {
    if (!this.initialized) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.masterGain);

    switch (type) {
      case 'gentle_rain':
        return this.createRainSound(oscillator, gainNode, filterNode, duration);
      case 'birds_chirping':
        return this.createBirdSound(oscillator, gainNode, filterNode, duration);
      case 'ocean_waves':
        return this.createOceanSound(oscillator, gainNode, filterNode, duration);
      case 'soft_piano':
        return this.createPianoSound(oscillator, gainNode, filterNode, duration);
      default:
        return this.createDefaultTone(oscillator, gainNode, duration);
    }
  }

  createRainSound(oscillator, gainNode, filterNode, duration) {
    // White noise for rain effect
    const bufferSize = this.audioContext.sampleRate * 2;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for rain-like sound
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(1500, this.audioContext.currentTime);

    whiteNoise.connect(filterNode);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

    // Gentle volume fluctuation
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.setValueAtTime(0.1, this.audioContext.currentTime);
    lfoGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    whiteNoise.start();
    lfo.start();

    if (duration !== Infinity) {
      whiteNoise.stop(this.audioContext.currentTime + duration);
      lfo.stop(this.audioContext.currentTime + duration);
    }

    return { source: whiteNoise, lfo };
  }

  createBirdSound(oscillator, gainNode, filterNode, duration) {
    // Chirping melody
    const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequencies[0], this.audioContext.currentTime);

    filterNode.type = 'bandpass';
    filterNode.frequency.setValueAtTime(800, this.audioContext.currentTime);
    filterNode.Q.setValueAtTime(1, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

    // Create chirping pattern
    const chirpDuration = 0.3;
    const pauseDuration = 2;
    const totalCycle = chirpDuration + pauseDuration;

    for (let i = 0; i < Math.max(duration / totalCycle, 20); i++) {
      const startTime = this.audioContext.currentTime + i * totalCycle;
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

      oscillator.frequency.setValueAtTime(freq, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        freq * 1.5,
        startTime + chirpDuration * 0.7
      );

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + chirpDuration);
    }

    oscillator.start();
    if (duration !== Infinity) {
      oscillator.stop(this.audioContext.currentTime + duration);
    }

    return { source: oscillator };
  }

  createOceanSound(oscillator, gainNode, filterNode, duration) {
    // Low frequency oscillation for waves
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(0.1, this.audioContext.currentTime);

    // Add noise for wave texture
    const bufferSize = this.audioContext.sampleRate * 2;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(200, this.audioContext.currentTime);

    noise.connect(filterNode);
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);

    // Wave motion modulation
    const waveLFO = this.audioContext.createOscillator();
    const waveGain = this.audioContext.createGain();
    waveLFO.frequency.setValueAtTime(0.05, this.audioContext.currentTime);
    waveGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    waveLFO.connect(waveGain);
    waveGain.connect(gainNode.gain);

    noise.start();
    waveLFO.start();

    if (duration !== Infinity) {
      noise.stop(this.audioContext.currentTime + duration);
      waveLFO.stop(this.audioContext.currentTime + duration);
    }

    return { source: noise, lfo: waveLFO };
  }

  createPianoSound(oscillator, gainNode, _filterNode, _duration) {
    // Gentle piano chord progression
    const chords = [
      [261.63, 329.63, 392.0], // C major
      [293.66, 369.99, 440.0], // D minor
      [349.23, 440.0, 523.25], // F major
      [392.0, 493.88, 587.33], // G major
    ];

    const oscillators = [];
    const chordDuration = 4; // 4 seconds per chord

    chords.forEach((chord, chordIndex) => {
      chord.forEach((freq, _noteIndex) => {
        const osc = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

        osc.connect(noteGain);
        noteGain.connect(gainNode);

        const startTime = this.audioContext.currentTime + chordIndex * chordDuration;
        const endTime = startTime + chordDuration - 0.5;

        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.05, startTime + 0.5);
        noteGain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.start(startTime);
        osc.stop(endTime);

        oscillators.push(osc);
      });
    });

    return { sources: oscillators };
  }

  createDefaultTone(oscillator, gainNode, duration) {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

    oscillator.start();
    if (duration !== Infinity) {
      oscillator.stop(this.audioContext.currentTime + duration);
    }

    return { source: oscillator };
  }

  // Quick interaction sounds
  playInteractionSound(type) {
    if (!this.initialized) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    switch (type) {
      case 'button_hover':
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        break;
      case 'button_click':
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(900, this.audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
        break;
      case 'bell_chime':
        oscillator.frequency.setValueAtTime(1047, this.audioContext.currentTime); // C6
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
        break;
      case 'confetti_pop':
        oscillator.frequency.setValueAtTime(1500, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        break;
    }

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 2);
  }

  setMasterVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  stop() {
    if (this.audioContext) {
      this.audioContext.close();
      this.initialized = false;
    }
  }
}

// Audio Context
const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Audio Provider Component
export const AudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentAmbient, setCurrentAmbient] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isInitialized, setIsInitialized] = useState(false);

  const soundGenerator = useRef(new SoundGenerator());
  const currentSound = useRef(null);

  // Initialize audio on first user interaction
  const initializeAudio = useCallback(async () => {
    if (!isInitialized) {
      const success = await soundGenerator.current.initialize();
      if (success) {
        setIsInitialized(true);
        soundGenerator.current.setMasterVolume(volume);
      }
    }
  }, [isInitialized, volume]);

  // Handle volume changes
  useEffect(() => {
    if (isInitialized) {
      soundGenerator.current.setMasterVolume(volume);
    }
  }, [volume, isInitialized]);

  // Play ambient sound
  const playAmbient = useCallback(
    async (soundId) => {
      await initializeAudio();

      if (!isInitialized || !isEnabled) return;

      // Stop current ambient sound
      if (currentSound.current) {
        // Note: Generated sounds auto-manage their lifecycle
        currentSound.current = null;
      }

      // Start new ambient sound
      const sound = soundGenerator.current.createAmbientSound(soundId);
      if (sound) {
        currentSound.current = sound;
        setCurrentAmbient(soundId);
      }
    },
    [initializeAudio, isInitialized, isEnabled]
  );

  // Stop ambient sound
  const stopAmbient = useCallback(() => {
    if (currentSound.current) {
      currentSound.current = null;
      setCurrentAmbient(null);
    }
  }, []);

  // Play interaction sound
  const playInteraction = useCallback(
    async (soundId) => {
      await initializeAudio();

      if (!isInitialized || !isEnabled) return;

      soundGenerator.current.playInteractionSound(soundId);
    },
    [initializeAudio, isInitialized, isEnabled]
  );

  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    setIsEnabled((prev) => !prev);
    if (isEnabled && currentSound.current) {
      stopAmbient();
    }
  }, [isEnabled, stopAmbient]);

  // Auto-start ambient sound when enabled
  useEffect(() => {
    if (isEnabled && isInitialized && !currentAmbient) {
      // Default to gentle nature sounds
      playAmbient('gentle_rain');
    }
  }, [isEnabled, isInitialized, currentAmbient, playAmbient]);

  // Cleanup on unmount
  useEffect(() => {
    const generator = soundGenerator.current;
    return () => {
      if (generator) {
        generator.stop();
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      isEnabled,
      isInitialized,
      currentAmbient,
      volume,
      soundLibrary: SOUND_LIBRARY,
      toggleAudio,
      setVolume,
      playAmbient,
      stopAmbient,
      playInteraction,
      initializeAudio,
    }),
    [
      isEnabled,
      isInitialized,
      currentAmbient,
      volume,
      toggleAudio,
      setVolume,
      playAmbient,
      stopAmbient,
      playInteraction,
      initializeAudio,
    ]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

// Audio Control Component
export const AudioControls = ({ className = '' }) => {
  const {
    isEnabled,
    isInitialized,
    currentAmbient,
    volume,
    soundLibrary,
    toggleAudio,
    setVolume,
    playAmbient,
    stopAmbient,
    initializeAudio,
  } = useAudio();

  const ambientSounds = Object.values(soundLibrary).filter((s) => s.category === 'ambient');

  const handleFirstInteraction = async () => {
    await initializeAudio();
    if (!isEnabled) {
      toggleAudio();
    }
  };

  return (
    <div className={`audio-controls ${className}`}>
      <div className="audio-controls__header">
        <button
          className={`audio-toggle ${isEnabled ? 'audio-toggle--enabled' : ''}`}
          onClick={handleFirstInteraction}
          aria-label={isEnabled ? 'Disable ambient sounds' : 'Enable ambient sounds'}
          title={isEnabled ? 'Turn off ambient sounds' : 'Turn on ambient sounds'}
        >
          <span className="audio-icon">{isEnabled ? '🔊' : '🔇'}</span>
          <span className="audio-label">{isEnabled ? 'Audio On' : 'Audio Off'}</span>
        </button>
      </div>

      {isEnabled && isInitialized && (
        <div className="audio-controls__options">
          <div className="volume-control">
            <label htmlFor="volume-slider" className="volume-label">
              🔊 Volume
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
              aria-label="Audio volume"
            />
            <span className="volume-value">{Math.round(volume * 100)}%</span>
          </div>

          <div className="ambient-controls">
            <label className="ambient-label" htmlFor="ambient-select">
              🎵 Ambient Sounds
            </label>
            <div className="ambient-options">
              <button
                className={`ambient-btn ${!currentAmbient ? 'ambient-btn--active' : ''}`}
                onClick={stopAmbient}
                aria-pressed={!currentAmbient}
              >
                🔇 None
              </button>
              {ambientSounds.map((sound) => (
                <button
                  key={sound.id}
                  className={`ambient-btn ${currentAmbient === sound.id ? 'ambient-btn--active' : ''}`}
                  onClick={() => playAmbient(sound.id)}
                  aria-pressed={currentAmbient === sound.id}
                  title={sound.description}
                >
                  {sound.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .audio-controls {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.25rem;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.05);
          max-width: 280px;
        }

        .audio-controls__header {
          margin-bottom: 1rem;
        }

        .audio-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #8fa876 0%, #6b8a4f 100%);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          width: 100%;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(143, 168, 118, 0.3);
        }

        .audio-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(143, 168, 118, 0.4);
          background: linear-gradient(135deg, #9bb87e 0%, #8fa876 100%);
        }

        .audio-toggle--enabled {
          background: linear-gradient(135deg, #8fa876 0%, #6b8a4f 100%);
          box-shadow: 0 4px 15px rgba(143, 168, 118, 0.4);
        }

        .audio-toggle--enabled:hover {
          background: linear-gradient(135deg, #9bb87e 0%, #8fa876 100%);
        }

        .audio-icon {
          font-size: 1.2rem;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }

        .audio-label {
          font-size: 0.9rem;
          letter-spacing: 0.025em;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .volume-label {
          font-weight: 600;
          font-size: 0.85rem;
          color: #4a4742;
          min-width: 60px;
          font-family: 'Inter', sans-serif;
        }

        .volume-slider {
          flex: 1;
          height: 6px;
          background: linear-gradient(90deg, #e8e5e0 0%, #d4e2c9 100%);
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
          transition: all 0.2s ease;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8fa876 0%, #6b8a4f 100%);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(143, 168, 118, 0.3);
          border: 2px solid white;
        }

        .volume-slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8fa876 0%, #6b8a4f 100%);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(143, 168, 118, 0.3);
        }

        .volume-value {
          min-width: 35px;
          text-align: right;
          font-weight: 600;
          font-size: 0.8rem;
          color: #6b7280;
          font-family: 'Inter', sans-serif;
        }

        .ambient-controls {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ambient-label {
          font-weight: 600;
          color: #4a4742;
          font-size: 0.85rem;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.025em;
        }

        .ambient-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ambient-btn {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(143, 168, 118, 0.2);
          padding: 0.5rem 0.875rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
          color: #4a4742;
          font-family: 'Inter', sans-serif;
          backdrop-filter: blur(10px);
        }

        .ambient-btn:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(143, 168, 118, 0.2);
          border-color: rgba(143, 168, 118, 0.3);
        }

        .ambient-btn--active {
          background: linear-gradient(135deg, #d4e2c9 0%, #b8d1a6 100%);
          color: #4a6136;
          border-color: rgba(143, 168, 118, 0.4);
          box-shadow: 0 2px 8px rgba(143, 168, 118, 0.2);
        }

        .ambient-btn--active:hover {
          background: linear-gradient(135deg, #e9f0e3 0%, #d4e2c9 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(143, 168, 118, 0.3);
        }

        @media (max-width: 768px) {
          .audio-controls {
            padding: 1rem;
            max-width: 260px;
          }

          .volume-control {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .volume-label {
            text-align: center;
            min-width: auto;
          }

          .ambient-options {
            flex-direction: column;
          }

          .ambient-btn {
            text-align: center;
            justify-content: center;
          }

          .audio-toggle {
            padding: 0.75rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

// Hook for easy interaction sounds
export const useInteractionSounds = () => {
  const { playInteraction, isEnabled } = useAudio();

  return {
    playHover: () => isEnabled && playInteraction('button_hover'),
    playClick: () => isEnabled && playInteraction('button_click'),
    playBell: () => isEnabled && playInteraction('bell_chime'),
    playConfetti: () => isEnabled && playInteraction('confetti_pop'),
    playPageTransition: () => isEnabled && playInteraction('page_transition'),
  };
};

export default AudioProvider;

AudioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

AudioControls.propTypes = {
  className: PropTypes.string,
};
