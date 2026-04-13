"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Check, Lock, Clock } from "lucide-react";

// ─── DESIGN TOKENS — warm espresso, mirrors landing ───────────────────────────
const T = {
  bg:       "#0C0A07",
  s1:       "#131009",
  s2:       "#1A1610",
  s3:       "#221C14",
  border:   "rgba(255,210,110,0.07)",
  borderHi: "rgba(255,210,110,0.14)",
  amber:    "#F59E0B",
  amberDim: "rgba(245,158,11,0.08)",
  amberLo:  "rgba(245,158,11,0.16)",
  amberMid: "rgba(245,158,11,0.26)",
  green:    "#10B981",
  greenDim: "rgba(16,185,129,0.08)",
  greenLo:  "rgba(16,185,129,0.2)",
  cyan:     "#06B6D4",
  cyanDim:  "rgba(6,182,212,0.07)",
  cyanLo:   "rgba(6,182,212,0.18)",
  purple:   "#8B5CF6",
  purpleDim:"rgba(139,92,246,0.07)",
  purpleLo: "rgba(139,92,246,0.18)",
  text:     "#EEF2F8",
  sub:      "#7A8898",
  muted:    "#3D4557",
  mono:     "var(--font-mono)",
  sans:     "var(--font-sans)",
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function fadeUp(delay = 0) {
  return {
    initial:     { opacity: 0, y: 22, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0,  filter: "blur(0px)" },
    viewport:    { once: true, margin: "-60px" },
    transition:  { duration: 0.72, delay, ease: EASE },
  };
}

// ─── FEATURE DATA — ALL features from PRD.md ─────────────────────────────────
type FeatureStatus = "live" | "roadmap" | "enterprise";

interface Feature {
  label: string;
  detail: string;
  status: FeatureStatus;
}

interface Phase {
  id:       string;
  num:      string;
  name:     string;
  tagline:  string;
  desc:     string;
  mrr:      string;
  accent:   string;
  accentDim:string;
  accentLo: string;
  accentMid:string;
  cta:      string;
  ctaHref:  string;
  features: Feature[];
}

const PHASES: Phase[] = [
  {
    id:       "document-intelligence",
    num:      "Phase 1",
    name:     "Document Intelligence",
    tagline:  "Catch mismatches before they cost you.",
    desc:     "AI extracts every parameter from any COA or contract PDF — no templates, no manual entry. A deterministic rule engine returns a verdict in under 30 seconds.",
    mrr:      "$0 → $3k MRR",
    accent:   T.amber,
    accentDim:T.amberDim,
    accentLo: T.amberLo,
    accentMid:T.amberMid,
    cta:      "Start free — 3 analyses",
    ctaHref:  "/deals/new",
    features: [
      {
        label:  "COA vs Contract check",
        detail: "Catch quality mismatches before accepting a shipment",
        status: "live",
      },
      {
        label:  "AI extraction — any PDF",
        detail: "Upload any COA or contract, no templates, no manual data entry",
        status: "live",
      },
      {
        label:  "Violations panel",
        detail: "See exactly what failed and why — no interpretation needed",
        status: "live",
      },
      {
        label:  "Side-by-side comparison table",
        detail: "Every parameter from both documents in one screen",
        status: "live",
      },
      {
        label:  "PDF export report",
        detail: "Audit-ready report — attach to email or file instantly",
        status: "live",
      },
    ],
  },
  {
    id:       "ops-hub",
    num:      "Phase 2",
    name:     "Ops Hub",
    tagline:  "Your team, one source of truth.",
    desc:     "Team workspace for the full shipment document set. LC, BL, cross-document conflicts, audit log. Green means release payment. Red means stop.",
    mrr:      "$3k → $10k MRR",
    accent:   T.cyan,
    accentDim:T.cyanDim,
    accentLo: T.cyanLo,
    accentMid:"rgba(6,182,212,0.26)",
    cta:      "Join waitlist",
    ctaHref:  "/pricing",
    features: [
      {
        label:  "Team workspace",
        detail: "Via Clerk Organizations — no more email chains between ops and traders",
        status: "roadmap",
      },
      {
        label:  "Letter of Credit compliance",
        detail: "Catch LC discrepancies before bank submission, saves thousands",
        status: "roadmap",
      },
      {
        label:  "Bill of Lading checks",
        detail: "Port, date, quantity vs contract — wrong port caught in seconds",
        status: "roadmap",
      },
      {
        label:  "Cross-document validation",
        detail: "All docs checked against each other, not just COA vs contract",
        status: "roadmap",
      },
      {
        label:  "Full shipment deal view",
        detail: "Green = release payment. Red = stop. Every doc status in one place",
        status: "roadmap",
      },
      {
        label:  "Audit log per deal",
        detail: "Who approved what and when — one click answer for CFO or regulators",
        status: "roadmap",
      },
    ],
  },
  {
    id:       "terminal",
    num:      "Phase 3",
    name:     "Terminal",
    tagline:  "The intelligence layer for your whole desk.",
    desc:     "Email ingestion, vessel tracking, market data, counterparty screening — surfaced inside your active deals, where decisions actually happen.",
    mrr:      "$10k+ MRR",
    accent:   T.purple,
    accentDim:T.purpleDim,
    accentLo: T.purpleLo,
    accentMid:"rgba(139,92,246,0.26)",
    cta:      "Contact sales",
    ctaHref:  "mailto:sales@commodityview.com",
    features: [
      {
        label:  "Email auto-ingestion",
        detail: "Documents arrive automatically via n8n — ops wakes up to an action list",
        status: "roadmap",
      },
      {
        label:  "Historical analytics",
        detail: "Failure patterns by supplier, commodity, and origin over time",
        status: "roadmap",
      },
      {
        label:  "Live vessel tracking",
        detail: "MarineTraffic embed per deal — where is your cargo right now, live ETA",
        status: "roadmap",
      },
      {
        label:  "Market data layer",
        detail: "Freight rates + commodity prices in context of active deals",
        status: "roadmap",
      },
      {
        label:  "API access",
        detail: "CTRM pushes deals in automatically — Enterprise only",
        status: "enterprise",
      },
      {
        label:  "Sanctions screening",
        detail: "OFAC/UN/EU blacklist checks, legal compliance proof — Enterprise only",
        status: "enterprise",
      },
      {
        label:  "Counterparty intelligence",
        detail: "News, risk signals, financial health on trading partners — Enterprise only",
        status: "enterprise",
      },
    ],
  },
];

// ─── FEATURE ROW ──────────────────────────────────────────────────────────────
function FeatureRow({ f, accent, accentDim, accentLo, delay }: {
  f: Feature;
  accent: string;
  accentDim: string;
  accentLo: string;
  delay: number;
}) {
  const isLive       = f.status === "live";
  const isEnterprise = f.status === "enterprise";

  return (
    <motion.div
      {...fadeUp(delay)}
      className="flex items-start gap-3 py-3.5"
      style={{ borderBottom: `1px solid ${T.border}` }}
    >
      {/* icon */}
      <div className="mt-0.5 flex-shrink-0 flex items-center justify-center"
        style={{
          width: "20px", height: "20px",
          background: isLive ? "rgba(16,185,129,0.12)" : accentDim,
          border: `1px solid ${isLive ? "rgba(16,185,129,0.28)" : accentLo}`,
        }}>
        {isLive
          ? <Check size={10} style={{ color: T.green }} strokeWidth={2.5}/>
          : isEnterprise
            ? <Lock size={9} style={{ color: accent }} strokeWidth={2}/>
            : <Clock size={9} style={{ color: accent }} strokeWidth={2}/>
        }
      </div>

      {/* text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{
            fontSize: "12px", fontWeight: 700, color: T.text,
            fontFamily: T.sans, lineHeight: 1.3,
          }}>
            {f.label}
          </span>
          {isEnterprise && (
            <span style={{
              fontSize: "7px", fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: accent,
              background: accentDim, border: `1px solid ${accentLo}`,
              padding: "1px 5px", fontFamily: T.mono,
            }}>
              Enterprise
            </span>
          )}
        </div>
        <p style={{ fontSize: "11px", color: T.muted, marginTop: "2px", lineHeight: 1.5 }}>
          {f.detail}
        </p>
      </div>
    </motion.div>
  );
}

// ─── PHASE CARD ───────────────────────────────────────────────────────────────
function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isPhase1 = index === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.82, delay: index * 0.12, ease: EASE }}
      /* Outer shell — double-bezel */
      style={{
        background: isPhase1 ? phase.accentDim : T.s1,
        border: `1px solid ${isPhase1 ? phase.accentMid : T.border}`,
        padding: "6px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top accent line on active phase */}
      {isPhase1 && (
        <span className="absolute -top-px left-8 right-8 h-px" style={{ background: phase.accent }}/>
      )}

      {/* Inner core */}
      <div style={{
        background: isPhase1 ? T.s1 : T.s2,
        border: `1px solid ${T.border}`,
        padding: "28px 28px 32px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        boxShadow: isPhase1 ? `inset 0 1px 0 rgba(255,255,255,0.04)` : "none",
      }}>

        {/* Phase badge */}
        <div className="flex items-center justify-between mb-5">
          <span style={{
            fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: phase.accent,
            background: phase.accentDim, border: `1px solid ${phase.accentLo}`,
            padding: "3px 10px", fontFamily: T.mono,
          }}>
            {phase.num}
          </span>
          <span style={{
            fontSize: "8px", color: T.muted, fontFamily: T.mono,
            letterSpacing: "0.08em",
          }}>
            {phase.mrr}
          </span>
        </div>

        {/* Name + tagline */}
        <h2 style={{
          fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)", fontWeight: 900,
          letterSpacing: "-0.028em", lineHeight: 1.08,
          color: T.text, marginBottom: "10px",
        }}>
          {phase.name}
        </h2>
        <p style={{
          fontSize: "11px", fontWeight: 700, color: phase.accent,
          fontFamily: T.mono, marginBottom: "14px", letterSpacing: "0.02em",
        }}>
          {phase.tagline}
        </p>
        <p style={{
          fontSize: "12.5px", lineHeight: 1.72, color: T.sub,
          marginBottom: "24px", maxWidth: "38ch",
        }}>
          {phase.desc}
        </p>

        {/* Divider */}
        <div style={{ height: "1px", background: T.border, marginBottom: "20px" }}/>

        {/* Feature list */}
        <div style={{ flex: 1, marginBottom: "28px" }}>
          {phase.features.map((f, i) => (
            <FeatureRow
              key={f.label}
              f={f}
              accent={phase.accent}
              accentDim={phase.accentDim}
              accentLo={phase.accentLo}
              delay={index * 0.1 + i * 0.05}
            />
          ))}
        </div>

        {/* CTA — button-in-button pattern */}
        <Link href={phase.ctaHref}>
          <button
            className="group w-full flex items-center justify-between overflow-hidden"
            style={{
              height: "44px", paddingLeft: "18px", paddingRight: "6px",
              background: isPhase1 ? phase.accent : "transparent",
              border: `1px solid ${isPhase1 ? phase.accent : phase.accentLo}`,
              transition: "all 0.26s cubic-bezier(0.32,0.72,0,1)",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = isPhase1 ? "#FBBF24" : phase.accentDim;
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = isPhase1 ? phase.accent : "transparent";
              el.style.transform = "translateY(0)";
            }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.98)"; }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
          >
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em",
              color: isPhase1 ? T.bg : phase.accent,
            }}>
              {phase.cta}
            </span>
            <span
              className="flex items-center justify-center"
              style={{
                width: "32px", height: "32px",
                background: isPhase1 ? "rgba(0,0,0,0.15)" : phase.accentDim,
                transition: "transform 0.22s cubic-bezier(0.32,0.72,0,1)",
              }}
            >
              <ArrowRight size={12} style={{ color: isPhase1 ? T.bg : phase.accent }}/>
            </span>
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  return (
    <div style={{ background: T.bg, color: T.text, overflowX: "hidden" }}>

      {/* ── grain overlay ── */}
      <div className="fixed inset-0 z-50 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.018, mixBlendMode: "overlay",
      }}/>

      {/* ── ambient glows (fixed, GPU-safe) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <div style={{
          position: "absolute", right: "-8%", top: "-5%",
          width: "700px", height: "700px",
          background: "radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}/>
        <div style={{
          position: "absolute", left: "-10%", bottom: "20%",
          width: "500px", height: "500px",
          background: "radial-gradient(ellipse, rgba(6,182,212,0.03) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}/>
        <div style={{
          position: "absolute", right: "10%", bottom: "10%",
          width: "400px", height: "400px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.03) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}/>
      </div>

      {/* ── grid texture ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden style={{
        backgroundImage: [
          "linear-gradient(rgba(255,210,110,0.018) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,210,110,0.018) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "48px 48px",
      }}/>

      <div className="relative z-10">

        {/* ══════════════════════════════════════════════════════════════════════
            HERO
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
            <motion.span {...fadeUp(0)}
              className="mb-5 inline-block"
              style={{
                fontSize: "8px", fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: T.amber,
                background: T.amberDim, border: `1px solid ${T.amberLo}`,
                padding: "3px 12px", fontFamily: T.mono,
              }}>
              Platform Roadmap
            </motion.span>

            <motion.h1 {...fadeUp(0.07)}
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", fontWeight: 900,
                letterSpacing: "-0.036em", lineHeight: 1.04,
                color: T.text, maxWidth: "16ch", marginBottom: "1.2rem",
              }}>
              Everything you need to trade with confidence.
            </motion.h1>

            <motion.p {...fadeUp(0.14)}
              style={{
                fontSize: "clamp(0.92rem, 1.5vw, 1.05rem)", lineHeight: 1.78,
                color: T.sub, maxWidth: "52ch", marginBottom: "2.4rem",
              }}>
              Three phases. One platform. Starting with document compliance
              and expanding into a full trading intelligence terminal.
            </motion.p>

            {/* Legend */}
            <motion.div {...fadeUp(0.2)} className="flex items-center gap-6 flex-wrap">
              {[
                { icon: Check, color: T.green, label: "Live now" },
                { icon: Clock, color: T.amber, label: "Roadmap" },
                { icon: Lock,  color: T.purple, label: "Enterprise" },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div style={{
                    width: "18px", height: "18px",
                    background: `${color}18`,
                    border: `1px solid ${color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={9} style={{ color }} strokeWidth={2.5}/>
                  </div>
                  <span style={{ fontSize: "11px", color: T.sub, fontFamily: T.mono }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            THREE PHASE CARDS
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="pb-24 lg:pb-32">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-start">
              {PHASES.map((phase, i) => (
                <PhaseCard key={phase.id} phase={phase} index={i}/>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            BOTTOM CTA
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 text-center">
          <div className="mx-auto max-w-[580px] px-5 lg:px-8">
            <motion.span {...fadeUp(0)}
              className="mb-5 inline-block"
              style={{
                fontSize: "8px", fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: T.amber, fontFamily: T.mono,
              }}>
              Start Today
            </motion.span>
            <motion.h2 {...fadeUp(0.07)}
              style={{
                fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", fontWeight: 900,
                letterSpacing: "-0.03em", lineHeight: 1.06,
                color: T.text, marginBottom: "1rem",
              }}>
              3 free analyses.<br/>No card, no setup.
            </motion.h2>
            <motion.p {...fadeUp(0.14)}
              style={{
                fontSize: "13px", lineHeight: 1.76,
                color: T.sub, marginBottom: "2.2rem", maxWidth: "40ch", margin: "0 auto 2.2rem",
              }}>
              Upload a COA and contract, get a COMPLIANT or NON_COMPLIANT verdict with full traceability in under 30 seconds.
            </motion.p>
            <motion.div {...fadeUp(0.2)} className="flex items-center justify-center gap-4">
              <Link href="/deals/new">
                <button
                  className="group flex items-center overflow-hidden"
                  style={{
                    height: "44px", paddingLeft: "22px", paddingRight: "6px",
                    background: T.amber,
                    transition: "all 0.26s cubic-bezier(0.32,0.72,0,1)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#FBBF24";
                    el.style.transform = "translateY(-1px)";
                    el.style.boxShadow = "0 16px 40px rgba(245,158,11,0.24)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = T.amber;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                  }}
                  onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)"; }}
                  onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 700, color: T.bg, paddingRight: "16px" }}>
                    Start free analysis
                  </span>
                  <span className="flex items-center justify-center"
                    style={{ width: "32px", height: "32px", background: "rgba(0,0,0,0.15)" }}>
                    <ArrowRight size={12} style={{ color: T.bg }}/>
                  </span>
                </button>
              </Link>
              <Link href="/pricing">
                <button style={{
                  height: "44px", padding: "0 20px",
                  background: "transparent",
                  border: `1px solid ${T.border}`,
                  fontSize: "12px", fontWeight: 600, color: T.sub,
                  transition: "all 0.22s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.text; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.sub; }}
                >
                  View pricing
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            FOOTER
            ══════════════════════════════════════════════════════════════════════ */}
        <footer className="border-t py-8" style={{ borderColor: T.border }}>
          <div className="mx-auto max-w-[1400px] px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="text-xs font-bold font-mono" style={{ color: T.amber }}>
              ← CommodityView
            </Link>
            <p style={{ fontSize: "10px", color: T.muted }}>
              © 2025 CommodityView. Not financial advice.
            </p>
            <div className="flex gap-5">
              {["Pricing", "Docs", "Contact"].map(l => (
                <Link key={l} href={l === "Pricing" ? "/pricing" : "#"}
                  style={{ fontSize: "10px", color: T.muted, opacity: 0.55 }}
                  className="hover:opacity-80 transition-opacity">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
