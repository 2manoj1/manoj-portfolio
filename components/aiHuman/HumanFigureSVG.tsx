"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { bodyParts } from "./bodyPartData";
import type { BodyPart } from "./bodyPartData";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface HumanFigureSVGProps {
  /** Currently highlighted body part ID */
  activePart: string | null;
  /** Active signal animation between two parts */
  signalPath: { from: string; to: string } | null;
  /** Callback when a body-part node is clicked */
  onPartClick: (partId: string) => void;
  className?: string;
}

// ─────────────────────────────────────────────────────────────
// Color mapping — Tailwind color names → hex values
// Used for SVG fills/strokes where Tailwind classes can't reach
// ─────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  cyan: "#22d3ee",
  blue: "#3b82f6",
  violet: "#8b5cf6",
  red: "#ef4444",
  amber: "#f59e0b",
  orange: "#f97316",
  green: "#22c55e",
};

/** Warm white/gold — the default constellation node color */
const WARM_WHITE = "#f5f0e8";
const FILAMENT_COLOR = "rgba(245, 240, 232, 0.15)";
const FILAMENT_ACTIVE = "rgba(245, 240, 232, 0.35)";

function stableOffset(value: string, modulo: number) {
  return Array.from(value).reduce((total, char) => total + char.charCodeAt(0), 0) % modulo;
}

// ─────────────────────────────────────────────────────────────
// Decorative outline points — small dots that trace a
// recognizable human silhouette (head → shoulders → arms →
// torso → legs) to reinforce the constellation metaphor.
// ─────────────────────────────────────────────────────────────

const OUTLINE_DOTS: { x: number; y: number; r: number }[] = [
  // Head outline
  { x: 185, y: 55, r: 1.2 },
  { x: 215, y: 55, r: 1.0 },
  { x: 175, y: 70, r: 1.1 },
  { x: 225, y: 70, r: 1.3 },
  { x: 175, y: 95, r: 1.0 },
  { x: 225, y: 95, r: 1.2 },
  // Neck
  { x: 195, y: 150, r: 1.0 },
  { x: 205, y: 155, r: 1.1 },
  // Shoulders
  { x: 130, y: 210, r: 1.4 },
  { x: 270, y: 210, r: 1.3 },
  { x: 150, y: 200, r: 1.0 },
  { x: 250, y: 200, r: 1.1 },
  // Left arm
  { x: 115, y: 250, r: 1.2 },
  { x: 108, y: 290, r: 1.0 },
  { x: 102, y: 330, r: 1.1 },
  { x: 96, y: 370, r: 1.3 },
  // Right arm
  { x: 285, y: 250, r: 1.1 },
  { x: 292, y: 290, r: 1.2 },
  { x: 298, y: 330, r: 1.0 },
  { x: 304, y: 370, r: 1.3 },
  // Torso sides
  { x: 165, y: 240, r: 1.0 },
  { x: 235, y: 240, r: 1.1 },
  { x: 160, y: 310, r: 1.2 },
  { x: 240, y: 310, r: 1.0 },
  { x: 165, y: 380, r: 1.1 },
  { x: 235, y: 380, r: 1.2 },
  // Hips
  { x: 160, y: 450, r: 1.3 },
  { x: 240, y: 450, r: 1.2 },
  { x: 170, y: 470, r: 1.0 },
  { x: 230, y: 470, r: 1.1 },
  // Left leg
  { x: 168, y: 510, r: 1.1 },
  { x: 165, y: 550, r: 1.0 },
  { x: 160, y: 600, r: 1.2 },
  { x: 155, y: 640, r: 1.1 },
  { x: 150, y: 670, r: 1.3 },
  // Right leg
  { x: 232, y: 510, r: 1.0 },
  { x: 235, y: 550, r: 1.2 },
  { x: 240, y: 600, r: 1.1 },
  { x: 245, y: 640, r: 1.0 },
  { x: 250, y: 670, r: 1.3 },
  // Spine accents
  { x: 200, y: 250, r: 1.0 },
  { x: 200, y: 310, r: 1.1 },
  { x: 200, y: 440, r: 1.0 },
  { x: 200, y: 530, r: 1.2 },
];

// ─────────────────────────────────────────────────────────────
// Structural filament lines — extra edges that define the body
// shape beyond the node-to-node connections.
// Format: [x1, y1, x2, y2]
// ─────────────────────────────────────────────────────────────

