import React from 'react';
import { Grid as DreiGrid } from '@react-three/drei';

export default function Grid() {
  return (
    <DreiGrid
      position={[0, -0.01, 0]}
      args={[100, 100]}
      cellSize={1}
      cellThickness={0.6}
      cellColor="#cbd5e1"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#94a3b8"
      fadeDistance={30}
      fadeStrength={1}
      transparent
      opacity={0.5}
    />
  );
}
