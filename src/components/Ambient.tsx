/**
 * Fixed, GPU-friendly aurora canvas behind the whole public site. Pure CSS:
 * slow-drifting radial gradients (no blur filters), a faint grid and film grain.
 * Light sections are transparent so the glass cards frost this background.
 */
export function Ambient() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f4f7fc]">
      <div className="absolute -top-[20vmax] -left-[15vmax] h-[60vmax] w-[60vmax] animate-aurora-a rounded-full bg-[radial-gradient(circle_at_center,rgba(252,199,90,0.5),rgba(252,199,90,0)_62%)] will-change-transform" />
      <div className="absolute top-[10vh] -right-[20vmax] h-[65vmax] w-[65vmax] animate-aurora-b rounded-full bg-[radial-gradient(circle_at_center,rgba(62,224,181,0.42),rgba(62,224,181,0)_62%)] will-change-transform" />
      <div className="absolute -bottom-[30vmax] left-[15vw] h-[70vmax] w-[70vmax] animate-aurora-c rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.32),rgba(59,130,246,0)_62%)] will-change-transform" />
      <div className="absolute top-[45vh] left-[35vw] h-[40vmax] w-[40vmax] animate-aurora-b rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.16),rgba(244,114,182,0)_62%)] will-change-transform" />
      <div className="absolute inset-0 bg-grid-light" />
      <div className="absolute inset-0 bg-noise opacity-[0.035] mix-blend-multiply" />
    </div>
  );
}

/** Dark aurora for navy sections (absolute, sits behind section content). */
export function DarkAurora({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -top-1/3 -left-1/4 h-[55vmax] w-[55vmax] animate-aurora-a rounded-full bg-[radial-gradient(circle_at_center,rgba(252,199,90,0.22),rgba(252,199,90,0)_60%)]" />
      <div className="absolute -right-1/4 -bottom-1/3 h-[60vmax] w-[60vmax] animate-aurora-b rounded-full bg-[radial-gradient(circle_at_center,rgba(62,224,181,0.18),rgba(62,224,181,0)_60%)]" />
      <div className="absolute top-1/4 left-1/3 h-[40vmax] w-[40vmax] animate-aurora-c rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),rgba(59,130,246,0)_60%)]" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
