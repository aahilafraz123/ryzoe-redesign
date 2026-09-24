'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COLS = 110;
const ROWS = 46;

function Field({ reduced }: { reduced: boolean }) {
  const points = useRef<THREE.Points>(null);
  const { positions, base } = useMemo(() => {
    const positions = new Float32Array(COLS * ROWS * 3);
    const base = new Float32Array(COLS * ROWS * 2);
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c / (COLS - 1) - 0.5) * 22;
        const z = (r / (ROWS - 1) - 0.5) * 10;
        positions.set([x, 0, z], i * 3);
        base.set([x, z], i * 2);
        i++;
      }
    }
    return { positions, base };
  }, []);

  const sprite = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((state) => {
    const p = points.current;
    if (!p) return;
    const t = reduced ? 0 : state.clock.elapsedTime * 0.55;
    const mx = state.pointer.x * 8;
    const arr = p.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COLS * ROWS; i++) {
      const x = base[i * 2];
      const z = base[i * 2 + 1];
      const d = Math.hypot(x - mx, z);
      arr[i * 3 + 1] = Math.sin(x * 0.45 + t) * Math.cos(z * 0.55 + t * 0.8) * 0.45 + Math.sin(d * 0.9 - t * 2.2) * Math.exp(-d * 0.25) * 0.35;
    }
    p.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points} rotation={[0.42, 0, 0]} position={[0, -1.2, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} map={sprite} transparent depthWrite={false} color="#9fb8ff" opacity={0.75} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function WaveField({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.4, 9], fov: 40 }} gl={{ antialias: false, alpha: true }} frameloop={active ? (reduced ? 'demand' : 'always') : 'never'}>
      <Field reduced={reduced} />
    </Canvas>
  );
}
