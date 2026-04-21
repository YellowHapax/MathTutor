import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function TangentScene({ theta, phi }: { theta: number; phi: number }) {
  const px = Math.sin(phi) * Math.cos(theta);
  const py = Math.cos(phi);
  const pz = Math.sin(phi) * Math.sin(theta);

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const normal = new THREE.Vector3(px, py, pz).normalize();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [px, py, pz]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#d4a847" />
      {/* Sphere wireframe */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#27272a" wireframe />
      </mesh>
      {/* Sphere solid */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.6} />
      </mesh>
      {/* Tangent plane */}
      <mesh position={[px, py, pz]} quaternion={quaternion}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshStandardMaterial color="#d4a847" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[px, py, pz]} quaternion={quaternion}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshStandardMaterial color="#d4a847" wireframe transparent opacity={0.65} />
      </mesh>
      {/* Contact point */}
      <mesh position={[px, py, pz]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#d4a847" />
      </mesh>
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

export default function TangentPlane() {
  const [theta, setTheta] = useState(Math.PI / 4);
  const [phi, setPhi] = useState(Math.PI / 3);

  return (
    <div className="relative flex flex-col items-center p-8 py-10 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden mt-6">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <div className="w-[260px] h-[260px]">
        <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }}>
          <TangentScene theta={theta} phi={phi} />
        </Canvas>
      </div>

      <div className="w-full max-w-[260px] mt-5 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>Longitude θ</span>
            <span className="text-[#d4a847]">{((theta / Math.PI) * 180).toFixed(0)}°</span>
          </div>
          <input type="range" min={0} max={2 * Math.PI} step={0.02} value={theta}
            onChange={e => setTheta(parseFloat(e.target.value))}
            className="w-full accent-[#d4a847]" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>Latitude φ</span>
            <span className="text-[#22d3ee]">{((phi / Math.PI) * 180).toFixed(0)}°</span>
          </div>
          <input type="range" min={0.1} max={Math.PI - 0.1} step={0.02} value={phi}
            onChange={e => setPhi(parseFloat(e.target.value))}
            className="w-full accent-[#22d3ee]" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        WebGL Engine: TangentPlane
      </div>
    </div>
  );
}
