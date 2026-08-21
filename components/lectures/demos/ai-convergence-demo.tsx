"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Bot, BrainCircuit, Check, RotateCcw, ShieldCheck, WalletCards, Sparkles } from "lucide-react";

const stages = [
	{
		label: "1. Intent & Reasoning",
		owner: "AI Proposal Layer",
		detail: "In this classroom scenario, an AI assistant proposes a cold-chain route from the inputs and tools available to it. A proposal is not authorization.",
		icon: BrainCircuit,
		tech: "Model + application tools",
	},
	{
		label: "2. Policy & Guardrails",
		owner: "Deterministic Policy Gate",
		detail: "Deterministic application policy checks a fixed example budget, supplier allowlist, and required human-approval boundary.",
		icon: Bot,
		tech: "Policy engine / spending cap",
	},
	{
		label: "3. Intent & Payment Protocol",
		owner: "Scoped Authorization",
		detail: "AP2 illustrates verifiable user mandates; x402 illustrates HTTP payment requests and responses. They are separate emerging protocol projects, not one universal wallet system.",
		icon: WalletCards,
		tech: "AP2 mandates / x402 HTTP flow",
	},
	{
		label: "4. Settlement & Proof",
		owner: "Optional Shared Settlement Rail",
		detail: "If independently governed parties need common settlement state, a ledger can record the accepted result. Delivery evidence still comes from trusted off-chain systems.",
		icon: ShieldCheck,
		tech: "Ledger or conventional payment rail",
	},
] as const;

export default function AiConvergenceDemo() {
	const [stageIndex, setStageIndex] = useState(0);
	const stage = stages[stageIndex];
	const complete = stageIndex === stages.length - 1;

	return (
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
			<p className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">2030 design pattern · scenario, not forecast</p>
			{/* 4 Pipeline Stages Infographic */}
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="AI agent transaction stages">
				{stages.map((item, index) => {
					const Icon = item.icon;
					const isActive = index === stageIndex;
					const isDone = index < stageIndex;

					return (
						<button
							key={item.label}
							type="button"
							onClick={() => setStageIndex(index)}
							className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
								isActive
									? "border-amber-400 bg-amber-950/40 shadow-[0_0_30px_rgba(251,191,36,0.2)] scale-[1.02]"
									: isDone
										? "border-emerald-400/40 bg-emerald-950/20 text-emerald-200"
										: "border-white/10 bg-white/[0.025] text-zinc-500 hover:border-white/20"
							}`}>
							<div className="flex items-center justify-between gap-2">
								<Icon className={`size-5 ${isActive ? "text-amber-300" : isDone ? "text-emerald-300" : "text-zinc-500"}`} />
								{isDone ? (
									<span className="grid size-5 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
										<Check className="size-3 stroke-[3]" />
									</span>
								) : (
									<span className="font-mono text-[9px] font-bold text-zinc-500">0{index + 1}</span>
								)}
							</div>
							<p className="mt-3 font-display text-sm font-bold text-white">{item.label}</p>
							<p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-amber-200/80">{item.tech}</p>
						</button>
					);
				})}
			</div>

			{/* Main Split Infographic Card */}
			<div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
				{/* Step Explanation */}
				<section className="flex flex-col justify-between rounded-3xl border border-amber-300/30 bg-amber-300/[0.04] p-6 backdrop-blur-md md:p-7 shadow-[0_0_60px_rgba(251,191,36,0.06)]" aria-live="polite">
					<div>
						<div className="flex items-center gap-2">
							<span className="inline-block rounded-full bg-amber-400/20 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
								{stage.owner}
							</span>
						</div>
						<h3 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">{stage.label}</h3>
						<p className="mt-3 text-base leading-relaxed text-zinc-200">{stage.detail}</p>
					</div>

					<div className="mt-6 flex flex-wrap items-center gap-3">
						<button
							type="button"
							onClick={() => setStageIndex((current) => Math.min(current + 1, stages.length - 1))}
							disabled={complete}
							className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-amber-400 px-5 font-display text-sm font-bold text-zinc-950 transition hover:bg-amber-300 disabled:opacity-40 shadow-lg shadow-amber-950/40">
							<Sparkles className="size-4" /> Advance Agent Flow <ArrowRight className="size-4" />
						</button>
						<button
							type="button"
							onClick={() => setStageIndex(0)}
							className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 text-xs font-semibold text-zinc-300 transition hover:border-white/30 hover:text-white">
							<RotateCcw className="size-3.5" /> Reset Agent
						</button>
					</div>
				</section>

				{/* Visual Infographic Panel */}
				<section className="overflow-hidden rounded-3xl border border-white/15 bg-black/40 shadow-xl">
					<div className="relative min-h-52 overflow-hidden border-b border-white/10">
						<Image
							src="/images/lectures/ai-agent-settlement.webp"
							alt="AI reasoning core passing an action through a cryptographic approval checkpoint into a distributed ledger network"
							fill
							sizes="(min-width: 1024px) 40vw, 100vw"
							className="object-cover"
						/>
						<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-5 pb-3.5 pt-12">
							<p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
								Propose → Constrain → Authorize → Record
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 divide-x divide-white/10 bg-zinc-950/90">
						<div className="p-4">
							<p className="font-display text-sm font-bold text-violet-300">AI Role (Probabilistic)</p>
							<p className="mt-1 text-xs leading-relaxed text-zinc-400">Understands language, plans multi-step tasks, and proposes actions.</p>
						</div>
						<div className="p-4">
							<p className="font-display text-sm font-bold text-cyan-300">Blockchain Role (Deterministic)</p>
							<p className="mt-1 text-xs leading-relaxed text-zinc-400">Can enforce on-ledger rules and preserve shared state; it cannot prove an off-chain event was true.</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
