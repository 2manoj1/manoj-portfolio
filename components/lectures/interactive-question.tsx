"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import type { QuestionScene } from "@/lib/lectures/types";

export function InteractiveQuestion({ scene }: { scene: QuestionScene }) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const answered = selectedIndex !== null;

	return (
		<div className="mx-auto w-full max-w-5xl">
			<p className="text-balance text-center font-display text-[clamp(2rem,4vw,4.8rem)] leading-[1.04] text-white">
				{scene.question}
			</p>
			<div className="mt-8 grid gap-3 md:grid-cols-3">
				{scene.options.map((option, index) => {
					const correct = index === scene.correctIndex;
					const selected = index === selectedIndex;
					return (
						<button
							key={option}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={`min-h-24 rounded-2xl border p-5 text-left text-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
								answered && correct
									? "border-emerald-400/70 bg-emerald-400/10 text-emerald-100"
									: selected
										? "border-rose-400/70 bg-rose-400/10 text-rose-100"
										: "border-white/15 bg-white/[0.035] text-zinc-200 hover:border-white/30 hover:bg-white/[0.06]"
							}`}>
							<span className="flex items-start gap-3">
								<span className="font-mono text-xs text-zinc-500">
									{String.fromCharCode(65 + index)}
								</span>
								<span className="flex-1">{option}</span>
								{answered && correct ? <Check className="size-5" /> : null}
								{answered && selected && !correct ? <X className="size-5" /> : null}
							</span>
						</button>
					);
				})}
			</div>
			{answered ? (
				<div className="mt-6 flex flex-col items-center gap-4 text-center" aria-live="polite">
					<p className="max-w-3xl text-lg leading-8 text-zinc-300">
						{scene.explanation}
					</p>
					<button
						type="button"
						onClick={() => setSelectedIndex(null)}
						className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:border-white/30 hover:text-white">
						<RotateCcw className="size-3.5" /> Reset question
					</button>
				</div>
			) : null}
		</div>
	);
}
