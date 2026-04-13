"use client";

import Link from "next/link";
import {
  motion, useInView, useScroll, useTransform, AnimatePresence,
} from "motion/react";
import { useRef, useState, useEffect } from "react";
import WireframeDottedGlobe from "@/components/ui/wireframe-dotted-globe";
import {
  ArrowRight, ArrowUpRight, Shield, CheckCircle, AlertTriangle,
} from "lucide-react";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
// Deep espresso — trading floor at 2am, warm filament light, zero blue cast
const T = {
  bg:      "#0C0A07",   // espresso black — warm, not navy
  s1:      "#131009",   // first surface lift
  s2:      "#1A1610",   // card/panel surface
  s3:      "#221C14",   // raised component bg
  border:  "rgba(255,210,110,0.07)",   // amber-warm tinted border
  borderHi:"rgba(255,210,110,0.14)",   // highlight border
  amber:   "#F59E0B",
  amberDim:"rgba(245,158,11,0.08)",
  amberLo: "rgba(245,158,11,0.16)",
  amberMid:"rgba(245,158,11,0.26)",
  green:   "#10B981", greenDim:"rgba(16,185,129,0.08)",  greenLo:"rgba(16,185,129,0.2)",
  red:     "#EF4444", redDim:"rgba(239,68,68,0.07)",     redLo:"rgba(239,68,68,0.22)",
  cyan:    "#06B6D4", cyanDim:"rgba(6,182,212,0.07)",    cyanLo:"rgba(6,182,212,0.18)",
  purple:  "#8B5CF6", purpleDim:"rgba(139,92,246,0.07)", purpleLo:"rgba(139,92,246,0.18)",
  text:    "#EEF2F8",
  sub:     "#7A8898",
  muted:   "#3D4557",
  mono:    "var(--font-mono)",
  sans:    "var(--font-sans)",
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type:"spring" as const, stiffness:280, damping:22 };

function fadeUp(delay = 0) {
  return {
    initial:     { opacity:0, y:20, filter:"blur(6px)" },
    whileInView: { opacity:1, y:0,  filter:"blur(0px)" },
    viewport:    { once:true, margin:"-60px" },
    transition:  { duration:0.72, delay, ease:EASE },
  };
}

// ─── GRAIN OVERLAY — fixed, GPU-safe ──────────────────────────────────────────
function GrainOverlay() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none" style={{
      backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      opacity:0.02, mixBlendMode:"overlay" as const,
    }}/>
  );
}

// ─── BLUR REVEAL — word-by-word ────────────────────────────────────────────────
function BlurReveal({ text, className }: { text:string; className?:string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once:true });
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <motion.span key={i}
          initial={{ opacity:0, filter:"blur(10px)", y:16 }}
          animate={inView ? { opacity:1, filter:"blur(0px)", y:0 } : {}}
          transition={{ duration:0.65, delay:0.04 + i * 0.045, ease:EASE }}
          className="inline-block mr-[0.22em]"
        >{word}</motion.span>
      ))}
    </span>
  );
}

// ─── MARKET STRIP ─────────────────────────────────────────────────────────────
const TICKS = [
  {k:"BRENT CRUDE",v:"$78.42",d:"+1.15%",up:true},
  {k:"PANAMAX",v:"$12,450",d:"-2.40%",up:false},
  {k:"CORN",v:"$445.50",d:"-0.12%",up:false},
  {k:"WHEAT",v:"$584.25",d:"+1.24%",up:true},
  {k:"SOYBEANS",v:"$1,212.75",d:"+0.45%",up:true},
  {k:"LME COPPER",v:"$8,345",d:"+0.82%",up:true},
  {k:"GASOIL",v:"$692.50",d:"+0.65%",up:true},
  {k:"SUGAR",v:"$24.15",d:"-0.31%",up:false},
];

