"use client";

import React from "react";
import dynamic from "next/dynamic";

/* ── Section Components (lazy-loaded for code-splitting) ────────────── */

const HeroSection = dynamic(() => import("@/components/aiHuman/HeroSection"), {
  ssr: false,
});

const BodyExplorer = dynamic(
  () => import("@/components/aiHuman/BodyExplorer"),
  { ssr: false }
);

const SignalFlowDemo = dynamic(
  () => import("@/components/aiHuman/SignalFlowDemo"),
  { ssr: false }
);

const HallucinationSection = dynamic(
  () => import("@/components/aiHuman/HallucinationSection"),
  { ssr: false }
);

const MultiAgentSection = dynamic(
  () => import("@/components/aiHuman/MultiAgentSection"),
  { ssr: false }
);

const MirrorSection = dynamic(
  () => import("@/components/aiHuman/MirrorSection"),
  { ssr: false }
);

/**
 * AiHumanClient — the root client component that assembles all sections
 * of the "Humans Are Agentic Systems Too" interactive experience.
 *
 * Each section is a full-viewport scroll-driven narrative piece.
 * Sections are lazy-loaded via next/dynamic for optimal performance.
 */
export default function AiHumanClient() {
  return (
    <main className="relative bg-black text-white selection:bg-cyan-500/30">
      {/* 1. Opening — darkness, heartbeat, text reveal */}
      <HeroSection />

      {/* 2. Body Explorer — interactive constellation with info panels */}
      <BodyExplorer />

      {/* 3. Signal Flow — perception cascade demo */}
      <SignalFlowDemo />

      {/* 4. Hallucination — the unforgettable error moment */}
      <HallucinationSection />

      {/* 5. Multi-Agent — one body becomes many */}
      <MultiAgentSection />

      {/* 6. Mirror — the emotional closing */}
      <MirrorSection />
    </main>
  );
}
