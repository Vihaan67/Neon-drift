import React, { useRef } from 'react';
import { useBox, useRaycastVehicle } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Wheel, useWheel } from '../components/Wheel';
import { useTrafficSystem } from './TrafficSystem';

export function TrafficCar({ path, speed = 10, offset = [0, 0, 0] }) {
  const radius = 0.4;
  const width = 1.2;
  const height = 0.4;
  const front = 1.5;
  const back = -1.5;

  const chassisBodyArgs = [width, height, front * 2];
  
  // Create physics body
  const [chassisBody, chassisApi] = useBox(() => ({
    allowSleep: false,
    args: chassisBodyArgs,
    mass: 1500,
    position: [path.getPointAt(0).x + offset[0], 2, path.getPointAt(0).z + offset[2]],
    collisionFilterGroup: 2, // Use a different group for traffic
    collisionFilterMask: 1,  // Only collide with static objects, not player or other traffic (for simplicity)
  }), useRef(null));

  const [wheels, wheelInfos] = useWheel(radius, width, front, back);

  const [vehicle, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody,
    wheelInfos,
    wheels,
  }), useRef(null));

  // AI state
  const progress = useRef(0);
  const { intersections } = useTrafficSystem();
  
  const dummyVec = new THREE.Vector3();

  useFrame((state, delta) => {
    if (!chassisBody.current) return;

    // Current position
    const pos = chassisBody.current.position;
    
    // Look ahead on the path
    const targetProgress = (progress.current + 0.01) % 1;
    const targetPos = path.getPointAt(targetProgress);
    targetPos.x += offset[0];
    targetPos.z += offset[2];

    // Check traffic lights
    let shouldStop = false;
    for (const id in intersections) {
      const intersection = intersections[id];
      const dist = dummyVec.copy(intersection.position).distanceTo(pos);
      
      // If close to intersection and it's red
      if (dist < intersection.radius + 15 && dist > intersection.radius && intersection.state === 'red') {
        // Calculate direction to see if we are heading towards it
        const dirToIntersection = dummyVec.copy(intersection.position).sub(pos).normalize();
        
        // Get car forward vector
        const carForward = new THREE.Vector3(0, 0, 1).applyQuaternion(chassisBody.current.quaternion);
        
        // Dot product to check if facing the intersection
        if (dirToIntersection.dot(carForward) > 0.5) {
            shouldStop = true;
            break;
        }
      }
    }

    // Basic steering AI
    // Get direction to target
    const targetDir = new THREE.Vector3().copy(targetPos).sub(pos).normalize();
    
    // Get car forward vector
    const carForward = new THREE.Vector3(0, 0, 1).applyQuaternion(chassisBody.current.quaternion);
    
    // Calculate steering angle using cross product
    const cross = new THREE.Vector3().crossVectors(carForward, targetDir);
    const angle = Math.asin(Math.max(-1, Math.min(1, cross.y)));
    
    // Apply steering
    const maxSteer = 0.5;
    const steer = Math.max(-maxSteer, Math.min(maxSteer, angle * 2));
    vehicleApi.setSteeringValue(steer, 0);
    vehicleApi.setSteeringValue(steer, 1);

    // Speed control
    // Simple proportional control for speed
    // This is a hacky way to get velocity length
    const vel = new THREE.Vector3();
    // In @react-three/cannon, we can't easily read velocity synchronously without subscribing,
    // so we'll just apply engine force and let physics handle it.
    
    let engineForce = shouldStop ? 0 : 500;
    let brakeForce = shouldStop ? 50 : 0;

    // Apply forces
    vehicleApi.applyEngineForce(engineForce, 2);
    vehicleApi.applyEngineForce(engineForce, 3);
    
    vehicleApi.setBrake(brakeForce, 0);
    vehicleApi.setBrake(brakeForce, 1);
    vehicleApi.setBrake(brakeForce, 2);
    vehicleApi.setBrake(brakeForce, 3);

    // Update progress based on distance to target
    const distToTarget = pos.distanceTo(targetPos);
    if (distToTarget < 5) {
      progress.current = targetProgress;
    }
  });

  return (
    <group ref={vehicle}>
      <mesh ref={chassisBody} castShadow>
        <boxGeometry args={chassisBodyArgs} />
        <meshStandardMaterial color="#44aa44" /> {/* Different color for traffic */}
      </mesh>
      
      <Wheel wheelRef={wheels[0]} radius={radius} leftSide={true} />
      <Wheel wheelRef={wheels[1]} radius={radius} leftSide={false} />
      <Wheel wheelRef={wheels[2]} radius={radius} leftSide={true} />
      <Wheel wheelRef={wheels[3]} radius={radius} leftSide={false} />
    </group>
  );
}
