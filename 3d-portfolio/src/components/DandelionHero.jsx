import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// SOFT SPRITE TEXTURE
// A blurred white dot — this is what makes points read as
// glowing "drawn in light" fluff instead of hard little circles.
// ============================================================

function useSoftDotTexture() {
  return useMemo(() => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const cx = size / 2
    const cy = size / 2

    // Small soft center — the seed body itself.
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.14)
    core.addColorStop(0, 'rgba(255,255,255,0.95)')
    core.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = core
    ctx.beginPath()
    ctx.arc(cx, cy, size * 0.14, 0, Math.PI * 2)
    ctx.fill()

    // Radiating filament hairs — the pappus fringe that makes a
    // dandelion seed read as fluffy rather than a plain glowing dot.
    const filamentCount = 18
    ctx.lineCap = 'round'
    ctx.shadowColor = 'rgba(255,255,255,0.9)'
    ctx.shadowBlur = 2
    for (let i = 0; i < filamentCount; i++) {
      const angle = (i / filamentCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2
      const len = size * 0.46 * (0.65 + Math.random() * 0.35)
      const x2 = cx + Math.cos(angle) * len
      const y2 = cy + Math.sin(angle) * len
      ctx.strokeStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.35})`
      ctx.lineWidth = 1 + Math.random() * 0.6
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    return new THREE.CanvasTexture(canvas)
  }, [])
}

// ============================================================
// SEED HEAD SHADER MATERIAL
// Plain PointsMaterial can't fade/shrink particles individually.
// This tiny shader gives each seed its own size + opacity so we
// can shrink/fade seeds as they fly away.
// ============================================================

function createSeedMaterial(map) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uColor: { value: new THREE.Color('#eaf3ff') }
    },
    vertexShader: `
      attribute float aSize;
      attribute float aOpacity;
      varying float vOpacity;
      void main() {
        vOpacity = aOpacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (150.0 / -mvPosition.z);
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
  })
}

const SEED_COUNT = 420
const HEAD_RADIUS = 1.05
const HEAD_CENTER = new THREE.Vector3(0, 2.15, 0)

// Scroll offsets that drive the whole narrative beat-by-beat.
// With ScrollControls pages={7} (1 hero div + 6 screen divs), the hero
// div's own on-screen window is exactly offset 0 - 1/6 (~0.167) — that's
// how much of the scroll it physically occupies before the next div's
// top reaches the viewport top. These stay inside that window, and must
// stay in sync with CinematicScene's matching constants.
const RELEASE_START = 0.033
const RELEASE_END = 0.122
const BLOOM_START = 0.122
const BLOOM_END = 0.15

