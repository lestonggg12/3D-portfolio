import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Scroll, useScroll } from '@react-three/drei'
import * as THREE from 'three'
import ExplosiveCategoryModal from './ExplosiveCategoryModal'
import LuxuryGlass from './LuxuryGlass'
import { projectCategories } from '../data/projectsData'

export default function CinematicScene() {
  const hudSectionRef = useRef()
  const hudProgressRef = useRef()
  const scroll = useScroll()
  const { camera } = useThree()
  
  const heroLeftRef = useRef()
  const heroRightRef = useRef()
  const profileRef = useRef()
  const credentialsRef = useRef()
  const categoriesRef = useRef()

  const [activeCategory, setActiveCategory] = useState(null)

  const scrollState = useRef({
    targetRotation: 0,
    progress: 0
  })

  useFrame(() => {

  const offset = scroll.offset

  // ==========================================================
  // GENERAL SCROLL PROGRESS
  // ==========================================================

  scrollState.current.progress =
    THREE.MathUtils.lerp(
      scrollState.current.progress,
      offset,
      0.1
    )

  const p = scrollState.current.progress

// ==========================================================
// HUD STATE
// ==========================================================

const section =
  Math.min(
    4,
    Math.floor(offset * 4) + 1
  )

const progress =
  Math.max(
    0,
    Math.min(100, offset * 100)
  )

if (hudSectionRef.current) {
  hudSectionRef.current.textContent =
    `0${section} / 04`
}

if (hudProgressRef.current) {
  hudProgressRef.current.style.width =
    `${progress}%`
}


  // ==========================================================
  // HERO PROGRESS
  //
  // 0.00 = hero begins
  // 0.35 = hero transition finished
  // ==========================================================

  const heroProgress =
    THREE.MathUtils.clamp(
      offset / 0.35,
      0,
      1
    )

  const heroEase =
    THREE.MathUtils.smoothstep(
      heroProgress,
      0,
      1
    )


  // ==========================================================
  // CAMERA
  // ==========================================================

  // During the hero:
  //
  // camera starts farther away
  // then slowly pushes toward the glass
  //
  const heroCameraZ =
    THREE.MathUtils.lerp(
      8,
      6.2,
      heroEase
    )


  // Keep the camera centered during the hero.
  //
  // We don't want the camera itself flying sideways yet.
  //
  camera.position.x =
    THREE.MathUtils.lerp(
      camera.position.x,
      0,
      0.08
    )

  camera.position.y =
    THREE.MathUtils.lerp(
      camera.position.y,
      1.5,
      0.08
    )

  camera.position.z =
    THREE.MathUtils.lerp(
      camera.position.z,
      heroCameraZ,
      0.08
    )


  camera.lookAt(
    0,
    0.45,
    0
  )


  // ==========================================================
  // HERO TYPOGRAPHY
  // ==========================================================

  if (
    heroLeftRef.current &&
    heroRightRef.current
  ) {

    // LESTER moves left.
   const leftX =
  THREE.MathUtils.lerp(
    0,
    -32,
    heroEase
  )

const rightX =
  THREE.MathUtils.lerp(
    0,
    32,
    heroEase
  )

    heroLeftRef.current.style.transform =
      `translate(${leftX}vw, -50%) rotate(${heroEase * -3}deg)`

    heroRightRef.current.style.transform =
      `translate(${rightX}vw, -50%) rotate(${heroEase * 3}deg)`
  }


  // ==========================================================
  // ABOUT ME
  //
  // Don't let About appear immediately anymore.
  // It begins AFTER the hero transition.
  // ==========================================================

  if (profileRef.current) {

    const profP =
      THREE.MathUtils.clamp(
(offset - 0.34) / 0.14,
        0,
        1
      )

    profileRef.current.style.opacity =
      profP

    profileRef.current.style.transform =
      `translate(
        ${(1 - profP) * -150}px,
        ${(1 - profP) * 60}px
      )`
  }


  // ==========================================================
  // CREDENTIALS
  // ==========================================================

  if (credentialsRef.current) {

    const credP =
      THREE.MathUtils.clamp(
        (offset - 0.48) / 0.17,
        0,
        1
      )

    credentialsRef.current.style.opacity =
      credP

    credentialsRef.current.style.transform =
      `translateX(
        ${(1 - credP) * 180}px
      )`
  }


  // ==========================================================
  // PROJECT CATEGORIES
  // ==========================================================

  if (categoriesRef.current) {

    const catP =
      THREE.MathUtils.clamp(
        (offset - 0.70) / 0.18,
        0,
        1
      )

    categoriesRef.current.style.opacity =
      catP

    categoriesRef.current.style.transform =
      `translateY(
        ${(1 - catP) * 120}px
      )`
  }

})

  return (
    <>
      <ambientLight
  intensity={0.35}
  color="#24170f"
/>


{/* MAIN WARM KEY */}

<pointLight
  color="#ffb45c"
  intensity={28}
  distance={10}
  decay={2}
  position={[-4, 4, 4]}
/>


{/* DEEP AMBER SIDE LIGHT */}

<pointLight
  color="#b94a12"
  intensity={18}
  distance={8}
  decay={2}
  position={[4, 1.5, -2]}
/>


{/* COOL WHITE RIM */}

<pointLight
  color="#dce8ff"
  intensity={9}
  distance={9}
  decay={2}
  position={[3, 4, 3]}
/>


{/* TOP LIGHT */}

<spotLight
  color="#fff4df"
  intensity={18}
  distance={12}
  angle={Math.PI / 7}
  penumbra={0.85}
  decay={2}
  position={[0, 7, 1]}
  castShadow={false}
/>
      <LuxuryGlass position={[0, -0.55, 0]} />

      <Scroll html style={{ width: '100%', zIndex: 10, position: 'relative' }}>
        <style>{`
          .category-card {
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
          }
          .category-card:hover {
            border-color: rgba(217, 119, 6, 0.8) !important;
            transform: translateY(-6px) scale(1.02);
            background: rgba(30, 24, 20, 0.95) !important;
            box-shadow: 0 20px 40px rgba(217, 119, 6, 0.15);
          }
        `}</style>

        {/* ====================================================== */}
{/* PORTFOLIO HUD */}
{/* ====================================================== */}

<div
  style={{
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 100
  }}
>

  {/* TOP LEFT */}

  <div
    style={{
      position: 'absolute',
      top: '32px',
      left: '38px',

      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    }}
  >

    <div
      style={{
        color: '#f5f1ea',
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        fontSize: '0.85rem',
        fontWeight: 500,
        letterSpacing: '0.08em'
      }}
    >
      LA
    </div>

    <div
      style={{
        color: 'rgba(245,241,234,0.38)',
        fontFamily: 'monospace',
        fontSize: '0.55rem',
        letterSpacing: '0.18em'
      }}
    >
      SOFTWARE ENGINEER
    </div>

  </div>


  {/* TOP RIGHT */}

  <div
    style={{
      position: 'absolute',
      top: '32px',
      right: '38px',

      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}
  >

    <div
      style={{
        color: 'rgba(245,241,234,0.45)',
        fontFamily: 'monospace',
        fontSize: '0.55rem',
        letterSpacing: '0.15em'
      }}
    >
      INDEX
    </div>

    <div
      style={{
        color: '#f5f1ea',
        fontFamily: 'monospace',
        fontSize: '0.7rem',
        letterSpacing: '0.12em'
      }}
    >
    <div
  ref={hudSectionRef}
  style={{
    color: '#f5f1ea',
    fontFamily: 'monospace',
    fontSize: '0.7rem',
    letterSpacing: '0.12em'
  }}
>
  01 / 04
</div>
    </div>

  </div>


  {/* TOP PROGRESS LINE */}

  <div
    style={{
      position: 'absolute',
      top: '60px',
      left: '38px',
      right: '38px',
      height: '1px',

      background: 'rgba(255,255,255,0.10)'
    }}
  >

    <div
    ref={hudProgressRef}
      style={{
        width: '0%',
        height: '100%',

        background:
          'linear-gradient(90deg, #d97706, #f4b35d)',

        boxShadow:
          '0 0 12px rgba(217,119,6,0.35)'
      }}
    />

  </div>


  {/* BOTTOM LEFT */}

  <div
    style={{
      position: 'absolute',
      bottom: '32px',
      left: '38px',

      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}
  >

    <div
      style={{
        width: '28px',
        height: '1px',
        background: '#d97706'
      }}
    />

    <span
      style={{
        color: 'rgba(245,241,234,0.5)',
        fontFamily: 'monospace',
        fontSize: '0.55rem',
        letterSpacing: '0.18em'
      }}
    >
      PORTFOLIO
    </span>

  </div>


  {/* BOTTOM RIGHT */}

  <div
    style={{
      position: 'absolute',
      bottom: '32px',
      right: '38px',

      color: 'rgba(245,241,234,0.38)',
      fontFamily: 'monospace',
      fontSize: '0.55rem',
      letterSpacing: '0.15em'
    }}
  >
    SCROLL TO EXPLORE
  </div>

</div>
        
       <div
  style={{
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    pointerEvents: 'none'
  }}
>

  {/* ================================================ */}
  {/* LEFT NAME */}
  {/* ================================================ */}

  <div
    ref={heroLeftRef}
    style={{
      position: 'absolute',
      
      
      right: '4vw',      
      top: '50%',

      transform: 'translateY(-50%)',

      whiteSpace: 'nowrap',

      willChange: 'transform',

      zIndex: 2
    }}
  >
    <h1
      style={{
        margin: 0,

        color: '#f2f0eb',

        fontFamily: '"Helvetica Neue", Arial, sans-serif',

        fontSize: 'clamp(3rem, 7vw, 8rem)',

        fontWeight: 300,

        letterSpacing: '-0.055em',

        lineHeight: 0.9,

        textShadow:
          '0 4px 30px rgba(0,0,0,0.65)'
      }}
    >
      LESTER
    </h1>
  </div>


  {/* ================================================ */}
  {/* RIGHT NAME */}
  {/* ================================================ */}

  <div
    ref={heroRightRef}
    style={{
      position: 'absolute',

       left: '4vw',
      top: '50%',

      transform: 'translateY(-50%)',

      whiteSpace: 'nowrap',

      willChange: 'transform',

      zIndex: 2
    }}
  >
    <h1
      style={{
        margin: 0,

        color: '#f2f0eb',

        fontFamily: '"Helvetica Neue", Arial, sans-serif',

        fontSize: 'clamp(3rem, 7vw, 8rem)',

        fontWeight: 300,

        letterSpacing: '-0.055em',

        lineHeight: 0.9,

        textShadow:
          '0 4px 30px rgba(0,0,0,0.65)'
      }}
    >
      ALCANTARA
    </h1>
  </div>


  {/* ================================================ */}
  {/* SMALL EDITORIAL LABEL */}
  {/* ================================================ */}

  <div
    style={{
      position: 'absolute',

      left: '50%',
      bottom: '7vh',

      transform: 'translateX(-50%)',

      color: 'rgba(245, 240, 232, 0.45)',

      fontFamily: 'monospace',

      fontSize: '0.65rem',

      letterSpacing: '0.28em',

      textTransform: 'uppercase',

      whiteSpace: 'nowrap'
    }}
  >
    Interactive Portfolio
  </div>


  {/* ================================================ */}
  {/* SCROLL INDICATOR */}
  {/* ================================================ */}

  <div
    style={{
      position: 'absolute',

      left: '50%',
      bottom: '3vh',

      transform: 'translateX(-50%)',

      color: 'rgba(255,255,255,0.3)',

      fontFamily: 'monospace',

      fontSize: '0.55rem',

      letterSpacing: '0.2em'
    }}
  >
    SCROLL
  </div>

</div>

        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '8vw' }}>
          <div ref={profileRef} style={{ maxWidth: '600px', background: 'linear-gradient(135deg, rgba(20, 16, 13, 0.85), rgba(10, 8, 7, 0.95))', padding: '40px', borderRadius: '20px', border: '1px solid rgba(217, 119, 6, 0.25)', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '900', fontSize: '1.8rem', margin: '0 0 10px 0' }}>About Me</h3>
            <h4 style={{ color: '#d97706', fontFamily: 'monospace', fontSize: '1rem', margin: '0 0 15px 0' }}>SOFTWARE ENGINEER</h4>
            <p style={{ color: '#e7e5e4', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
              Specializing in full-stack architecture, high-performance database management, and interactive spatial engineering. Bridging the gap between robust backend systems and luxury frontend experiences.
            </p>
          </div>
        </div>

        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8vw' }}>
          <div ref={credentialsRef} style={{ maxWidth: '600px', background: 'linear-gradient(135deg, rgba(20, 16, 13, 0.85), rgba(10, 8, 7, 0.95))', padding: '40px', borderRadius: '20px', border: '1px solid rgba(217, 119, 6, 0.25)', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '900', fontSize: '1.8rem', margin: '0 0 20px 0' }}>Core Arsenal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <div><strong style={{ color: '#d97706' }}>LANGUAGES:</strong> <span style={{ color: '#e7e5e4' }}>JavaScript, Python, C++</span></div>
              <div><strong style={{ color: '#d97706' }}>FRONTEND & 3D:</strong> <span style={{ color: '#e7e5e4' }}>React, Three.js, React Three Fiber</span></div>
              <div><strong style={{ color: '#d97706' }}>BACKEND:</strong> <span style={{ color: '#e7e5e4' }}>Node.js, Django, REST APIs</span></div>
              <div><strong style={{ color: '#d97706' }}>DATABASE:</strong> <span style={{ color: '#e7e5e4' }}>Supabase, PostgreSQL</span></div>
            </div>
          </div>
        </div>

        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4vw' }}>
          <div ref={categoriesRef} style={{ width: '100%', maxWidth: '1000px' }}>
            <h2 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '900', fontSize: '2.5rem', textAlign: 'center', margin: '0 0 30px 0' }}>Dimensions of Work</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {projectCategories.map((cat, idx) => (
                <div key={cat.id} className="category-card" onClick={() => setActiveCategory(cat)} style={{ background: 'linear-gradient(135deg, rgba(20, 16, 13, 0.9), rgba(10, 8, 7, 0.95))', padding: '30px', borderRadius: '18px', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
                  <span style={{ color: '#d97706', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>0{idx + 1} //</span>
                  <h3 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontSize: '1.3rem', fontWeight: '800', margin: '15px 0' }}>{cat.name}</h3>
                  <div style={{ color: '#d97706', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>EXPLODE VIEW →</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Scroll>

      <ExplosiveCategoryModal category={activeCategory} onClose={() => setActiveCategory(null)} />
    </>
  )
}