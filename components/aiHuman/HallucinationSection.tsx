"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/**
 * HallucinationSection — The memorable hallucination demonstration.
 *
 * Narrative sequence:
 * 1. Prompt appears: "Someone asks you the name of your fourth-grade teacher."
 * 2. Searching dots pulse to simulate memory retrieval
 * 3. A confident (wrong) answer appears
 * 4. The correction fades in with red emphasis
 * 5. Insight text explains the parallel to AI hallucination
 * 6. A key takeaway card appears at the bottom
 */

/** Phases of the narrative sequence */
type Phase =
  | "idle"
  | "prompt"
  | "searching"
  | "confident"
  | "correction"
  | "insight"
  | "takeaway";

/** Phase timing config (ms delay from the previous phase completing) */
const PHASE_DELAYS: Record<Exclude<Phase, "idle">, number> = {
  prompt: 0,
  searching: 1200,
  confident: 2000,
  correction: 1500,
  insight: 1200,
  takeaway: 1400,
};

/** All phases in order */
const PHASE_ORDER: Phase[] = [
  "idle",
  "prompt",
  "searching",
  "confident",
  "correction",
  "insight",
  "takeaway",
];

export default function HallucinationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });
  const [currentPhase, setCurrentPhase] = useState<Phase>("idle");

  /** Get the numeric index of the current phase */
  const phaseIndex = PHASE_ORDER.indexOf(currentPhase);

  /** Check if a given phase has been reached */
  const hasReached = (phase: Phase) =>
    phaseIndex >= PHASE_ORDER.indexOf(phase);

  useEffect(() => {
    if (!isInView) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let cumulativeDelay = 0;

    // Schedule each phase transition
    PHASE_ORDER.slice(1).forEach((phase) => {
      cumulativeDelay += PHASE_DELAYS[phase as Exclude<Phase, "idle">];
      timers.push(
        setTimeout(() => setCurrentPhase(phase), cumulativeDelay)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black py-24 px-6 flex flex-col items-center justify-center"
    >
      {/* ── Section title ── */}
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-20 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        When You Get It Wrong
      </motion.h2>

      {/* ── Narrative container ── */}
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        {/* Phase: Prompt */}
        {hasReached("prompt") && (
          <motion.p
            className="text-lg sm:text-xl text-gray-300 text-center leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Someone asks you the name of your fourth-grade teacher.
          </motion.p>
        )}

        {/* Phase: Searching — pulsing dots */}
        {hasReached("searching") && !hasReached("confident") && (
          <motion.div
            className="flex items-center gap-3 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-400"
                animate={{
                  scale: [0.6, 1.3, 0.6],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
            <span className="text-xs text-amber-400/60 ml-2 uppercase tracking-widest">
              Searching memory…
            </span>
          </motion.div>
        )}

        {/* Phase: Confident answer */}
        {hasReached("confident") && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-2xl sm:text-3xl font-bold text-white">
              &ldquo;Mrs. Henderson.&rdquo;
            </p>
          </motion.div>
        )}

        {/* Phase: Correction */}
        {hasReached("correction") && (
          <motion.p
            className="text-lg sm:text-xl text-center"
            style={{ color: "#ef4444" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Her name was{" "}
            <span className="font-semibold">Mrs. Patterson.</span>
          </motion.p>
        )}

        {/* Phase: Insight text */}
        {hasReached("insight") && (
          <motion.div
            className="mt-6 space-y-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg text-gray-300 leading-relaxed">
              You didn&apos;t lie. You didn&apos;t guess.{" "}
              <span className="text-white font-semibold">
                You hallucinated.
              </span>
            </p>
            <p className="text-base text-gray-400 leading-relaxed max-w-xl mx-auto">
              Your brain generated a plausible completion from partial memory
              — exactly the way a language model does.
            </p>
          </motion.div>
        )}

        {/* Phase: Key Takeaway Card */}
        {hasReached("takeaway") && (
          <motion.div
            className="mt-12 w-full max-w-xl rounded-lg border border-emerald-800/40 bg-emerald-950/20 p-6 sm:p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Subtle green accent line at top */}
            <div className="w-12 h-0.5 bg-emerald-500/60 mb-4 rounded-full" />

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              AI hallucinations aren&apos;t a bug to be fixed. They&apos;re
              a consequence of how generation works — in silicon and in
              neurons.
            </p>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mt-3">
              The solution isn&apos;t to stop generating.{" "}
              <span className="text-emerald-400 font-medium">
                It&apos;s to verify.
              </span>
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Subtle red ambient glow behind the correction ── */}
      {hasReached("correction") && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 60%)",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          aria-hidden="true"
        />
      )}
    </section>
  );
}
