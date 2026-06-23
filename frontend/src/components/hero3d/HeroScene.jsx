import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ── Floating geometric mesh ── */
function FloatingMesh() {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.z = t * 0.05;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.4}
      floatIntensity={1.2}
      floatingRange={[-0.15, 0.15]}
    >
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#6366F1"
          emissive="#4338CA"
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.7}
          distort={0.35}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

/* ── Orbiting ring ── */
function OrbitRing({ radius, speed, color, thickness = 0.015 }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.sin(t * speed) * 0.5;
    ref.current.rotation.z = Math.cos(t * speed) * 0.3;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.8}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

/* ── Floating particles ── */
function Particles({ count = 60 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#8B5CF6"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Scene content ── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#E0E7FF" />
      <directionalLight position={[-3, 2, -4]} intensity={0.5} color="#EC4899" />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#6366F1" distance={10} />
      <pointLight position={[-2, -2, 3]} intensity={0.4} color="#8B5CF6" distance={8} />

      <FloatingMesh />
      <OrbitRing radius={2.8} speed={0.4} color="#6366F1" />
      <OrbitRing radius={3.4} speed={0.25} color="#EC4899" thickness={0.01} />
      <Particles count={40} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.2}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

/* ── Exported component ── */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <Scene />
      </Canvas>
    </div>
  );
}
