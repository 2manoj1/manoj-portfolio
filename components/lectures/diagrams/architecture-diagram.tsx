"use client";

import {
	ArrowDown,
	ArrowRight,
	Check,
	Database,
	Fingerprint,
	Link2,
	Network,
	RotateCcw,
	ShieldAlert,
	ShieldCheck,
	Zap,
	Landmark,
	Truck,
	UserCheck,
	Building2,
	Clock,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { DiagramScene } from "@/lib/lectures/types";

function HashChip({ children, tone = "zinc" }: { children: ReactNode; tone?: "zinc" | "amber" | "emerald" | "rose" }) {
	const toneClass =
		tone === "amber"
			? "border-amber-300/40 bg-amber-300/[0.08] text-amber-200"
			: tone === "emerald"
				? "border-emerald-400/35 bg-emerald-400/[0.06] text-emerald-200"
				: tone === "rose"
					? "border-rose-400/40 bg-rose-400/[0.08] text-rose-200"
					: "border-white/10 bg-black/25 text-zinc-400";
	return <span className={`rounded-lg border px-2.5 py-1 font-mono text-[10px] ${toneClass}`}>{children}</span>;
}

const anatomyFields = [
	{ id: "data", label: "Data Payload", value: "Distributor received 100 boxes PCM-001", explanation: "The verified real-world business event recorded into this block." },
	{ id: "previous", label: "Previous Hash Pointer", value: "…9cbf6e03cddd0588", explanation: "The 256-bit cryptographic fingerprint of the previous block. This creates the unbreakable chain link." },
	{ id: "hash", label: "This Block's Calculated Hash", value: "…ed604c9b2dacc714", explanation: "The SHA-256 fingerprint generated from this block's data and the previous hash pointer." },
] as const;

function BlockAnatomy() {
	const [selectedId, setSelectedId] = useState<(typeof anatomyFields)[number]["id"]>("data");
	const selected = anatomyFields.find((field) => field.id === selectedId) ?? anatomyFields[0];
	return (
		<figure className="mx-auto max-w-6xl" aria-label="Interactive anatomy of a blockchain block">
			<div className="grid gap-4 lg:grid-cols-[0.65fr_auto_1.35fr_auto_0.65fr] lg:items-center">
				{/* Previous Block Box */}
				<div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 text-center shadow-lg">
					<Database className="mx-auto size-8 text-zinc-400" />
					<p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Block #01 Fingerprint</p>
					<div className="mt-3"><HashChip tone="amber">…9cbf6e03</HashChip></div>
				</div>

				<div className="flex items-center justify-center text-amber-300" aria-hidden="true">
					<ArrowDown className="size-5 lg:hidden" />
					<ArrowRight className="hidden size-6 lg:block animate-pulse" />
				</div>

				{/* Center Exploded Block Inspector */}
				<div className="rounded-3xl border border-amber-300/50 bg-amber-300/[0.055] p-4 shadow-[0_0_80px_rgba(251,191,36,0.1)]">
					<div className="rounded-2xl border border-white/10 bg-black/40 p-4.5">
						<div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
							<span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
								Click any layer · Block #02 Inspector
							</span>
							<ShieldCheck className="size-5 text-emerald-300" />
						</div>
						<div className="grid gap-2 pt-3">
							{anatomyFields.map((field) => {
								const active = field.id === selectedId;
								return (
									<button
										key={field.id}
										type="button"
										onClick={() => setSelectedId(field.id)}
										aria-pressed={active}
										className={`rounded-2xl border p-3.5 text-left transition-all duration-200 ${
											active
												? "border-amber-400 bg-amber-400/15 shadow-md scale-[1.01]"
												: "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]"
										}`}>
										<p className="font-mono text-[10px] font-bold uppercase text-zinc-400">{field.label}</p>
										<p className={`mt-1 text-sm font-semibold ${
											field.id === "hash"
												? "font-mono text-emerald-300"
												: field.id === "previous"
													? "font-mono text-amber-300"
													: "text-white"
										}`}>
											{field.value}
										</p>
									</button>
								);
							})}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-center text-emerald-300" aria-hidden="true">
					<ArrowDown className="size-5 lg:hidden" />
					<ArrowRight className="hidden size-6 lg:block animate-pulse" />
				</div>

				{/* Next Block Box */}
				<div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 text-center shadow-lg">
					<Fingerprint className="mx-auto size-8 text-emerald-300" />
					<p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Passed to Block #03</p>
					<div className="mt-3"><HashChip tone="emerald">…ed604c9b</HashChip></div>
				</div>
			</div>

			<div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-amber-300/30 bg-amber-300/[0.06] px-5 py-3 text-center text-sm text-amber-100 shadow-md" aria-live="polite">
				<strong className="text-white">{selected.label}:</strong> {selected.explanation}
			</div>
			<figcaption className="sr-only">Select each field to learn how transaction data, previous hashes and calculated hashes form a block.</figcaption>
		</figure>
	);
}

function ChainLinks() {
	const [tampered, setTampered] = useState(false);
	const blocks = [
		{ index: 1, data: tampered ? "Batch: 1,000 units [TAMPERED]" : "Batch: 100 units PCM-001", previous: "00000000", hash: tampered ? "stored 9cbf6e03" : "9cbf6e03", broken: tampered },
		{ index: 2, data: "Distributor received batch", previous: "9cbf6e03", hash: "ed604c9b", broken: tampered },
		{ index: 3, data: "Hospital clinic received batch", previous: "ed604c9b", hash: "d97bc830", broken: false },
	] as const;

	return (
		<figure className="mx-auto max-w-6xl" aria-label="Interactive three-block chain">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<p className="text-sm font-medium text-zinc-300">
					Change Block #1 and watch the cryptographic breakdown cascade across all downstream blocks.
				</p>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setTampered(true)}
						disabled={tampered}
						className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white transition hover:bg-rose-500 disabled:opacity-40 shadow-lg shadow-rose-950/40">
						<ShieldAlert className="size-4" /> ⚡ Tamper Block #1
					</button>
					<button
						type="button"
						onClick={() => setTampered(false)}
						disabled={!tampered}
						className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-4 text-xs font-bold text-zinc-200 transition hover:border-emerald-400 hover:text-emerald-300 disabled:opacity-40">
						<RotateCcw className="size-4" /> Restore Chain
					</button>
				</div>
			</div>

			<div className="flex items-stretch gap-3 overflow-x-auto pb-2">
				{blocks.map((block, index) => (
					<div key={block.index} className="flex min-w-[260px] flex-1 items-center gap-3">
						<div className={`min-w-0 flex-1 rounded-3xl border p-5 transition-all duration-300 ${
							block.broken
								? "border-rose-500/70 bg-rose-950/30 shadow-[0_0_40px_rgba(244,63,94,0.15)]"
								: "border-white/15 bg-white/[0.035]"
						}`}>
							<div className="flex items-center justify-between gap-2">
								<span className={`font-mono text-xs font-bold uppercase ${block.broken ? "text-rose-300" : "text-amber-300"}`}>
									Block #{block.index}
								</span>
								{block.broken ? <ShieldAlert className="size-4 text-rose-300" /> : <Link2 className="size-4 text-zinc-500" />}
							</div>
							<p className="mt-4 min-h-12 text-base font-bold text-white leading-snug">{block.data}</p>
							<div className="mt-4 grid gap-2">
								<HashChip tone={block.index === 2 && tampered ? "rose" : "zinc"}>PREV: {block.previous}</HashChip>
								<HashChip tone={block.index === 1 && tampered ? "rose" : "emerald"}>HASH: {block.hash}</HashChip>
							</div>
						</div>
						{index < blocks.length - 1 ? (
							<div className={`flex shrink-0 flex-col items-center gap-1 ${tampered && index === 0 ? "text-rose-400 font-bold" : "text-amber-300"}`}>
								<ArrowRight className="size-6" />
								<span className="font-mono text-[9px] uppercase tracking-wider">{tampered && index === 0 ? "broken" : "pointer"}</span>
							</div>
						) : null}
					</div>
				))}
			</div>

			<div className={`mx-auto mt-4 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border px-5 py-3 text-center text-sm ${
				tampered ? "border-rose-400/50 bg-rose-950/40 text-rose-200" : "border-emerald-400/40 bg-emerald-950/30 text-emerald-200"
			}`} role={tampered ? "alert" : undefined}>
				{tampered ? <ShieldAlert className="size-5 shrink-0 text-rose-400" /> : <ShieldCheck className="size-5 shrink-0 text-emerald-400" />}
				{tampered
					? "Block #1's altered payload changes its true hash. Block #2's pointer is now broken. Downstream validity collapsed."
					: "All stored hashes match. The cryptographic links form an unbroken chain of trust."}
			</div>
		</figure>
	);
}

