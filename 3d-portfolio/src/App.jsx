import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import * as THREE from 'three';
import CinematicScene from './components/CinematicScene';
import NightFieldBackground from './components/NightFieldBackground';
import HUD from './components/HUD';

const PortfolioCanvas = memo(function PortfolioCanvas({ onScrollStateChange, onNavigateSection }) {
  return (
    <Canvas
      frameloop="always"
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
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    >
      <ScrollControls pages={7} damping={0.08} infinite style={{ zIndex: 1 }}>
        <CinematicScene
          onScrollStateChange={onScrollStateChange}
          onNavigateSection={onNavigateSection}
        />
      </ScrollControls>
    </Canvas>
  );
});

export default function App() {
  const [currentSection, setCurrentSection] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);

  const getScrollElement = useCallback(() => {
    return [...document.querySelectorAll('div')].find((element) => {
      const style = window.getComputedStyle(element);
      return style.overflowY === 'auto' && element.scrollHeight > element.clientHeight;
    });
  }, []);

  const handleScrollStateChange = useCallback((section, progress) => {
    setCurrentSection((prev) => (prev !== section ? section : prev));
    setScrollProgress((prev) => {
      // Round to ~0.5% steps and bail out if unchanged — calling this
      // every frame with a raw float forced a full React re-render
      // (including the Tailwind-heavy HUD) 60x/second, which can be
      // enough main-thread contention to make scroll input feel dead.
      const rounded = Math.round(progress * 200) / 200;
      return Math.abs(prev - rounded) < 0.0025 ? prev : rounded;
    });
  }, []);

  const handleNavigateSection = useCallback((targetIndex) => {
    const scrollableEl = getScrollElement();
    if (scrollableEl) {
      const scrollHeight = scrollableEl.scrollHeight - scrollableEl.clientHeight;
      const targetScroll = (targetIndex / 6) * scrollHeight;
      scrollableEl.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, [getScrollElement]);

  // Enable keyboard navigation (Arrow Down/Up, Spacebar, Page Down/Up)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.querySelector('[role="dialog"]')) return;

      const scrollableEl = getScrollElement();
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
  }, [getScrollElement]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.target.closest('[role="dialog"]')) return;

      const scrollableEl = getScrollElement();
      if (!scrollableEl || e.deltaY === 0) return;

      e.preventDefault();
      const maxScroll = scrollableEl.scrollHeight - scrollableEl.clientHeight;
      const nextScroll = scrollableEl.scrollTop + e.deltaY;

      if (nextScroll >= maxScroll) {
        scrollableEl.scrollTo({ top: 1, behavior: 'auto' });
      } else if (nextScroll <= 1) {
        scrollableEl.scrollTo({ top: maxScroll - 1, behavior: 'auto' });
      } else {
        scrollableEl.scrollTo({ top: nextScroll, behavior: 'auto' });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [getScrollElement]);

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
      <PortfolioCanvas
        onScrollStateChange={handleScrollStateChange}
        onNavigateSection={handleNavigateSection}
      />
    </div>
  );
}