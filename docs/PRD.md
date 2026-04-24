# CommodityOps
## Product Requirements Document
**Version 5.1 | April 2026 | Confidential**

---

## What Is CommodityOps

AI that automates physical commodity trade operations.

Purpose-built AI that captures trade confirmations, validates documents, and manages the full trade lifecycle — from confirmation to delivery. No sales call. No implementation project. Pricing page. Live today.

Built on Claude AI, CommodityOps operates directly from emails and documents — extracting trade confirmations, validating COAs against exact contract terms, checking Letters of Credit and Bills of Lading, tracking vessels, and surfacing market and counterparty intelligence alongside every active deal.

Every compliance verdict is deterministic — pure logic against the firm's exact contract terms. Not a black box. Every decision traceable. Every action logged.

---

## The Market

CommodityAI (YC W24) is building agentic AI for commodity companies — purpose-built AI that automates the busywork in commodity operations. Trade confirmation captured → COA validated → LC validated → trade confirmed → shipment dispatched → in transit → delivered → invoiced. YC-backed, SOC 2 certified, connected to CTRMs, ERPs, Teams, WhatsApp.

CommodityOps builds the same thing. Accessible to everyone.

CommodityAI requires a meeting. CommodityOps requires a credit card. Same customers. Same operations. Different door.

---

## Three Layers

### Layer 1 — Trade Capture
**Plans: Free + Pro ($199/mo)**
**Self-sufficient for:** trade confirmation capture, COA and contract compliance

What it does:
- Email arrives or PDF uploaded → Claude reads it → extracts trade confirmation (commodity, grade, quantity, price, counterparty, delivery terms) → structured editable card presented → user edits any field inline → Approve or Reject → on Approve deal record created, lifecycle starts, activity feed logs action
- COA arrives via email or upload → Claude extracts every quality parameter → deterministic rule engine compares against contract specs → exceptions flagged → compliance result shown → user edits any extracted value inline → Accept cargo or Reject cargo → decision logged with timestamp
- Contract arrives via email or upload → Claude extracts all specific terms and tolerances → if contract references standard terms (GAFTA, FOSFA, ICE, CME) Claude consults built-in reference library and applies deal-specific exceptions on top → stored as deal-specific validation rules applied to every subsequent document automatically → low confidence values flagged for user review
- Email ingestion from day one — documents arrive from any sender, Claude classifies and routes to correct deal automatically. Manual upload as fallback.
- Activity feed per deal: every AI action and every human decision logged chronologically with firm, user, and timestamp

How it works:
- Claude reads any email or PDF — no templates, no setup
- System prompt includes GAFTA/FOSFA/ICE/CME reference library — Claude consults when contract references standard terms, applies deal-specific exceptions on top
- Deterministic rule engine runs every compliance verdict — same input always same output, fully traceable
- Every extracted field editable before approval — low confidence values highlighted in yellow
- n8n webhook receives emails, Claude classifies document type, routes to correct deal
- Convex stores every action with firm name, user ID, and timestamp

---

### Layer 2 — Shipment Operations
**Plans: Team ($499/mo)**
**Self-sufficient for:** full document package, complete trade lifecycle from confirmation to invoiced

What it does:
- LC arrives via email → Claude extracts all LC terms → deterministic rule engine checks LC port vs contract port, LC quantity vs contract quantity, LC dates vs contract delivery window, LC document requirements vs available documents → exceptions flagged before bank submission → user edits inline → Approve or Reject
- BL arrives via email → Claude extracts vessel, port, loading date, quantity → checked against LC (port matches, shipment date before LC deadline, quantity matches) and against contract simultaneously → exceptions flagged → user edits inline → Approve or Reject
- Invoice arrives via email → Claude extracts amounts, quantities, counterparty → validated against contract price and delivered quantity → exceptions flagged → user edits inline → Approve or Reject
- Full trade lifecycle tracked automatically: confirmed → dispatched → in transit → delivered → invoiced
- Activity feed updated continuously — every document processed, every exception flagged, every human decision logged

How it works:
- Same Claude extraction pattern as Layer 1, different prompts per document type
- Deterministic cross-document rule engine — BL port vs LC port vs contract port, all checked simultaneously
- Lifecycle status updates automatically as each document is processed and approved

---

### Layer 3 — Connected Intelligence
**Plans: Business ($999/mo) + Enterprise ($2,500+/mo)**
**Self-sufficient for:** zero manual work, market-aware operations, counterparty risk

