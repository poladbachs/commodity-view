# CommodityOps
## Product Requirements Document
**Version 5.0 | April 2026 | Confidential**

---

## What Is CommodityOps

CommodityOps is the self-serve AI platform that automates physical commodity trade operations.

Every physical commodity trade moves through a lifecycle: confirmation, document validation, shipment, delivery. At every step documents arrive — trade confirmations, COAs, contracts, Letters of Credit, Bills of Lading, invoices. Ops teams process these manually today. Reading emails. Opening PDFs. Cross-checking spreadsheets. Chasing exceptions. Hours of work per shipment. Every day.

CommodityOps automates that entire workflow. Documents arrive by email, Claude reads them, extracts structured data, validates against contract terms, flags exceptions, and presents the result for human decision. The ops team approves or rejects. The lifecycle moves forward. No manual work. No missed exceptions. Full audit trail.

---

## The Market

CommodityAI (YC W24) is building agentic AI for commodity companies — purpose-built AI that automates the busywork in commodity operations. They own execution throughout commercial, logistics, and finance operations. Their trade lifecycle: trade confirmation captured → COA validated → LC validated → trade confirmed → shipment dispatched → in transit → delivered → invoiced. They are YC-backed, SOC 2 certified, connected to CTRMs, ERPs, Teams, WhatsApp, and industry data sources.

CommodityOps is not trying to be different. CommodityOps is building the same thing — accessible to everyone.

CommodityAI sells through enterprise sales cycles. Book a call. Implementation project. Months to go live. CommodityOps has a pricing page. Sign up. Connect your email. Live today. Same customers. Same operations. Different door.

Every compliance verdict in CommodityOps is deterministic — pure logic against the firm's exact contract terms, not AI guessing. Same input always produces same output. Every verdict traceable. Every auditor can verify the logic. This is a stronger trust argument than any black box agent for decisions where $500k is on the line.

---

## Three Layers

### Layer 1 — Trade Capture
**Plans: Free + Pro ($199/mo)**
**Self-sufficient for:** trade confirmation capture, COA and contract compliance

**What it does:**
- Email arrives or PDF uploaded → Claude reads it → extracts trade confirmation (commodity, grade, quantity, price, counterparty, delivery terms) → structured editable card presented → user edits any field inline if needed → Approve or Reject → on Approve deal record created, lifecycle starts, activity feed logs action
- COA arrives via email or upload → Claude extracts every quality parameter → deterministic rule engine compares against contract specs → exceptions flagged → user sees full compliance result → Accept cargo or Reject cargo → decision logged with timestamp
- Contract arrives via email or upload → Claude extracts all specific terms and tolerances → if contract references standard terms (GAFTA, FOSFA, ICE, CME) Claude consults built-in reference library and applies deal-specific exceptions on top → stored as deal-specific validation rules applied to every subsequent document for that deal automatically → low confidence values flagged for user review
- Email ingestion from day one — documents arrive from any sender, Claude classifies and routes to correct deal automatically. Manual upload available as fallback.
- Activity feed per deal: every AI action and every human decision logged chronologically with firm name, user, and timestamp

**How it works:**
- Claude reads any email or PDF — no templates, no setup
- System prompt includes GAFTA/FOSFA/ICE/CME reference library — Claude consults when contract references standard terms, applies deal-specific exceptions on top
- Deterministic rule engine runs every compliance verdict — same input always same output, fully traceable
- Every extracted field editable before approval — low confidence values highlighted
- n8n webhook receives emails, Claude classifies document type, routes to correct deal
- Convex stores every action with firm name, timestamp, and user ID

---

### Layer 2 — Shipment Operations
**Plans: Team ($499/mo)**
**Self-sufficient for:** full document package, complete trade lifecycle from confirmation to invoiced

**What it does:**
- LC arrives via email → Claude extracts all LC terms → deterministic rule engine checks LC port vs contract port, LC quantity vs contract quantity, LC dates vs contract delivery window, LC document requirements vs available documents → exceptions flagged before bank submission → Approve or Reject
- BL arrives via email → Claude extracts vessel, port, loading date, quantity → checked against LC (port matches, shipment date before LC deadline, quantity matches) and against contract simultaneously → exceptions flagged → Approve or Reject
- Invoice arrives via email → Claude extracts amounts, quantities, counterparty → validated against contract price and delivered quantity → exceptions flagged → Approve or Reject
- Full trade lifecycle tracked automatically: confirmed → dispatched → in transit → delivered → invoiced
- Activity feed updated continuously — every document processed, every exception flagged, every human decision logged

