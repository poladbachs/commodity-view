# CommodityOps
## Product Requirements Document
**Version 4.0 | April 2026 | Confidential**

---

## What Is CommodityOps

CommodityOps is the operations platform for physical commodity trading firms.

Physical commodity trading is the buying, selling, and movement of real goods — oil, grain, metals, soft commodities — across the world. Every trade involves a chain of documents, counterparties, vessels, banks, and inspectors. The ops team at a trading firm is the function that manages all of it: checking documents, coordinating shipments, ensuring payment is released correctly, and keeping the desk informed.

CommodityOps is where that work happens. Not in email. Not in spreadsheets. Here.

---

## The Problem — Full Lifecycle

A physical commodity trade moves through three critical checkpoints before money changes hands:

**Pre-shipment:** The Certificate of Analysis (COA) arrives from the inspection company. It shows the quality of the cargo — moisture, protein, oil content, contamination levels. The ops manager must check every parameter against the contract specs. One violation — moisture at 14.2% against a contract maximum of 14.0% — means the cargo fails. That failure, if missed, costs $50k–$500k in renegotiation, rejection, or cargo disputes.

**Loading:** The Letter of Credit (LC) arrives from the bank. The Bill of Lading (BL) arrives from the shipping agent. The ops manager must check both against the contract and against each other. Wrong port name on the BL, expired LC presentation deadline, missing document requirement in clause 46A — any one of these gets the LC rejected by the bank. Each rejection costs bank fees, delays payment by weeks, and strains counterparty relationships.

**Arrival:** The cargo arrives. Inspection report vs COA vs contract. Did what arrived match what was certified? If not, who pays for the shortfall?

At every checkpoint, the ops team is doing this manually. Opening PDFs. Cross-referencing spreadsheets. Flagging issues by email. 2–4 hours per shipment. No audit trail. No visibility for the trader or CFO. No intelligence on patterns across deals.

CommodityOps automates every checkpoint and layers intelligence on top of every deal.

---

## The Market

CommodityAI (YC W24, San Francisco) is building autonomous agents for commodity operations — agents that read documents, update systems, and execute workflows with minimal human involvement. They are proving the market is real and the pain is severe. Their customers manage thousands of shipments per month and spend 70% of their ops team's time on administrative work.

CommodityOps is not trying to be CommodityAI.

CommodityAI sells to large commodity enterprises through enterprise sales cycles. They build autonomous agents that replace human decision-making in operational workflows. Their model requires trust in AI making consequential decisions autonomously.

CommodityOps is self-serve, affordable, and built on a different philosophy: AI reads, humans decide. Every compliance verdict is deterministic, traceable, and requires human sign-off. For a trading firm making $500k decisions on every shipment, this is not a limitation — it is a legal and operational requirement. Banks, regulators, and counterparties require a human accountability chain. CommodityAI's autonomous model struggles to satisfy that requirement in compliance-critical workflows.

The gap CommodityOps fills: thousands of mid-size physical commodity trading firms worldwide — 10 to 200 employees, trading actively, operating manually — who cannot afford CommodityAI's enterprise model and will never get a sales call from them. These firms need self-serve access to the same intelligence layer, at a price that makes sense for their scale, live in minutes.

---

## Three Moats

**Moat 1 — Self-serve distribution**

CommodityAI sells through enterprise sales. They cannot go self-serve without destroying their sales motion and repricing their entire business. CommodityOps is self-serve by design. Any ops manager at any trading firm anywhere in the world signs up, pays $149/month, and gets a compliance result on their first real document in under 30 seconds. No sales call. No implementation project. No procurement process. This distribution advantage is structural — CommodityAI cannot copy it.

**Moat 2 — Human-in-the-loop compliance philosophy**

CommodityAI positions AI as the operator — autonomous agents doing the work. CommodityOps positions AI as the reader — Claude extracts, code decides, humans approve. The compliance verdict is always deterministic TypeScript logic, never an AI opinion. Every value is traceable to its source document. Every decision is logged with a human timestamp.

This is not a technical limitation. It is a deliberate product philosophy. In physical commodity trading, compliance decisions carry legal weight. A CFO signing off on a payment needs to point to a human-reviewed document chain — not an AI agent's conclusion. CommodityOps is built for that requirement. CommodityAI is not.

**Moat 3 — Proprietary data that compounds**

Every deal run through CommodityOps stores structured data: which supplier, which commodity, which parameter failed, which origin, which trade lane. After 12 months across hundreds of firms, CommodityOps knows things no competitor can access without replicating the entire user base:

- Brazilian soybean suppliers fail moisture specs 34% of the time in Q3
- LC rejections cluster around specific UCP 600 clause types
- Certain origins have systematic gaps between certified and actual quality

