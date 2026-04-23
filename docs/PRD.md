# CommodityOps
## Product Requirements Document
**Version 3.0 | April 2026 | Confidential**

---

## What Is CommodityOps

CommodityOps is the operations platform for physical commodity trading firms.

Physical commodity trading — oil, grains, metals, soft commodities — runs on documents. Every shipment requires a Certificate of Analysis, a contract, a Letter of Credit, and a Bill of Lading. One mismatch across these four documents costs $50k–$500k in rejected payments, renegotiations, or cargo disputes. Ops teams catch these manually, in spreadsheets and email threads, for every shipment, every day.

CommodityOps automates that workflow. AI reads the documents. A deterministic rule engine makes the compliance verdict. Humans make the final call — with full traceability, full audit trail, and full context.

Beyond compliance: vessel tracking, market intelligence, counterparty screening, and historical analytics — surfaced inside every active deal, where decisions actually happen.

**One sentence:** CommodityOps is where physical trades are managed.

---

## The Problem

Every physical commodity shipment involves:
- A Certificate of Analysis (COA) — certifies quality of the cargo
- A contract — defines the quality specs, quantity, price, and terms
- A Letter of Credit (LC) — the bank's payment guarantee
- A Bill of Lading (BL) — the shipping document proving cargo was loaded

These four documents must agree with each other and with the contract. When they don't, firms lose money. When they do agree, payment is released.

Right now, ops teams check this manually. One person opens four PDFs, reads dozens of parameters, cross-references a spreadsheet, and flags issues by email. It takes 2-4 hours per shipment. It has no audit trail. It fails when someone is tired, rushed, or simply misreads 13.5% as 15.3%.

CommodityOps replaces this entirely.

---

## The Market

**Competitors:**
- ClearDox — document intelligence for large global enterprises. $50k+/year. 5-week implementation. No self-serve.
- CommodityAI (YC W24) — autonomous agents for commodity operations. Enterprise sales. US-focused.

**The gap:** No self-serve, affordable, modern platform exists for the thousands of mid-size physical commodity trading firms worldwide. No pricing page. No immediate onboarding. No monthly subscription model.

**CommodityOps fills that gap.** Sign up, upload a document, get a result in 30 seconds. No sales call. No implementation project.

**Two structural moats:**
1. Self-serve distribution — CommodityAI and ClearDox cannot go self-serve without destroying their enterprise sales motion
2. Human-in-the-loop compliance — AI extracts, humans decide. Every verdict is deterministic, traceable, and signed off by a person. For $500k decisions, this is not optional.

**Third moat (compounds over time):** Every deal run through CommodityOps stores structured data. After 12 months across hundreds of firms, the platform knows which suppliers fail which parameters most often, which trade lanes have the most disputes, which LC clauses get rejected most by which banks. That intelligence cannot be replicated by a new competitor.

---

## Target Users

| Persona | Daily Pain | What They Win |
|---|---|---|
| Ops Manager | 2–4 hours checking documents per shipment manually | PASS/FAIL in 30 seconds with full source traceability |
| Trader | Waiting for ops to finish before confirming deals | Real-time deal status without asking anyone |
| CFO / Risk | No audit trail, no proof of process for regulators | One-click compliance report and full audit log |

**Entry segment:** Physical commodity trading firms, 10–200 employees. Self-serve. No sales call required.

**Expansion path:** Larger firms via direct relationships and enterprise contracts after Phase 2 traction.

**Entry motion:** One ops manager signs up, tests it on a real shipment, proves value internally, brings the team in Phase 2.

---

## Product — Three Phases

### Phase 1 — Document Intelligence
**The wedge. The necessity.**

Every physical trade requires document compliance checks. This is not optional — it happens manually at every firm, every day. CommodityOps automates it.

**What it does:**
- Accepts COA and contract PDFs — any format, no templates, no setup
- Claude API extracts every quality parameter from both documents
- Deterministic rule engine compares extracted values against contract specs
- Returns COMPLIANT or NON_COMPLIANT verdict with violations panel, comparison table, and source traceability
- Exports audit-ready PDF report

**Why it works:**
- AI handles the reading — any PDF format, any certificate issuer (SGS, Intertek, Cotecna, private labs)
- Code handles the verdict — same input always produces same output, no hallucinations in compliance
- Users can override any extracted value — full human control maintained

