import React from 'react';
import { Checkpoint } from './Checkpoint';
import { useRace } from './RaceContext';

export function RaceManager({ carBodyRef }) {
  const { raceState } = useRace();
  
  // Define checkpoints for different modes
  const circuitCheckpoints = [
    { position: [0, 5, 50], rotation: [0, 0, 0], scale: [30, 15, 2] },     // City Start
    { position: [-250, 5, 0], rotation: [0, Math.PI / 2, 0], scale: [30, 15, 2] }, // Countryside
    { position: [0, 5, -50], rotation: [0, 0, 0], scale: [30, 15, 2] },    // Desert edge
    { position: [250, 5, 0], rotation: [0, Math.PI / 2, 0], scale: [30, 15, 2] },  // Mountain
  ];

  const sprintCheckpoints = [
    { position: [-500, 5, 0], rotation: [0, Math.PI / 2, 0], scale: [40, 15, 2] }, // Start far left
    { position: [-250, 5, 0], rotation: [0, Math.PI / 2, 0], scale: [30, 15, 2] },
    { position: [0, 5, 0], rotation: [0, Math.PI / 2, 0], scale: [30, 15, 2] },
    { position: [250, 5, 0], rotation: [0, Math.PI / 2, 0], scale: [30, 15, 2] },
    { position: [500, 5, 0], rotation: [0, Math.PI / 2, 0], scale: [40, 15, 2] },  // End far right
  ];

  let activeCheckpoints = [];
  if (raceState.mode === 'circuit') activeCheckpoints = circuitCheckpoints;
  else if (raceState.mode === 'sprint') activeCheckpoints = sprintCheckpoints;

  // We only render checkpoints if race is active
  if (!raceState.active) return null;

  return (
    <group>
      {activeCheckpoints.map((cp, index) => (
        <Checkpoint 
          key={index} 
          index={index} 
          position={cp.position} 
          rotation={cp.rotation} 
          scale={cp.scale}
          carBodyRef={carBodyRef}
        />
      ))}
    </group>
  );
}
