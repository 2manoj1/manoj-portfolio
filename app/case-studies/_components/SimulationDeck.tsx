"use client";

import { AlertTriangle, CheckCircle, Flame, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type SimMode = "HEALTHY" | "LATENCY" | "FAILURE";

type SimulationDeckProps = {
  activeMode: SimMode;
  onChangeMode: (mode: SimMode) => void;
  description: string;
};

export function SimulationDeck({
  activeMode,
  onChangeMode,
  description,
}: SimulationDeckProps) {
  return (
    <div className="min-w-0 rounded-lg border border-zinc-200 dark:border-border/80 bg-zinc-100/50 dark:bg-zinc-950/45 p-4 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-amber" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Telemetry Simulation Deck
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
          State Control
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onChangeMode("HEALTHY")}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 rounded-md border py-2.5 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber",
            activeMode === "HEALTHY"
              ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              : "border-zinc-200 dark:border-border/60 bg-transparent text-zinc-500 dark:text-zinc-400 hover:border-zinc-350 dark:hover:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-white/[0.015]"
          )}
        >
          <CheckCircle className="size-4" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase font-semibold">Normal</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode("LATENCY")}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 rounded-md border py-2.5 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber",
            activeMode === "LATENCY"
              ? "border-amber/50 bg-amber/5 text-amber shadow-[0_0_12px_rgba(245,158,11,0.15)]"
              : "border-zinc-200 dark:border-border/60 bg-transparent text-zinc-500 dark:text-zinc-400 hover:border-zinc-350 dark:hover:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-white/[0.015]"
          )}
        >
          <AlertTriangle className="size-4" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase font-semibold">Latency</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode("FAILURE")}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 rounded-md border py-2.5 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber",
            activeMode === "FAILURE"
              ? "border-rose-500/50 bg-rose-500/5 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
              : "border-zinc-200 dark:border-border/60 bg-transparent text-zinc-500 dark:text-zinc-400 hover:border-zinc-350 dark:hover:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-white/[0.015]"
          )}
        >
          <Flame className="size-4" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase font-semibold">Failure</span>
        </button>
      </div>

      <p className="mt-3 font-mono text-[10.5px] leading-relaxed text-zinc-600 dark:text-zinc-400 transition-all duration-200">
        <span className="text-zinc-500 uppercase tracking-wide font-semibold text-[9px] mr-1.5">
          Status:
        </span>
        {description}
      </p>
    </div>
  );
}
