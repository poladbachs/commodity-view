/**
 * lib/extraction/extractContract.ts
 * Calls Claude API to extract quality specifications from a commodity contract.
 *
 * CLAUDE.md rules:
 * - Claude API is for extraction ONLY — never for compliance decisions
 * - _min suffix = minimum required value (COA must be >= spec)
 * - _max suffix = maximum allowed value (COA must be <= spec)
 */

const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

const CONTRACT_PROMPT = `You are extracting quality specifications from a commodity trade contract.

Extract ALL numeric quality specifications you find (protein, moisture, oil, fat, ash, fiber, starch, etc.).
Return ONLY a valid JSON object using _min and _max suffixes to indicate the type of limit.

Rules:
- Use _min suffix for MINIMUM required values (e.g., protein must be AT LEAST X)
- Use _max suffix for MAXIMUM allowed values (e.g., moisture must be NO MORE THAN X)
- Parameter names: lowercase, no spaces (same names as would appear in a COA)
- Values: numeric only (no units, no ranges)
- If a parameter has both min and max, include both (e.g., "protein_min": 12.5 AND "protein_max": 15.0)
- Do not include non-quality fields

Example output:
{"protein_min": 12.5, "moisture_max": 13.5, "oil_min": 40.0, "ash_max": 3.0}

Return ONLY the JSON. No explanation. No markdown. No trailing text.`;

export type ContractExtraction = Record<string, number>;

export async function extractContract(pdfBase64: string): Promise<ContractExtraction> {
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
            { type: "text", text: CONTRACT_PROMPT },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Claude API error extracting Contract (HTTP ${response.status}): ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    content: { type: string; text: string }[];
  };

  const raw = data.content[0]?.text ?? "";
  const cleaned = raw.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;
    const result: ContractExtraction = {};
    for (const [k, v] of Object.entries(parsed)) {
      const key = k.toLowerCase().trim();
      if ((key.endsWith("_min") || key.endsWith("_max")) && typeof v === "number" && Number.isFinite(v)) {
        result[key] = v;
      }
    }
    if (Object.keys(result).length === 0) {
      throw new Error("No quality specifications extracted from contract. Ensure the PDF contains _min/_max quality specs.");
    }
    return result;
  } catch (parseError) {
    throw new Error(
      `Contract extraction returned invalid JSON. Raw response: ${raw.slice(0, 300)}. Parse error: ${parseError instanceof Error ? parseError.message : String(parseError)}`
    );
  }
}
