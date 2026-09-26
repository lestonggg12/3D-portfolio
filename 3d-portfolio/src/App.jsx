import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import * as THREE from 'three'
import CinematicScene from './components/CinematicScene'
import NightFieldBackground from './components/NightFieldBackground'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <NightFieldBackground />

      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 42
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
        style={{
          position: 'relative',
          zIndex: 5
        }}
      >
        <ScrollControls pages={7} damping={0.25}>
          <CinematicScene />
        </ScrollControls>
      </Canvas>
    </div>
  )
}