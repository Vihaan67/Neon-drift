import { usePlane } from '@react-three/cannon';
import { useRef } from 'react';
import { sandMaterial } from '../physics/materials';
import * as THREE from 'three';

// Simple Coastal biome – flat sand ground with a water plane
export function Coastal() {
  const [ref] = usePlane(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    material: sandMaterial,
    position: [0, 0, 0],
  }));

  return (
    <group>
      {/* Sand beach plane */}
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#d4c098" />
      </mesh>
      
      {/* Water plane, slightly lower and no physics collision */}
      <mesh position={[100, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[300, 500]} />
        <meshStandardMaterial color="#4da6ff" transparent opacity={0.8} roughness={0.1} metalness={0.8} />
      </mesh>
    </group>
  );
}
