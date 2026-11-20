import { Children, cloneElement, isValidElement } from "react";

/**
 * Hand-drafted line illustrations in the site's house style: charcoal strokes, gold accents,
 * pale "glass" fills. One per service, process step and key fact.
 * All drawn on a 160 × 120 grid with a shared ground line.
 */
const INK = "var(--color-ink-950)";
const ACCENT = "var(--color-accent-500)";
const PANE = "var(--color-lake)";
const PAPER = "var(--color-paper-50)";

function house({ x, y, w = 40, h = 32, fill = PAPER, door = true }: { x: number; y: number; w?: number; h?: number; fill?: string; door?: boolean }) {
  // x,y = bottom-left corner on the ground
  const roof = w * 0.55;
  return (
    <g>
      <path d={`M${x} ${y}V${y - h}L${x + w / 2} ${y - h - roof}L${x + w} ${y - h}V${y}`} fill={fill} />
      <path d={`M${x - 4} ${y - h + 3}L${x + w / 2} ${y - h - roof - 2}L${x + w + 4} ${y - h + 3}`} />
      {door && <rect x={x + w / 2 - 5} y={y - 15} width="10" height="15" fill={PAPER} />}
      <rect x={x + 5} y={y - h + 8} width="9" height="9" fill={PANE} />
      <rect x={x + w - 14} y={y - h + 8} width="9" height="9" fill={PANE} />
    </g>
  );
}

const ground = <path d="M14 104h132" strokeWidth="1.6" />;

