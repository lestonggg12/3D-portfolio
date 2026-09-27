import { useState, useCallback, useRef, useEffect } from 'react';
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
    const scrollableEl = document.querySelector(
      'div[style*="overflow: auto"], div[style*="overflow-y: auto"], div[style*="overflow: scroll"]'
    );
    if (scrollableEl) {
      const scrollHeight = scrollableEl.scrollHeight - scrollableEl.clientHeight;
      const targetScroll = (targetIndex / 6) * scrollHeight;
      scrollableEl.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, []);

  // Enable keyboard navigation (Arrow Down/Up, Spacebar, Page Down/Up)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.querySelector('[role="dialog"]')) return;

      const scrollableEl = document.querySelector(
        'div[style*="overflow: auto"], div[style*="overflow-y: auto"], div[style*="overflow: scroll"]'
      );
      if (!scrollableEl) return;

      const step = window.innerHeight * 0.85;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        scrollableEl.scrollBy({ top: step, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollableEl.scrollBy({ top: -step, behavior: 'smooth' });
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollableEl.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollableEl.scrollTo({ top: scrollableEl.scrollHeight, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

      {/* 3D WebGL Canvas Stage with Responsive ScrollControls */}
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
        {/* damping={4} provides immediate, fluid scroll response */}
        <ScrollControls pages={7} damping={0.2}>
          <CinematicScene
            onScrollStateChange={handleScrollStateChange}
            onNavigateSection={handleNavigateSection}
          />
        </ScrollControls>
      </Canvas>
    </div>
  );
}