**Pricing:**
| Plan | Price | Limit |
|---|---|---|
| Free | $0 | 2 analyses lifetime |
| Pro | $149/month | 50 analyses/month |

---

### Phase 2 — Ops Hub
**The moat begins. Switching costs start.**

Expands compliance to the full shipment document package. Adds team workspace so the entire commercial team — ops, trader, CFO — sees the same deal status without email chains.

**What it adds:**
- Letter of Credit compliance checks — UCP 600 validation, catch LC discrepancies before bank submission
- Bill of Lading checks — port, date, quantity vs contract, caught before loading
- Cross-document validation — every document checked against every other, not just COA vs contract
- Full shipment view — one screen, every document status, green means pay, red means stop
- Team workspace — ops, trader, CFO see the same deal in real time
- Audit log per deal — who approved what and when, one click for CFO or regulator

**Why firms upgrade:**
One LC rejection costs more than 2 years of Team subscription. Cross-document validation catches the conflicts that manual checking misses. Team workspace eliminates the email thread that slows every deal.

**Pricing:**
| Plan | Price | Limit |
|---|---|---|
| Team | $349/month | Unlimited analyses |
| Business | $699/month | Unlimited analyses + Phase 3 features |

---

### Phase 3 — Terminal
**The lock-in. The intelligence layer.**

Documents arrive automatically. Market context surfaces inside every active deal. Historical patterns reveal which suppliers and trade lanes carry the most risk. The platform becomes infrastructure — switching away means losing everything.

**What it adds:**
- Email ingestion — documents routed automatically via n8n, ops wakes up to an action list not an inbox
- Vessel tracking — live position and ETA per deal via MarineTraffic embed
- Market and freight data — current prices and freight rates in context of each active deal
- Historical analytics — failure patterns by supplier, commodity, and origin. Intelligence that compounds with every deal run
- Counterparty intelligence — news, risk signals, financial health on trading partners
- Sanctions screening — OFAC, UN, EU blacklist checks before payment moves

**Enterprise adds:**
- API access for CTRM/ERP integration — their system pushes deals in automatically
- Custom onboarding

**Pricing:**
| Plan | Price | Features |
|---|---|---|
| Business | $699/month | Full Phase 2 + all Phase 3 features |
| Enterprise | $2,000+/month | Business + API access + custom onboarding |

---

## Pages

### Phase 1

**/home**
Split hero: left side — headline "WHERE PHYSICAL TRADES ARE MANAGED", subheadline "One Platform. Every Deal. Every Decision.", subtext "Upload your trade documents. Get a compliance verdict in 30 seconds. Then manage deals, track shipments, and act on market and counterparty intelligence without switching tabs.", primary CTA "SEE AN EXAMPLE DEAL", secondary CTA "BROWSE EXAMPLE DEALS". Right side: animated globe with live trade routes between Rotterdam, Singapore, Dubai, Houston, Santos, Shanghai (Spline). Below fold: stats row (30s / 4 doc types / $149), phase roadmap cards (The Wedge / The Moat / The Infrastructure), mechanics section (Upload. Compare. Decide. + terminal output demo), CTA ("Your first analysis is on us. The next mismatch won't be."). TradingView-style ticker at top. TradingView-style footer.
Internal note: Home page shows full product vision across all phases. Pricing section shows Free + Pro only.

**/products**
Hero: "From Compliance to Intelligence. Get the Deal Done." All features across all phases listed with live mini-demos for Phase 1, roadmap badges for Phase 2 and 3. Status legend: Live / Roadmap / Enterprise. Bottom CTA: "2 free analyses. No card, no setup."

**/pricing**
Hero: "$0 to start. See an example deal. Run your first check free." Plan cards: Free, Pro, Team, Business, Enterprise. Feature comparison matrix below cards. FAQ section. CTA: "First analysis on us. The next mismatch won't be."
Plans shown: Free + Pro (AVAILABLE). Team + Business (SOON). Enterprise (SOON).

**/deals**
Full width table: Deal Name | Commodity | Buyer | Status | Last Updated | Actions. Search bar. Status filter. New Deal button top right. Empty state: "No deals yet. Create your first deal →". Pagination over 20 deals.

**/deals/new**
Form: Deal Name*, Buyer*, Origin*, Commodity* (free text), Quantity*, Delivery Month (optional). COA upload zone + Contract upload zone side by side. Save Draft + Run Analysis buttons. Run Analysis disabled until both PDFs uploaded and required fields filled. No commodity dropdown — free text input only.

