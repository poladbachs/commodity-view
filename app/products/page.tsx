"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import React, { useRef } from "react";
import {
  ArrowRight, Check, Lock, Clock, X, FileText, Users, Ship,
  Mail, BarChart3, Radio, Code2, Shield, Search, AlertTriangle,
  DollarSign, Anchor, TrafficCone, History,
} from "lucide-react";

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
  red:      "#EF4444",
  redDim:   "rgba(239,68,68,0.08)",
  redLo:    "rgba(239,68,68,0.2)",
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

// ─── DATA ─────────────────────────────────────────────────────────────────────
type FeatureStatus = "live" | "roadmap" | "enterprise";

interface Feature {
  id:     string;
  label:  string;
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
    id: "document-intelligence",
    num: "Phase 1", name: "Document Intelligence",
    tagline: "Catch mismatches before they cost you.",
    desc: "AI extracts every parameter from any COA or contract PDF — no templates, no manual entry. A deterministic rule engine returns a verdict in under 30 seconds.",
    mrr: "$0 → $3k MRR",
    accent: T.amber, accentDim: T.amberDim, accentLo: T.amberLo, accentMid: T.amberMid,
    cta: "Start free — 3 analyses", ctaHref: "/deals/new",
    features: [
      { id: "coa-contract",   label: "COA vs Contract check",      detail: "Catch quality mismatches before accepting a shipment",            status: "live" },
      { id: "ai-extract",     label: "AI extraction — any PDF",    detail: "Upload any COA or contract, no templates, no manual data entry",  status: "live" },
      { id: "violations",     label: "Violations panel",           detail: "See exactly what failed and why — no interpretation needed",      status: "live" },
      { id: "comparison",     label: "Side-by-side comparison",    detail: "Every parameter from both documents in one screen",               status: "live" },
      { id: "pdf-export",     label: "PDF export report",          detail: "Audit-ready report — attach to email or file instantly",          status: "live" },
    ],
  },
  {
    id: "ops-hub",
    num: "Phase 2", name: "Ops Hub",
    tagline: "Your team, one source of truth.",
    desc: "Team workspace for the full shipment document set. LC, BL, cross-document conflicts, audit log. Green means release payment. Red means stop.",
    mrr: "$3k → $10k MRR",
    accent: T.cyan, accentDim: T.cyanDim, accentLo: T.cyanLo, accentMid: "rgba(6,182,212,0.26)",
    cta: "Join waitlist", ctaHref: "/pricing",
    features: [
      { id: "team",           label: "Team workspace",             detail: "Via Clerk Organizations — no more email chains between ops and traders",          status: "roadmap" },
      { id: "lc",             label: "Letter of Credit compliance",detail: "Catch LC discrepancies before bank submission, saves thousands",                   status: "roadmap" },
      { id: "bl",             label: "Bill of Lading checks",      detail: "Port, date, quantity vs contract — wrong port caught in seconds",                  status: "roadmap" },
      { id: "cross-doc",      label: "Cross-document validation",  detail: "All docs checked against each other, not just COA vs contract",                    status: "roadmap" },
      { id: "deal-view",      label: "Full shipment deal view",    detail: "Green = release payment. Red = stop. Every doc status in one place",               status: "roadmap" },
      { id: "audit",          label: "Audit log per deal",         detail: "Who approved what and when — one click answer for CFO or regulators",              status: "roadmap" },
    ],
  },
  {
    id: "terminal",
    num: "Phase 3", name: "Terminal",
    tagline: "The intelligence layer for your whole desk.",
    desc: "Email ingestion, vessel tracking, market data, counterparty screening — surfaced inside your active deals, where decisions actually happen.",
    mrr: "$10k+ MRR",
    accent: T.purple, accentDim: T.purpleDim, accentLo: T.purpleLo, accentMid: "rgba(139,92,246,0.26)",
    cta: "Contact sales", ctaHref: "mailto:sales@commodityview.com",
    features: [
      { id: "email",          label: "Email auto-ingestion",       detail: "Documents arrive automatically via n8n — ops wakes up to an action list",          status: "roadmap" },
      { id: "history",        label: "Historical analytics",       detail: "Failure patterns by supplier, commodity, and origin over time",                    status: "roadmap" },
      { id: "vessel",         label: "Live vessel tracking",       detail: "MarineTraffic embed per deal — where is your cargo right now, live ETA",           status: "roadmap" },
      { id: "market",         label: "Market data layer",          detail: "Freight rates + commodity prices in context of active deals",                      status: "roadmap" },
      { id: "api",            label: "API access",                 detail: "CTRM pushes deals in automatically — Enterprise only",                             status: "enterprise" },
      { id: "sanctions",      label: "Sanctions screening",        detail: "OFAC/UN/EU blacklist checks, legal compliance proof — Enterprise only",            status: "enterprise" },
      { id: "counterparty",   label: "Counterparty intelligence",  detail: "News, risk signals, financial health on trading partners — Enterprise only",       status: "enterprise" },
    ],
  },
];

// ─── DEMO PRIMITIVES ──────────────────────────────────────────────────────────
const DEMO_H = 360;

