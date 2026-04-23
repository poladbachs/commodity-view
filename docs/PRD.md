# CommodityView — Product Requirements Document
**Version 1.3 | April 2026 | Confidential**

---

## Product Overview

**Name:** CommodityView

**What:** CommodityView is the platform for physical 
commodity traders.

**Why (founder only):** One document mismatch in a commodity shipment = $50k–$500k
loss. The 4 documents that cause 90% of trade disputes — COA,
contract, LC, Bill of Lading — checked automatically before payment
is released. Beyond compliance: vessel tracking, market data, and
counterparty screening — one platform for the entire trading firm.

**Positioning (internal only):** Competitors like ClearDox serves large global 
enterprises with 5-week implementations and $50k+/year contracts. 
Another competitor CommodityAI (YC-backed) serves large US enterprises only. No self-serve, 
affordable tool exists for the thousands of mid-size physical 
commodity traders worldwide.

**Three-phase growth path:**

**Phase 1 ($0→$3k MRR): Document Intelligence**
- COA vs contract check — catch quality mismatches before accepting a shipment
- AI extraction — upload any PDF, no templates, no manual data entry
- Violations panel — see exactly what failed and why, no interpretation needed
- Comparison table — every parameter side by side in one screen
- PDF export — audit-ready report, attach to email or file instantly
- Free (3 analyses total) + $49/month (30 analyses/month, 1 user)

**Phase 2 ($3k→$10k MRR): Ops Hub**
- Team workspace, ops found a violation, trader needs to see it, no more email chains
- Letter of Credit compliance checks, catch LC discrepancies before bank submission, saves thousands
- Bill of Lading checks (port, date, quantity vs contract), wrong port or date on a BL delays payment, caught in seconds
- Cross-document validation (all docs checked against each other, not just COA vs contract)
- Expanded deal view — full shipment document status in one place, Green = release payment. Red = stop.
- Audit log per deal - who approved what and when, one click answer for CFO
- Become the Ops Hub at $199/month (3 users, 100/mo) + $499/month (10 users, 300/mo)

**Phase 3 ($10k+ MRR): Terminal**
- Email ingestion — documents arrive automatically, zero manual upload: system reads them, ops wakes up to action list
- Historical analytics — failure patterns by supplier, commodity, origin, after a few months you know which supplier fails specs most often
- Vessel tracking — MarineTraffic embed per deal, where is your cargo right now, live ETA updates
- Market data layer — freight rates + commodity prices in context of active deals
- API access — Enterprise only, CTRM pushes deals in automatically
- Sanctions screening — Enterprise only, OFAC/UN/EU blacklist checks, legal compliance proof
- Counterparty intelligence — Enterprise only, news, risk signals, financial health on trading partners
- Become the Terminal at $499/month (Professional) + $1,500+/month (Enterprise)

**Exit target:** $15–20k MRR ($180–240k ARR) → $1M–$1.2M acquisition at 5x ARR on Acquire.com

**Strategic moat by phase:**
- Phase 1 — wedge. Proves pain exists. Gets first users in the door.
- Phase 2 — moat starts. Proprietary data compounds with every deal. 
  Team workspace creates switching costs. Deal history means leaving 
  = losing institutional memory.
- Phase 3 — lock-in. Email ingestion, API integration, analytics mean 
  CommodityView becomes infrastructure. Switching away means losing 
  everything. This is what avoids the AI wrapper graveyard.

---

## Target Users

| Persona | Phase 1 Win | Phase 2 Win | Phase 3 Win |
|---|---|---|---|
| **Ops Manager** | COA vs Contract PASS/FAIL in 30 seconds. Saves 2 hrs/shipment. | Manages team in workspace. Cross-validates 4 docs. Controls audit log. | Real-time shipment monitoring. Historical analytics on failure patterns. |
| **Trader** | Waiting for ops approval → instant PASS/FAIL status. Deal moves. | Workspace visibility, not email threads. Deal status in real-time. | Live vessel tracking. Trading decisions informed by shipment ETA + market data. |
| **CFO/Risk** | N/A | Compliance reports + audit log for board/regulators. | Risk trends by commodity/supplier. Board-ready reporting. |

