import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRace } from './RaceContext';

export function Checkpoint({ index, position, rotation = [0, 0, 0], scale = [20, 10, 2], carBodyRef }) {
  const { raceState, hitCheckpoint } = useRace();
  const isActive = raceState.currentCheckpoint === index;
  
  const dummyVec = new THREE.Vector3();
  const dummyBox = new THREE.Box3();
  const checkpointMesh = useRef();

  useFrame(() => {
    if (!isActive || !carBodyRef.current || !checkpointMesh.current) return;

    // A simple collision check using distance to center or AABB
    // For simplicity, we check if the car's position is within the checkpoint's bounding box volume
    
    // Update the box's world matrix
    checkpointMesh.current.updateWorldMatrix(true, false);
    
    // Create a bounding box from the mesh
    dummyBox.setFromObject(checkpointMesh.current);

    // Get car position
    const carPos = dummyVec.copy(carBodyRef.current.position);

    // Check if car is inside box
    if (dummyBox.containsPoint(carPos)) {
      hitCheckpoint(index);
    }
  });

  return (
    <mesh ref={checkpointMesh} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial 
        color={isActive ? "#ffff00" : "#ffffff"} 
        transparent 
        opacity={isActive ? 0.3 : 0.05} 
        wireframe={isActive}
        depthWrite={false}
      />
    </mesh>
  );
}
