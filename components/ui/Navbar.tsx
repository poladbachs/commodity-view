"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

// ─── PALETTE — matches landing espresso tokens ────────────────────────────────
const C = {
  bg:        "rgba(12,10,7,0.72)",
  border:    "rgba(255,210,110,0.08)",
  borderHi:  "rgba(255,210,110,0.18)",
  amber:     "#F59E0B",
  amberHot:  "#FBBF24",
  text:      "#EEF2F8",
  sub:       "#7A8898",
  ink:       "#0C0A07",
  mono:      "var(--font-mono)",
} as const;

// ─── LOGO — pure institutional wordmark ───────────────────────────────────────
// Physical commodity houses (Glencore, Trafigura, Vitol, LDC, Cargill) lead with
// typography, not icons. Bold black sans, tight tracking, single accent color
// on the differentiator. The word IS the mark.
function Logo() {
  return (
    <span
      className="flex items-baseline select-none"
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "17px",
        fontWeight: 900,
        letterSpacing: "-0.032em",
        lineHeight: 1,
        textTransform: "none",
      }}
    >
      <span style={{ color: C.text }}>Commodity</span>
      <span
        style={{
          color: C.amber,
          // Subtle tighter kerning on the accent half for editorial rhythm
          letterSpacing: "-0.036em",
        }}
      >
        View
      </span>
      {/* Amber corner mark — a tiny cargo-placard flag, the only visual device */}
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "5px",
          height: "5px",
          background: C.amber,
          marginLeft: "5px",
          alignSelf: "flex-end",
          marginBottom: "2px",
        }}
      />
    </span>
  );
}

// ─── NAV LINK — with underline-on-hover + active state ────────────────────────
function NavLink({
  href, label, active,
}: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className="group relative flex items-center px-3 py-2 transition-colors"
      style={{
        fontSize: "11.5px",
        fontWeight: 600,
        letterSpacing: "0.01em",
        color: active ? C.text : C.sub,
        fontFamily: "var(--font-sans)",
      }}
    >
      <span
        className="transition-colors"
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.text; }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = active ? C.text : C.sub;
        }}
      >
        {label}
      </span>
      {/* Hover/active underline */}
      <span
        aria-hidden
        className="absolute left-3 right-3 bottom-1 h-px origin-left transition-transform duration-300"
        style={{
          background: C.amber,
          transform: active ? "scaleX(1)" : "scaleX(0)",
        }}
        data-active={active}
      />
      <style jsx>{`
        .group:hover span[aria-hidden] { transform: scaleX(1); }
      `}</style>
    </Link>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname() || "/";

  const links = [
    { href: "/products", label: "Products" },
    { href: "/pricing",  label: "Pricing"  },
  ];

  return (
    <nav
      className="sticky top-0 z-50 h-14 w-full flex-shrink-0"
      style={{
        background: C.bg,
        borderBottom: `1px solid ${C.border}`,
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
      }}
    >
      {/* Top hairline accent — subtle amber glow line */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${C.amber}22 20%, ${C.amber}33 50%, ${C.amber}22 80%, transparent 100%)`,
        }}
      />

      <div className="flex h-full items-center px-5 lg:px-8 gap-5 mx-auto max-w-[1400px]">

        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 flex-shrink-0 transition-opacity"
          style={{ outline: "none" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          <Logo />
        </Link>

        {/* Divider */}
        <span
          className="h-4 w-px flex-shrink-0"
          style={{ background: C.border }}
        />

        {/* Nav links */}
        <div className="flex items-center gap-0.5">
          {links.map(l => (
            <NavLink
              key={l.href}
              href={l.href}
              label={l.label}
              active={pathname === l.href || pathname.startsWith(l.href + "/")}
            />
          ))}
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                className="h-8 px-3 transition-colors cursor-pointer"
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: C.sub,
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.01em",
                  background: "transparent",
                  border: "none",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.text; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.sub; }}
              >
                Sign in
              </button>
            </SignInButton>

            <Link href="/deals/new">
              <button
                className="group flex items-center overflow-hidden cursor-pointer"
                style={{
                  height: "32px",
                  paddingLeft: "14px",
                  paddingRight: "4px",
                  background: C.amber,
                  transition: "all 0.22s cubic-bezier(0.32,0.72,0,1)",
                  border: "none",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = C.amberHot;
                  el.style.transform = "translateY(-1px)";
                  el.style.boxShadow = `0 8px 24px rgba(245,158,11,0.22)`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = C.amber;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                <span style={{
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: C.ink,
                  paddingRight: "10px",
                  letterSpacing: "0.01em",
                  fontFamily: "var(--font-sans)",
                }}>
                  Get started
                </span>
                <span
                  className="flex items-center justify-center"
                  style={{
                    width: "24px", height: "24px",
                    background: "rgba(0,0,0,0.16)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2 6 H10 M7 3 L10 6 L7 9" stroke={C.ink} strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter"/>
                  </svg>
                </span>
              </button>
            </Link>
          </Show>

          <Show when="signed-in">
            <Link href="/dashboard">
              <button
                className="h-8 px-3.5 transition-all cursor-pointer"
                style={{
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: C.ink,
                  background: C.amber,
                  border: "none",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.amberHot; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.amber; }}
              >
                Dashboard
              </button>
            </Link>
            <UserButton appearance={{ elements: { avatarBox: "h-7 w-7" } }} />
          </Show>
        </div>
      </div>
    </nav>
  );
}