export default function DandelionHero(props) {
  const scroll = useScroll()
  const dotTexture = useSoftDotTexture()

  const rootGroup = useRef()
  const pointsRef = useRef()
  const stemRef = useRef()
  const bloomGroupRef = useRef()

  // ============================================================
  // SEED DATA — generated once. Each seed carries its resting
  // spot on the sphere, its own flight direction, a random release
  // threshold (so they don't all leave at once), and a speed.
  // ============================================================

  const seedData = useMemo(() => {
    const positions = new Float32Array(SEED_COUNT * 3)
    const sizes = new Float32Array(SEED_COUNT)
    const opacities = new Float32Array(SEED_COUNT)
    const dirs = []
    const thresholds = new Float32Array(SEED_COUNT)
    const speeds = new Float32Array(SEED_COUNT)

    const goldenAngle = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < SEED_COUNT; i++) {
      const y = 1 - (i / (SEED_COUNT - 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = goldenAngle * i

      const dir = new THREE.Vector3(
        Math.cos(theta) * radiusAtY,
        y,
        Math.sin(theta) * radiusAtY
      ).normalize()

      dirs.push(dir)

      const jitter = 0.85 + Math.random() * 0.3
      const base = dir.clone().multiplyScalar(HEAD_RADIUS * jitter).add(HEAD_CENTER)

      positions[i * 3] = base.x
      positions[i * 3 + 1] = base.y
      positions[i * 3 + 2] = base.z

      sizes[i] = 4 + Math.random() * 3
      opacities[i] = 0.7

      thresholds[i] = Math.random() * 0.85
      speeds[i] = 0.6 + Math.random() * 1.1
    }

    return { positions, sizes, opacities, dirs, thresholds, speeds }
  }, [])

  const basePositions = useMemo(() => seedData.positions.slice(), [seedData])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(seedData.positions.slice(), 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(seedData.sizes, 1))
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(seedData.opacities, 1))
    return geo
  }, [seedData])

  const material = useMemo(() => createSeedMaterial(dotTexture), [dotTexture])

  // ============================================================
  // STEM CURVE — a thin bowed line of light from ground to head.
  // ============================================================

  const stemCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.9, 0),
      new THREE.Vector3(-0.08, 0.6, 0.05),
      new THREE.Vector3(0.05, 1.6, -0.03),
      HEAD_CENTER.clone()
    ])
  }, [])

  const stemGeometry = useMemo(
    () => new THREE.TubeGeometry(stemCurve, 32, 0.022, 6, false),
    [stemCurve]
  )

  const glowStemGeometry = useMemo(
    () => new THREE.TubeGeometry(stemCurve, 32, 0.06, 6, false),
    [stemCurve]
  )

  // ============================================================
  // BLOOM PETALS — appear where the core was once seeds finish.
  // ============================================================

  // Petal profile: a curved teardrop instead of a straight-sided
  // cone — base near the stem, bulges outward, tapers to a soft
  // point. Rotated around Y with 32 segments for a smooth, glassy
  // silhouette instead of the previous faceted 8-sided cone.
  const petalGeometry = useMemo(() => {
    const profile = [
      new THREE.Vector2(0.02, 0),
      new THREE.Vector2(0.13, 0.07),
      new THREE.Vector2(0.165, 0.2),
      new THREE.Vector2(0.13, 0.36),
      new THREE.Vector2(0.05, 0.49),
      new THREE.Vector2(0.0, 0.56)
    ]
    return new THREE.LatheGeometry(profile, 32)
  }, [])
  const petalCount = 10
  const petals = useMemo(
    () => new Array(petalCount).fill(0).map((_, i) => ({
      angle: (i / petalCount) * Math.PI * 2,
      tilt: 0.55 + Math.random() * 0.15
    })),
    []
  )

  // ============================================================
  // FRAME LOOP
  // ============================================================

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const offset = scroll.offset

    // Gentle continuous sway — "swaying once in a night field"
    if (rootGroup.current) {
      const sway = Math.sin(time * 0.35) * 0.05
      rootGroup.current.rotation.z = sway
      // The head also slowly turns as you scroll through release.
      const turn = THREE.MathUtils.smoothstep(offset, RELEASE_START, RELEASE_END)
      rootGroup.current.rotation.y = THREE.MathUtils.lerp(
        rootGroup.current.rotation.y,
        turn * 1.1,
        0.05
      )
    }

    // ----- Seed release -----
    const releaseGlobal = THREE.MathUtils.smoothstep(offset, RELEASE_START, RELEASE_END)
    const posAttr = geometry.getAttribute('position')
    const sizeAttr = geometry.getAttribute('aSize')
    const opacityAttr = geometry.getAttribute('aOpacity')

    for (let i = 0; i < SEED_COUNT; i++) {
      const localT = THREE.MathUtils.smoothstep(
        releaseGlobal,
        seedData.thresholds[i],
        Math.min(1, seedData.thresholds[i] + 0.18)
      )

      const dir = seedData.dirs[i]
      const flight = localT * seedData.speeds[i] * 4.2
      const wobble = Math.sin(time * 1.4 + i) * 0.06 * localT

      posAttr.array[i * 3] = basePositions[i * 3] + dir.x * flight + wobble
      posAttr.array[i * 3 + 1] = basePositions[i * 3 + 1] + dir.y * flight + localT * 1.6
      posAttr.array[i * 3 + 2] = basePositions[i * 3 + 2] + dir.z * flight + wobble

      sizeAttr.array[i] = (4 + (i % 4)) * (1 - localT * 0.7)
      opacityAttr.array[i] = 0.4 * (1 - Math.pow(localT, 1.5))
    }

    posAttr.needsUpdate = true
    sizeAttr.needsUpdate = true
    opacityAttr.needsUpdate = true

    // ----- Bloom -----
    const bloomProgress = THREE.MathUtils.smoothstep(offset, BLOOM_START, BLOOM_END)
    if (bloomGroupRef.current) {
      bloomGroupRef.current.scale.setScalar(bloomProgress)
      bloomGroupRef.current.rotation.y = time * 0.08
    }

    // Stem fades slightly once the flower takes over.
    if (stemRef.current) {
      stemRef.current.material.opacity = 1 - bloomProgress * 0.4
    }
  })

  return (
    <group ref={rootGroup} {...props}>

      {/* ============================================== */}
      {/* STEM — thin glowing line, with a soft halo tube */}
      {/* underneath for a cheap glow-without-bloom look. */}
      {/* ============================================== */}

      <mesh geometry={glowStemGeometry}>
        <meshBasicMaterial color="#4f86c4" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh ref={stemRef} geometry={stemGeometry}>
        <meshBasicMaterial color="#9dd1ff" transparent opacity={0.9} />
      </mesh>

      {/* ============================================== */}
      {/* CORE GLOW — where the stem meets the seed head. */}
      {/* ============================================== */}

      <mesh position={HEAD_CENTER}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#fff8ea" />
      </mesh>
      <mesh position={HEAD_CENTER}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ffe9b0" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh position={HEAD_CENTER}>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshBasicMaterial color="#ffcf7a" transparent opacity={0.035} depthWrite={false} />
      </mesh>

      {/* ============================================== */}
      {/* SEED HEAD — the dandelion clock itself.         */}
      {/* ============================================== */}

      <points ref={pointsRef} geometry={geometry} material={material} />

      {/* ============================================== */}
      {/* BLOOM — grows in where the core was, once the   */}
      {/* seeds have gone.                                */}
      {/* ============================================== */}

      <group ref={bloomGroupRef} position={HEAD_CENTER} scale={0}>
        {/* Soft glow halo behind the petal cluster — kept subtle;
            additive blending here plus the glass material's own
            emissive glow blows out fast, so this uses normal
            blending at low opacity instead. */}
        <mesh>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshBasicMaterial color="#ffcf7a" transparent opacity={0.08} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#ffe9b0" transparent opacity={0.035} depthWrite={false} />
        </mesh>

        {petals.map((p, i) => (
          <mesh
            key={i}
            geometry={petalGeometry}
            rotation={[p.tilt, p.angle, 0]}
            position={[
              Math.cos(p.angle) * 0.05,
              0,
              Math.sin(p.angle) * 0.05
            ]}
          >
            <meshPhysicalMaterial
              color="#fff3e0"
              emissive="#e6a94a"
              emissiveIntensity={0.15}
              roughness={0.18}
              transmission={0.75}
              thickness={0.4}
              ior={1.45}
              clearcoat={0.5}
              clearcoatRoughness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color="#fff3d6" toneMapped={false} />
        </mesh>
      </group>

    </group>
  )
}