import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { MOCK_DEALS, MOCK_ANALYSES } from "./seed";

export const create = mutation({
  args: {
    title: v.string(),
    buyer: v.string(),
    origin: v.string(),
    commodity: v.optional(v.string()),
    quantity: v.optional(v.string()),
    deliveryMonth: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("deals", {
      ...args,
      status: "PENDING",
      userId: identity.tokenIdentifier,
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("deals"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("COMPLIANT"),
      v.literal("NON_COMPLIANT")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("deals")
      .withIndex("by_userId", (q) => q.eq("userId", identity.tokenIdentifier))
      .order("desc")
      .take(100);
  },
});

export const get = query({
  args: { id: v.id("deals") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: { id: v.id("deals") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    await ctx.db.delete(args.id);
  },
});

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    // Fallback for dev env when auth not ready yet
    const userId = identity?.tokenIdentifier ?? "dev-demo-user";

    // Delete any existing demo deals first
    const existing = await ctx.db
      .query("deals")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    for (const deal of existing) {
      await ctx.db.delete(deal._id);
    }

    // Create NON_COMPLIANT deal
    const deal1 = await ctx.db.insert("deals", {
      title: MOCK_DEALS[0].title,
      buyer: MOCK_DEALS[0].buyer,
      origin: MOCK_DEALS[0].origin,
      commodity: MOCK_DEALS[0].commodity,
      quantity: MOCK_DEALS[0].quantity,
      deliveryMonth: MOCK_DEALS[0].deliveryMonth,
      userId,
      status: "NON_COMPLIANT",
      createdAt: Date.now() - 3600000,
    });

    await ctx.db.insert("analysisRuns", {
      dealId: deal1,
      status: "NON_COMPLIANT",
      checks: MOCK_ANALYSES.noncompliant.checks,
      violations: MOCK_ANALYSES.noncompliant.violations,
      executedAt: Date.now() - 3600000,
      engineVersion: "1.0.0",
      extractedCOA: MOCK_ANALYSES.noncompliant.extractedCOA,
      extractedContract: MOCK_ANALYSES.noncompliant.extractedContract,
    });

    // Create COMPLIANT deal
    const deal2 = await ctx.db.insert("deals", {
      title: MOCK_DEALS[1].title,
      buyer: MOCK_DEALS[1].buyer,
      origin: MOCK_DEALS[1].origin,
      commodity: MOCK_DEALS[1].commodity,
      quantity: MOCK_DEALS[1].quantity,
      deliveryMonth: MOCK_DEALS[1].deliveryMonth,
      userId,
      status: "COMPLIANT",
      createdAt: Date.now() - 7200000,
    });

    await ctx.db.insert("analysisRuns", {
      dealId: deal2,
      status: "COMPLIANT",
      checks: MOCK_ANALYSES.compliant.checks,
      violations: MOCK_ANALYSES.compliant.violations,
      executedAt: Date.now() - 7200000,
      engineVersion: "1.0.0",
      extractedCOA: MOCK_ANALYSES.compliant.extractedCOA,
      extractedContract: MOCK_ANALYSES.compliant.extractedContract,
    });

    return { seeded: true, deal1, deal2 };
  },
});