const drawings: Record<string, React.ReactNode> = {
  /* ---------------- services ---------------- */
  bank: (
    <>
      {ground}
      <path d="M36 42 80 20l44 22z" fill={PAPER} />
      <circle cx="80" cy="33" r="4" stroke={ACCENT} />
      <rect x="34" y="42" width="92" height="8" fill={PAPER} />
      {[44, 62, 90, 108].map((x) => <rect key={x} x={x} y="50" width="8" height="42" fill={PAPER} />)}
      <path d="M30 92h100v6H30zM26 98h108v6H26z" fill={PAPER} />
    </>
  ),
  scroll: (
    <>
      {ground}
      <path d="M48 16h46l14 14v72H48z" fill={PAPER} />
      <path d="M94 16v14h14" />
      <path d="M62 50V38l9-8 9 8v12" />
      <path d="M58 62h36M58 70h36M58 78h24" opacity="0.6" />
      <path d="M92 96l-5 12M100 96l5 12" stroke={ACCENT} />
      <circle cx="96" cy="90" r="9" fill={ACCENT} stroke={ACCENT} />
      <circle cx="96" cy="90" r="4.5" stroke={PAPER} />
    </>
  ),
  scale: (
    <>
      {ground}
      <path d="M28 104V62l26-22v64z" fill={PAPER} />
      <path d="M24 66 54 40" />
      <rect x="34" y="70" width="10" height="10" fill={PANE} />
      <path d="M106 104V40l26 22v42z" fill={PAPER} />
      <path d="M106 40l30 26" />
      <rect x="116" y="70" width="10" height="10" fill={PANE} />
      <path d="M80 30v74" stroke={ACCENT} strokeDasharray="3 4" />
      <path d="M66 70h-8M58 70l4-4M58 70l4 4M94 70h8M102 70l-4-4M102 70l-4 4" stroke={ACCENT} />
    </>
  ),
  receipt: (
    <>
      {ground}
      <path d="M22 92 52 74l22 8 26-26 22 6 18-26" stroke={ACCENT} strokeWidth="1.8" />
      <path d="M134 30l6 4-1 7" stroke={ACCENT} strokeWidth="1.8" />
      {house({ x: 34, y: 104, w: 44, h: 30 })}
      <path d="M100 104V84h18v20" fill={PAPER} />
      <path d="M96 86 109 74l13 12" />
    </>
  ),
  gavel: (
    <>
      {ground}
      <g transform="rotate(-32 76 50)">
        <rect x="56" y="34" width="40" height="18" rx="2" fill={PAPER} />
        <path d="M60 34v18M92 34v18" />
        <path d="M76 52v40" strokeWidth="3" />
      </g>
      <rect x="86" y="94" width="44" height="10" fill={PAPER} />
      <path d="M92 94v-4h32v4" />
      <path d="M24 104V76h26v28" fill={PAPER} />
      <path d="M29 84h16M29 90h16M29 96h10" stroke={ACCENT} />
    </>
  ),
  tag: (
    <>
      {ground}
      <path d="M38 104V24" strokeWidth="2.2" />
      <path d="M38 34h70" strokeWidth="2.2" />
      <path d="M62 34v8M100 34v8" />
      <rect x="54" y="42" width="56" height="28" fill={PAPER} />
      <text x="82" y="60" textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="1" fill={ACCENT} stroke="none" fontFamily="var(--font-sans)">FOR SALE</text>
      {house({ x: 104, y: 104, w: 30, h: 22, door: false })}
    </>
  ),
  key: (
    <>
      <path d="M30 72V48l22-18 22 18v24z" fill={PAPER} />
      <rect x="45" y="56" width="14" height="16" fill={PANE} />
      <path d="M74 60h64" strokeWidth="3" />
      <path d="M124 60v12M134 60v9" strokeWidth="3" />
      <circle cx="52" cy="44" r="3" stroke={ACCENT} />
      <path d="M14 104h132" strokeWidth="1.6" opacity="0" />
    </>
  ),
  building: (
    <>
      {ground}
      <rect x="56" y="14" width="48" height="90" fill={PAPER} />
      {[24, 38, 52, 66, 80].map((y) =>
        [62, 76, 90].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill={x === 76 && y === 38 ? ACCENT : PANE} stroke={x === 76 && y === 38 ? ACCENT : INK} />),
      )}
      <rect x="74" y="92" width="12" height="12" fill={PAPER} />
      <path d="M26 104V70h22v34M112 104V58h24v46" opacity="0.5" />
    </>
  ),
  coins: (
    <>
      {ground}
      {[96, 88, 80, 72].map((y) => (
        <g key={y}>
          <path d={`M30 ${y}v6c0 3 9 5 20 5s20-2 20-5v-6`} fill={PAPER} />
          <ellipse cx="50" cy={y} rx="20" ry="5" fill={y === 72 ? ACCENT : PAPER} stroke={y === 72 ? ACCENT : INK} />
        </g>
      ))}
      {house({ x: 88, y: 104, w: 44, h: 30 })}
    </>
  ),
  briefcase: (
    <>
      {ground}
      {house({ x: 26, y: 104, w: 52, h: 38 })}
      <circle cx="104" cy="54" r="20" fill={PANE} stroke={ACCENT} strokeWidth="2" />
      <path d="M118 68l18 18" stroke={ACCENT} strokeWidth="4" />
      <path d="M96 54h16M104 46v16" stroke={ACCENT} opacity="0.7" />
    </>
  ),

  /* ---------------- property types ---------------- */
  home: (
    <>
      {ground}
      <path d="M118 104V64" opacity="0.5" />
      <circle cx="118" cy="56" r="13" fill={PANE} opacity="0.9" />
      {house({ x: 38, y: 104, w: 62, h: 40 })}
      <path d="M50 44V30h9v8" fill={PAPER} />
      <circle cx="69" cy="14" r="7" fill={ACCENT} stroke={ACCENT} />
    </>
  ),
  shop: (
    <>
      {ground}
      <rect x="30" y="34" width="100" height="70" fill={PAPER} />
      <path d="M26 34h108" strokeWidth="2.2" />
      <path d="M30 46h100l-6 12H36z" fill={ACCENT} stroke={ACCENT} />
      {[46, 62, 78, 94, 110].map((x) => <path key={x} d={`M${x} 46l-3 12`} stroke={PAPER} />)}
      <rect x="38" y="66" width="38" height="28" fill={PANE} />
      <rect x="88" y="66" width="20" height="38" fill={PAPER} />
      <rect x="114" y="66" width="10" height="20" fill={PANE} />
      <path d="M40 24h80v10H40z" fill={PAPER} />
    </>
  ),
  factory: (
    <>
      {ground}
      <path d="M22 104V58l24 14V58l24 14V58l24 14V40h40v64z" fill={PAPER} />
      <rect x="104" y="18" width="10" height="22" fill={PAPER} />
      <g className="hv-bob"><circle cx="112" cy="10" r="4" stroke={ACCENT} /><circle cx="122" cy="6" r="3" stroke={ACCENT} opacity="0.6" /></g>
      {[30, 54, 78].map((x) => <rect key={x} x={x} y="80" width="12" height="10" fill={PANE} />)}
      <rect x="104" y="72" width="22" height="32" fill={ACCENT} stroke={ACCENT} />
      <path d="M104 80h22M104 88h22M104 96h22" stroke={PAPER} />
    </>
  ),
  barn: (
    <>
      {ground}
      <path d="M34 104V58l16-18h40l16 18v46z" fill={PAPER} />
      <path d="M30 60 50 36h40l20 24" />
      <rect x="56" y="72" width="28" height="32" fill={PAPER} />
      <path d="M56 72l28 32M84 72l-28 32" stroke={ACCENT} />
      <rect x="64" y="48" width="12" height="12" fill={PANE} />
      <path d="M116 104V42a10 10 0 0 1 20 0v62" fill={PAPER} />
      <path d="M116 56h20M116 72h20M116 88h20" opacity="0.5" />
      <path d="M14 112c20-4 40-4 60 0" stroke={ACCENT} opacity="0.5" />
    </>
  ),
  school: (
    <>
      {ground}
      <rect x="24" y="58" width="112" height="46" fill={PAPER} />
      <path d="M58 58V38l22-16 22 16v20" fill={PAPER} />
      <circle cx="80" cy="42" r="7" fill={PANE} />
      <path d="M80 42v-4M80 42h3" />
      <path d="M80 22V8" />
      <path d="M80 8h14l-3 4 3 4H80" fill={ACCENT} stroke={ACCENT} />
      {[32, 46, 104, 118].map((x) => <rect key={x} x={x} y="68" width="9" height="12" fill={PANE} />)}
      <path d="M70 104V80a10 10 0 0 1 20 0v24" fill={PAPER} />
      <path d="M20 58h120" strokeWidth="2" />
    </>
  ),
  road: (
    <>
      {ground}
      {house({ x: 24, y: 104, w: 40, h: 28 })}
      <path d="M86 104 104 20M150 104 122 20" />
      <path d="M118 96l-2-10M115 76l-2-10M112 56l-1-8M110 40l-1-7" stroke={ACCENT} strokeWidth="2" />
      <path d="M74 24v80" stroke={ACCENT} strokeDasharray="3 4" />
      <path d="M70 24h8M70 104h8" stroke={ACCENT} />
    </>
  ),

  /* ---------------- process ---------------- */
  phone: (
    <>
      {ground}
      <rect x="54" y="16" width="38" height="78" rx="5" fill={PAPER} />
      <path d="M54 28h38M54 82h38" />
      <circle cx="73" cy="88" r="2" fill={INK} />
      <path d="M96 30h42v24h-26l-8 8v-8h-8z" fill={PAPER} stroke={ACCENT} />
      {[110, 117, 124].map((x, i) => <g key={x} className="hv-blink" style={{ animationDelay: `${i * 0.25}s` }}><circle cx={x} cy="42" r="2" fill={ACCENT} stroke="none" /></g>)}
    </>
  ),
  calendar: (
    <>
      {ground}
      <rect x="40" y="22" width="80" height="72" fill={PAPER} />
      <path d="M40 38h80" />
      <path d="M58 16v12M102 16v12" strokeWidth="2.4" />
      {[48, 60, 72].map((y) => [50, 64, 78, 92, 106].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" fill={PANE} stroke="none" />))}
      <circle cx="81" cy="63" r="9" stroke={ACCENT} strokeWidth="2" />
    </>
  ),
  measure: (
    <>
      {ground}
      {house({ x: 40, y: 96, w: 60, h: 40 })}
      <path d="M40 112h60M40 108v8M100 108v8" stroke={ACCENT} />
      <path d="M116 56v40M112 56h8M112 96h8" stroke={ACCENT} />
      <path d="M14 96h132" strokeWidth="1.6" />
    </>
  ),
  report: (
    <>
      {ground}
      <path d="M46 12h52l16 16v76H46z" fill={PAPER} />
      <path d="M98 12v16h16" />
      <rect x="56" y="26" width="28" height="18" fill={PANE} />
      <path d="M56 54h48M56 62h48M56 70h34" opacity="0.6" />
      <path d="M56 84h48" stroke={ACCENT} strokeWidth="3" />
      <circle cx="104" cy="96" r="8" fill={ACCENT} stroke={ACCENT} />
      <path d="M100 96l3 3 5-6" stroke={PAPER} strokeWidth="1.8" />
    </>
  ),

  /* ---------------- facts ---------------- */
  seal: (
    <>
      <path d="M68 76 60 104l12-6 8 10 4-30M92 76l8 28-12-6-8 10" stroke={ACCENT} fill={PAPER} />
      <circle cx="80" cy="54" r="30" fill={PAPER} />
      <circle cx="80" cy="54" r="23" stroke={ACCENT} strokeDasharray="2 3" />
      <path d="M68 56 80 46l12 10M71 54v12h18V54" />
    </>
  ),
  clock: (
    <>
      <circle cx="80" cy="58" r="40" fill={PAPER} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <path key={i} d={`M${80 + Math.sin(a) * 34} ${58 - Math.cos(a) * 34}L${80 + Math.sin(a) * 38} ${58 - Math.cos(a) * 38}`} />;
      })}
      <g className="hv-spin-slow"><path d="M80 58V32" strokeWidth="2.2" /></g>
      <g className="hv-spin-slower"><path d="M80 58l18 10" strokeWidth="2.2" stroke={ACCENT} /></g>
      <circle cx="80" cy="58" r="2.5" fill={INK} />
    </>
  ),
  past: (
    <>
      <rect x="44" y="26" width="72" height="66" fill={PAPER} />
      <path d="M44 42h72M60 20v12M100 20v12" />
      <path d="M100 68a20 20 0 1 1-6-14" stroke={ACCENT} strokeWidth="2" />
      <path d="M96 46l-2 8 8 1" stroke={ACCENT} strokeWidth="2" />
      <text x="80" y="74" textAnchor="middle" fontSize="16" fill={INK} stroke="none" fontFamily="var(--font-display)">16</text>
    </>
  ),
  pin: (
    <>
      <path d="M16 78c20-6 30 10 48 0s34-18 50-10 22 4 30-2" opacity="0.45" />
      <path d="M16 96c24-8 40 6 60-2s40-12 70-6" opacity="0.45" />
      <g className="hv-bob">
        <path d="M80 86s-22-20-22-38a22 22 0 0 1 44 0c0 18-22 38-22 38z" fill={PAPER} stroke={ACCENT} strokeWidth="1.8" />
        <path d="M72 52 80 45l8 7v8H72z" />
      </g>
    </>
  ),
};