function MarketStrip() {
  const doubled = [...TICKS, ...TICKS];
  return (
    <motion.div
      initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
      transition={{duration:0.6,delay:0.3}}
      className="relative w-full overflow-hidden group"
      style={{background:T.s1, borderBottom:`1px solid ${T.border}`}}>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
        style={{background:`linear-gradient(to right,${T.s1},transparent)`}}/>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
        style={{background:`linear-gradient(to left,${T.s1},transparent)`}}/>
      <div className="flex items-center w-max gap-12 group-hover:[animation-play-state:paused] py-2.5"
        style={{animation:"cv-ticker 45s linear infinite"}}>
        {doubled.map((t,i)=>(
          <div key={i} className="flex items-center gap-2 px-2 shrink-0">
            <span style={{color:T.muted,fontSize:"8px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:T.mono}}>{t.k}</span>
            <span style={{color:T.text,fontSize:"11px",fontFamily:T.mono,fontWeight:600}}>{t.v}</span>
            <span style={{color:t.up?T.green:T.red,fontSize:"9px",fontFamily:T.mono,fontWeight:700}}>{t.d}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── HERO — text and globe structure UNTOUCHED ────────────────────────────────
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const {scrollYProgress} = useScroll({target:ref, offset:["start start","end start"]});
  const globeY = useTransform(scrollYProgress, [0,1], [0,55]);
  const [globeReady, setGlobeReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGlobeReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{background:T.bg,minHeight:"100dvh"}}>
      <div className="pointer-events-none absolute inset-0" style={{
        background:`radial-gradient(ellipse 70% 60% at 82% 26%, rgba(245,158,11,0.06) 0%, transparent 58%),
                   radial-gradient(ellipse 48% 38% at 18% 78%, rgba(6,182,212,0.02) 0%, transparent 58%)`,
      }}/>
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage:"radial-gradient(circle, rgba(245,158,11,0.11) 1px, transparent 1px)",
        backgroundSize:"28px 28px",
        maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
      }}/>
      <div className="relative mx-auto max-w-[1720px] px-5 lg:px-8" style={{minHeight:"100dvh"}}>
        <div className="grid lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch" style={{minHeight:"100dvh"}}>
          <div className="flex flex-col justify-center py-16 lg:py-28">
            <motion.div {...fadeUp(0)} className="mb-6">
              <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5" style={{
                background:T.amberDim, border:`1px solid ${T.amberLo}`,
                fontSize:"8px", fontWeight:700, letterSpacing:"0.2em",
                textTransform:"uppercase", color:T.amber, fontFamily:T.mono,
              }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{background:T.amber,animation:"cv-pulse 2s ease-in-out infinite"}}/>
                The Platform for Physical Commodity Traders
              </span>
            </motion.div>
            <h1 className="mb-6 font-black" style={{fontSize:"clamp(2.4rem,4.2vw,3.8rem)",lineHeight:1.05,color:T.text,letterSpacing:"-0.032em"}}>
              <BlurReveal text="The Platform for Physical Commodity Traders"/>
            </h1>
            <motion.p {...fadeUp(0.22)} style={{fontSize:"clamp(0.95rem,1.6vw,1.08rem)",lineHeight:1.78,color:T.sub,maxWidth:"500px",marginBottom:"2.5rem"}}>
              Automate document compliance, manage deals, track shipments, and act on market intelligence - one platform for your entire trading firm.
            </motion.p>
            <motion.div {...fadeUp(0.3)} className="flex items-center mb-8">
              <Link href="/pricing">
                <button className="group relative h-11 pl-5 pr-2 flex items-center gap-3 font-bold text-sm overflow-hidden"
                  style={{background:T.amber,color:T.bg,transition:"all 0.25s cubic-bezier(0.32,0.72,0,1)"}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="#FBBF24";el.style.transform="translateY(-1px)";}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background=T.amber;el.style.transform="translateY(0)";}}
                  onMouseDown={e=>{(e.currentTarget as HTMLElement).style.transform="scale(0.97)";}}
                  onMouseUp={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";}}>
                  <span className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.28) 50%,transparent 60%)",animation:"cv-shimmer-sweep 3.5s linear infinite"}}/>
                  <span className="relative z-10">Get Started Free</span>
                  <span className="relative z-10 flex h-7 w-7 items-center justify-center" style={{background:"rgba(0,0,0,0.15)"}}>
                    <ArrowRight size={12}/>
                  </span>
                </button>
              </Link>
            </motion.div>
            <motion.p {...fadeUp(0.38)} style={{fontSize:"11px",color:T.muted,fontFamily:T.mono}}>
              No setup. No templates. Start with live deals in minutes.
            </motion.p>
          </div>
          <div className="relative block overflow-hidden">
            {globeReady && (
              <motion.div className="absolute inset-0 flex items-center"
                initial={{opacity:0,x:36}} animate={{opacity:1,x:0}}
                transition={{duration:1.2,ease:EASE,delay:0.2}}
                style={{y:globeY}}>
                <div className="relative w-full" style={{height:"clamp(320px, 48vw, 640px)"}}>
                  <WireframeDottedGlobe className="w-full h-full" style={{willChange:"transform",backfaceVisibility:"hidden"}} loading="lazy"/>
                  <motion.div className="absolute pointer-events-none"
                    style={{top:"14%",right:"6%",animation:"cv-float 5s ease-in-out infinite"}}
                    initial={{opacity:0,x:18}} animate={{opacity:1,x:0}}
                    transition={{delay:1.3,duration:0.7,ease:EASE}}>
                    <div style={{background:"rgba(12,10,7,0.94)",border:"1px solid rgba(16,185,129,0.28)",backdropFilter:"blur(20px)",padding:"12px 14px",minWidth:"185px"}}>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={9} style={{color:T.green}} strokeWidth={2}/>
                        <span style={{color:T.green,fontSize:"8px",fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase",fontFamily:T.mono}}>Compliant</span>
                      </div>
                      <p style={{color:T.text,fontSize:"12px",fontWeight:700}}>4 docs verified</p>
                      <p style={{color:T.muted,fontSize:"9px",fontFamily:T.mono,marginTop:"3px"}}>COA, LC, BL, Contract</p>
                    </div>
                  </motion.div>
                  <motion.div className="absolute pointer-events-none"
                    style={{bottom:"20%",left:"4%",animation:"cv-float 5s ease-in-out infinite 2.2s"}}
                    initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}}
                    transition={{delay:1.6,duration:0.7,ease:EASE}}>
                    <div style={{background:"rgba(12,10,7,0.94)",border:`1px solid ${T.amberLo}`,backdropFilter:"blur(20px)",padding:"12px 14px",minWidth:"172px"}}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{background:T.amber,animation:"cv-pulse 2s ease-in-out infinite"}}/>
                        <span style={{color:T.amber,fontSize:"8px",fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase",fontFamily:T.mono}}>Live Route</span>
                      </div>
                      <p style={{color:T.text,fontSize:"12px",fontWeight:700}}>Rotterdam &#8594; Houston</p>
                      <p style={{color:T.muted,fontSize:"9px",fontFamily:T.mono,marginTop:"3px"}}>ETA 18 days &#183; Crude oil</p>
                    </div>
                  </motion.div>
                  <motion.div className="absolute pointer-events-none"
                    style={{bottom:"38%",right:"4%",animation:"cv-float 5s ease-in-out infinite 1s"}}
                    initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
                    transition={{delay:1.9,duration:0.7,ease:EASE}}>
                    <div style={{background:"rgba(12,10,7,0.94)",border:"1px solid rgba(239,68,68,0.26)",backdropFilter:"blur(20px)",padding:"12px 14px",minWidth:"158px"}}>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={9} style={{color:T.red}} strokeWidth={2}/>
                        <span style={{color:T.red,fontSize:"8px",fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase",fontFamily:T.mono}}>Alert</span>
                      </div>
                      <p style={{color:T.text,fontSize:"12px",fontWeight:700}}>Port mismatch</p>
                      <p style={{color:T.muted,fontSize:"9px",fontFamily:T.mono,marginTop:"3px"}}>Caught before cost</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.6,duration:0.8}}>
        <span style={{fontSize:"8px",letterSpacing:"0.2em",color:T.muted,textTransform:"uppercase",fontFamily:T.mono}}>scroll</span>
        <div className="h-8 w-px" style={{background:`linear-gradient(to bottom,${T.amber},transparent)`,animation:"cv-pulse 2s ease-in-out infinite"}}/>
      </motion.div>
    </section>
  );
}

// ─── ANIMATED FEATURE VISUALS ─────────────────────────────────────────────────

const DOC_ROWS = [
  {label:"Sulphur content", coa:"0.45%",        spec:"≤0.50%", pass:true},
  {label:"Flash point",     coa:"62°C",          spec:"≥60°C",  pass:true},
  {label:"Port of loading", coa:"Novorossiysk",  spec:"Odessa", pass:false},
  {label:"Quantity MT",     coa:"25,000",        spec:"25,000", pass:true},
];

// Phase 1 — animated document compliance scan
function DocScanVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once:true, margin:"-80px"});

  return (
    <div ref={ref} className="relative" style={{
      background:T.s2, border:`1px solid ${T.border}`,
      overflow:"hidden", fontFamily:T.mono,
    }}>
      {/* Amber scan line sweeps top → bottom on entry */}
      <motion.div
        initial={{top:"-2px", opacity:0}}
        animate={inView ? {top:"105%", opacity:[0,1,1,1,0]} : {}}
        transition={{duration:1.8, delay:0.15, ease:"linear"}}
        style={{
          position:"absolute", left:0, right:0, height:"1px", zIndex:10,
          background:`linear-gradient(to right, transparent 0%, ${T.amber} 30%, ${T.amber} 70%, transparent 100%)`,
          boxShadow:`0 0 14px 1px ${T.amber}`,
        }}
      />
      {/* Header row */}
      <div className="flex items-center justify-between" style={{
        padding:"10px 16px", borderBottom:`1px solid ${T.border}`, background:T.s1,
      }}>
        <div className="flex items-center gap-2">
          <motion.span
            animate={inView ? {opacity:[1,0.25,1]} : {}}
            transition={{duration:1.1, repeat:Infinity, repeatDelay:0.4}}
            style={{width:"6px",height:"6px",borderRadius:"50%",background:T.amber,display:"inline-block"}}
          />
          <span style={{fontSize:"8.5px",color:T.sub,letterSpacing:"0.1em",textTransform:"uppercase"}}>COA vs Contract</span>
        </div>
        <motion.span
          initial={{opacity:0}} animate={inView?{opacity:1}:{}}
          transition={{delay:1.9}}
          style={{fontSize:"8px",fontWeight:700,color:T.red,background:T.redDim,border:`1px solid ${T.redLo}`,padding:"2px 8px"}}
        >1 VIOLATION</motion.span>
      </div>
      {/* Column headers */}
      <div className="grid grid-cols-4" style={{padding:"5px 16px",borderBottom:`1px solid ${T.border}`,background:T.s3}}>
        {["Parameter","COA","Spec",""].map(h=>(
          <span key={h} style={{fontSize:"7px",color:T.muted,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase"}}>{h}</span>
        ))}
      </div>
      {/* Rows — stagger in on scroll entry */}
      {DOC_ROWS.map((row,i)=>(
        <motion.div key={i} className="grid grid-cols-4 items-center"
          initial={{opacity:0,x:-10}}
          animate={inView ? {opacity:1,x:0} : {}}
          transition={{delay:0.28+i*0.22, duration:0.48, ease:EASE}}
          style={{
            padding:"8px 16px",
            borderBottom:i<DOC_ROWS.length-1?`1px solid ${T.border}`:"none",
            background:row.pass?"transparent":"rgba(239,68,68,0.04)",
          }}
        >
          <span style={{fontSize:"8.5px",color:T.sub}}>{row.label}</span>
          <span style={{fontSize:"9.5px",color:T.text,fontWeight:700}}>{row.coa}</span>
          <span style={{fontSize:"8.5px",color:T.muted}}>{row.spec}</span>
          <motion.span className="flex items-center gap-1.5"
            initial={{opacity:0,scale:0.5}}
            animate={inView?{opacity:1,scale:1}:{}}
            transition={{delay:0.7+i*0.22, ...SPRING}}
          >
            {row.pass
              ?<><CheckCircle size={9} style={{color:T.green}} strokeWidth={2}/><span style={{fontSize:"8px",color:T.green,fontWeight:700}}>PASS</span></>
              :<><AlertTriangle size={9} style={{color:T.red}} strokeWidth={2}/><span style={{fontSize:"8px",color:T.red,fontWeight:700}}>FAIL</span></>
            }
          </motion.span>
        </motion.div>
      ))}
      {/* Footer */}
      <div className="flex items-center justify-between" style={{
        padding:"9px 16px",borderTop:`1px solid ${T.border}`,background:T.s1,
      }}>
        <motion.span initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:1.9}}
          style={{fontSize:"8px",color:T.muted}}>Full source trace per value</motion.span>
        <motion.span initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:2.1}}
          style={{fontSize:"8px",color:T.amber,fontWeight:700}}>Ready in 28s</motion.span>
      </div>
    </div>
  );
}

