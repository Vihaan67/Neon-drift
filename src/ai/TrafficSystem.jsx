import React, { createContext, useContext, useState, useEffect } from 'react';
import * as THREE from 'three';

const TrafficContext = createContext();

export function TrafficSystem({ children }) {
  // Simple traffic light states: 'green', 'yellow', 'red'
  // Intersections are defined by ID.
  const [intersections, setIntersections] = useState({
    city_center: { state: 'green', position: new THREE.Vector3(0, 0, 0), radius: 10 }
  });

  useEffect(() => {
    // Basic traffic light cycle
    const cycle = () => {
      setIntersections(prev => {
        const next = { ...prev };
        for (const id in next) {
          const current = next[id].state;
          let nextState = 'green';
          if (current === 'green') nextState = 'yellow';
          else if (current === 'yellow') nextState = 'red';
          else if (current === 'red') nextState = 'green';
          next[id] = { ...next[id], state: nextState };
        }
        return next;
      });
    };

    const interval = setInterval(cycle, 5000); // 5 seconds per state for testing
    return () => clearInterval(interval);
  }, []);

  return (
    <TrafficContext.Provider value={{ intersections }}>
      {children}
    </TrafficContext.Provider>
  );
}

export function useTrafficSystem() {
  return useContext(TrafficContext);
}