const BODY_FILAMENTS: [number, number, number, number][] = [
  // Shoulder span
  [130, 210, 200, 180],
  [270, 210, 200, 180],
  // Arms — left
  [130, 210, 115, 250],
  [115, 250, 108, 290],
  [108, 290, 100, 400],
  // Arms — right
  [270, 210, 285, 250],
  [285, 250, 292, 290],
  [292, 290, 300, 400],
  // Torso left edge
  [130, 210, 160, 310],
  [160, 310, 165, 380],
  [165, 380, 170, 470],
  // Torso right edge
  [270, 210, 240, 310],
  [240, 310, 235, 380],
  [235, 380, 230, 470],
  // Left leg
  [170, 470, 165, 550],
  [165, 550, 155, 640],
  [155, 640, 150, 670],
  // Right leg
  [230, 470, 235, 550],
  [235, 550, 245, 640],
  [245, 640, 250, 670],
  // Hips cross
  [170, 470, 200, 480],
  [230, 470, 200, 480],
  // Feet
  [150, 670, 200, 580],
  [250, 670, 200, 580],
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Build a unique key for an edge so we don't render duplicates. */
function edgeKey(a: string, b: string): string {
  return [a, b].sort().join("--");
}

/** Compute the SVG path d-string for a signal travelling between two points. */
function signalPathD(
  from: { x: number; y: number },
  to: { x: number; y: number }
): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  // Slight curve for visual interest
  const cx = mx + (to.y - from.y) * 0.15;
  const cy = my - (to.x - from.x) * 0.15;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function HumanFigureSVG({
  activePart,
  signalPath,
  onPartClick,
  className = "",
}: HumanFigureSVGProps) {
  // Pre-compute the list of unique connection edges
  const edges = useMemo(() => {
    const seen = new Set<string>();
    const result: { from: BodyPart; to: BodyPart; key: string }[] = [];

    Object.values(bodyParts).forEach((part) => {
      part.connections.forEach((connId) => {
        const key = edgeKey(part.id, connId);
        if (!seen.has(key) && bodyParts[connId]) {
          seen.add(key);
          result.push({ from: part, to: bodyParts[connId], key });
        }
      });
    });

    return result;
  }, []);

  const parts = useMemo(() => Object.values(bodyParts), []);

  return (
    <svg
      viewBox="0 0 400 700"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-label="Interactive AI-Human body constellation"
      role="img"
    >
      {/* ── Definitions: gradients, filters, glow effects ── */}
      <defs>
        {/* Central radial glow behind the figure */}
        <radialGradient id="figure-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="rgba(245, 240, 232, 0.06)" />
          <stop offset="100%" stopColor="rgba(245, 240, 232, 0)" />
        </radialGradient>

        {/* Soft blur for node glow */}
        <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Stronger glow for active node */}
        <filter
          id="active-glow"
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
        >
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Signal pulse filter */}
        <filter
          id="signal-glow"
          x="-200%"
          y="-200%"
          width="500%"
          height="500%"
        >
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Per-part colored glow filters */}
        {parts.map((part) => {
          const hex = COLOR_MAP[part.color] ?? WARM_WHITE;
          return (
            <radialGradient key={`grad-${part.id}`} id={`grad-${part.id}`}>
              <stop offset="0%" stopColor={hex} stopOpacity={0.6} />
              <stop offset="100%" stopColor={hex} stopOpacity={0} />
            </radialGradient>
          );
        })}
      </defs>

      {/* ── Background glow ── */}
      <ellipse cx="200" cy="320" rx="180" ry="280" fill="url(#figure-glow)" />

      {/* ── Body outline filaments ── */}
      {BODY_FILAMENTS.map(([x1, y1, x2, y2], i) => (
        <motion.line
          key={`bf-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={FILAMENT_COLOR}
          strokeWidth={0.8}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Connection filaments between body-part nodes ── */}
      {edges.map(({ from, to, key }) => {
        const isOnSignalPath =
          signalPath &&
          ((signalPath.from === from.id && signalPath.to === to.id) ||
            (signalPath.from === to.id && signalPath.to === from.id));

        return (
          <motion.line
            key={key}
            x1={from.position.x}
            y1={from.position.y}
            x2={to.position.x}
            y2={to.position.y}
            stroke={isOnSignalPath ? FILAMENT_ACTIVE : FILAMENT_COLOR}
            strokeWidth={isOnSignalPath ? 1.5 : 1}
            initial={{ opacity: 0.4 }}
            animate={{
              opacity: isOnSignalPath ? [0.5, 1, 0.5] : [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: isOnSignalPath ? 0.8 : 3 + stableOffset(key, 5) * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* ── Decorative outline dots ── */}
      {OUTLINE_DOTS.map((dot, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill={WARM_WHITE}
          initial={{ opacity: 0.15 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{
            duration: 3 + (i % 5),
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i * 0.3) % 2,
          }}
        />
      ))}

      {/* ── Signal flow animation ── */}
      <AnimatePresence>
        {signalPath &&
          bodyParts[signalPath.from] &&
          bodyParts[signalPath.to] && (
            <motion.circle
              key={`signal-${signalPath.from}-${signalPath.to}`}
              r={5}
              fill={
                COLOR_MAP[bodyParts[signalPath.to].color] ?? WARM_WHITE
              }
              filter="url(#signal-glow)"
              initial={{
                cx: bodyParts[signalPath.from].position.x,
                cy: bodyParts[signalPath.from].position.y,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                cx: bodyParts[signalPath.to].position.x,
                cy: bodyParts[signalPath.to].position.y,
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1.2, 0.5],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
      </AnimatePresence>

      {/* ── Signal trail path (subtle line following signal) ── */}
      <AnimatePresence>
        {signalPath &&
          bodyParts[signalPath.from] &&
          bodyParts[signalPath.to] && (
            <motion.path
              key={`trail-${signalPath.from}-${signalPath.to}`}
              d={signalPathD(
                bodyParts[signalPath.from].position,
                bodyParts[signalPath.to].position
              )}
              fill="none"
              stroke={
                COLOR_MAP[bodyParts[signalPath.to].color] ?? WARM_WHITE
              }
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
      </AnimatePresence>

      {/* ── Body-part nodes ── */}
      {parts.map((part) => {
        const isActive = activePart === part.id;
        const hex = COLOR_MAP[part.color] ?? WARM_WHITE;
        const baseRadius = 6;
        const activeRadius = 10;

        return (
          <g
            key={part.id}
            onClick={() => onPartClick(part.id)}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label={`${part.label} — ${part.aiLabel}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPartClick(part.id);
              }
            }}
          >
            {/* Active halo */}
            {isActive && (
              <motion.circle
                cx={part.position.x}
                cy={part.position.y}
                r={activeRadius * 2.5}
                fill={`url(#grad-${part.id})`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0.3, 0.6, 0.3], scale: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Outer glow ring */}
            <motion.circle
              cx={part.position.x}
              cy={part.position.y}
              r={isActive ? activeRadius + 2 : baseRadius + 1}
              fill="none"
              stroke={isActive ? hex : WARM_WHITE}
              strokeWidth={0.5}
              strokeOpacity={isActive ? 0.5 : 0.2}
              animate={{
                r: isActive
                  ? [activeRadius + 1, activeRadius + 4, activeRadius + 1]
                  : [baseRadius, baseRadius + 2, baseRadius],
                strokeOpacity: isActive ? [0.3, 0.6, 0.3] : [0.1, 0.25, 0.1],
              }}
              transition={{
                duration: isActive ? 1.5 : 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Core node — breathing pulse */}
            <motion.circle
              cx={part.position.x}
              cy={part.position.y}
              fill={isActive ? hex : WARM_WHITE}
              filter={isActive ? "url(#active-glow)" : "url(#node-glow)"}
              animate={{
                r: isActive
                  ? [activeRadius - 1, activeRadius, activeRadius - 1]
                  : [baseRadius - 1, baseRadius, baseRadius - 1],
                opacity: isActive ? 1 : [0.6, 0.85, 0.6],
              }}
              transition={{
                duration: isActive ? 1.2 : 2.5 + stableOffset(part.id, 4) * 0.25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Hover hit area (larger invisible circle for easier clicking) */}
            <circle
              cx={part.position.x}
              cy={part.position.y}
              r={18}
              fill="transparent"
            />

            {/* Label — shown only for the active part */}
            <AnimatePresence>
              {isActive && (
                <motion.text
                  x={part.position.x}
                  y={part.position.y - activeRadius - 10}
                  textAnchor="middle"
                  fill={hex}
                  fontSize={11}
                  fontFamily="system-ui, sans-serif"
                  fontWeight={500}
                  initial={{ opacity: 0, y: part.position.y - activeRadius }}
                  animate={{
                    opacity: 1,
                    y: part.position.y - activeRadius - 10,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {part.label}
                </motion.text>
              )}
            </AnimatePresence>
          </g>
        );
      })}
    </svg>
  );
}
