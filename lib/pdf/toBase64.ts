/**
 * lib/pdf/toBase64.ts
 * Converts a File object to a base64 string for Claude API document input.
 * CLAUDE.md rule: all Claude API calls go through /api routes, never client-side.
 */
export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}