/** Map tags/categories to a drawing (used for blog cards). */
export function vignetteForTags(tags: string[]) {
  const t = tags.join(" ").toLowerCase();
  if (/estate|probate/.test(t)) return "key";
  if (/divorce|separation/.test(t)) return "scale";
  if (/cra|tax/.test(t)) return "receipt";
  if (/mpac|assessment/.test(t)) return "coins";
  if (/litigation/.test(t)) return "gavel";
  if (/expropriation/.test(t)) return "road";
  if (/commercial|retail|office/.test(t)) return "shop";
  if (/industrial/.test(t)) return "factory";
  if (/farm|agricultur|rural/.test(t)) return "barn";
  if (/condo|multi|investor/.test(t)) return "building";
  if (/mortgage|refinanc/.test(t)) return "bank";
  if (/selling|pricing/.test(t)) return "tag";
  if (/buying/.test(t)) return "briefcase";
  if (/older|renovation|energy|stigma|insurance|land|secondary/.test(t)) return "measure";
  return "report";
}

const SHAPES = new Set(["path", "rect", "circle", "ellipse", "line", "polyline", "polygon"]);

/**
 * Prepares a drawing for the "sketch-on" reveal: every solid-stroked shape gets pathLength=1
 * (so CSS can animate stroke-dashoffset from 1 to 0) and a small staggered delay.
 * Dashed shapes and text simply fade in. Has no visual effect until the CSS runs.
 */
