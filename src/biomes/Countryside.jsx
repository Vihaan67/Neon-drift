import { usePlane } from '@react-three/cannon';
import { useRef } from 'react';
import { dirtMaterial } from '../physics/materials';
import * as THREE from 'three';

// Simple Countryside biome – flat ground with dirt material and placeholder hills
export function Countryside() {
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
        <meshStandardMaterial color="#8b6d5c" />
      </mesh>
      {/* Simple rolling hills as low‑poly cones */}
      <mesh position={[-30, 2, -20]} castShadow>
        <coneGeometry args={[15, 30, 8]} />
        <meshStandardMaterial color="#6b4c3b" />
      </mesh>
      <mesh position={[40, 2, 30]} castShadow>
        <coneGeometry args={[12, 25, 8]} />
        <meshStandardMaterial color="#6b4c3b" />
      </mesh>
    </group>
  );
}
