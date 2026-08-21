"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Bot, BrainCircuit, Check, RotateCcw, ShieldCheck, WalletCards } from "lucide-react";

const stages = [
	{ label: "Understand", owner: "AI", detail: "The agent understands: find the lowest compliant logistics quote.", icon: BrainCircuit },
	{ label: "Choose", owner: "AI + policy", detail: "The agent proposes an option inside the user’s limits.", icon: Bot },
	{ label: "Authorize", owner: "Wallet", detail: "A pre-approved wallet signs the permitted payment.", icon: WalletCards },
	{ label: "Settle + prove", owner: "Blockchain", detail: "Rules verify payment and return a durable receipt.", icon: ShieldCheck },
] as const;

export default function AiConvergenceDemo() {
	const [stageIndex, setStageIndex] = useState(0);
	const stage = stages[stageIndex];
	const complete = stageIndex === stages.length - 1;

	return (
		<div className="mx-auto w-full max-w-6xl">
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="AI agent transaction stages">
				{stages.map((item, index) => {
					const Icon = item.icon;
					return (
						<div key={item.label} className={`rounded-2xl border p-4 transition ${index === stageIndex ? "border-amber-300/60 bg-amber-300/[0.08]" : index < stageIndex ? "border-emerald-400/35 bg-emerald-400/[0.04]" : "border-white/10 bg-white/[0.025]"}`}>
							<div className="flex items-center justify-between gap-2">
								<Icon className={`size-5 ${index <= stageIndex ? "text-amber-200" : "text-zinc-600"}`} />
								{index < stageIndex ? <Check className="size-4 text-emerald-300" /> : null}
							</div>
							<p className="mt-4 text-lg font-semibold text-white">{item.label}</p>
							<p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">{item.owner}</p>
						</div>
					);
				})}
			</div>

			<div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.72fr]">
				<section className="rounded-3xl border border-white/15 bg-white/[0.035] p-6" aria-live="polite">
					<p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-300">{stage.owner}</p>
					<h3 className="mt-3 text-3xl font-semibold text-white">{stage.label}</h3>
					<p className="mt-4 text-lg leading-8 text-zinc-300">{stage.detail}</p>
					<div className="mt-6 flex flex-wrap gap-2">
						<button type="button" onClick={() => setStageIndex((current) => Math.min(current + 1, stages.length - 1))} disabled={complete} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:opacity-40">Run next step <ArrowRight className="size-4" /></button>
						<button type="button" onClick={() => setStageIndex(0)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-zinc-200 transition hover:border-white/30"><RotateCcw className="size-4" /> Reset</button>
					</div>
				</section>
				<section className="overflow-hidden rounded-3xl border border-white/15 bg-black/20">
					<div className="relative min-h-48 overflow-hidden border-b border-white/10">
						<Image src="/images/lectures/ai-agent-settlement.webp" alt="AI reasoning core passing an action through a cryptographic approval checkpoint into a distributed ledger network" fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
						<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-10"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white">Reason → sign → settle</p></div>
					</div>
					<div className="grid grid-cols-2 gap-px bg-white/10">
						<div className="bg-zinc-950 p-4"><p className="font-semibold text-violet-200">AI</p><p className="mt-1 text-xs leading-5 text-zinc-400">Understands and chooses.</p></div>
						<div className="bg-zinc-950 p-4"><p className="font-semibold text-cyan-200">Blockchain</p><p className="mt-1 text-xs leading-5 text-zinc-400">Authorizes and proves.</p></div>
					</div>
				</section>
			</div>
			<p className="mt-4 text-center text-xs text-zinc-500">Emerging pattern, not a universal architecture: AI can be wrong, so limits, approvals and recovery paths remain essential.</p>
		</div>
	);
}