**How it works:**
- Same Claude extraction pattern as Layer 1, different prompts per document type
- Deterministic cross-document rule engine — BL port vs LC port vs contract port, all checked simultaneously
- Lifecycle status updates automatically as each document is processed and approved

---

### Layer 3 — Connected Intelligence
**Plans: Business ($999/mo) + Enterprise ($2,500+/mo)**
**Self-sufficient for:** zero manual work, market-aware operations, counterparty risk

**What it does:**
- Live vessel tracking — vessel position and ETA per deal via MarineTraffic, vessel IMO extracted automatically from BL
- Market intelligence per deal — current commodity price vs contract price, current freight rate vs locked rate → Claude generates position summary: "Market moved $40/MT above your contract. Your position: +$2M. Freight eating $150k of that gain."
- Counterparty screening — sanctions checked via OpenSanctions API, risk signals and news via Claude web search — run automatically on every new counterparty
- CTRM/ERP integration — Enterprise only, deal data flows into existing systems automatically
- SSO/SAML — Enterprise only via Clerk

---

## Pricing

| Plan | Price | Includes |
|---|---|---|
| Free | $0 | 2 analyses lifetime — Layer 1 trial |
| Pro | $199/mo | Full Layer 1 — Trade Capture |
| Team | $499/mo | Layer 1 + 2 — Shipment Operations |
| Business | $999/mo | Full platform — Layer 1 + 2 + 3 |
| Enterprise | $2,500+/mo | Everything + CTRM/ERP + SSO |

---

## Pages

### All Phases

**/home**
Hero: "WHERE PHYSICAL TRADES ARE MANAGED". Subheadline: "One Platform. Every Deal. Every Decision." Subtext: "Upload your trade documents. Get a compliance verdict in 30 seconds. Then manage deals, track shipments, and act on market and counterparty intelligence without switching tabs." Primary CTA: SEE AN EXAMPLE DEAL. Secondary CTA: BROWSE EXAMPLE DEALS. TradingView-style ticker at top showing live commodity prices. Animated globe with trade routes as hero background (Spline). Below fold: trade lifecycle visualization (confirmed → dispatched → in transit → delivered → invoiced), layer cards (Trade Capture / Shipment Operations / Connected Intelligence), mechanics section, pricing table (Free + Pro only). TradingView-style footer.
Internal: never render competitor names, pricing targets, or internal notes in any UI component.

**/products**
Hero: "From Compliance to Intelligence. Get the Deal Done." All features across all three layers with live mini-demos for Layer 1, roadmap badges for Layer 2 and 3. Bottom CTA: "2 free analyses. No card, no setup."

**/pricing**
Hero: "$0 to start." Five plan cards: Free, Pro, Team, Business, Enterprise. Feature comparison matrix. FAQ. Bottom CTA: "First analysis on us. The next mismatch won't be." Free + Pro available now. Team + Business + Enterprise coming soon.

**/deals**
Table: Deal Name | Commodity | Buyer | Status | Last Updated | Actions. Search. Filter by status. New Deal button. Empty state: "No deals yet. Create your first deal →".

**/deals/new**
Form: Deal Name*, Buyer*, Origin*, Commodity* (free text), Quantity*, Delivery Month (optional). COA upload + Contract upload. Save Draft + Run Analysis buttons. Run Analysis disabled until both PDFs uploaded and required fields filled.

**/deals/[id]**
Header: deal name, commodity, buyer, lifecycle status bar (confirmed → dispatched → in transit → delivered → invoiced). Activity feed: chronological log of every AI action and human decision. Compliance result: violations panel first (parameter | extracted value | contract spec | result), comparison table, source traceability. Export PDF button.

**/demo**
Permanent public showcase. Pre-populated NON_COMPLIANT deal. Full analysis visible without auth. No back button to /deals.

### Layer 2 Additional Pages

**/deals/[id]** (updated) — same as Layer 1 plus document tabs (Trade Confirmation | COA | Contract | LC | BL | Invoice). Each tab shows extraction result, compliance check, Approve/Reject button. Cross-document conflicts surfaced at top.

### Layer 3 Additional Pages

**/deals/[id]** (updated) — same as Layer 2 plus vessel tracking section (MarineTraffic embed, live position and ETA) and market intelligence section (Claude-generated position summary).

