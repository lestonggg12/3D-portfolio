import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// Generate soft glowing dandelion seed texture with delicate radiating filaments
function usePappusTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const cx = size / 2;
    const cy = size / 2;

    // Center seed body / kernel
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.12);
    core.addColorStop(0, 'rgba(220, 240, 255, 0.7)');
    core.addColorStop(0.6, 'rgba(170, 210, 240, 0.48)');
    core.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Radiating filament hairs (pappus parachute)
    const filamentCount = 20;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(125, 185, 225, 0.45)';
    ctx.shadowBlur = 3;

    for (let i = 0; i < filamentCount; i++) {
      const angle = (i / filamentCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const len = size * 0.44 * (0.7 + Math.random() * 0.3);
      const x2 = cx + Math.cos(angle) * len;
      const y2 = cy + Math.sin(angle) * len;

      ctx.strokeStyle = `rgba(180, 220, 245, ${0.18 + Math.random() * 0.2})`;
      ctx.lineWidth = 1.1 + Math.random() * 0.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);
}

function createSeedShaderMaterial(mapTexture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: mapTexture },
      uColor: { value: new THREE.Color('#a8cbe5') }
    },
    vertexShader: `
      attribute float aSize;
      attribute float aOpacity;
      varying float vOpacity;
      void main() {
        vOpacity = aOpacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (175.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform sampler2D uMap;
      varying float vOpacity;
      void main() {
        vec4 tex = texture2D(uMap, gl_PointCoord);
        if (tex.a < 0.02) discard;
        gl_FragColor = vec4(uColor, vOpacity) * tex;
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
}

const SEED_COUNT = 480;
const HEAD_RADIUS = 1.05;
const HEAD_CENTER = new THREE.Vector3(0, 2.1, 0);
const DRIFTING_SEEDS_COUNT = 90;

export default function DandelionVoyage({ onProgressUpdate }) {
  const scroll = useScroll();
  const pappusTexture = usePappusTexture();

  const groupRef = useRef();
  const coreRef = useRef();
  const seedGeometryRef = useRef();
  const driftingGeometryRef = useRef();

  // Generate dandelion seed spherical coordinates with natural turbulence weights
  const seedData = useMemo(() => {
    const positions = new Float32Array(SEED_COUNT * 3);
    const sizes = new Float32Array(SEED_COUNT);
    const opacities = new Float32Array(SEED_COUNT);
    const dirs = [];
    const thresholds = new Float32Array(SEED_COUNT);
    const speeds = new Float32Array(SEED_COUNT);
    const swirlPhases = new Float32Array(SEED_COUNT);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < SEED_COUNT; i++) {
      const y = 1 - (i / (SEED_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const dir = new THREE.Vector3(
        Math.cos(theta) * radiusAtY,
        y,
        Math.sin(theta) * radiusAtY
      ).normalize();
      dirs.push(dir);

      const jitter = 0.86 + Math.random() * 0.28;
      const base = dir.clone().multiplyScalar(HEAD_RADIUS * jitter).add(HEAD_CENTER);
      positions[i * 3] = base.x;
      positions[i * 3 + 1] = base.y;
      positions[i * 3 + 2] = base.z;

      sizes[i] = 4.2 + Math.random() * 3.5;
      opacities[i] = 0.5;
      thresholds[i] = Math.random() * 0.72;
      speeds[i] = 0.8 + Math.random() * 1.4;
      swirlPhases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, sizes, opacities, dirs, thresholds, speeds, swirlPhases };
  }, []);

  const basePositions = useMemo(() => seedData.positions.slice(), [seedData]);

  // Ambient drifting seeds data across entire 3D camera depth
  const driftingData = useMemo(() => {
    const positions = new Float32Array(DRIFTING_SEEDS_COUNT * 3);
    const sizes = new Float32Array(DRIFTING_SEEDS_COUNT);
    const opacities = new Float32Array(DRIFTING_SEEDS_COUNT);
    const wander = [];

    for (let i = 0; i < DRIFTING_SEEDS_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = -2 + Math.random() * 9;
      positions[i * 3 + 2] = -5 + Math.random() * 9;

      sizes[i] = 2.5 + Math.random() * 3.8;
      opacities[i] = 0.12 + Math.random() * 0.32;
      wander.push({
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: 0.15 + Math.random() * 0.4,
        freq: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2
      });
    }

    return { positions, sizes, opacities, wander };
  }, []);

  const mainMaterial = useMemo(() => createSeedShaderMaterial(pappusTexture), [pappusTexture]);
  const driftMaterial = useMemo(() => createSeedShaderMaterial(pappusTexture), [pappusTexture]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const offset = scroll.offset; // 0 to 1

    if (onProgressUpdate) {
      onProgressUpdate(offset);
    }

    // Gentle organic swaying in the night breeze
    if (groupRef.current) {
      const naturalSway = Math.sin(time * 0.6) * 0.04;
      const mouseWindX = state.pointer.x * 0.08;
      groupRef.current.rotation.z = naturalSway + mouseWindX;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.2, 0.05);
    }
    if (coreRef.current) {
      coreRef.current.position.y = HEAD_CENTER.y;
      coreRef.current.scale.setScalar(1);
    }

    // Dandelion seeds explosion & flight physics with UNPREDICTABLE TURBULENCE
    if (seedGeometryRef.current) {
      const posAttr = seedGeometryRef.current.getAttribute('position');
      const sizeAttr = seedGeometryRef.current.getAttribute('aSize');
      const opacityAttr = seedGeometryRef.current.getAttribute('aOpacity');

      // Global explosion factor: starts early (0.02) and develops as you scroll
      const releaseGlobal = THREE.MathUtils.smoothstep(offset, 0.02, 0.22);

      // Unpredictable multi-harmonic wind trajectory:
      // Winds shift from upward gust to helical vortex to sweeping cross-breeze
      const windDriftX = Math.sin(offset * Math.PI * 3.5) * 3.2 + Math.cos(offset * Math.PI * 7) * 1.2;
      const windLiftY = Math.cos(offset * Math.PI * 2.8) * 1.8 + offset * 2.5;
      const windDepthZ = Math.sin(offset * Math.PI * 4) * 2.5;

      for (let i = 0; i < SEED_COUNT; i++) {
        const localT = THREE.MathUtils.smoothstep(
          releaseGlobal,
          seedData.thresholds[i],
          Math.min(1, seedData.thresholds[i] + 0.22)
        );

        const dir = seedData.dirs[i];
        const flight = localT * seedData.speeds[i] * 5.2;

        // Dynamic vortex swirl around the trajectory
        const phase = seedData.swirlPhases[i] + time * 1.2 + offset * 12;
        const vortexRadius = 0.4 + localT * 1.6;
        const swirlX = Math.sin(phase) * vortexRadius;
        const swirlZ = Math.cos(phase) * vortexRadius;

        posAttr.array[i * 3] = basePositions[i * 3] + dir.x * flight + (windDriftX * localT) + swirlX;
        posAttr.array[i * 3 + 1] = basePositions[i * 3 + 1] + dir.y * flight * 0.7 + (windLiftY * localT);
        posAttr.array[i * 3 + 2] = basePositions[i * 3 + 2] + dir.z * flight + (windDepthZ * localT) + swirlZ;

        sizeAttr.array[i] = (4.2 + (i % 3)) * (1 - localT * 0.35);
        const baseAlpha = 0.34 * (1 - localT * 0.42);
        opacityAttr.array[i] = Math.max(0.03, baseAlpha + Math.sin(time * 1.8 + i) * 0.05);
      }

      posAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      opacityAttr.needsUpdate = true;
    }

    // Drifting ambient seeds: floating continuously around the reader's view
    if (driftingGeometryRef.current) {
      const dPosAttr = driftingGeometryRef.current.getAttribute('position');
      const dOpAttr = driftingGeometryRef.current.getAttribute('aOpacity');

      for (let i = 0; i < DRIFTING_SEEDS_COUNT; i++) {
        const w = driftingData.wander[i];
        dPosAttr.array[i * 3] += Math.sin(time * w.freq + w.phase) * 0.01 + w.speedX * 0.012;
        dPosAttr.array[i * 3 + 1] += w.speedY * 0.014;
        dPosAttr.array[i * 3 + 2] += Math.cos(time * w.freq + w.phase) * 0.008;

        if (dPosAttr.array[i * 3 + 1] > 6.5) {
          dPosAttr.array[i * 3 + 1] = -2.5;
          dPosAttr.array[i * 3] = (Math.random() - 0.5) * 14;
        }

        dOpAttr.array[i] = 0.18 + Math.sin(time * 2 + i) * 0.08;
      }

      dPosAttr.needsUpdate = true;
      dOpAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Core Glowing Receptacle */}
      <group ref={coreRef} position={HEAD_CENTER}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#c5e0f2" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#9dd1ff" transparent opacity={0.1} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.03} depthWrite={false} />
        </mesh>
      </group>

      {/* Main Dandelion Seed Particles */}
      <points>
        <bufferGeometry ref={seedGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[seedData.positions.slice(), 3]}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[seedData.sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-aOpacity"
            args={[seedData.opacities, 1]}
          />
        </bufferGeometry>
        <primitive object={mainMaterial} attach="material" />
      </points>

      {/* Ambient Drifting Seeds across the scene */}
      <points>
        <bufferGeometry ref={driftingGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[driftingData.positions.slice(), 3]}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[driftingData.sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-aOpacity"
            args={[driftingData.opacities, 1]}
          />
        </bufferGeometry>
        <primitive object={driftMaterial} attach="material" />
      </points>
    </group>
  );
}
