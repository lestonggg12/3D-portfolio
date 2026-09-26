import { useEffect } from 'react';
import { X, Layers, CheckCircle2, Cpu, ShieldCheck } from 'lucide-react';

export default function ExplosiveCategoryModal({ category, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!category) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-2xl transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-2xl bg-zinc-950/95 border border-sky-400/30 p-6 sm:p-8 md:p-10 shadow-2xl shadow-sky-950/50 text-zinc-100 flex flex-col gap-8"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 80px -15px rgba(56, 189, 248, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-sky-500/20 border border-white/10 hover:border-sky-400/50 text-zinc-400 hover:text-sky-300 flex items-center justify-center transition-all duration-200 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Header Info */}
        <div className="flex flex-col gap-2.5 pr-10 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              SYSTEM DIMENSION // ARCHITECTURE VIEW
            </span>
            {category.stats && (
              <span className="text-zinc-400 font-mono text-xs hidden sm:inline">
                {category.stats}
              </span>
            )}
          </div>

          <h2 id="modal-title" className="text-2xl sm:text-3xl md:text-4xl font-black font-sans tracking-tight text-white mt-1">
            {category.name}
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 font-mono leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Projects List */}
        <div className="flex flex-col gap-8">
          {category.projects.map((proj, idx) => (
            <article
              key={idx}
              className="rounded-xl bg-zinc-900/60 border border-white/10 hover:border-sky-400/30 transition-all p-5 sm:p-7 flex flex-col gap-6"
            >
              {/* Project Title & Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-sky-400 font-semibold">0{idx + 1} //</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-sans text-white">
                      {proj.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-sky-300/80 font-mono mt-1">
                    {proj.subtitle}
                  </p>
                </div>

                {proj.status && (
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {proj.status}
                  </span>
                )}
              </div>

              {/* Project Image Showcase */}
              {proj.image && (
                <div className="relative group overflow-hidden rounded-lg border border-white/10 bg-black/40">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-52 sm:h-72 object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                </div>
              )}

              {/* Summary & Deep Dive */}
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                    Architecture & Implementation
                  </h4>
                  <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                    {proj.details}
                  </p>
                </div>

                {/* Engineering Highlights */}
                {proj.highlights && proj.highlights.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                      Key Capabilities & Deliverables
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {proj.highlights.map((highlight, hIdx) => (
                        <div
                          key={hIdx}
                          className="flex items-start gap-2 text-xs font-mono text-zinc-300 bg-black/30 p-2.5 rounded-md border border-white/5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tech Stack Chips */}
              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500 mr-1">STACK:</span>
                  {proj.tech.map((t, tI) => (
                    <span
                      key={tI}
                      className="px-2.5 py-1 rounded bg-sky-950/60 border border-sky-400/20 text-sky-200 text-xs font-mono font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {proj.metrics && (
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <span className="text-zinc-500">//</span> {proj.metrics}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
