"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle, FileCheck, Network, Globe, Mail, Shield, BarChart3 } from "lucide-react";

const T = {
  bg: "#050A14",
  s1: "#0B1628",
  s2: "#0F1D35",
  border: "rgba(255,255,255,0.055)",
  borderHi: "rgba(255,255,255,0.10)",
  amber: "#F59E0B",
  amberDim: "rgba(245,158,11,0.08)",
  amberLo: "rgba(245,158,11,0.12)",
  cyan: "#06B6D4",
  violet: "#8B5CF6",
  text: "#F1F5F9",
  sub: "#8892A4",
  muted: "#3D4A5C",
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.65, delay, ease: EASE },
  };
}

type FeatureGroup = {
  title: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; strokeWidth?: number }>;
  color: string;
  subtitle: string;
  items: string[];
};

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    title: "Document Verification",
    icon: FileCheck,
    color: T.amber,
    subtitle: "Catch mistakes before payment moves",
    items: [
      "COA vs Contract checks",
      "AI extraction from any PDF (no templates)",
      "Violations panel with exact fail reasons",
      "Comparison table for every parameter",
      "PDF export for audit-ready reporting",
      "Letter of Credit compliance checks",
      "Bill of Lading checks (port, date, quantity)",
      "Cross-document validation across all docs",
    ],
  },
  {
    title: "Deal Operations",
    icon: Network,
    color: T.cyan,
    subtitle: "Keep the whole team aligned in one workspace",
    items: [
      "Team workspace with shared visibility",
      "Expanded deal view with full document status",
      "Clear release/hold signal on each deal",
      "Audit log per deal (who did what, when)",
      "Historical deal records and override trace",
    ],
  },
  {
    title: "Intelligence + Automation",
    icon: Globe,
    color: T.violet,
    subtitle: "Move faster with live context and less manual work",
    items: [
      "Email ingestion for automatic document intake",
      "Historical analytics by supplier, commodity, and origin",
      "Vessel tracking with live ETA context",
      "Market data layer (freight + commodity context)",
      "API access for CTRM/system integrations",
      "Sanctions screening (OFAC/UN/EU)",
      "Counterparty intelligence and risk signals",
    ],
  },
];

const TRUST_ROW = [
  { icon: Mail, label: "Zero manual intake", text: "Documents can arrive and process automatically." },
  { icon: Shield, label: "Deterministic checks", text: "Rules decide compliance, not probabilistic output." },
  { icon: BarChart3, label: "Decision context", text: "Shipment + market + document status in one flow." },
];

