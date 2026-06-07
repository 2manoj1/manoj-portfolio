"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
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
  systemType: string;
  humanDescription: string;
  aiDescription: string;
  insight: string;
  detailPoints: string[];
  color: string;
  icon: string;
}

const COMPARISON_ROWS = [
  {
    partId: "brain",
    human: "Brain",
    ai: "LLM reasoning",
    detail: "Plans, attends, and decides next action.",
  },
  {
    partId: "nervous-system",
    human: "Spine + nerves",
    ai: "MCP / event bus",
    detail: "Routes signals between model, tools, memory, and UI.",
  },
  {
    partId: "memory",
    human: "Hippocampus",
    ai: "GraphRAG",
    detail: "Retrieves grounded context instead of guessing.",
  },
  {
    partId: "hands",
    human: "Hands",
    ai: "Tools / APIs",
    detail: "Turns intent into controlled external action.",
  },
  {
    partId: "reflexes",
    human: "Reflexes",
    ai: "Guardrails",
    detail: "Blocks unsafe actions before reasoning drifts.",
  },
] as const;

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
      className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      aria-label="Human anatomy mapped to AI architecture"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/75">
            anatomy as architecture
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            A human body is already an AI system diagram.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Tap a body system to compare the anatomy with the matching AI layer:
            reasoning, memory, context, routing, tools, interface, and safety.
          </p>
        </motion.div>

        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.18, duration: 0.9, ease: "easeOut" }}
            className="relative mx-auto h-[min(74vh,720px)] min-h-[560px] w-full max-w-[620px] max-[380px]:min-h-[510px] sm:min-h-[640px] lg:h-[760px]"
          >
            <HumanFigureSVG
              activePart={activePart?.id ?? null}
              signalPath={null}
              onPartClick={handlePartClick}
            />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.32, duration: 0.8, ease: "easeOut" }}
            className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/30 backdrop-blur md:p-5"
            aria-label="AI and human anatomy comparison"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                  comparison
                </p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-white">
                  Body system -&gt; AI layer
                </h3>
              </div>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 font-mono text-[10px] uppercase text-cyan-200">
                interactive
              </span>
            </div>

            <div className="grid gap-2.5">
              {COMPARISON_ROWS.map((row, index) => {
                const isActive = activePart?.id === row.partId;

                return (
                  <button
                    key={row.partId}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => void handlePartClick(row.partId)}
                    className="group rounded-[8px] border border-white/10 bg-black/28 p-3 text-left transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40 data-[active=true]:border-cyan-300/45 data-[active=true]:bg-cyan-300/[0.08]"
                    data-active={isActive}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-mono text-[10px] text-zinc-400 group-hover:text-cyan-200">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {row.human}
                        </p>
                        <p className="truncate font-mono text-[11px] uppercase text-cyan-300/75">
                          {row.ai}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      {row.detail}
                    </p>
                  </button>
                );
              })}
            </div>

            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-zinc-500">
              The body is not a metaphor for one model. It is closer to a full
              production AI platform: sensors, memory, routing, policies,
              action, feedback, and recovery loops.
            </p>
          </motion.aside>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.48 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center text-xs text-zinc-600 sm:text-sm"
        >
          Tap any glowing anatomy node for the detailed AI comparison.
        </motion.p>
      </div>

      {/* Info Panel */}
      <InfoPanel part={activePart} onClose={closePanel} />
    </section>
  );
}
