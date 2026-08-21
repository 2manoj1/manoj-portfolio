"use client";

import { useState } from "react";
import { Database, AlertTriangle, CheckCircle2, RotateCcw, ShieldCheck, HelpCircle } from "lucide-react";

type OrgNode = {
	id: string;
	role: string;
	name: string;
	dbRecord: string;
	status: "synced" | "disputed" | "missing";
};

const INITIAL_ORGS: OrgNode[] = [
	{ id: "1", role: "Manufacturer", name: "PharmaCorp BLR", dbRecord: "Dispatched 100 boxes · Batch PCM-001", status: "synced" },
	{ id: "2", role: "Distributor", name: "Express Logistics", dbRecord: "Received 100 boxes · In Transit", status: "synced" },
	{ id: "3", role: "Warehouse", name: "Cold Storage Zone 4", dbRecord: "Received 100 boxes · Temperature OK", status: "synced" },
	{ id: "4", role: "Retailer / Pharmacy", name: "City Care Pharmacy", dbRecord: "Stocked 100 boxes on shelves", status: "synced" },
	{ id: "5", role: "Hospital / Patient", name: "Kristu Health Clinic", dbRecord: "Dispensed 10 boxes to patients", status: "synced" },
];

export default function TrustProblemDemo() {
	const [mode, setMode] = useState<"silos" | "dispute" | "shared">("silos");
	const [selectedOrg, setSelectedOrg] = useState<string>("2");

	const dispute = () => {
		setMode("dispute");
	};

	const unify = () => {
		setMode("shared");
	};

	const reset = () => {
		setMode("silos");
		setSelectedOrg("2");
	};

	return (
		<div className="mx-auto w-full max-w-6xl">
			{/* Controls bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
				<div className="flex items-center gap-3">
					<span className="flex size-3 rounded-full bg-amber-400 animate-pulse" />
					<div>
						<p className="font-mono text-[11px] uppercase tracking-wider text-amber-300">
							{mode === "silos" && "Phase 1: 5 Independent Database Silos"}
							{mode === "dispute" && "Phase 2: Data Desynchronization Dispute"}
							{mode === "shared" && "Phase 3: Unified Shared Provenance Ledger"}
						</p>
						<p className="text-xs text-zinc-400">
							{mode === "silos" && "Each company maintains their own private SQL database."}
							{mode === "dispute" && "Records diverge. Who owns the definitive single source of truth?"}
							{mode === "shared" && "All 5 parties verify and sync against a single cryptographic state."}
						</p>
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{mode !== "dispute" && (
						<button
							type="button"
							onClick={dispute}
							className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-rose-600/90 px-4 text-xs font-semibold text-white transition hover:bg-rose-500 shadow-lg shadow-rose-950/50">
							<AlertTriangle className="size-3.5" /> Simulate Silo Conflict
						</button>
					)}
					{mode !== "shared" && (
						<button
							type="button"
							onClick={unify}
							className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-600/90 px-4 text-xs font-semibold text-white transition hover:bg-emerald-500 shadow-lg shadow-emerald-950/50">
							<ShieldCheck className="size-3.5" /> Switch to Shared Ledger
						</button>
					)}
					<button
						type="button"
						onClick={reset}
						className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-3 text-xs text-zinc-300 transition hover:border-white/30 hover:text-white">
						<RotateCcw className="size-3.5" /> Reset
					</button>
				</div>
			</div>

			{/* Nodes Pipeline */}
			<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-5">
				{INITIAL_ORGS.map((org, index) => {
					const isDisputed = mode === "dispute" && (org.id === "2" || org.id === "3");
					const isMissing = mode === "dispute" && org.id === "4";
					const isShared = mode === "shared";
					const isSelected = selectedOrg === org.id;

					let statusBadge = (
						<span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] uppercase text-emerald-300">
							<CheckCircle2 className="size-2.5" /> OK
						</span>
					);

					if (isDisputed) {
						statusBadge = (
							<span className="inline-flex items-center gap-1 rounded-full border border-rose-400/50 bg-rose-400/15 px-2 py-0.5 font-mono text-[9px] uppercase text-rose-300">
								<AlertTriangle className="size-2.5" /> Conflict
							</span>
						);
					} else if (isMissing) {
						statusBadge = (
							<span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 font-mono text-[9px] uppercase text-amber-300">
								<HelpCircle className="size-2.5" /> Delayed
							</span>
						);
					} else if (isShared) {
						statusBadge = (
							<span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-0.5 font-mono text-[9px] uppercase text-cyan-300">
								<ShieldCheck className="size-2.5" /> Consensus
							</span>
						);
					}

					return (
						<div
							key={org.id}
							onClick={() => setSelectedOrg(org.id)}
							className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all duration-300 ${
								isSelected
									? "ring-2 ring-amber-400/80 border-amber-300 bg-white/[0.08]"
									: isDisputed
										? "border-rose-500/60 bg-rose-950/25"
										: isShared
											? "border-emerald-400/40 bg-emerald-950/20 hover:border-emerald-300"
											: "border-white/10 bg-white/[0.03] hover:border-white/20"
							}`}>
							<div>
								<div className="flex items-center justify-between gap-1">
									<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
										Node 0{index + 1}
									</span>
									{statusBadge}
								</div>
								<div className="mt-3 flex items-center gap-2">
									<Database className={`size-4 ${isShared ? "text-cyan-300" : isDisputed ? "text-rose-400" : "text-amber-300"}`} />
									<p className="truncate text-xs font-semibold text-white">{org.role}</p>
								</div>
								<p className="mt-1 truncate text-[11px] text-zinc-400">{org.name}</p>
							</div>

							<div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-2.5 font-mono text-[10px] leading-relaxed text-zinc-300">
								<p className="text-zinc-500 font-sans text-[9px] uppercase">Internal Database Record:</p>
								<p className={`mt-1 line-clamp-2 ${isDisputed ? "text-rose-300 font-semibold" : isShared ? "text-cyan-200" : "text-zinc-200"}`}>
									{mode === "dispute" && org.id === "2"
										? "⚠️ Claims only 85 received (15 broken)"
										: mode === "dispute" && org.id === "3"
											? "⚠️ Logged 100 arrived (No damage)"
											: mode === "dispute" && org.id === "4"
												? "⏳ Pending reconciliation call"
												: org.dbRecord}
								</p>
							</div>
						</div>
					);
				})}
			</div>

			{/* Core Insight Callout */}
			<div className={`mt-5 flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl border p-5 transition ${
				mode === "dispute"
					? "border-rose-500/40 bg-rose-950/30 text-rose-100"
					: mode === "shared"
						? "border-emerald-500/40 bg-emerald-950/30 text-emerald-100"
						: "border-white/15 bg-white/[0.035] text-zinc-200"
			}`}>
				<div className="flex items-start gap-4">
					<div className={`grid size-12 shrink-0 place-items-center rounded-2xl ${
						mode === "dispute" ? "bg-rose-500/20 text-rose-300" : mode === "shared" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-400/20 text-amber-300"
					}`}>
						{mode === "dispute" ? <AlertTriangle className="size-6" /> : mode === "shared" ? <ShieldCheck className="size-6" /> : <HelpCircle className="size-6" />}
					</div>
					<div>
						<h4 className="font-display text-xl text-white">
							{mode === "silos" && "The Multi-Party Coordination Challenge"}
							{mode === "dispute" && "Who Has The Truth When Ledgers Disagree?"}
							{mode === "shared" && "Cryptographic Shared State: Single Shared Truth"}
						</h4>
						<p className="mt-1 text-sm text-zinc-300">
							{mode === "silos" && "When 5 independent organizations coordinate using separate internal databases, reconciliation requires phone calls, emails, and manual audit disputes."}
							{mode === "dispute" && "Distributor claims 85 units arrived; Warehouse logged 100 units. Neither party can prove who modified their private SQL record or when."}
							{mode === "shared" && "Every custody handoff is cryptographically signed and committed into an immutable, verifiable chain shared across all 5 organizations."}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
