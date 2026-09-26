import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Scroll, useScroll } from '@react-three/drei'
import * as THREE from 'three'
import ExplosiveCategoryModal from './ExplosiveCategoryModal'
import DandelionHero from './DandelionHero'
import { projectCategories } from '../data/projectsData'

export default function CinematicScene() {
  const hudSectionRef = useRef()
  const hudProgressRef = useRef()
  const irisRef = useRef()
  const scroll = useScroll()
  const { camera } = useThree()

  const heroLeftRef = useRef()
  const heroRightRef = useRef()
  const profileRef = useRef()
  const credentialsRef = useRef()
  const categoriesRef = useRef()

  const [activeCategory, setActiveCategory] = useState(null)

  const scrollState = useRef({ progress: 0 })

  useFrame((state) => {
    const offset = scroll.offset

    scrollState.current.progress = THREE.MathUtils.lerp(
      scrollState.current.progress,
      offset,
      0.1
    )

    // ==========================================================
    // HUD STATE
    // ==========================================================

    const section = Math.min(4, Math.floor(offset * 4) + 1)
    const progress = Math.max(0, Math.min(100, offset * 100))

    if (hudSectionRef.current) hudSectionRef.current.textContent = `0${section} / 04`
    if (hudProgressRef.current) hudProgressRef.current.style.width = `${progress}%`

    // ==========================================================
    // KEYHOLE INTRO / IRIS OUTRO
    //
    // Opens onto the dandelion through a small aperture on its
    // own (so a visitor who never scrolls still sees it open),
    // stays open through the release + bloom, then closes down
    // again like a camera iris before the written sections take
    // over.
    // ==========================================================

    const autoOpen = Math.min(1, state.clock.elapsedTime / 1.4)

    let radius
    if (offset < 0.06) {
      const openT = Math.max(autoOpen, THREE.MathUtils.smoothstep(offset, 0, 0.06))
      radius = THREE.MathUtils.lerp(0, 140, openT)
    } else if (offset < 0.6) {
      radius = 140
    } else if (offset < 0.68) {
      radius = THREE.MathUtils.lerp(140, 0, THREE.MathUtils.smoothstep(offset, 0.6, 0.68))
    } else {
      radius = 0
    }

    const overlayFade = offset < 0.68
      ? 1
      : 1 - THREE.MathUtils.smoothstep(offset, 0.68, 0.72)

    if (irisRef.current) {
      irisRef.current.style.background =
        `radial-gradient(circle at 50% 46%, transparent 0%, transparent ${radius}%, #050403 ${radius + 0.6}%)`
      irisRef.current.style.opacity = overlayFade
    }

    // ==========================================================
    // HERO PROGRESS (dandelion pull-back + drift to corner)
    // ==========================================================

    const heroProgress = THREE.MathUtils.clamp(offset / 0.62, 0, 1)
    const heroEase = THREE.MathUtils.smoothstep(heroProgress, 0, 1)

    const heroCameraZ = THREE.MathUtils.lerp(5.5, 7.2, heroEase)

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, THREE.MathUtils.lerp(0, -1.4, heroEase), 0.08)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, THREE.MathUtils.lerp(1.1, 1.7, heroEase), 0.08)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, heroCameraZ, 0.08)
    camera.lookAt(0, 1.3, 0)

    // ==========================================================
    // HERO TYPOGRAPHY
    // ==========================================================

    if (heroLeftRef.current && heroRightRef.current) {
      const leftX = THREE.MathUtils.lerp(0, -32, heroEase)
      const rightX = THREE.MathUtils.lerp(0, 32, heroEase)

      heroLeftRef.current.style.transform = `translate(${leftX}vw, -50%) rotate(${heroEase * -3}deg)`
      heroRightRef.current.style.transform = `translate(${rightX}vw, -50%) rotate(${heroEase * 3}deg)`
      heroLeftRef.current.style.opacity = 1 - THREE.MathUtils.smoothstep(offset, 0.6, 0.68)
      heroRightRef.current.style.opacity = heroLeftRef.current.style.opacity
    }

    // ==========================================================
    // ABOUT ME
    // ==========================================================

    if (profileRef.current) {
      const profP = THREE.MathUtils.clamp((offset - 0.7) / 0.14, 0, 1)
      profileRef.current.style.opacity = profP
      profileRef.current.style.transform = `translate(${(1 - profP) * -150}px, ${(1 - profP) * 60}px)`
    }

    // ==========================================================
    // CREDENTIALS
    // ==========================================================

    if (credentialsRef.current) {
      const credP = THREE.MathUtils.clamp((offset - 0.8) / 0.14, 0, 1)
      credentialsRef.current.style.opacity = credP
      credentialsRef.current.style.transform = `translateX(${(1 - credP) * 180}px)`
    }

    // ==========================================================
    // PROJECT CATEGORIES
    // ==========================================================

    if (categoriesRef.current) {
      const catP = THREE.MathUtils.clamp((offset - 0.9) / 0.1, 0, 1)
      categoriesRef.current.style.opacity = catP
      categoriesRef.current.style.transform = `translateY(${(1 - catP) * 120}px)`
    }
  })

  return (
    <>
      {/* Cool night ambient, plus a low warm line like a horizon fire.
          Kept deliberately dim — the dandelion is mostly self-lit via
          emissive materials, it doesn't need much external light, and
          these were previously tuned for glass transmission which
          needs a lot more punch than a particle object does. */}
      <ambientLight intensity={0.12} color="#1a2230" />

      <pointLight color="#8fb3ff" intensity={2.5} distance={12} decay={2} position={[-3, 4, 4]} />
      <pointLight color="#d9770a" intensity={1.8} distance={10} decay={2} position={[3, -0.5, -2]} />
      <pointLight color="#fff4df" intensity={2.5} distance={10} decay={2} position={[0, 3.5, 2]} />
      <spotLight
        color="#fffaf0"
        intensity={4}
        distance={12}
        angle={Math.PI / 6}
        penumbra={0.9}
        decay={2}
        position={[0.5, 6, 1.5]}
        castShadow={false}
      />

      <DandelionHero position={[0, -0.75, 0]} />

      {/* ================================================== */}
      {/* KEYHOLE / IRIS OVERLAY                              */}
      {/* ================================================== */}

      <Scroll html style={{ width: '100%', zIndex: 10, position: 'relative' }}>
        <div
          ref={irisRef}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            pointerEvents: 'none'
          }}
        />

        <style>{`
          .category-card {
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
          }
          .category-card:hover {
            border-color: rgba(124, 252, 138, 0.7) !important;
            transform: translateY(-6px) scale(1.02);
            background: rgba(18, 24, 20, 0.95) !important;
            box-shadow: 0 20px 40px rgba(124, 252, 138, 0.12);
          }
        `}</style>

        {/* ====================================================== */}
        {/* HUD */}
        {/* ====================================================== */}

        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
          <div style={{ position: 'absolute', top: '32px', left: '38px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ color: '#f5f1ea', fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.08em' }}>LA</div>
            <div style={{ color: 'rgba(245,241,234,0.38)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.18em' }}>SOFTWARE ENGINEER</div>
          </div>

          <div style={{ position: 'absolute', top: '32px', right: '38px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ color: 'rgba(245,241,234,0.45)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.15em' }}>INDEX</div>
            <div ref={hudSectionRef} style={{ color: '#f5f1ea', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.12em' }}>01 / 04</div>
          </div>

          <div style={{ position: 'absolute', top: '60px', left: '38px', right: '38px', height: '1px', background: 'rgba(255,255,255,0.10)' }}>
            <div ref={hudProgressRef} style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, #2fae54, #7CFC8A)', boxShadow: '0 0 12px rgba(124,252,138,0.35)' }} />
          </div>

          <div style={{ position: 'absolute', bottom: '32px', left: '38px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#7CFC8A' }} />
            <span style={{ color: 'rgba(245,241,234,0.5)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.18em' }}>PORTFOLIO</span>
          </div>

          <div style={{ position: 'absolute', bottom: '32px', right: '38px', color: 'rgba(245,241,234,0.38)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.15em' }}>SCROLL TO EXPLORE</div>
        </div>

        {/* ================================================== */}
        {/* HERO */}
        {/* ================================================== */}

        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', pointerEvents: 'none' }}>
          <div ref={heroLeftRef} style={{ position: 'absolute', right: '4vw', top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap', willChange: 'transform', zIndex: 2 }}>
            <h1 style={{ margin: 0, color: '#f2f0eb', fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 'clamp(3rem, 7vw, 8rem)', fontWeight: 300, letterSpacing: '-0.055em', lineHeight: 0.9, textShadow: '0 4px 30px rgba(0,0,0,0.65)' }}>LESTER</h1>
          </div>

          <div ref={heroRightRef} style={{ position: 'absolute', left: '4vw', top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap', willChange: 'transform', zIndex: 2 }}>
            <h1 style={{ margin: 0, color: '#f2f0eb', fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 'clamp(3rem, 7vw, 8rem)', fontWeight: 300, letterSpacing: '-0.055em', lineHeight: 0.9, textShadow: '0 4px 30px rgba(0,0,0,0.65)' }}>ALCANTARA</h1>
          </div>

          <div style={{ position: 'absolute', left: '50%', bottom: '7vh', transform: 'translateX(-50%)', color: 'rgba(245, 240, 232, 0.45)', fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Every build starts as a single seed
          </div>

          <div style={{ position: 'absolute', left: '50%', bottom: '3vh', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.2em' }}>SCROLL</div>
        </div>

        {/* ================================================== */}
        {/* ABOUT */}
        {/* ================================================== */}

        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '8vw' }}>
          <div ref={profileRef} style={{ maxWidth: '600px', background: 'linear-gradient(135deg, rgba(14, 18, 15, 0.85), rgba(6, 8, 7, 0.95))', padding: '40px', borderRadius: '20px', border: '1px solid rgba(124, 252, 138, 0.25)', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '900', fontSize: '1.8rem', margin: '0 0 10px 0' }}>About Me</h3>
            <h4 style={{ color: '#7CFC8A', fontFamily: 'monospace', fontSize: '1rem', margin: '0 0 15px 0' }}>SOFTWARE ENGINEER</h4>
            <p style={{ color: '#e7e5e4', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
              Most of what I build looks like nothing for a long time — a schema, a script, a quiet service running in the dark. Then one day it opens: full-stack architecture, high-performance data systems, and interactive spatial engineering, all carried on the same wind until they land somewhere real.
            </p>
          </div>
        </div>

        {/* ================================================== */}
        {/* CREDENTIALS */}
        {/* ================================================== */}

        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8vw' }}>
          <div ref={credentialsRef} style={{ maxWidth: '600px', background: 'linear-gradient(135deg, rgba(14, 18, 15, 0.85), rgba(6, 8, 7, 0.95))', padding: '40px', borderRadius: '20px', border: '1px solid rgba(124, 252, 138, 0.25)', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '900', fontSize: '1.8rem', margin: '0 0 6px 0' }}>Roots</h3>
            <p style={{ color: 'rgba(231,229,228,0.6)', fontFamily: 'monospace', fontSize: '0.8rem', margin: '0 0 20px 0' }}>What holds up everything above ground.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <div><strong style={{ color: '#7CFC8A' }}>LANGUAGES:</strong> <span style={{ color: '#e7e5e4' }}>JavaScript, Python, C++</span></div>
              <div><strong style={{ color: '#7CFC8A' }}>FRONTEND & 3D:</strong> <span style={{ color: '#e7e5e4' }}>React, Three.js, React Three Fiber</span></div>
              <div><strong style={{ color: '#7CFC8A' }}>BACKEND:</strong> <span style={{ color: '#e7e5e4' }}>Node.js, Django, REST APIs</span></div>
              <div><strong style={{ color: '#7CFC8A' }}>DATABASE:</strong> <span style={{ color: '#e7e5e4' }}>Supabase, PostgreSQL</span></div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* PROJECT CATEGORIES */}
        {/* ================================================== */}

        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4vw' }}>
          <div ref={categoriesRef} style={{ width: '100%', maxWidth: '1000px' }}>
            <h2 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '900', fontSize: '2.5rem', textAlign: 'center', margin: '0 0 6px 0' }}>Where the Seeds Landed</h2>
            <p style={{ color: 'rgba(231,229,228,0.55)', fontFamily: 'monospace', fontSize: '0.85rem', textAlign: 'center', margin: '0 0 30px 0' }}>Same wind, different ground.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {projectCategories.map((cat, idx) => (
                <div key={cat.id} className="category-card" onClick={() => setActiveCategory(cat)} style={{ background: 'linear-gradient(135deg, rgba(14, 18, 15, 0.9), rgba(6, 8, 7, 0.95))', padding: '30px', borderRadius: '18px', border: '1px solid rgba(124, 252, 138, 0.3)' }}>
                  <span style={{ color: '#7CFC8A', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>0{idx + 1} //</span>
                  <h3 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontSize: '1.3rem', fontWeight: '800', margin: '15px 0' }}>{cat.name}</h3>
                  <div style={{ color: '#7CFC8A', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>EXPLODE VIEW →</div>
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