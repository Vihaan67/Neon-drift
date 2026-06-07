import React, { lazy } from 'react';

const City = lazy(() => import('./City').then(m => ({ default: m.City })));
const Countryside = lazy(() => import('./Countryside').then(m => ({ default: m.Countryside })));
const Desert = lazy(() => import('./Desert').then(m => ({ default: m.Desert })));
const Mountain = lazy(() => import('./Mountain').then(m => ({ default: m.Mountain })));
const Coastal = lazy(() => import('./Coastal').then(m => ({ default: m.Coastal })));

/**
 * Biomes component positions each biome side‑by‑side on the X‑axis.
 * Each biome occupies a 500 unit square area. Adjust sizes as needed.
 */
export function Biomes() {
  const offset = 500; // distance between biome centers
  return (
    <>
      <group position={[-offset * 2, 0, 0]}>
        <City />
      </group>
      <group position={[-offset, 0, 0]}>
        <Countryside />
      </group>
      <group position={[0, 0, 0]}>
        <Desert />
      </group>
      <group position={[offset, 0, 0]}>
        <Mountain />
      </group>
      <group position={[offset * 2, 0, 0]}>
        <Coastal />
      </group>
    </>
  );
}
