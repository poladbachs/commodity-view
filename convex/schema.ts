import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  deals: defineTable({
    title: v.string(),
    buyer: v.string(),
    origin: v.string(),
    commodity: v.optional(v.string()),
    quantity: v.optional(v.string()),
    deliveryMonth: v.optional(v.string()),
    status: v.union(
      v.literal("PENDING"),
      v.literal("COMPLIANT"),
      v.literal("NON_COMPLIANT")
    ),
    userId: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  documents: defineTable({
    dealId: v.id("deals"),
    type: v.union(
      v.literal("COA"),
      v.literal("CONTRACT"),
      v.literal("LC"),
      v.literal("BL")
    ),
    filename: v.string(),
    storageKey: v.string(),
    extractedData: v.optional(v.any()),
    uploadedAt: v.number(),
  }).index("by_dealId", ["dealId"]),

  analysisRuns: defineTable({
    dealId: v.id("deals"),
    status: v.union(v.literal("COMPLIANT"), v.literal("NON_COMPLIANT")),
    checks: v.array(v.any()),
    violations: v.array(v.any()),
    extractedCOA: v.optional(v.any()),
    extractedContract: v.optional(v.any()),
    executedAt: v.number(),
    engineVersion: v.string(),
  }).index("by_dealId", ["dealId"]),
});
