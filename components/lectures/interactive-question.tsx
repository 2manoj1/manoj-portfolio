"use client";

import { useState } from "react";
import { Check, RotateCcw, X, Users, Sparkles } from "lucide-react";
import type { QuestionScene } from "@/lib/lectures/types";

export function InteractiveQuestion({ scene }: { scene: QuestionScene }) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const answered = selectedIndex !== null;

	return (
		<div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
			<div className="text-center">
				<span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-amber-300">
					<Users className="size-3.5" /> Classroom question · Think → choose → reveal
				</span>
				<h2 className="mt-5 text-balance font-display text-[clamp(2rem,4vw,4.2rem)] leading-[1.04] text-white">
					{scene.question}
				</h2>
			</div>

			<div className="mt-8 grid gap-4 md:grid-cols-3">
				{scene.options.map((option, index) => {
					const correct = index === scene.correctIndex;
					const selected = index === selectedIndex;
					return (
						<button
							key={option}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={`relative flex min-h-32 flex-col justify-between overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
								answered && correct
									? "border-emerald-400/80 bg-emerald-950/40 text-emerald-100 shadow-[0_0_35px_rgba(52,211,153,0.15)] scale-[1.02]"
									: selected
										? "border-rose-400/80 bg-rose-950/40 text-rose-100"
										: "border-white/15 bg-white/[0.035] text-zinc-200 hover:border-white/30 hover:bg-white/[0.06]"
							}`}>
							<div className="relative z-10 flex items-start justify-between gap-3">
								<span className="grid size-7 place-items-center rounded-lg border border-white/20 bg-black/40 font-mono text-xs font-bold text-amber-300">
									{String.fromCharCode(65 + index)}
								</span>
								{answered && correct ? (
									<span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300">Correct answer</span>
								) : answered && selected ? (
									<span className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-300">Your choice</span>
								) : null}
							</div>

							<div className="relative z-10 mt-4 flex items-center justify-between gap-2">
								<span className="text-lg font-semibold leading-snug">{option}</span>
								{answered && correct ? (
									<span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-400 text-zinc-950">
										<Check className="size-4 stroke-[3]" />
									</span>
								) : answered && selected && !correct ? (
									<span className="grid size-7 shrink-0 place-items-center rounded-full bg-rose-500 text-white">
										<X className="size-4 stroke-[3]" />
									</span>
								) : null}
							</div>
						</button>
					);
				})}
			</div>

			{answered ? (
				<div className="mt-6 rounded-3xl border border-emerald-400/30 bg-emerald-950/30 p-6 text-center shadow-[0_0_50px_rgba(52,211,153,0.1)]" aria-live="polite">
					<div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-300">
						<Sparkles className="size-4" /> Architectural Explanation
					</div>
					<p className="mx-auto mt-2 max-w-3xl text-base leading-relaxed text-zinc-200">
						{scene.explanation}
					</p>
					<div className="mt-4">
						<button
							type="button"
							onClick={() => setSelectedIndex(null)}
							className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold text-zinc-300 hover:border-amber-300 hover:text-white">
							<RotateCcw className="size-3.5" /> Re-poll Question
						</button>
					</div>
				</div>
			) : (
				<p className="mt-6 text-center font-mono text-xs text-zinc-500">
					Select an option to reveal the engineering logic. No simulated vote data is shown.
				</p>
			)}
		</div>
	);
}
