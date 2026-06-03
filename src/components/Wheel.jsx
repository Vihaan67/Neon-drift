import { useCylinder } from '@react-three/cannon';
import { useRef } from 'react';

export function useWheel(radius, width, front, back) {
  const wheelInfo = {
    radius,
    directionLocal: [0, -1, 0], // point down
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    maxSuspensionForce: 1e4,
    maxSuspensionTravel: 0.3,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    axleLocal: [-1, 0, 0], // rotate around X axis
    chassisConnectionPointLocal: [1, 0, 1], // will be set per wheel
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -30,
    frictionSlip: 2,
  };

  const wheelInfos = [
    { ...wheelInfo, chassisConnectionPointLocal: [-width / 2, 0, front], isFrontWheel: true },
    { ...wheelInfo, chassisConnectionPointLocal: [width / 2, 0, front], isFrontWheel: true },
    { ...wheelInfo, chassisConnectionPointLocal: [-width / 2, 0, back], isFrontWheel: false },
    { ...wheelInfo, chassisConnectionPointLocal: [width / 2, 0, back], isFrontWheel: false },
  ];

  const wheels = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  return [wheels, wheelInfos];
}

export function Wheel({ wheelRef, radius, leftSide }) {
  // We use useCylinder to give the wheel a physical shape in the physics world, though the raycast vehicle uses raycasting for the main physics.
  useCylinder(() => ({
    mass: 20,
    type: 'Kinematic',
    collisionFilterGroup: 0, // don't collide with other wheels
    material: 'wheel',
    args: [radius, radius, 0.4, 16],
    rotation: [0, 0, leftSide ? Math.PI / 2 : -Math.PI / 2]
  }), wheelRef);

  return (
    <mesh ref={wheelRef}>
      <cylinderGeometry args={[radius, radius, 0.4, 32]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  );
}
