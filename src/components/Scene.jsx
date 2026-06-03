import { Physics } from '@react-three/cannon';
import { Environment, Sky } from '@react-three/drei';
import { Biomes } from '../biomes/Biomes';
import { Car } from './Car';
import { Camera } from './Camera';
import { SurfacePhysics } from '../physics/SurfacePhysics';
import { TrafficManager } from '../ai/TrafficManager';
import { TrafficLight } from '../ai/TrafficLight';
import { RaceManager } from '../race/RaceManager';
import { useEnvironment } from '../EnvironmentContext';
import { useRef } from 'react';

export function Scene() {
  const carBodyRef = useRef(null);
  const { isNight } = useEnvironment();

  return (
    <>
      <Sky distance={450000} sunPosition={isNight ? [0, -1, 0] : [0, 1, 0]} inclination={0} azimuth={0.25} />
      <ambientLight intensity={isNight ? 0.1 : 0.5} />
      <directionalLight 
        position={isNight ? [100, -100, 50] : [100, 100, 50]} 
        intensity={isNight ? 0.2 : 1} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      <Environment preset={isNight ? "night" : "city"} />

      <Physics broadphase="sap" gravity={[0, -9.81, 0]}>
        <SurfacePhysics />
        <Biomes />
        <TrafficManager />
        {/* We place a traffic light at the city intersection [0,0,0] */}
        <TrafficLight intersectionId="city_center" position={[5, 0, 5]} rotation={[0, Math.PI, 0]} />
        <RaceManager carBodyRef={carBodyRef} />
        {/* We pass a ref to the Car so the Camera can follow it */}
        <Car carRef={carBodyRef} />
      </Physics>
      <Camera targetBody={carBodyRef} />
    </>
  );
}