**Segment:** Physical commodity trading firms, 10–200 employees as 
self-serve entry point. Larger firms including Big 5 counterparties 
via direct relationships and enterprise contracts post Phase 2.

**Entry:** Single ops manager tests it, proves value, brings team in Phase 2.

---

## Phase 1 — MVP

### Core Features

- COA vs contract check — catch quality mismatches before accepting a shipment
- AI extraction — upload PDFs, no templates, no manual data entry
- Violations panel — see exactly what failed and why, no interpretation needed
- Comparison table — every parameter side by side in one screen
- PDF export — audit-ready report, attach to email or file instantly

### Phase 1 Pages

**/home**
Content: Full product vision — CommodityView as the intelligence 
platform for physical commodity trading firms. Headline speaks to 
the entire vision not just Phase 1. Subheadline. "Get Started Free" 
CTA. Features section showing all three phases — document compliance, 
ops hub, terminal intelligence. Footer TradingView-style.
Layout: split hero — left side text + CTA, right side Spline 3D 
globe with animated shipping trade routes between major commodity 
ports (Rotterdam, Singapore, Dubai, Houston, Santos, Shanghai). The rest - improvise.

**/deals**
Content: table (Deal Name | Commodity | Buyer | Status | Last Updated | Actions). Search bar. Filter by status. Empty state: "No deals yet. Create your first deal →" button. Pagination if over 20 deals.
Layout: full width table. Search and filter bar above. New Deal button top right.

**/deals/new**
Content: form fields (Deal Name*, Buyer*, Origin*, Commodity, Quantity, Delivery Month). COA upload zone. Contract upload zone. Save Draft button. Run Analysis button (disabled with tooltip "Upload both documents to run analysis" until both PDFs uploaded and required fields filled).
Layout: single column form. Upload zones side by side. Buttons bottom right.

**/deals/[id]**
Content: status badge header (COMPLIANT/NON_COMPLIANT/PENDING). If PENDING: loading spinner with "Extracting documents..." message. If failed: error message with retry button. If complete: violations panel first (parameter | COA value | spec | reason), comparison table (Parameter | COA Value | Spec | Result), traceability footer (source document per value), Export PDF button.
Layout: header full width. Violations panel above fold. Comparison table below. Export button top right.

### Phase 1 API

POST /api/analyze
  Input: FormData (COA PDF + Contract PDF + deal metadata)
  Validate: both files present, correct type (PDF), under 20MB each, required fields filled
  Process: convert to base64 → extract COA → extract Contract → run rule engine → store in Convex
  Output success: { status, violations, checks, extractedCOA, extractedContract }
  Output error: { error: "extraction_failed" | "file_too_large" | "invalid_file_type" | "missing_fields" }

GET /api/deals
  Output: { deals: [{ id, title, buyer, commodity, status, updatedAt }] }

GET /api/deals/[id]
  Output: { deal, latestAnalysis: { status, violations, checks } | null }

POST /api/deals
  Input: { title, buyer, origin, commodity?, quantity?, deliveryMonth? }
  Output: { dealId }

PATCH /api/deals/[id]
  Input: partial deal fields
  Output: { success }

### Pricing

| Plan | Price | Analyses | Users |
|---|---|---|---|
| Free | $0 | 3 total (lifetime) | 1 |
| Starter | $49/month | 30/month | 1 |

---

## Phase 2 — Ops Hub

### New features
- Team workspace, ops found a violation, trader needs to see it, no more email chains
- Letter of Credit compliance checks, catch LC discrepancies before bank submission, saves thousands
- Bill of Lading checks (port, date, quantity vs contract), wrong port or date on a BL delays payment, caught in seconds
- Cross-document validation (all docs checked against each other, not just COA vs contract)
- Expanded deal view — full shipment document status in one place, Green = release payment. Red = stop.
- Audit log per deal - who approved what and when, one click answer for CFO

