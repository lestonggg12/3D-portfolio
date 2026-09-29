import { useEffect } from 'react';
import { X } from 'lucide-react';

const CONTACT_EMAIL = 'lesteralcantara1432@gmail.com';

export default function ContactModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const company = formData.get('company') || 'Not provided';
    const inquiry = formData.get('inquiry') || 'Not specified';
    const message = formData.get('message');
    const subject = `Portfolio inquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      `What they need: ${inquiry}`,
      '',
      'Message:',
      message
    ].join('\n');

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="pointer-events-auto fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 sm:p-6 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-sky-400/40 bg-zinc-950/95 p-5 text-zinc-100 shadow-2xl shadow-sky-950/60 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close contact form"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 text-zinc-400 transition-colors hover:border-sky-400/60 hover:bg-sky-500/20 hover:text-sky-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 pr-10">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sky-400">
            TRANSMIT A SIGNAL
          </span>
          <h2 id="contact-modal-title" className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            Start the conversation.
          </h2>
          <p className="mt-2 max-w-xl font-mono text-xs leading-relaxed text-zinc-400">
            Share the context, the opportunity, or the problem you are solving. Your email client will open with everything organized for a quick send.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">Your name *</span>
              <input
                name="name"
                type="text"
                required
                autoFocus
                autoComplete="name"
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-sky-400/60 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">Email *</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="jane@company.com"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-sky-400/60 focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">Company <span className="text-zinc-600">(optional)</span></span>
              <input
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Company or organization"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-sky-400/60 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">What can I help with?</span>
              <input
                name="inquiry"
                type="text"
                placeholder="Role, project, or collaboration"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-sky-400/60 focus:outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">Message *</span>
            <textarea
              name="message"
              required
              rows="6"
              placeholder="Tell me what you are building or how I can help."
              className="max-h-40 w-full resize-y overflow-y-auto rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-sky-400/60 focus:outline-none"
            />
          </label>

          <div className="flex flex-col justify-end gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-white/10 bg-zinc-900/80 px-6 py-3 font-mono text-xs uppercase tracking-widest text-zinc-300 transition-colors hover:bg-zinc-800 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-full bg-sky-500 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-zinc-950 shadow-lg shadow-sky-500/25 transition-colors hover:bg-sky-400 sm:w-auto"
            >
              Open email draft →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
