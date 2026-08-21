"use client";

import { useRef, useState } from "react";
import { RotateCcw, Fingerprint } from "lucide-react";
import { sha256Utf8 } from "@/lib/lectures/hash";

const BASELINE_INPUT = "Manoj pays ₹10,000 to Rahul";
const BASELINE_HASH = "947fc31d8e3ce9f5abbadc33f1812de3aa7e876c46d414b1e7d473210b15aa8d";

export default function HashDemo() {
	const [input, setInput] = useState(BASELINE_INPUT);
	const [digest, setDigest] = useState(BASELINE_HASH);
	const [status, setStatus] = useState<"ready" | "hashing" | "error">("ready");
	const requestIdRef = useRef(0);

	const updateHash = async (value: string) => {
		const requestId = ++requestIdRef.current;
		setInput(value);
		setStatus("hashing");
		try {
			const nextDigest = await sha256Utf8(value);
			if (requestId !== requestIdRef.current) return;
			setDigest(nextDigest);
			setStatus("ready");
		} catch {
			if (requestId !== requestIdRef.current) return;
			setStatus("error");
		}
	};

	const setPreset = (presetText: string) => {
		void updateHash(presetText);
	};

	const reset = () => {
		requestIdRef.current += 1;
		setInput(BASELINE_INPUT);
		setDigest(BASELINE_HASH);
		setStatus("ready");
	};

	const changed = input !== BASELINE_INPUT;
	const fingerprintBytes = digest.match(/.{2}/g) ?? [];

	return (
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
			{/* Quick Presets Bar */}
			<div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/15 bg-black/40 p-3 backdrop-blur-md">
				<div className="flex items-center gap-2">
					<Fingerprint className="size-4 text-amber-300" />
					<span className="font-mono text-xs uppercase tracking-wider text-zinc-300">Live SHA-256 Avalanche Simulator</span>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={() => setPreset("Manoj pays ₹10,000 to Rahul")}
						className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-zinc-300 transition hover:border-amber-300 hover:text-white">
						₹10,000 (Baseline)
					</button>
					<button
						type="button"
						onClick={() => setPreset("Manoj pays ₹10,001 to Rahul")}
						className="rounded-xl border border-rose-400/40 bg-rose-950/30 px-3 py-1.5 font-mono text-[11px] font-bold text-rose-300 transition hover:border-rose-300">
						⚡ ₹10,001 (1 Digit Change)
					</button>
					<button
						type="button"
						onClick={reset}
						className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-1.5 font-mono text-[11px] text-zinc-400 hover:text-white">
						<RotateCcw className="size-3" /> Reset
					</button>
				</div>
			</div>

			<div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
				{/* Input Box */}
				<div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-white/[0.035] p-6">
					<div>
						<div className="flex items-center justify-between">
							<label htmlFor="lecture-hash-input" className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
								Input Message (Any Length)
							</label>
							<span className="font-mono text-[10px] uppercase text-zinc-500">{input.length} characters</span>
						</div>
						<textarea
							id="lecture-hash-input"
							value={input}
							onChange={(event) => void updateHash(event.target.value)}
							className="mt-4 min-h-36 w-full resize-none rounded-2xl border border-white/15 bg-black/40 p-4 font-sans text-xl leading-relaxed text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
							spellCheck={false}
							placeholder="Type anything here..."
						/>
					</div>
					<div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3 text-xs leading-relaxed text-zinc-400">
						<strong className="text-amber-200">The avalanche effect:</strong> A tiny input change produces an unpredictably different digest; across many inputs, roughly half the output bits should change on average.
					</div>
				</div>

				{/* Live Hash & Entropy Grid */}
				<div className={`flex flex-col justify-between rounded-3xl border p-6 transition-all duration-300 ${
					changed
						? "border-rose-400/60 bg-rose-950/25 shadow-[0_0_50px_rgba(244,63,94,0.15)]"
						: "border-emerald-400/50 bg-emerald-950/20 shadow-[0_0_50px_rgba(52,211,153,0.15)]"
				}`}>
					<div>
						<div className="flex items-center justify-between">
							<span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
								256-Bit SHA-256 Output (32 Bytes)
							</span>
							<span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold ${
								changed ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
							}`}>
								{status === "hashing" ? "Calculating…" : changed ? "AVALANCHE SHIFT" : "BASELINE HASH"}
							</span>
						</div>

						{/* 32-Byte Heatmap */}
						<div className="mt-4 grid grid-cols-16 gap-1 rounded-2xl border border-white/10 bg-black/40 p-3.5" aria-hidden="true">
							{fingerprintBytes.map((byte, index) => {
								const strength = 0.2 + (Number.parseInt(byte, 16) / 255) * 0.8;
								return (
									<span
										key={`${index}-${byte}`}
										title={`Byte ${index + 1}: 0x${byte}`}
										className={`aspect-square rounded-[3px] transition-all duration-300 ${
											changed ? "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.4)]" : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
										}`}
										style={{ opacity: strength }}
									/>
								);
							})}
						</div>

						{/* Hash Hex String */}
						<output className="mt-4 block break-all rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-sm leading-relaxed text-zinc-100" aria-live="polite">
							{digest}
						</output>
					</div>

					<p className={`mt-4 font-display text-xl ${changed ? "text-rose-300 font-bold" : "text-emerald-300 font-semibold"}`}>
						{changed ? "⚡ INPUT CHANGED → DIGEST CHANGED ACROSS THE OUTPUT" : "✓ Identical Input Produces The Same Hash (Deterministic)"}
					</p>
				</div>
			</div>
		</div>
	);
}