**/deals/[id]**
Status badge header (COMPLIANT / NON_COMPLIANT / PENDING). PENDING: loading spinner "Extracting documents...". Failed: error message + retry. Complete: violations panel first (parameter | COA value | spec | reason), comparison table (Parameter | COA Value | Spec | Result), traceability footer (source document per value), Export PDF button.

**/demo**
Permanent public showcase deal. Pre-populated NON_COMPLIANT Brazilian soybean example. Full analysis visible without auth. Identical layout to /deals/[id]. Public, no auth required. No back button to /deals.

### Phase 2

**/org**
Org name header + plan badge. Member list: Name | Email | Role | Last Active. Usage bar. Invite Member button.

**/org/invite**
Email input. Role selector (Admin / Member). Send Invite button.

**/deals/[id]** (updated)
Same as Phase 1 plus document tabs (COA | Contract | LC | BL). LC compliance section. BL compliance section. Cross-document conflicts panel. Audit button top right.

**/deals/[id]/documents**
All uploaded documents per deal. Each row: type | filename | upload date | extraction status | replace | remove. Upload zones for missing documents.

**/deals/[id]/audit**
Chronological log: timestamp | user | action | result. Filterable. Export CSV.

### Phase 3

**/terminal**
Dense dashboard of all active deals. Each row: Deal Name | Commodity | Buyer | Doc Status | Vessel ETA | Market Price | Flags. Sticky filter header. Market data ticker strip at top. Alert banner for critical flags.

**/analytics**
Failure patterns across all historical deals. Charts: top failing parameters, failure rate by supplier, by commodity, by origin. Filter by date range and commodity. Export CSV.

**/deals/[id]** (updated)
Same as Phase 2 plus vessel tracking section (MarineTraffic embed, live ETA) and market intelligence section (contract price vs current price, freight context, Claude-generated natural language summary). Counterparty screening result.

**/settings/integrations**
API key management. CTRM/ERP webhook URL. Email ingestion n8n webhook URL. Connected integrations with status badges.

---

## API

### Phase 1
```
POST /api/analyze
  Input:   FormData (COA PDF + Contract PDF + deal metadata)
  Validate: both PDFs present, PDF type, under 20MB, required fields filled
  Process: base64 → Claude extracts COA → Claude extracts Contract → rule engine → store
  Success: { status, violations, checks, extractedCOA, extractedContract }
  Error:   { error: "extraction_failed" | "file_too_large" | "invalid_file_type" | "missing_fields" }

GET  /api/deals
  Output: { deals: [{ id, title, buyer, commodity, status, updatedAt }] }

GET  /api/deals/[id]
  Output: { deal, latestAnalysis: { status, violations, checks } | null }

POST /api/deals
  Input:  { title, buyer, origin, commodity, quantity, deliveryMonth? }
  Output: { dealId }

PATCH /api/deals/[id]
  Input:  partial deal fields
  Output: { success }
```

### Phase 2
```
POST /api/analyze/lc
  Input:   FormData (LC PDF + dealId)
  Process: extract UCP 600 fields → compliance checks → store
  Output:  { status, violations, extractedLC }

POST /api/analyze/bl
  Input:   FormData (BL PDF + dealId)
  Process: extract port/date/quantity → cross-checks → store
  Output:  { status, violations, extractedBL }

POST /api/analyze/cross
  Input:   { dealId }
  Process: fetch all extracted docs → cross-document rules → store
  Output:  { status, conflicts, checks }

GET  /api/deals/[id]/audit
  Output: { entries: [{ timestamp, userId, action, result }] }

POST /api/org/invite
  Input:   { email, role }
  Output:  { success, inviteId }
```

### Phase 3
```
GET  /api/vessel/[dealId]
  Output:  { vesselName, lat, lng, eta, speed, destination }

GET  /api/market
  Input:   { commodity, unit }
  Output:  { commodity, price, currency, unit, updatedAt }

GET  /api/analytics
  Input:   { orgId, dateFrom, dateTo, commodity? }
  Output:  { topFailingParams, failureBySupplier, failureByCommodity, failureByOrigin }

POST /api/ingest/email
  Input:   n8n webhook payload with parsed email attachments
  Output:  { dealId, documentType, analysisTriggered }

POST /api/screen/[dealId]
  Input:   { dealId }
  Output:  { sanctionsResult, riskSignals, news }
```