This intelligence surfaces in Phase 3 as historical analytics — telling firms which suppliers carry the most risk, which trade lanes are most dispute-prone, which parameters to negotiate harder in future contracts. A competitor starting today cannot replicate 12 months of structured commodity trade data. This moat builds silently with every deal and becomes more valuable the longer a firm uses the platform.

---

## Product — Three Phases

### Phase 1 — Document Intelligence
**The wedge. Automates the pre-shipment checkpoint.**

Ops manager uploads COA and contract. Claude API extracts every quality parameter from both documents — any PDF format, any certificate issuer, no templates, no setup. A deterministic rule engine compares every extracted value against contract specs. COMPLIANT or NON_COMPLIANT verdict in under 30 seconds with full source traceability. Audit-ready PDF export.

This is not a nice to have. Every physical trade requires this check. It happens manually at every firm, every day. CommodityOps replaces the manual process with something faster, more accurate, and fully traceable.

**Pricing:**
| Plan | Price | Limit |
|---|---|---|
| Free | $0 | 2 analyses lifetime |
| Pro | $149/month | 50 analyses/month |

---

### Phase 2 — Ops Hub
**The moat begins. Automates loading checkpoint. Creates switching costs.**

Expands to the full shipment document package. LC compliance checks catch discrepancies before bank submission. BL checks catch port, date, and quantity mismatches before loading. Cross-document validation checks all four documents against each other simultaneously — finding the conflicts that manual checking always misses because nobody reads four PDFs side by side.

Team workspace brings the entire commercial team — ops, trader, CFO — onto the same deal view. No more email chains. Trader sees compliance status in real time. CFO has audit log on demand.

Every deal now stores a complete structured record: who checked what, when, what the result was, what was overridden, who approved. This is where Moat 3 starts building.

**Pricing:**
| Plan | Price | Limit |
|---|---|---|
| Team | $349/month | Unlimited analyses |
| Business | $699/month | Unlimited analyses + Phase 3 features |

---

### Phase 3 — Terminal
**The lock-in. Automates arrival checkpoint. Surfaces intelligence.**

Documents arrive automatically via email ingestion — suppliers email COAs, banks send LCs, shipping agents drop BLs. The system classifies each document, matches it to the correct deal, and runs the analysis. The ops team wakes up to an action list, not an inbox.

Vessel tracking shows live cargo position and ETA per deal. Market data surfaces current prices and freight rates in context of each active deal — not raw numbers, but intelligence: "Your cargo locked at $380/MT, current market is $420/MT, you are $2M in the money on this deal." Claude generates the natural language summary. The math is always deterministic code.

Historical analytics surface failure patterns across all deals — which supplier fails most, which commodity has the worst quality consistency, which trade lane carries the most dispute risk. This is Moat 3 fully materialised. The longer a firm uses CommodityOps, the smarter these patterns become. Switching away means losing this institutional intelligence entirely.

Counterparty intelligence and sanctions screening are checked on every new counterparty — OFAC, UN, EU blacklists via OpenSanctions, plus news and risk signals via Claude web search. Enterprise firms get API access for CTRM/ERP integration — their system pushes deals in automatically.

**Pricing:**
| Plan | Price | Features |
|---|---|---|
| Business | $699/month | Full Phase 2 + all Phase 3 features |
| Enterprise | $2,000+/month | Business + API access + custom onboarding |

---

## Pages

### Phase 1

**/home**
Content: Full product vision across all three phases — not Phase 1 only. Headline: "WHERE PHYSICAL TRADES ARE MANAGED". Subheadline: "One Platform. Every Deal. Every Decision." Subtext: "Upload your trade documents. Get a compliance verdict in 30 seconds. Then manage deals, track shipments, and act on market and counterparty intelligence without switching tabs." Primary CTA: "SEE AN EXAMPLE DEAL". Secondary CTA: "BROWSE EXAMPLE DEALS". Stats row: 30s / 4 doc types / $149. Phase roadmap cards: The Wedge / The Moat / The Infrastructure. Mechanics section: Upload. Compare. Decide. with terminal output demo. CTA: "Your first analysis is on us. The next mismatch won't be." TradingView-style ticker at top. TradingView-style footer. Pricing section shows Free + Pro only — not Phase 2 or 3 pricing.
Layout: Animated globe with live trade routes as hero background (Spline). Centered hero text. Full-width sections below.
Internal: Never render competitor names, MRR targets, or moat descriptions in any UI component.

**/products**
Content: "From Compliance to Intelligence. Get the Deal Done." All features across all three phases with live mini-demos for Phase 1 features, roadmap badges for Phase 2 and 3. Status legend: Live / Roadmap / Enterprise. Bottom CTA: "2 free analyses. No card, no setup."

**/pricing**
Content: "$0 to start. See an example deal. Run your first check free." Five plan cards: Free, Pro, Team, Business, Enterprise. Feature comparison matrix. FAQ section. Bottom CTA: "First analysis on us. The next mismatch won't be."
Free + Pro: AVAILABLE. Team + Business + Enterprise: SOON.