What it does:
- Live vessel tracking — vessel position and ETA per deal via MarineTraffic, vessel IMO extracted automatically from BL
- Market intelligence per deal — current commodity price vs contract price, current freight rate vs locked rate → Claude generates position summary: "Market moved $40/MT above your contract. Your position: +$2M. Freight eating $150k of that gain."
- Counterparty screening — sanctions checked via OpenSanctions API, risk signals and news via Claude web search — run automatically on every new counterparty
- CTRM/ERP integration — Enterprise only
- SSO/SAML — Enterprise only via Clerk

Security now: HTTPS/TLS (Vercel), encryption at rest (Convex), audit logs (every layer), EU/US data residency (Convex).
Security roadmap: SOC 2 Type II after revenue.

---

## Pricing

| Plan | Price | Includes |
|---|---|---|
| Free | $0 | 2 analyses lifetime |
| Pro | $199/mo | Full Layer 1 |
| Team | $499/mo | Layer 1 + 2 |
| Business | $999/mo | Layer 1 + 2 + 3 |
| Enterprise | $2,500+/mo | Everything + CTRM/ERP + SSO |

---

## Pages

**/home**
Content: Full product vision across all three layers. Headline: "WHERE PHYSICAL TRADES ARE MANAGED". Subheadline: "One Platform. Every Deal. Every Decision." Subtext: "From trade confirmation to delivery — CommodityOps automates every document, every validation, every exception. Your ops team makes the calls. We handle everything else." CTA: GET STARTED FREE (primary) + SEE HOW IT WORKS (secondary, scrolls to mechanics). TradingView-style ticker at top. Animated globe with trade routes (Spline). Trade lifecycle visualization below hero: confirmed → dispatched → in transit → delivered → invoiced. Three layer cards. Mechanics section showing email → extraction → editable card → Approve/Reject flow. Pricing table (Free + Pro only). TradingView-style footer.
Internal note: never render competitor names, pricing targets, or layer descriptions as UI text.

**/products**
Hero: "From Trade Confirmation to Delivery. Automated." All features across all layers. Live mini-demos for Layer 1. Roadmap badges for Layer 2 and 3. Bottom CTA: "2 free analyses. No card, no setup."

**/pricing**
Hero: "$0 to start. No card required." Five plan cards: Free, Pro, Team, Business, Enterprise. Feature comparison matrix. FAQ. Bottom CTA: "First analysis on us. The next mismatch won't be." Free + Pro available. Team + Business + Enterprise coming soon.

**/deals**
Table: Deal Name | Commodity | Buyer | Lifecycle Stage | Status | Last Updated | Actions. Search. Filter by status and lifecycle stage. New Deal button. Empty state: "No deals yet. Create your first deal →".

**/deals/new**
Form: Deal Name*, Buyer*, Origin*, Commodity* (free text), Quantity*, Delivery Month (optional). Email ingestion toggle: "Receive documents automatically from your inbox" or manual upload fallback. Save Draft + Analyze buttons. Analyze disabled until required fields filled.

**/deals/[id]**
Header: deal name, commodity, buyer. Lifecycle bar: confirmed → dispatched → in transit → delivered → invoiced, current stage highlighted. Main panel: current document requiring attention — extracted values in editable card, low confidence values highlighted yellow, compliance result (parameter | extracted value | contract spec | PASS/FAIL), APPROVE (green) and REJECT (red) buttons. On Approve: record saved, lifecycle advances, activity feed logs. On Reject: record dismissed, activity feed logs reason. Activity feed: chronological log of every AI action and human decision. All deal documents listed below with status.

**/demo**
Permanent public showcase. Pre-populated NON_COMPLIANT Brazilian soybean deal. Full lifecycle shown. Activity feed visible. Full editable card with Approve/Reject visible. No auth required.

**/settings/integrations**
Email ingestion setup. CTRM/ERP webhook (Enterprise). API key management (Enterprise). SSO setup (Enterprise).

---

## API

