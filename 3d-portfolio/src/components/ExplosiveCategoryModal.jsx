export default function ExplosiveCategoryModal({ category, onClose }) {
  if (!category) return null

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 4, 3, 0.92)',
        backdropFilter: 'blur(20px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5vw',
        boxSizing: 'border-box',
        animation: 'explosiveOpen 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes explosiveOpen {
          0% { opacity: 0; transform: scale(0.85) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(25, 20, 16, 0.95), rgba(10, 8, 7, 0.98))',
          border: '1px solid rgba(217, 119, 6, 0.3)',
          borderRadius: '24px',
          padding: '45px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 30px 100px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '25px',
            right: '25px',
            background: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(217, 119, 6, 0.3)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            color: '#d97706',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          ✕
        </button>

        <span style={{ color: '#d97706', fontFamily: 'monospace', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Expanded Dimension
        </span>
        <h2 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontSize: '2.4rem', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
          {category.name}
        </h2>
        <p style={{ color: '#a89f91', fontFamily: 'monospace', fontSize: '0.95rem', margin: '0 0 35px 0' }}>
          {category.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {category.projects.map((proj, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h3 style={{ color: 'white', fontFamily: '"Helvetica Neue", sans-serif', fontSize: '1.5rem', fontWeight: '800', margin: '0 0 5px 0' }}>
                    {proj.title}
                  </h3>
                  <p style={{ color: '#d97706', fontFamily: 'monospace', fontSize: '0.85rem', margin: 0 }}>
                    {proj.subtitle}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {proj.tech.map((t, tI) => (
                    <span key={tI} style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#d97706', fontFamily: 'monospace', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(217, 119, 6, 0.25)', fontWeight: 'bold' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }} />

              <div>
                <h4 style={{ color: '#f5f5f4', fontFamily: '"Helvetica Neue", sans-serif', fontSize: '1.05rem', margin: '0 0 8px 0' }}>
                  Architecture & Workflow:
                </h4>
                <p style={{ color: '#d6d3d1', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
                  {proj.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}