// Phase 2 — animated deal board with live status update
const DEALS_BOARD = [
  {name:"Crude Oil — VLCC Atlas",   port:"Rotterdam", status:"COMPLIANT",   c:"green"},
  {name:"Wheat SRW — Bulk Pacific", port:"Houston",   status:"1 VIOLATION", c:"red"},
  {name:"LNG — Horizon Star",       port:"Singapore", status:"PENDING",     c:"amber"},
  {name:"Soybeans — Ocean Prince",  port:"Santos",    status:"COMPLIANT",   c:"green"},
];

function DealBoardVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once:true, margin:"-80px"});
  const [showNotif, setShowNotif] = useState(false);
  const [lngResolved, setLngResolved] = useState(false);

  useEffect(()=>{
    if(!inView) return;
    const t1 = setTimeout(()=>setShowNotif(true), 2000);
    const t2 = setTimeout(()=>setLngResolved(true), 2400);
    const t3 = setTimeout(()=>setShowNotif(false), 5000);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  },[inView]);

  return (
    <div ref={ref} className="relative" style={{
      background:T.s2, border:`1px solid ${T.border}`,
      overflow:"hidden", fontFamily:T.mono,
    }}>
      {/* Notification card — spring-in, auto-dismiss */}
      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{opacity:0,y:-14,scale:0.94}}
            animate={{opacity:1,y:0,scale:1}}
            exit={{opacity:0,y:-10,scale:0.96}}
            transition={{...SPRING}}
            style={{
              position:"absolute",top:"10px",right:"10px",zIndex:20,
              background:"rgba(7,8,14,0.96)",
              border:`1px solid ${T.cyanLo}`,
              backdropFilter:"blur(18px)",
              padding:"10px 14px", minWidth:"190px",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <motion.span animate={{opacity:[1,0.3,1]}} transition={{duration:1.2,repeat:Infinity}}
                style={{width:"5px",height:"5px",borderRadius:"50%",background:T.cyan,display:"inline-block"}}/>
              <span style={{fontSize:"7.5px",color:T.cyan,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase"}}>Analysis Complete</span>
            </div>
            <p style={{fontSize:"10px",color:T.text,fontWeight:700,marginBottom:"2px"}}>LNG — Horizon Star</p>
            <p style={{fontSize:"8px",color:T.green}}>All 4 documents verified &#183; COMPLIANT</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between" style={{padding:"10px 16px",borderBottom:`1px solid ${T.border}`,background:T.s1}}>
        <span style={{fontSize:"8.5px",color:T.cyan,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase"}}>Deal Workspace</span>
        <span style={{fontSize:"8.5px",color:T.muted}}>4 active</span>
      </div>
      <div className="grid grid-cols-3" style={{padding:"5px 16px",borderBottom:`1px solid ${T.border}`,background:T.s3}}>
        {["Deal","Port","Status"].map(h=>(
          <span key={h} style={{fontSize:"7px",color:T.muted,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase"}}>{h}</span>
        ))}
      </div>
      {DEALS_BOARD.map((deal,i)=>{
        const isLng = deal.name.includes("LNG");
        const s = isLng&&lngResolved ? {status:"COMPLIANT",c:"green"} : {status:deal.status,c:deal.c};
        return (
          <motion.div key={i} className="grid grid-cols-3 items-center"
            initial={{opacity:0,x:12}}
            animate={inView?{opacity:1,x:0}:{}}
            transition={{delay:0.15+i*0.12,duration:0.44,ease:EASE}}
            style={{
              padding:"7px 16px",
              borderBottom:i<DEALS_BOARD.length-1?`1px solid ${T.border}`:"none",
            }}
          >
            <span style={{fontSize:"8.5px",color:T.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}}>{deal.name}</span>
            <span style={{fontSize:"8px",color:T.muted}}>{deal.port}</span>
            <AnimatePresence mode="wait">
              <motion.span key={s.status}
                initial={{opacity:0,scale:0.7}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.7}}
                transition={{...SPRING}}
                style={{
                  fontSize:"7.5px",fontWeight:700,padding:"2px 7px",display:"inline-block",
                  color:s.c==="green"?T.green:s.c==="red"?T.red:T.amber,
                  background:s.c==="green"?T.greenDim:s.c==="red"?T.redDim:T.amberDim,
                  border:`1px solid ${s.c==="green"?T.greenLo:s.c==="red"?T.redLo:T.amberLo}`,
                }}
              >{s.status}</motion.span>
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// Phase 3 — Terminal: market prices + vessel tracking
const MKT = [
  {l:"BRENT CRUDE",v:"$78.42",d:"+1.15%",up:true},
  {l:"PANAMAX",    v:"$12,450",d:"−2.40%",up:false},
  {l:"SOYBEANS",  v:"$1,212.75",d:"+0.45%",up:true},
  {l:"LME COPPER",v:"$8,345", d:"+0.82%",up:true},
];
const VESSELS = [
  {name:"VLCC Atlas",  route:"Rotterdam → Houston", eta:"ETA 18d",status:"On time",ok:true},
  {name:"Bulk Pacific",route:"Odessa → Santos",     eta:"ETA 9d", status:"Delayed 2d",ok:false},
];

function TerminalVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once:true, margin:"-80px"});

  return (
    <div ref={ref} style={{
      background:T.s2, border:`1px solid ${T.border}`,
      fontFamily:T.mono, overflow:"hidden",
    }}>
      <div className="flex items-center justify-between" style={{padding:"10px 16px",borderBottom:`1px solid ${T.border}`,background:T.s1}}>
        <div className="flex items-center gap-2">
          <motion.span
            animate={inView?{opacity:[1,0.25,1]}:{}}
            transition={{duration:1.4,repeat:Infinity,repeatDelay:0.3}}
            style={{width:"6px",height:"6px",borderRadius:"50%",background:T.purple,display:"inline-block"}}
          />
          <span style={{fontSize:"8.5px",color:T.purple,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase"}}>Intelligence Layer</span>
        </div>
        <motion.span
          animate={inView?{opacity:[0.4,1,0.4]}:{}}
          transition={{duration:2.8,repeat:Infinity}}
          style={{fontSize:"8px",color:T.muted}}
        >LIVE &#183; updated 8s ago</motion.span>
      </div>

      {/* Market prices — stagger in */}
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
        <span style={{fontSize:"7px",color:T.muted,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:"8px"}}>Market Context</span>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {MKT.map((r,i)=>(
            <motion.div key={i} className="flex items-center justify-between"
              initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:0.18+i*0.14}}>
              <span style={{fontSize:"8px",color:T.muted}}>{r.l}</span>
              <div className="flex items-center gap-1.5">
                <span style={{fontSize:"9px",color:T.text,fontWeight:700}}>{r.v}</span>
                <span style={{fontSize:"8px",color:r.up?T.green:T.red,fontWeight:600}}>{r.d}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Vessel tracking */}
      <div style={{padding:"12px 16px"}}>
        <span style={{fontSize:"7px",color:T.muted,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:"8px"}}>Vessel Tracking</span>
        {VESSELS.map((v,i)=>(
          <motion.div key={i} className="flex items-start justify-between"
            initial={{opacity:0,x:10}}
            animate={inView?{opacity:1,x:0}:{}}
            transition={{delay:0.55+i*0.18,ease:EASE}}
            style={{
              paddingBottom:"8px",marginBottom:"8px",
              borderBottom:i<VESSELS.length-1?`1px solid ${T.border}`:"none",
            }}
          >
            <div>
              <p style={{fontSize:"9px",color:T.text,fontWeight:700,marginBottom:"2px"}}>{v.name}</p>
              <p style={{fontSize:"7.5px",color:T.muted}}>{v.route} &#183; {v.eta}</p>
            </div>
            <motion.span
              initial={{opacity:0,scale:0.7}} animate={inView?{opacity:1,scale:1}:{}}
              transition={{delay:0.9+i*0.18,...SPRING}}
              style={{
                fontSize:"7.5px",fontWeight:700,padding:"2px 7px",
                color:v.ok?T.green:T.amber,
                background:v.ok?T.greenDim:T.amberDim,
                border:`1px solid ${v.ok?T.greenLo:T.amberLo}`,
              }}
            >{v.status}</motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── FEATURES — three equal horizontal rows, all phases ──────────────────────
const FEATURE_ROWS = [
  {
    phase:"Phase 1",
    accent:T.amber, accentDim:T.amberDim, accentLo:T.amberLo,
    eyebrow:"Document Intelligence",
    headline:"Never approve a shipment on a document you haven't checked.",
    body:"AI extracts every parameter from any COA, contract, LC, or Bill of Lading — no templates, no manual entry. A deterministic rule engine checks every value and returns a COMPLIANT or NON-COMPLIANT verdict with full source traceability. In under 30 seconds.",
    cta:"Start with 3 free analyses",
    href:"/pricing",
    Visual:DocScanVisual,
    reversed:false,
    glow:"rgba(245,158,11,0.04)",
    glowPos:"right",
  },
  {
    phase:"Phase 2",
    accent:T.cyan, accentDim:T.cyanDim, accentLo:T.cyanLo,
    eyebrow:"Deal Workspace",
    headline:"Your ops team found a violation. Your trader needs to know. Right now.",
    body:"Team workspace for the full shipment document set. LC compliance, Bill of Lading checks, cross-document conflicts, audit log. Every team member sees the same status. Green means release payment. Red means stop — and the reason is right there.",
    cta:"See how teams use it",
    href:"/products",
    Visual:DealBoardVisual,
    reversed:true,
    glow:"rgba(6,182,212,0.035)",
    glowPos:"left",
  },
  {
    phase:"Phase 3",
    accent:T.purple, accentDim:T.purpleDim, accentLo:T.purpleLo,
    eyebrow:"Terminal Intelligence",
    headline:"Your cargo is on the water right now. Do you know where it is?",
    body:"Vessel tracking, live freight rates, commodity price context, counterparty sanctions screening, and counterparty intelligence — surfaced inside your active deals where decisions actually happen. Stop switching between five platforms to understand one trade.",
    cta:"Explore the terminal",
    href:"/products",
    Visual:TerminalVisual,
    reversed:false,
    glow:"rgba(139,92,246,0.04)",
    glowPos:"right",
  },
];

function FeaturesSection() {
  return (
    <section style={{background:T.bg}}>
      {/* Section header */}
      <div className="mx-auto max-w-[1400px] px-5 lg:px-8 pt-32 lg:pt-44 pb-20 lg:pb-28 text-center flex flex-col items-center">
        <motion.h2 {...fadeUp(0.06)} style={{
          fontSize:"clamp(2rem,4vw,3.1rem)",fontWeight:900,
          letterSpacing:"-0.033em",lineHeight:1.06,color:T.text,maxWidth:"760px",
        }}>
          Where deals move forward.
        </motion.h2>
        <motion.p {...fadeUp(0.12)} style={{
          marginTop:"1rem",fontSize:"clamp(0.92rem,1.5vw,1.05rem)",lineHeight:1.78,
          color:T.sub,maxWidth:"56ch",
        }}>
          Bring clarity and control to every trade decision.
        </motion.p>
        <motion.div {...fadeUp(0.18)} className="mt-8">
          <Link href="/products">
            <button className="group relative h-11 pl-5 pr-2 flex items-center gap-3 font-bold text-sm overflow-hidden"
              style={{background:T.amber,color:T.bg,transition:"all 0.25s cubic-bezier(0.32,0.72,0,1)"}}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="#FBBF24";el.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background=T.amber;el.style.transform="translateY(0)";}}
              onMouseDown={e=>{(e.currentTarget as HTMLElement).style.transform="scale(0.97)";}}
              onMouseUp={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";}}>
              <span className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.28) 50%,transparent 60%)",animation:"cv-shimmer-sweep 3.5s linear infinite"}}/>
              <span className="relative z-10">Explore features</span>
              <span className="relative z-10 flex h-7 w-7 items-center justify-center" style={{background:"rgba(0,0,0,0.15)"}}>
                <ArrowRight size={12}/>
              </span>
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Three feature rows */}
      {FEATURE_ROWS.map((row, rowIdx) => {
        const { Visual } = row;
        return (
          <div key={rowIdx} style={{borderTop:`1px solid ${T.border}`,position:"relative",overflow:"hidden"}}>
            {/* Atmospheric glow per phase */}
            <div className="pointer-events-none absolute inset-0" style={{
              background:`radial-gradient(ellipse 55% 70% at ${row.glowPos==="right"?"85% 50%":"15% 50%"}, ${row.glow} 0%, transparent 70%)`,
            }}/>
            <div className="relative mx-auto max-w-[1400px] px-5 lg:px-8 py-24 lg:py-32">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${row.reversed?"":"lg:[&>*:first-child]:order-first"}`}>

                {/* Text side */}
                <div className={row.reversed ? "lg:order-2" : ""}>
                  <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-7">
                    <span style={{
                      fontSize:"8px",color:row.accent,fontWeight:700,
                      letterSpacing:"0.2em",textTransform:"uppercase",
                      fontFamily:T.mono,background:row.accentDim,
                      border:`1px solid ${row.accentLo}`,padding:"3px 10px",
                    }}>{row.eyebrow}</span>
                    <span style={{fontSize:"8px",color:T.muted,fontFamily:T.mono}}>{row.phase}</span>
                  </motion.div>

                  <motion.h3 {...fadeUp(0.06)} style={{
                    fontSize:"clamp(1.5rem,2.5vw,2.05rem)",fontWeight:900,
                    letterSpacing:"-0.026em",lineHeight:1.1,color:T.text,
                    marginBottom:"1.2rem",maxWidth:"480px",
                  }}>{row.headline}</motion.h3>

                  <motion.p {...fadeUp(0.12)} style={{
                    fontSize:"clamp(0.88rem,1.4vw,0.96rem)",lineHeight:1.82,
                    color:T.sub,maxWidth:"50ch",marginBottom:"2.2rem",
                  }}>{row.body}</motion.p>

                  <motion.div {...fadeUp(0.16)}>
                    <Link href={row.href}>
                      <button className="group inline-flex items-center gap-2 text-sm font-bold"
                        style={{color:row.accent,background:"transparent",transition:"gap 0.2s cubic-bezier(0.32,0.72,0,1)"}}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.gap="12px";}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.gap="8px";}}>
                        <span style={{borderBottom:`1px solid ${row.accentLo}`,paddingBottom:"1px"}}>{row.cta}</span>
                        <ArrowUpRight size={14}/>
                      </button>
                    </Link>
                  </motion.div>
                </div>

                {/* Animated visual side */}
                <motion.div
                  className={row.reversed ? "lg:order-1" : ""}
                  initial={{opacity:0, y:24, filter:"blur(8px)"}}
                  whileInView={{opacity:1, y:0, filter:"blur(0px)"}}
                  viewport={{once:true, margin:"-80px"}}
                  transition={{duration:0.8, delay:0.1, ease:EASE}}
                >
                  <Visual/>
                </motion.div>

              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

// ─── CTA — full platform vision, not Phase 1-focused ─────────────────────────
function CTASection() {
  return (
    <section className="relative overflow-hidden" style={{background:T.s1,borderTop:`1px solid ${T.border}`}}>
      <div className="pointer-events-none absolute inset-0" style={{
        background:`radial-gradient(ellipse 55% 45% at 50% 115%, rgba(245,158,11,0.08) 0%, transparent 70%)`,
      }}/>

      <div className="relative mx-auto max-w-[1400px] px-5 lg:px-8 py-32 lg:py-44">
        <div className="grid lg:grid-cols-[1fr_auto] gap-14 lg:gap-28 items-center">

          {/* Left — the platform vision, not a doc-checker pitch */}
          <div>
            <motion.span {...fadeUp(0)} style={{
              display:"block",color:T.muted,fontSize:"9px",fontWeight:700,
              letterSpacing:"0.22em",textTransform:"uppercase",fontFamily:T.mono,marginBottom:"1.6rem",
            }}>Start free</motion.span>
            <motion.h2 {...fadeUp(0.05)} style={{
              fontSize:"clamp(2rem,4.4vw,3.4rem)",fontWeight:900,
              letterSpacing:"-0.034em",lineHeight:1.06,color:T.text,maxWidth:"660px",marginBottom:"1.2rem",
            }}>
              The complete trade lifecycle.<br/>One platform.
            </motion.h2>
            <motion.p {...fadeUp(0.1)} style={{
              fontSize:"clamp(0.9rem,1.5vw,1.02rem)",lineHeight:1.8,
              color:T.sub,maxWidth:"52ch",
            }}>
              From first COA upload through team workspace, LC and BL compliance, vessel tracking, and market intelligence — built for physical commodity trading firms who need to move fast and move right.
            </motion.p>
          </div>

          {/* Right — CTA */}
          <motion.div {...fadeUp(0.14)} className="flex flex-col items-start lg:items-end gap-5" style={{flexShrink:0}}>
            <Link href="/pricing">
              <button className="relative h-12 pl-6 pr-2 flex items-center gap-3 font-bold text-sm overflow-hidden"
                style={{background:T.amber,color:T.bg,transition:"all 0.25s cubic-bezier(0.32,0.72,0,1)",minWidth:"210px"}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="#FBBF24";el.style.transform="translateY(-2px)";el.style.boxShadow="0 18px 44px rgba(245,158,11,0.24)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background=T.amber;el.style.transform="translateY(0)";el.style.boxShadow="none";}}>
                <span className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.28) 50%,transparent 60%)",animation:"cv-shimmer-sweep 3.5s linear infinite"}}/>
                <span className="relative z-10 flex-1">Get Started Free</span>
                <span className="relative z-10 flex h-8 w-8 items-center justify-center" style={{background:"rgba(0,0,0,0.15)"}}>
                  <ArrowRight size={13}/>
                </span>
              </button>
            </Link>
            <Link href="/products">
              <button className="h-12 px-6 flex items-center gap-2 text-sm font-semibold"
                style={{background:"transparent",border:`1px solid ${T.borderHi}`,color:T.sub,transition:"all 0.22s cubic-bezier(0.32,0.72,0,1)"}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=T.amber;el.style.color=T.amber;}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=T.borderHi;el.style.color=T.sub;}}>
                <span>Explore the platform</span>
                <ArrowUpRight size={13}/>
              </button>
            </Link>
            <p style={{fontSize:"10px",color:T.muted,fontFamily:T.mono,textAlign:"right"}}>Free &#183; $49/mo &#183; $199/mo &#183; Enterprise</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const FOOTER_COLS = [
  {title:"Platform",  links:[["Document Intelligence","/products"],["Deal Workspace","/products"],["Terminal Intelligence","/products"]]},
  {title:"Markets",   links:[["Grains & Oilseeds","#"],["Energy & Crude","#"],["Metals","#"],["Freight","#"]]},
  {title:"Resources", links:[["Documentation","#"],["API Reference","#"],["Status","#"],["Contact","#"]]},
  {title:"Company",   links:[["About","#"],["Blog","#"],["Careers","#"],["Privacy","#"]]},
];

function Footer() {
  return (
    <footer style={{background:T.bg, borderTop:`1px solid ${T.border}`}}>
      <div className="mx-auto max-w-[1400px] px-5 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <Shield size={13} style={{color:T.amber}} strokeWidth={2}/>
              <span style={{fontSize:"13px",fontWeight:800,fontFamily:T.mono,letterSpacing:"-0.01em",color:T.amber}}>CommodityView</span>
            </div>
            <p style={{fontSize:"12px",lineHeight:1.8,color:T.muted,maxWidth:"240px",marginBottom:"1.5rem"}}>
              The intelligence platform for physical commodity trading firms. Document compliance to market intelligence — one platform.
            </p>
            <div className="flex gap-2.5">
              {[
                {label:"X",  path:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"},
                {label:"LI", path:"M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"},
              ].map(({label,path})=>(
                <a key={label} href="#" aria-label={label} className="h-7 w-7 flex items-center justify-center opacity-30 hover:opacity-65 transition-opacity" style={{border:`1px solid ${T.border}`}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill={T.text}><path d={path}/></svg>
                </a>
              ))}
            </div>
          </div>
          {FOOTER_COLS.map(col=>(
            <div key={col.title}>
              <h4 style={{fontSize:"9px",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:T.sub,marginBottom:"1.2rem"}}>{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(([label,href])=>(
                  <li key={label}><Link href={href} className="text-xs opacity-30 hover:opacity-65 transition-opacity" style={{color:T.text}}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{borderTop:`1px solid ${T.border}`}}>
          <p style={{fontSize:"10px",color:T.muted,fontFamily:T.mono}}>&#169; 2026 CommodityView. Not financial advice. Market data for reference only.</p>
          <div className="flex gap-5">
            {["Terms","Privacy","Cookies"].map(l=>(
              <a key={l} href="#" className="text-[10px] opacity-35 hover:opacity-65 transition-opacity" style={{color:T.muted,fontFamily:T.mono}}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{background:T.bg, color:T.text}}>
      <GrainOverlay/>
      <MarketStrip/>
      <Hero/>
      <FeaturesSection/>
      <CTASection/>
      <Footer/>
    </div>
  );
}
