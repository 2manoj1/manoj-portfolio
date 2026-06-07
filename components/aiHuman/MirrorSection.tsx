"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

/**
 * MirrorSection — The emotional closing of the AI Human experience.
 *
 * Lines fade in one by one on scroll, building to a powerful final
 * statement. A warm pulse glows behind the climactic line.
 * Ends with a CTA linking to /engineering.
 */

/** Mirror lines with individual styling overrides */
const MIRROR_LINES = [
  {
    text: "You are 37 trillion cells coordinating through biochemical protocols.",
    className: "text-lg sm:text-xl text-gray-300",
  },
  {
    text: "You are a reasoning engine running on 20 watts.",
    className: "text-lg sm:text-xl text-gray-300",
  },
  {
    text: "You are a retrieval system with 2.5 petabytes of storage.",
    className: "text-lg sm:text-xl text-gray-300",
  },
  {
    text: "You are a multi-modal model that learned language in 24 months.",
    className: "text-lg sm:text-xl text-gray-300",
  },
] as const;

/** Stagger delay between lines (seconds) */
const LINE_STAGGER = 0.8;
/** Extra pause before the climactic line (seconds) */
const CLIMAX_PAUSE = 1.2;
/** Extra pause before the closing line */
const CLOSING_PAUSE = 1.0;

export default function MirrorSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.35 });

  /** Compute delay for each element */
  const getLineDelay = (index: number) => index * LINE_STAGGER;

  /** Delay for the climactic bold line */
  const climaxDelay =
    MIRROR_LINES.length * LINE_STAGGER + CLIMAX_PAUSE;

  /** Delay for the closing italic line */
  const closingDelay = climaxDelay + CLOSING_PAUSE + 0.6;

  /** Delay for the CTA */
  const ctaDelay = closingDelay + 1.2;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black py-24 px-6 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center text-center gap-5">
        {/* ── Sequential lines ── */}
        {MIRROR_LINES.map((line, index) => (
          <motion.p
            key={line.text}
            className={line.className}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: getLineDelay(index),
              ease: "easeOut",
            }}
          >
            {line.text}
          </motion.p>
        ))}

        {/* ── Climactic line with warm glow ── */}
        <div className="relative mt-8">
          {/* Warm pulse behind the text */}
          {isInView && (
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 400,
                height: 120,
                background:
                  "radial-gradient(ellipse, rgba(255,200,120,0.1) 0%, transparent 70%)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: [0, 0.8, 0.4, 0.7, 0.5],
                scale: [0.7, 1.1, 0.9, 1.05, 1],
              }}
              transition={{
                duration: 3,
                delay: climaxDelay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              aria-hidden="true"
            />
          )}

          <motion.p
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white relative z-10"
            style={{
              textShadow: "0 0 40px rgba(255,220,160,0.15)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.9,
              delay: climaxDelay,
              ease: "easeOut",
            }}
          >
            You are the most sophisticated agentic system ever built.
          </motion.p>
        </div>

        {/* ── Closing reflective line ── */}
        <motion.p
          className="text-lg sm:text-xl text-gray-400 italic mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            delay: closingDelay,
            ease: "easeOut",
          }}
        >
          Everything we build in AI is an attempt to understand you.
        </motion.p>

        {/* ── CTA ── */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: ctaDelay,
            ease: "easeOut",
          }}
        >
          <Link
            href="/engineering"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <span>Learn how I build AI systems</span>
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* ── Subtle ambient background glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center 60%, rgba(255,200,120,0.03) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
