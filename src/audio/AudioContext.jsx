import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [muted, setMuted] = useState(true); // Start muted to comply with browser autoplay policies
  
  // References to our synthesized or loaded audio
  const engineOscillator = useRef(null);
  const audioCtx = useRef(null);
  const gainNode = useRef(null);

  // Initialize Web Audio API on first interaction
  const initAudio = useCallback(() => {
    if (audioCtx.current) return;
    
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx.current = new Ctx();
    
    // Create a simple engine sound using oscillators
    engineOscillator.current = audioCtx.current.createOscillator();
    engineOscillator.current.type = 'sawtooth';
    engineOscillator.current.frequency.value = 50; // Base idle frequency
    
    gainNode.current = audioCtx.current.createGain();
    gainNode.current.gain.value = 0.1; // Low volume initially
    
    engineOscillator.current.connect(gainNode.current);
    gainNode.current.connect(audioCtx.current.destination);
    
    engineOscillator.current.start();
    setMuted(false);
    
    // Ideally we would also load and play an ambient track here
    // e.g. using a <audio> element or audioBuffer
  }, []);

  const updateEngineSpeed = useCallback((speed) => {
    if (!audioCtx.current || muted) return;
    
    // Map speed (0-200 km/h) to frequency (50-300 Hz)
    const baseFreq = 50;
    const maxFreq = 300;
    const targetFreq = baseFreq + (Math.abs(speed) / 200) * (maxFreq - baseFreq);
    
    // Smoothly ramp to new frequency
    engineOscillator.current.frequency.setTargetAtTime(targetFreq, audioCtx.current.currentTime, 0.1);
  }, [muted]);

  const toggleMute = useCallback(() => {
    if (!audioCtx.current) {
      initAudio();
    } else {
      if (audioCtx.current.state === 'running') {
        audioCtx.current.suspend();
        setMuted(true);
      } else {
        audioCtx.current.resume();
        setMuted(false);
      }
    }
  }, [initAudio]);

  return (
    <AudioContext.Provider value={{ muted, toggleMute, updateEngineSpeed, initAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useGameAudio() {
  return useContext(AudioContext);
}
