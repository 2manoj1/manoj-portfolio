"use client";

import { useState } from "react";
import { ArrowRight, Check, RotateCcw, ShieldAlert } from "lucide-react";

const phases = [
	{
		label: "Create",
		detail: "Asha sends 5 class points to Rahul.",
	},
	{
		label: "Broadcast",
		detail: "The same proposed record reaches every participant.",
	},
	{
		label: "Validate",
		detail: "Each participant checks the shared rules.",
	},
	{
		label: "Commit",
		detail: "Accepted copies add the same linked record.",
	},
] as const;

const participants = ["Student A", "Student B", "College", "Verifier"] as const;

export default function SharedLedgerDemo() {
	const [phaseIndex, setPhaseIndex] = useState(0);
	const [tampered, setTampered] = useState(false);
	const phase = phases[phaseIndex];
	const complete = phaseIndex === phases.length - 1;

	const advance = () => {
		setTampered(false);
		setPhaseIndex((current) => Math.min(current + 1, phases.length - 1));
	};

	const reset = () => {
		setPhaseIndex(0);
		setTampered(false);
	};

	return (
		<div className="mx-auto w-full max-w-6xl">
			<div className="grid gap-3 sm:grid-cols-4" aria-label="Blockchain transaction stages">
				{phases.map((item, index) => (
					<div key={item.label} className={`rounded-2xl border p-4 transition ${index === phaseIndex ? "border-amber-300/60 bg-amber-300/[0.08]" : index < phaseIndex ? "border-emerald-400/35 bg-emerald-400/[0.04]" : "border-white/10 bg-white/[0.025]"}`}>
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Step {index + 1}</p>
						<p className={`mt-2 font-semibold ${index <= phaseIndex ? "text-white" : "text-zinc-500"}`}>{item.label}</p>
					</div>
				))}
			</div>

			<div className="mt-5 grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
				<section className="rounded-3xl border border-white/15 bg-white/[0.035] p-5" aria-label="Proposed transaction">
					<p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-300">{phase.label}</p>
					<p className="mt-4 text-2xl font-semibold text-white">Asha → Rahul</p>
					<p className="mt-1 text-lg text-zinc-300">5 class points</p>
					<p className="mt-5 text-sm leading-6 text-zinc-400">{phase.detail}</p>
					<div className="mt-6 flex flex-wrap gap-2">
						<button type="button" onClick={advance} disabled={complete} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:opacity-40">
							Next step <ArrowRight className="size-4" />
						</button>
						{complete ? <button type="button" onClick={() => setTampered(true)} disabled={tampered} className="min-h-11 rounded-xl bg-rose-700 px-4 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-40">Change one copy</button> : null}
						<button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-zinc-200 transition hover:border-white/30"><RotateCcw className="size-4" /> Reset</button>
					</div>
				</section>

				<section className="rounded-3xl border border-white/15 bg-black/20 p-5" aria-label="Replicated ledger copies">
					<div className="grid gap-3 sm:grid-cols-2">
						{participants.map((participant, index) => {
							const copyChanged = tampered && index === 1;
							const hasCopy = phaseIndex >= 1;
							return (
								<div key={participant} className={`rounded-2xl border p-4 ${copyChanged ? "border-rose-400/50 bg-rose-400/[0.06]" : hasCopy ? "border-emerald-400/35 bg-emerald-400/[0.04]" : "border-white/10"}`}>
									<div className="flex items-center justify-between gap-2">
										<p className="font-mono text-xs uppercase text-zinc-400">{participant}</p>
										{copyChanged ? <ShieldAlert className="size-4 text-rose-300" /> : hasCopy ? <Check className="size-4 text-emerald-300" /> : <span className="size-2 rounded-full bg-zinc-700" />}
									</div>
									<p className={`mt-3 font-mono text-sm ${copyChanged ? "text-rose-200" : hasCopy ? "text-zinc-200" : "text-zinc-600"}`}>
										{hasCopy ? `Asha → Rahul · ${copyChanged ? "50" : "5"} points` : "Waiting for record…"}
									</p>
								</div>
							);
						})}
					</div>
					<p className={`mt-4 rounded-xl border px-4 py-3 text-sm ${tampered ? "border-rose-400/40 text-rose-200" : complete ? "border-emerald-400/30 text-emerald-200" : "border-white/10 text-zinc-400"}`} role={tampered ? "alert" : "status"}>
						{tampered ? "Mismatch detected: three copies say 5, one copy says 50." : complete ? "All four participants now hold the same accepted history." : "A blockchain combines replicated copies with validation and linked history."}
					</p>
				</section>
			</div>
			<p className="mt-4 text-center text-xs text-zinc-500">Simplified classroom model: real networks use digital signatures, consensus rules and cryptographic links.</p>
		</div>
	);
}
