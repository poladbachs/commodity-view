/**
 * lib/rules/runChecks.ts
 * Deterministic rule engine — compares COA values against contract specs.
 *
 * CLAUDE.md rules:
 * - Rule engine is ALWAYS deterministic — same input always produces same output
 * - Claude API is for extraction only — ALL compliance decisions happen here
 * - _min suffix: COA value must be >= spec
 * - _max suffix: COA value must be <= spec
 */

import type { COAExtraction } from "@/lib/extraction/extractCOA";
import type { ContractExtraction } from "@/lib/extraction/extractContract";

export type CheckResult = {
  parameter: string;
  coaValue: number;
  spec: string;
  result: "PASS" | "FAIL";
  reason: string;
  source: string; // traceability — which documents were compared
};

export type Violation = {
  parameter: string;
  coaValue: number;
  spec: string;
  reason: string;
};

export type RunChecksResult = {
  checks: CheckResult[];
  violations: Violation[];
  status: "COMPLIANT" | "NON_COMPLIANT";
};

export function runChecks(
  coaValues: COAExtraction,
  contractSpecs: ContractExtraction
): RunChecksResult {
  const checks: CheckResult[] = [];

  // Check minimums: COA value must be >= spec
  for (const [key, minValue] of Object.entries(contractSpecs)) {
    if (!key.endsWith("_min")) continue;
    const param = key.replace("_min", "");
    const coaValue = coaValues[param];

    if (coaValue === undefined) {
      // Parameter in contract but not in COA — flag as unverifiable
      checks.push({
        parameter: param,
        coaValue: NaN,
        spec: `≥ ${minValue}`,
        result: "FAIL",
        reason: `Parameter "${param}" required by contract but not found in COA`,
        source: "Contract spec / COA (missing)",
      });
      continue;
    }

    const pass = coaValue >= minValue;
    checks.push({
      parameter: param,
      coaValue,
      spec: `≥ ${minValue}`,
      result: pass ? "PASS" : "FAIL",
      reason: pass ? "" : `${coaValue} is below minimum ${minValue} (shortfall: ${(minValue - coaValue).toFixed(2)})`,
      source: "COA vs Contract",
    });
  }

  // Check maximums: COA value must be <= spec
  for (const [key, maxValue] of Object.entries(contractSpecs)) {
    if (!key.endsWith("_max")) continue;
    const param = key.replace("_max", "");
    const coaValue = coaValues[param];

    if (coaValue === undefined) {
      checks.push({
        parameter: param,
        coaValue: NaN,
        spec: `≤ ${maxValue}`,
        result: "FAIL",
        reason: `Parameter "${param}" required by contract but not found in COA`,
        source: "Contract spec / COA (missing)",
      });
      continue;
    }

    const pass = coaValue <= maxValue;
    checks.push({
      parameter: param,
      coaValue,
      spec: `≤ ${maxValue}`,
      result: pass ? "PASS" : "FAIL",
      reason: pass ? "" : `${coaValue} exceeds maximum ${maxValue} (excess: ${(coaValue - maxValue).toFixed(2)})`,
      source: "COA vs Contract",
    });
  }

  const violations: Violation[] = checks
    .filter((c) => c.result === "FAIL")
    .map((c) => ({
      parameter: c.parameter,
      coaValue: c.coaValue,
      spec: c.spec,
      reason: c.reason,
    }));

  const status = violations.length > 0 ? "NON_COMPLIANT" : "COMPLIANT";

  return { checks, violations, status };
}
