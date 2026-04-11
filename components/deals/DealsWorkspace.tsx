"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  FileSearch,
  Search,
  X,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Deal = Doc<"deals">;
type FilterStatus = "ALL" | "COMPLIANT" | "NON_COMPLIANT" | "PENDING";
type DateRange = "all" | "week" | "month";

/* ─── helpers ────────────────────────────────────────────────────────────────── */
function formatRelativeTime(createdAt: number): string {
  const elapsed = Date.now() - createdAt;
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function isWithinRange(createdAt: number, range: DateRange): boolean {
  if (range === "all") return true;
  const now = Date.now();
  if (range === "week") return now - createdAt < 7 * 24 * 60 * 60 * 1000;
  if (range === "month") return now - createdAt < 30 * 24 * 60 * 60 * 1000;
  return true;
}

/* ─── status badge ───────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: Deal["status"] }) {
  if (status === "COMPLIANT") {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold font-mono"
        style={{ backgroundColor: "rgba(0,200,150,0.1)", color: "#00C896", border: "1px solid rgba(0,200,150,0.2)" }}
        aria-label="Status: Compliant"
      >
        <CheckCircle2 className="h-3 w-3" aria-hidden />
        COMPLIANT
      </motion.span>
    );
  }
  if (status === "NON_COMPLIANT") {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold font-mono"
        style={{ backgroundColor: "rgba(255,71,87,0.1)", color: "#FF4757", border: "1px solid rgba(255,71,87,0.2)" }}
        aria-label="Status: Non-compliant"
      >
        <XCircle className="h-3 w-3" aria-hidden />
        NON_COMPLIANT
      </motion.span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold font-mono"
      style={{ backgroundColor: "rgba(136,146,164,0.08)", color: "#8892A4", border: "1px solid #1C2D45" }}
      aria-label="Status: Pending"
    >
      <Clock className="h-3 w-3" aria-hidden />
      PENDING
    </span>
  );
}

/* ─── skeleton row ───────────────────────────────────────────────────────────── */
function SkeletonRow({ i }: { i: number }) {
  return (
    <tr
      style={{
        borderBottom: "1px solid #1C2D45",
        opacity: 1 - i * 0.2,
      }}
    >
      {[120, 72, 96, 88, 90, 64, 32].map((w, j) => (
        <td key={j} className="px-4 py-3">
          <div
            className="h-3 animate-pulse"
            style={{ width: w, backgroundColor: "#1C2D45", maxWidth: "100%" }}
          />
        </td>
      ))}
    </tr>
  );
}

/* ─── empty state ────────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-24 space-y-5"
    >
      <div
        className="flex h-14 w-14 items-center justify-center border"
        style={{ borderColor: "#1C2D45", backgroundColor: "#0D1B2E" }}
      >
        <FileSearch className="h-6 w-6" style={{ color: "#1C2D45" }} aria-hidden />
      </div>
      <div className="text-center space-y-1.5">
        <p className="text-sm font-semibold" style={{ color: "#E8EDF5" }}>No deals yet</p>
        <p className="text-xs max-w-xs leading-relaxed" style={{ color: "#8892A4" }}>
          Upload a COA and contract PDF to run your first pre-shipment compliance check.
        </p>
      </div>
      <Link
        href="/deals/new"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all hover:brightness-110"
        style={{ backgroundColor: "#00D4FF", color: "#0A0F1E" }}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        New Deal
      </Link>
    </motion.div>
  );
}

/* ─── no results ─────────────────────────────────────────────────────────────── */
function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <td colSpan={8} className="px-4 py-12 text-center">
        <div className="space-y-3">
          <p className="text-sm" style={{ color: "#8892A4" }}>No deals match your search.</p>
          <button
            type="button"
            onClick={onClear}
            className="text-xs underline cursor-pointer transition-colors hover:text-[#E8EDF5]"
            style={{ color: "#8892A4" }}
          >
            Clear filters
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DEALS WORKSPACE
═══════════════════════════════════════════════════════════════════════════════ */
export default function DealsWorkspace() {
  const dealsResult = useQuery(api.deals.list);
  const deals = dealsResult ?? [];
  const isLoading = dealsResult === undefined;

  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [dateRange, setDateRange] = useState<DateRange>("all");

  /* ─── derived counts ─────────────────────────────────────────────────────── */
  const allDeals = deals as Deal[];
  const compliantCount = allDeals.filter((d) => d.status === "COMPLIANT").length;
  const nonCompliantCount = allDeals.filter((d) => d.status === "NON_COMPLIANT").length;
  const pendingCount = allDeals.filter((d) => d.status === "PENDING").length;

  // This month count
  const thisMonthCount = allDeals.filter(
    (d) => Date.now() - d.createdAt < 30 * 24 * 60 * 60 * 1000,
  ).length;

  /* ─── filtered list ──────────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let result = allDeals;
    if (filterStatus !== "ALL") {
      result = result.filter((d) => d.status === filterStatus);
    }
    result = result.filter((d) => isWithinRange(d.createdAt, dateRange));
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.buyer.toLowerCase().includes(q) ||
          d.origin.toLowerCase().includes(q) ||
          (d.commodity ?? "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [allDeals, filterStatus, dateRange, query]);

  /* ─── filter options ─────────────────────────────────────────────────────── */
  const filterOptions: { label: string; value: FilterStatus; color?: string; count: number }[] = [
    { label: "All", value: "ALL", count: allDeals.length },
    { label: "COMPLIANT", value: "COMPLIANT", color: "#00C896", count: compliantCount },
    { label: "NON_COMPLIANT", value: "NON_COMPLIANT", color: "#FF4757", count: nonCompliantCount },
    { label: "PENDING", value: "PENDING", color: "#8892A4", count: pendingCount },
  ];

  const dateOptions: { label: string; value: DateRange }[] = [
    { label: "All time", value: "all" },
    { label: "This week", value: "week" },
    { label: "This month", value: "month" },
  ];

  const clearAll = () => {
    setQuery("");
    setFilterStatus("ALL");
    setDateRange("all");
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 lg:px-6 py-6" aria-label="Deal Workspace">

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      {!isLoading && allDeals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-4 gap-px mb-5 border"
          style={{ backgroundColor: "#1C2D45", borderColor: "#1C2D45" }}
        >
          {[
            { label: "TOTAL DEALS", value: allDeals.length, color: "#E8EDF5" },
            { label: "COMPLIANT", value: compliantCount, color: "#00C896" },
            { label: "NON-COMPLIANT", value: nonCompliantCount, color: "#FF4757" },
            { label: "THIS MONTH", value: thisMonthCount, color: "#00D4FF" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="px-5 py-3 space-y-0.5"
              style={{ backgroundColor: "#0D1B2E" }}
            >
              <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "#8892A4" }}>
                {label}
              </p>
              <p className="text-xl font-bold font-mono tabular-nums tc-count" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </motion.div>
      )}

      <section className="space-y-4" aria-labelledby="deals-heading">

        {/* ── Header ────────────────────────────────────────────────────────────── */}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <h1
              id="deals-heading"
              className="text-lg font-bold tracking-tight"
              style={{ color: "#E8EDF5" }}
            >
              Deal Workspace
            </h1>
            <p className="text-xs" style={{ color: "#8892A4" }}>
              Pre-shipment compliance checks · {allDeals.length} deal{allDeals.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="h-8 px-3 text-xs gap-1.5 font-semibold flex-shrink-0 cursor-pointer"
            style={{ backgroundColor: "#00D4FF", color: "#0A0F1E" }}
          >
            <Link href="/deals/new">
              <Plus className="h-3.5 w-3.5" aria-hidden />
              New Deal →
            </Link>
          </Button>
        </header>

        {/* ── Empty / Loading state ──────────────────────────────────────────────── */}
        {(isLoading || allDeals.length === 0) ? (
          <div className="border" style={{ borderColor: "#1C2D45", backgroundColor: "#0D1B2E" }}>
            {isLoading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="flex items-center gap-2" style={{ color: "#8892A4" }}>
                  <div
                    className="h-1.5 w-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: "#00D4FF" }}
                  />
                  <span className="text-xs font-mono">Loading deals…</span>
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        ) : (
          <>
            {/* ── Search + filter bar ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div
                className="flex items-center gap-2 border px-3 h-8 flex-1 min-w-52"
                style={{ borderColor: "#1C2D45", backgroundColor: "#0D1B2E" }}
              >
                <Search className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#8892A4" }} aria-hidden />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search deals, buyers, origins…"
                  className="flex-1 bg-transparent text-xs outline-none font-mono"
                  style={{ color: "#E8EDF5" }}
                  aria-label="Search deals"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="flex items-center justify-center h-4 w-4 cursor-pointer transition-colors hover:text-[#E8EDF5] flex-shrink-0"
                    style={{ color: "#8892A4" }}
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Status filters */}
              <div className="flex items-center gap-1">
                {filterOptions.map(({ label, value, color, count }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilterStatus(value)}
                    className="h-8 px-2.5 text-xs font-mono font-medium cursor-pointer transition-all duration-150 border flex items-center gap-1.5"
                    style={{
                      borderColor: filterStatus === value ? (color ?? "#00D4FF") : "#1C2D45",
                      backgroundColor: filterStatus === value ? `${(color ?? "#00D4FF")}14` : "transparent",
                      color: filterStatus === value ? (color ?? "#00D4FF") : "#8892A4",
                    }}
                    aria-pressed={filterStatus === value}
                  >
                    {label}
                    {count > 0 && (
                      <span
                        className="font-mono text-xs"
                        style={{
                          color: filterStatus === value ? (color ?? "#00D4FF") : "#1C2D45",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Date range */}
              <div className="flex items-center gap-1 border" style={{ borderColor: "#1C2D45" }}>
                {dateOptions.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDateRange(value)}
                    className="h-8 px-2.5 text-xs font-mono cursor-pointer transition-all duration-150"
                    style={{
                      backgroundColor: dateRange === value ? "#1C2D45" : "transparent",
                      color: dateRange === value ? "#E8EDF5" : "#8892A4",
                    }}
                    aria-pressed={dateRange === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Table ─────────────────────────────────────────────────────────────── */}
            <div className="border" style={{ borderColor: "#1C2D45" }}>
              <Table>
                <TableHeader>
                  <TableRow
                    className="border-b hover:bg-transparent"
                    style={{ borderColor: "#1C2D45", backgroundColor: "#0A0F1E" }}
                  >
                    {[
                      { label: "DEAL", width: "auto" },
                      { label: "COMMODITY", width: "100px" },
                      { label: "BUYER", width: "auto" },
                      { label: "ORIGIN", width: "auto" },
                      { label: "DOCS", width: "80px" },
                      { label: "STATUS", width: "148px" },
                      { label: "CREATED", width: "90px" },
                      { label: "", width: "64px" },
                    ].map(({ label, width }) => (
                      <TableHead
                        key={label}
                        className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#8892A4", width }}
                      >
                        {label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Loading skeleton */}
                  {isLoading && [0, 1, 2, 3].map((i) => <SkeletonRow key={i} i={i} />)}

                  <AnimatePresence mode="popLayout">
                    {filtered.map((deal, i) => (
                      <motion.tr
                        key={deal._id}
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.22, delay: i * 0.03 }}
                        className="border-b cursor-pointer tc-row-hover"
                        style={{ borderColor: "#1C2D45" }}
                        onClick={() => { window.location.href = `/deals/${deal._id}`; }}
                        role="row"
                      >
                        {/* Deal name */}
                        <TableCell className="px-4 py-3 text-sm font-medium max-w-[200px]" style={{ color: "#E8EDF5" }}>
                          <span className="block truncate">{deal.title}</span>
                        </TableCell>

                        {/* Commodity */}
                        <TableCell className="px-4 py-3 text-xs font-mono" style={{ color: "#8892A4" }}>
                          {deal.commodity ?? "—"}
                        </TableCell>

                        {/* Buyer */}
                        <TableCell className="px-4 py-3 text-sm" style={{ color: "#E8EDF5" }}>
                          <span className="block truncate max-w-[140px]">{deal.buyer}</span>
                        </TableCell>

                        {/* Origin */}
                        <TableCell className="px-4 py-3 text-sm" style={{ color: "#E8EDF5" }}>
                          {deal.origin}
                        </TableCell>

                        {/* Docs badges */}
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-mono"
                              style={{ backgroundColor: "rgba(0,212,255,0.08)", color: "#00D4FF" }}
                              title="Certificate of Analysis"
                            >
                              <FileText className="h-2.5 w-2.5" aria-hidden />
                              COA
                            </span>
                            <span
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-mono"
                              style={{ backgroundColor: "rgba(0,212,255,0.08)", color: "#00D4FF" }}
                              title="Contract"
                            >
                              <FileText className="h-2.5 w-2.5" aria-hidden />
                              CTR
                            </span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-4 py-3">
                          <StatusBadge status={deal.status} />
                        </TableCell>

                        {/* Created */}
                        <TableCell
                          className="px-4 py-3 text-xs font-mono tabular-nums"
                          style={{ color: "#8892A4" }}
                        >
                          {formatRelativeTime(deal.createdAt)}
                        </TableCell>

                        {/* Open link */}
                        <TableCell className="px-4 py-3">
                          <Link
                            href={`/deals/${deal._id}`}
                            className="inline-flex items-center gap-0.5 text-xs font-mono transition-colors hover:text-[#00D4FF] cursor-pointer"
                            style={{ color: "#8892A4" }}
                            aria-label={`Open deal: ${deal.title}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open <ChevronRight className="h-3 w-3" aria-hidden />
                          </Link>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>

                  {/* No results */}
                  {!isLoading && filtered.length === 0 && (
                    <NoResults onClear={clearAll} />
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ── Footer count ─────────────────────────────────────────────────────── */}
            {filtered.length > 0 && (
              <p className="text-xs font-mono" style={{ color: "#8892A4" }}>
                Showing <span style={{ color: "#E8EDF5" }}>{filtered.length}</span> of{" "}
                {allDeals.length} deals
                {(filterStatus !== "ALL" || dateRange !== "all" || query) && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="ml-3 underline cursor-pointer transition-colors hover:text-[#E8EDF5]"
                  >
                    Clear filters
                  </button>
                )}
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
