# CommodityView — Claude Code Orchestrator

## What Is This Project

**Name:** CommodityView

**What:** CommodityView is the intelligence platform for physical 
commodity traders.

**Why:** One document mismatch in a commodity shipment = $50k–$500k
loss. The 4 documents that cause 90% of trade disputes — COA,
contract, LC, Bill of Lading — checked automatically before payment
is released. Beyond compliance: vessel tracking, market data, and
counterparty screening — one platform for the entire trading firm.

**Positioning (internal only):** ClearDox serves large global 
enterprises with 5-week implementations and $50k+/year contracts. 
CommodityAI serves large US enterprises only. No self-serve, 
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
- Team workspace via Clerk Organizations, ops found a violation, trader needs to see it, no more email chains
- Letter of Credit compliance checks, catch LC discrepancies before bank submission, saves thousands
- Bill of Lading checks (port, date, quantity vs contract), wrong port or date on a BL delays payment, caught in seconds
- Cross-document validation (all docs checked against each other, not just COA vs contract)
- Expanded deal view — full shipment document status in one place, Green = release payment. Red = stop.
- Audit log per deal - who approved what and when, one click answer for CFO
- Become the Ops Hub at $199/month (3 users, 100/mo) + $499/month (10 users, 300/mo)

**Phase 3 ($10k+ MRR): Real-Time Terminal**
- Email ingestion (n8n) — documents arrive automatically, zero manual upload, documents arrive, system reads them, ops wakes up to action list
- Historical analytics — failure patterns by supplier, commodity, origin, after a few months you know which supplier fails specs most often
- Vessel tracking — MarineTraffic embed per deal, so no API cost, where is your cargo right now, live ETA updates
- Market data layer — freight rates + commodity prices in context of active deals (Note for freight rates: Freight rates API costs money. Only build when customers ask for it specifically.)
- API access — Enterprise only, CTRM pushes deals in automatically
- Sanctions screening — Enterprise only, OFAC/UN/EU blacklist checks, legal compliance proof
- Counterparty intelligence — Enterprise only, news, risk signals, financial health on trading partners
- Become the Terminal at $499/month (Professional) + $1,500+/month (Enterprise)

Full strategy in /docs/PRD.md — read first.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| UI | Frontend Design Skill + UI UX Pro Max Skill + 21dev MagicUI MCP + Tailwind + shadcn/ui + Motion|
| Auth | Clerk |
| Database | Convex |
| Storage | Vercel Blob → Cloudflare R2 |
| AI Extraction | Claude API (claude-sonnet-4-20250514) |
| Payments | Clerk Billing (powered by Stripe) |
| Deploy | Vercel |
| 3D Graphics| Spline |
| Email Ingestion later | n8n |

**Design tools:** Stitch (palette via MCP) + 21dev MagicUI MCP (components) + Motion + Spline @splinetool/react-spline (3D graphics)

**Marketing (post-launch):** Pomelli (SMM / Digital Marketing) + Remotion (demo videos) + NotebookLM (content)

**Parked (Phase 2+):** Email ingestion, template library, API, white-label, mobile app, market data, vessel tracking — all roadmap items, ship in phases after paying customers onboard

**Payment note:** Clerk Billing doesn't support tax/VAT — use Stripe Tax directly for EU compliance (Phase 2).

---

## Core Rules — NEVER VIOLATE

1. Claude API = extraction only, never compliance decisions
2. Rule engine = always deterministic
3. API keys = server only, never client-side
4. Every extracted value = traceable to source document
5. No mock data = if extraction fails, return error
6. Users can override any extracted value
7. No localStorage for sensitive data — use Convex

---

## Installed Skills (/skills and .agents/skills)

### Process Skills (Use First)
- **brainstorming** → Generate ideas, explore multiple directions before committing to approach
- **writing-plans** → Plan implementation strategy, break down complex tasks into steps
- **systematic-debugging** → Debug problems methodically: reproduce → isolate → fix → verify
- **test-driven-development** → Write tests before code; red → green → refactor cycle
- **subagent-driven-development** → Dispatch independent tasks to subagents in parallel
- **dispatching-parallel-agents** → Coordinate multiple independent agents on parallel work streams
- **executing-plans** → Execute implementation plans with discipline and tracking