**/deals**
Table: Deal Name | Commodity | Buyer | Status | Last Updated | Actions. Search bar. Status filter. New Deal button top right. Empty state: "No deals yet. Create your first deal →". Pagination over 20 deals.

**/deals/new**
Form: Deal Name*, Buyer*, Origin*, Commodity* (free text input, not dropdown), Quantity*, Delivery Month (optional). COA upload zone + Contract upload zone side by side. Save Draft + Run Analysis buttons. Run Analysis disabled until both PDFs uploaded and required fields filled.

**/deals/[id]**
Status badge header (COMPLIANT / NON_COMPLIANT / PENDING). PENDING: "Extracting documents..." spinner. Failed: error + retry. Complete: violations panel first (parameter | COA value | spec | reason), comparison table (Parameter | COA Value | Spec | Result), traceability footer (source document per value), Export PDF button.

**/demo**
Permanent public showcase. Pre-populated NON_COMPLIANT Brazilian soybean deal. Full analysis visible without auth. Identical layout to /deals/[id]. No back button to /deals.

### Phase 2

**/org** — Org name + plan badge header. Member list: Name | Email | Role | Last Active. Usage bar. Invite Member button.

**/org/invite** — Email input. Role selector (Admin / Member). Send Invite.

**/deals/[id]** (updated) — Phase 1 layout plus document tabs (COA | Contract | LC | BL). LC compliance section. BL compliance section. Cross-document conflicts panel. Audit button top right.

**/deals/[id]/documents** — All uploaded documents. Each row: type | filename | upload date | extraction status | replace | remove. Upload zones for missing documents.

**/deals/[id]/audit** — Chronological log: timestamp | user | action | result. Filterable. Export CSV.

### Phase 3

**/terminal** — Dense dashboard of all active deals. Each row: Deal Name | Commodity | Buyer | Doc Status | Vessel ETA | Market Price | Flags. Sticky filter header. Market data ticker strip at top. Alert banner for critical flags.

**/analytics** — Failure patterns across all historical deals. Charts: top failing parameters, failure rate by supplier, by commodity, by origin. Filter by date range and commodity. Export CSV.

**/deals/[id]** (updated) — Phase 2 layout plus vessel tracking (MarineTraffic embed, live ETA) and market intelligence section (contract price vs current price, freight context, Claude-generated natural language summary). Counterparty screening result.

**/settings/integrations** — API key management. CTRM/ERP webhook URL. Email ingestion n8n webhook URL. Connected integrations with status.

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

Claude API handles document understanding and natural language summaries only. Never compliance decisions.

```
PDF → Claude API → structured JSON extraction
JSON → deterministic TypeScript rule engine → PASS / FAIL
Numbers → deterministic TypeScript math → price/position calculations
Numbers + deal context → Claude API → natural language intelligence summary
```

Rules: same input always produces same output. Users can override any extracted value. Low-confidence extractions flagged. No customer documents used for model training. Claude API training opt-out enforced.

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

**Design:** Stitch MCP + 21dev MagicUI MCP

**Marketing (post-launch only):** Pomelli + Remotion + NotebookLM

---

## Security

**Phase 1:** Clerk auth. Claude API server-side only. Vercel Blob private. HTTPS only.

**Phase 2+:** Convex row-level security per org. R2 private buckets, signed URLs 15-min expiry. Full audit log. No training on customer docs. GDPR compliant.

---

## Go-To-Market

**Launch:** Pomelli (LinkedIn 3x/week) + Remotion (demo videos) + NotebookLM (content) + LinkedIn engagement first, outreach second.

**After $3k MRR:** LinkedIn ads by job title. SGS / Bureau Veritas / Cotecna partnerships. Geneva Trading Week, STSA, Commodities Week London.

**After $10k MRR:** CTRM API partnerships. Referral program.

---

## Build Order

```
✓ CLAUDE.md in project root
✓ PRD.md in /docs
✓ Skills in /skills
✓ MCPs: Stitch + 21dev in Antigravity
✓ .env.local with all keys

1. Backend    — Real Claude API extraction. Real rule engine. Zero mock data.
2. Design     — Stitch generates full design system for all phases at once.
3. UI         — Claude Code builds Phase 1 UI from Stitch screens.
4. Spline     — 3D globe with trade routes. Embed in home hero.
5. Billing    — Clerk Billing. Free + Pro live.
6. Deploy     — Vercel. commodityops.com live.
7. Validate   — 3 real ops managers use it. Do not build Phase 2 before this.
8. Marketing  — Pomelli + Remotion + NotebookLM. Not before Step 7.
```

---

*CommodityOps PRD v4.0 | April 2026 | Where physical trades are managed.*
