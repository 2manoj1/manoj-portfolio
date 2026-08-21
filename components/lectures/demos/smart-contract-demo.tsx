"use client";

import { useState } from "react";
import { Check, RotateCcw, X, Code2 } from "lucide-react";

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
		{ key: "received", label: "Medicine Batch Received by Hospital", passWhen: true, hint: "Hospital IoT scanner signs custody receipt" },
		{ key: "qualityPassed", label: "Lab Chemical Assay Verified", passWhen: true, hint: "Certified lab digital signature on-chain" },
		{ key: "tempMaintained", label: "Cold-Chain Sensor (< 8°C Throughout)", passWhen: true, hint: "Continuous IoT temperature logger threshold" },
		{ key: "expired", label: "Batch Passed Expiry Date", passWhen: false, hint: "Current blockchain timestamp < batch expiry" },
	];

	return (
		<div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
			<div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
				{/* Logic Rules Switches */}
				<div className="rounded-3xl border border-white/15 bg-white/[0.035] p-6 md:p-7">
					<div className="flex items-center justify-between border-b border-white/10 pb-4">
						<div className="flex items-center gap-2">
							<Code2 className="size-4 text-amber-300" />
							<span className="font-mono text-xs uppercase tracking-wider text-amber-300">
								Smart Contract Logic (EVM Bytecode)
							</span>
						</div>
						<button
							type="button"
							onClick={() => setInputs(INITIAL_INPUTS)}
							className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-zinc-400 hover:text-white">
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
									className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-3.5 transition-all ${
										passed
											? "border-emerald-500/30 bg-emerald-950/20"
											: "border-rose-500/40 bg-rose-950/20"
									}`}>
									<div>
										<p className="text-sm font-semibold text-white">{row.label}</p>
										<p className="font-mono text-[10px] text-zinc-400">{row.hint}</p>
									</div>
									<div className="flex items-center gap-3">
										<span className={`font-mono text-xs font-bold ${passed ? "text-emerald-400" : "text-rose-400"}`}>
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
					className={`flex flex-col items-center justify-center rounded-3xl border p-8 text-center transition-all duration-300 ${
						released
							? "border-emerald-400/60 bg-emerald-950/30 shadow-[0_0_60px_rgba(52,211,153,0.15)]"
							: "border-rose-400/60 bg-rose-950/30 shadow-[0_0_60px_rgba(244,63,94,0.15)]"
					}`}
					aria-live="polite">
					<div
						className={`grid size-20 place-items-center rounded-3xl ${
							released ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
						}`}>
						{released ? <Check className="size-10 stroke-[3]" /> : <X className="size-10 stroke-[3]" />}
					</div>

					<span className="mt-5 font-mono text-xs uppercase tracking-widest text-zinc-400">
						Automated Contract Execution
					</span>

					<h3 className={`mt-2 font-display text-3xl font-bold md:text-4xl ${released ? "text-emerald-300" : "text-rose-300"}`}>
						{released ? "₹5,00,000 RELEASED ✓" : "PAYMENT BLOCKED ✗"}
					</h3>

					<p className="mt-4 text-sm leading-relaxed text-zinc-300">
						{released
							? "All cryptographic preconditions passed. Escrow automatically settled directly from Distributor to Manufacturer without manual accountant approvals."
							: "Precondition check failed. Payment remains securely locked in smart contract until supplier rectifies the dispute or triggers penalty clauses."}
					</p>

					<div className="mt-6 rounded-2xl border border-white/10 bg-black/40 px-4 py-2 font-mono text-[11px] text-zinc-400">
						Deterministic Code Execution · Zero Intermediary Discretion
					</div>
				</div>
			</div>
		</div>
	);
}
