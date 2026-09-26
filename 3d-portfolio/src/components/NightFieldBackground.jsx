export default function NightFieldBackground() {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      style={{
        background: `
          radial-gradient(
            ellipse at 50% 30%,
            rgba(22, 32, 46, 0.45) 0%,
            rgba(10, 16, 24, 0.75) 45%,
            rgba(4, 6, 9, 0.98) 75%,
            #020406 100%
          )
        `
      }}
    >
      {/* Dynamic Starfield */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 28% 42%, rgba(157,209,255,0.85), transparent),
            radial-gradient(1px 1px at 64% 12%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1.5px 1.5px at 78% 34%, rgba(157,209,255,0.9), transparent),
            radial-gradient(1px 1px at 85% 68%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 40% 74%, rgba(157,209,255,0.8), transparent),
            radial-gradient(1.5px 1.5px at 6% 60%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 92% 10%, rgba(157,209,255,0.75), transparent),
            radial-gradient(1px 1px at 55% 88%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1.2px 1.2px at 22% 82%, rgba(157,209,255,0.85), transparent),
            radial-gradient(1px 1px at 72% 52%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 88% 30%, rgba(157,209,255,0.9), transparent)
          `,
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Subtle Aurora / Horizon Ambient Glow */}
      <div
        className="absolute inset-x-0 bottom-[-5%] h-[40%] pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, rgba(56, 189, 248, 0.08) 0%, rgba(14, 165, 233, 0.03) 50%, transparent 100%)',
          filter: 'blur(40px)'
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 35%,
              rgba(2, 4, 6, 0.45) 70%,
              rgba(1, 2, 4, 0.92) 100%
            )
          `
        }}
      />

      {/* Organic Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.5%22/%3E%3C/svg%3E")'
        }}
      />
    </div>
  );
}
