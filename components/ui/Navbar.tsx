"use client";

import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 h-14 w-full flex-shrink-0"
      style={{
        background: "rgba(7,11,20,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="flex h-full items-center px-5 lg:px-8 gap-6 mx-auto max-w-[1400px]">

        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold tracking-tight flex-shrink-0 font-mono"
          style={{ color: "#F59E0B" }}
        >
          <ShieldCheck className="h-4 w-4" aria-hidden />
          CommodityView
        </Link>

        {/* Divider */}
        <span className="h-4 w-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Public nav */}
        <div className="flex items-center gap-0.5">
          <Link
            href="/products"
            className="px-2.5 py-1.5 text-xs font-medium transition-colors hover:text-[#F8FAFC]"
            style={{ color: "#64748B" }}
          >
            Products
          </Link>
          <Link
            href="/pricing"
            className="px-2.5 py-1.5 text-xs font-medium transition-colors hover:text-[#F8FAFC]"
            style={{ color: "#64748B" }}
          >
            Pricing
          </Link>
          <a
            href="/#markets"
            className="px-2.5 py-1.5 text-xs font-medium transition-colors hover:text-[#F8FAFC]"
            style={{ color: "#64748B" }}
          >
            Markets
          </a>
        </div>

        {/* App nav — signed-in */}
        <Show when="signed-in">
          <span className="h-4 w-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div className="flex items-center gap-0.5">
            <Link
              href="/deals"
              className="px-2.5 py-1.5 text-xs font-medium transition-colors hover:text-[#F8FAFC]"
              style={{ color: "#64748B" }}
            >
              Deals
            </Link>
            <Link
              href="/team"
              className="px-2.5 py-1.5 text-xs font-medium transition-colors hover:text-[#F8FAFC]"
              style={{ color: "#64748B" }}
            >
              Team
            </Link>
            <Link
              href="/audit"
              className="px-2.5 py-1.5 text-xs font-medium transition-colors hover:text-[#F8FAFC]"
              style={{ color: "#64748B" }}
            >
              Audit
            </Link>
          </div>
        </Show>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                className="h-8 px-3 text-xs font-medium transition-colors hover:text-[#F8FAFC] cursor-pointer"
                style={{ color: "#64748B" }}
              >
                Sign In
              </button>
            </SignInButton>
            <Link href="/deals/new">
              <button
                className="h-8 px-4 text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer"
                style={{ background: "#F59E0B", color: "#070B14" }}
              >
                Get Started Free
              </button>
            </Link>
          </Show>

          <Show when="signed-in">
            <Link href="/deals/new">
              <button
                className="h-8 px-3 text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer"
                style={{ background: "#F59E0B", color: "#070B14" }}
              >
                + New Deal
              </button>
            </Link>
            <UserButton appearance={{ elements: { avatarBox: "h-7 w-7" } }} />
          </Show>
        </div>
      </div>
    </nav>
  );
}
