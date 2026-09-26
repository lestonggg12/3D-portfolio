import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Scroll, useScroll } from '@react-three/drei'
import * as THREE from 'three'
import ExplosiveCategoryModal from './ExplosiveCategoryModal'
import DandelionHero from './DandelionHero'
import { projectCategories } from '../data/projectsData'

// ============================================================
// PALETTE
// Cool blue-white accent (Flora's dominant tone) for chrome/UI —
// the warm amber core/horizon glow stays as-is, it's the
// intentional "fire front" ember the brief calls for.
// ============================================================
const ACCENT = '#9dd1ff'
const ACCENT_DIM = '#4f86c4'

// ============================================================
// SCROLL TIMELINE
// ScrollControls pages={7} = 1 hero div + 6 screen divs. Native
// scroll means each div's top reaches the viewport top after
// exactly 1/6 of the total offset range — these boundaries are
// physical fact, not a tuning choice, and must stay in sync with
// DandelionHero's RELEASE/BLOOM consts.
// ============================================================
const IRIS_OPEN_END = 0.017
const RELEASE_END = 0.122
const BLOOM_START = 0.122
const BLOOM_END = 0.15
const IRIS_CLOSE_START = 0.15
const HERO_END = 1 / 6

const SCREEN_COUNT = 6
const SCREEN_SPAN = 1 / 6

const READINGS = ['LAT 8.4803° N', 'SEED_COUNT 420', 'WIND 4kt NE', 'DRIFT +12%', '0x2F91', 'ALT 640m']

const SCREEN_CONFIG = [
  { axis: 'none' },        // 0 — hook / tagline
  { axis: 'x', from: -150 }, // 1 — about
  { axis: 'x', from: 180 },  // 2 — roots
  { axis: 'y', from: 80 },   // 3 — readings
  { axis: 'y', from: 120 },  // 4 — where the seeds landed
  { axis: 'none' }         // 5 — closing invitation
]

const SCRIPT_MARK_STYLE = [
  { top: '-6vh', left: '-2vw', fontSize: '42vw', transform: 'rotate(-8deg)' },
  { bottom: '-10vh', right: '-4vw', fontSize: '38vw', transform: 'rotate(6deg)' },
  { top: '-8vh', right: '-3vw', fontSize: '40vw', transform: 'rotate(-5deg)' },
  { bottom: '-8vh', left: '-3vw', fontSize: '36vw', transform: 'rotate(4deg)' },
  { top: '-4vh', left: '50%', fontSize: '44vw', transform: 'translateX(-50%) rotate(0deg)' },
  { bottom: '-10vh', left: '-2vw', fontSize: '40vw', transform: 'rotate(-6deg)' }
]

// A recurring script-S watermark — the "six screens of copy set
// with a script S" from the brief. Same mark, repositioned and
// rescaled per screen, and faded in with the same progress as its
// screen's card so it never bleeds into view ahead of its cue.
function ScriptMark({ index, markRef }) {
  return (
    <div
      ref={markRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        fontFamily: "'Dancing Script', cursive",
        fontWeight: 700,
        color: ACCENT,
        opacity: 0,
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
        ...SCRIPT_MARK_STYLE[index]
      }}
    >
      S
    </div>
  )
}

const cardShellStyle = {
  maxWidth: '600px',
  background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.85), rgba(5, 7, 10, 0.95))',
  padding: '40px',
  borderRadius: '20px',
  border: `1px solid rgba(157, 209, 255, 0.25)`,
  backdropFilter: 'blur(10px)',
  position: 'relative',
  zIndex: 1
}