function DemoShell({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div
      style={{
        height: DEMO_H,
        background: T.s2,
        border: `1px solid ${T.border}`,
        padding: "6px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: `linear-gradient(90deg, transparent, ${accent}44, transparent)`,
        }}
      />
      <div
        style={{
          background: T.bg,
          border: `1px solid ${T.border}`,
          height: "100%",
          position: "relative",
          overflow: "hidden",
          padding: "18px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── DEMOS (one per feature id) ───────────────────────────────────────────────

// 1. COA vs Contract check — two columns, values filling, mismatch flagged
function Demo_CoaContract({ accent }: { accent: string }) {
  const rows = [
    { label: "Protein %",   a: "12.8", b: "12.5", ok: true  },
    { label: "Moisture %",  a: "13.2", b: "13.5", ok: true  },
    { label: "Test Weight", a: "76.1", b: "78.0", ok: false },
    { label: "Falling No.", a: "352",  b: "300",  ok: true  },
    { label: "DON (ppm)",   a: "0.8",  b: "1.0",  ok: true  },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="grid grid-cols-2 gap-3 h-full">
        {["COA", "CONTRACT"].map((doc, col) => (
          <div key={doc} className="flex flex-col">
            <div style={{ fontSize: 8, fontFamily: T.mono, color: T.muted, letterSpacing: "0.18em", marginBottom: 10 }}>
              {doc}
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              {rows.map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, x: col === 0 ? -10 : 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-30%" }}
                  transition={{ duration: 0.4, delay: i * 0.12 + col * 0.05, ease: EASE }}
                  className="flex items-center justify-between px-2 py-1.5"
                  style={{
                    background: !r.ok ? T.redDim : "transparent",
                    border: `1px solid ${!r.ok ? T.redLo : T.border}`,
                    fontSize: 11, fontFamily: T.mono,
                  }}
                >
                  <span style={{ color: T.muted }}>{r.label}</span>
                  <span style={{ color: r.ok ? T.text : T.red, fontWeight: 700 }}>
                    {col === 0 ? r.a : r.b}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-30%" }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute right-4 top-4 flex items-center gap-1.5 px-2 py-1"
        style={{ background: T.redDim, border: `1px solid ${T.redLo}` }}
      >
        <X size={10} style={{ color: T.red }} strokeWidth={3} />
        <span style={{ fontSize: 9, color: T.red, fontFamily: T.mono, fontWeight: 700, letterSpacing: "0.1em" }}>
          1 MISMATCH
        </span>
      </motion.div>
    </DemoShell>
  );
}

// 2. AI extraction — PDF with fields pulling out
function Demo_AiExtract({ accent }: { accent: string }) {
  const fields = [
    { k: "protein",   v: "12.8%",  x: "62%", y: "22%" },
    { k: "moisture",  v: "13.2%",  x: "62%", y: "38%" },
    { k: "origin",    v: "Odesa",  x: "62%", y: "54%" },
    { k: "incoterm",  v: "FOB",    x: "62%", y: "70%" },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full relative flex items-center">
        {/* PDF doc */}
        <div
          style={{
            width: 120, height: 160, background: T.s1,
            border: `1px solid ${T.border}`, padding: 10,
            position: "relative",
          }}
        >
          <FileText size={14} style={{ color: accent, marginBottom: 8 }} />
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 3, marginBottom: 4,
                width: `${60 + ((i * 13) % 35)}%`,
                background: T.border,
              }}
            />
          ))}
          {/* scanner beam */}
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: [0, 150, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              boxShadow: `0 0 12px ${accent}88`,
            }}
          />
        </div>

        {/* extracted fields */}
        {fields.map((f, i) => (
          <motion.div
            key={f.k}
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.5, ease: EASE }}
            style={{
              position: "absolute", left: f.x, top: f.y,
              background: T.s1, border: `1px solid ${accent}44`,
              padding: "4px 8px", fontSize: 10, fontFamily: T.mono,
              display: "flex", gap: 6,
            }}
          >
            <span style={{ color: T.muted }}>{f.k}</span>
            <span style={{ color: accent, fontWeight: 700 }}>{f.v}</span>
          </motion.div>
        ))}
      </div>
    </DemoShell>
  );
}

// 3. Violations panel
function Demo_Violations({ accent }: { accent: string }) {
  const v = [
    { rule: "Protein ≥ 12.5%",    actual: "12.8%", ok: true },
    { rule: "Test Weight ≥ 78",   actual: "76.1",  ok: false },
    { rule: "Moisture ≤ 14%",     actual: "13.2%", ok: true },
    { rule: "DON ≤ 1.0 ppm",      actual: "0.8",   ok: true },
    { rule: "Falling No. ≥ 300",  actual: "352",   ok: true },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.18em" }}>
            VIOLATIONS
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ delay: 1.3 }}
            style={{
              fontSize: 9, fontFamily: T.mono, color: T.red, fontWeight: 700,
              background: T.redDim, border: `1px solid ${T.redLo}`,
              padding: "2px 8px", letterSpacing: "0.12em",
            }}
          >
            1 FAILED
          </motion.span>
        </div>
        {v.map((item, i) => (
          <motion.div
            key={item.rule}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ delay: i * 0.15, duration: 0.4, ease: EASE }}
            className="flex items-center gap-3 px-3 py-2"
            style={{
              background: !item.ok ? T.redDim : T.s1,
              border: `1px solid ${!item.ok ? T.redLo : T.border}`,
            }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 18, height: 18,
                background: item.ok ? T.greenDim : T.redDim,
                border: `1px solid ${item.ok ? T.greenLo : T.redLo}`,
              }}
            >
              {item.ok
                ? <Check size={10} style={{ color: T.green }} strokeWidth={3} />
                : <X     size={10} style={{ color: T.red }}   strokeWidth={3} />}
            </div>
            <span style={{ fontSize: 11, fontFamily: T.mono, color: T.text, flex: 1 }}>
              {item.rule}
            </span>
            <span style={{ fontSize: 11, fontFamily: T.mono, color: item.ok ? T.sub : T.red, fontWeight: 700 }}>
              {item.actual}
            </span>
          </motion.div>
        ))}
      </div>
    </DemoShell>
  );
}

