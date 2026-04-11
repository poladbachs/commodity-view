"use client";

import {
  type ChangeEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ANALYSIS_STAGE_LABELS,
  ANALYSIS_STAGES,
  MIN_ANALYSIS_DURATION_MS,
} from "@/lib/analysis-flow";

/* ─── types ─────────────────────────────────────────────────────────────────── */
type DealForm = {
  dealName: string;
  buyer: string;
  origin: string;
  commodity: string;
  quantity: string;
  deliveryMonth: string;
};

type UploadKind = "coa" | "contract";

type AnalysisResponse = {
  status: "COMPLIANT" | "NON_COMPLIANT";
  violations: { parameter: string; coaValue: number; spec: string; reason: string }[];
  checks: {
    parameter: string;
    coaValue: number;
    spec: string;
    result: "PASS" | "FAIL";
    reason: string;
    source: string;
  }[];
  deal: DealForm;
  extractedCOA?: Record<string, number>;
  extractedContract?: Record<string, number>;
};

/* ─── utils ──────────────────────────────────────────────────────────────────── */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const initialForm: DealForm = {
  dealName: "",
  buyer: "",
  origin: "",
  commodity: "",
  quantity: "",
  deliveryMonth: "",
};

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── FormField ──────────────────────────────────────────────────────────────── */
function FormField({
  label,
  required,
  value,
  onChange,
  placeholder,
  id,
  hint,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  id: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-xs font-medium" style={{ color: "#8892A4" }}>
        {label}
        {required && (
          <span style={{ color: "#FF4757" }} aria-label="required">*</span>
        )}
      </label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="h-9 text-xs border font-mono focus-visible:ring-1 focus-visible:ring-[#00D4FF] focus-visible:ring-offset-0"
        style={{
          backgroundColor: "#0A0F1E",
          borderColor: "#1C2D45",
          color: "#E8EDF5",
          borderRadius: 0,
        }}
      />
      {hint && (
        <p className="text-xs" style={{ color: "#1C2D45" }}>{hint}</p>
      )}
    </div>
  );
}

