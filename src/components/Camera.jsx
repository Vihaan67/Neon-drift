import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function Camera({ targetBody }) {
  const cameraRef = useRef();

  useFrame((state) => {
    if (!targetBody.current) return;

    // Get the car's current position and rotation
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    
    // We access the body's transform via the cannon api (which updates the ref's Object3D)
    position.copy(targetBody.current.position);
    quaternion.copy(targetBody.current.quaternion);

    // Calculate the camera's ideal offset (behind and slightly above the car)
    const idealOffset = new THREE.Vector3(0, 3, -6);
    idealOffset.applyQuaternion(quaternion);
    idealOffset.add(position);

    // Calculate ideal look-at point (slightly ahead of the car)
    const idealLookAt = new THREE.Vector3(0, 1, 5);
    idealLookAt.applyQuaternion(quaternion);
    idealLookAt.add(position);

    // Smoothly interpolate camera position and look-at
    const currentPosition = state.camera.position;
    currentPosition.lerp(idealOffset, 0.1);

    // To smooth the lookAt, we need a separate vector
    if (!cameraRef.current) {
      cameraRef.current = new THREE.Vector3();
      cameraRef.current.copy(idealLookAt);
    } else {
      cameraRef.current.lerp(idealLookAt, 0.1);
    }

    state.camera.lookAt(cameraRef.current);
  });

  return null;
}
