"use client";

import React, { useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";
import InfoPanel from "./InfoPanel";

/* Lazy-load the SVG to keep the initial bundle light */
const HumanFigureSVG = dynamic(() => import("./HumanFigureSVG"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
    </div>
  ),
});

/* We re-export the shape expected by InfoPanel */
interface BodyPartInfo {
  id: string;
  label: string;
  aiLabel: string;
  humanDescription: string;
  aiDescription: string;
  insight: string;
  color: string;
  icon: string;
}

/**
 * BodyExplorer — the interactive body section where visitors click
 * body parts to learn about human ↔ AI mappings.
 */
export default function BodyExplorer() {
  const [activePart, setActivePart] = useState<BodyPartInfo | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handlePartClick = useCallback(async (partId: string) => {
    /* Dynamic import so bodyPartData doesn't bloat the initial chunk */
    const { bodyParts } = await import("./bodyPartData");
    const part = bodyParts[partId];
    if (part) {
      setActivePart(part);
    }
  }, []);

  const closePanel = useCallback(() => setActivePart(null), []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 py-20"
      aria-label="Explore your systems"
    >
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-4 text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Explore Your Systems
        </h2>
        <p className="mt-3 max-w-lg text-base text-zinc-500">
          Click any part of the body to discover its AI equivalent.
          Every component of an AI agent already exists inside you.
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-8 flex flex-wrap justify-center gap-4 text-xs text-zinc-500"
      >
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400/60" />
          Human System
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400/60" />
          AI Equivalent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-violet-400/60" />
          Click to explore
        </span>
      </motion.div>

      {/* The Body */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-sm"
        style={{ height: "clamp(480px, 70vh, 680px)" }}
      >
        <HumanFigureSVG
          activePart={activePart?.id ?? null}
          signalPath={null}
          onPartClick={handlePartClick}
        />
      </motion.div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.4 } : {}}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-6 text-center text-sm text-zinc-600"
      >
        ↑ Tap a glowing node to begin
      </motion.p>

      {/* Info Panel */}
      <InfoPanel part={activePart} onClose={closePanel} />
    </section>
  );
}
