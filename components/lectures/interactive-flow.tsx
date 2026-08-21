"use client";

import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { FlowScene } from "@/lib/lectures/types";

export function InteractiveFlow({ scene }: { scene: FlowScene }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const finalIndex = scene.steps.length - 1;
	const complete = activeIndex === finalIndex;

	return (
		<div className="flex h-full flex-col justify-center">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
						Interactive flow · stage {activeIndex + 1} of {scene.steps.length}
					</p>
					<h2 className="mt-3 max-w-[20ch] text-balance font-display text-[clamp(2.4rem,4.6vw,5.4rem)] leading-[0.96] tracking-[-0.04em] text-white">
						{scene.title}
					</h2>
				</div>
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						onClick={() => setActiveIndex((current) => Math.min(current + 1, finalIndex))}
						disabled={complete}
						className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40">
						Run next stage <ArrowRight className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => setActiveIndex(0)}
						className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-zinc-200 transition hover:border-white/30">
						<RotateCcw className="size-4" /> Reset
					</button>
				</div>
			</div>

			<ol className="mt-8 flex w-full items-stretch gap-2 overflow-x-auto pb-3" aria-label={`${scene.title} stages`}>
				{scene.steps.map((step, index) => {
					const isActive = index === activeIndex;
					const isComplete = index < activeIndex;
					const isProblem = scene.problemSteps?.includes(index);
					return (
						<li key={`${step}-${index}`} className="flex min-w-[180px] flex-1 items-center gap-2">
							<button
								type="button"
								onClick={() => setActiveIndex(index)}
								aria-current={isActive ? "step" : undefined}
								className={`relative flex min-h-32 w-full flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left transition ${
									isActive
										? isProblem
											? "border-rose-300/70 bg-rose-400/[0.1] shadow-[0_0_45px_rgba(251,113,133,0.1)]"
											: "border-amber-300/70 bg-amber-300/[0.09] shadow-[0_0_45px_rgba(251,191,36,0.1)]"
										: isComplete
											? "border-emerald-400/35 bg-emerald-400/[0.04]"
											: "border-white/10 bg-white/[0.025] opacity-55"
								}`}>
								<span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-500">
									Stage {String(index + 1).padStart(2, "0")}
									{isComplete ? <Check className="size-4 text-emerald-300" /> : null}
								</span>
								<span className={`mt-5 text-lg font-semibold ${isProblem && index <= activeIndex ? "text-rose-100" : "text-white"}`}>{step}</span>
							</button>
							{index < finalIndex ? <ArrowRight className={`size-5 shrink-0 transition ${index < activeIndex ? "text-emerald-300" : index === activeIndex ? "text-amber-300" : "text-zinc-700"}`} aria-hidden="true" /> : null}
						</li>
					);
				})}
			</ol>

			<div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-5 py-4" aria-live="polite">
				<p className="text-sm text-zinc-400">Current stage: <strong className="text-white">{scene.steps[activeIndex]}</strong></p>
				{scene.callout ? <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber-200">{scene.callout}</p> : null}
			</div>
		</div>
	);
}
