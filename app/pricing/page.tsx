"use client";

import Link from "next/link";
import { Fragment } from "react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { ArrowRight, Check, Minus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Design tokens (shared system)
   ───────────────────────────────────────────────────────────────────────────── */
const C = {
  bg:      "#070B14",
  s1:      "#0C1424",
  s2:      "#111E35",
  border:  "rgba(255,255,255,0.06)",
  amber:   "#F59E0B",
  amberXs: "rgba(245,158,11,0.06)",
  amberSm: "rgba(245,158,11,0.12)",
  amberMd: "rgba(245,158,11,0.22)",
  green:   "#10B981",
  greenSm: "rgba(16,185,129,0.12)",
  text:    "#F8FAFC",
  sub:     "#94A3B8",
  muted:   "#4B5563",
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;
function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, delay, ease: EASE },
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Pricing data — from Stitch "Institutional Pricing - Matrix View"
   ───────────────────────────────────────────────────────────────────────────── */
const PLANS = [
  {
    id:       "free",
    name:     "Free",
    price:    { monthly: "$0", annual: "$0" },
    period:   "forever",
    desc:     "Get started — no commitment, no card.",
    cta:      "Sign Up Free",
    ctaHref:  "/deals/new",
    highlight: false,
    badge:    null,
    features: [
      "3 analyses total",
      "1 user",
      "AI extraction (PDF)",
      "COA + Contract check",
      "Violations report",
    ],
  },
  {
    id:       "starter",
    name:     "Starter",
    price:    { monthly: "$49", annual: "$41" },
    period:   "/month",
    desc:     "Solo traders handling day-to-day document compliance.",
    cta:      "Try for Free",
    ctaHref:  "/deals/new",
    highlight: false,
    badge:    null,
    features: [
      "30 analyses / month",
      "1 user",
      "COA + Contract check",
      "Violations panel",
      "PDF export reports",
    ],
  },
  {
    id:       "growth",
    name:     "Growth",
    price:    { monthly: "$199", annual: "$165" },
    period:   "/month",
    desc:     "Operations teams running deals across the full document set.",
    cta:      "Choose Growth",
    ctaHref:  "/deals/new",
    highlight: true,
    badge:    "Most Popular",
    features: [
      "100 analyses / month",
      "3 users + Workspace",
      "LC & BL compliance",
      "Cross-doc validation",
      "Full deal audit log",
      "Role-based access",
    ],
  },
  {
    id:       "professional",
    name:     "Professional",
    price:    { monthly: "$499", annual: "$415" },
    period:   "/month",
    desc:     "Larger desks needing market data and logistics automation.",
    cta:      "Choose Pro",
    ctaHref:  "/deals/new",
    highlight: false,
    badge:    null,
    features: [
      "300 analyses / month",
      "10 users",
      "Email auto-ingestion",
      "Live vessel tracking",
      "Market data layer",
      "Historical analytics",
    ],
  },
  {
    id:       "enterprise",
    name:     "Enterprise",
    price:    { monthly: "Custom", annual: "Custom" },
    period:   "from $1,500 / mo",
    desc:     "Global trading desks with compliance, API, and security needs.",
    cta:      "Contact Sales",
    ctaHref:  "mailto:sales@commodityview.com",
    highlight: false,
    badge:    null,
    features: [
      "Unlimited analyses",
      "20+ users",
      "Full API access",
      "Sanctions screening",
      "Counterparty intel",
      "SOC2 / On-prem deploy",
    ],
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   Comparison table
   ───────────────────────────────────────────────────────────────────────────── */
type Availability = boolean | "add-on";

interface TableRow {
  feature: string;
  tiers: [Availability, Availability, Availability, Availability, Availability];
}

const TABLE_SECTIONS: { title: string; rows: TableRow[] }[] = [
  {
    title: "Usage & Access",
    rows: [
      { feature: "Analyses per month",       tiers: [false, false, false, false, false] }, // handled as text
      { feature: "Seats included",            tiers: [false, false, false, false, false] }, // handled as text
    ],
  },
  {
    title: "Document Intelligence",
    rows: [
      { feature: "COA + Contract check",     tiers: [true,  true,  true,  true,  true ] },
      { feature: "Violations panel",         tiers: [false, true,  true,  true,  true ] },
      { feature: "PDF export reports",       tiers: [false, true,  true,  true,  true ] },
      { feature: "LC + BL compliance",       tiers: [false, false, true,  true,  true ] },
      { feature: "Cross-document validation",tiers: [false, false, true,  true,  true ] },
    ],
  },
  {
    title: "Operations Hub",
    rows: [
      { feature: "Team workspace",           tiers: [false, false, true,  true,  true ] },
      { feature: "Role-based access",        tiers: [false, false, true,  true,  true ] },
      { feature: "Full deal audit log",      tiers: [false, false, true,  true,  true ] },
      { feature: "Email auto-ingestion",     tiers: [false, false, false, true,  true ] },
    ],
  },
  {
    title: "Terminal & Intelligence",
    rows: [
      { feature: "Live vessel tracking",     tiers: [false, false, false, true,  true ] },
      { feature: "Market data layer",        tiers: [false, false, false, true,  true ] },
      { feature: "Historical analytics",     tiers: [false, false, false, true,  true ] },
      { feature: "Sanctions screening",      tiers: [false, false, false, false, true ] },
      { feature: "Counterparty intel",       tiers: [false, false, false, false, true ] },
    ],
  },
  {
    title: "Security & Compliance",
    rows: [
      { feature: "Data encryption at rest",  tiers: [true,  true,  true,  true,  true ] },
      { feature: "SOC2 Type II",             tiers: [false, false, false, false, true ] },
      { feature: "On-premise deployment",    tiers: [false, false, false, false, true ] },
      { feature: "API access",               tiers: [false, false, false, false, true ] },
    ],
  },
];

const USAGE_ROWS: { label: string; values: string[] }[] = [
  { label: "Analyses / month", values: ["3 total", "30",  "100", "300", "Unlimited"] },
  { label: "Seats included",   values: ["1",       "1",   "3",   "10",  "20+"]       },
];

/* ─────────────────────────────────────────────────────────────────────────────
   FAQ
   ───────────────────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How secure is my trade data?",
    a: "CommodityView is SOC2 Type II compliant. All document extractions happen in encrypted VPCs. We never use your private trade data to train public models.",
  },
  {
    q: "Can we upgrade mid-billing cycle?",
    a: "Yes. You can upgrade at any time. Your current month will be pro-rated, and you'll immediately gain access to the higher usage limits and advanced features of your new plan.",
  },
  {
    q: "What document formats are supported?",
    a: "We support PDF, JPEG, PNG, and Excel. Our AI is trained specifically on GAFTA, FOSFA, and standard ISO commodity specifications.",
  },
  {
    q: "Do you offer on-premise deployment?",
    a: "On-premise and Private Cloud deployments are available for Enterprise clients with minimum 2-year commitments.",
  },
  {
    q: "Is there an annual discount?",
    a: "Yes — annual billing saves up to 17% across all paid plans. You can switch between monthly and annual billing at any time.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:`1px solid ${C.border}` }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left text-sm font-semibold transition-colors hover:opacity-80"
        onClick={() => setOpen(!open)}
        style={{ color: C.text }}
      >
        {q}
        <ChevronDown
          size={14}
          className="flex-shrink-0 ml-4 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: C.muted }}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        style={{ overflow:"hidden" }}
      >
        <p className="pb-5 text-sm leading-relaxed" style={{ color: C.sub }}>{a}</p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────────────────────── */
export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ background: C.bg, color: C.text, overflowX:"hidden" }}>

      {/* Grid texture */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage:[
          "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize:"44px 44px",
      }}/>
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div style={{ position:"absolute", right:"-5%", top:"0%", width:"600px", height:"600px",
          background:"radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 65%)", filter:"blur(80px)" }}/>
      </div>

      <div className="relative z-10">

        {/* ═══════════════════════════════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-24 lg:py-32 text-center">
          <div className="mx-auto max-w-[860px] px-5 lg:px-8">
            <motion.span {...fadeUp(0)}
              className="mb-6 inline-block text-[9px] font-bold tracking-[0.2em] uppercase"
              style={{ color: C.amber }}>
              Pricing
            </motion.span>
            <motion.h1 {...fadeUp(0.08)}
              className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-[-0.03em] leading-[1.07] mb-6">
              Plans for every level of ambition
            </motion.h1>
            <motion.p {...fadeUp(0.16)}
              className="text-base lg:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: C.sub }}>
              From solo traders protecting a single shipment to global desk operations automating
              your entire document workflow. Start free, scale when you need it.
            </motion.p>

            {/* Annual toggle */}
            <motion.div {...fadeUp(0.24)} className="inline-flex items-center gap-3">
              <span className="text-sm" style={{ color: annual ? C.muted : C.text }}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className="relative h-6 w-11 rounded-full transition-colors duration-300"
                style={{ background: annual ? C.amber : C.s2, border:`1px solid ${annual ? C.amber : C.border}` }}
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full transition-transform duration-300"
                  style={{
                    background: annual ? C.bg : C.muted,
                    transform: annual ? "translateX(20px)" : "translateX(2px)",
                  }}
                />
              </button>
              <span className="text-sm" style={{ color: annual ? C.text : C.muted }}>
                Annual
                <span
                  className="ml-2 px-1.5 py-0.5 text-[9px] font-bold tracking-wider"
                  style={{ background: C.amberSm, color: C.amber }}>
                  SAVE 17%
                </span>
              </span>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            PLAN CARDS
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="pb-20">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  {...fadeUp(i * 0.07)}
                  className="relative flex flex-col p-7"
                  style={{
                    background: plan.highlight ? C.amberXs : C.s1,
                    border: `1px solid ${plan.highlight ? C.amberMd : C.border}`,
                  }}
                >
                  {/* Top amber line for highlighted plan */}
                  {plan.highlight && (
                    <span className="absolute -top-px left-6 right-6 h-px" style={{ background: C.amber }}/>
                  )}
                  {/* Badge */}
                  {plan.badge && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[8px] font-black tracking-[0.16em] uppercase whitespace-nowrap"
                      style={{ background: C.amber, color: C.bg }}>
                      {plan.badge}
                    </span>
                  )}

                  <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-3"
                    style={{ color: plan.highlight ? C.amber : C.muted }}>
                    {plan.name}
                  </p>

                  <div className="mb-1">
                    <span className="text-3xl font-black tracking-tight">
                      {annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    {plan.price.monthly !== "Custom" && (
                      <span className="text-xs ml-1.5" style={{ color: C.muted }}>
                        {annual ? "/mo, billed annually" : plan.period}
                      </span>
                    )}
                    {plan.price.monthly === "Custom" && (
                      <span className="text-xs ml-1.5 block mt-1" style={{ color: C.muted }}>
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed mb-6 mt-2" style={{ color: C.sub }}>
                    {plan.desc}
                  </p>

                  <ul className="flex-1 space-y-2.5 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-xs" style={{ color: C.sub }}>
                        <Check size={11} className="flex-shrink-0 mt-0.5"
                          style={{ color: plan.highlight ? C.amber : C.green }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.ctaHref}>
                    <button
                      className="w-full h-10 text-xs font-bold tracking-wide uppercase transition-opacity hover:opacity-80"
                      style={plan.highlight
                        ? { background: C.amber, color: C.bg }
                        : { background:"transparent", border:`1px solid ${C.border}`, color: C.text }
                      }
                    >
                      {plan.cta}
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            COMPARISON TABLE
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 border-t" style={{ borderColor: C.border }}>
          <div className="mx-auto max-w-[1400px] px-5 lg:px-8">

            <motion.h2 {...fadeUp(0)}
              className="text-2xl lg:text-3xl font-black tracking-tight mb-12 text-center">
              Full feature comparison
            </motion.h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]" style={{ borderCollapse:"separate", borderSpacing:0 }}>
                {/* Header */}
                <thead>
                  <tr>
                    <th className="text-left pb-5 pr-6 text-xs font-bold" style={{ color: C.muted, width:"35%" }}>
                      Feature
                    </th>
                    {PLANS.map(p => (
                      <th key={p.id} className="pb-5 text-center text-xs font-bold"
                        style={{ color: p.highlight ? C.amber : C.sub }}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Usage rows */}
                  <tr>
                    <td colSpan={6} className="pt-6 pb-2">
                      <span className="text-[9px] font-bold tracking-[0.16em] uppercase" style={{ color: C.amber }}>
                        Usage & Access
                      </span>
                    </td>
                  </tr>
                  {USAGE_ROWS.map(row => (
                    <tr key={row.label} style={{ borderTop:`1px solid ${C.border}` }}>
                      <td className="py-3 pr-6 text-xs" style={{ color: C.sub }}>{row.label}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="py-3 text-center text-xs font-mono font-semibold"
                          style={{ color: PLANS[i].highlight ? C.amber : C.text }}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Feature sections */}
                  {TABLE_SECTIONS.slice(1).map(section => (
                    <Fragment key={section.title}>
                      <tr>
                        <td colSpan={6} className="pt-8 pb-2">
                          <span className="text-[9px] font-bold tracking-[0.16em] uppercase" style={{ color: C.amber }}>
                            {section.title}
                          </span>
                        </td>
                      </tr>
                      {section.rows.map(row => (
                        <tr key={row.feature} style={{ borderTop:`1px solid ${C.border}` }}>
                          <td className="py-3 pr-6 text-xs" style={{ color: C.sub }}>{row.feature}</td>
                          {row.tiers.map((has, i) => (
                            <td key={i} className="py-3 text-center">
                              {has
                                ? <Check size={13} className="mx-auto" style={{ color: PLANS[i].highlight ? C.amber : C.green }}/>
                                : <Minus size={13} className="mx-auto" style={{ color: C.muted, opacity: 0.4 }}/>
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FAQ
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 border-t" style={{ borderColor: C.border }}>
          <div className="mx-auto max-w-[720px] px-5 lg:px-8">
            <motion.h2 {...fadeUp(0)}
              className="text-2xl lg:text-3xl font-black tracking-tight mb-12 text-center">
              Frequently asked questions
            </motion.h2>
            <div>
              {FAQS.map((faq, i) => (
                <motion.div key={i} {...fadeUp(i * 0.06)}>
                  <FAQItem q={faq.q} a={faq.a} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            BOTTOM CTA
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-24 border-t text-center" style={{ borderColor: C.border, background: C.s1 }}>
          <div className="mx-auto max-w-[640px] px-5 lg:px-8">
            <motion.p {...fadeUp(0)}
              className="text-[9px] font-bold tracking-[0.2em] uppercase mb-5"
              style={{ color: C.amber }}>
              Trusted by traders following GAFTA/FOSFA standards globally
            </motion.p>
            <motion.h2 {...fadeUp(0.08)}
              className="text-3xl lg:text-4xl font-black tracking-[-0.025em] mb-6">
              Secure your shipments.<br />Automate your ops.
            </motion.h2>
            <motion.p {...fadeUp(0.16)} className="text-sm mb-10" style={{ color: C.sub }}>
              The intelligence platform for physical commodity traders.
            </motion.p>
            <motion.div {...fadeUp(0.24)} className="flex items-center justify-center gap-4">
              <Link href="/deals/new">
                <button
                  className="h-11 px-7 text-sm font-bold transition-opacity hover:opacity-80"
                  style={{ background: C.amber, color: C.bg }}>
                  <span className="flex items-center gap-2">
                    Start Free <ArrowRight size={13}/>
                  </span>
                </button>
              </Link>
              <a href="mailto:sales@commodityview.com"
                className="h-11 px-6 text-sm font-medium flex items-center transition-opacity hover:opacity-80"
                style={{ color: C.sub }}>
                Talk to Sales
              </a>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8" style={{ borderColor: C.border }}>
          <div className="mx-auto max-w-[1400px] px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="text-xs font-bold font-mono" style={{ color: C.amber }}>
              ← CommodityView
            </Link>
            <p className="text-[10px]" style={{ color: C.muted }}>
              © 2025 CommodityView. Not financial advice.
            </p>
            <div className="flex gap-5">
              {["Terms","Privacy","Contact"].map(l => (
                <a key={l} href="#" className="text-[10px] opacity-50 hover:opacity-80 transition-opacity" style={{ color: C.muted }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
