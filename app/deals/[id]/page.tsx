"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, AlertTriangle, CheckCircle2, XCircle, FileText, Printer, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RuleCheck = {
  parameter: string;
  coaValue: number;
  spec: string;
  result: "PASS" | "FAIL";
  reason: string;
  source: string;
};

type AnalysisViolation = {
  parameter: string;
  coaValue: number;
  spec: string;
  reason: string;
};

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: i * 0.07, ease: EASE },
  }),
};

export default function DealAnalysisPage() {
  const params = useParams<{ id: string }>();
  const dealId = params?.id ?? "";

  const deal = useQuery(api.deals.get, { id: dealId as Id<"deals"> });
  const analysisRun = useQuery(api.analyses.getByDeal, { dealId: dealId as Id<"deals"> });

  const isLoading = deal === undefined || analysisRun === undefined;

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-6">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#00D4FF" }} />
        </div>
      </main>
    );
  }

  if (!deal || !analysisRun) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-6">
        <section className="space-y-4">
          <Button asChild size="sm" variant="ghost" className="-ml-2 h-8 px-2 text-xs gap-1.5" style={{ color: "#8892A4" }}>
            <Link href="/deals">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Back to Deals
            </Link>
          </Button>
          <div className="border p-12 text-center space-y-4" style={{ borderColor: "#1C2D45", backgroundColor: "#0D1B2E" }}>
            <div
              className="flex h-12 w-12 mx-auto items-center justify-center border"
              style={{ borderColor: "#1C2D45" }}
            >
              <FileText className="h-5 w-5" style={{ color: "#1C2D45" }} aria-hidden />
            </div>
            <p className="text-sm font-semibold" style={{ color: "#E8EDF5" }}>Analysis not found</p>
            <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: "#8892A4" }}>
              This deal does not exist or the analysis has not completed yet.
            </p>
            <Button asChild size="sm" className="h-8 px-4 text-xs font-semibold" style={{ backgroundColor: "#00D4FF", color: "#0A0F1E" }}>
              <Link href="/deals/new">New Deal</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const checks = analysisRun.checks as RuleCheck[];
  const violations = analysisRun.violations as AnalysisViolation[];
  const isCompliant = analysisRun.status === "COMPLIANT";
  const passCount = checks.filter((c) => c.result === "PASS").length;
  const failCount = checks.filter((c) => c.result === "FAIL").length;
  const passPercent = checks.length > 0 ? Math.round((passCount / checks.length) * 100) : 0;

  const verdictColor = isCompliant ? "#00C896" : "#FF4757";
  const verdictGlowClass = isCompliant ? "tc-glow-compliant" : "tc-glow-violation";

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-6 print:max-w-none print:px-8">
      <section className="space-y-6">

        <div className="flex items-center justify-between print:hidden">
          <Button asChild size="sm" variant="ghost" className="-ml-2 h-8 px-2 text-xs gap-1.5" style={{ color: "#8892A4" }}>
            <Link href="/deals">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Back to Deals
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="h-8 px-3 text-xs gap-1.5 cursor-pointer"
            style={{ borderColor: "#1C2D45", color: "#8892A4", backgroundColor: "transparent" }}
          >
            <Printer className="h-3.5 w-3.5" aria-hidden />
            Export PDF
          </Button>
        </div>

        <AnimatePresence>
          <motion.header
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            className={`border p-5 space-y-4 ${verdictGlowClass}`}
            style={{ borderColor: verdictColor, backgroundColor: "#0D1B2E" }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <h1 className="text-lg font-bold tracking-tight" style={{ color: "#E8EDF5" }}>
                  {deal.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: "#8892A4" }}>
                  <span>Buyer: <span style={{ color: "#E8EDF5" }}>{deal.buyer}</span></span>
                  <span>Origin: <span style={{ color: "#E8EDF5" }}>{deal.origin}</span></span>
                  {deal.commodity && (
                    <span>Commodity: <span style={{ color: "#E8EDF5" }}>{deal.commodity}</span></span>
                  )}
                  {deal.quantity && (
                    <span>Qty: <span style={{ color: "#E8EDF5" }}>{deal.quantity}</span></span>
                  )}
                  {deal.deliveryMonth && (
                    <span>Delivery: <span style={{ color: "#E8EDF5" }}>{deal.deliveryMonth}</span></span>
                  )}
                  <span>Analysed: <span style={{ color: "#E8EDF5" }}>{new Date(analysisRun.executedAt).toLocaleString()}</span></span>
                </div>
              </div>
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: verdictColor, color: "#0A0F1E" }}
              >
                {isCompliant
                  ? <CheckCircle2 className="h-4 w-4" aria-hidden />
                  : <XCircle className="h-4 w-4" aria-hidden />}
                {isCompliant ? "COMPLIANT" : "NON_COMPLIANT"}
              </span>
            </div>

            {checks.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t" style={{ borderColor: "#1C2D45" }}>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span style={{ color: "#8892A4" }}>{checks.length} checks</span>
                  <span>
                    <span style={{ color: "#00C896" }}>{passCount} pass</span>
                    {failCount > 0 && <span style={{ color: "#FF4757" }}> · {failCount} fail</span>}
                    <span style={{ color: "#8892A4" }}> · {passPercent}%</span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden" style={{ backgroundColor: "#1C2D45" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                    style={{ backgroundColor: "#00C896" }}
                  />
                </div>
              </div>
            )}
          </motion.header>
        </AnimatePresence>

        {violations.length > 0 && (
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="border p-4 space-y-3"
            style={{ borderColor: "#FF4757", backgroundColor: "rgba(255,71,87,0.05)" }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" style={{ color: "#FF4757" }} aria-hidden />
              <p className="text-sm font-semibold" style={{ color: "#FF4757" }}>
                {violations.length} Violation{violations.length !== 1 ? "s" : ""} Detected
              </p>
            </div>
            <div className="space-y-2">
              {violations.map((v, i) => (
                <motion.div
                  key={`${v.parameter}-${v.spec}`}
                  variants={fadeUp} initial="hidden" animate="show" custom={i * 0.3 + 1.5}
                  className="flex items-start gap-3 text-xs border-l-2 pl-3 py-0.5"
                  style={{ borderColor: "#FF4757" }}
                >
                  <span>
                    <span className="font-semibold capitalize" style={{ color: "#E8EDF5" }}>{v.parameter}</span>
                    <span style={{ color: "#8892A4" }}> — {v.reason}</span>
                    <span className="ml-2 font-mono" style={{ color: "#8892A4" }}>
                      (spec: {v.spec}, got: {Number.isNaN(v.coaValue) ? "missing" : v.coaValue})
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="space-y-2"
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8892A4" }}>
            Parameter Comparison
          </p>
          <div className="border" style={{ borderColor: "#1C2D45" }}>
            <Table>
              <TableHeader>
                <TableRow
                  className="border-b hover:bg-transparent"
                  style={{ borderColor: "#1C2D45", backgroundColor: "#0D1B2E" }}
                >
                  {["Parameter", "COA Value", "Spec", "Source", "Result"].map((h) => (
                    <TableHead
                      key={h}
                      className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#8892A4" }}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.map((check, i) => (
                  <motion.tr
                    key={`${check.parameter}-${check.spec}`}
                    variants={fadeUp} initial="hidden" animate="show" custom={i * 0.04 + 2.5}
                    className="border-b last:border-0 tc-row-hover"
                    style={{
                      borderColor: "#1C2D45",
                      backgroundColor: check.result === "FAIL" ? "rgba(255,71,87,0.03)" : "transparent",
                    }}
                  >
                    <TableCell className="px-4 py-2.5 text-sm font-medium capitalize" style={{ color: "#E8EDF5" }}>
                      {check.parameter}
                    </TableCell>
                    <TableCell
                      className="px-4 py-2.5 text-sm font-mono tabular-nums"
                      style={{ color: Number.isNaN(check.coaValue) ? "#FF4757" : "#E8EDF5" }}
                    >
                      {Number.isNaN(check.coaValue) ? "—" : check.coaValue}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-sm font-mono" style={{ color: "#8892A4" }}>
                      {check.spec}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-xs" style={{ color: "#8892A4" }}>
                      {check.source}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold"
                        style={{
                          backgroundColor: check.result === "PASS"
                            ? "rgba(0,200,150,0.12)"
                            : "rgba(255,71,87,0.12)",
                          color: check.result === "PASS" ? "#00C896" : "#FF4757",
                        }}
                      >
                        {check.result === "PASS"
                          ? <CheckCircle2 className="h-3 w-3" aria-hidden />
                          : <XCircle className="h-3 w-3" aria-hidden />}
                        {check.result}
                      </span>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          {checks.length === 0 && (
            <p className="text-xs text-center py-6" style={{ color: "#8892A4" }}>
              No parameters were matched between COA and contract.
            </p>
          )}
        </motion.div>

        {(analysisRun.extractedCOA ?? analysisRun.extractedContract) && (
          <motion.details
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="border print:hidden"
            style={{ borderColor: "#1C2D45" }}
          >
            <summary
              className="px-4 py-3 text-xs font-semibold uppercase tracking-widest cursor-pointer select-none list-none transition-colors hover:text-[#E8EDF5]"
              style={{ color: "#8892A4", backgroundColor: "#0D1B2E" }}
            >
              ▸ Raw Extracted Values
            </summary>
            <div className="grid grid-cols-1 gap-px md:grid-cols-2" style={{ backgroundColor: "#1C2D45" }}>
              {analysisRun.extractedCOA && (
                <div className="p-4 space-y-2" style={{ backgroundColor: "#0A0F1E" }}>
                  <p className="text-xs font-semibold" style={{ color: "#8892A4" }}>COA Parameters</p>
                  <pre className="text-xs font-mono overflow-auto leading-relaxed" style={{ color: "#E8EDF5" }}>
                    {JSON.stringify(analysisRun.extractedCOA, null, 2)}
                  </pre>
                </div>
              )}
              {analysisRun.extractedContract && (
                <div className="p-4 space-y-2" style={{ backgroundColor: "#0A0F1E" }}>
                  <p className="text-xs font-semibold" style={{ color: "#8892A4" }}>Contract Specs</p>
                  <pre className="text-xs font-mono overflow-auto leading-relaxed" style={{ color: "#E8EDF5" }}>
                    {JSON.stringify(analysisRun.extractedContract, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.details>
        )}

      </section>
    </main>
  );
}
