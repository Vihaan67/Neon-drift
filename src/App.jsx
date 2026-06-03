import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { TrafficSystem } from './ai/TrafficSystem';
import { RaceProvider } from './race/RaceContext';
import { EnvironmentProvider } from './EnvironmentContext';
import { AudioProvider } from './audio/AudioContext';
import { HUD } from './ui/HUD';
import { Html } from '@react-three/drei';
import './index.css';

function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 50 }}>
        <AudioProvider>
          <EnvironmentProvider>
            <RaceProvider>
              <TrafficSystem>
                <Scene />
                <Html fullscreen portal={{ current: document.body }} className="ui-layer">
                  <HUD />
                </Html>
              </TrafficSystem>
            </RaceProvider>
          </EnvironmentProvider>
        </AudioProvider>
      </Canvas>
    </>
  );
}

export default App;
