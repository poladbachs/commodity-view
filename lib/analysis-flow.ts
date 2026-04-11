export const ANALYSIS_STAGES = [
  { key: "upload", label: "Uploading files", durationMs: 450 },
  { key: "extract", label: "Extracting values", durationMs: 900 },
  { key: "rules", label: "Applying rules", durationMs: 850 },
  { key: "report", label: "Preparing report", durationMs: 650 },
] as const;

export const MIN_ANALYSIS_DURATION_MS = ANALYSIS_STAGES.reduce(
  (total, stage) => total + stage.durationMs,
  0,
);

export const ANALYSIS_STAGE_LABELS = ANALYSIS_STAGES.map((stage) => stage.label);
