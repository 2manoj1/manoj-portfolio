"use client";

import { useState } from "react";

const eras = [
	{
		id: "web1",
		label: "Web 1",
		verb: "READ",
		example: "You visit a college website and consume published information.",
		owner: "Publisher controls the page",
		role: "Reader",
	},
	{
		id: "web2",
		label: "Web 2",
		verb: "READ + WRITE",
		example: "You post a video, but your account and audience live inside a platform.",
		owner: "Platform controls identity and data",
		role: "Creator",
	},
	{
		id: "web3",
		label: "Web3",
		verb: "READ + WRITE + OWN / VERIFY",
		example: "A wallet can hold portable assets, permissions or credentials across compatible apps.",
		owner: "Users and shared protocols can control state",
		role: "Participant",
	},
] as const;

export default function WebEvolutionDemo() {
	const [selectedId, setSelectedId] = useState<(typeof eras)[number]["id"]>("web1");
	const selected = eras.find((era) => era.id === selectedId) ?? eras[0];

	return (
		<div className="mx-auto w-full max-w-6xl">
			<div className="grid gap-3 sm:grid-cols-3" role="tablist" aria-label="Web evolution">
				{eras.map((era, index) => (
					<button key={era.id} type="button" role="tab" aria-selected={selectedId === era.id} onClick={() => setSelectedId(era.id)} className={`min-h-20 rounded-2xl border px-4 text-left transition ${selectedId === era.id ? "border-amber-300/60 bg-amber-300/[0.08]" : "border-white/10 bg-white/[0.025] hover:border-white/25"}`}>
						<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">0{index + 1}</span>
						<span className="mt-1 block text-xl font-semibold text-white">{era.label}</span>
					</button>
				))}
			</div>
			<section className="mt-5 grid gap-5 rounded-3xl border border-white/15 bg-white/[0.035] p-6 lg:grid-cols-[0.72fr_1.28fr]" aria-live="polite">
				<div>
					<p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-300">Your role · {selected.role}</p>
					<p className="mt-4 font-display text-[clamp(2.2rem,4vw,4.4rem)] leading-none text-white">{selected.verb}</p>
				</div>
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="rounded-2xl border border-white/10 bg-black/20 p-4">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Everyday example</p>
						<p className="mt-3 text-base leading-7 text-zinc-200">{selected.example}</p>
					</div>
					<div className="rounded-2xl border border-white/10 bg-black/20 p-4">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Who controls state?</p>
						<p className="mt-3 text-base leading-7 text-zinc-200">{selected.owner}</p>
					</div>
				</div>
			</section>
			<p className="mt-4 text-center text-xs leading-5 text-zinc-500">Web3 is a design direction—not a guaranteed replacement for Web2, and decentralization exists on a spectrum.</p>
		</div>
	);
}