export default function ProductsPage() {
  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100dvh" }}>
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ background: T.bg }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 62% 50% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 65%), radial-gradient(ellipse 45% 35% at 20% 80%, rgba(6,182,212,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-5 lg:px-8 text-center">
          <motion.div {...fadeUp(0)} className="mb-5">
            <Link href="/" className="inline-flex items-center gap-2 text-xs" style={{ color: T.muted, fontFamily: "var(--font-mono)" }}>
              <ArrowRight size={10} className="rotate-180" /> Back to home
            </Link>
          </motion.div>
          <motion.span
            {...fadeUp(0.05)}
            style={{
              color: T.amber,
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            Features
          </motion.span>
          <motion.h1
            {...fadeUp(0.1)}
            style={{
              fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              color: T.text,
              marginBottom: "1.1rem",
              maxWidth: "920px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Where deals move forward
          </motion.h1>
          <motion.p
            {...fadeUp(0.16)}
            style={{
              fontSize: "clamp(0.95rem, 1.8vw, 1.08rem)",
              lineHeight: 1.78,
              color: T.sub,
              maxWidth: "760px",
              marginBottom: "2.2rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Bring clarity and control to every trade decision with complete document checks, shared deal operations, and real-time intelligence.
          </motion.p>
          <motion.div {...fadeUp(0.22)}>
            <Link href="/pricing">
              <button
                className="group relative h-12 pl-7 pr-2 inline-flex items-center gap-3 font-bold text-sm overflow-hidden"
                style={{ background: T.amber, color: T.bg, transition: "all 0.25s cubic-bezier(0.32,0.72,0,1)" }}
              >
                <span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.28) 50%, transparent 60%)", animation: "cv-shimmer-sweep 3.5s linear infinite" }} />
                <span className="relative z-10">Get Started Free</span>
                <span className="relative z-10 flex h-8 w-8 items-center justify-center" style={{ background: "rgba(0,0,0,0.15)" }}>
                  <ArrowRight size={13} />
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-20" style={{ background: T.s1, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div className="mx-auto max-w-[1400px] px-5 lg:px-8 grid lg:grid-cols-3 gap-px" style={{ border: `1px solid ${T.border}`, background: T.border }}>
          {FEATURE_GROUPS.map((group, idx) => {
            const Icon = group.icon;
            return (
              <motion.div key={group.title} {...fadeUp(idx * 0.06)} style={{ background: T.bg, padding: "24px" }}>
                <div className="h-8 w-8 flex items-center justify-center mb-4" style={{ background: `${group.color}14`, border: `1px solid ${group.color}30` }}>
                  <Icon size={14} style={{ color: group.color }} strokeWidth={1.6} />
                </div>
                <h2 style={{ fontSize: "1.06rem", fontWeight: 800, color: T.text, marginBottom: "0.4rem" }}>{group.title}</h2>
                <p style={{ fontSize: "0.84rem", lineHeight: 1.72, color: T.sub, marginBottom: "1rem" }}>{group.subtitle}</p>
                <div className="space-y-2.5">
                  {group.items.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle size={10} style={{ color: group.color, marginTop: "2px", flexShrink: 0 }} strokeWidth={2} />
                      <p style={{ fontSize: "11.5px", lineHeight: 1.65, color: T.muted }}>{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-14 lg:py-16" style={{ background: T.bg }}>
        <div className="mx-auto max-w-[1400px] px-5 lg:px-8 grid md:grid-cols-3 gap-px" style={{ border: `1px solid ${T.border}`, background: T.border }}>
          {TRUST_ROW.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} {...fadeUp(idx * 0.08)} style={{ background: T.s1, padding: "20px" }}>
                <Icon size={14} style={{ color: T.amber, marginBottom: "10px" }} strokeWidth={1.7} />
                <p style={{ fontSize: "12px", color: T.muted, marginBottom: "4px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{item.label}</p>
                <p style={{ fontSize: "0.92rem", color: T.text, lineHeight: 1.7 }}>{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-16 lg:py-20 relative" style={{ background: T.s1, borderTop: `1px solid ${T.border}` }}>
        <div className="relative mx-auto max-w-[1400px] px-5 lg:px-8 text-center">
          <motion.p {...fadeUp(0)} style={{ color: T.amber, fontSize: "9px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: "1rem" }}>
            Ready to start
          </motion.p>
          <motion.h2 {...fadeUp(0.06)} style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.3rem)", fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.12, color: T.text, marginBottom: "0.9rem" }}>
            Get full feature access with the plan that fits your volume
          </motion.h2>
          <motion.p {...fadeUp(0.12)} style={{ fontSize: "0.92rem", lineHeight: 1.82, color: T.sub, maxWidth: "560px", margin: "0 auto 2rem" }}>
            Start free, then scale into team workflows and advanced intelligence when your deal flow grows.
          </motion.p>
          <motion.div {...fadeUp(0.18)} className="flex justify-center">
            <Link href="/pricing">
              <button className="h-11 pl-6 pr-2 flex items-center gap-2.5 font-bold text-sm" style={{ background: T.amber, color: T.bg }}>
                Get Started Free
                <span className="flex h-7 w-7 items-center justify-center" style={{ background: "rgba(0,0,0,0.15)" }}>
                  <ArrowRight size={12} />
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
