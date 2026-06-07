"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * HeroSection — The opening of the AI Human experience.
 *
 * Sequence:
 * 1. Complete darkness
 * 2. A warm heartbeat pulse fades in at center
 * 3. Text reveals line by line with staggered timing
 * 4. A "scroll to explore" prompt appears last
 *
 * The heartbeat uses a radial gradient div animated with
 * scale + opacity to simulate a biological pulse.
 */

/** Lines of hero copy with individual timing delays (ms from mount) */
const LINES = [
  {
    text: "You are an agentic system.",
    delay: 1500,
    className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white",
  },
  {
    text: "You reason. You perceive. You remember. You act.",
    delay: 3500,
    className: "text-lg sm:text-xl md:text-2xl text-gray-300",
  },
  {
    text: 'Everything we call "AI" — you\'ve been doing your entire life.',
    delay: 5000,
    className: "text-lg sm:text-xl md:text-2xl text-gray-400",
  },
] as const;

/** Delay (ms) before the scroll prompt appears */
const SCROLL_PROMPT_DELAY = 6500;

export default function HeroSection() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Schedule each line reveal
    LINES.forEach((line, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, index]);
        }, line.delay)
      );
    });

    // Schedule scroll prompt
    timers.push(
      setTimeout(() => {
        setShowScroll(true);
      }, SCROLL_PROMPT_DELAY)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* ── Subtle noise/grain texture overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ── Heartbeat pulse ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          background:
            "radial-gradient(circle, rgba(255,220,160,0.35) 0%, rgba(255,180,80,0.12) 40%, transparent 70%)",
        }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{
          scale: [0.6, 1.15, 0.85, 1.05, 0.9],
          opacity: [0, 0.9, 0.5, 0.75, 0.45],
        }}
        transition={{
          delay: 0.5,
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      {/* ── Second, slower outer glow layer ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(255,200,120,0.08) 0%, transparent 60%)",
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.2, 0.9, 1.1, 0.95],
          opacity: [0, 0.6, 0.25, 0.45, 0.2],
        }}
        transition={{
          delay: 0.7,
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      {/* ── Text content ── */}
      <div className="relative z-20 flex flex-col items-center text-center gap-6 px-6 max-w-4xl">
        <AnimatePresence>
          {LINES.map(
            (line, index) =>
              visibleLines.includes(index) && (
                <motion.p
                  key={line.text}
                  className={line.className}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  {line.text}
                </motion.p>
              )
          )}
        </AnimatePresence>

        {/* ── Scroll prompt ── */}
        {showScroll && (
          <motion.div
            className="mt-12 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-sm tracking-widest uppercase text-gray-500">
              Explore your systems
            </span>

            {/* Animated down arrow */}
            <motion.svg
              width="20"
              height="28"
              viewBox="0 0 20 28"
              fill="none"
              className="text-gray-500"
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              aria-hidden="true"
            >
              <path
                d="M10 2 L10 22 M3 17 L10 24 L17 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        )}
      </div>
    </section>
  );
}