// 4. Side-by-side comparison table
function Demo_Comparison({ accent }: { accent: string }) {
  const rows = [
    { p: "Protein",       c: "12.5%", a: "12.8%", ok: true },
    { p: "Moisture",      c: "14.0%", a: "13.2%", ok: true },
    { p: "Test Weight",   c: "78.0",  a: "76.1",  ok: false },
    { p: "Falling No.",   c: "300",   a: "352",   ok: true },
    { p: "DON",           c: "1.0",   a: "0.8",   ok: true },
    { p: "Foreign Matter",c: "2.0%",  a: "1.4%",  ok: true },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full">
        <div
          className="grid mb-2"
          style={{ gridTemplateColumns: "1.6fr 1fr 1fr 28px", gap: 8 }}
        >
          {["PARAMETER","CONTRACT","COA",""].map(h => (
            <span key={h} style={{ fontSize: 8, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>{h}</span>
          ))}
        </div>
        {rows.map((r, i) => (
          <motion.div
            key={r.p}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ delay: i * 0.09, duration: 0.4, ease: EASE }}
            className="grid py-2"
            style={{
              gridTemplateColumns: "1.6fr 1fr 1fr 28px",
              gap: 8, borderBottom: `1px solid ${T.border}`, alignItems: "center",
            }}
          >
            <span style={{ fontSize: 11, color: T.text }}>{r.p}</span>
            <span style={{ fontSize: 11, fontFamily: T.mono, color: T.sub }}>{r.c}</span>
            <span style={{ fontSize: 11, fontFamily: T.mono, color: r.ok ? T.text : T.red, fontWeight: 700 }}>{r.a}</span>
            <div
              className="flex items-center justify-center"
              style={{
                width: 18, height: 18,
                background: r.ok ? T.greenDim : T.redDim,
                border: `1px solid ${r.ok ? T.greenLo : T.redLo}`,
              }}
            >
              {r.ok
                ? <Check size={9} style={{ color: T.green }} strokeWidth={3} />
                : <X     size={9} style={{ color: T.red }}   strokeWidth={3} />}
            </div>
          </motion.div>
        ))}
      </div>
    </DemoShell>
  );
}