export default function CinematicScene() {
  const hudSectionRef = useRef()
  const hudProgressRef = useRef()
  const irisRef = useRef()
  const scroll = useScroll()
  const { camera } = useThree()

  const heroLeftRef = useRef()
  const heroRightRef = useRef()
  const readingRefs = useRef([])
  const screenRefs = useRef([])
  const markRefs = useRef([])

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
    // HUD STATE — 1 hero section + 6 copy screens = 7 total.
    // ==========================================================

    const sectionIndex = offset < HERO_END
      ? 1
      : 2 + Math.min(SCREEN_COUNT - 1, Math.floor((offset - HERO_END) / SCREEN_SPAN))
    const progress = Math.max(0, Math.min(100, offset * 100))

    if (hudSectionRef.current) hudSectionRef.current.textContent = `0${sectionIndex} / 07`
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
    if (offset < IRIS_OPEN_END) {
      const openT = Math.max(autoOpen, THREE.MathUtils.smoothstep(offset, 0, IRIS_OPEN_END))
      radius = THREE.MathUtils.lerp(0, 140, openT)
    } else if (offset < IRIS_CLOSE_START) {
      radius = 140
    } else if (offset < HERO_END) {
      radius = THREE.MathUtils.lerp(140, 0, THREE.MathUtils.smoothstep(offset, IRIS_CLOSE_START, HERO_END))
    } else {
      radius = 0
    }

    const overlayFade = offset < HERO_END
      ? 1
      : 1 - THREE.MathUtils.smoothstep(offset, HERO_END, HERO_END + 0.02)

    if (irisRef.current) {
      irisRef.current.style.background =
        `radial-gradient(circle at 50% 46%, transparent 0%, transparent ${radius}%, #050403 ${radius + 0.6}%)`
      irisRef.current.style.opacity = overlayFade
    }

    // ==========================================================
    // HERO PROGRESS (dandelion pull-back + drift to corner)
    // ==========================================================

    const heroProgress = THREE.MathUtils.clamp(offset / BLOOM_END, 0, 1)
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
      heroLeftRef.current.style.opacity = 1 - THREE.MathUtils.smoothstep(offset, IRIS_CLOSE_START, HERO_END)
      heroRightRef.current.style.opacity = heroLeftRef.current.style.opacity
    }

    // ==========================================================
    // READINGS — "readings fly off with the petals". Small
    // telemetry tags scatter outward from the bloom as it opens,
    // then fade before the first copy screen arrives.
    // ==========================================================

    const bloomP = THREE.MathUtils.smoothstep(offset, BLOOM_START, BLOOM_END)
    const readingFadeOut = 1 - THREE.MathUtils.smoothstep(offset, BLOOM_END, HERO_END + 0.02)
    const readingOpacity = bloomP * readingFadeOut

    readingRefs.current.forEach((el, i) => {
      if (!el) return
      const angle = (i / READINGS.length) * Math.PI * 2 + 0.4
      const dist = 30 + bloomP * 150
      el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist * 0.55}px)`
      el.style.opacity = readingOpacity * 0.85
    })

    // ==========================================================
    // SIX COPY SCREENS — each fades/slides in over its own span.
    // ==========================================================

    for (let i = 0; i < SCREEN_COUNT; i++) {
      const el = screenRefs.current[i]
      if (!el) continue

      const start = HERO_END + i * SCREEN_SPAN
      const p = THREE.MathUtils.clamp((offset - start) / (SCREEN_SPAN * 0.6), 0, 1)
      const cfg = SCREEN_CONFIG[i]

      el.style.opacity = p
      if (cfg.axis === 'x') {
        el.style.transform = `translateX(${(1 - p) * cfg.from}px)`
      } else if (cfg.axis === 'y') {
        el.style.transform = `translateY(${(1 - p) * cfg.from}px)`
      } else {
        el.style.transform = `translateY(${(1 - p) * 30}px)`
      }

      const markEl = markRefs.current[i]
      if (markEl) markEl.style.opacity = p * 0.07
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
            border-color: rgba(157, 209, 255, 0.7) !important;
            transform: translateY(-6px) scale(1.02);
            background: rgba(14, 19, 26, 0.95) !important;
            box-shadow: 0 20px 40px rgba(157, 209, 255, 0.14);
          }
          .signal-btn {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .signal-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 16px 32px rgba(157, 209, 255, 0.25);
          }

          /* Tablet: category grid drops from 3 columns to 2 */
          @media (max-width: 1024px) {
            .category-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          /* Phone: the hero split-name, side-anchored cards, category
             grid, and HUD margins all assume desktop width and will
             overlap or overflow below this point. */
          @media (max-width: 640px) {
            .hero-name {
              font-size: clamp(1.4rem, 8vw, 2.2rem) !important;
            }
            .screen-card {
              max-width: 92vw !important;
              width: 92vw !important;
              padding: 24px !important;
            }
            .screen-side {
              justify-content: center !important;
              padding-left: 5vw !important;
              padding-right: 5vw !important;
            }
            .category-grid {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
            }
            .hud-margin-top {
              top: 18px !important;
            }
            .hud-margin-left {
              left: 18px !important;
            }
            .hud-margin-right {
              right: 18px !important;
            }
            .hud-margin-bottom {
              bottom: 18px !important;
            }
          }
        `}</style>

        {/* ====================================================== */}
        {/* HUD */}
        {/* ====================================================== */}

        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
          <div className="hud-margin-top hud-margin-left" style={{ position: 'absolute', top: '32px', left: '38px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ color: '#f5f1ea', fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.08em' }}>LA</div>
            <div style={{ color: 'rgba(245,241,234,0.38)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.18em' }}>SOFTWARE ENGINEER</div>
          </div>

          <div className="hud-margin-top hud-margin-right" style={{ position: 'absolute', top: '32px', right: '38px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ color: 'rgba(245,241,234,0.45)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.15em' }}>INDEX</div>
            <div ref={hudSectionRef} style={{ color: '#f5f1ea', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.12em' }}>01 / 07</div>
          </div>

          <div style={{ position: 'absolute', top: '60px', left: '38px', right: '38px', height: '1px', background: 'rgba(255,255,255,0.10)' }}>
            <div ref={hudProgressRef} style={{ width: '0%', height: '100%', background: `linear-gradient(90deg, ${ACCENT_DIM}, ${ACCENT})`, boxShadow: `0 0 12px rgba(157,209,255,0.4)` }} />
          </div>

          <div className="hud-margin-bottom hud-margin-left" style={{ position: 'absolute', bottom: '32px', left: '38px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: ACCENT }} />
            <span style={{ color: 'rgba(245,241,234,0.5)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.18em' }}>PORTFOLIO</span>
          </div>

          <div className="hud-margin-bottom hud-margin-right" style={{ position: 'absolute', bottom: '32px', right: '38px', color: 'rgba(245,241,234,0.38)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.15em' }}>SCROLL TO EXPLORE</div>
        </div>

        {/* ================================================== */}
        {/* HERO */}
        {/* ================================================== */}

        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', pointerEvents: 'none' }}>
          <div ref={heroLeftRef} style={{ position: 'absolute', right: '4vw', top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap', willChange: 'transform', zIndex: 2 }}>
            <h1 className="hero-name" style={{ margin: 0, color: '#f2f0eb', fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 'clamp(3rem, 7vw, 8rem)', fontWeight: 300, letterSpacing: '-0.055em', lineHeight: 0.9, textShadow: '0 4px 30px rgba(0,0,0,0.65)' }}>LESTER</h1>
          </div>

          <div ref={heroRightRef} style={{ position: 'absolute', left: '4vw', top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap', willChange: 'transform', zIndex: 2 }}>
            <h1 className="hero-name" style={{ margin: 0, color: '#f2f0eb', fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 'clamp(3rem, 7vw, 8rem)', fontWeight: 300, letterSpacing: '-0.055em', lineHeight: 0.9, textShadow: '0 4px 30px rgba(0,0,0,0.65)' }}>ALCANTARA</h1>
          </div>

          {/* "readings fly off with the petals" — small telemetry
              tags scattering outward from the bloom as it opens. */}
          <div style={{ position: 'absolute', left: '50%', top: '42%', width: 0, height: 0, zIndex: 3 }}>
            {READINGS.map((r, i) => (
              <span
                key={r}
                ref={(el) => { readingRefs.current[i] = el }}
                style={{
                  position: 'absolute',
                  whiteSpace: 'nowrap',
                  fontFamily: 'monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  color: ACCENT,
                  opacity: 0
                }}
              >
                {r}
              </span>
            ))}
          </div>

          <div style={{ position: 'absolute', left: '50%', bottom: '7vh', transform: 'translateX(-50%)', color: 'rgba(245, 240, 232, 0.45)', fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Every build starts as a single seed
          </div>

          <div style={{ position: 'absolute', left: '50%', bottom: '3vh', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.2em' }}>SCROLL</div>
        </div>

        {/* ================================================== */}
        {/* SCREEN 0 — HOOK / TAGLINE                           */}
        {/* ================================================== */}

        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <ScriptMark index={0} markRef={(el) => { markRefs.current[0] = el }} />
          <div ref={(el) => { screenRefs.current[0] = el }} style={{ position: 'relative', zIndex: 1, maxWidth: '760px', padding: '0 6vw' }}>
            <h2 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 300, fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', margin: '0 0 18px 0', lineHeight: 1.05 }}>
              Build first.<br />Be seen later.
            </h2>
            <p style={{ color: 'rgba(231,229,228,0.6)', fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '0.04em', margin: 0 }}>
              Most of the work happens before anyone's watching. This is the part after.
            </p>
          </div>
        </div>

        {/* ================================================== */}
        {/* SCREEN 1 — ABOUT                                    */}
        {/* ================================================== */}

        <div className="screen-side" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '8vw' }}>
          <ScriptMark index={1} markRef={(el) => { markRefs.current[1] = el }} />
          <div ref={(el) => { screenRefs.current[1] = el }} className="screen-card" style={cardShellStyle}>
            <h3 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '900', fontSize: '1.8rem', margin: '0 0 10px 0' }}>About Me</h3>
            <h4 style={{ color: ACCENT, fontFamily: 'monospace', fontSize: '1rem', margin: '0 0 15px 0' }}>SOFTWARE ENGINEER</h4>
            <p style={{ color: '#e7e5e4', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
              Most of what I build looks like nothing for a long time — a schema, a script, a quiet service running in the dark. Then one day it opens: full-stack architecture, high-performance data systems, and interactive spatial engineering, all carried on the same wind until they land somewhere real.
            </p>
          </div>
        </div>

        {/* ================================================== */}
        {/* SCREEN 2 — ROOTS / CREDENTIALS                      */}
        {/* ================================================== */}

        <div className="screen-side" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8vw' }}>
          <ScriptMark index={2} markRef={(el) => { markRefs.current[2] = el }} />
          <div ref={(el) => { screenRefs.current[2] = el }} className="screen-card" style={cardShellStyle}>
            <h3 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '900', fontSize: '1.8rem', margin: '0 0 6px 0' }}>Roots</h3>
            <p style={{ color: 'rgba(231,229,228,0.6)', fontFamily: 'monospace', fontSize: '0.8rem', margin: '0 0 20px 0' }}>What holds up everything above ground.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <div><strong style={{ color: ACCENT }}>LANGUAGES:</strong> <span style={{ color: '#e7e5e4' }}>JavaScript, Python, C++</span></div>
              <div><strong style={{ color: ACCENT }}>FRONTEND & 3D:</strong> <span style={{ color: '#e7e5e4' }}>React, Three.js, React Three Fiber</span></div>
              <div><strong style={{ color: ACCENT }}>BACKEND:</strong> <span style={{ color: '#e7e5e4' }}>Node.js, Django, REST APIs</span></div>
              <div><strong style={{ color: ACCENT }}>DATABASE:</strong> <span style={{ color: '#e7e5e4' }}>Supabase, PostgreSQL</span></div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* SCREEN 3 — READINGS                                 */}
        {/* ================================================== */}

        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ScriptMark index={3} markRef={(el) => { markRefs.current[3] = el }} />
          <div ref={(el) => { screenRefs.current[3] = el }} className="screen-card" style={{ ...cardShellStyle, maxWidth: '640px', width: '90%' }}>
            <h3 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '900', fontSize: '1.8rem', margin: '0 0 6px 0' }}>Readings</h3>
            <p style={{ color: 'rgba(231,229,228,0.6)', fontFamily: 'monospace', fontSize: '0.8rem', margin: '0 0 20px 0' }}>A few numbers the seeds left behind.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <div><strong style={{ color: ACCENT }}>2028 //</strong> <span style={{ color: '#e7e5e4' }}>Expected graduation, Computer Engineering, PHINMA CDO College</span></div>
              <div><strong style={{ color: ACCENT }}>AWARD //</strong> <span style={{ color: '#e7e5e4' }}>City Scholar</span></div>
              <div><strong style={{ color: ACCENT }}>SHIPPED //</strong> <span style={{ color: '#e7e5e4' }}>Multiple full-stack systems in active use, from cloud database cores to inventory dashboards</span></div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* SCREEN 4 — WHERE THE SEEDS LANDED                   */}
        {/* ================================================== */}

        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4vw' }}>
          <ScriptMark index={4} markRef={(el) => { markRefs.current[4] = el }} />
          <div ref={(el) => { screenRefs.current[4] = el }} style={{ width: '100%', maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
            <h2 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '900', fontSize: '2.5rem', textAlign: 'center', margin: '0 0 6px 0' }}>Where the Seeds Landed</h2>
            <p style={{ color: 'rgba(231,229,228,0.55)', fontFamily: 'monospace', fontSize: '0.85rem', textAlign: 'center', margin: '0 0 30px 0' }}>Same wind, different ground.</p>
            <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {projectCategories.map((cat, idx) => (
                <div key={cat.id} className="category-card" onClick={() => setActiveCategory(cat)} style={{ background: 'linear-gradient(135deg, rgba(12, 16, 22, 0.9), rgba(5, 7, 10, 0.95))', padding: '30px', borderRadius: '18px', border: `1px solid rgba(157, 209, 255, 0.3)` }}>
                  <span style={{ color: ACCENT, fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>0{idx + 1} //</span>
                  <h3 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontSize: '1.3rem', fontWeight: '800', margin: '15px 0' }}>{cat.name}</h3>
                  <div style={{ color: ACCENT, fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>EXPLODE VIEW →</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* SCREEN 5 — CLOSING INVITATION                       */}
        {/* ================================================== */}

        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <ScriptMark index={5} markRef={(el) => { markRefs.current[5] = el }} />
          <div ref={(el) => { screenRefs.current[5] = el }} style={{ position: 'relative', zIndex: 1, maxWidth: '680px', padding: '0 6vw' }}>
            <h2 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 300, fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', letterSpacing: '-0.03em', margin: '0 0 18px 0', lineHeight: 1.05 }}>
              Be someone else's<br />first hop.
            </h2>
            <p style={{ color: 'rgba(231,229,228,0.6)', fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '0.02em', margin: '0 0 34px 0' }}>
              If something above is worth building on, this is where that starts.
            </p>
            {/* TODO: replace with your real contact address */}
            <a
              href="mailto:your-email@example.com"
              className="signal-btn"
              style={{
                display: 'inline-block',
                padding: '16px 38px',
                borderRadius: '999px',
                border: `1px solid ${ACCENT}`,
                color: ACCENT,
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                textDecoration: 'none',
                textTransform: 'uppercase'
              }}
            >
              Send a signal →
            </a>
          </div>
        </div>
      </Scroll>

      <ExplosiveCategoryModal category={activeCategory} onClose={() => setActiveCategory(null)} />
    </>
  )
}