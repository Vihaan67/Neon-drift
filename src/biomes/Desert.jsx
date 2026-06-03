import { usePlane } from '@react-three/cannon';
import { useRef } from 'react';
import { sandMaterial } from '../physics/materials';
import * as THREE from 'three';

// Simple Desert biome – flat sand ground with dunes (low‑poly cones)
export function Desert() {
  const [ref] = usePlane(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    material: sandMaterial,
    position: [0, 0, 0],
  }));

  return (
    <group>
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#c2b280" />
      </mesh>
      {/* Dunes as low‑poly cones */}
      <mesh position={[-30, 3, -20]} castShadow>
        <coneGeometry args={[20, 40, 8]} />
        <meshStandardMaterial color="#b89c6c" />
      </mesh>
      <mesh position={[40, 3, 30]} castShadow>
        <coneGeometry args={[15, 30, 8]} />
        <meshStandardMaterial color="#b89c6c" />
      </mesh>
    </group>
  );
}
