'use client';

import { useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

type Props = { progress: MutableRefObject<number>; active: boolean; reduced: boolean; compact: boolean };

/** Soft two-tone light field behind the glass so refraction has colour to bend. */
function Backdrop() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d')!;
    g.fillStyle = '#000';
    g.fillRect(0, 0, 512, 512);
    const blob = (x: number, y: number, r: number, col: string) => {
      const grd = g.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, col);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd;
      g.fillRect(0, 0, 512, 512);
    };
    blob(180, 230, 230, 'rgba(41,151,255,0.55)');
    blob(340, 300, 210, 'rgba(120,90,255,0.35)');
    blob(300, 170, 150, 'rgba(255,255,255,0.18)');
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh position={[0, 0, -4]} scale={[14, 14, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Rig({ progress, reduced, compact }: Omit<Props, 'active'>) {
  const group = useRef<THREE.Group>(null);
  const glass = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current;
    const t = state.clock.elapsedTime;
    // Pointer tilt, eased.
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.35 + p * 1.2, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.25 + p * 0.5, 3, delta);
    // Scroll pushes the sculpture back and down.
    g.position.z = THREE.MathUtils.damp(g.position.z, -p * 3.2, 4, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, -p * 0.8, 4, delta);
    if (!reduced) {
      if (glass.current) glass.current.rotation.z = t * 0.12;
      if (rings.current) {
        rings.current.children.forEach((r, i) => {
          r.rotation.x += delta * (0.06 + i * 0.03);
          r.rotation.y += delta * (0.04 + i * 0.02) * (i % 2 ? -1 : 1);
        });
      }
    }
  });

  return (
    <group ref={group} position={[0, compact ? 0.35 : 0, 0]} scale={compact ? 0.62 : 0.86}>
      <Float speed={reduced ? 0 : 1.1} rotationIntensity={0.35} floatIntensity={0.5}>
        <mesh ref={glass} rotation={[0.5, 0.2, 0]}>
          <torusGeometry args={[1.12, 0.46, compact ? 64 : 128, compact ? 128 : 256]} />
          <MeshTransmissionMaterial
            samples={compact ? 4 : 8}
            resolution={compact ? 256 : 768}
            thickness={1.4}
            roughness={0.06}
            ior={1.35}
            chromaticAberration={0.08}
            anisotropicBlur={0.25}
            distortion={0.25}
            distortionScale={0.35}
            temporalDistortion={reduced ? 0 : 0.08}
            backside={!compact}
            backsideThickness={0.5}
            color="#ffffff"
          />
        </mesh>
      </Float>

      <group ref={rings}>
        {[
          { r: 2.05, rot: [1.2, 0.2, 0] },
          { r: 2.45, rot: [0.3, 1.1, 0.4] },
          { r: 2.85, rot: [-0.6, 0.4, 1.2] },
        ].map((ring, i) => (
          <mesh key={i} rotation={ring.rot as [number, number, number]}>
            <torusGeometry args={[ring.r, 0.008, 12, 256]} />
            <meshStandardMaterial color="#d8dde6" metalness={1} roughness={0.18} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function HeroScene({ progress, active, reduced, compact }: Props) {
  return (
    <Canvas
      dpr={[1, compact ? 1.25 : 1.5]}
      camera={{ position: [0, 0, 7], fov: 34 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      frameloop={active ? (reduced ? 'demand' : 'always') : 'never'}
    >
      <color attach="background" args={['#000000']} />
      <Backdrop />
      <ambientLight intensity={0.2} />
      <Rig progress={progress} reduced={reduced} compact={compact} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#2997ff" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#b8a4ff" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="ring" intensity={2.5} position={[0, 0, 6]} scale={3} />
      </Environment>
    </Canvas>
  );
}
