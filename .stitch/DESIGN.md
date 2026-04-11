# Design System: CommodityView

## 1. Visual Theme & Atmosphere

A high-density, cockpit-dense intelligence terminal for physical commodity traders.
The atmosphere is clinical precision meets financial-grade seriousness — like a Bloomberg
terminal crossed with a modern SaaS product. Deep navy dark mode only. No warmth, no
friendliness — this is a tool people use to protect $50k–$500k shipments.

**Density:** 7 — Financial dashboard density. Every pixel earns its place.
**Variance:** 7 — Offset asymmetric hero. No centered layouts.
**Motion:** 6 — Fluid CSS transitions + spring physics. Not cinematic — purposeful.

Atmosphere words: Clinical. Precise. Authoritative. Terminal. Naval. Signal-driven.

## 2. Color Palette & Roles

- **Abyss Navy** (#0A0F1E) — Primary page background, the void
- **Deep Blue** (#0D1B2E) — Card surfaces, elevated panels
- **Trench Blue** (#111D30) — Secondary surfaces, hover states
- **Steel Border** (#1C2D45) — All structural borders, dividers, grid lines
- **Muted Steel** (#8892A4) — Secondary text, labels, metadata, captions
- **Ice White** (#E8EDF5) — Primary text, headlines, active states
- **Signal Cyan** (#00D4FF) — SINGLE accent. CTAs, links, active indicators, brand. Max 1 use per section.
- **Compliance Green** (#00C896) — PASS verdicts, compliant states only
- **Violation Red** (#FF4757) — FAIL verdicts, NON_COMPLIANT states only

**Banned:** Pure black (#000000). Purple. Neon gradients. Warm grays. Any second accent color.

## 3. Typography Rules

- **Display/Headlines:** Geist — Track-tight (-0.025em), weight 700. Hierarchy through weight/color, not just size. Scale via clamp().
- **Body:** Geist — Relaxed leading (1.6), 65ch max, Muted Steel (#8892A4) secondary.
- **Mono/Data:** JetBrains Mono — ALL data values, timestamps, status badges, numeric outputs, parameter names.
- **Banned:** Inter (banned in premium contexts), Times New Roman, Georgia, any serif font.
- **Scale:** `clamp(2rem, 5.5vw, 3.6rem)` for H1. `clamp(1.1rem, 2.5vw, 1.4rem)` for H2.

## 4. Component Stylings

- **Primary Button:** Signal Cyan (#00D4FF) fill, Abyss Navy text. No radius (sharp). Subtle box-shadow: `0 0 24px rgba(0,212,255,0.25)`. Active: -1px translateY. No outer glow rings.
- **Ghost Button:** Transparent, Steel Border (#1C2D45) border. Hover: Trench Blue (#111D30) fill.
- **Cards:** No radius. Deep Blue (#0D1B2E) background. Steel Border (#1C2D45) border. Tint shadow to background hue only — no drop shadows.
- **Status Badge COMPLIANT:** Compliance Green fill, Abyss Navy text, JetBrains Mono, ALL CAPS.
- **Status Badge NON_COMPLIANT:** Violation Red fill, Abyss Navy text, JetBrains Mono, ALL CAPS.
- **Table rows:** 1px Steel Border dividers. Hover: `rgba(0,212,255,0.03)` tint.
- **Inputs:** Label above. Steel Border (#1C2D45) border. Focus ring: Signal Cyan. No floating labels.
- **Loaders:** Skeletal shimmer matching exact layout dimensions. No circular spinners.

## 5. Layout Principles

- **Hero:** SPLIT SCREEN. Left column: text + CTA (55%). Right column: 3D globe or data visualization (45%). Never centered.
- **Max-width:** 1400px centered with `mx-auto`.
- **Section spacing:** `clamp(5rem, 10vw, 8rem)` vertical gaps.
- **Grid:** CSS Grid over Flexbox. Never `calc()` percentage hacks.
- **Mobile:** Single column collapse below 768px. No horizontal scroll.
- **Feature sections:** 2-column zig-zag or asymmetric grid. Never 3-equal-columns.
- **Pricing:** Top tier (most popular) visually elevated. Others dimmed.
- **Full-height sections:** `min-h-[100dvh]` never `h-screen`.

## 6. Motion & Interaction

- **Spring physics:** `stiffness: 100, damping: 20` — premium weighty feel.
- **Fade-up reveals:** `opacity: 0 → 1, y: 14 → 0`. Duration: 380ms. Ease: `[0.16, 1, 0.3, 1]`.
- **Staggered cascade:** Lists stagger at 70ms intervals. Never mount instantly.
- **Perpetual micro-loops:** Pulse dot on live indicators. Shimmer on loading states. Float on 3D globe.
- **Hardware-accelerated only:** `transform` and `opacity` only. Never animate `top/left/width/height`.
- **Progress bars:** Spring-animated width on viewport entry.

## 7. Anti-Patterns (Banned)

- No emojis anywhere
- No Inter font
- No pure black (#000000)
- No neon/outer glow shadows (subtle box-shadow only)
- No oversaturated accents (Signal Cyan is the only accent, use sparingly)
- No 3-column equal card feature rows
- No centered hero sections — split screen only
- No "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionary" copywriting
- No scroll arrows, bouncing chevrons, "Scroll to explore" filler text
- No fabricated statistics (no "99.98% uptime", no invented check counts)
- No `LABEL // YEAR` formatting  
- No generic placeholder names ("John Doe", "Acme Corp")
- No broken image links — use inline SVG or picsum.photos
- No rounded corners — all elements sharp (0px radius)
- No warm/cool gray fluctuation — Zinc/Slate only
- No second accent color — Signal Cyan (#00D4FF) is the only accent
