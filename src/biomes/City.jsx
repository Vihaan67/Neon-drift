import { usePlane } from '@react-three/cannon';
import { useRef } from 'react';
import { roadMaterial } from '../physics/materials';
import * as THREE from 'three';

// Simple City biome – flat ground with road material and placeholder skyscrapers
export function City() {
  const [ref] = usePlane(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    material: roadMaterial,
    position: [0, 0, 0],
  }));

  return (
    <group>
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#6a9caf" />
      </mesh>
      {/* Placeholder low‑poly skyscrapers */}
      <mesh position={[-50, 10, -30]} castShadow>
        <boxGeometry args={[15, 40, 15]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      <mesh position={[60, 15, 20]} castShadow>
        <boxGeometry args={[20, 60, 20]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
    </group>
  );
}
