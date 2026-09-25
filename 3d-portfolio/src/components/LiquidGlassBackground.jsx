export default function LiquidGlassBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,

        width: '100vw',
        height: '100vh',

        background: `
          radial-gradient(
            ellipse at 50% 42%,
            rgba(75, 32, 10, 0.18) 0%,
            rgba(25, 12, 5, 0.10) 28%,
            rgba(5, 4, 3, 0.94) 72%,
            #020202 100%
          )
        `,

        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >

      {/* ================================================== */}
      {/* SUBTLE AMBER GLOW */}
      {/* ================================================== */}

      <div
        style={{
          position: 'absolute',
          width: '55vw',
          height: '55vw',

          left: '50%',
          top: '42%',

          transform: 'translate(-50%, -50%)',

          background:
            'radial-gradient(circle, rgba(180, 83, 9, 0.07) 0%, transparent 68%)',

          filter: 'blur(30px)',

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
              transparent 35%,
              rgba(0, 0, 0, 0.35) 65%,
              rgba(0, 0, 0, 0.85) 100%
            )
          `,

          pointerEvents: 'none'
        }}
      />

      {/* ================================================== */}
      {/* VERY SUBTLE FILM GRAIN */}
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