export function drawable(node: React.ReactNode, step = 0.045, max = 1.1): React.ReactNode {
  let i = 0;
  const walk = (n: React.ReactNode): React.ReactNode =>
    Children.map(n, (child) => {
      if (!isValidElement(child)) return child;
      const props = child.props as { children?: React.ReactNode; strokeDasharray?: unknown; stroke?: unknown; className?: string; style?: React.CSSProperties };
      const kids = props.children !== undefined ? walk(props.children) : undefined;
      if (typeof child.type === "string" && SHAPES.has(child.type) && !props.strokeDasharray && props.stroke !== "none") {
        const dd = Math.min(i++ * step, max);
        return cloneElement(child as React.ReactElement<Record<string, unknown>>, { pathLength: 1, className: `${props.className ?? ""} dw`.trim(), style: { ...props.style, "--dd": `${dd}s` } as React.CSSProperties }, kids);
      }
      return kids !== undefined ? cloneElement(child as React.ReactElement<Record<string, unknown>>, {}, kids) : child;
    });
  return walk(node);
}

/**
 * "Build" mode: each top-level piece of a drawing (ground, walls, sign, coins...) rises into
 * place in sequence. Pieces get class "pc" and a staggered --dd delay.
 */
function pieces(node: React.ReactNode, step = 0.09): React.ReactNode {
  if (!isValidElement(node)) return node;
  const kids = (node.props as { children?: React.ReactNode }).children;
  let i = 0;
  return Children.map(kids, (child) => {
    if (!isValidElement(child)) return child;
    const props = child.props as { className?: string; style?: React.CSSProperties };
    return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      className: `${props.className ?? ""} pc`.trim(),
      style: { ...props.style, "--dd": `${i++ * step}s` } as React.CSSProperties,
    });
  });
}

/** How a drawing enters: built piece by piece, popped, stamped, dropped, flipped, wiped or sketched. */
export type VignetteMode = "build" | "pop" | "stamp" | "drop" | "flip" | "wipe" | "sketch";

export function Vignette({ name, className = "", title, delay = 0, mode = "build" }: { name: string; className?: string; title?: string; delay?: number; mode?: VignetteMode }) {
  const art = drawings[name] ?? drawings.report;
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
      stroke={INK}
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      data-draw-svg
      data-anim={mode}
      style={{ "--base": `${delay}s` } as React.CSSProperties}
    >
      {mode === "sketch" ? drawable(art) : mode === "build" ? pieces(art) : art}
    </svg>
  );
}
