"use client";

import { useState } from "react";
import { Check, RotateCcw, X, Users, Sparkles, Trophy } from "lucide-react";
import type { QuestionScene } from "@/lib/lectures/types";

export function InteractiveQuestion({ scene }: { scene: QuestionScene }) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const answered = selectedIndex !== null;

	return (
		<div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
			<div className="text-center">
				<span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-amber-300 shadow-md shadow-amber-950/40">
					<Users className="size-3.5" /> Classroom question · Think → choose → reveal
				</span>
				<h2 className="mt-4 text-balance font-display text-[clamp(2rem,4vw,4.2rem)] font-bold leading-[1.04] text-white">
					{scene.question}
				</h2>
			</div>

			<div className="mt-7 grid gap-4 md:grid-cols-3">
				{scene.options.map((option, index) => {
					const correct = index === scene.correctIndex;
					const selected = index === selectedIndex;
					const stat = scene.stats ? scene.stats[index] : null;

					return (
						<button
							key={option}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={`relative flex min-h-36 flex-col justify-between overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 cursor-pointer ${
								answered && correct
									? "border-emerald-400 bg-emerald-950/50 text-emerald-100 shadow-[0_0_45px_rgba(52,211,153,0.3)] scale-[1.03] ring-1 ring-emerald-300/50"
									: selected
										? "border-rose-400 bg-rose-950/50 text-rose-100 shadow-[0_0_35px_rgba(244,63,94,0.2)]"
										: "border-white/15 bg-white/[0.035] text-zinc-200 hover:border-amber-400/40 hover:bg-white/[0.06] hover:scale-[1.01]"
							}`}>
							{/* Background stat fill bar if answered */}
							{answered && stat !== null ? (
								<div
									className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
										correct ? "bg-emerald-500/20" : "bg-white/5"
									}`}
									style={{ width: `${stat}%` }}
								/>
							) : null}

							<div className="relative z-10 flex items-start justify-between gap-3">
								<span className={`grid size-8 place-items-center rounded-xl border font-mono text-xs font-bold ${
									answered && correct
										? "border-emerald-300 bg-emerald-400 text-zinc-950 shadow-md"
										: "border-white/20 bg-black/50 text-amber-300"
								}`}>
									{String.fromCharCode(65 + index)}
								</span>
								{answered && correct ? (
									<span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-400/30">
										<Trophy className="size-3" /> Correct answer
									</span>
								) : answered && selected ? (
									<span className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-400/30">
										Your choice
									</span>
								) : answered && stat !== null ? (
									<span className="font-mono text-xs font-bold text-zinc-400">{stat}%</span>
								) : null}
							</div>

							<div className="relative z-10 mt-4 flex items-center justify-between gap-2">
								<span className="text-base font-bold leading-snug">{option}</span>
								{answered && correct ? (
									<span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-400 text-zinc-950 shadow-md">
										<Check className="size-4 stroke-[3]" />
									</span>
								) : answered && selected && !correct ? (
									<span className="grid size-7 shrink-0 place-items-center rounded-full bg-rose-500 text-white shadow-md">
										<X className="size-4 stroke-[3]" />
									</span>
								) : null}
							</div>
						</button>
					);
				})}
			</div>

			{answered ? (
				<div className="mt-6 rounded-3xl border border-emerald-400/40 bg-emerald-950/40 p-6 text-center shadow-[0_0_60px_rgba(52,211,153,0.15)] backdrop-blur-md" aria-live="polite">
					<div className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">
						<Sparkles className="size-4 text-emerald-400" /> Architectural Explanation
					</div>
					<p className="mx-auto mt-2.5 max-w-3xl text-base leading-relaxed text-zinc-100 font-medium">
						{scene.explanation}
					</p>
					<div className="mt-4">
						<button
							type="button"
							onClick={() => setSelectedIndex(null)}
							className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-white/20 bg-black/50 px-5 text-xs font-bold text-zinc-200 transition hover:border-amber-400 hover:text-white cursor-pointer shadow-md">
							<RotateCcw className="size-3.5" /> Re-poll Question
						</button>
					</div>
				</div>
			) : (
				<p className="mt-6 text-center font-mono text-xs text-zinc-400">
					Select an option to test your architectural judgment and reveal the engineering explanation.
				</p>
			)}
		</div>
	);
}
