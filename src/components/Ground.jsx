import { usePlane } from '@react-three/cannon';
import { useRef } from 'react';
import * as THREE from 'three';

export function Ground() {
  const [ref] = usePlane(() => ({ 
    type: 'Static', 
    rotation: [-Math.PI / 2, 0, 0],
    material: 'ground' // We can define contact materials later
  }), useRef(null));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial 
        color="#3d5e3a" // A nice grass/ground color
        roughness={0.8}
        metalness={0.1}
      />
      {/* Optional grid helper for sense of scale and speed */}
      <gridHelper args={[1000, 100, 0x000000, 0x000000]} position={[0, 0.01, 0]} material-opacity={0.2} material-transparent />
    </mesh>
  );
}
