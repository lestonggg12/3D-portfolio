import { ArrowUpRight, Compass, Sparkles } from 'lucide-react';

const SECTION_NAMES = [
  'ORIGIN SEED',
  'DOCTRINE',
  'ABOUT ME',
  'SYSTEM ROOTS',
  'FEATURED SYSTEMS',
  'READINGS',
  'TRANSMIT SIGNAL'
];

export default function HUD({
  currentSection,
  totalSections = 7,
  scrollProgress = 0,
  onNavigateSection
}) {
  const currentSectionName = SECTION_NAMES[Math.min(currentSection - 1, SECTION_NAMES.length - 1)] || 'ORIGIN SEED';
  const progressPercent = Math.max(0, Math.min(100, scrollProgress * 100));
  const isAtBottom = scrollProgress >= 0.995;

  return (
    <header className="fixed inset-0 pointer-events-none z-50 select-none">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 px-4 sm:px-8 md:px-12 pt-4 sm:pt-6 pb-4 flex items-center justify-between">
        {/* Left Monogram & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-950/50 border border-sky-400/30 flex items-center justify-center backdrop-blur-md shadow-lg shadow-sky-950/50">
            <span className="font-sans font-bold text-sky-200 text-sm tracking-wider">LA</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-zinc-100 font-semibold text-xs sm:text-sm tracking-wide font-sans">
                LESTER ALCANTARA
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Available for engineering opportunities" />
            </div>
            <span className="text-[10px] text-sky-400/90 font-mono tracking-widest uppercase">
              Software Engineer · Comp Eng '28
            </span>
          </div>
        </div>

        {/* Center / Section Status Indicator */}
        <div className="hidden md:flex items-center gap-2.5 bg-zinc-900/70 border border-sky-400/20 px-4 py-1.5 rounded-full backdrop-blur-md shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
          <span className="text-[11px] font-mono text-zinc-200 tracking-wider">
            {currentSectionName}
          </span>
        </div>

        {/* Right Section Index Counter & Jump Controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2 bg-zinc-950/70 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider">INDEX</span>
            <span className="text-xs font-mono font-semibold text-sky-300 tracking-widest">
              0{currentSection} / 0{totalSections}
            </span>
          </div>

          <a
            href="mailto:lesteralcantara1432@gmail.com"
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 border border-sky-400/30 hover:border-sky-400/60 text-sky-200 text-xs font-mono transition-all duration-200"
          >
            <span>CONNECT</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Top Hairline Progress Bar (Interactive scrubber) */}
      <div
        onClick={(e) => {
          if (!onNavigateSection) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const fraction = Math.max(0, Math.min(1, clickX / rect.width));
          const targetIdx = Math.round(fraction * (totalSections - 1));
          onNavigateSection(targetIdx);
        }}
        className={`pointer-events-auto cursor-pointer absolute top-[62px] sm:top-[74px] left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 h-[3px] bg-white/10 hover:bg-white/20 rounded-full overflow-hidden transition-all duration-500 group ${
          isAtBottom ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        title="Click progress bar to jump to section"
      >
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-300 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(56,189,248,0.7)] group-hover:brightness-125"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Interactive Navigation Dots on Right Flank */}
      <nav aria-label="Section navigation" className="pointer-events-auto hidden lg:flex flex-col gap-2.5 absolute right-8 top-1/2 -translate-y-1/2">
        {SECTION_NAMES.map((name, idx) => {
          const isActive = currentSection === idx + 1;
          return (
            <button
              key={name}
              onClick={() => onNavigateSection && onNavigateSection(idx)}
              className="group flex items-center justify-end gap-3 cursor-pointer py-1"
              title={`Jump to ${name}`}
            >
              <span
                className={`text-[9px] font-mono tracking-widest uppercase transition-all duration-200 ${
                  isActive
                    ? 'text-sky-300 opacity-100 translate-x-0 font-semibold'
                    : 'text-zinc-500 opacity-0 group-hover:opacity-100 group-hover:text-zinc-300 translate-x-2 group-hover:translate-x-0'
                }`}
              >
                {name}
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-sky-400 scale-125 shadow-[0_0_10px_rgba(56,189,248,0.9)]'
                    : 'bg-zinc-700 hover:bg-zinc-500 group-hover:scale-110'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer HUD Bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 md:px-12 pb-4 sm:pb-5 pt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-[1px] bg-sky-400/50" />
          <span className="tracking-widest uppercase text-sky-400/90 text-[10px]">
            ALCANTARA 3D ARCHITECTURE
          </span>
          <span className="hidden sm:inline text-zinc-600">·</span>
          <span className="hidden sm:inline text-zinc-400 text-[10px]">
            CAGAYAN DE ORO, PH
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 text-[10px]">
            <Compass className="w-3 h-3 text-sky-400/70" />
            <span>INTERACTIVE SPATIAL VOYAGE</span>
          </div>
          <button
            onClick={() => onNavigateSection && onNavigateSection(Math.min(currentSection, totalSections - 1))}
            className="pointer-events-auto text-[10px] text-zinc-400 hover:text-sky-300 tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>SCROLL TO DISPERSE</span>
            <span className="animate-bounce">↓</span>
          </button>
        </div>
      </div>
    </header>
  );
}