const consensusStages = [
	{ label: "1. Propose", detail: "Authorized proposer broadcasts a candidate transaction block to the network.", icon: Database },
	{ label: "2. Validate", detail: "Distributed validator nodes independently execute rules and check digital signatures.", icon: Network },
	{ label: "3. Commit", detail: "Supermajority consensus achieved. State committed into all replicated node ledgers.", icon: ShieldCheck },
] as const;

function ConsensusNetwork() {
	const [stageIndex, setStageIndex] = useState(0);
	const complete = stageIndex === consensusStages.length - 1;
	return (
		<figure className="mx-auto max-w-6xl" aria-label="Interactive permissioned consensus flow">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-400 font-semibold">Permissioned Network · Step {stageIndex + 1} of 3</p>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setStageIndex((current) => Math.min(current + 1, 2))}
						disabled={complete}
						className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 disabled:opacity-40">
						<Zap className="size-3.5" /> Run Consensus
					</button>
					<button
						type="button"
						onClick={() => setStageIndex(0)}
						className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-3.5 text-xs text-zinc-300 transition hover:border-white/30">
						<RotateCcw className="size-3.5" /> Reset
					</button>
				</div>
			</div>
			<ol className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
				{consensusStages.map((stage, index) => {
					const Icon = stage.icon;
					const active = index === stageIndex;
					const done = index < stageIndex;
					return (
						<li key={stage.label} className="contents">
							<button
								type="button"
								onClick={() => setStageIndex(index)}
								aria-current={active ? "step" : undefined}
								className={`min-h-44 rounded-3xl border p-5 text-left transition-all duration-300 ${
									active
										? "border-amber-400 bg-amber-950/40 shadow-[0_0_50px_rgba(251,191,36,0.15)] scale-[1.02]"
										: done
											? "border-emerald-400/40 bg-emerald-950/20"
											: "border-white/10 bg-white/[0.025] opacity-60"
								}`}>
								<div className="flex items-center justify-between">
									<span className="font-mono text-xs font-bold text-amber-300">0{index + 1}</span>
									{done ? <Check className="size-5 text-emerald-400" /> : <Icon className={`size-6 ${active ? "text-amber-300" : "text-zinc-500"}`} />}
								</div>
								<h3 className="mt-4 text-xl font-bold text-white">{stage.label}</h3>
								<p className="mt-2 text-xs leading-relaxed text-zinc-300">{stage.detail}</p>
							</button>
							{index < 2 ? (
								<ArrowRight className={`mx-auto hidden size-6 lg:block ${index < stageIndex ? "text-emerald-400" : "text-zinc-700"}`} aria-hidden="true" />
							) : null}
						</li>
					);
				})}
			</ol>
		</figure>
	);
}

