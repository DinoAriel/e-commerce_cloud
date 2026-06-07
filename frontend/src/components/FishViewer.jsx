import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Environment, ContactShadows } from '@react-three/drei';

// Komponen untuk meload model Ikan Koi (Carp Fish)
function CarpFish() {
  const { scene, animations } = useGLTF('/carp_fish.glb');
  
  // Hook untuk mengambil animasi bawaan dari file 3D
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    // Jika file 3D memiliki animasi (misalnya sirip bergerak), kita otomatis memutar animasi pertamanya
    if (actions && Object.keys(actions).length > 0) {
      const firstAnimation = Object.keys(actions)[0];
      actions[firstAnimation].play();
    }
  }, [actions]);

  return (
    // Posisi Y dinaikkan dari -0.2 menjadi 0.5 agar ikan agak melayang naik
    <primitive object={scene} scale={9} position={[0, 0.5, 0]} rotation={[0, Math.PI, 0]} />
  );
}

export default function FishViewer({ className = "w-full h-full" }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="cursor-grab active:cursor-grabbing">
        {/* Pencahayaan */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        
        {/* Lingkungan pencahayaan */}
        <Environment preset="city" /> 

        {/* Group membungkus ikan dan bayangannya */}
        <group position={[0, -0.5, 0]}>
          <Suspense fallback={null}>
            <CarpFish />
          </Suspense>
          {/* Bayangan diletakkan di bawah (di lantai) */}
          <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={8} blur={2.5} far={4} />
        </group>

        {/* Mengaktifkan autoRotate agar ikan perlahan-lahan berputar layaknya dipamerkan */}
        <OrbitControls autoRotate={true} autoRotateSpeed={1} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
