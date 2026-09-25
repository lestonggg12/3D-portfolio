import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  MeshTransmissionMaterial,
  RoundedBox,
  ContactShadows,
  Environment,
  useScroll
} from '@react-three/drei'
import * as THREE from 'three'

export default function LuxuryGlass(props) {
  const scroll = useScroll()

  const glassGroup = useRef()
  const iceGroup = useRef()

  const physics = useRef({
    lastOffset: 0,
    velocity: 0,
    rotation: 0
  })

  // ============================================================
  // ICE
  // ============================================================

  const iceCubes = useMemo(() => [
    {
      position: [-0.42, 0.85, 0.12],
      scale: [0.62, 0.58, 0.62],
      rotation: [0.15, 0.35, 0.12]
    },
    {
      position: [0.32, 0.95, -0.18],
      scale: [0.58, 0.62, 0.55],
      rotation: [0.32, -0.18, 0.45]
    },
    {
      position: [0.05, 1.25, 0.28],
      scale: [0.52, 0.52, 0.58],
      rotation: [-0.2, 0.42, -0.18]
    }
  ], [])

  // ============================================================
  // SCROLL / MOTION
  // ============================================================

  useFrame((state) => {
  const time = state.clock.elapsedTime
  const currentOffset = scroll.offset

  // ==========================================================
  // HERO PROGRESS
  // First 35% of the portfolio is the hero animation.
  // ==========================================================

  const heroProgress = THREE.MathUtils.clamp(
    currentOffset / 0.35,
    0,
    1
  )

  // Smooth progress
  const smoothHero = THREE.MathUtils.smoothstep(
    heroProgress,
    0,
    1
  )

  // ==========================================================
  // SCROLL VELOCITY
  // ==========================================================

  const delta =
    currentOffset - physics.current.lastOffset

  physics.current.lastOffset = currentOffset

  physics.current.velocity =
    THREE.MathUtils.lerp(
      physics.current.velocity,
      delta * 8,
      0.15
    )

  // ==========================================================
  // SUBTLE ROTATION
  // ==========================================================

  physics.current.rotation +=
    physics.current.velocity * 0.25

  // ==========================================================
  // HERO POSITION
  //
  // START:
  // center
  //
  // END:
  // upper-left
  // ==========================================================

  if (glassGroup.current) {

   const targetX = THREE.MathUtils.lerp(
  0,
  -2.25,
  smoothHero
)

const targetY = THREE.MathUtils.lerp(
  -0.55,
  1.35,
  smoothHero
)

    const targetZ = THREE.MathUtils.lerp(
      0,
      0.25,
      smoothHero
    )

    glassGroup.current.position.x =
      THREE.MathUtils.lerp(
        glassGroup.current.position.x,
        targetX,
        0.08
      )

    glassGroup.current.position.y =
      THREE.MathUtils.lerp(
        glassGroup.current.position.y,
        targetY,
        0.08
      )

    glassGroup.current.position.z =
      THREE.MathUtils.lerp(
        glassGroup.current.position.z,
        targetZ,
        0.08
      )

    // Glass becomes larger during the transition.
    const targetScale = THREE.MathUtils.lerp(
  0.92,
  1.12,
  smoothHero
)

    glassGroup.current.scale.x =
      THREE.MathUtils.lerp(
        glassGroup.current.scale.x,
        targetScale,
        0.08
      )

    glassGroup.current.scale.y =
      THREE.MathUtils.lerp(
        glassGroup.current.scale.y,
        targetScale,
        0.08
      )

    glassGroup.current.scale.z =
      THREE.MathUtils.lerp(
        glassGroup.current.scale.z,
        targetScale,
        0.08
      )

    glassGroup.current.rotation.y =
      THREE.MathUtils.lerp(
        glassGroup.current.rotation.y,
        physics.current.rotation,
        0.08
      )
  }

  // ==========================================================
  // ICE MOVEMENT
  // ==========================================================

  if (iceGroup.current) {

    iceGroup.current.children.forEach((ice, index) => {

      const original = iceCubes[index]

      ice.position.y =
        original.position[1] +
        Math.sin(time * 1.2 + index) * 0.025

      ice.rotation.x +=
        Math.sin(time * 0.45 + index) * 0.0008

      ice.rotation.y +=
        Math.cos(time * 0.35 + index) * 0.0008
    })
  }
})

  return (
    <>
      <Environment
  preset="studio"
  environmentIntensity={0.5}
  resolution={256}
/>

      <group
        ref={glassGroup}
        {...props}
      >

        {/* ================================================== */}
        {/* GLASS BODY */}
        {/* ================================================== */}

        <mesh position={[0, 0.65, 0]}>

          <cylinderGeometry
            args={[
              1.42,
              1.30,
              2.55,
              96,
              1,
              true
            ]}
          />

          <MeshTransmissionMaterial
            backside
            samples={2}
            resolution={256}

            transmission={1}
            thickness={0.16}

            roughness={0.035}
            ior={1.5}

            chromaticAberration={0.015}

            distortion={0.02}
            distortionScale={0.15}

            color="#ffffff"
          />

        </mesh>


        {/* ================================================== */}
        {/* THICK GLASS RIM */}
        {/* ================================================== */}

        <mesh
          position={[0, 1.93, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >

          <torusGeometry
            args={[
              1.39,
              0.075,
              24,
              96
            ]}
          />

          <MeshTransmissionMaterial
            backside
            samples={2}
            resolution={256}

            transmission={1}
            thickness={0.3}

            roughness={0.02}
            ior={1.5}

            chromaticAberration={0.02}

            color="#ffffff"
          />

        </mesh>


        {/* ================================================== */}
        {/* GLASS BASE */}
        {/* ================================================== */}

        <mesh position={[0, -0.68, 0]}>

          <cylinderGeometry
            args={[
              1.30,
              1.25,
              0.28,
              96
            ]}
          />

          <MeshTransmissionMaterial
            backside
            samples={2}
            resolution={256}

            transmission={1}
            thickness={0.45}

            roughness={0.025}
            ior={1.5}

            chromaticAberration={0.015}

            color="#ffffff"
          />

        </mesh>


        {/* ================================================== */}
        {/* RUM */}
        {/* ================================================== */}

        <mesh position={[0, 0.48, 0]}>

          <cylinderGeometry
            args={[
              1.23,
              1.17,
              1.55,
              96
            ]}
          />

          <meshPhysicalMaterial
            color="#4a1604"

            roughness={0.12}
            metalness={0}

            transmission={0.08}
            ior={1.33}

            thickness={1.8}

            attenuationColor="#a94708"
            attenuationDistance={1.4}

            clearcoat={0.35}
            clearcoatRoughness={0.08}
          />

        </mesh>


        {/* ================================================== */}
        {/* RUM SURFACE */}
        {/* ================================================== */}

        <mesh
          position={[0, 1.265, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >

          <circleGeometry
            args={[1.22, 96]}
          />

          <meshPhysicalMaterial
            color="#8a3208"

            roughness={0.045}

            metalness={0}

            transmission={0.15}

            ior={1.33}

            clearcoat={0.8}
            clearcoatRoughness={0.04}
          />

        </mesh>


        {/* ================================================== */}
        {/* ICE */}
        {/* ================================================== */}

        <group ref={iceGroup}>

          {iceCubes.map((cube, index) => (

            <RoundedBox
              key={index}

              args={[1, 1, 1]}

              radius={0.14}
              smoothness={5}

              position={cube.position}
              rotation={cube.rotation}
              scale={cube.scale}
            >

<meshPhysicalMaterial
  color="#dce7e9"
  roughness={0.12}
  metalness={0}
  transparent
  opacity={0.72}
  clearcoat={0.4}
  clearcoatRoughness={0.08}
/>

            </RoundedBox>

          ))}

        </group>


        {/* ================================================== */}
        {/* CONTACT SHADOW */}
        {/* ================================================== */}

       <ContactShadows
  position={[0, -0.83, 0]}
  opacity={0.4}
  scale={3.5}
  blur={2}
  far={1.5}
  resolution={256}
/>

      </group>
    </>
  )
}