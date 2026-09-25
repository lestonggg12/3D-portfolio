export default function ProjectModal({ activeProject, onClose }) {
  if (!activeProject) return null

  return (
    <div 
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4vw', boxSizing: 'border-box' }} 
      onClick={onClose}
    >
      <div 
        className="modal-content" 
        style={{ background: '#121212', border: '1px solid rgba(255,87,34,0.4)', borderRadius: '20px', padding: '35px', maxWidth: '750px', width: '100%', boxShadow: '0 30px 80px rgba(0,0,0,0.9)', position: 'relative' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#FF5722', fontSize: '1.5rem', cursor: 'pointer', fontFamily: 'monospace', transition: 'color 0.2s' }}
        >
          [✕]
        </button>

        <span style={{ color: '#FF5722', fontFamily: 'monospace', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          {activeProject.category}
        </span>
        <h2 style={{ color: 'white', fontFamily: '"Helvetica Neue", sans-serif', fontSize: '2rem', fontWeight: '900', margin: '0 0 15px 0' }}>
          {activeProject.title}
        </h2>

        <img src={activeProject.image} alt={activeProject.title} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', display: 'block' }} />

        <h4 style={{ color: 'white', fontFamily: '"Helvetica Neue", sans-serif', fontSize: '1.1rem', margin: '0 0 8px 0' }}>
          System Architecture & Workflow:
        </h4>
        <p style={{ color: '#e0e0e0', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.7', margin: '0 0 20px 0' }}>
          {activeProject.architectureDetails}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {activeProject.tech.map((t, i) => (
            <span key={i} style={{ background: 'rgba(255,87,34,0.15)', color: '#FF5722', fontFamily: 'monospace', fontSize: '0.75rem', padding: '5px 12px', borderRadius: '6px', border: '1px solid rgba(255,87,34,0.3)', fontWeight: 'bold' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}