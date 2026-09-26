export default function NightFieldBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: `
          radial-gradient(
            ellipse at 50% 30%,
            rgba(30, 45, 60, 0.35) 0%,
            rgba(10, 16, 22, 0.5) 35%,
            rgba(3, 5, 6, 0.96) 72%,
            #010202 100%
          )
        `,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >

      {/* ================================================== */}
      {/* STARFIELD */}
      {/* ================================================== */}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
          backgroundImage: `
            radial-gradient(1px 1px at 12% 18%, #ffffff, transparent),
            radial-gradient(1px 1px at 28% 42%, #ffffff, transparent),
            radial-gradient(1px 1px at 64% 12%, #ffffff, transparent),
            radial-gradient(1.5px 1.5px at 78% 34%, #ffffff, transparent),
            radial-gradient(1px 1px at 85% 68%, #ffffff, transparent),
            radial-gradient(1px 1px at 40% 74%, #ffffff, transparent),
            radial-gradient(1.5px 1.5px at 6% 60%, #ffffff, transparent),
            radial-gradient(1px 1px at 92% 10%, #ffffff, transparent),
            radial-gradient(1px 1px at 55% 88%, #ffffff, transparent)
          `,
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* ================================================== */}
      {/* LOW HORIZON GLOW — "a fire front creeps" */}
      {/* ================================================== */}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '-10%',
          height: '35%',
          background: 'linear-gradient(0deg, rgba(180, 83, 9, 0.16) 0%, transparent 100%)',
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }}
      />

      {/* ================================================== */}
      {/* VIGNETTE */}
      {/* ================================================== */}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(
              ellipse at center,
              transparent 30%,
              rgba(0, 0, 0, 0.4) 68%,
              rgba(0, 0, 0, 0.88) 100%
            )
          `,
          pointerEvents: 'none'
        }}
      />

      {/* ================================================== */}
      {/* FILM GRAIN */}
      {/* ================================================== */}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.035,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.45%22/%3E%3C/svg%3E")',
          mixBlendMode: 'screen',
          pointerEvents: 'none'
        }}
      />

    </div>
  )
}