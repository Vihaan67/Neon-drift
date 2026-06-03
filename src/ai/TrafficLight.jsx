import React from 'react';
import { useTrafficSystem } from './TrafficSystem';

export function TrafficLight({ intersectionId, position, rotation = [0, 0, 0] }) {
  const { intersections } = useTrafficSystem();
  const state = intersections[intersectionId]?.state || 'red';

  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Light box */}
      <mesh position={[0, 8, 0.5]} castShadow>
        <boxGeometry args={[1, 3, 1]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Red Light */}
      <mesh position={[0, 9, 1.01]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color={state === 'red' ? '#ff0000' : '#440000'} />
      </mesh>
      {/* Yellow Light */}
      <mesh position={[0, 8, 1.01]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color={state === 'yellow' ? '#ffff00' : '#444400'} />
      </mesh>
      {/* Green Light */}
      <mesh position={[0, 7, 1.01]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color={state === 'green' ? '#00ff00' : '#004400'} />
      </mesh>
    </group>
  );
}
