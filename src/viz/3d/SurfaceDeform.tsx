import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function DeformingSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a sphere geometry with many segments
  const geometry = useMemo(() => new THREE.SphereGeometry(1.5, 64, 64), []);
  const originalPositions = useMemo(() => {
    const posAttribute = geometry.attributes.position;
    const pos = [];
    for (let i = 0; i < posAttribute.count; i++) {
      pos.push(new THREE.Vector3().fromBufferAttribute(posAttribute, i));
    }
    return pos;
  }, [geometry]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttribute = geometry.attributes.position;
    
    // Deform the sphere continuously over time
    for (let i = 0; i < posAttribute.count; i++) {
        const p = originalPositions[i];
        // Create an undulating distortion
        const distortion = Math.sin(p.x * 2 + time) * Math.cos(p.y * 2 + time) * 0.3;
        const mappedP = p.clone().add(p.clone().normalize().multiplyScalar(distortion));
        
        // Add a secondary slow breathing effect
        const breath = Math.sin(time * 0.5) * 0.2 + 1;
        mappedP.multiplyScalar(breath);

        posAttribute.setXYZ(i, mappedP.x, mappedP.y, mappedP.z);
    }
    posAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // Slow rotation
    meshRef.current.rotation.y = time * 0.2;
    meshRef.current.rotation.x = time * 0.1;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        color="#d4a847" 
        wireframe={true} 
        transparent={true} 
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function SurfaceDeform() {
  return (
    <div className="relative flex flex-col items-center justify-center p-12 py-16 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden h-[400px]">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5"></div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <div className="absolute inset-x-8 inset-y-12">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4a847" />
          <DeformingSurface />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        </Canvas>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        WebGL Engine: SurfaceDeform
      </div>
    </div>
  );
}