function BranchingTree() {
	const [activeBranch, setActiveBranch] = useState<"finance" | "supply" | "identity">("finance");

	return (
		<figure className="mx-auto max-w-6xl" aria-label="Blockchain taxonomy branching diagram">
			{/* Core Root node */}
			<div className="text-center">
				<div className="mx-auto inline-flex items-center gap-3 rounded-2xl border border-amber-400/70 bg-amber-950/40 px-6 py-3 shadow-[0_0_50px_rgba(251,191,36,0.2)]">
					<Database className="size-5 text-amber-300" />
					<span className="font-display text-xl font-bold text-white">BLOCKCHAIN DISTRIBUTED ENGINE</span>
					<span className="rounded bg-amber-400/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-200">
						Shared State
					</span>
				</div>
			</div>

			{/* 3 Major Enterprise Branches with cartoon tech icons */}
			<div className="relative mt-5 grid gap-4 lg:grid-cols-3">
				{/* Finance */}
				<div
					onClick={() => setActiveBranch("finance")}
					className={`cursor-pointer rounded-3xl border p-6 transition-all duration-300 ${
						activeBranch === "finance"
							? "border-amber-400 bg-amber-950/40 shadow-[0_0_40px_rgba(251,191,36,0.2)] scale-[1.02] ring-1 ring-amber-300/40"
							: "border-white/10 bg-white/[0.025] hover:border-white/25"
					}`}>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-2xl" aria-hidden="true">🏦</span>
							<Landmark className="size-5 text-amber-300" />
						</div>
						<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Branch 01</span>
					</div>
					<h3 className="mt-3 font-display text-xl font-bold text-white">Finance & Banking</h3>
					<ul className="mt-3 space-y-2 text-xs text-zinc-300 font-mono">
						<li className="flex items-center gap-2"><Check className="size-3.5 text-amber-400" /> Programmable Money (e₹ / Digital Rupee)</li>
						<li className="flex items-center gap-2"><Check className="size-3.5 text-amber-400" /> 24/7 Institutional Settlement (Kinexys)</li>
						<li className="flex items-center gap-2"><Check className="size-3.5 text-amber-400" /> Securities Tokenization (DTCC)</li>
					</ul>
				</div>

				{/* Supply Chain */}
				<div
					onClick={() => setActiveBranch("supply")}
					className={`cursor-pointer rounded-3xl border p-6 transition-all duration-300 ${
						activeBranch === "supply"
							? "border-emerald-400 bg-emerald-950/40 shadow-[0_0_40px_rgba(52,211,153,0.2)] scale-[1.02] ring-1 ring-emerald-300/40"
							: "border-white/10 bg-white/[0.025] hover:border-white/25"
					}`}>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-2xl" aria-hidden="true">📦</span>
							<Truck className="size-5 text-emerald-300" />
						</div>
						<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Branch 02</span>
					</div>
					<h3 className="mt-3 font-display text-xl font-bold text-white">Supply Chain & Medicine</h3>
					<ul className="mt-3 space-y-2 text-xs text-zinc-300 font-mono">
						<li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-400" /> Drug Logistics Chain (NIC India)</li>
						<li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-400" /> Cold-Chain Sensor Telemetry</li>
						<li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-400" /> Counterfeit-Proof Food Provenance</li>
					</ul>
				</div>

				{/* Identity & Gov */}
				<div
					onClick={() => setActiveBranch("identity")}
					className={`cursor-pointer rounded-3xl border p-6 transition-all duration-300 ${
						activeBranch === "identity"
							? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_40px_rgba(34,211,238,0.2)] scale-[1.02] ring-1 ring-cyan-300/40"
							: "border-white/10 bg-white/[0.025] hover:border-white/25"
					}`}>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-2xl" aria-hidden="true">🎓</span>
							<UserCheck className="size-5 text-cyan-300" />
						</div>
						<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Branch 03</span>
					</div>
					<h3 className="mt-3 font-display text-xl font-bold text-white">Identity & Credentials</h3>
					<ul className="mt-3 space-y-2 text-xs text-zinc-300 font-mono">
						<li className="flex items-center gap-2"><Check className="size-3.5 text-cyan-400" /> CBSE Certificate Chain (India)</li>
						<li className="flex items-center gap-2"><Check className="size-3.5 text-cyan-400" /> Vishvasya BaaS by MeitY</li>
						<li className="flex items-center gap-2"><Check className="size-3.5 text-cyan-400" /> Self-Sovereign Identity (W3C DID)</li>
					</ul>
				</div>
			</div>
		</figure>
	);
}

