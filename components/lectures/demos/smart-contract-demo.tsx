"use client";

import { useState } from "react";
import { RotateCcw, Code2, ShieldCheck, AlertTriangle } from "lucide-react";

type ContractInputs = {
	received: boolean;
	qualityPassed: boolean;
	tempMaintained: boolean;
	expired: boolean;
};

const INITIAL_INPUTS: ContractInputs = {
	received: true,
	qualityPassed: true,
	tempMaintained: true,
	expired: false,
};

export default function SmartContractDemo() {
	const [inputs, setInputs] = useState<ContractInputs>(INITIAL_INPUTS);
	const released = inputs.received && inputs.qualityPassed && inputs.tempMaintained && !inputs.expired;

	const rows: Array<{ key: keyof ContractInputs; label: string; passWhen: boolean; hint: string }> = [
		{ key: "received", label: "Medicine batch received", passWhen: true, hint: "Scenario input: authenticated custody event" },
		{ key: "qualityPassed", label: "Quality check passed", passWhen: true, hint: "Scenario input: authorized laboratory result" },
		{ key: "tempMaintained", label: "Cold-chain threshold maintained", passWhen: true, hint: "Scenario input: accepted sensor evidence (<8°C)" },
		{ key: "expired", label: "Medicine expired", passWhen: false, hint: "Scenario input: expiry rule evaluation" },
	];

	return (
		<div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
			<div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
				{/* Logic Rules Switches */}
				<div className="rounded-3xl border border-white/15 bg-white/[0.035] p-6 shadow-xl backdrop-blur-md md:p-7">
					<div className="flex items-center justify-between border-b border-white/10 pb-4">
						<div className="flex items-center gap-2.5">
							<div className="grid size-7 place-items-center rounded-lg bg-amber-400/20 text-amber-300">
								<Code2 className="size-4" />
							</div>
							<span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-200">
								Smart Contract Deterministic Logic
							</span>
						</div>
						<button
							type="button"
							onClick={() => setInputs(INITIAL_INPUTS)}
							className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-white/30 hover:text-white cursor-pointer">
							<RotateCcw className="size-3" /> Reset
						</button>
					</div>

					<div className="mt-5 space-y-3">
						{rows.map((row) => {
							const value = inputs[row.key];
							const passed = value === row.passWhen;
							return (
								<label
									key={row.key}
									className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 ${
										passed
											? "border-emerald-500/40 bg-emerald-950/25 hover:border-emerald-400"
											: "border-rose-500/50 bg-rose-950/25 hover:border-rose-400"
									}`}>
									<div>
										<p className="text-sm font-bold text-white">{row.label}</p>
										<p className="font-mono text-[10px] text-zinc-400">{row.hint}</p>
									</div>
									<div className="flex items-center gap-3">
										<span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
											passed ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
										}`}>
											{value ? "TRUE" : "FALSE"}
										</span>
										<input
											type="checkbox"
											checked={value}
											onChange={(event) =>
												setInputs((current) => ({ ...current, [row.key]: event.target.checked }))
											}
											className="size-5 accent-amber-400 cursor-pointer"
										/>
									</div>
								</label>
							);
						})}
					</div>
				</div>

				{/* Execution Verdict Box */}
				<div
					className={`flex flex-col items-center justify-center rounded-3xl border p-8 text-center transition-all duration-300 shadow-2xl backdrop-blur-md ${
						released
							? "border-emerald-400/70 bg-emerald-950/35 shadow-[0_0_70px_rgba(52,211,153,0.2)] ring-1 ring-emerald-300/40"
							: "border-rose-400/70 bg-rose-950/35 shadow-[0_0_70px_rgba(244,63,94,0.2)] ring-1 ring-rose-300/40"
					}`}
					aria-live="polite">
					<div
						className={`grid size-20 place-items-center rounded-3xl shadow-xl ${
							released ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
						}`}>
						{released ? <ShieldCheck className="size-10 stroke-[2.5]" /> : <AlertTriangle className="size-10 stroke-[2.5]" />}
					</div>

					<span className="mt-5 font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">
						Automated Contract Settlement
					</span>

					<h3 className={`mt-2 font-display text-2xl font-bold md:text-3xl ${released ? "text-emerald-300" : "text-rose-300"}`}>
						{released ? "RELEASE CONDITION MET ✓" : "PAYMENT CONDITION BLOCKED ✗"}
					</h3>

					<p className="mt-3.5 text-xs leading-relaxed text-zinc-200 font-medium">
						{released
							? "All 4 cryptographic preconditions satisfied. Smart contract releases automated ₹5,00,000 escrow settlement without human delay."
							: "Preconditions violated. Smart contract automatically reverts payment and triggers an immutable alert event across the ledger."}
					</p>

					<div className="mt-5 rounded-2xl border border-white/10 bg-black/50 px-4 py-2 font-mono text-[10px] text-zinc-400">
						Deterministic execution: IF conditions true → THEN release
					</div>
				</div>
			</div>
		</div>
	);
}
