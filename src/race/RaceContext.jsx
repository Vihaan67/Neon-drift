import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const RaceContext = createContext();

export function RaceProvider({ children }) {
  const [raceState, setRaceState] = useState({
    active: false,
    mode: 'circuit', // 'circuit', 'sprint'
    lapCount: 0,
    maxLaps: 3,
    currentCheckpoint: 0,
    totalCheckpoints: 4,
    startTime: 0,
    elapsedTime: 0,
    bestTime: null,
  });

  const timerRef = useRef(null);

  // Function to start the race
  const startRace = (mode = 'circuit', maxLaps = 3, totalCheckpoints = 4) => {
    setRaceState({
      active: true,
      mode,
      lapCount: 1,
      maxLaps,
      currentCheckpoint: 0,
      totalCheckpoints,
      startTime: Date.now(),
      elapsedTime: 0,
      bestTime: raceState.bestTime,
    });
  };

  // Stop race
  const stopRace = () => {
    setRaceState(prev => {
      const finalTime = Date.now() - prev.startTime;
      return {
        ...prev,
        active: false,
        elapsedTime: finalTime,
        bestTime: prev.bestTime ? Math.min(prev.bestTime, finalTime) : finalTime
      };
    });
  };

  // Hit checkpoint
  const hitCheckpoint = (index) => {
    setRaceState(prev => {
      if (!prev.active) return prev;
      
      // Enforce hitting checkpoints in order
      if (index === prev.currentCheckpoint) {
        let nextCheckpoint = prev.currentCheckpoint + 1;
        let newLapCount = prev.lapCount;
        
        // If we hit the last checkpoint
        if (nextCheckpoint >= prev.totalCheckpoints) {
          nextCheckpoint = 0; // Wrap around for next lap
          newLapCount += 1;
          
          if (newLapCount > prev.maxLaps) {
            // Race finished!
            setTimeout(stopRace, 0); // Need to call asynchronously to avoid state update loops
            return {
              ...prev,
              lapCount: prev.maxLaps,
              currentCheckpoint: prev.totalCheckpoints
            };
          }
        }
        
        return {
          ...prev,
          currentCheckpoint: nextCheckpoint,
          lapCount: newLapCount
        };
      }
      return prev;
    });
  };

  // Update timer
  useEffect(() => {
    if (raceState.active) {
      timerRef.current = setInterval(() => {
        setRaceState(prev => ({
          ...prev,
          elapsedTime: Date.now() - prev.startTime
        }));
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [raceState.active]);

  return (
    <RaceContext.Provider value={{ raceState, startRace, stopRace, hitCheckpoint }}>
      {children}
    </RaceContext.Provider>
  );
}

export function useRace() {
  return useContext(RaceContext);
}
