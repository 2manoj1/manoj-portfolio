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
	{ id: "data", label: "Data", value: "Distributor received 100 units", explanation: "The real-world event this block records." },
	{ id: "previous", label: "Previous hash", value: "…9cbf6e03", explanation: "A pointer to the previous block’s fingerprint. This creates the chain." },
	{ id: "hash", label: "This block’s hash", value: "…ed604c9b", explanation: "A fingerprint calculated from this block’s content." },
] as const;

function BlockAnatomy() {
	const [selectedId, setSelectedId] = useState<(typeof anatomyFields)[number]["id"]>("data");
	const selected = anatomyFields.find((field) => field.id === selectedId) ?? anatomyFields[0];
	return (
		<figure className="mx-auto max-w-6xl" aria-label="Interactive anatomy of a blockchain block">
			<div className="grid gap-4 lg:grid-cols-[0.62fr_auto_1.35fr_auto_0.62fr] lg:items-center">
				<div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-center">
					<Database className="mx-auto size-7 text-zinc-400" />
					<p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-zinc-500">Previous block</p>
					<div className="mt-3"><HashChip>…9cbf6e03</HashChip></div>
				</div>
				<div className="flex items-center justify-center text-amber-300/70" aria-hidden="true">
					<ArrowDown className="size-5 lg:hidden" />
					<ArrowRight className="hidden size-5 lg:block" />
				</div>
				<div className="rounded-3xl border border-amber-300/50 bg-amber-300/[0.055] p-3 shadow-[0_0_80px_rgba(251,191,36,0.08)]">
					<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
						<div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
							<span className="font-mono text-xs uppercase tracking-wider text-amber-300">Click a field · Block #2</span>
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
										className={`rounded-xl border p-3 text-left transition ${
											active
												? "border-amber-300/55 bg-amber-300/[0.08]"
												: "border-white/10 bg-white/[0.025] hover:border-white/25"
										}`}>
										<p className="font-mono text-[10px] uppercase text-zinc-500">{field.label}</p>
										<p className={`mt-1 text-sm ${
											field.id === "hash"
												? "font-mono text-emerald-200"
												: field.id === "previous"
													? "font-mono text-amber-200"
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
				<div className="flex items-center justify-center text-emerald-300/70" aria-hidden="true">
					<ArrowDown className="size-5 lg:hidden" />
					<ArrowRight className="hidden size-5 lg:block" />
				</div>
				<div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-center">
					<Fingerprint className="mx-auto size-7 text-emerald-300" />
					<p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-zinc-500">Next block receives</p>
					<div className="mt-3"><HashChip tone="emerald">…ed604c9b</HashChip></div>
				</div>
			</div>
			<div className="mx-auto mt-3 max-w-3xl rounded-2xl border border-amber-300/25 bg-amber-300/[0.045] px-5 py-3 text-center text-sm text-amber-100" aria-live="polite">
				<strong>{selected.label}:</strong> {selected.explanation}
			</div>
			<figcaption className="sr-only">Select each field to learn how transaction data, previous hashes and calculated hashes form a block.</figcaption>
		</figure>
	);
}

function ChainLinks() {
	const [tampered, setTampered] = useState(false);
	const blocks = [
		{ index: 1, data: tampered ? "Batch: 1,000 units" : "Batch: 100 units", previous: "00000000", hash: tampered ? "stored 9cbf6e03" : "9cbf6e03", broken: tampered },
		{ index: 2, data: "100 units moved", previous: "9cbf6e03", hash: "ed604c9b", broken: tampered },
		{ index: 3, data: "Hospital received", previous: "ed604c9b", hash: "d97bc830", broken: false },
	] as const;
	return (
		<figure className="mx-auto max-w-6xl" aria-label="Interactive three-block chain">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<p className="text-sm text-zinc-400">Change Block #1 and watch the failure travel to the next link.</p>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setTampered(true)}
						disabled={tampered}
						className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-300 px-4 text-sm font-semibold text-rose-950 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-40">
						<ShieldAlert className="size-4" /> Tamper Block #1
					</button>
					<button
						type="button"
						onClick={() => setTampered(false)}
						disabled={!tampered}
						className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-zinc-200 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40">
						<RotateCcw className="size-4" /> Restore
					</button>
				</div>
			</div>
			<div className="flex items-stretch gap-2 overflow-x-auto pb-3">
				{blocks.map((block, index) => (
					<div key={block.index} className="flex min-w-[250px] flex-1 items-center gap-2">
						<div className={`min-w-0 flex-1 rounded-3xl border p-5 transition ${
							block.broken
								? "border-rose-400/55 bg-rose-400/[0.07]"
								: tampered && block.index === 3
									? "border-amber-300/30 bg-amber-300/[0.035]"
									: "border-white/15 bg-white/[0.035]"
						}`}>
							<div className="flex items-center justify-between gap-2">
								<span className={`font-mono text-xs uppercase ${block.broken ? "text-rose-200" : "text-amber-300"}`}>
									Block #{block.index}
								</span>
								{block.broken ? <ShieldAlert className="size-4 text-rose-300" /> : <Link2 className="size-4 text-zinc-500" />}
							</div>
							<p className="mt-5 min-h-12 text-lg font-semibold text-white">{block.data}</p>
							<div className="mt-4 grid gap-2">
								<HashChip tone={block.index === 2 && tampered ? "rose" : "zinc"}>PREV {block.previous}</HashChip>
								<HashChip tone={block.index === 1 && tampered ? "rose" : "emerald"}>HASH {block.hash}</HashChip>
							</div>
						</div>
						{index < blocks.length - 1 ? (
							<div className={`flex shrink-0 flex-col items-center gap-1 ${tampered && index === 0 ? "text-rose-300" : "text-amber-300"}`}>
								<ArrowRight className="size-6" />
								<span className="font-mono text-[9px] uppercase">{tampered && index === 0 ? "broken" : "copy hash"}</span>
							</div>
						) : null}
					</div>
				))}
			</div>
			<div className={`mx-auto mt-3 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-center text-sm ${
				tampered ? "border-rose-400/40 bg-rose-400/[0.07] text-rose-100" : "border-emerald-400/30 bg-emerald-400/[0.04] text-emerald-100"
			}`} role={tampered ? "alert" : undefined}>
				{tampered ? <ShieldAlert className="size-5 shrink-0" /> : <ShieldCheck className="size-5 shrink-0" />}
				{tampered
					? "Block #1’s data no longer matches its stored hash; Block #2 still points to the old fingerprint."
					: "All stored hashes and links agree. The chain is internally consistent."}
			</div>
			<figcaption className="sr-only">Tamper with the first block to see its stored hash fail and the following link break.</figcaption>
		</figure>
	);
}

const consensusStages = [
	{ label: "Propose", detail: "A participant submits a new credential record.", icon: Database },
	{ label: "Validate", detail: "Known validators check signatures and agreed rules.", icon: Network },
	{ label: "Commit", detail: "Accepted state is replicated across participants.", icon: ShieldCheck },
] as const;

function ConsensusNetwork() {
	const [stageIndex, setStageIndex] = useState(0);
	const complete = stageIndex === consensusStages.length - 1;
	return (
		<figure className="mx-auto max-w-6xl" aria-label="Interactive permissioned consensus flow">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">Permissioned example · step {stageIndex + 1} of 3</p>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setStageIndex((current) => Math.min(current + 1, 2))}
						disabled={complete}
						className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40">
						<Zap className="size-4" /> Run consensus
					</button>
					<button
						type="button"
						onClick={() => setStageIndex(0)}
						className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-zinc-200 transition hover:border-white/30">
						<RotateCcw className="size-4" /> Reset
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
								className={`min-h-48 rounded-3xl border p-5 text-left transition ${
									active
										? "border-amber-300/55 bg-amber-300/[0.075] shadow-[0_0_50px_rgba(251,191,36,0.08)]"
										: done
											? "border-emerald-400/35 bg-emerald-400/[0.04]"
											: "border-white/10 bg-white/[0.025] opacity-55"
								}`}>
								<div className="flex items-center justify-between">
									<span className="font-mono text-xs uppercase tracking-wider text-zinc-500">0{index + 1}</span>
									{done ? <Check className="size-5 text-emerald-300" /> : <Icon className={`size-7 ${active ? "text-amber-200" : "text-zinc-600"}`} />}
								</div>
								<h3 className="mt-6 text-2xl font-semibold text-white">{stage.label}</h3>
								<p className="mt-2 text-sm leading-6 text-zinc-400">{stage.detail}</p>
							</button>
							{index < 2 ? (
								<ArrowRight className={`mx-auto hidden size-6 lg:block ${index < stageIndex ? "text-emerald-300" : "text-zinc-700"}`} aria-hidden="true" />
							) : null}
						</li>
					);
				})}
			</ol>
			<p className="mt-4 text-center text-sm text-zinc-400" aria-live="polite">
				<strong className="text-white">{consensusStages[stageIndex].label}:</strong> {consensusStages[stageIndex].detail}
			</p>
			<figcaption className="sr-only">Step through proposal, validation and commit in a permissioned blockchain network.</figcaption>
		</figure>
	);
}

function BranchingTree() {
	const [activeBranch, setActiveBranch] = useState<"finance" | "supply" | "identity">("finance");

	return (
		<figure className="mx-auto max-w-6xl" aria-label="Blockchain taxonomy branching diagram">
			{/* Root node */}
			<div className="text-center">
				<div className="mx-auto inline-flex items-center gap-3 rounded-2xl border border-amber-400/60 bg-amber-950/30 px-6 py-3 shadow-[0_0_50px_rgba(251,191,36,0.15)]">
					<Database className="size-5 text-amber-300" />
					<span className="font-display text-xl text-white">BLOCKCHAIN ENGINE</span>
					<span className="rounded bg-amber-400/20 px-2 py-0.5 font-mono text-[10px] uppercase text-amber-200">
						Shared Cryptographic Ledger
					</span>
				</div>
			</div>

			{/* Branching SVG tree */}
			<div className="relative mt-6 grid gap-4 lg:grid-cols-3">
				{/* Finance */}
				<div
					onClick={() => setActiveBranch("finance")}
					className={`cursor-pointer rounded-3xl border p-6 transition-all duration-300 ${
						activeBranch === "finance"
							? "border-amber-400 bg-amber-950/30 shadow-[0_0_40px_rgba(251,191,36,0.15)] scale-[1.02]"
							: "border-white/10 bg-white/[0.025] hover:border-white/25"
					}`}>
					<div className="flex items-center justify-between">
						<Landmark className="size-6 text-amber-300" />
						<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Branch 01</span>
					</div>
					<h3 className="mt-4 font-display text-2xl text-white">Finance & Banking</h3>
					<ul className="mt-4 space-y-2 text-sm text-zinc-300">
						<li className="flex items-center gap-2 font-mono text-xs"><Check className="size-3.5 text-amber-400" /> Programmable Money (e₹ / CBDC)</li>
						<li className="flex items-center gap-2 font-mono text-xs"><Check className="size-3.5 text-amber-400" /> 24/7 Institutional Settlement (Kinexys)</li>
						<li className="flex items-center gap-2 font-mono text-xs"><Check className="size-3.5 text-amber-400" /> Asset Tokenization (DTCC)</li>
					</ul>
				</div>

				{/* Supply Chain */}
				<div
					onClick={() => setActiveBranch("supply")}
					className={`cursor-pointer rounded-3xl border p-6 transition-all duration-300 ${
						activeBranch === "supply"
							? "border-emerald-400 bg-emerald-950/30 shadow-[0_0_40px_rgba(52,211,153,0.15)] scale-[1.02]"
							: "border-white/10 bg-white/[0.025] hover:border-white/25"
					}`}>
					<div className="flex items-center justify-between">
						<Truck className="size-6 text-emerald-300" />
						<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Branch 02</span>
					</div>
					<h3 className="mt-4 font-display text-2xl text-white">Supply Chain & Health</h3>
					<ul className="mt-4 space-y-2 text-sm text-zinc-300">
						<li className="flex items-center gap-2 font-mono text-xs"><Check className="size-3.5 text-emerald-400" /> Drug Logistics (NIC India)</li>
						<li className="flex items-center gap-2 font-mono text-xs"><Check className="size-3.5 text-emerald-400" /> Cold-Chain Integrity Logs</li>
						<li className="flex items-center gap-2 font-mono text-xs"><Check className="size-3.5 text-emerald-400" /> Farm-to-Fork Food Provenance</li>
					</ul>
				</div>

				{/* Identity & Gov */}
				<div
					onClick={() => setActiveBranch("identity")}
					className={`cursor-pointer rounded-3xl border p-6 transition-all duration-300 ${
						activeBranch === "identity"
							? "border-cyan-400 bg-cyan-950/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] scale-[1.02]"
							: "border-white/10 bg-white/[0.025] hover:border-white/25"
					}`}>
					<div className="flex items-center justify-between">
						<UserCheck className="size-6 text-cyan-300" />
						<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Branch 03</span>
					</div>
					<h3 className="mt-4 font-display text-2xl text-white">Identity & Credentials</h3>
					<ul className="mt-4 space-y-2 text-sm text-zinc-300">
						<li className="flex items-center gap-2 font-mono text-xs"><Check className="size-3.5 text-cyan-400" /> CBSE Certificate Chain</li>
						<li className="flex items-center gap-2 font-mono text-xs"><Check className="size-3.5 text-cyan-400" /> Vishvasya BaaS by MeitY</li>
						<li className="flex items-center gap-2 font-mono text-xs"><Check className="size-3.5 text-cyan-400" /> Self-Sovereign Identity (W3C DID)</li>
					</ul>
				</div>
			</div>
		</figure>
	);
}

function SettlementFlow() {
	return (
		<figure className="mx-auto max-w-6xl" aria-label="Settlement rails comparison">
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Traditional */}
				<div className="rounded-3xl border border-rose-400/40 bg-rose-950/20 p-6 md:p-7">
					<div className="flex items-center justify-between border-b border-white/10 pb-3">
						<span className="font-mono text-xs uppercase tracking-wider text-rose-300">Traditional Intermediated Rail</span>
						<span className="rounded bg-rose-400/20 px-2 py-0.5 font-mono text-[9px] text-rose-200">2–3 Days Settlement</span>
					</div>
					<div className="mt-5 space-y-3">
						{["1. Payer Initiates Transfer", "2. Originating Domestic Bank", "3. Correspondent Bank A (Ledger #1)", "4. Global Clearing House / SWIFT", "5. Correspondent Bank B (Ledger #2)", "6. Beneficiary Domestic Bank", "7. Final Payee Account"].map((step, idx) => (
							<div key={step} className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 px-3 py-2 text-xs text-zinc-300">
								<span className="font-mono text-[10px] text-rose-300">0{idx + 1}</span>
								<span>{step}</span>
							</div>
						))}
					</div>
					<p className="mt-4 text-xs text-zinc-400">
						High counterparty reconciliation cost, batch processing delays, and siloed ledger mismatches.
					</p>
				</div>

				{/* Shared Programmable Rail */}
				<div className="rounded-3xl border border-emerald-400/40 bg-emerald-950/20 p-6 md:p-7 shadow-[0_0_50px_rgba(52,211,153,0.08)]">
					<div className="flex items-center justify-between border-b border-white/10 pb-3">
						<span className="font-mono text-xs uppercase tracking-wider text-emerald-300">Programmable Shared Settlement Rail</span>
						<span className="rounded bg-emerald-400/20 px-2 py-0.5 font-mono text-[9px] text-emerald-200">Sub-Second Atomic</span>
					</div>
					<div className="mt-5 space-y-3">
						{[
							"1. Authorized Institutional Participant Submits Payment",
							"2. Smart Contract Executes Atomic Payment vs Delivery (PvP)",
							"3. Cryptographic Consensus Validates in Real-Time",
							"4. Immediate Final Settlement Across Shared State (e.g. Kinexys)",
						].map((step) => (
							<div key={step} className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-950/30 px-3 py-2.5 text-xs text-emerald-100">
								<Check className="size-4 text-emerald-400 shrink-0" />
								<span>{step}</span>
							</div>
						))}
					</div>
					<div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
						<p className="font-mono text-[10px] uppercase text-zinc-400">Production Benchmark</p>
						<p className="mt-1 text-sm font-semibold text-white">J.P. Morgan Kinexys: $3T+ total volume · $5B+ average daily institutional settlement.</p>
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
