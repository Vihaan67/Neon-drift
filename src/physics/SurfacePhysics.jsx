import { useContactMaterial } from '@react-three/cannon';
import { roadMaterial, dirtMaterial, sandMaterial } from '../physics/materials';

export function SurfacePhysics() {
  // We assume the car's wheels use the default material or a 'wheel' material.
  // For simplicity, we can apply friction to the interaction between 'wheel' and surfaces.
  const wheelMaterial = 'wheel';

  useContactMaterial(wheelMaterial, roadMaterial, {
    friction: 0.9,
    restitution: 0.1,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
  });

  useContactMaterial(wheelMaterial, dirtMaterial, {
    friction: 0.6,
    restitution: 0.2,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
  });

  useContactMaterial(wheelMaterial, sandMaterial, {
    friction: 0.3,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
  });

  return null;
}
