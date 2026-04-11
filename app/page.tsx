"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef, useEffect } from "react";
import createGlobe from "cobe";
import {
  ArrowRight, FileText, Network, BarChart3,
  CheckCircle, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Design tokens
   ───────────────────────────────────────────────────────────────────────────── */
const C = {
  bg:      "#070B14",
  s1:      "#0C1424",
  s2:      "#111E35",
  border:  "rgba(255,255,255,0.06)",
  borderHi:"rgba(255,255,255,0.10)",
  amber:   "#F59E0B",
  amberXs: "rgba(245,158,11,0.06)",
  amberSm: "rgba(245,158,11,0.12)",
  amberMd: "rgba(245,158,11,0.22)",
  green:   "#10B981",
  red:     "#EF4444",
  cyan:    "#06B6D4",
  text:    "#F8FAFC",
  sub:     "#94A3B8",
  muted:   "#4B5563",
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.65, delay, ease: EASE },
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Animated word-by-word headline
   ───────────────────────────────────────────────────────────────────────────── */
function AnimatedHeadline({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <h1 ref={ref} className={cn("flex flex-wrap", className)}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)", y: 18 }}
          animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          transition={{ duration: 0.55, delay: i * 0.055, ease: EASE }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Cobe WebGL Globe
   ───────────────────────────────────────────────────────────────────────────── */
function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0.9;   // initial rotation (Atlantic-facing)
    let width = 0;
    const onResize = () => { if (canvasRef.current) width = canvasRef.current.offsetWidth; };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width:  width * 2,
      height: width * 2,
      phi,
      theta:  0.12,
      dark:   1,
      diffuse: 2.2,
      mapSamples:   22000,
      mapBrightness: 5,
      baseColor:   [0.04, 0.07, 0.14],
      markerColor: [0.97, 0.63, 0.04],
      glowColor:   [0.97, 0.63, 0.04],
      opacity: 0.95,
      markers: [
        { location: [51.9,   4.5],   size: 0.055 }, // Rotterdam
        { location: [1.3,  103.8],   size: 0.05  }, // Singapore
        { location: [29.7,  -95.4],  size: 0.045 }, // Houston
        { location: [-23.9, -46.3],  size: 0.04  }, // Santos, Brazil
        { location: [25.2,   55.3],  size: 0.04  }, // Dubai
        { location: [31.2,  121.5],  size: 0.04  }, // Shanghai
        { location: [46.5,   30.7],  size: 0.03  }, // Odessa
        { location: [-33.9,  18.4],  size: 0.03  }, // Cape Town
        { location: [22.3,  114.2],  size: 0.03  }, // Hong Kong
        { location: [35.7,  139.7],  size: 0.03  }, // Tokyo
      ],
      onRender: (state) => {
        phi += 0.0025;
        state.phi    = phi;
        state.width  = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width:  "100%",
        height: "100%",
        contain:   "layout paint size",
        opacity:   0.95,
      }}
    />
  );
}

