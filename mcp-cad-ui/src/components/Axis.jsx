import React from 'react';
import { Sphere, Text, Billboard } from '@react-three/drei';

function AxisLine({ color, rotation }) {
  const length = 20;
  const thickness = 0.03;

  return (
    <group rotation={rotation}>
      <mesh position={[0, length/2, 0]}>
        <cylinderGeometry args={[thickness, thickness, length, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, -length/2, 0]}>
        <cylinderGeometry args={[thickness, thickness, length, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, length, 0]}>
        <coneGeometry args={[0.2, 0.6, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

export default function Axis() {
  return (
    <group>
      {/* Origin Marker */}
      <Sphere args={[0.15, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </Sphere>
      <Billboard position={[0.6, 0.4, 0]}>
        <Text color="white" fontSize={0.3} outlineWidth={0.05} outlineColor="#000000">Origin</Text>
      </Billboard>

      {/* CAD Z Axis (UP) - Maps to ThreeJS Y */}
      <AxisLine color="#4444ff" rotation={[0, 0, 0]} />
      <Billboard position={[0, 21, 0]}>
        <Text color="#4444ff" fontSize={0.6} outlineWidth={0.05} outlineColor="#000000">Z</Text>
      </Billboard>
      
      {/* CAD X Axis (RIGHT) - Maps to ThreeJS X */}
      <AxisLine color="#ff4444" rotation={[0, 0, -Math.PI/2]} />
      <Billboard position={[21, 0, 0]}>
        <Text color="#ff4444" fontSize={0.6} outlineWidth={0.05} outlineColor="#000000">X</Text>
      </Billboard>
      
      {/* CAD Y Axis (BACK/FORWARD) - Maps to ThreeJS Z */}
      <AxisLine color="#44ff44" rotation={[Math.PI/2, 0, 0]} />
      <Billboard position={[0, 0, 21]}>
        <Text color="#44ff44" fontSize={0.6} outlineWidth={0.05} outlineColor="#000000">Y</Text>
      </Billboard>
    </group>
  );
}
