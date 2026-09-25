import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import CinematicScene from './components/CinematicScene'
import LiquidGlassBackground from './components/LiquidGlassBackground'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <LiquidGlassBackground />
      
      <Canvas
  camera={{
    position: [0, 0, 8],
    fov: 42
  }}
dpr={[1, 1.5]}
  gl={{
    antialias: true,
    alpha: true
  }}
  style={{
    position: 'relative',
    zIndex: 5
  }}
>
        <ScrollControls pages={4} damping={0.25}>
          <CinematicScene />
        </ScrollControls>
      </Canvas>
    </div>
  )
}