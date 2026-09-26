import { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import * as THREE from 'three';
import CinematicScene from './components/CinematicScene';
import NightFieldBackground from './components/NightFieldBackground';
import HUD from './components/HUD';

export default function App() {
  const [currentSection, setCurrentSection] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScrollStateChange = useCallback((section, progress) => {
    setCurrentSection((prev) => (prev !== section ? section : prev));
    setScrollProgress(progress);
  }, []);

  const handleNavigateSection = useCallback((targetIndex) => {
    const scrollableEl = document.querySelector('div[style*="overflow: auto"], div[style*="overflow-y: auto"], div[style*="overflow: scroll"]');
    if (scrollableEl) {
      const scrollHeight = scrollableEl.scrollHeight - scrollableEl.clientHeight;
      const targetScroll = (targetIndex / 6) * scrollHeight;
      scrollableEl.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-screen h-screen overflow-hidden bg-[#020406] select-none text-zinc-100 font-sans"
    >
      {/* Cinematic Starfield & Ambient Glow Background */}
      <NightFieldBackground />

      {/* Persistent Fixed HUD & Navigation */}
      <HUD
        currentSection={currentSection}
        totalSections={7}
        scrollProgress={scrollProgress}
        onNavigateSection={handleNavigateSection}
      />

      {/* 3D WebGL Canvas Stage */}
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 42
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
        style={{
          position: 'relative',
          zIndex: 10
        }}
      >
        <ScrollControls pages={7} damping={0.2}>
          <CinematicScene onScrollStateChange={handleScrollStateChange} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
