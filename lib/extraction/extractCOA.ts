/**
 * lib/extraction/extractCOA.ts
 * Calls Claude API to extract quality parameters from a COA PDF.
 *
 * CLAUDE.md rules:
 * - Claude API is for extraction ONLY — never for compliance decisions
 * - Every extracted value must be traceable to its source document
 * - If extraction fails, throw — never return fake data
 */

const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

const COA_PROMPT = `You are extracting quality parameters from a Certificate of Analysis (COA) for a commodity shipment.

Extract ALL numeric quality parameters you find (protein, moisture, oil, fat, ash, fiber, starch, etc.).
Return ONLY a valid JSON object where keys are lowercase parameter names and values are numbers.

Rules:
- Parameter names: lowercase, no spaces (use underscores if needed)
- Values: numeric only (no units, no ranges — use the actual measured value)
- If a parameter appears multiple times, use the primary/final certified value
- Do not include non-numeric fields (dates, reference numbers, etc.)

Example output:
{"protein": 12.3, "moisture": 13.1, "oil": 42.5, "ash": 2.1, "fiber": 3.8}

Return ONLY the JSON. No explanation. No markdown. No trailing text.`;

export type COAExtraction = Record<string, number>;

export async function extractCOA(pdfBase64: string): Promise<COAExtraction> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured on the server.");

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfBase64,
              },
            },
            { type: "text", text: COA_PROMPT },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Claude API error extracting COA (HTTP ${response.status}): ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    content: { type: string; text: string }[];
  };

  const raw = data.content[0]?.text ?? "";
  const cleaned = raw.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;
    // Validate: keep only numeric values
    const result: COAExtraction = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "number" && Number.isFinite(v)) {
        result[k.toLowerCase().trim()] = v;
      }
    }
    if (Object.keys(result).length === 0) {
      throw new Error("No numeric parameters extracted from COA. Check if the PDF contains quality parameters.");
    }
    return result;
  } catch (parseError) {
    throw new Error(
      `COA extraction returned invalid JSON. Raw response: ${raw.slice(0, 300)}. Parse error: ${parseError instanceof Error ? parseError.message : String(parseError)}`
    );
  }
}
