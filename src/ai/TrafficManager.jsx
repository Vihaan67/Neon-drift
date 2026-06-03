import React, { useMemo } from 'react';
import * as THREE from 'three';
import { TrafficCar } from './TrafficCar';

export function TrafficManager() {
  // Define a simple looping path for the city biome
  const cityPath = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-100, 0, -20),
      new THREE.Vector3(-20, 0, -20),
      new THREE.Vector3(0, 0, 0), // Intersection
      new THREE.Vector3(20, 0, 20),
      new THREE.Vector3(100, 0, 20),
      new THREE.Vector3(100, 0, -50),
      new THREE.Vector3(-100, 0, -50),
    ], true); // true = closed loop
  }, []);

  return (
    <>
      <TrafficCar path={cityPath} offset={[0, 0, 0]} />
      <TrafficCar path={cityPath} offset={[20, 0, 0]} />
      <TrafficCar path={cityPath} offset={[40, 0, 0]} />
    </>
  );
}