// 5. PDF export
function Demo_PdfExport({ accent }: { accent: string }) {
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, margin: "-30%" }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            width: 180, background: T.s1, border: `1px solid ${T.border}`,
            padding: 16, position: "relative",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText size={12} style={{ color: accent }} />
            <span style={{ fontSize: 9, fontFamily: T.mono, color: accent, fontWeight: 700, letterSpacing: "0.12em" }}>
              COMPLIANCE REPORT
            </span>
          </div>
          {[0,1,2,3,4,5].map(i => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              style={{
                height: 3, marginBottom: 6, transformOrigin: "left",
                width: `${55 + ((i * 17) % 40)}%`,
                background: i === 2 ? T.red : T.border,
              }}
            />
          ))}
          <div
            className="mt-3 pt-3 flex items-center gap-1.5"
            style={{ borderTop: `1px solid ${T.border}` }}
          >
            <Check size={10} style={{ color: T.green }} strokeWidth={3} />
            <span style={{ fontSize: 9, fontFamily: T.mono, color: T.sub }}>
              Signed · Audit-ready
            </span>
          </div>
        </motion.div>

        {/* export arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: [0, 1, 0], x: [-10, 80, 80] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
          style={{
            position: "absolute", left: "55%", top: "50%",
            color: accent,
          }}
        >
          <ArrowRight size={18} />
        </motion.div>
      </div>
    </DemoShell>
  );
}

// 6. Team workspace
function Demo_Team({ accent }: { accent: string }) {
  const members = [
    { init: "MA", name: "Maria — Ops",        color: T.cyan,   role: "viewing COA" },
    { init: "JK", name: "Jin — Trader",       color: T.amber,  role: "approved" },
    { init: "RP", name: "Rita — Compliance",  color: T.purple, role: "commented" },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Users size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            DEAL · ODESA-2611 · 4 ACTIVE
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {members.map((m, i) => (
            <motion.div
              key={m.init}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ delay: i * 0.18, duration: 0.5, ease: EASE }}
              className="flex items-center gap-3 px-3 py-2.5"
              style={{ background: T.s1, border: `1px solid ${T.border}` }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 26, height: 26, background: `${m.color}18`,
                  border: `1px solid ${m.color}44`,
                  fontSize: 9, fontFamily: T.mono, fontWeight: 700, color: m.color,
                }}
              >
                {m.init}
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>{m.role}</div>
              </div>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
                style={{ width: 6, height: 6, background: m.color, borderRadius: "50%" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// 7. LC compliance
function Demo_LC({ accent }: { accent: string }) {
  const checks = [
    { k: "Beneficiary name",       ok: true },
    { k: "Amount & currency",      ok: true },
    { k: "Shipment window",        ok: true },
    { k: "Port of loading",        ok: false },
    { k: "Document presentation",  ok: true },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            LC-8827451 · UBS · USD 1,280,000
          </span>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          {checks.map((c, i) => (
            <motion.div
              key={c.k}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className="flex items-center gap-3 px-3 py-2"
              style={{
                background: !c.ok ? T.redDim : T.s1,
                border: `1px solid ${!c.ok ? T.redLo : T.border}`,
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 16, height: 16,
                  background: c.ok ? T.greenDim : T.redDim,
                  border: `1px solid ${c.ok ? T.greenLo : T.redLo}`,
                }}
              >
                {c.ok
                  ? <Check size={9} style={{ color: T.green }} strokeWidth={3} />
                  : <X     size={9} style={{ color: T.red }}   strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 11, color: T.text, flex: 1 }}>{c.k}</span>
              {!c.ok && (
                <span style={{ fontSize: 9, fontFamily: T.mono, color: T.red, fontWeight: 700 }}>
                  DISCREPANCY
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// 8. BL checks — ship + port + date
function Demo_BL({ accent }: { accent: string }) {
  const fields = [
    { label: "Port of loading",  v: "Odesa, UA",       ok: true },
    { label: "Port of discharge",v: "Rotterdam, NL",   ok: true },
    { label: "ETD",              v: "2026-05-04",      ok: false },
    { label: "Quantity",         v: "24,500 MT",       ok: true },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Anchor size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            BL · MAEU-771120
          </span>
        </div>
        <div className="relative mb-3" style={{ height: 42 }}>
          {/* Route line */}
          <div
            style={{
              position: "absolute", top: "50%", left: 16, right: 16, height: 1,
              background: T.border, transform: "translateY(-50%)",
            }}
          />
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "calc(100% - 32px)" }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            style={{
              position: "absolute", top: "50%", left: 16, height: 1,
              background: `linear-gradient(90deg, ${accent}, ${accent}44)`,
              transform: "translateY(-50%)",
            }}
          />
          {/* Origin */}
          <div
            style={{
              position: "absolute", top: "50%", left: 16,
              width: 10, height: 10, background: accent, borderRadius: "50%",
              transform: "translate(-50%, -50%)", boxShadow: `0 0 10px ${accent}`,
            }}
          />
          {/* Ship moving */}
          <motion.div
            initial={{ left: 16 }}
            whileInView={{ left: "calc(100% - 20px)" }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{ position: "absolute", top: "50%", transform: "translate(-50%, -50%)" }}
          >
            <Ship size={14} style={{ color: T.text }} />
          </motion.div>
          {/* Destination */}
          <div
            style={{
              position: "absolute", top: "50%", right: 16,
              width: 10, height: 10, background: T.s3, border: `1px solid ${accent}`, borderRadius: "50%",
              transform: "translate(50%, -50%)",
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          {fields.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
              className="flex items-center justify-between px-2.5 py-1.5"
              style={{
                background: !f.ok ? T.redDim : T.s1,
                border: `1px solid ${!f.ok ? T.redLo : T.border}`,
              }}
            >
              <span style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>{f.label}</span>
              <span style={{ fontSize: 11, color: f.ok ? T.text : T.red, fontFamily: T.mono, fontWeight: 700 }}>
                {f.v}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// 9. Cross-doc validation — network
function Demo_CrossDoc({ accent }: { accent: string }) {
  const nodes = [
    { label: "COA",      x: 20,  y: 20 },
    { label: "Contract", x: 75,  y: 22 },
    { label: "LC",       x: 80,  y: 72 },
    { label: "BL",       x: 22,  y: 72 },
  ];
  const links = [
    { a: 0, b: 1, ok: true  },
    { a: 1, b: 2, ok: true  },
    { a: 2, b: 3, ok: false },
    { a: 3, b: 0, ok: true  },
    { a: 0, b: 2, ok: true  },
    { a: 1, b: 3, ok: true  },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="relative h-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {links.map((l, i) => {
            const a = nodes[l.a]; const b = nodes[l.b];
            return (
              <motion.line
                key={i}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={l.ok ? accent : T.red}
                strokeWidth={0.4}
                strokeDasharray={l.ok ? "0" : "2 1"}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: l.ok ? 0.5 : 0.9 }}
                viewport={{ once: false, margin: "-30%" }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
              />
            );
          })}
        </svg>
        {nodes.map((n, i) => (
          <motion.div
            key={n.label}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}
            style={{
              position: "absolute",
              left: `${n.x}%`, top: `${n.y}%`,
              transform: "translate(-50%, -50%)",
              background: T.s1, border: `1px solid ${accent}66`,
              padding: "6px 10px", fontSize: 10, fontFamily: T.mono, fontWeight: 700,
              color: T.text,
            }}
          >
            {n.label}
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-30%" }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1"
          style={{ background: T.redDim, border: `1px solid ${T.redLo}` }}
        >
          <AlertTriangle size={9} style={{ color: T.red }} />
          <span style={{ fontSize: 9, color: T.red, fontFamily: T.mono, fontWeight: 700 }}>
            LC ↔ BL conflict
          </span>
        </motion.div>
      </div>
    </DemoShell>
  );
}

// 10. Deal view — traffic light
function Demo_DealView({ accent }: { accent: string }) {
  const items = [
    { k: "COA",       ok: true  },
    { k: "Contract",  ok: true  },
    { k: "LC",        ok: false },
    { k: "BL",        ok: true  },
    { k: "Insurance", ok: true  },
  ];
  const allOk = items.every(i => i.ok);
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <TrafficCone size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            ODESA-2611 · GRAIN · 24,500 MT
          </span>
        </div>
        <div className="flex flex-col gap-1.5 mb-4">
          {items.map((it, i) => (
            <motion.div
              key={it.k}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ delay: i * 0.12, duration: 0.35 }}
              className="flex items-center gap-3 px-3 py-1.5"
              style={{ background: T.s1, border: `1px solid ${T.border}` }}
            >
              <div
                style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: it.ok ? T.green : T.red,
                  boxShadow: `0 0 8px ${it.ok ? T.green : T.red}88`,
                }}
              />
              <span style={{ fontSize: 11, color: T.text, flex: 1 }}>{it.k}</span>
              <span style={{ fontSize: 9, fontFamily: T.mono, color: it.ok ? T.green : T.red, fontWeight: 700, letterSpacing: "0.08em" }}>
                {it.ok ? "CLEARED" : "BLOCKED"}
              </span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-30%" }}
          transition={{ delay: 0.9 }}
          className="mt-auto flex items-center justify-center py-3"
          style={{
            background: allOk ? T.greenDim : T.redDim,
            border: `1px solid ${allOk ? T.greenLo : T.redLo}`,
          }}
        >
          <span style={{
            fontSize: 11, fontFamily: T.mono, fontWeight: 800,
            letterSpacing: "0.2em", color: allOk ? T.green : T.red,
          }}>
            {allOk ? "RELEASE PAYMENT" : "HOLD — REVIEW LC"}
          </span>
        </motion.div>
      </div>
    </DemoShell>
  );
}

