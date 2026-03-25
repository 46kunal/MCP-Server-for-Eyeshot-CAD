import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, Grid as DreiGrid, Text, Billboard, Sphere } from '@react-three/drei';

function AxisLine({ color, rotation }) {
  const length = 20;
  return (
    <group rotation={rotation}>
      <mesh position={[0, length/2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, length, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, -length/2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, length, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      <mesh position={[0, length, 0]}>
        <coneGeometry args={[0.12, 0.4, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function Axis() {
  return (
    <group>
      <Sphere args={[0.08, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#888" />
      </Sphere>

      <AxisLine color="#f14c4c" rotation={[0, 0, -Math.PI/2]} />
      <Billboard position={[21, 0, 0]}>
        <Text color="#f14c4c" fontSize={0.4}>X</Text>
      </Billboard>

      <AxisLine color="#4ec94e" rotation={[Math.PI/2, 0, 0]} />
      <Billboard position={[0, 0, 21]}>
        <Text color="#4ec94e" fontSize={0.4}>Y</Text>
      </Billboard>

      <AxisLine color="#6c9ef8" rotation={[0, 0, 0]} />
      <Billboard position={[0, 21, 0]}>
        <Text color="#6c9ef8" fontSize={0.4}>Z</Text>
      </Billboard>
    </group>
  );
}

function ModelShape({ modelState }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.003;
  });

  const shapeType = modelState?.shapeType || 'box';
  const w = modelState?.dimensions?.width ?? 1;
  const h = modelState?.dimensions?.height ?? 2;
  const d = modelState?.dimensions?.depth ?? 1;
  const r = modelState?.dimensions?.radius ?? 1;
  const color = modelState?.color || "#6c9ef8";

  const geo = () => {
    switch(shapeType) {
      case 'sphere': return <sphereGeometry args={[Math.max(r, 0.001), 32, 32]} />;
      case 'cylinder': return <cylinderGeometry args={[Math.max(r, 0.001), Math.max(r, 0.001), Math.max(h, 0.001), 32]} />;
      case 'cone': return <coneGeometry args={[Math.max(r, 0.001), Math.max(h, 0.001), 32]} />;
      case 'torus': return <torusGeometry args={[Math.max(r, 0.001), 0.4, 16, 50]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  if (w === 0 || h === 0 || d === 0 || r === 0) return null; // Disappear if set to exactly 0

  return (
    <mesh ref={meshRef} position={[0, shapeType === 'box' ? h/2 : 1, 0]} scale={shapeType === 'box' ? [w, h, d] : [1,1,1]}>
      {geo()}
      <meshStandardMaterial color={color} wireframe transparent opacity={0.7} />
    </mesh>
  );
}

function RaycastPlane({ setCoords }) {
  return (
    <mesh rotation={[-Math.PI/2, 0, 0]} visible={false}
      onPointerMove={e => setCoords({ x: e.point.x, y: -e.point.z, z: e.point.y })}>
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export default function Viewer({ modelState, setCoords }) {
  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#1a1a1d', border: '1px solid var(--border)' }}>
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }} style={{ background: '#1a1a1d' }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.4} />

        <DreiGrid
          position={[0, -0.01, 0]} args={[100, 100]}
          cellSize={1} cellThickness={0.5} cellColor="#2a2a2e"
          sectionSize={5} sectionThickness={0.8} sectionColor="#3e3e42"
          fadeDistance={30} fadeStrength={1} transparent opacity={0.5}
        />

        <Axis />
        <ModelShape modelState={modelState} />
        <RaycastPlane setCoords={setCoords} />

        <OrbitControls makeDefault enablePan enableZoom enableRotate target={[0, 0, 0]} />

        <GizmoHelper alignment="bottom-right" margin={[50, 50]}>
          <GizmoViewport labels={['X', 'Z', 'Y']} axisColors={['#f14c4c', '#6c9ef8', '#4ec94e']} labelColor="white" />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}
