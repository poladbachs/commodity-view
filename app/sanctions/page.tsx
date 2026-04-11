"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

/* ──────────────────────────────────────────────────────────────────────────── */
/* SANCTIONS SCREENING — Phase 2 regulatory compliance                          */
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

type ScreeningDatabase = "OFAC" | "UN" | "EU" | "UK";
type CheckStatus = "passed" | "warning" | "flagged" | "pending";

interface ScreeningResult {
  database: ScreeningDatabase;
  status: CheckStatus;
  lastUpdated: number;
  matchCount: number;
  details?: string;
}

interface DealScreening {
  dealId: string;
  dealTitle: string;
  buyer: string;
  supplier: string;
  origin: string;
  results: ScreeningResult[];
  overallStatus: CheckStatus;
  timestamp: number;
}

// Mock data (would be wired to real OFAC/UN/EU APIs)
const mockScreenings: DealScreening[] = [
  {
    dealId: "deal-1",
    dealTitle: "SOCAR Soya Tocopherol",
    buyer: "AgroTrade",
    supplier: "SOCAR",
    origin: "Azerbaijan",
    results: [
      { database: "OFAC", status: "passed", lastUpdated: Date.now() - 7200000, matchCount: 0 },
      { database: "UN", status: "passed", lastUpdated: Date.now() - 3600000, matchCount: 0 },
      { database: "EU", status: "passed", lastUpdated: Date.now() - 1800000, matchCount: 0 },
      { database: "UK", status: "passed", lastUpdated: Date.now() - 1800000, matchCount: 0 },
    ],
    overallStatus: "passed",
    timestamp: Date.now() - 7200000,
  },
  {
    dealId: "deal-2",
    dealTitle: "Vitol Crude Oil",
    buyer: "Shell",
    supplier: "Vitol",
    origin: "UK",
    results: [
      { database: "OFAC", status: "passed", lastUpdated: Date.now() - 3600000, matchCount: 0 },
      { database: "UN", status: "passed", lastUpdated: Date.now() - 3600000, matchCount: 0 },
      { database: "EU", status: "warning", lastUpdated: Date.now() - 1800000, matchCount: 1, details: "Auto-match: generic company name" },
      { database: "UK", status: "passed", lastUpdated: Date.now() - 1800000, matchCount: 0 },
    ],
    overallStatus: "warning",
    timestamp: Date.now() - 3600000,
  },
  {
    dealId: "deal-3",
    dealTitle: "Hartree Energy",
    buyer: "Gunvor",
    supplier: "Hartree",
    origin: "Switzerland",
    results: [
      { database: "OFAC", status: "passed", lastUpdated: Date.now(), matchCount: 0 },
      { database: "UN", status: "passed", lastUpdated: Date.now(), matchCount: 0 },
      { database: "EU", status: "passed", lastUpdated: Date.now(), matchCount: 0 },
      { database: "UK", status: "pending", lastUpdated: 0, matchCount: 0 },
    ],
    overallStatus: "pending",
    timestamp: Date.now(),
  },
];

function statusIcon(status: CheckStatus, size = 16) {
  switch (status) {
    case "passed":
      return <CheckCircle2 size={size} style={{ color: "#00C896" }} />;
    case "warning":
      return <AlertTriangle size={size} style={{ color: "#FFA500" }} />;
    case "flagged":
      return <AlertTriangle size={size} style={{ color: "#FF4757" }} />;
    case "pending":
      return <Clock size={size} style={{ color: "#8892A4" }} />;
  }
}

function statusLabel(status: CheckStatus): string {
  const labels: Record<CheckStatus, string> = {
    passed: "Clear",
    warning: "Review",
    flagged: "Hit",
    pending: "Pending",
  };
  return labels[status];
}

function statusColor(status: CheckStatus): string {
  switch (status) {
    case "passed":
      return "#00C896";
    case "warning":
      return "#FFA500";
    case "flagged":
      return "#FF4757";
    case "pending":
      return "#8892A4";
  }
}

function relativeTime(timestamp: number): string {
  if (timestamp === 0) return "—";
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  return hours < 24 ? `${hours}h ago` : `${days}d ago`;
}

