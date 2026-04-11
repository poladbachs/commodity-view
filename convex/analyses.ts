import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    dealId: v.id("deals"),
    status: v.union(v.literal("COMPLIANT"), v.literal("NON_COMPLIANT")),
    checks: v.array(v.any()),
    violations: v.array(v.any()),
    extractedCOA: v.optional(v.any()),
    extractedContract: v.optional(v.any()),
    engineVersion: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("analysisRuns", {
      ...args,
      executedAt: Date.now(),
    });
  },
});

export const getByDeal = query({
  args: { dealId: v.id("deals") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analysisRuns")
      .withIndex("by_dealId", (q) => q.eq("dealId", args.dealId))
      .order("desc")
      .first();
  },
});