### Phase 2 Pages
**/org**
Content: org name, member list table (Name | Email | Role | Last Active), usage counter (X of Y analyses used this month), Invite Member button.
Layout: header with org name + plan badge. Members table full width. Usage bar below.

**/org/invite**
Content: email input, role selector (Admin/Member), Send Invite button.
Layout: centered card. Simple form. No fluff.

**/deals/[id]** — updated
Content: same as Phase 1 plus LC compliance result section, BL compliance result section, cross-document conflicts section. All document statuses visible in one screen. Green/red per document.
Layout: status badge header. Document tabs (COA | Contract | LC | BL). Violations panel. Comparison table. Cross-document conflicts panel. Audit button top right.

**/deals/[id]/documents**
Content: list of all uploaded documents per deal. Each row shows: document type, filename, upload date, extraction status (extracted/failed), replace button, remove button. Upload new document button per type.
Layout: table per document type. Upload zones at bottom per missing document.

**/deals/[id]/audit**
Content: chronological log of every action on this deal. Each row: timestamp | user | action | result.
Layout: full width table. Filterable by user and action type. Export CSV button top right.

### Phase 2 API
POST /api/analyze/lc
  Input: FormData (LC PDF + dealId)
  Process: extract UCP 600 fields → run compliance checks → store
  Output: { status, violations, extractedLC }

POST /api/analyze/bl
  Input: FormData (BL PDF + dealId)
  Process: extract port/date/quantity → run cross-checks → store
  Output: { status, violations, extractedBL }

POST /api/analyze/cross
  Input: { dealId }
  Process: fetch all extracted docs for deal → run cross-document rules → store
  Output: { status, conflicts, checks }

GET /api/deals/[id]/audit
  Output: { entries: [{ timestamp, userId, action, result }] }

POST /api/org/invite
  Input: { email, role }
  Process: send Clerk invite → store pending member
  Output: { success, inviteId }

### Pricing

| Plan | Price | Users | Analyses/Month | Features |
|---|---|---|---|---|
| Growth | $199/month | 3 | 100 | Team workspace, LC + BL checks, cross-validation, full shipment view, audit log |
| Professional | $499/month | 10 | 300 | Everything in Growth, more users, more analyses |

---

## Phase 3 — Terminal

### New capabilities
- Email ingestion — documents arrive automatically, zero manual upload, documents arrive, system reads them, ops wakes up to action list
- Historical analytics — failure patterns by supplier, commodity, origin, after a few months you know which supplier fails specs most often
- Vessel tracking — MarineTraffic embed per deal, where is your cargo right now, live ETA updates
- Market data layer — freight rates + commodity prices in context of your deals (Note for freight rates: Freight rates API costs money. Only build when customers ask for it specifically.)
- API access — Enterprise only, CTRM pushes deals in automatically
- Sanctions screening — Enterprise only, OFAC/UN/EU blacklist checks, legal compliance proof
- Counterparty intelligence — Enterprise only, news, risk signals, financial health on trading partners

### Phase 3 Pages
/terminal
Content: dense dashboard of all active deals. Each row: Deal Name | Commodity | Buyer | Doc Status (colored badges) | Vessel ETA | Market Price | Flags. Click row to expand inline preview or navigate to /deals/[id].
Layout: full width dense table. Sticky header with filters (by commodity, by status, by flag). Market data ticker strip at top showing freight rates and commodity prices. Alert banner if any deal has critical flags.

/analytics
Content: failure pattern intelligence across all historical deals. Charts: top 5 failing parameters, failure rate by supplier, failure rate by commodity, failure rate by origin. All filterable by date range and commodity type.
Layout: filter bar at top. 4 chart panels in 2x2 grid. Raw data table below charts. Export CSV button.

/deals/[id] — updated again
Content: same as Phase 2 plus vessel tracking section (MarineTraffic embed showing live vessel position and ETA), market price context (current price vs contract price for that commodity), counterparty screening result (Enterprise only).
Layout: same as Phase 2 deal page with two new sections at bottom — Vessel Tracking and Market Context.

