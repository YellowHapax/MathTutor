import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Stella Octangula = two interlocking tetrahedra inscribed in the unit cube
// These are the 8 vertices of a cube split into even/odd parity
const TET1 = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]] as const;
const TET2 = [[-1, -1, -1], [-1, 1, 1], [1, -1, 1], [1, 1, -1]] as const;
const TET_FACES = [0, 1, 2, 0, 1, 3, 0, 2, 3, 1, 2, 3];

function Tet({ verts, color }: { verts: readonly (readonly number[])[], color: string }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts.flatMap(v => [...v]), 3));
    geo.setIndex(TET_FACES);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} wireframe transparent opacity={0.7} />
      </mesh>
    </>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.28;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.18) * 0.25;
    }
  });

  return (
    <group ref={groupRef} scale={0.68}>
      <Tet verts={TET1} color="#d4a847" />
      <Tet verts={TET2} color="#22d3ee" />
      {[...TET1].map((v, i) => (
        <mesh key={`t1-${i}`} position={v as [number, number, number]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#d4a847" />
        </mesh>
      ))}
      {[...TET2].map((v, i) => (
        <mesh key={`t2-${i}`} position={v as [number, number, number]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#22d3ee" />
        </mesh>
      ))}
    </group>
  );
}

export default function StellaOctangula() {
  return (
    <div className="relative flex flex-col items-center p-12 py-16 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden h-[400px]">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <div className="absolute inset-x-8 inset-y-12">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#d4a847" />
          <Scene />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        WebGL Engine: StellaOctangula
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        MBD Order 1 Geometry
      </div>
    </div>
  );
}