### Implementation Skills (Use During Execution)
- **frontend-design** → Build React components, pages, styling. UI/UX work only.
- **ui-ux-pro-max** → Design system, visual consistency, dark mode patterns. Use **before** frontend-design.
- **mcp-builder** → Build MCPs (Model Context Protocol integrations)
- **webapp-testing** → Test features end-to-end after implementation
- **writing-skills** → Document and share learnings, best practices, and workflows

### Verification & Git Skills
- **verification-before-completion** → QA checklist before marking task done
- **using-git-worktrees** → Create isolated git worktrees for risky changes
- **finishing-a-development-branch** → Merge, cleanup, close PR workflow
- **requesting-code-review** → Prepare PR for review
- **receiving-code-review** → Respond to review feedback

### Meta Skills
- **using-superpowers** → Framework for choosing and invoking skills (reference only)
- **skill-creator** → Create new skills (rarely needed)

## Stitch & Frontend Skills (.agents/skills)

### Design & Stitch Skills
- **stitch-design** → Unified entry point for Stitch work. Prompt enhancement + DESIGN.md synthesis + screen generation/editing via Stitch MCP. Use for all UI screen generation tasks.
- **taste-design** → Semantic design system generator. Enforces premium anti-generic standards: strict typography, calibrated color, asymmetric layouts, micro-motion. Use **before** stitch-design for high-quality output.
- **design-md** → Analyzes Stitch projects and writes a `DESIGN.md` capturing the visual system. Use after generating screens to lock down the design language.
- **enhance-prompt** → Transforms vague UI ideas into polished, Stitch-optimized prompts. Use **before** stitch-design when the brief is vague.
- **stitch-loop** → Iteratively builds multi-page websites via Stitch with an autonomous baton-passing loop. Use for multi-screen site builds.
- **remotion** → Generates walkthrough videos from Stitch projects using Remotion. Use for demo videos and marketing content.

### Component & Integration Skills
- **react-components** → Converts Stitch designs into modular Vite + React components. Use after screen generation to get production-ready code.
- **shadcn-ui** → Expert guidance for integrating and customizing shadcn/ui components. Use when adding/customizing shadcn components.

### Convex Backend Skills
- **convex-quickstart** → Initialize a new Convex project or add Convex to an existing app.
- **convex-setup-auth** → Set up Convex authentication (Clerk, Auth0, JWT). Use when adding login/auth.
- **convex-create-component** → Design and build isolated Convex components with clear boundaries.
- **convex-migration-helper** → Plan and execute safe schema/data migrations using widen-migrate-narrow workflow.
- **convex-performance-audit** → Audit and optimize Convex performance: hot-path reads, write contention, subscriptions.

---

### When to Use (Rule of Thumb)
1. **Planning task?** → brainstorming → writing-plans
2. **Bug or unclear issue?** → systematic-debugging first
3. **New feature?** → writing-plans → test-driven-development → (frontend-design + ui-ux-pro-max if UI) → implementation
4. **Multi-step parallel work?** → subagent-driven-development → dispatching-parallel-agents → executing-plans
5. **UI/UX work?** → ui-ux-pro-max → frontend-design
6. **Generating UI screens?** → enhance-prompt → taste-design → stitch-design → react-components
7. **Multi-page site?** → stitch-loop
8. **Convex backend work?** → convex-quickstart / convex-setup-auth / convex-create-component / convex-migration-helper / convex-performance-audit
9. **Done with feature?** → verification-before-completion → webapp-testing
10. **Ready to merge?** → requesting-code-review → finishing-a-development-branch

---

## Installed MCPs

- **StitchMCP** — generate UI screens from design system
- **21dev MagicUI** — premium components
- **Shadcn UI MCP**
- **Playwright MCP server** - to interact with the browser, take accessibility snapshots, and perform end-to-end testing via natural language
---

## First Message Every Session

"Read /docs/PRD.md and CLAUDE.md. Use skills from /skills."

---

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