/settings/integrations
Content: API key display and regeneration. CTRM/ERP webhook URL. Email ingestion n8n webhook URL and setup instructions. Connected integrations list.
Layout: sections per integration type. Each section has status badge (connected/not connected), credentials, setup guide link.

### Phase 3 API
GET /api/vessel/[dealId]
  Process: fetch vessel position from MarineTraffic API using vessel ID stored on deal
  Output: { vesselName, lat, lng, eta, speed, destination }

GET /api/market
  Input: { commodity, unit }
  Process: fetch price from data provider API
  Output: { commodity, price, currency, unit, updatedAt }

GET /api/analytics
  Input: { orgId, dateFrom, dateTo, commodity? }
  Process: aggregate all analysis runs for org → compute failure patterns
  Output: { topFailingParams, failureBySupplier, failureByCommodity, failureByOrigin }

POST /api/ingest/email
  Input: n8n webhook payload with parsed email attachments
  Process: classify document type → match to deal by metadata → trigger analysis
  Output: { dealId, documentType, analysisTriggered }

POST /api/screen/[dealId]
  Input: { dealId }
  Process: fetch counterparty name from deal → check OpenSanctions API → fetch news signals
  Output: { sanctionsResult, riskSignals, news }

### Pricing

| Plan | Price | Users | Features |
|---|---|---|---|
| Professional | $499/month | 10 | Phase 2 + email ingestion + vessel tracking + market data + hystorical analytics |
| Enterprise | $1,500+/month | 20+ | Professional + API access + counterparty intelligence + sanctions screening |

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| UI | Frontend Design Skill + UI UX Pro Max Skill + 21dev MagicUI MCP + Tailwind + shadcn/ui + Motion |
| Auth | Clerk |
| Database | Convex |
| Storage | Vercel Blob → Cloudflare R2 |
| AI Extraction | Claude API (claude-sonnet-4-20250514) |
| Payments | Clerk Billing (powered by Stripe) |
| Deploy | Vercel |
| 3D Graphics| Spline |
| Email Ingestion later | n8n |

**Design:** Stitch MCP (palette) + 21dev MagicUI MCP (components) + Motion + Spline @splinetool/react-spline (3D graphics)

**Marketing (post-launch):** Pomelli (LinkedIn content) + Remotion (demo videos) + NotebookLM (content research)

**Parked:** Email ingestion (n8n), API, white-label, market data, vessel tracking — ship in phases after paying customers onboard

---

## Security

**MVP:** Clerk auth, Claude API server-side only, Vercel Blob private, HTTPS only.

**Production:** Convex RLS per org, Convex Rater Limiter, Convex Action Cache, Row Level Security, R2 signed URLs, full audit log, no training on customer docs, GDPR for EU firms.

**AI trust:** Claude = extraction only. Rules engine = compliance verdict, deterministic. Users can override. Low-confidence values flagged.

---

## Go-To-Market

**Launch:**
- Pomelli → auto-generate LinkedIn posts 3x/week from product website
- Remotion → short product demo videos posted weekly
- NotebookLM → turn industry reports into expert content
- Engage commodity ops community on LinkedIn — comment first, message second

**After $3k MRR:**
- LinkedIn ads by job title (Trade Operations, Commodity Trader)
- Inspection company partnerships — SGS, Bureau Veritas, Cotecna
- Industry events — Geneva Trading Week, STSA, Commodities Week London

**After $10k MRR:**
- API partnerships with CTRMs
- Referral program for ops managers

---

## Build Order

```
✓ docs/PRD.md and CLAUDE.md in project
✓ Skills: /skills folder
✓ MCPs: Stitch + 21dev
✓ .env and .env.local configured

Stage 1 — Full Architecture and Backend first
Stage 2 — UI/UX (Stitch MCP + Frontend Design skill + 21dev MagicUI + UI UX PRO MAX skill + MOTION + shadcn)
Stage 3 — Clerk Billing with Stripe: Free + Starter plans live
Stage 4 — Deploy: Vercel. Show 3 real ops managers.
Stage 5 — Marketing: Pomelli + Remotion + NotebookLM. Not before.
```

---

*CommodityView PRD v1.3 | April 2026 | Execute.*