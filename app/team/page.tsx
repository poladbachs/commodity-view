"use client";

import Link from "next/link";
import {
  Search,
  Plus,
  ChevronRight,
  Users,
  Activity,
  Shield,
  Clock,
  AlertCircle,
  TrendingUp,
  Filter,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/* ──────────────────────────────────────────────────────────────────────────── */
/* TEAM WORKSPACE — Phase 2 entry point                                         */
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

type FilterKey = "all" | "compliant" | "violations" | "pending";

export default function TeamPage() {
  const deals = useQuery(api.deals.list) ?? [];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.commodity?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "compliant":
        return deal.status === "COMPLIANT";
      case "violations":
        return deal.status === "NON_COMPLIANT";
      case "pending":
        return deal.status === "PENDING";
      default:
        return true;
    }
  });

  const stats = {
    total: deals.length,
    compliant: deals.filter((d) => d.status === "COMPLIANT").length,
    violations: deals.filter((d) => d.status === "NON_COMPLIANT").length,
    pending: deals.filter((d) => d.status === "PENDING").length,
  };

  return (
    <div style={{ backgroundColor: "#0A0F1E", minHeight: "100vh" }} className="text-white">
      {/* ─ Header ─ */}
      <div
        style={{
          borderBottom: "1px solid #1a2844",
          backgroundColor: "rgba(10, 15, 30, 0.95)",
        }}
        className="px-8 py-6 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Team Workspace</h1>
              <p style={{ color: "#8892A4" }} className="text-sm mt-1">
                Multi-team deal management, audit log, sanctions screening
              </p>
            </div>
            <Link href="/deals/new">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: "#00D4FF",
                  color: "#0A0F1E",
                }}
                className="px-4 py-2 rounded text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                New Deal
              </motion.div>
            </Link>
          </div>

          {/* Stats row */}
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 gap-4"
          >
            {[
              { label: "Total Deals", value: stats.total, icon: TrendingUp, color: "#00D4FF" },
              { label: "Compliant", value: stats.compliant, icon: Shield, color: "#00C896" },
              { label: "Violations", value: stats.violations, icon: AlertCircle, color: "#FF4757" },
              { label: "In Progress", value: stats.pending, icon: Clock, color: "#8892A4" },
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
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ color: "#8892A4" }} className="text-xs font-mono uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-mono font-semibold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon size={20} style={{ color: stat.color, opacity: 0.6 }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─ Body ─ */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.35, ease: EASE }}
            className="space-y-4"
          >
            {/* Search bar */}
            <div
              style={{
                backgroundColor: "#0D1B2E",
                border: "1px solid #1a2844",
              }}
              className="px-4 py-3 rounded flex items-center gap-3"
            >
              <Search size={18} style={{ color: "#8892A4" }} />
              <input
                type="text"
                placeholder="Search deals, buyers, commodities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ backgroundColor: "transparent", color: "white" }}
                className="flex-1 outline-none text-sm placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-3">
              {[
                { key: "all" as FilterKey, label: "All", count: stats.total },
                { key: "compliant" as FilterKey, label: "Compliant", count: stats.compliant },
                { key: "violations" as FilterKey, label: "Violations", count: stats.violations },
                { key: "pending" as FilterKey, label: "In Progress", count: stats.pending },
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFilter(filter.key)}
                  style={{
                    backgroundColor: activeFilter === filter.key ? "#00D4FF" : "#0D1B2E",
                    color: activeFilter === filter.key ? "#0A0F1E" : "white",
                    border: activeFilter === filter.key ? "none" : "1px solid #1a2844",
                  }}
                  className="px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-all"
                >
                  {filter.label}
                  <span
                    style={{
                      backgroundColor:
                        activeFilter === filter.key ? "rgba(10, 15, 30, 0.4)" : "rgba(0, 212, 255, 0.2)",
                      color: activeFilter === filter.key ? "#0A0F1E" : "#00D4FF",
                    }}
                    className="text-xs px-2 py-0.5 rounded"
                  >
                    {filter.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Deal Grid (Phase 2: expanded card view) */}
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal, i) => (
                  <motion.div
                    key={deal._id}
                    custom={i}
                    variants={fadeUp}
                    layout
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Link href={`/deals/${deal._id}`}>
                      <motion.div
                        whileHover={{
                          backgroundColor: "#1a2844",
                          borderColor: "#00D4FF",
                        }}
                        style={{
                          backgroundColor: "#0D1B2E",
                          border: "1px solid #1a2844",
                        }}
                        className="p-5 rounded cursor-pointer transition-all"
                      >
                        {/* Deal header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base truncate">{deal.title}</h3>
                            <p style={{ color: "#8892A4" }} className="text-xs mt-1">
                              {deal.buyer} • {deal.origin}
                            </p>
                          </div>
                          <ChevronRight
                            size={18}
                            style={{ color: "#00D4FF", opacity: 0.6 }}
                            className="flex-shrink-0 ml-2"
                          />
                        </div>

                        {/* Commodity + specs */}
                        <div className="space-y-2 mb-4 pb-4 border-b border-gray-800">
                          {deal.commodity && (
                            <p className="text-xs font-mono" style={{ color: "#8892A4" }}>
                              <span style={{ color: "#00D4FF" }}>commodity</span>: {deal.commodity}
                            </p>
                          )}
                          {deal.quantity && (
                            <p className="text-xs font-mono" style={{ color: "#8892A4" }}>
                              <span style={{ color: "#00D4FF" }}>qty</span>: {deal.quantity}
                            </p>
                          )}
                        </div>

                        {/* Status + timestamp */}
                        <div className="flex items-center justify-between">
                          <motion.div
                            style={{
                              backgroundColor:
                                deal.status === "COMPLIANT"
                                  ? "rgba(0, 200, 150, 0.15)"
                                  : deal.status === "NON_COMPLIANT"
                                    ? "rgba(255, 71, 87, 0.15)"
                                    : "rgba(136, 146, 164, 0.15)",
                              color:
                                deal.status === "COMPLIANT"
                                  ? "#00C896"
                                  : deal.status === "NON_COMPLIANT"
                                    ? "#FF4757"
                                    : "#8892A4",
                            }}
                            className="px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5"
                          >
                            <motion.div
                              animate={{
                                opacity: [1, 0.6, 1],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor:
                                  deal.status === "COMPLIANT"
                                    ? "#00C896"
                                    : deal.status === "NON_COMPLIANT"
                                      ? "#FF4757"
                                      : "#8892A4",
                              }}
                            />
                            {deal.status}
                          </motion.div>
                          <p style={{ color: "#8892A4" }} className="text-xs font-mono">
                            {new Date(deal.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  custom={0}
                  variants={fadeUp}
                  className="col-span-full"
                >
                  <div
                    style={{ backgroundColor: "#0D1B2E" }}
                    className="py-12 rounded text-center"
                  >
                    <Search size={32} style={{ color: "#1a2844" }} className="mx-auto mb-4" />
                    <p style={{ color: "#8892A4" }}>No deals match this filter</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveFilter("all");
                      }}
                      className="text-xs mt-3 underline hover:text-white"
                      style={{ color: "#00D4FF" }}
                    >
                      Clear filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.38, delay: 0.6 }}
            style={{ color: "#8892A4" }}
            className="text-xs text-center mt-8"
          >
            Showing {filteredDeals.length} of {stats.total} deals
          </motion.p>
        </div>
      </div>
    </div>
  );
}