---

## Data Model

```typescript
deals: {
  id, orgId, title, buyer, origin, commodity,
  quantity, deliveryMonth?, contractPrice?, currency?,
  vesselName?, vesselIMO?, status, userId, createdAt
}

documents: {
  id, dealId, type (COA | CONTRACT | LC | BL),
  filename, storageKey, extractedData, uploadedAt
}

analysisRuns: {
  id, dealId, status, checks, violations,
  executedAt, engineVersion
}

auditLog: {
  id, orgId, dealId, userId, action, result, timestamp
}
```

---

## AI Architecture

Claude API handles document understanding only. Never compliance decisions.

```
PDF → Claude API → structured JSON extraction
JSON → deterministic TypeScript rule engine → PASS / FAIL
Numbers → deterministic TypeScript math → price exposure calculation
Numbers + context → Claude API → natural language summary
```

- Same input always produces same output
- Users can override any extracted value before analysis runs
- Low-confidence extractions flagged for manual review
- No customer documents used for model training
- Claude API training opt-out enforced at account level

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| UI | Tailwind + shadcn/ui + Motion |
| Auth + Billing | Clerk + Clerk Billing (Stripe) |
| Database | Convex |
| Storage | Vercel Blob → Cloudflare R2 |
| AI Extraction | Claude API (claude-sonnet-4-20250514) |
| 3D Hero | Spline (@splinetool/react-spline) |
| Email Ingestion | n8n (Phase 3) |
| Deploy | Vercel |

**Claude Code skills:** Superpowers → Self-Healing → Frontend Design → UI UX Pro Max → Webapp Testing

**Design:** Stitch MCP (design system) + 21dev MagicUI MCP (components)

**Marketing (post-launch):** Pomelli + Remotion + NotebookLM

---

## Security

**Phase 1:** Clerk auth. Claude API server-side only. Vercel Blob private. HTTPS only.

**Phase 2+:** Convex row-level security per org. R2 private buckets with signed URLs (15-min expiry). Full audit log. No document data used for training. GDPR compliant for EU firms.

---

## Go-To-Market

**Launch — content to inbound:**
- Pomelli → auto-generate LinkedIn posts 3x/week from product website
- Remotion → short product demo videos posted weekly
- NotebookLM → turn industry reports into expert content
- LinkedIn engagement — comment first, message second

**After $3k MRR:**
- LinkedIn ads by job title (Trade Operations, Commodity Trader)
- Inspection company partnerships — SGS, Bureau Veritas, Cotecna
- Industry events — Geneva Trading Week, STSA, Commodities Week London

**After $10k MRR:**
- API partnerships with CTRMs
- Referral program for ops managers

---

## Success Metrics

| Metric | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|
| MRR | $0 → $3k | $3k → $10k | $10k+ |
| Paying firms | 0 → 20 | 20 → 50 | 50+ |
| Time to result | < 30s | < 15s | < 10s |
| Extraction accuracy | > 90% | > 95% | > 98% |

**Path to exit:** $15–20k MRR → $1M–$1.2M acquisition at 5x ARR on Acquire.com

---

## Build Order

```
✓ CLAUDE.md in project root
✓ PRD.md in /docs
✓ Skills in /skills
✓ MCPs: Stitch + 21dev configured in Antigravity
✓ .env.local with all keys

1. Backend    — Real Claude API extraction. Real rule engine. Zero mock data.
2. Design     — Stitch generates full design system for all phases.
3. UI         — Claude Code builds Phase 1 UI from Stitch screens.
4. Spline     — 3D globe with trade routes. Embed in home hero.
5. Billing    — Clerk Billing. Free + Pro plans live.
6. Deploy     — Vercel. commodityops.com live.
7. Validate   — Show 3 real ops managers. Do not build Phase 2 before this.
8. Marketing  — Pomelli + Remotion + NotebookLM. Not before Step 7.
```

---

## Internal Notes (not for external sharing)

- Target users section is context only — never render in UI components
- Positioning notes about competitors are internal only — never show in product
- MRR targets are internal milestones — never show in product UI
- Historical analytics is the third moat — builds with every deal run
- Market data API costs are real — build only when customers ask for it specifically
- Vessel tracking via MarineTraffic embed — zero API cost
- Sanctions screening via OpenSanctions — free public API to start

---

*CommodityOps PRD v3.0 | April 2026 | Where physical trades are managed.*
