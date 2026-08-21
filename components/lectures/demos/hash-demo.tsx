"use client";

import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { sha256Utf8 } from "@/lib/lectures/hash";

const BASELINE_INPUT = "Manoj pays ₹10,000 to Rahul";
const BASELINE_HASH =
	"947fc31d8e3ce9f5abbadc33f1812de3aa7e876c46d414b1e7d473210b15aa8d";

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

	const reset = () => {
		requestIdRef.current += 1;
		setInput(BASELINE_INPUT);
		setDigest(BASELINE_HASH);
		setStatus("ready");
	};

	const changed = input !== BASELINE_INPUT;
	const fingerprintBytes = digest.match(/.{2}/g) ?? [];

	return (
		<div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
			<div className="rounded-3xl border border-white/15 bg-white/[0.035] p-5 md:p-7">
				<div className="flex items-center justify-between gap-4">
					<label htmlFor="lecture-hash-input" className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
						Transaction input
					</label>
					<button type="button" onClick={reset} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
						<RotateCcw className="size-3.5" /> Reset
					</button>
				</div>
				<textarea
					id="lecture-hash-input"
					value={input}
					onChange={(event) => void updateHash(event.target.value)}
					className="mt-5 min-h-36 w-full resize-none rounded-2xl border border-white/15 bg-black/35 p-5 text-xl leading-8 text-white outline-none transition focus:border-amber-300/70"
					spellCheck={false}
				/>
				<p className="mt-4 text-sm text-zinc-400">Try changing 10,000 to 10,001.</p>
			</div>

			<div className={`rounded-3xl border p-5 md:p-7 ${changed ? "border-rose-400/50 bg-rose-400/[0.06]" : "border-emerald-400/40 bg-emerald-400/[0.05]"}`}>
				<div className="flex items-center justify-between gap-4">
					<span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">Live fingerprint · SHA-256</span>
					<span className="font-mono text-xs uppercase text-zinc-500">{status}</span>
				</div>
				<div className="mt-5 grid grid-cols-16 gap-1 rounded-2xl border border-white/10 bg-black/25 p-3" aria-hidden="true">
					{fingerprintBytes.map((byte, index) => {
						const strength = 0.2 + (Number.parseInt(byte, 16) / 255) * 0.8;
						return <span key={`${index}-${byte}`} className={`aspect-square rounded-[3px] transition-colors duration-300 ${changed ? "bg-rose-300" : "bg-emerald-300"}`} style={{ opacity: strength }} />;
					})}
				</div>
				<p className="mt-2 text-xs text-zinc-500">32 bytes visualized · every square comes from the real digest below</p>
				<output className="mt-4 block break-all rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-sm leading-6 text-zinc-200" aria-live="polite">
					{status === "error" ? "Web Crypto unavailable in this browser." : digest}
				</output>
				<p className={`mt-4 font-display text-xl ${changed ? "text-rose-300" : "text-emerald-300"}`}>
					{changed ? "ONE CHARACTER CHANGED → HASH CHANGED" : "Same input. Same fingerprint."}
				</p>
			</div>
		</div>
	);
}