// 11. Audit log — timeline
function Demo_Audit({ accent }: { accent: string }) {
  const events = [
    { who: "Maria (Ops)",    what: "uploaded COA-2611.pdf",      t: "09:12" },
    { who: "System",         what: "extracted 14 parameters",    t: "09:12" },
    { who: "System",         what: "flagged 1 violation",        t: "09:13" },
    { who: "Rita (Compl.)",  what: "approved override w/ note",  t: "09:47" },
    { who: "Jin (Trader)",   what: "released payment to bank",   t: "10:02" },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <History size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            AUDIT · ODESA-2611
          </span>
        </div>
        <div className="relative flex-1">
          {/* spine */}
          <div
            style={{
              position: "absolute", left: 6, top: 4, bottom: 4,
              width: 1, background: T.border,
            }}
          />
          {events.map((e, i) => (
            <motion.div
              key={e.t + i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ delay: i * 0.18, duration: 0.4 }}
              className="relative flex items-start gap-3 py-1.5"
              style={{ paddingLeft: 20 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false, margin: "-30%" }}
                transition={{ delay: i * 0.18 + 0.1 }}
                style={{
                  position: "absolute", left: 2, top: 10,
                  width: 9, height: 9, borderRadius: "50%",
                  background: accent, boxShadow: `0 0 6px ${accent}88`,
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span style={{ fontSize: 10, fontFamily: T.mono, color: accent, fontWeight: 700 }}>
                    {e.t}
                  </span>
                  <span style={{ fontSize: 10, color: T.sub }}>{e.who}</span>
                </div>
                <div style={{ fontSize: 11, color: T.text, marginTop: 1 }}>{e.what}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// 12. Email ingestion
function Demo_Email({ accent }: { accent: string }) {
  const emails = [
    { from: "lab@sgs-odesa.ua",   subj: "COA — MV ATHINA",  attach: "COA-2611.pdf",    ok: true },
    { from: "ops@cargill.com",    subj: "Contract update",   attach: "GRN-4421.pdf",    ok: true },
    { from: "bank@ubs.ch",        subj: "LC issued",         attach: "LC-8827451.pdf",  ok: true },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <Mail size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            INBOX → AUTO-INGESTED
          </span>
        </div>
        {emails.map((e, i) => (
          <motion.div
            key={e.attach}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ delay: i * 0.22, duration: 0.6, ease: EASE }}
            className="px-3 py-2"
            style={{ background: T.s1, border: `1px solid ${T.border}` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: 10, fontFamily: T.mono, color: T.sub }}>{e.from}</span>
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-30%" }}
                transition={{ delay: i * 0.22 + 0.4 }}
                className="flex items-center gap-1"
              >
                <Check size={9} style={{ color: T.green }} strokeWidth={3} />
                <span style={{ fontSize: 8, color: T.green, fontFamily: T.mono, fontWeight: 700, letterSpacing: "0.1em" }}>
                  PARSED
                </span>
              </motion.div>
            </div>
            <div style={{ fontSize: 11, color: T.text, marginBottom: 4 }}>{e.subj}</div>
            <div className="flex items-center gap-1.5">
              <FileText size={9} style={{ color: accent }} />
              <span style={{ fontSize: 10, fontFamily: T.mono, color: accent }}>{e.attach}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </DemoShell>
  );
}

// 13. Historical analytics — bar chart
function Demo_History({ accent }: { accent: string }) {
  const bars = [
    { k: "Cargill",     v: 0.94, n: "1 violation" },
    { k: "Bunge",       v: 0.87, n: "3 violations" },
    { k: "Viterra",     v: 0.72, n: "8 violations" },
    { k: "Olam",        v: 0.62, n: "11 violations" },
    { k: "Kernel",      v: 0.48, n: "19 violations" },
    { k: "Nibulon",     v: 0.31, n: "27 violations" },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            PASS RATE · LAST 12 MONTHS
          </span>
        </div>
        <div className="flex flex-col gap-2 flex-1 justify-center">
          {bars.map((b, i) => (
            <div key={b.k} className="flex items-center gap-3">
              <span style={{ width: 56, fontSize: 10, color: T.text, fontFamily: T.mono }}>
                {b.k}
              </span>
              <div className="flex-1 relative" style={{ height: 12, background: T.s1, border: `1px solid ${T.border}` }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${b.v * 100}%` }}
                  viewport={{ once: false, margin: "-30%" }}
                  transition={{ delay: i * 0.12, duration: 1, ease: EASE }}
                  style={{
                    height: "100%",
                    background: b.v > 0.8 ? T.green : b.v > 0.5 ? accent : T.red,
                  }}
                />
              </div>
              <span style={{ width: 82, fontSize: 9, color: T.muted, fontFamily: T.mono, textAlign: "right" }}>
                {b.n}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// 14. Vessel tracking — map with moving ship
function Demo_Vessel({ accent }: { accent: string }) {
  return (
    <DemoShell accent={accent}>
      <div className="h-full relative">
        <div className="flex items-center gap-2 mb-2">
          <Radio size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            MV ATHINA · IMO 9876543
          </span>
        </div>
        <svg viewBox="0 0 100 60" preserveAspectRatio="none"
          style={{ width: "100%", height: "78%" }}>
          {/* grid */}
          {[...Array(6)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i*12} x2="100" y2={i*12}
              stroke={T.border} strokeWidth="0.2" />
          ))}
          {[...Array(9)].map((_, i) => (
            <line key={`v${i}`} x1={i*12} y1="0" x2={i*12} y2="60"
              stroke={T.border} strokeWidth="0.2" />
          ))}
          {/* route */}
          <motion.path
            d="M 8 46 Q 30 20 55 30 T 92 12"
            fill="none" stroke={accent} strokeWidth="0.5"
            strokeDasharray="1.5 1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ duration: 1.5 }}
          />
          {/* origin port */}
          <circle cx="8" cy="46" r="1.6" fill={accent} />
          <circle cx="8" cy="46" r="3" fill="none" stroke={accent} strokeWidth="0.3" opacity="0.4" />
          {/* dest port */}
          <circle cx="92" cy="12" r="1.6" fill={T.s3} stroke={accent} strokeWidth="0.5" />
        </svg>
        {/* Ship pulse */}
        <motion.div
          initial={{ left: "8%", top: "70%" }}
          animate={{
            left: ["8%", "35%", "58%", "92%"],
            top: ["70%", "40%", "50%", "22%"],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", transform: "translate(-50%,-50%)" }}
        >
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{
                position: "absolute", width: 18, height: 18, borderRadius: "50%",
                background: accent, opacity: 0.3,
              }}
            />
            <Ship size={12} style={{ color: T.text, position: "relative" }} />
          </div>
        </motion.div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1"
          style={{ background: T.s1, border: `1px solid ${T.border}` }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: accent }}
          />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.sub }}>
            ETA 2d 14h
          </span>
        </div>
      </div>
    </DemoShell>
  );
}

// 15. Market data ticker
function Demo_Market({ accent }: { accent: string }) {
  const rows = [
    { s: "WHEAT-US-SRW",  p: "612.25",  d: "+1.8%",  up: true  },
    { s: "SOYB-CBOT",     p: "1,184.50",d: "-0.6%",  up: false },
    { s: "CORN-FRONT",    p: "455.75",  d: "+0.3%",  up: true  },
    { s: "FREIGHT-BDI",   p: "1,840",   d: "+2.4%",  up: true  },
    { s: "PALM-MYR",      p: "4,012",   d: "-1.1%",  up: false },
    { s: "SUGAR-11",      p: "22.14",   d: "+0.9%",  up: true  },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            LIVE · MARKETS
          </span>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: T.green }}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          {rows.map((r, i) => (
            <motion.div
              key={r.s}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ delay: i * 0.08 }}
              className="grid items-center px-3 py-2"
              style={{
                gridTemplateColumns: "1.4fr 1fr 0.7fr",
                background: T.s1, border: `1px solid ${T.border}`,
                gap: 8,
              }}
            >
              <span style={{ fontSize: 10, fontFamily: T.mono, color: T.text, fontWeight: 700 }}>
                {r.s}
              </span>
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                style={{ fontSize: 11, fontFamily: T.mono, color: T.text, textAlign: "right" }}
              >
                {r.p}
              </motion.span>
              <span
                style={{
                  fontSize: 10, fontFamily: T.mono, fontWeight: 700,
                  color: r.up ? T.green : T.red, textAlign: "right",
                }}
              >
                {r.d}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// 16. API access — code block
function Demo_Api({ accent }: { accent: string }) {
  const lines = [
    { t: 'POST', c: '/v1/deals',                  color: accent },
    { t: '',     c: '{',                          color: T.sub },
    { t: '',     c: '  "deal_id": "ODESA-2611",', color: T.text },
    { t: '',     c: '  "commodity": "wheat",',    color: T.text },
    { t: '',     c: '  "counterparty": "cargill",', color: T.text },
    { t: '',     c: '  "quantity_mt": 24500',     color: T.text },
    { t: '',     c: '}',                          color: T.sub },
    { t: '',     c: '',                           color: T.muted },
    { t: '→',    c: '201 Created · deal queued',  color: T.green },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Code2 size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            api.commodityview.com
          </span>
        </div>
        <div style={{
          background: "#05040A", border: `1px solid ${T.border}`,
          padding: 14, flex: 1, fontFamily: T.mono, fontSize: 11, lineHeight: 1.7,
        }}>
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="flex gap-2"
            >
              {l.t && (
                <span style={{ color: l.t === "→" ? T.green : accent, fontWeight: 700, minWidth: 32 }}>
                  {l.t}
                </span>
              )}
              <span style={{ color: l.color }}>{l.c}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// 17. Sanctions screening
function Demo_Sanctions({ accent }: { accent: string }) {
  const names = [
    { n: "Cargill International SA",     ok: true  },
    { n: "Bunge Agribusiness Ltd",       ok: true  },
    { n: "Stroyekspert-Eksim OOO",       ok: false },
    { n: "Olam Intl. Singapore",         ok: true  },
    { n: "Viterra Grain Pte.",           ok: true  },
  ];
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={12} style={{ color: accent }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.muted, letterSpacing: "0.14em" }}>
            OFAC · UN · EU · UK
          </span>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          {names.map((item, i) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ delay: i * 0.14, duration: 0.4 }}
              className="flex items-center gap-3 px-3 py-2"
              style={{
                background: !item.ok ? T.redDim : T.s1,
                border: `1px solid ${!item.ok ? T.redLo : T.border}`,
              }}
            >
              <Search size={10} style={{ color: T.muted }} />
              <span style={{ fontSize: 11, color: T.text, flex: 1 }}>{item.n}</span>
              <span
                style={{
                  fontSize: 9, fontFamily: T.mono, fontWeight: 700, letterSpacing: "0.1em",
                  padding: "2px 7px",
                  background: item.ok ? T.greenDim : T.redDim,
                  border: `1px solid ${item.ok ? T.greenLo : T.redLo}`,
                  color: item.ok ? T.green : T.red,
                }}
              >
                {item.ok ? "CLEAR" : "HIT"}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// 18. Counterparty intel
function Demo_Counterparty({ accent }: { accent: string }) {
  const signals = [
    { k: "Credit rating",   v: "BBB+ · stable",      tone: "good" },
    { k: "Port calls, 90d", v: "47 · trending up",   tone: "good" },
    { k: "Press signals",   v: "2 negative / 14d",   tone: "warn" },
    { k: "Overdue invoices",v: "0 open",             tone: "good" },
  ];
  const toneColor = (t: string) => t === "good" ? T.green : t === "warn" ? accent : T.red;
  return (
    <DemoShell accent={accent}>
      <div className="h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-30%" }}
          className="flex items-center gap-3 mb-3 pb-3"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 36, height: 36, background: `${accent}18`,
              border: `1px solid ${accent}44`,
              fontSize: 11, fontFamily: T.mono, fontWeight: 800, color: accent,
            }}
          >
            CG
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 12, color: T.text, fontWeight: 700 }}>
              Cargill International SA
            </div>
            <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>
              Geneva · since 1865 · ~$165B revenue
            </div>
          </div>
        </motion.div>
        <div className="flex flex-col gap-1.5">
          {signals.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ delay: 0.3 + i * 0.14, duration: 0.4 }}
              className="flex items-center justify-between px-3 py-2"
              style={{ background: T.s1, border: `1px solid ${T.border}` }}
            >
              <span style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>{s.k}</span>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: toneColor(s.tone),
                    boxShadow: `0 0 6px ${toneColor(s.tone)}88`,
                  }}
                />
                <span style={{ fontSize: 11, color: T.text, fontFamily: T.mono }}>
                  {s.v}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

// ─── DEMO MAP ─────────────────────────────────────────────────────────────────
const DEMO_MAP: Record<string, (p: { accent: string }) => React.ReactElement> = {
  "coa-contract": Demo_CoaContract,
  "ai-extract":   Demo_AiExtract,
  "violations":   Demo_Violations,
  "comparison":   Demo_Comparison,
  "pdf-export":   Demo_PdfExport,
  "team":         Demo_Team,
  "lc":           Demo_LC,
  "bl":           Demo_BL,
  "cross-doc":    Demo_CrossDoc,
  "deal-view":    Demo_DealView,
  "audit":        Demo_Audit,
  "email":        Demo_Email,
  "history":      Demo_History,
  "vessel":       Demo_Vessel,
  "market":       Demo_Market,
  "api":          Demo_Api,
  "sanctions":    Demo_Sanctions,
  "counterparty": Demo_Counterparty,
};

// ─── FEATURE SECTION ──────────────────────────────────────────────────────────
function FeatureSection({
  phase, feature, index, flip,
}: {
  phase: Phase; feature: Feature; index: number; flip: boolean;
}) {
  const Demo = DEMO_MAP[feature.id];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  const isLive       = feature.status === "live";
  const isEnterprise = feature.status === "enterprise";
  const StatusIcon   = isLive ? Check : isEnterprise ? Lock : Clock;
  const statusColor  = isLive ? T.green : phase.accent;
  const statusLabel  = isLive ? "Live now" : isEnterprise ? "Enterprise" : "Roadmap";

  return (
    <div ref={ref} className="py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center ${
            flip ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.72, ease: EASE }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: phase.accent,
                background: phase.accentDim, border: `1px solid ${phase.accentLo}`,
                padding: "3px 10px", fontFamily: T.mono,
              }}>
                {String(index + 1).padStart(2, "0")} · {phase.name}
              </span>
              <span
                className="flex items-center gap-1"
                style={{
                  fontSize: 8, fontFamily: T.mono, letterSpacing: "0.14em",
                  color: statusColor, background: `${statusColor}14`,
                  border: `1px solid ${statusColor}33`,
                  padding: "3px 8px", fontWeight: 700, textTransform: "uppercase",
                }}
              >
                <StatusIcon size={8} strokeWidth={3} />
                {statusLabel}
              </span>
            </div>

            <h2 style={{
              fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)", fontWeight: 900,
              letterSpacing: "-0.028em", lineHeight: 1.08,
              color: T.text, marginBottom: "0.9rem",
            }}>
              {feature.label}
            </h2>

            <p style={{
              fontSize: "clamp(0.92rem, 1.4vw, 1rem)", lineHeight: 1.78,
              color: T.sub, maxWidth: "46ch", marginBottom: "1.4rem",
            }}>
              {feature.detail}
            </p>

            {/* accent rule */}
            <div style={{
              width: 48, height: 2, background: phase.accent, marginBottom: "1.4rem",
            }}/>

            <div className="flex items-center gap-2" style={{ fontSize: 10, fontFamily: T.mono, color: T.muted, letterSpacing: "0.1em" }}>
              <span style={{ color: phase.accent, fontWeight: 700 }}>{phase.num.toUpperCase()}</span>
              <span>·</span>
              <span>{phase.mrr}</span>
            </div>
          </motion.div>

          {/* Demo */}
          <motion.div
            initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.82, delay: 0.1, ease: EASE }}
          >
            {Demo ? <Demo accent={phase.accent} /> : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── PHASE HEADER ─────────────────────────────────────────────────────────────
function PhaseHeader({ phase }: { phase: Phase }) {
  return (
    <section className="pt-20 pb-6 lg:pt-24 lg:pb-8">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <motion.div
          {...fadeUp(0)}
          style={{
            padding: "24px 28px",
            background: phase.accentDim,
            border: `1px solid ${phase.accentMid}`,
            position: "relative",
          }}
        >
          <span className="absolute -top-px left-10 right-10 h-px" style={{ background: phase.accent }} />
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span style={{
              fontSize: 8, fontWeight: 700, letterSpacing: "0.2em",
              textTransform: "uppercase", color: phase.accent,
              background: T.bg, border: `1px solid ${phase.accentLo}`,
              padding: "4px 12px", fontFamily: T.mono,
            }}>
              {phase.num}
            </span>
            <span style={{ fontSize: 10, fontFamily: T.mono, color: T.muted, letterSpacing: "0.1em" }}>
              {phase.mrr}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="flex-1">
              <h2 style={{
                fontSize: "clamp(1.8rem, 3.4vw, 2.8rem)", fontWeight: 900,
                letterSpacing: "-0.034em", lineHeight: 1.05,
                color: T.text, marginBottom: "0.6rem",
              }}>
                {phase.name}
              </h2>
              <p style={{
                fontSize: 12, fontWeight: 700, color: phase.accent,
                fontFamily: T.mono, marginBottom: "0.8rem", letterSpacing: "0.02em",
              }}>
                {phase.tagline}
              </p>
              <p style={{
                fontSize: 13, lineHeight: 1.75, color: T.sub, maxWidth: "60ch",
              }}>
                {phase.desc}
              </p>
            </div>

            <Link href={phase.ctaHref} className="lg:ml-8">
              <button
                className="flex items-center overflow-hidden"
                style={{
                  height: 44, paddingLeft: 18, paddingRight: 6,
                  background: phase.accent,
                  transition: "all 0.26s cubic-bezier(0.32,0.72,0,1)",
                  cursor: "pointer",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: T.bg, paddingRight: 14, letterSpacing: "0.04em" }}>
                  {phase.cta}
                </span>
                <span className="flex items-center justify-center"
                  style={{ width: 32, height: 32, background: "rgba(0,0,0,0.15)" }}>
                  <ArrowRight size={12} style={{ color: T.bg }} />
                </span>
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  let globalIndex = 0;

  return (
    <div style={{ background: T.bg, color: T.text, overflowX: "hidden" }}>
      {/* grain */}
      <div className="fixed inset-0 z-50 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.018, mixBlendMode: "overlay",
      }}/>

      {/* ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <div style={{
          position: "absolute", right: "-8%", top: "-5%", width: 700, height: 700,
          background: "radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}/>
        <div style={{
          position: "absolute", left: "-10%", bottom: "30%", width: 500, height: 500,
          background: "radial-gradient(ellipse, rgba(6,182,212,0.03) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}/>
        <div style={{
          position: "absolute", right: "10%", bottom: "10%", width: 400, height: 400,
          background: "radial-gradient(ellipse, rgba(139,92,246,0.03) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}/>
      </div>

      {/* grid */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden style={{
        backgroundImage: [
          "linear-gradient(rgba(255,210,110,0.018) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,210,110,0.018) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "48px 48px",
      }}/>

      <div className="relative z-10">
        {/* HERO */}
        <section className="pt-24 pb-10 lg:pt-32 lg:pb-14">
          <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
            <motion.span {...fadeUp(0)}
              className="mb-5 inline-block"
              style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: T.amber,
                background: T.amberDim, border: `1px solid ${T.amberLo}`,
                padding: "3px 12px", fontFamily: T.mono,
              }}>
              Platform Roadmap · 18 features · scroll to explore
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
                color: T.sub, maxWidth: "56ch", marginBottom: "2.4rem",
              }}>
              Three phases, eighteen features, one platform — each with a live
              mini demo below. Scroll to see how every capability works before you commit.
            </motion.p>

            <motion.div {...fadeUp(0.2)} className="flex items-center gap-6 flex-wrap">
              {[
                { icon: Check, color: T.green,  label: "Live now" },
                { icon: Clock, color: T.amber,  label: "Roadmap" },
                { icon: Lock,  color: T.purple, label: "Enterprise" },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div style={{
                    width: 18, height: 18, background: `${color}18`,
                    border: `1px solid ${color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={9} style={{ color }} strokeWidth={2.5}/>
                  </div>
                  <span style={{ fontSize: 11, color: T.sub, fontFamily: T.mono }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* PHASES + FEATURE DEMOS */}
        {PHASES.map(phase => (
          <div key={phase.id}>
            <PhaseHeader phase={phase} />
            {phase.features.map(feature => {
              const idx = globalIndex++;
              return (
                <FeatureSection
                  key={feature.id}
                  phase={phase}
                  feature={feature}
                  index={idx}
                  flip={idx % 2 === 1}
                />
              );
            })}
          </div>
        ))}

        {/* BOTTOM CTA */}
        <section className="py-24 text-center">
          <div className="mx-auto max-w-[580px] px-5 lg:px-8">
            <motion.span {...fadeUp(0)}
              className="mb-5 inline-block"
              style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.2em",
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
                fontSize: 13, lineHeight: 1.76, color: T.sub,
                maxWidth: "40ch", margin: "0 auto 2.2rem",
              }}>
              Upload a COA and contract, get a COMPLIANT or NON_COMPLIANT verdict with full traceability in under 30 seconds.
            </motion.p>
            <motion.div {...fadeUp(0.2)} className="flex items-center justify-center gap-4">
              <Link href="/deals/new">
                <button
                  className="group flex items-center overflow-hidden"
                  style={{
                    height: 44, paddingLeft: 22, paddingRight: 6,
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
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.bg, paddingRight: 16 }}>
                    Start free analysis
                  </span>
                  <span className="flex items-center justify-center"
                    style={{ width: 32, height: 32, background: "rgba(0,0,0,0.15)" }}>
                    <ArrowRight size={12} style={{ color: T.bg }}/>
                  </span>
                </button>
              </Link>
              <Link href="/pricing">
                <button style={{
                  height: 44, padding: "0 20px",
                  background: "transparent",
                  border: `1px solid ${T.border}`,
                  fontSize: 12, fontWeight: 600, color: T.sub,
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

        {/* FOOTER */}
        <footer className="border-t py-8" style={{ borderColor: T.border }}>
          <div className="mx-auto max-w-[1400px] px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="text-xs font-bold font-mono" style={{ color: T.amber }}>
              ← CommodityView
            </Link>
            <p style={{ fontSize: 10, color: T.muted }}>
              © 2025 CommodityView. Not financial advice.
            </p>
            <div className="flex gap-5">
              {["Pricing", "Docs", "Contact"].map(l => (
                <Link key={l} href={l === "Pricing" ? "/pricing" : "#"}
                  style={{ fontSize: 10, color: T.muted, opacity: 0.55 }}
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
