"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Download,
  Filter,
  MoreVertical,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────── */
/* AUDIT LOG — Phase 2 compliance tracking                                      */
/* ──────────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, delay: i * 0.07, ease: EASE },
  }),
};

type AuditEvent =
  | "deal_created"
  | "analysis_run"
  | "violation_flagged"
  | "user_override"
  | "export_requested"
  | "comment_added"
  | "sanctions_check";

interface AuditLog {
  id: string;
  timestamp: number;
  event: AuditEvent;
  user: string;
  dealId: string;
  dealTitle: string;
  details: string;
  severity: "info" | "warning" | "critical";
}

// Mock data (would come from Convex)
const mockLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: Date.now() - 3600000,
    event: "deal_created",
    user: "Sarah Chen",
    dealId: "deal-1",
    dealTitle: "SOCAR Soya Tocopherol",
    details: "New deal created: Buyer=AgroTrade, Origin=Argentina",
    severity: "info",
  },
  {
    id: "2",
    timestamp: Date.now() - 1800000,
    event: "analysis_run",
    user: "Sarah Chen",
    dealId: "deal-1",
    dealTitle: "SOCAR Soya Tocopherol",
    details: "Analysis executed: COA vs Contract specs",
    severity: "info",
  },
  {
    id: "3",
    timestamp: Date.now() - 900000,
    event: "violation_flagged",
    user: "System",
    dealId: "deal-1",
    dealTitle: "SOCAR Soya Tocopherol",
    details: "Protein below spec: 11.8 < 12.0",
    severity: "warning",
  },
  {
    id: "4",
    timestamp: Date.now() - 450000,
    event: "export_requested",
    user: "Sarah Chen",
    dealId: "deal-1",
    dealTitle: "SOCAR Soya Tocopherol",
    details: "PDF compliance report exported",
    severity: "info",
  },
  {
    id: "5",
    timestamp: Date.now() - 200000,
    event: "comment_added",
    user: "James Rodriguez",
    dealId: "deal-1",
    dealTitle: "SOCAR Soya Tocopherol",
    details: "Approved by QA: retest scheduled for Monday",
    severity: "info",
  },
];

function eventIcon(event: AuditEvent, severity: "info" | "warning" | "critical") {
  if (severity === "critical") return <XCircle size={18} style={{ color: "#FF4757" }} />;
  if (severity === "warning") return <AlertCircle size={18} style={{ color: "#FFA500" }} />;
  return <CheckCircle2 size={18} style={{ color: "#00C896" }} />;
}

function eventLabel(event: AuditEvent): string {
  const labels: Record<AuditEvent, string> = {
    deal_created: "Deal Created",
    analysis_run: "Analysis Run",
    violation_flagged: "Violation Flagged",
    user_override: "Value Overridden",
    export_requested: "Export Requested",
    comment_added: "Comment Added",
    sanctions_check: "Sanctions Check",
  };
  return labels[event];
}

function relativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AuditLogPage() {
  const [filters, setFilters] = useState<AuditEvent[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filtered = filters.length
    ? mockLogs.filter((log) => filters.includes(log.event))
    : mockLogs;

  const sorted = [...filtered].sort((a, b) =>
    sortOrder === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
  );

  return (
    <div style={{ backgroundColor: "#0A0F1E", minHeight: "100vh" }} className="text-white">
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #1a2844",
          backgroundColor: "rgba(10, 15, 30, 0.95)",
        }}
        className="px-8 py-6 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/team">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
            <p style={{ color: "#8892A4" }} className="text-sm mt-1">
              Complete action history for compliance and accountability
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            className="flex items-center gap-3 justify-between"
          >
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { event: "deal_created" as AuditEvent, label: "Created" },
                { event: "analysis_run" as AuditEvent, label: "Analysis" },
                { event: "violation_flagged" as AuditEvent, label: "Violations" },
                { event: "export_requested" as AuditEvent, label: "Exports" },
              ].map((item) => (
                <motion.button
                  key={item.event}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setFilters((prev) =>
                      prev.includes(item.event)
                        ? prev.filter((e) => e !== item.event)
                        : [...prev, item.event]
                    )
                  }
                  style={{
                    backgroundColor: filters.includes(item.event) ? "#00D4FF" : "#0D1B2E",
                    color: filters.includes(item.event) ? "#0A0F1E" : "white",
                    border: filters.includes(item.event) ? "none" : "1px solid #1a2844",
                  }}
                  className="px-3 py-1.5 rounded text-xs font-medium transition-all"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              style={{
                backgroundColor: "#0D1B2E",
                border: "1px solid #1a2844",
              }}
              className="px-3 py-1.5 rounded text-xs font-medium text-white outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </motion.div>

          {/* Timeline */}
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {sorted.length > 0 ? (
              sorted.map((log, i) => (
                <motion.div
                  key={log.id}
                  custom={i}
                  variants={fadeUp}
                  style={{
                    backgroundColor: "#0D1B2E",
                    border: "1px solid #1a2844",
                    borderLeft: `3px solid ${log.severity === "critical" ? "#FF4757" : log.severity === "warning" ? "#FFA500" : "#00D4FF"}`,
                  }}
                  className="p-4 rounded cursor-pointer group transition-all hover:border-gray-600"
                >
                  <div className="flex items-start gap-4">
                    {eventIcon(log.event, log.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{eventLabel(log.event)}</h4>
                        <p style={{ color: "#8892A4" }} className="text-xs font-mono">
                          {relativeTime(log.timestamp)}
                        </p>
                      </div>
                      <p style={{ color: "#8892A4" }} className="text-xs mb-2">
                        <span style={{ color: "#00D4FF" }}>{log.user}</span> on{" "}
                        <Link href={`/deals/${log.dealId}`} className="hover:underline">
                          {log.dealTitle}
                        </Link>
                      </p>
                      <p className="text-xs leading-5">{log.details}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical size={16} style={{ color: "#8892A4" }} />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                custom={0}
                variants={fadeUp}
                style={{ backgroundColor: "#0D1B2E" }}
                className="py-8 rounded text-center"
              >
                <p style={{ color: "#8892A4" }}>No audit events match these filters</p>
              </motion.div>
            )}
          </motion.div>

          {/* Table view option */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.38, delay: 0.4 }}
            style={{
              color: "#00D4FF",
              borderBottom: "1px solid #1a2844",
            }}
            className="text-xs font-mono py-2 hover:opacity-70 text-left"
          >
            View as table →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
