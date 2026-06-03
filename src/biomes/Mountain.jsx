import { usePlane } from '@react-three/cannon';
import { useRef } from 'react';
import { dirtMaterial } from '../physics/materials'; // Mountain uses dirt material for simplicity
import * as THREE from 'three';

// Simple Mountain biome – elevated terrain with steep slopes (low‑poly cones) and road patches
export function Mountain() {
  const [ref] = usePlane(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    material: dirtMaterial,
    position: [0, 0, 0],
  }));

  return (
    <group>
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#5a4534" />
      </mesh>
      {/* Peaks as low‑poly cones */}
      <mesh position={[-30, 5, -20]} castShadow>
        <coneGeometry args={[18, 45, 8]} />
        <meshStandardMaterial color="#4a3426" />
      </mesh>
      <mesh position={[40, 5, 30]} castShadow>
        <coneGeometry args={[20, 50, 8]} />
        <meshStandardMaterial color="#4a3426" />
      </mesh>
      {/* Simple road strip across the mountain */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[500, 20]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
    </group>
  );
}
