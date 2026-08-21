"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";

type ContractInputs = {
	received: boolean;
	qualityPassed: boolean;
	expired: boolean;
};

const INITIAL_INPUTS: ContractInputs = {
	received: true,
	qualityPassed: true,
	expired: false,
};

export default function SmartContractDemo() {
	const [inputs, setInputs] = useState<ContractInputs>(INITIAL_INPUTS);
	const released = inputs.received && inputs.qualityPassed && !inputs.expired;

	const rows: Array<{ key: keyof ContractInputs; label: string; passWhen: boolean }> = [
		{ key: "received", label: "Medicine received", passWhen: true },
		{ key: "qualityPassed", label: "Quality check passed", passWhen: true },
		{ key: "expired", label: "Medicine expired", passWhen: false },
	];

	return (
		<div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[1fr_0.9fr]">
			<div className="rounded-3xl border border-white/15 bg-white/[0.035] p-6">
				<div className="flex items-center justify-between gap-4">
					<span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">IF all rules pass</span>
					<button type="button" onClick={() => setInputs(INITIAL_INPUTS)} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><RotateCcw className="size-3.5" /> Reset</button>
				</div>
				<div className="mt-6 space-y-3">
					{rows.map((row) => {
						const value = inputs[row.key];
						const passed = value === row.passWhen;
						return (
							<label key={row.key} className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
								<span className="text-lg text-zinc-100">{row.label}</span>
								<span className="flex items-center gap-3">
									<span className={`font-mono text-xs ${passed ? "text-emerald-300" : "text-rose-300"}`}>{value ? "YES" : "NO"}</span>
									<input type="checkbox" checked={value} onChange={(event) => setInputs((current) => ({ ...current, [row.key]: event.target.checked }))} className="size-5 accent-amber-400" />
								</span>
							</label>
						);
					})}
				</div>
			</div>
			<div className={`flex min-h-72 flex-col items-center justify-center rounded-3xl border p-6 text-center ${released ? "border-emerald-400/50 bg-emerald-400/[0.07]" : "border-rose-400/50 bg-rose-400/[0.07]"}`} aria-live="polite">
				<div className={`grid size-16 place-items-center rounded-full ${released ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"}`}>{released ? <Check className="size-8" /> : <X className="size-8" />}</div>
				<p className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-zinc-400">Smart contract decision</p>
				<p className={`mt-3 font-display text-4xl ${released ? "text-emerald-200" : "text-rose-200"}`}>{released ? "PAYMENT RELEASED" : "PAYMENT BLOCKED"}</p>
				<p className="mt-5 max-w-sm text-sm leading-6 text-zinc-400">Local business-rule simulation. No wallet, token, or payment network is involved.</p>
			</div>
		</div>
	);
}