### Layer 1
```
POST /api/ingest/email
  Input:   n8n webhook payload (email + attachments)
  Process: Claude classifies document → routes to correct deal → triggers analysis
  Output:  { dealId, documentType, analysisTriggered }

POST /api/analyze
  Input:   FormData (document PDF + dealId + documentType)
  Process: base64 → Claude extracts → rule engine → store
  Output:  { status, violations, checks, extracted, confidence }

POST /api/deals/[id]/approve
  Input:   { documentType, overrides? }
  Output:  { success, lifecycleStage, auditEntry }

POST /api/deals/[id]/reject
  Input:   { documentType, reason }
  Output:  { success, auditEntry }

GET  /api/deals
  Output: { deals: [{ id, title, buyer, commodity, lifecycleStage, status, updatedAt }] }

GET  /api/deals/[id]
  Output: { deal, documents, latestAnalysis, activity }

POST /api/deals
  Input:  { title, buyer, origin, commodity, quantity, deliveryMonth? }
  Output: { dealId }
```

### Layer 2
```
POST /api/analyze/lc
  Input:   FormData (LC PDF + dealId)
  Process: extract LC terms → validate against contract → cross-validate with COA and BL
  Output:  { status, violations, extractedLC }

POST /api/analyze/bl
  Input:   FormData (BL PDF + dealId)
  Process: extract vessel/port/date/quantity → validate against LC and contract simultaneously
  Output:  { status, violations, extractedBL }

POST /api/analyze/invoice
  Input:   FormData (Invoice PDF + dealId)
  Process: extract amounts/quantities → validate against contract and delivery
  Output:  { status, violations, extractedInvoice }

GET  /api/deals/[id]/lifecycle
  Output: { stage, history: [{ stage, timestamp, userId }] }
```

### Layer 3
```
GET  /api/vessel/[dealId]
  Output:  { vesselName, lat, lng, eta, speed, destination }

GET  /api/market/[dealId]
  Output:  { commodity, contractPrice, currentPrice, delta, freightRate, summary }

POST /api/screen/[dealId]
  Output:  { sanctionsResult, riskSignals, news }
```

---

## Data Model

```typescript
firms:     { id, name, plan, createdAt }
users:     { id, firmId, clerkId, email, role }
deals:     { id, firmId, title, buyer, origin, commodity, quantity,
             deliveryMonth?, contractPrice?, currency?,
             vesselName?, vesselIMO?, lifecycleStage, createdAt }
documents: { id, dealId, type, filename, storageKey,
             extractedData, confidence, uploadedAt }
analyses:  { id, dealId, documentType, status, violations,
             checks, executedAt }
activity:  { id, dealId, firmId, userId, actor, action,
             result, timestamp }
```

---

## AI Architecture

```
Email/PDF → Claude API → structured JSON extraction
JSON → deterministic TypeScript rule engine → PASS / FAIL
Numbers → deterministic TypeScript math → position calculations
Numbers + deal context → Claude API → natural language summary
```

- Claude API: document extraction and intelligence summaries only
- Rule engine: all compliance verdicts — deterministic, never AI
- GAFTA/FOSFA/ICE/CME reference library in system prompt
- Every extracted value editable before approval
- Low confidence values flagged for human review
- No customer data used for model training

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| UI | Tailwind + shadcn/ui + Motion |
| Auth | Clerk |
| Billing | Clerk Billing (Stripe) |
| Database | Convex |
| Storage | Vercel Blob → Cloudflare R2 |
| AI | Claude API (claude-sonnet-4-20250514) |
| Email Ingestion | n8n |
| Vessel Tracking | MarineTraffic API |
| Sanctions | OpenSanctions API |
| 3D Hero | Spline |
| Deploy | Vercel |

Claude Code skills: Superpowers → Self-Healing → Frontend Design → UI UX Pro Max → Webapp Testing
Design: Stitch MCP + 21dev MagicUI MCP
Marketing (post-launch): Pomelli + Remotion + NotebookLM

---

## Build Order

```
1. Backend    — Claude extraction on trade confirmation + COA + contract.
                Deterministic rule engine. Approve/Reject flow. Activity feed.
                Email ingestion via n8n. Zero mock data.
2. Design     — Stitch generates full design system. All layers at once.
3. UI         — Claude Code builds Layer 1 UI from Stitch screens.
4. Spline     — 3D globe with trade routes. Home hero.
5. Billing    — Clerk Billing. Free + Pro live.
6. Deploy     — Vercel. commodityops.com live.
7. Validate   — 3 real ops managers on real documents.
8. Marketing  — Pomelli + Remotion + NotebookLM. Not before Step 7.
```

---

*CommodityOps PRD v5.1 | April 2026 | AI that automates physical commodity trade operations.*