export default function SanctionsPage() {
  const [activeTab, setActiveTab] = useState<"summary" | "details">("summary");
  const [selectedDeal, setSelectedDeal] = useState<DealScreening | null>(mockScreenings[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const passedCount = mockScreenings.filter((s) => s.overallStatus === "passed").length;
  const warningCount = mockScreenings.filter((s) => s.overallStatus === "warning").length;
  const flaggedCount = mockScreenings.filter((s) => s.overallStatus === "flagged").length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsRefreshing(false);
  };

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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
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
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                <Shield size={24} style={{ color: "#00D4FF" }} />
                Sanctions Screening
              </h1>
              <p style={{ color: "#8892A4" }} className="text-sm mt-1">
                OFAC, UN, EU, UK screenings — auto-checked before analysis
              </p>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 gap-4"
          >
            {[
              { label: "Total Deals", value: mockScreenings.length, color: "#00D4FF" },
              { label: "Clear", value: passedCount, color: "#00C896" },
              { label: "Under Review", value: warningCount, color: "#FFA500" },
              { label: "Flagged", value: flaggedCount, color: "#FF4757" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                style={{
                  backgroundColor: "#0D1B2E",
                  borderLeft: `2px solid ${stat.color}`,
                }}
                className="px-4 py-3 rounded"
              >
                <p style={{ color: "#8892A4" }} className="text-xs font-mono uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-mono font-semibold mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deal List */}
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.38, ease: EASE }}
              style={{ backgroundColor: "#0D1B2E", border: "1px solid #1a2844" }}
              className="rounded lg:col-span-1 overflow-hidden flex flex-col"
            >
              <div
                style={{ borderBottom: "1px solid #1a2844" }}
                className="px-4 py-3"
              >
                <p style={{ color: "#8892A4" }} className="text-xs font-mono uppercase tracking-wider">
                  Deals
                </p>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[600px]">
                {mockScreenings.map((screening, i) => (
                  <motion.button
                    key={screening.dealId}
                    custom={i}
                    variants={fadeUp}
                    onClick={() => setSelectedDeal(screening)}
                    style={{
                      backgroundColor:
                        selectedDeal?.dealId === screening.dealId
                          ? "rgba(0, 212, 255, 0.1)"
                          : "transparent",
                      borderBottom: "1px solid #1a2844",
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-900/30 transition-colors block"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      {statusIcon(screening.overallStatus, 14)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{screening.dealTitle}</h4>
                        <p style={{ color: "#8892A4" }} className="text-xs truncate">
                          {screening.supplier}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Detail View */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.38, ease: EASE, delay: 0.1 }}
              style={{ backgroundColor: "#0D1B2E", border: "1px solid #1a2844" }}
              className="rounded lg:col-span-2 p-6 flex flex-col"
            >
              <AnimatePresence mode="wait">
                {selectedDeal ? (
                  <motion.div
                    key={selectedDeal.dealId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Deal info */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{selectedDeal.dealTitle}</h3>
                          <p style={{ color: "#8892A4" }} className="text-sm mt-1">
                            {selectedDeal.buyer} ← {selectedDeal.supplier}
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: isRefreshing ? 360 : 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: isRefreshing ? Infinity : 0,
                            ease: "linear",
                          }}
                        >
                          <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            style={{ color: "#8892A4" }}
                            className="hover:text-white disabled:opacity-50"
                          >
                            <RefreshCw size={18} />
                          </button>
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Supplier", value: selectedDeal.supplier },
                          { label: "Origin", value: selectedDeal.origin },
                          { label: "Status", value: statusLabel(selectedDeal.overallStatus) },
                          { label: "Last Updated", value: relativeTime(selectedDeal.timestamp) },
                        ].map((item) => (
                          <div key={item.label}>
                            <p style={{ color: "#8892A4" }} className="text-xs font-mono uppercase">
                              {item.label}
                            </p>
                            <p className="font-mono text-sm mt-1">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Screening results table */}
                    <motion.div
                      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                      initial="hidden"
                      animate="show"
                    >
                      <p style={{ color: "#8892A4" }} className="text-xs font-mono uppercase tracking-wider mb-3">
                        Screening Results
                      </p>
                      <div className="space-y-2">
                        {selectedDeal.results.map((result, i) => (
                          <motion.div
                            key={result.database}
                            custom={i}
                            variants={fadeUp}
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.2)",
                              borderLeft: `2px solid ${statusColor(result.status)}`,
                            }}
                            className="px-3 py-2 rounded text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {statusIcon(result.status, 14)}
                                <span className="font-mono font-semibold">{result.database}</span>
                              </div>
                              <span
                                style={{
                                  color: statusColor(result.status),
                                }}
                                className="text-xs font-semibold"
                              >
                                {statusLabel(result.status)}
                              </span>
                            </div>
                            {result.details && (
                              <p style={{ color: "#8892A4" }} className="text-xs mt-1 ml-6">
                                {result.details}
                              </p>
                            )}
                            <p style={{ color: "#8892A4" }} className="text-xs mt-1 ml-6">
                              {relativeTime(result.lastUpdated)}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.38, delay: 0.3 }}
                      className="flex gap-2 pt-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          backgroundColor: "#00D4FF",
                          color: "#0A0F1E",
                        }}
                        className="px-4 py-2 rounded text-sm font-medium flex-1"
                      >
                        Approve & Proceed
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          backgroundColor: "#1a2844",
                          color: "#8892A4",
                          border: "1px solid #2a3a54",
                        }}
                        className="px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
                      >
                        <Download size={14} />
                        Export
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p style={{ color: "#8892A4" }}>Select a deal to view screening details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
