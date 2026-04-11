/**
 * app/api/analyze/route.ts
 * POST /api/analyze
 *
 * Receives: FormData with COA PDF + Contract PDF + deal metadata
 * Validates: files present, required fields filled
 * Extracts: calls Claude API for each PDF (server-side only)
 * Checks: deterministic rule engine — Claude never makes compliance decisions
 * Returns: { status, violations, checks, extractedCOA, extractedContract, deal }
 *
 * CLAUDE.md rules enforced here:
 * - Claude API = extraction only, never compliance decisions
 * - Rule engine is always deterministic
 * - Never expose API keys client-side (all calls here, server-only)
 * - No mock data — if extraction fails, return error
 */

import { extractCOA } from "@/lib/extraction/extractCOA";
import { extractContract } from "@/lib/extraction/extractContract";
import { runChecks } from "@/lib/rules/runChecks";
import { fileToBase64 } from "@/lib/pdf/toBase64";
import { ANALYSIS_STAGES } from "@/lib/analysis-flow";

type DealMetadata = {
  dealName: string;
  buyer: string;
  origin: string;
  commodity?: string;
  quantity?: string;
  deliveryMonth?: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const coaFile = formData.get("coa");
    const contractFile = formData.get("contract");
    const dealRaw = formData.get("deal");

    // --- Validate inputs ---
    if (!(coaFile instanceof File) || !(contractFile instanceof File)) {
      return Response.json(
        { error: "Both COA and Contract PDF files are required." },
        { status: 400 }
      );
    }

    if (typeof dealRaw !== "string") {
      return Response.json({ error: "Deal metadata is required." }, { status: 400 });
    }

    let deal: DealMetadata;
    try {
      deal = JSON.parse(dealRaw) as DealMetadata;
    } catch {
      return Response.json({ error: "Invalid deal metadata JSON." }, { status: 400 });
    }

    if (
      !deal.dealName?.trim() ||
      !deal.buyer?.trim() ||
      !deal.origin?.trim()
    ) {
      return Response.json(
        { error: "Deal Name, Buyer, and Origin are required fields." },
        { status: 400 }
      );
    }

    // --- Stage 1: Upload received ---
    await sleep(ANALYSIS_STAGES[0].durationMs);

    // --- Stage 2: Extract from both PDFs in parallel via Claude API ---
    const [coaBase64, contractBase64] = await Promise.all([
      fileToBase64(coaFile),
      fileToBase64(contractFile),
    ]);

    const [coaValues, contractSpecs] = await Promise.all([
      extractCOA(coaBase64),
      extractContract(contractBase64),
    ]);

    // --- Stage 3: Run deterministic rule engine ---
    // Claude never touches this — compliance is always deterministic
    await sleep(ANALYSIS_STAGES[2].durationMs);
    const { checks, violations, status } = runChecks(coaValues, contractSpecs);

    // --- Stage 4: Prepare report ---
    await sleep(ANALYSIS_STAGES[3].durationMs);

    return Response.json({
      status,
      violations,
      checks,
      deal,
      extractedCOA: coaValues,
      extractedContract: contractSpecs,
      stages: ANALYSIS_STAGES.map((s) => s.label),
    });

  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error during analysis.";
    console.error("[/api/analyze]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
