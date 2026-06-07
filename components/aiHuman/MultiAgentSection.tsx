"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * MultiAgentSection — The zoom-out from a single agent to many.
 *
 * Visuals:
 * - A single constellation figure (dots + lines forming a person)
 * - On scroll, it slides left and 4 more figures fade in beside it
 * - Each figure has a different glowing highlight area
 * - Thin communication lines connect the figures
 * - Text below explains the multi-agent parallel
 */

/**
 * Constellation figure data.
 * Each figure is a simplified dot-and-line stick person.
 * `highlightNode` specifies which body point glows in a unique color.
 */
interface ConstellationFigure {
  id: string;
  /** Which body node gets a colored glow */
  highlightNode: "head" | "leftHand" | "rightHand" | "heart" | "eyes";
  /** Color for the highlighted node */
  glowColor: string;
  /** Label for the specialization */
  label: string;
}

const FIGURES: ConstellationFigure[] = [
  { id: "fig-1", highlightNode: "head", glowColor: "#8b5cf6", label: "Strategist" },
  { id: "fig-2", highlightNode: "eyes", glowColor: "#06b6d4", label: "Observer" },
  { id: "fig-3", highlightNode: "heart", glowColor: "#f59e0b", label: "Memory Keeper" },
  { id: "fig-4", highlightNode: "leftHand", glowColor: "#22c55e", label: "Builder" },
  { id: "fig-5", highlightNode: "rightHand", glowColor: "#ef4444", label: "Verifier" },
];

/**
 * Body node positions for a 40x80 viewBox stick figure.
 * These form the constellation silhouette.
 */
const BODY_NODES = {
  head: { cx: 20, cy: 8 },
  eyes: { cx: 20, cy: 10 },
  neck: { cx: 20, cy: 16 },
  heart: { cx: 20, cy: 28 },
  leftShoulder: { cx: 8, cy: 22 },
  rightShoulder: { cx: 32, cy: 22 },
  leftHand: { cx: 2, cy: 38 },
  rightHand: { cx: 38, cy: 38 },
  hip: { cx: 20, cy: 44 },
  leftFoot: { cx: 10, cy: 72 },
  rightFoot: { cx: 30, cy: 72 },
};

/** Lines connecting body nodes (pairs of node keys) */
const BODY_LINES: [keyof typeof BODY_NODES, keyof typeof BODY_NODES][] = [
  ["head", "neck"],
  ["neck", "leftShoulder"],
  ["neck", "rightShoulder"],
  ["leftShoulder", "leftHand"],
  ["rightShoulder", "rightHand"],
  ["neck", "heart"],
  ["heart", "hip"],
  ["hip", "leftFoot"],
  ["hip", "rightFoot"],
];

/**
 * Renders a single constellation figure as an SVG.
 */
function ConstellationFigure({
  figure,
  isActive,
}: {
  figure: ConstellationFigure;
  isActive: boolean;
}) {
  return (
    <svg
      viewBox="0 0 40 80"
      className="w-16 h-20 sm:w-20 sm:h-24"
      aria-hidden="true"
    >
      {/* Body lines (filaments) */}
      {BODY_LINES.map(([from, to]) => {
        const a = BODY_NODES[from];
        const b = BODY_NODES[to];
        return (
          <line
            key={`${from}-${to}`}
            x1={a.cx}
            y1={a.cy}
            x2={b.cx}
            y2={b.cy}
            stroke={isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}
            strokeWidth="0.5"
          />
        );
      })}

      {/* Body nodes (dots) */}
      {Object.entries(BODY_NODES).map(([key, pos]) => {
        const isHighlight = key === figure.highlightNode;

        return (
          <g key={key}>
            {/* Glow behind highlighted node */}
            {isHighlight && isActive && (
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={6}
                fill={`${figure.glowColor}40`}
              >
                <animate
                  attributeName="r"
                  values="4;8;4"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.7;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={pos.cx}
              cy={pos.cy}
              r={isHighlight ? 2 : 1.2}
              fill={
                isHighlight && isActive
                  ? figure.glowColor
                  : isActive
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.12)"
              }
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function MultiAgentSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

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
        From One to Many
      </motion.h2>

      {/* ── Figures row ── */}
      <div className="relative flex flex-row items-end justify-center gap-6 sm:gap-10 md:gap-14 mb-16">
        {FIGURES.map((figure, index) => {
          const isFirst = index === 0;

          return (
            <motion.div
              key={figure.id}
              className="flex flex-col items-center gap-3"
              initial={
                isFirst
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, scale: 0.7 }
              }
              animate={
                isInView
                  ? { opacity: 1, x: 0, scale: 1 }
                  : isFirst
                  ? {}
                  : { opacity: 0, scale: 0.7 }
              }
              transition={{
                duration: 0.6,
                delay: isFirst ? 0 : 0.4 + index * 0.2,
                ease: "easeOut",
              }}
            >
              <ConstellationFigure figure={figure} isActive={isInView} />

              {/* Label below figure */}
              <motion.span
                className="text-[10px] sm:text-xs font-medium tracking-wide"
                style={{ color: figure.glowColor }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{
                  duration: 0.4,
                  delay: 0.8 + index * 0.2,
                }}
              >
                {figure.label}
              </motion.span>
            </motion.div>
          );
        })}

        {/* ── Communication lines between figures ── */}
        {isInView && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Horizontal connecting lines rendered at ~40% from top */}
            {[0, 1, 2, 3].map((i) => {
              const totalGaps = FIGURES.length - 1;
              const segmentWidth = 100 / FIGURES.length;
              const x1 = segmentWidth * i + segmentWidth / 2;
              const x2 = segmentWidth * (i + 1) + segmentWidth / 2;

              return (
                <motion.line
                  key={`conn-${i}`}
                  x1={`${x1}%`}
                  y1="35%"
                  x2={`${x2}%`}
                  y2="35%"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.2 + i * 0.15,
                  }}
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* ── Insight text ── */}
      <motion.div
        className="max-w-2xl text-center space-y-6"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 1.6 }}
      >
        <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
          One human is an agent.{" "}
          <span className="text-white font-semibold">
            A team of humans is a multi-agent system.
          </span>
        </p>

        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          No single human in a team has all the context. But together,
          through structured communication, they solve problems none of
          them could solve alone.
        </p>
      </motion.div>
    </section>
  );
}
