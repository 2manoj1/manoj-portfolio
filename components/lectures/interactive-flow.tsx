"use client";

import { ArrowRight, Check, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";
import type { FlowScene } from "@/lib/lectures/types";

export function InteractiveFlow({ scene }: { scene: FlowScene }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const finalIndex = scene.steps.length - 1;
  const complete = activeIndex === finalIndex;

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold">
            Interactive Systems Flow · Stage {activeIndex + 1} of{" "}
            {scene.steps.length}
          </p>
          <h2 className="mt-2 max-w-[22ch] text-balance font-display text-[clamp(2.2rem,4.4vw,5rem)] font-bold leading-[0.96] tracking-[-0.04em] text-white">
            {scene.title}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setActiveIndex((current) => Math.min(current + 1, finalIndex))
            }
            disabled={complete}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-amber-400 px-5 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 hover:scale-105 disabled:opacity-40 shadow-lg shadow-amber-950/40 cursor-pointer"
          >
            <Zap className="size-3.5 fill-current" /> Run Next Stage{" "}
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex(0)}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/15 px-4 text-xs font-semibold text-zinc-200 transition hover:border-white/30 hover:text-white cursor-pointer"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
      </div>

      <ol
        className="mt-7 flex w-full items-stretch gap-3 overflow-x-auto p-3"
        aria-label={`${scene.title} stages`}
      >
        {scene.steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          const isProblem = scene.problemSteps?.includes(index);

          return (
            <li
              key={`${step}-${index}`}
              className="flex min-w-[190px] flex-1 items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-current={isActive ? "step" : undefined}
                className={`relative flex min-h-36 w-full flex-col justify-between overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 cursor-pointer ${
                  isActive
                    ? isProblem
                      ? "border-rose-400/80 bg-rose-950/40 text-rose-100 shadow-[0_0_45px_rgba(244,63,94,0.25)] scale-[1.03] ring-1 ring-rose-300/40"
                      : "border-amber-400 bg-amber-950/40 text-amber-100 shadow-[0_0_45px_rgba(251,191,36,0.25)] scale-[1.03] ring-1 ring-amber-300/40"
                    : isComplete
                      ? "border-emerald-400/50 bg-emerald-950/30 text-emerald-200 hover:border-emerald-300"
                      : "border-white/10 bg-white/[0.025] opacity-60 hover:opacity-100 hover:border-white/25"
                }`}
              >
                <span className="flex items-center justify-between font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  Stage {String(index + 1).padStart(2, "0")}
                  {isComplete ? (
                    <Check className="size-4 text-emerald-400 stroke-[3]" />
                  ) : null}
                </span>
                <span
                  className={`mt-4 text-base font-bold leading-snug ${isProblem && index <= activeIndex ? "text-rose-200" : "text-white"}`}
                >
                  {step}
                </span>
              </button>
              {index < finalIndex ? (
                <ArrowRight
                  className={`size-5 shrink-0 transition-all duration-300 ${index < activeIndex ? "text-emerald-400 stroke-[2.5]" : index === activeIndex ? "text-amber-400 animate-pulse" : "text-zinc-700"}`}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div
        className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 px-5 py-3.5 backdrop-blur-md"
        aria-live="polite"
      >
        <p className="text-xs text-zinc-300">
          Current Execution Stage:{" "}
          <strong className="text-amber-300 font-bold">
            {scene.steps[activeIndex]}
          </strong>
        </p>
        {scene.callout ? (
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber-200 font-medium">
            {scene.callout}
          </p>
        ) : null}
      </div>
    </div>
  );
}
