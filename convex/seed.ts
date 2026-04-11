/**
 * convex/seed.ts
 * Mock data for UI testing without burning Claude API tokens
 */

export const MOCK_DEALS = [
  {
    title: "SOCAR Soya Tocopherol",
    buyer: "AgroTrade Inc",
    origin: "Argentina",
    commodity: "Soya",
    quantity: "500 MT",
    deliveryMonth: "April 2026",
    status: "NON_COMPLIANT" as const,
  },
  {
    title: "Vitol Crude Oil WTI",
    buyer: "Shell Energy",
    origin: "USA",
    commodity: "Crude Oil",
    quantity: "50,000 BBL",
    deliveryMonth: "May 2026",
    status: "COMPLIANT" as const,
  },
];

export const MOCK_ANALYSES = {
  noncompliant: {
    status: "NON_COMPLIANT" as const,
    checks: [
      {
        parameter: "protein",
        coaValue: 11.8,
        spec: "≥ 12.0",
        result: "FAIL" as const,
        reason: "Protein content below minimum specification",
        source: "COA vs Contract",
      },
      {
        parameter: "moisture",
        coaValue: 13.2,
        spec: "≤ 13.0",
        result: "FAIL" as const,
        reason: "Moisture exceeds maximum allowable",
        source: "COA vs Contract",
      },
      {
        parameter: "oil",
        coaValue: 42.5,
        spec: "≥ 40.0",
        result: "PASS" as const,
        reason: "",
        source: "COA vs Contract",
      },
      {
        parameter: "ash",
        coaValue: 2.1,
        spec: "≤ 2.5",
        result: "PASS" as const,
        reason: "",
        source: "COA vs Contract",
      },
      {
        parameter: "fiber",
        coaValue: 3.8,
        spec: "≤ 4.0",
        result: "PASS" as const,
        reason: "",
        source: "COA vs Contract",
      },
    ] as any[],
    violations: [
      {
        parameter: "protein",
        coaValue: 11.8,
        spec: "≥ 12.0",
        reason: "Measured protein is 11.8, below the contract minimum of 12.0",
      },
      {
        parameter: "moisture",
        coaValue: 13.2,
        spec: "≤ 13.0",
        reason: "Measured moisture is 13.2%, exceeds the contract maximum of 13.0%",
      },
    ] as any[],
    extractedCOA: {
      protein: 11.8,
      moisture: 13.2,
      oil: 42.5,
      ash: 2.1,
      fiber: 3.8,
      starch: 58.2,
    },
    extractedContract: {
      protein_min: 12.0,
      moisture_max: 13.0,
      oil_min: 40.0,
      ash_max: 2.5,
      fiber_max: 4.0,
    },
  },
  compliant: {
    status: "COMPLIANT" as const,
    checks: [
      {
        parameter: "api",
        coaValue: 32.5,
        spec: "≤ 35.0",
        result: "PASS" as const,
        reason: "",
        source: "COA vs Contract",
      },
      {
        parameter: "sulphur",
        coaValue: 0.45,
        spec: "≤ 0.5",
        result: "PASS" as const,
        reason: "",
        source: "COA vs Contract",
      },
      {
        parameter: "density",
        coaValue: 0.862,
        spec: "0.8 to 0.9",
        result: "PASS" as const,
        reason: "",
        source: "COA vs Contract",
      },
      {
        parameter: "flash_point",
        coaValue: 210,
        spec: "≥ 200",
        result: "PASS" as const,
        reason: "",
        source: "COA vs Contract",
      },
    ] as any[],
    violations: [] as any[],
    extractedCOA: {
      api: 32.5,
      sulphur: 0.45,
      density: 0.862,
      flash_point: 210,
    },
    extractedContract: {
      api_max: 35.0,
      sulphur_max: 0.5,
      density_min: 0.8,
      density_max: 0.9,
      flash_point_min: 200,
    },
  },
};
