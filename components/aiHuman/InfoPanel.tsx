"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface InfoPanelProps {
  part: BodyPartInfo | null;
  onClose: () => void;
}

const COLOR_MAP: Record<string, string> = {
  cyan: "#22d3ee",
  blue: "#3b82f6",
  violet: "#8b5cf6",
  red: "#ef4444",
  amber: "#f59e0b",
  orange: "#f97316",
  green: "#22c55e",
};

/**
 * Slide-out information panel that shows the human ↔ AI mapping
 * for a selected body part. Slides in from the right with a backdrop.
 */
export default function InfoPanel({ part, onClose }: InfoPanelProps) {
  const accentColor = part ? (COLOR_MAP[part.color] ?? "#f8f3ea") : "#f8f3ea";

  return (
    <AnimatePresence>
      {part && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-zinc-950/95 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={`${part.label}: ${part.aiLabel}`}
          >
            <div className="flex flex-col gap-7 p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 min-w-12 items-center justify-center rounded-[8px] border bg-white/[0.04] px-2 font-mono text-xs font-semibold"
                    style={{ borderColor: `${accentColor}55`, color: accentColor }}
                    aria-hidden="true"
                  >
                    {part.icon}
                  </span>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      {part.label}
                    </h2>
                    <p
                      className="text-sm font-medium tracking-wide uppercase"
                      style={{ color: accentColor }}
                    >
                      {part.aiLabel}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                      {part.systemType}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close panel"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div
                className="h-px w-full"
                style={{
                  background: `linear-gradient(90deg, ${accentColor}66, transparent)`,
                }}
              />

              {/* Human side */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                    Human anatomy
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-zinc-300">
                  {part.humanDescription}
                </p>
              </div>

              {/* AI side */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                    AI architecture
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-zinc-300">
                  {part.aiDescription}
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  System details
                </h3>
                <ul className="grid gap-2">
                  {part.detailPoints.map((detail) => (
                    <li
                      key={detail}
                      className="rounded-[8px] border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-xs leading-5 text-zinc-300"
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Insight */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="rounded-[8px] border border-white/10 bg-white/5 p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                    Architecture lesson
                  </h3>
                </div>
                <p className="text-base font-medium leading-relaxed text-white/90">
                  &ldquo;{part.insight}&rdquo;
                </p>
              </motion.div>

              {/* Visual accent bar at bottom */}
              <div
                className="mt-auto h-1 w-full rounded-full opacity-30"
                style={{
                  background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                }}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