function SettlementFlow() {
	return (
		<figure className="mx-auto max-w-6xl" aria-label="Settlement rails comparison">
			<div className="grid gap-5 lg:grid-cols-2">
				{/* Traditional */}
				<div className="rounded-3xl border border-rose-500/50 bg-rose-950/20 p-6 shadow-lg">
					<div className="flex items-center justify-between border-b border-white/10 pb-3">
						<div className="flex items-center gap-2">
							<Building2 className="size-4 text-rose-300" />
							<span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-300">Traditional Intermediated Rail</span>
						</div>
						<span className="flex items-center gap-1 rounded bg-rose-400/20 px-2 py-0.5 font-mono text-[9px] font-bold text-rose-200">
							<Clock className="size-3" /> 2–3 Days
						</span>
					</div>
					<div className="mt-4 space-y-2">
						{["1. Payer Initiates Transfer", "2. Originating Domestic Bank", "3. Correspondent Bank A (Ledger #1)", "4. Global Clearing House / SWIFT", "5. Correspondent Bank B (Ledger #2)", "6. Beneficiary Domestic Bank", "7. Final Payee Account Credited"].map((step, idx) => (
							<div key={step} className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/40 px-3 py-1.5 text-xs text-zinc-300">
								<span className="font-mono text-[10px] font-bold text-rose-300">0{idx + 1}</span>
								<span>{step}</span>
							</div>
						))}
					</div>
					<p className="mt-4 text-xs text-zinc-400 leading-relaxed">
						Multiple siloed ledgers require batch clearing, manual reconciliations, and correspondent fee deductions.
					</p>
				</div>

				{/* Shared Programmable Rail */}
				<div className="rounded-3xl border border-emerald-400/50 bg-emerald-950/20 p-6 shadow-[0_0_50px_rgba(52,211,153,0.1)]">
					<div className="flex items-center justify-between border-b border-white/10 pb-3">
						<div className="flex items-center gap-2">
							<ShieldCheck className="size-4 text-emerald-300" />
							<span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">Programmable Shared Settlement Rail</span>
						</div>
						<span className="rounded bg-emerald-400/20 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-200">
							Sub-Second Atomic
						</span>
					</div>
					<div className="mt-4 space-y-2.5">
						{[
							"1. Authorized Institutional Participant Submits Payment",
							"2. Smart Contract Executes Atomic Payment vs Delivery (PvP)",
							"3. Cryptographic Consensus Validates in Real-Time",
							"4. Immediate Final Settlement Across Shared State (e.g. Kinexys)",
						].map((step) => (
							<div key={step} className="flex items-center gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-950/40 px-3 py-2.5 text-xs text-emerald-100">
								<Check className="size-4 text-emerald-400 shrink-0" />
								<span className="font-semibold">{step}</span>
							</div>
						))}
					</div>
					<div className="mt-5 rounded-2xl border border-white/10 bg-black/50 p-3.5">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Production Institutional Benchmark</p>
						<p className="mt-1 text-xs font-semibold text-white">J.P. Morgan Kinexys: $3T+ total volume · $5B+ average daily institutional settlement.</p>
					</div>
				</div>
			</div>
		</figure>
	);
}

export function ArchitectureDiagram({ diagramId }: { diagramId: DiagramScene["diagramId"] }) {
	switch (diagramId) {
		case "block-anatomy":
			return <BlockAnatomy />;
		case "chain-links":
			return <ChainLinks />;
		case "consensus-network":
			return <ConsensusNetwork />;
		case "branching-tree":
			return <BranchingTree />;
		case "settlement-flow":
			return <SettlementFlow />;
	}
}
