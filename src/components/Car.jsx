import { useBox, useRaycastVehicle } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useControls } from '../useControls';
import { useWheel } from './Wheel';
import { useGameAudio } from '../audio/AudioContext';

export function Car({ carRef, radius = 0.4, width = 1.2, height = 0.4, front = 1.5, back = -1.5, steer = 0.5, force = 2000, maxBrake = 50 }) {
  const chassisBodyArgs = [width, height, front * 2];
  const [chassisBody, chassisApi] = useBox(() => ({
    allowSleep: false,
    args: chassisBodyArgs,
    mass: 1500,
    position: [0, 2, 0],
  }), carRef);

  const [wheels, wheelInfos] = useWheel(radius, width, front, back);

  const [vehicle, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody,
    wheelInfos,
    wheels,
  }), useRef(null));

  const controls = useControls();
  const { updateEngineSpeed } = useGameAudio();

  useFrame(() => {
    const { forward, backward, left, right, brake, reset } = controls;

    if (reset) {
      chassisApi.position.set(0, 2, 0);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }

    // Engine force
    const engineForce = forward ? force : backward ? -force : 0;
    vehicleApi.applyEngineForce(engineForce, 2); // Rear left
    vehicleApi.applyEngineForce(engineForce, 3); // Rear right

    // Steering
    const steeringValue = left ? steer : right ? -steer : 0;
    vehicleApi.setSteeringValue(steeringValue, 0); // Front left
    vehicleApi.setSteeringValue(steeringValue, 1); // Front right

    // Braking
    const brakeForce = brake ? maxBrake : 0;
    vehicleApi.setBrake(brakeForce, 0);
    vehicleApi.setBrake(brakeForce, 1);
    vehicleApi.setBrake(brakeForce, 2);
    vehicleApi.setBrake(brakeForce, 3);

    // Velocity is handled in useEffect now
  });

  useEffect(() => {
    const unsubscribe = chassisApi.velocity.subscribe((v) => {
      const currentSpeed = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
      const kmh = currentSpeed * 3.6;
      
      const speedElement = document.getElementById('speed-value');
      if (speedElement) speedElement.innerText = Math.round(Math.abs(kmh));
      
      // Update audio
      updateEngineSpeed(kmh);
    });
    return () => unsubscribe();
  }, [chassisApi, updateEngineSpeed]);

  return (
    <group ref={vehicle}>
      {/* Chassis Mesh */}
      <mesh ref={chassisBody} castShadow>
        <boxGeometry args={chassisBodyArgs} />
        <meshStandardMaterial color="#aa3bff" />
        
        {/* Simple windshield indication */}
        <mesh position={[0, height / 2 + 0.1, front / 2]}>
          <boxGeometry args={[width * 0.8, 0.4, 0.6]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </mesh>
      
      <Wheel wheelRef={wheels[0]} radius={radius} leftSide={true} />
      <Wheel wheelRef={wheels[1]} radius={radius} leftSide={false} />
      <Wheel wheelRef={wheels[2]} radius={radius} leftSide={true} />
      <Wheel wheelRef={wheels[3]} radius={radius} leftSide={false} />
      
    </group>
  );
}
