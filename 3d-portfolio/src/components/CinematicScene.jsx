import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import DandelionVoyage from './DandelionVoyage';
import ExplosiveCategoryModal from './ExplosiveCategoryModal';
import { projectCategories } from '../data/projectsData';
import {
  Code2,
  Terminal,
  Database,
  Mail,
  Copy,
  Check,
  GraduationCap,
  Award,
  Sparkles,
  Server,
  ArrowRight,
  Cpu,
  Layers,
  Activity,
  Shield,
  Compass,
  Zap,
  ExternalLink
} from 'lucide-react';

export default function CinematicScene({
  onScrollStateChange,
  onSelectCategory,
  onNavigateSection
}) {
  const scroll = useScroll();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [aboutTab, setAboutTab] = useState('journey'); // 'journey' | 'philosophy' | 'lab'
  const [featuredProjectIndex, setFeaturedProjectIndex] = useState(0);

  // References for hero text transitions
  const heroLeftRef = useRef();
  const heroRightRef = useRef();
  const heroSubtitleRef = useRef();
  const lookAtTarget = useRef(new THREE.Vector3()).current;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('lesteralcantara1432@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleOpenCategory = (cat) => {
    setActiveCategory(cat);
    if (onSelectCategory) onSelectCategory(cat);
  };

  // Flattened list of projects for the featured interactive showcase
  const allProjects = projectCategories.flatMap((cat) => cat.projects);
  const activeFeaturedProject = allProjects[featuredProjectIndex] || allProjects[0];

 useFrame((state) => {
    const offset = scroll.offset;

    // Update section index (1 to 7) based on scroll progress
    const sectionIndex = Math.min(7, Math.max(1, Math.floor(offset * 6.99) + 1));
    if (onScrollStateChange) {
      onScrollStateChange(sectionIndex, offset);
    }

    // =========================================================================
    // UNPREDICTABLE 3D SPATIAL CAMERA CHOREOGRAPHY
    // Instead of scrolling down in a boring straight line, the camera weaves,
    // swoops, climbs, banks, and catches cinematic vantage points through space!
    // =========================================================================

    // Multi-harmonic curving trajectory
    const t = offset; // 0.0 to 1.0

    // X: Weaves left on doctrine, arcs right on about, swoops left on roots, dives right on projects
    const targetCamX =
      Math.sin(t * Math.PI * 2.8) * 2.6 +
      Math.cos(t * Math.PI * 5.2) * 0.9;

    // Y: Climbs on seed launch, dips on about, elevates for wide roots, plunges for low-angle project hero
    const targetCamY =
      Math.sin(t * Math.PI * 3.4) * 1.6 -
      t * 1.8 +
      Math.cos(t * Math.PI * 1.8) * 0.6;

    // Z: Dynamic depth push-in (macro detail) and pull-out (epic wide vista)
    const targetCamZ =
      7.6 -
      Math.sin(t * Math.PI * 2.2) * 2.2 +
      Math.sin(t * Math.PI * 6.0) * 0.7;

    // Look-At Target coordinates that weave asymmetrically with the seed cloud
    const lookX = Math.sin(t * Math.PI * 2.5) * 1.4;
    const lookY = 1.3 - t * 2.2 + Math.sin(t * Math.PI * 4) * 0.5;
    const lookZ = Math.sin(t * Math.PI * 3) * 0.8;

    // Smooth lerp camera position with responsive mouse parallax
    const mouseInfluenceX = state.pointer.x * 0.45;
    const mouseInfluenceY = state.pointer.y * 0.35;

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetCamX + mouseInfluenceX,
      0.06
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetCamY + mouseInfluenceY,
      0.06
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetCamZ,
      0.06
    );

    // Dynamic LookAt with soft tracking
    lookAtTarget.set(lookX, lookY, lookZ);
    state.camera.lookAt(lookAtTarget);

    // Subtle aerodynamic roll / banking angle on trajectory curves
    const rollAngle =
      Math.sin(t * Math.PI * 3.2) * 0.05 +
      state.pointer.x * -0.03;
    state.camera.rotation.z = THREE.MathUtils.lerp(
      state.camera.rotation.z,
      rollAngle,
      0.05
    );

    // Hero Typography animation:
    // Disperse smoothly outward and upward into the wind instead of colliding!
    if (heroLeftRef.current && heroRightRef.current) {
      const heroFadeOut = THREE.MathUtils.smoothstep(offset, 0.015, 0.13);
      heroLeftRef.current.style.transform = `translate(-${heroFadeOut * 28}vw, -50%) rotate(${heroFadeOut * -6}deg)`;
      heroRightRef.current.style.transform = `translate(${heroFadeOut * 28}vw, -50%) rotate(${heroFadeOut * 6}deg)`;
      const opacity = Math.max(0, 1 - heroFadeOut * 1.2);
      heroLeftRef.current.style.opacity = `${opacity}`;
      heroRightRef.current.style.opacity = `${opacity}`;
      if (heroSubtitleRef.current) {
        heroSubtitleRef.current.style.opacity = `${Math.max(0, 1 - heroFadeOut * 1.6)}`;
        heroSubtitleRef.current.style.transform = `translate(-50%, ${heroFadeOut * 45}px)`;
      }
    }
  });

  return (
    <>
      {/* 3D Scene Ambient & Directional Lighting */}
      <ambientLight intensity={0.28} color="#1e293b" />
      <directionalLight position={[6, 9, 5]} intensity={1.3} color="#bae6fd" />
      <pointLight position={[-5, 3, -2]} intensity={0.9} color="#38bdf8" />
      <pointLight position={[4, -2, 3]} intensity={0.7} color="#93c5fd" />

      {/* 3D Dandelion & Flight System */}
      <DandelionVoyage />

      {/* 2D HTML Narrative Scroll Container */}
      <Scroll html style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        {/* ================================================== */}
        {/* SCREEN 1: HERO OVERLAY                             */}
        {/* ================================================== */}
        <section className="w-screen h-screen relative flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <div
            ref={heroLeftRef}
            className="absolute left-[4vw] sm:left-[8vw] top-1/2 -translate-y-1/2 pointer-events-none transition-transform will-change-transform"
          >
            <h1 className="text-zinc-100 font-sans font-light tracking-[-0.05em] text-[11vw] sm:text-[9vw] leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
              ALCANTARA
            </h1>
          </div>

          <div
            ref={heroRightRef}
            className="absolute right-[4vw] sm:right-[8vw] top-1/2 -translate-y-1/2 pointer-events-none transition-transform will-change-transform"
          >
            <h1 className="text-zinc-100 font-sans font-light tracking-[-0.05em] text-[11vw] sm:text-[9vw] leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
              LESTER
            </h1>
          </div>

          {/* Subtitle & Scroll Invitation */}
          <div
            ref={heroSubtitleRef}
            className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 text-center flex flex-col items-center gap-2 pointer-events-auto px-4"
          >
            <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-zinc-400 uppercase text-center">
              Every build starts as a single seed
            </p>
            <button
              onClick={() => onNavigateSection && onNavigateSection(1)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 hover:border-sky-400/60 text-[11px] font-mono tracking-widest text-sky-300 cursor-pointer transition-all duration-200 group"
            >
              <span>SCROLL OR CLICK TO LAUNCH</span>
              <span className="animate-bounce group-hover:translate-y-0.5 transition-transform">↓</span>
            </button>
          </div>
        </section>

        {/* ================================================== */}
        {/* SCREEN 2: CORE DOCTRINE / HOOK                     */}
        {/* ================================================== */}
        <section className="w-screen h-screen relative flex items-center justify-center px-4 sm:px-6 md:px-12 overflow-hidden">
          <div className="max-w-2xl w-full text-center flex flex-col items-center gap-5 bg-zinc-950/75 border border-sky-400/20 p-6 sm:p-10 md:p-12 rounded-3xl backdrop-blur-2xl shadow-2xl shadow-sky-950/40">
            <span className="text-xs font-mono tracking-widest text-sky-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              ENGINEERING PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-sans text-white tracking-tight leading-tight">
              Build first.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-400 to-cyan-300">
                Be seen later.
              </span>
            </h2>
            <p className="text-sm sm:text-base font-mono text-zinc-300 leading-relaxed max-w-xl">
              Most of the work happens before anyone is watching — the database schemas, the query plans, the resilient background services running in the dark. This is the part after.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-zinc-500">
              <span>01. ZERO DOWNTIME</span>
              <span aria-hidden="true">·</span>
              <span>02. DETERMINISTIC STATE</span>
              <span aria-hidden="true">·</span>
              <span>03. CLOUD SCALE</span>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SCREEN 3: ABOUT ME (RICH STORY & MOCK-UPS)         */}
        {/* ================================================== */}
        <section className="w-screen h-screen relative flex items-center justify-center sm:justify-start px-4 sm:px-10 md:px-20 overflow-hidden">
          <div className="max-w-xl w-full bg-zinc-950/85 border border-sky-400/30 p-6 sm:p-9 rounded-3xl backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col gap-5">
            {/* Header with Photo & Status */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <img
                src="/profile.jpg"
                alt="Lester Alcantara"
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-sky-400/40 shadow-lg shadow-sky-500/20 shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-sans text-white tracking-tight">
                    Lester Alcantara
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Available for engineering roles" />
                </div>
                <span className="text-xs font-mono text-sky-400 font-semibold uppercase tracking-wider">
                  Software Engineer & Computer Engineering Student
                </span>
                <span className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  PHINMA Cagayan de Oro College · Class of 2028
                </span>
              </div>
            </div>

            {/* Interactive Story Tabs */}
            <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
              <button
                onClick={() => setAboutTab('journey')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-medium transition-all ${
                  aboutTab === 'journey'
                    ? 'bg-sky-500/20 border border-sky-400/40 text-sky-200 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                The Journey
              </button>
              <button
                onClick={() => setAboutTab('philosophy')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-medium transition-all ${
                  aboutTab === 'philosophy'
                    ? 'bg-sky-500/20 border border-sky-400/40 text-sky-200 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Philosophy
              </button>
              <button
                onClick={() => setAboutTab('lab')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-medium transition-all ${
                  aboutTab === 'lab'
                    ? 'bg-sky-500/20 border border-sky-400/40 text-sky-200 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Hardware Lab
              </button>
            </div>

            {/* Tab Narrative Content */}
            <div className="min-h-[140px] flex items-center">
              {aboutTab === 'journey' && (
                <div className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed space-y-2">
                  <p>
                    I began exploring software by dismantling electronics and writing low-level C++ scripts. That fascination grew into architecting full-stack cloud ecosystems that handle commercial transactions, secure member databases, and reactive 3D WebGL experiences.
                  </p>
                  <p className="text-sky-300/90 text-xs">
                    Every system I construct is grounded in rigorous database design, resilient state synchronizers, and sub-50ms latency benchmarks.
                  </p>
                </div>
              )}

              {aboutTab === 'philosophy' && (
                <div className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed space-y-2">
                  <p>
                    "Silent Infrastructure": The most important software in the world is the software people never have to think about because it never breaks.
                  </p>
                  <p className="text-sky-300/90 text-xs">
                    I treat schema migrations, connection pooling, and optimistic UI rendering as foundational craftsmanship — building systems that stand firm under heavy daily loads.
                  </p>
                </div>
              )}

              {aboutTab === 'lab' && (
                <div className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed space-y-2">
                  <p>
                    Hands-on engineering lab in Cagayan de Oro: ESP32 microcontrollers, IoT sensor arrays, custom Linux development environments, and embedded C++ systems.
                  </p>
                  <p className="text-sky-300/90 text-xs">
                    Bridging physical computing with cloud endpoints gives me a comprehensive understanding of computing from raw silicon transistors up to serverless cloud functions.
                  </p>
                </div>
              )}
            </div>

            {/* Metric Highlights Strip */}
            <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="text-base sm:text-lg font-bold text-sky-300">10k+</div>
                <div className="text-[10px] text-zinc-400 uppercase">Transactions</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="text-base sm:text-lg font-bold text-emerald-400">99.9%</div>
                <div className="text-[10px] text-zinc-400 uppercase">Uptime Goal</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="text-base sm:text-lg font-bold text-cyan-300">&lt;50ms</div>
                <div className="text-[10px] text-zinc-400 uppercase">Query Target</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SCREEN 4: SYSTEM ROOTS (TECHNICAL CAPABILITIES)    */}
        {/* ================================================== */}
        <section className="w-screen h-screen relative flex items-center justify-center sm:justify-end px-4 sm:px-10 md:px-20 overflow-hidden">
          <div className="max-w-xl w-full bg-zinc-950/85 border border-sky-400/30 p-6 sm:p-9 rounded-3xl backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col gap-5">
            <div>
              <span className="text-xs font-mono text-sky-400 uppercase tracking-widest font-semibold">
                CORE CAPABILITIES
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-sans text-white tracking-tight mt-1">
                Roots
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                The technical pillars holding up everything above ground.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-white/10 hover:border-sky-400/30 transition-all flex flex-col gap-1.5">
                <span className="text-sky-400 font-semibold tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  LANGUAGES
                </span>
                <span className="text-zinc-200">JavaScript, Python, C++, TypeScript, SQL, Bash</span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-white/10 hover:border-sky-400/30 transition-all flex flex-col gap-1.5">
                <span className="text-sky-400 font-semibold tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  FRONTEND & 3D
                </span>
                <span className="text-zinc-200">React, Three.js, React Three Fiber, Tailwind CSS, Vite</span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-white/10 hover:border-sky-400/30 transition-all flex flex-col gap-1.5">
                <span className="text-sky-400 font-semibold tracking-wider flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" />
                  BACKEND & APIS
                </span>
                <span className="text-zinc-200">Node.js, Express, RESTful APIs, WebSockets, Django</span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-white/10 hover:border-sky-400/30 transition-all flex flex-col gap-1.5">
                <span className="text-sky-400 font-semibold tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  DATABASE & CLOUD
                </span>
                <span className="text-zinc-200">Supabase, PostgreSQL, Relational Migrations, RLS Security</span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-white/10 hover:border-sky-400/30 transition-all sm:col-span-2 flex flex-col gap-1.5">
                <span className="text-cyan-400 font-semibold tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  HARDWARE & SYSTEMS
                </span>
                <span className="text-zinc-300">
                  ESP32 Microcontrollers, Digital Logic Design, Linux/UNIX Environments, Git Workflow
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SCREEN 5: FEATURED PROJECTS SPOTLIGHT (INTERACTIVE) */}
        {/* ================================================== */}
        <section className="w-screen h-screen relative flex items-center justify-center px-4 sm:px-8 md:px-12 overflow-hidden">
          <div className="max-w-5xl w-full bg-zinc-950/85 border border-sky-400/30 p-5 sm:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl shadow-black/90 flex flex-col gap-5">
            {/* Header & Category Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  FEATURED SYSTEM SHOWCASE
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight mt-0.5">
                  Where the Seeds Landed
                </h3>
              </div>

              {/* Project Selector Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {allProjects.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFeaturedProjectIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      featuredProjectIndex === idx
                        ? 'bg-sky-500 text-zinc-950 font-bold shadow-md shadow-sky-500/30'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-white/5'
                    }`}
                  >
                    0{idx + 1}. {p.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Featured Project Stage */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left Column: Visual Showcase */}
              <div className="md:col-span-6 relative group overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-inner">
                <img
                  src={activeFeaturedProject.image}
                  alt={activeFeaturedProject.title}
                  className="w-full h-44 sm:h-64 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-70" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 bg-black/70 px-2.5 py-1 rounded backdrop-blur-md border border-emerald-400/20">
                    {activeFeaturedProject.status}
                  </span>
                  <span className="text-[11px] font-mono text-sky-300 bg-black/70 px-2.5 py-1 rounded backdrop-blur-md border border-sky-400/20">
                    {activeFeaturedProject.metrics}
                  </span>
                </div>
              </div>

              {/* Right Column: Deep Architecture Intel */}
              <div className="md:col-span-6 flex flex-col gap-3">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold font-sans text-white">
                    {activeFeaturedProject.title}
                  </h4>
                  <p className="text-xs font-mono text-sky-400 mt-0.5">
                    {activeFeaturedProject.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed line-clamp-3">
                  {activeFeaturedProject.details}
                </p>

                {/* Highlights */}
                {activeFeaturedProject.highlights && (
                  <div className="space-y-1.5 mt-1">
                    {activeFeaturedProject.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeFeaturedProject.tech.slice(0, 4).map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-400/20 text-sky-200 text-[11px] font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Trigger */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      const matchedCat = projectCategories.find((cat) =>
                        cat.projects.some((p) => p.title === activeFeaturedProject.title)
                      );
                      handleOpenCategory(matchedCat || projectCategories[0]);
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>EXPLODE ARCHITECTURE VIEW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SCREEN 6: READINGS & MILESTONES                    */}
        {/* ================================================== */}
        <section className="w-screen h-screen relative flex items-center justify-center px-4 sm:px-6 md:px-12 overflow-hidden">
          <div className="max-w-2xl w-full bg-zinc-950/85 border border-sky-400/30 p-6 sm:p-10 rounded-3xl backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col gap-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-sky-400 uppercase tracking-widest font-semibold">
                TELEMETRY & IMPACT
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-sans text-white tracking-tight mt-1">
                Readings
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Verified milestones and markers the seeds left behind.
              </p>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs sm:text-sm">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-sky-400/30 transition-all">
                <GraduationCap className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sky-300 font-semibold">2028 // EXPECTED GRADUATION</div>
                  <div className="text-zinc-300 text-xs sm:text-sm mt-0.5">
                    Bachelor of Science in Computer Engineering, PHINMA Cagayan de Oro College.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-amber-400/30 transition-all">
                <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-amber-300 font-semibold">HONOR // CITY SCHOLAR</div>
                  <div className="text-zinc-300 text-xs sm:text-sm mt-0.5">
                    Awarded academic scholarship recognizing top engineering and scientific talent in the city.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-emerald-400/30 transition-all">
                <Server className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-emerald-300 font-semibold">SHIPPED // PRODUCTION SYSTEMS IN ACTIVE USE</div>
                  <div className="text-zinc-300 text-xs sm:text-sm mt-0.5">
                    Multiple full-stack cloud database cores, residential governance portals, and commercial inventory subsystems handling real transactions daily.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SCREEN 7: TRANSMIT SIGNAL / CONTACT                */}
        {/* ================================================== */}
        <section className="w-screen h-screen relative flex items-center justify-center px-4 sm:px-6 md:px-12 overflow-hidden text-center">
          <div className="max-w-2xl w-full flex flex-col items-center gap-6 bg-zinc-950/85 border border-sky-400/30 p-6 sm:p-12 rounded-3xl backdrop-blur-2xl shadow-2xl shadow-sky-950/40">
            <span className="text-xs font-mono text-sky-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              TRANSMIT A SIGNAL
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light font-sans text-white tracking-tight leading-tight">
              Be someone else's<br />
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-400 to-cyan-300">
                first hop.
              </span>
            </h2>

            <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed max-w-lg">
              If something above is worth building on, this is where that starts. Open for software engineering roles, cloud systems architecture, and spatial interface projects.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full justify-center">
              <a
                href="mailto:lesteralcantara1432@gmail.com"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-zinc-950 font-mono font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send a signal →</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-sky-400/30 text-sky-300 font-mono text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col items-center gap-1 pt-2">
              <div className="text-xs font-mono text-zinc-400">
                lesteralcantara1432@gmail.com
              </div>
              <div className="text-[10px] font-mono text-zinc-600">
                Cagayan de Oro, Northern Mindanao, Philippines (UTC+8)
              </div>
            </div>
          </div>
        </section>
      </Scroll>

      {/* Render Category Modal */}
      <ExplosiveCategoryModal
        category={activeCategory}
        onClose={() => setActiveCategory(null)}
      />
    </>
  );
}