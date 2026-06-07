"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { signalFlowSteps } from "./signalFlowData";

/**
 * SignalFlowDemo — Animated vertical flow diagram showing information
 * processing through human/AI systems.
 *
 * Each step lights up sequentially when the section scrolls into view.
 * Users can replay the animation via a button.
 *
 * Layout: vertical timeline with colored node, human text left, AI text right.
 */

/** Duration each step takes to light up (seconds) */
const STEP_DURATION = 1.2;
/** Delay between steps (seconds) */
const STEP_STAGGER = 0.9;

export default function SignalFlowDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  /** Index of the currently active (lit) step — -1 means none */
  const [activeStep, setActiveStep] = useState(-1);
  /** Whether the full sequence has played at least once */
  const [hasPlayed, setHasPlayed] = useState(false);
  /** Replay key to re-trigger animations */
  const [replayKey, setReplayKey] = useState(0);

  /** Run the step-by-step sequence */
  const playSequence = useCallback(() => {
    setActiveStep(-1);
    setHasPlayed(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    signalFlowSteps.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setActiveStep(index);
          if (index === signalFlowSteps.length - 1) {
            setHasPlayed(true);
          }
        }, index * (STEP_STAGGER * 1000 + STEP_DURATION * 200))
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Trigger on scroll into view
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const timer = window.setTimeout(() => {
      if (isInView) {
        cleanup = playSequence();
        return;
      }

      setActiveStep(-1);
      setHasPlayed(false);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      cleanup?.();
    };
  }, [isInView, replayKey, playSequence]);

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black py-24 px-6 flex flex-col items-center"
    >
      {/* ── Section header ── */}
      <motion.div
        className="text-center mb-16 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          How You Process the World
        </h2>
        <p className="text-gray-400 text-lg">
          Watch a thought travel through your systems
        </p>

        {/* Scenario */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-950 px-6 py-3">
          <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">
            Scenario
          </span>
          <span className="text-gray-300 text-sm">
            You see a friend across the street
          </span>
        </div>
      </motion.div>

      {/* ── Vertical flow timeline ── */}
      <div className="relative w-full max-w-4xl">
        {/* Vertical connecting line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-zinc-800" />

        {signalFlowSteps.map((step, index) => {
          const isActive = activeStep >= index;

          return (
            <motion.div
              key={step.id}
              className="relative grid grid-cols-[1fr_auto_1fr] gap-4 sm:gap-8 mb-12 last:mb-0 items-start"
              initial={{ opacity: 0.15 }}
              animate={isActive ? { opacity: 1 } : { opacity: 0.15 }}
              transition={{ duration: STEP_DURATION, ease: "easeOut" }}
            >
              {/* ── Human side (left) ── */}
              <div className="text-right pr-2">
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.15,
                    ease: "easeOut",
                  }}
                >
                  <span className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">
                    Human
                  </span>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {step.humanDescription}
                  </p>
                </motion.div>
              </div>

              {/* ── Center node ── */}
              <div className="flex flex-col items-center relative z-10">
                <motion.div
                  className="relative flex items-center justify-center"
                  animate={
                    isActive
                      ? { scale: [0.8, 1.15, 1] }
                      : { scale: 0.8 }
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Glow ring */}
                  {isActive && (
                    <motion.div
                      className="absolute rounded-full"
                      style={{
                        width: 52,
                        height: 52,
                        background: `radial-gradient(circle, ${step.color}33 0%, transparent 70%)`,
                      }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0.6 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    />
                  )}

                  {/* Node circle */}
                  <div
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold relative z-10"
                    style={{
                      borderColor: isActive ? step.color : "#3f3f46",
                      backgroundColor: isActive
                        ? `${step.color}20`
                        : "transparent",
                      color: isActive ? step.color : "#71717a",
                    }}
                  >
                    {index + 1}
                  </div>
                </motion.div>

                {/* Step label */}
                <span
                  className="text-[10px] sm:text-xs font-medium mt-2 whitespace-nowrap"
                  style={{ color: isActive ? step.color : "#52525b" }}
                >
                  {step.label}
                </span>
              </div>

              {/* ── AI side (right) ── */}
              <div className="text-left pl-2">
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.15,
                    ease: "easeOut",
                  }}
                >
                  <span className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">
                    AI System
                  </span>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {step.aiDescription}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}

        {/* ── Traveling signal pulse along the vertical line ── */}
        {isInView && activeStep >= 0 && activeStep < signalFlowSteps.length && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full z-20"
            style={{
              backgroundColor: signalFlowSteps[Math.min(activeStep, signalFlowSteps.length - 1)].color,
              boxShadow: `0 0 12px ${signalFlowSteps[Math.min(activeStep, signalFlowSteps.length - 1)].color}`,
            }}
            initial={{ top: "0%" }}
            animate={{
              top: `${(activeStep / (signalFlowSteps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* ── Replay button ── */}
      {hasPlayed && (
        <motion.button
          onClick={handleReplay}
          className="mt-16 px-6 py-3 rounded-full border border-zinc-700 bg-zinc-900 text-gray-300 text-sm font-medium hover:border-cyan-600 hover:text-cyan-400 transition-colors cursor-pointer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ↻ Replay sequence
        </motion.button>
      )}
    </section>
  );
}