**/settings/integrations** — email ingestion config, CTRM/ERP webhook URL, API key management, SSO setup (Enterprise).

---

## API

### Layer 1
```
POST /api/analyze
  Input:   FormData (COA PDF + Contract PDF + deal metadata)
  Validate: files present, PDF type, under 20MB, required fields filled
  Process: base64 → Claude extracts COA → Claude extracts Contract → rule engine → store
  Success: { status, violations, checks, extractedCOA, extractedContract }
  Error:   { error: "extraction_failed" | "file_too_large" | "invalid_file_type" | "missing_fields" }

POST /api/ingest/email
  Input:   n8n webhook payload with parsed email + attachments
  Process: Claude classifies document type → routes to correct deal → triggers analysis
  Output:  { dealId, documentType, analysisTriggered }

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

POST /api/deals/[id]/approve
  Input:  { documentType, overrides? }
  Output: { success, auditEntry }

POST /api/deals/[id]/reject
  Input:  { documentType, reason }
  Output: { success, auditEntry }
```

### Layer 2
```
POST /api/analyze/lc
  Input:   FormData (LC PDF + dealId)
  Process: extract LC terms → validate against contract → cross-validate against COA and BL
  Output:  { status, violations, extractedLC }

POST /api/analyze/bl
  Input:   FormData (BL PDF + dealId)
  Process: extract vessel/port/date/quantity → validate against LC and contract simultaneously
  Output:  { status, violations, extractedBL }

POST /api/analyze/invoice
  Input:   FormData (Invoice PDF + dealId)
  Process: extract amounts/quantities → validate against contract price and delivery
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
firms:    { id, name, plan, createdAt }
users:    { id, firmId, clerkId, email, role }
deals:    { id, firmId, title, buyer, origin, commodity, quantity,
            deliveryMonth?, contractPrice?, currency?,
            vesselName?, vesselIMO?, lifecycleStage, createdAt }
documents:{ id, dealId, type, filename, storageKey, extractedData,
            confidence, uploadedAt }
analyses: { id, dealId, documentType, status, violations, checks,
            executedAt }
activity: { id, dealId, firmId, userId, actor, action, result, timestamp }
```

---

## AI Architecture

```
Email/PDF → Claude API → structured JSON extraction
JSON → deterministic TypeScript rule engine → PASS / FAIL
Numbers → deterministic TypeScript math → position calculations
Numbers + context → Claude API → natural language intelligence summary
```

- Claude API: extraction and intelligence summaries only
- Rule engine: all compliance verdicts — deterministic, never AI
- Every extracted value editable before approval
- Low confidence values flagged for human review
- No customer data used for model training
- GAFTA/FOSFA/ICE/CME reference library in system prompt — consulted when contracts reference standard terms

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

**Claude Code skills:** Superpowers → Self-Healing → Frontend Design → UI UX Pro Max → Webapp Testing

**Design:** Stitch MCP + 21dev MagicUI MCP

**Marketing (post-launch):** Pomelli + Remotion + NotebookLM

---

## Security

**Now:** Clerk auth. Claude API server-side only. Vercel HTTPS/TLS. Convex encryption at rest. Audit logs every layer. EU/US data residency via Convex.

**Roadmap:** SOC 2 Type II after revenue. SSO/SAML for Enterprise via Clerk.

---

## Go-To-Market

**Launch:** LinkedIn content via Pomelli. Demo videos via Remotion. Industry content via NotebookLM. Engage commodity ops community — comment first, outreach second.

**After $3k MRR:** LinkedIn ads by job title. Industry events — Geneva Trading Week, STSA, Commodities Week London.

**After $10k MRR:** CTRM API partnerships. Referral program.

---

## Build Order

```
1. Backend    — Claude extraction on trade confirmation + COA + contract. 
                Deterministic rule engine. Approve/Reject flow. Activity feed.
                Zero mock data.
2. Design     — Stitch generates full design system. All layers designed at once.
3. UI         — Claude Code builds Layer 1 UI from Stitch screens.
4. Email      — n8n webhook. Document classification. Deal routing.
5. Spline     — 3D globe with trade routes. Embed in home hero.
6. Billing    — Clerk Billing. Free + Pro live.
7. Deploy     — Vercel. commodityops.com live.
8. Validate   — 3 real ops managers use it on real documents.
9. Marketing  — Pomelli + Remotion + NotebookLM. Not before Step 8.
```

---

*CommodityOps PRD v5.0 | April 2026 | AI that automates physical commodity trade operations.*