function GlobeVisual() {
  return (
    <div className="relative w-[500px] h-[500px] flex-shrink-0 select-none">
      {/* Deep amber atmospheric glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(245,158,11,0.13) 0%, transparent 70%)",
          filter: "blur(55px)",
        }}
      />

      {/* Canvas */}
      <GlobeCanvas />

      {/* Floating card — Live Cargo */}
      <div
        className="absolute top-[9%] right-[-8%] z-10 min-w-[196px] pointer-events-none"
        style={{ animation: "cv-float 5s ease-in-out infinite" }}
      >
        <div style={{
          background: "rgba(7,11,20,0.88)",
          border: "1px solid rgba(245,158,11,0.28)",
          backdropFilter: "blur(16px)",
          padding: "14px 16px",
        }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span style={{
              height: "6px", width: "6px", borderRadius: "50%",
              background: C.amber, flexShrink: 0,
              animation: "cv-pulse 2s ease-in-out infinite",
              display: "inline-block",
            }} />
            <span style={{ color: C.amber, fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Live Cargo Tracking
            </span>
          </div>
          <p style={{ color: C.text, fontSize: "13px", fontWeight: 600 }}>MV Oceanic Trader</p>
          <p style={{ color: C.muted, fontSize: "10px", fontFamily: "monospace", marginTop: "3px" }}>
            ETA Rotterdam: Jan 24
          </p>
        </div>
      </div>

      {/* Floating card — Compliance */}
      <div
        className="absolute bottom-[18%] left-[-12%] z-10 min-w-[184px] pointer-events-none"
        style={{ animation: "cv-float 5s ease-in-out infinite 1.6s" }}
      >
        <div style={{
          background: "rgba(7,11,20,0.88)",
          border: "1px solid rgba(16,185,129,0.28)",
          backdropFilter: "blur(16px)",
          padding: "14px 16px",
        }}>
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle size={9} style={{ color: C.green, flexShrink: 0 }} />
            <span style={{ color: C.green, fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Compliance Verified
            </span>
          </div>
          <p style={{ color: C.text, fontSize: "13px", fontWeight: 600 }}>FOSFA 54 / Wheat SRW</p>
          <p style={{ color: C.muted, fontSize: "10px", fontFamily: "monospace", marginTop: "3px" }}>
            COA vs Contract Passed
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Ticker
   ───────────────────────────────────────────────────────────────────────────── */
const TICKERS = [
  { name: "WHEAT",       price: "584.25",   change: "+1.24%",  up: true  },
  { name: "CORN",        price: "445.50",   change: "-0.12%",  up: false },
  { name: "SOYBEANS",    price: "1,212.75", change: "+0.45%",  up: true  },
  { name: "BRENT CRUDE", price: "78.42",    change: "+1.15%",  up: true  },
  { name: "C-PANAMAX",   price: "12,450",   change: "-2.40%",  up: false },
  { name: "LME COPPER",  price: "8,345.00", change: "+0.82%",  up: true  },
  { name: "GASOIL",      price: "692.50",   change: "+0.65%",  up: true  },
  { name: "SUGAR #11",   price: "24.15",    change: "-0.31%",  up: false },
];

function TickerStrip() {
  const doubled = [...TICKERS, ...TICKERS];
  return (
    <div
      className="relative w-full overflow-hidden py-2.5 group"
      style={{ background: C.s1, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 z-10"
        style={{ background: `linear-gradient(to right, ${C.s1}, transparent)` }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 z-10"
        style={{ background: `linear-gradient(to left, ${C.s1}, transparent)` }} />
      <div
        className="flex items-center w-max gap-10 group-hover:[animation-play-state:paused]"
        style={{ animation: "cv-ticker 42s linear infinite" }}
      >
        {doubled.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-2">
            <span style={{ color: C.muted, fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{t.name}</span>
            <span style={{ color: C.text, fontSize: "12px", fontFamily: "monospace", fontWeight: 600 }}>{t.price}</span>
            <span style={{ color: t.up ? C.green : C.red, fontSize: "9px", fontFamily: "monospace", fontWeight: 700 }}>{t.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Feature card visuals — clean SVG, no fake data
   ───────────────────────────────────────────────────────────────────────────── */
function DocIntelVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="doc1g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111E35" />
          <stop offset="100%" stopColor="#0C1424" />
        </linearGradient>
        <linearGradient id="doc2g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151F32" />
          <stop offset="100%" stopColor="#0E1828" />
        </linearGradient>
      </defs>
      {/* Doc A */}
      <g transform="rotate(-4,88,80)">
        <rect x="24" y="18" width="88" height="116" rx="2" fill="url(#doc1g)" stroke="rgba(148,163,184,0.12)" strokeWidth="0.8"/>
        <rect x="24" y="18" width="88" height="18" rx="2" fill="rgba(100,116,139,0.12)"/>
        <text x="34" y="30" fill="#4B5563" fontSize="6" fontFamily="monospace" fontWeight="600">BILL OF LADING</text>
        {[46,58,70,82,94,108].map((y,i) => (
          <rect key={i} x="32" y={y} width={[60,42,54,32,58,48][i]} height="2" rx="1" fill="rgba(148,163,184,0.12)"/>
        ))}
      </g>
      {/* Doc B — amber highlighted */}
      <g transform="rotate(3,228,80)">
        <rect x="192" y="14" width="88" height="116" rx="2" fill="url(#doc2g)" stroke="rgba(245,158,11,0.20)" strokeWidth="1"/>
        <rect x="192" y="14" width="88" height="18" rx="2" fill="rgba(245,158,11,0.08)"/>
        <text x="200" y="26" fill="#F59E0B" fontSize="6" fontFamily="monospace" fontWeight="600">LETTER OF CREDIT</text>
        {[42,54,66,78,90,104].map((y,i) => (
          <rect key={i} x="200" y={y} width={[58,40,52,35,55,44][i]} height="2" rx="1" fill="rgba(245,158,11,0.10)"/>
        ))}
      </g>
      {/* Connector + verdict */}
      <line x1="128" y1="76" x2="186" y2="76" stroke={C.amber} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.5"/>
      <g transform="translate(157,76)">
        <circle r="16" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.30)" strokeWidth="1"/>
        <path d="M-5 0 L-1 5 L7 -4" stroke={C.green} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      {/* AI scan beam */}
      <rect x="24" y="0" width="280" height="1.5" fill={C.amber} opacity="0.15"
        style={{ animation: "cv-scan 5s ease-in-out infinite" }}/>
    </svg>
  );
}

function OpsHubVisual() {
  return (
    <svg viewBox="0 0 320 160" className="w-full h-full" aria-hidden>
      {/* Central node */}
      <circle cx="160" cy="80" r="18" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.30)" strokeWidth="1"/>
      <circle cx="160" cy="80" r="6" fill={C.cyan}/>
      {/* Orbiting rings */}
      <circle cx="160" cy="80" r="36" fill="none" stroke="rgba(6,182,212,0.12)" strokeWidth="0.8"
        strokeDasharray="6 10" style={{animation:"cv-globe-rotate 18s linear infinite", transformOrigin:"160px 80px"}}/>
      <circle cx="160" cy="80" r="55" fill="none" stroke="rgba(245,158,11,0.08)" strokeWidth="0.8"
        strokeDasharray="4 12" style={{animation:"cv-globe-rotate 30s linear infinite reverse", transformOrigin:"160px 80px"}}/>
      {/* Satellite nodes */}
      {[
        { cx: 68,  cy: 48,  c: C.amber, label: "DEALS"    },
        { cx: 260, cy: 52,  c: C.green, label: "DOCS"     },
        { cx: 72,  cy: 116, c: C.cyan,  label: "AUDIT"    },
        { cx: 255, cy: 115, c: C.amber, label: "TEAM"     },
      ].map((n, i) => (
        <g key={i}>
          <line x1={n.cx} y1={n.cy} x2="160" y2="80" stroke={n.c} strokeWidth="0.6" strokeOpacity="0.25" strokeDasharray="3 4"/>
          <circle cx={n.cx} cy={n.cy} r="12" fill={n.c + "11"} stroke={n.c + "40"} strokeWidth="1"/>
          <text x={n.cx} y={n.cy + 3} textAnchor="middle" fill={n.c} fontSize="5" fontWeight="700" fontFamily="monospace">{n.label}</text>
        </g>
      ))}
      {/* Pulse on center */}
      <circle cx="160" cy="80" r="6" fill="none" stroke={C.cyan} strokeWidth="1"
        style={{animation:"cv-ping 2.5s ease-out infinite", transformOrigin:"160px 80px"}}/>
    </svg>
  );
}

function TerminalVisual() {
  // Price chart with multiple overlaid lines
  return (
    <svg viewBox="0 0 320 160" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.20"/>
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Grid */}
      {[30,60,90,120].map(y=>(
        <line key={y} x1="20" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      ))}
      {/* Main price line (amber) */}
      <path d="M20 115 L55 105 L90 118 L125 88 L160 74 L195 82 L230 60 L265 52 L300 40"
        fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 115 L55 105 L90 118 L125 88 L160 74 L195 82 L230 60 L265 52 L300 40 L300 145 L20 145Z"
        fill="url(#chartFill)"/>
      {/* Secondary line (cyan, muted) */}
      <path d="M20 125 L55 122 L90 128 L125 108 L160 96 L195 100 L230 88 L265 82 L300 72"
        fill="none" stroke={C.cyan} strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      {/* Current value dot */}
      <circle cx="300" cy="40" r="4" fill={C.amber}/>
      <circle cx="300" cy="40" r="4" fill="none" stroke={C.amber} strokeWidth="1"
        style={{animation:"cv-ping 2s ease-out infinite", transformOrigin:"300px 40px"}}/>
      {/* Labels */}
      <text x="24" y="27" fill={C.muted} fontSize="7" fontFamily="monospace">BRENT CRUDE</text>
      <text x="240" y="34" fill={C.amber} fontSize="9" fontFamily="monospace" fontWeight="700">↑ 1.15%</text>
      {/* Data label chips */}
      {[
        { x: 20,  label: "WHEAT",  color: C.amber },
        { x: 80,  label: "BRENT",  color: C.cyan  },
        { x: 148, label: "LME CU", color: C.green },
      ].map((l, i) => (
        <g key={i}>
          <rect x={l.x} y="138" width="48" height="14" rx="1" fill={l.color + "15"} stroke={l.color + "30"} strokeWidth="0.5"/>
          <text x={l.x + 6} y="148" fill={l.color} fontSize="6" fontFamily="monospace" fontWeight="600">{l.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ background: C.bg, color: C.text, overflowX: "hidden" }}>

      {/* ── Grid texture ─────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage: [
          "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "44px 44px",
      }}/>

      {/* ── Radial glows ─────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div style={{ position:"absolute", right:"-5%", top:"-10%", width:"700px", height:"700px",
          background:"radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 65%)", filter:"blur(80px)" }}/>
        <div style={{ position:"absolute", left:"-10%", bottom:"5%", width:"600px", height:"500px",
          background:"radial-gradient(ellipse, rgba(6,182,212,0.04) 0%, transparent 65%)", filter:"blur(80px)" }}/>
      </div>

      <div className="relative z-10">

        {/* ═══════════════════════════════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[calc(100dvh-56px)] flex items-center py-20">
          <div className="mx-auto max-w-[1400px] w-full px-5 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_auto] gap-16 xl:gap-20 items-center">

              {/* Copy */}
              <div className="max-w-[580px]">
                <motion.div {...fadeUp(0)} className="mb-8">
                  <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 text-[9px] font-bold tracking-[0.18em] uppercase"
                    style={{ background: C.amberXs, border:`1px solid ${C.amberSm}`, color: C.amber }}>
                    <span className="h-1.5 w-1.5 rounded-full"
                      style={{ background: C.amber, animation:"cv-pulse 2s ease-in-out infinite" }}/>
                    Document Intelligence Platform
                  </span>
                </motion.div>

                <AnimatedHeadline
                  text="All-in-One Platform for Physical Commodity Traders"
                  className="text-[2.6rem] lg:text-[3.2rem] xl:text-[3.75rem] font-black tracking-[-0.03em] leading-[1.07] mb-7"
                />

                <motion.p {...fadeUp(0.25)}
                  className="text-base lg:text-lg leading-relaxed mb-10"
                  style={{ color: C.sub, maxWidth:"500px" }}>
                  Automate workflows, manage deals, track shipments, and make
                  decisions with market intelligence — one platform for the entire
                  trading firm.
                </motion.p>

                <motion.div {...fadeUp(0.35)} className="flex items-center gap-4 flex-wrap">
                  <Link href="/deals/new">
                    <button
                      className="group relative h-11 px-7 text-sm font-bold overflow-hidden transition-all duration-200"
                      style={{ background: C.amber, color: C.bg }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#FBBF24"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.amber; }}
                    >
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                        animation:"cv-shimmer-sweep 3s linear infinite",
                      }}/>
                      <span className="relative flex items-center gap-2">
                        Get Started Free
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-150"/>
                      </span>
                    </button>
                  </Link>
                  <a href="#features"
                    className="flex items-center gap-1.5 h-11 px-2 text-sm font-medium transition-colors"
                    style={{ color: C.muted }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.text}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.muted}>
                    Explore Features <ChevronRight size={13}/>
                  </a>
                </motion.div>

                <motion.p {...fadeUp(0.45)} className="mt-4 text-xs" style={{ color: C.muted }}>
                  $0 forever — no credit card needed to start
                </motion.p>
              </div>

              {/* Globe */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
              >
                <GlobeVisual />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            TICKER
            ═══════════════════════════════════════════════════════════════════ */}
        <TickerStrip />

        {/* ═══════════════════════════════════════════════════════════════════
            PLATFORM — 3 equal feature cards
            ═══════════════════════════════════════════════════════════════════ */}
        <section id="features" className="py-28 lg:py-40">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-8">

            {/* Section header — centered */}
            <div className="mb-20 text-center">
              <motion.span {...fadeUp(0)}
                className="mb-5 inline-block text-[9px] font-bold tracking-[0.2em] uppercase"
                style={{ color: C.amber }}>
                Platform
              </motion.span>
              <motion.h2 {...fadeUp(0.08)}
                className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-[-0.025em] leading-[1.1] mb-5">
                Where deals move forward
              </motion.h2>
              <motion.p {...fadeUp(0.16)}
                className="text-base lg:text-lg max-w-lg mx-auto"
                style={{ color: C.sub }}>
                Bring clarity and control to every trade decision.
              </motion.p>
              <motion.div {...fadeUp(0.24)} className="mt-8">
                <a href="#features"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wide uppercase transition-opacity hover:opacity-80"
                  style={{ background: C.amberSm, border:`1px solid ${C.amberMd}`, color: C.amber }}>
                  Explore Features <ArrowRight size={11}/>
                </a>
              </motion.div>
            </div>

            {/* 3 equal cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

              {/* Document Intelligence */}
              <motion.div {...fadeUp(0)}
                className="relative overflow-hidden flex flex-col"
                style={{ background: C.s1, border:`1px solid ${C.border}`, minHeight:"440px" }}
                whileHover={{ borderColor:"rgba(245,158,11,0.22)" }}
                transition={{ duration: 0.25 }}
              >
                {/* Visual area */}
                <div className="h-44 relative overflow-hidden"
                  style={{ background: C.s2, borderBottom:`1px solid ${C.border}` }}>
                  <DocIntelVisual />
                </div>
                {/* Content */}
                <div className="flex flex-col flex-1 p-8">
                  <span className="mb-4 inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.16em] uppercase"
                    style={{ color: C.amber }}>
                    <FileText size={9}/> Document Intelligence
                  </span>
                  <h3 className="text-xl font-bold tracking-tight leading-tight mb-4">
                    Instant compliance, every shipment
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.sub }}>
                    AI-powered extraction and compliance automation for COAs, Bills of Lading, Letter of Credit and Contracts. Instantly flag discrepancies before they impact your P&L.
                  </p>
                </div>
              </motion.div>

              {/* Operations Hub */}
              <motion.div {...fadeUp(0.1)}
                className="relative overflow-hidden flex flex-col"
                style={{ background: C.s1, border:`1px solid ${C.border}`, minHeight:"440px" }}
                whileHover={{ borderColor:"rgba(6,182,212,0.22)" }}
                transition={{ duration: 0.25 }}
              >
                <div className="h-44 relative overflow-hidden"
                  style={{ background: C.s2, borderBottom:`1px solid ${C.border}` }}>
                  <OpsHubVisual />
                </div>
                <div className="flex flex-col flex-1 p-8">
                  <span className="mb-4 inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.16em] uppercase"
                    style={{ color: C.cyan }}>
                    <Network size={9}/> Operations Hub
                  </span>
                  <h3 className="text-xl font-bold tracking-tight leading-tight mb-4">
                    Your entire desk, one window
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.sub }}>
                    Live deal coordination across email, API, and shipments with audit logs and full visibility. Team workspace with role-based access for operations. Keep deals visible and progressing from capture to completion in one window.
                  </p>
                </div>
              </motion.div>

              {/* The Terminal */}
              <motion.div {...fadeUp(0.2)}
                className="relative overflow-hidden flex flex-col"
                style={{ background: C.s1, border:`1px solid ${C.border}`, minHeight:"440px" }}
                whileHover={{ borderColor:"rgba(245,158,11,0.22)" }}
                transition={{ duration: 0.25 }}
              >
                <div className="h-44 relative overflow-hidden"
                  style={{ background: C.s2, borderBottom:`1px solid ${C.border}` }}>
                  <TerminalVisual />
                </div>
                <div className="flex flex-col flex-1 p-8">
                  <span className="mb-4 inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.16em] uppercase"
                    style={{ color: C.amber }}>
                    <BarChart3 size={9}/> The Terminal
                  </span>
                  <h3 className="text-xl font-bold tracking-tight leading-tight mb-4">
                    Intelligence in context of your deals
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.sub }}>
                    A contextual intelligence layer combining live market data, freight signals, counterparty intelligence, sanctions screening to support institutional trading decisions.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════════════ */}
        <footer className="border-t py-16" style={{ borderColor: C.border, background: C.s1 }}>
          <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">

              {/* Brand */}
              <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                <div className="flex items-center gap-2 mb-5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span className="text-sm font-bold font-mono tracking-tight" style={{ color: C.amber }}>CommodityView</span>
                </div>
                <p className="text-xs leading-relaxed mb-6 max-w-[220px]" style={{ color: C.muted }}>
                  Institutional intelligence for the physical commodity trading world. Reducing operational risk through document automation and market context.
                </p>
                <div className="flex gap-3.5">
                  <a href="#" aria-label="X/Twitter" className="opacity-40 hover:opacity-80 transition-opacity" style={{ color: C.text }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="LinkedIn" className="opacity-40 hover:opacity-80 transition-opacity" style={{ color: C.text }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {[
                { title:"Products",  links:["Document Intelligence","Operations Hub","The Terminal","Pricing"] },
                { title:"Markets",   links:["Grains & Oilseeds","Energy & Oil","Metals","Freight Rates"] },
                { title:"Support",   links:["Documentation","API Reference","Status","Contact"] },
                { title:"Company",   links:["About","Blog","Careers","Privacy"] },
              ].map(col => (
                <div key={col.title}>
                  <h4 className="text-[9px] font-bold tracking-[0.18em] uppercase mb-5" style={{ color: C.text }}>{col.title}</h4>
                  <ul className="space-y-3">
                    {col.links.map(l => (
                      <li key={l}>
                        <a href="#" className="text-xs opacity-40 hover:opacity-80 transition-opacity" style={{ color: C.text }}>{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ borderColor: C.border }}>
              <p className="text-[10px]" style={{ color: C.muted }}>
                © 2025 CommodityView. Not financial advice. All market data is for reference only.
              </p>
              <div className="flex gap-6">
                {["Terms","Privacy","Cookies"].map(l => (
                  <a key={l} href="#" className="text-[10px] opacity-60 hover:opacity-90 transition-opacity" style={{ color: C.muted }}>{l}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