/* ─── UploadZone ─────────────────────────────────────────────────────────────── */
function UploadZone({
  title,
  subtitle,
  label,
  file,
  onChange,
  onRemove,
  inputRef,
  id,
  onFileDrop,
}: {
  title: string;
  subtitle: string;
  label: string;
  file: File | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  id: string;
  onFileDrop: (f: File) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return;
    onFileDrop(f);
  };

  return (
    <div className="space-y-3 h-full">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8892A4" }}>
          {label}
        </p>
        <p className="text-sm font-semibold mt-1" style={{ color: "#E8EDF5" }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "#8892A4" }}>{subtitle}</p>
      </div>

      {/* Drop zone / uploaded state */}
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-between border px-4 py-3 tc-glow-accent min-h-[80px]"
            style={{ borderColor: "#00D4FF", backgroundColor: "rgba(0,212,255,0.05)" }}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className="flex-shrink-0 flex items-center justify-center h-8 w-8 border"
                style={{ borderColor: "#00D4FF", backgroundColor: "rgba(0,212,255,0.1)" }}
              >
                <FileText className="h-4 w-4" style={{ color: "#00D4FF" }} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold font-mono" style={{ color: "#E8EDF5" }}>
                  {file.name}
                </p>
                <p className="text-xs font-mono mt-0.5" style={{ color: "#8892A4" }}>
                  {formatFileSize(file.size)} · PDF · Ready
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="ml-3 flex-shrink-0 p-1.5 transition-colors cursor-pointer hover:text-[#E8EDF5]"
              style={{ color: "#8892A4" }}
              aria-label={`Remove ${title}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="dropzone"
            type="button"
            id={id}
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col w-full cursor-pointer items-center justify-center border border-dashed transition-all duration-200 gap-2.5 min-h-[120px] py-8"
            style={{
              borderColor: dragging ? "#00D4FF" : "#1C2D45",
              backgroundColor: dragging ? "rgba(0,212,255,0.05)" : "transparent",
              boxShadow: dragging ? "0 0 0 1px #00D4FF, 0 0 12px rgba(0,212,255,0.1)" : "none",
            }}
            aria-label={`Upload ${title} PDF`}
          >
            <Upload
              className="h-5 w-5 transition-all duration-200"
              style={{
                color: dragging ? "#00D4FF" : "#1C2D45",
                transform: dragging ? "translateY(-2px)" : "none",
              }}
              aria-hidden
            />
            <div className="text-center space-y-0.5">
              <p className="text-xs font-medium" style={{ color: dragging ? "#00D4FF" : "#8892A4" }}>
                {dragging ? "Drop to upload" : "Click or drag & drop"}
              </p>
              <p className="text-xs font-mono" style={{ color: "#1C2D45" }}>
                PDF only
              </p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={onChange}
        className="hidden"
        aria-hidden
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════════ */
export default function NewDealPage() {
  const router = useRouter();
  const createDeal = useMutation(api.deals.create);
  const createAnalysis = useMutation(api.analyses.create);
  const updateStatus = useMutation(api.deals.updateStatus);

  const [form, setForm] = useState<DealForm>(initialForm);
  const [coaFile, setCoaFile] = useState<File | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string>("");
  const [stageIndex, setStageIndex] = useState(0);

  const coaRef = useRef<HTMLInputElement>(null);
  const contractRef = useRef<HTMLInputElement>(null);
  const timerIdsRef = useRef<number[]>([]);

  useEffect(() => () => { timerIdsRef.current.forEach(clearTimeout); }, []);

  const hasRequired = form.dealName.trim() && form.buyer.trim() && form.origin.trim();
  const canRun = Boolean(hasRequired) && Boolean(coaFile) && Boolean(contractFile);

  const missingFields = useMemo(() => {
    const m: string[] = [];
    if (!form.dealName.trim()) m.push("Deal Name");
    if (!form.buyer.trim()) m.push("Buyer");
    if (!form.origin.trim()) m.push("Origin");
    return m;
  }, [form]);

  const missingDocs = useMemo(() => {
    const d: string[] = [];
    if (!coaFile) d.push("COA");
    if (!contractFile) d.push("Contract");
    return d;
  }, [coaFile, contractFile]);

  const validationLine = useMemo(() => {
    if (canRun) return null; // show green indicator separately
    if (missingFields.length > 0 && missingDocs.length > 0)
      return `Missing: ${missingFields.join(", ")} · ${missingDocs.join(", ")} PDF`;
    if (missingFields.length > 0)
      return `Required fields: ${missingFields.join(", ")}`;
    if (missingDocs.length > 0)
      return `Upload ${missingDocs.join(" and ")} PDF${missingDocs.length > 1 ? "s" : ""}`;
    return null;
  }, [canRun, missingFields, missingDocs]);

  const handleField = (field: keyof DealForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleFile = (kind: UploadKind) => (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      e.target.value = "";
      return;
    }
    kind === "coa" ? setCoaFile(f) : setContractFile(f);
    e.target.value = "";
  };

  const handleFileDrop = (kind: UploadKind) => (f: File) => {
    kind === "coa" ? setCoaFile(f) : setContractFile(f);
  };

  const handleRunAnalysis = () => {
    if (!canRun || !coaFile || !contractFile) return;
    setAnalysisError("");
    setIsAnalyzing(true);
    setStageIndex(0);
    const start = Date.now();

    timerIdsRef.current.forEach(clearTimeout);
    const ids: number[] = [];
    let cum = 0;
    for (let i = 0; i < ANALYSIS_STAGES.length - 1; i++) {
      cum += ANALYSIS_STAGES[i].durationMs;
      ids.push(window.setTimeout(() => setStageIndex(i + 1), cum));
    }
    timerIdsRef.current = ids;

    const run = async () => {
      const fd = new FormData();
      fd.append("coa", coaFile);
      fd.append("contract", contractFile);
      fd.append("deal", JSON.stringify(form));

      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(err?.error ?? "Analysis failed.");
      }

      const analysis = (await res.json()) as AnalysisResponse;
      const elapsed = Date.now() - start;
      if (elapsed < MIN_ANALYSIS_DURATION_MS) {
        await new Promise<void>((r) => setTimeout(r, MIN_ANALYSIS_DURATION_MS - elapsed));
      }

      const dealId = await createDeal({
        title: form.dealName,
        buyer: form.buyer,
        origin: form.origin,
        commodity: form.commodity.trim() || undefined,
        quantity: form.quantity.trim() || undefined,
        deliveryMonth: form.deliveryMonth.trim() || undefined,
      });

      await Promise.all([
        createAnalysis({
          dealId,
          status: analysis.status,
          checks: analysis.checks,
          violations: analysis.violations,
          extractedCOA: analysis.extractedCOA,
          extractedContract: analysis.extractedContract,
          engineVersion: "1.0",
        }),
        updateStatus({ id: dealId, status: analysis.status }),
      ]);

      router.push(`/deals/${dealId}`);
    };

    run()
      .catch((e: unknown) =>
        setAnalysisError(e instanceof Error ? e.message : "Analysis failed."),
      )
      .finally(() => {
        timerIdsRef.current.forEach(clearTimeout);
        timerIdsRef.current = [];
        setStageIndex(0);
        setIsAnalyzing(false);
      });
  };

  return (
    <>
      {/* ── Analysis overlay ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(10,15,30,0.88)", backdropFilter: "blur(6px)" }}
            role="dialog"
            aria-modal
            aria-label="Running compliance analysis"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="w-full max-w-sm border space-y-5 overflow-hidden"
              style={{ backgroundColor: "#0D1B2E", borderColor: "#1C2D45" }}
            >
              {/* Top bar */}
              <div
                className="h-px w-full"
                style={{ background: "linear-gradient(90deg, #00D4FF, transparent)" }}
                aria-hidden
              />

              <div className="px-6 pb-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" style={{ color: "#00D4FF" }} aria-hidden />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#E8EDF5" }}>
                      Running compliance analysis
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#8892A4" }}>
                      Claude is reading both documents
                    </p>
                  </div>
                </div>

                {/* Stage progress */}
                <ol className="space-y-2.5" aria-label="Analysis progress">
                  {ANALYSIS_STAGE_LABELS.map((label, i) => {
                    const done = i < stageIndex;
                    const active = i === stageIndex;
                    return (
                      <li key={label} className="flex items-center gap-3">
                        <div className="relative flex-shrink-0 h-4 w-4 flex items-center justify-center">
                          {done ? (
                            <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#00C896" }} aria-hidden />
                          ) : active ? (
                            <div
                              className="h-1.5 w-1.5 rounded-full tc-pulse"
                              style={{ backgroundColor: "#00D4FF" }}
                              aria-hidden
                            />
                          ) : (
                            <div
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: "#1C2D45" }}
                              aria-hidden
                            />
                          )}
                        </div>
                        <span
                          className="text-xs font-mono"
                          style={{
                            color: done ? "#00C896" : active ? "#E8EDF5" : "#8892A4",
                          }}
                          aria-current={active ? "step" : undefined}
                        >
                          {label}
                          {done && <span className="ml-1.5 opacity-70">✓</span>}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <p className="text-xs leading-relaxed" style={{ color: "#8892A4" }}>
                  Extracting quality parameters, applying deterministic rules, preparing compliance report.
                  Typically under 30 seconds.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main layout ─────────────────────────────────────────────────────────── */}
      <main
        className="mx-auto w-full max-w-5xl px-4 lg:px-6 py-6"
        aria-busy={isAnalyzing}
      >
        <div className="space-y-6">

          {/* Back + breadcrumb */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/deals"
              className="inline-flex items-center gap-1 text-xs transition-colors hover:text-[#E8EDF5] cursor-pointer"
              style={{ color: "#8892A4" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Deals
            </Link>
            <span style={{ color: "#1C2D45" }}>/</span>
            <span className="text-xs font-mono" style={{ color: "#8892A4" }}>New Deal</span>
          </div>

          {/* Page header */}
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "#E8EDF5" }}>
              New Deal
            </h1>
            <p className="mt-0.5 text-xs" style={{ color: "#8892A4" }}>
              Fill in deal details and upload both documents to run a compliance analysis.
            </p>
          </div>

          {/* ── Two-column layout ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* LEFT — Deal Information */}
            <div
              className="border p-5 space-y-5"
              style={{ borderColor: "#1C2D45", backgroundColor: "#0D1B2E" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold" style={{ color: "#1C2D45" }}>01</span>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8892A4" }}>
                  Deal Information
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField
                    id="dealName"
                    label="Deal Name"
                    required
                    value={form.dealName}
                    onChange={handleField("dealName")}
                    placeholder="Wheat — Nov 2026 — 25,000 MT"
                  />
                </div>
                <FormField
                  id="buyer"
                  label="Buyer"
                  required
                  value={form.buyer}
                  onChange={handleField("buyer")}
                  placeholder="ABC Trading Ltd"
                />
                <FormField
                  id="origin"
                  label="Origin"
                  required
                  value={form.origin}
                  onChange={handleField("origin")}
                  placeholder="Black Sea"
                />
                <FormField
                  id="commodity"
                  label="Commodity"
                  value={form.commodity}
                  onChange={handleField("commodity")}
                  placeholder="Wheat"
                />
                <FormField
                  id="quantity"
                  label="Quantity"
                  value={form.quantity}
                  onChange={handleField("quantity")}
                  placeholder="25,000 MT"
                />
                <div className="sm:col-span-2">
                  <FormField
                    id="deliveryMonth"
                    label="Delivery Month"
                    value={form.deliveryMonth}
                    onChange={handleField("deliveryMonth")}
                    placeholder="November 2026"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT — Documents */}
            <div
              className="border p-5 space-y-5"
              style={{ borderColor: "#1C2D45", backgroundColor: "#0D1B2E" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold" style={{ color: "#1C2D45" }}>02</span>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8892A4" }}>
                  Documents
                </p>
              </div>

              <div
                className="grid grid-cols-1 gap-4"
                style={{ gridTemplateRows: "1fr 1fr" }}
              >
                {/* COA */}
                <div
                  className="border p-4"
                  style={{
                    borderColor: coaFile ? "#00D4FF" : "#1C2D45",
                    backgroundColor: coaFile ? "rgba(0,212,255,0.02)" : "transparent",
                    transition: "border-color 200ms, background-color 200ms",
                  }}
                >
                  <UploadZone
                    id="coa-upload"
                    label="Document 01"
                    title="Certificate of Analysis (COA)"
                    subtitle="Quality parameters issued by the inspection authority"
                    file={coaFile}
                    onChange={handleFile("coa")}
                    onRemove={() => setCoaFile(null)}
                    onFileDrop={handleFileDrop("coa")}
                    inputRef={coaRef}
                  />
                </div>

                {/* Contract */}
                <div
                  className="border p-4"
                  style={{
                    borderColor: contractFile ? "#00D4FF" : "#1C2D45",
                    backgroundColor: contractFile ? "rgba(0,212,255,0.02)" : "transparent",
                    transition: "border-color 200ms, background-color 200ms",
                  }}
                >
                  <UploadZone
                    id="contract-upload"
                    label="Document 02"
                    title="Contract / Specifications"
                    subtitle="Quality requirements and tolerance limits from the contract"
                    file={contractFile}
                    onChange={handleFile("contract")}
                    onRemove={() => setContractFile(null)}
                    onFileDrop={handleFileDrop("contract")}
                    inputRef={contractRef}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Error banner ──────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {analysisError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="flex items-start gap-3 border px-4 py-3"
                style={{ borderColor: "#FF4757", backgroundColor: "rgba(255,71,87,0.06)" }}
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#FF4757" }} aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: "#FF4757" }}>Analysis failed</p>
                  <p className="text-xs mt-0.5" style={{ color: "#FF4757", opacity: 0.8 }}>{analysisError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAnalysisError("")}
                  className="flex-shrink-0 cursor-pointer transition-opacity hover:opacity-60"
                  style={{ color: "#FF4757" }}
                  aria-label="Dismiss error"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Actions bar ───────────────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between gap-4 pt-1 border-t"
            style={{ borderColor: "#1C2D45" }}
          >
            {/* Validation hint */}
            <p className="text-xs" style={{ color: canRun ? "#00C896" : "#8892A4" }}>
              {canRun ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" aria-hidden />
                  Ready — click Run Analysis
                </span>
              ) : (
                validationLine ?? "Fill in required fields and upload both PDFs"
              )}
            </p>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Save draft — ghost */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!hasRequired || isAnalyzing}
                className="h-8 px-3 text-xs cursor-pointer border"
                style={{
                  borderColor: "#1C2D45",
                  color: "#8892A4",
                  backgroundColor: "transparent",
                  opacity: !hasRequired || isAnalyzing ? 0.4 : 1,
                  cursor: !hasRequired || isAnalyzing ? "not-allowed" : "pointer",
                }}
                aria-disabled={!hasRequired || isAnalyzing}
                title="Save draft (coming soon)"
              >
                Save Draft
              </Button>

              {/* Run Analysis — primary */}
              <Button
                type="button"
                size="sm"
                disabled={!canRun || isAnalyzing}
                onClick={handleRunAnalysis}
                className="h-8 px-4 text-xs font-semibold gap-1.5 transition-all"
                style={{
                  backgroundColor: canRun && !isAnalyzing ? "#00D4FF" : "#1C2D45",
                  color: canRun && !isAnalyzing ? "#0A0F1E" : "#8892A4",
                  cursor: canRun && !isAnalyzing ? "pointer" : "not-allowed",
                  boxShadow: canRun && !isAnalyzing ? "0 0 16px rgba(0,212,255,0.2)" : "none",
                }}
                aria-disabled={!canRun || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                    Analysing…
                  </>
                ) : (
                  <>
                    Run Analysis →
                  </>
                )}
              </Button>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
