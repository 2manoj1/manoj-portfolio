"use client";

import { Check, FileSignature, KeyRound, RotateCcw, ShieldCheck, ShieldX } from "lucide-react";
import { useRef, useState } from "react";

type DemoStatus = "idle" | "working" | "signed" | "valid" | "invalid" | "error";

const INITIAL_MESSAGE = "Approve credential KJU-2026-001";

function toHex(buffer: ArrayBuffer) {
	return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default function SignatureDemo() {
	const [message, setMessage] = useState(INITIAL_MESSAGE);
	const [signatureHex, setSignatureHex] = useState("");
	const [status, setStatus] = useState<DemoStatus>("idle");
	const keyPairRef = useRef<CryptoKeyPair | null>(null);
	const signatureRef = useRef<ArrayBuffer | null>(null);
	const requestIdRef = useRef(0);

	const sign = async () => {
		const requestId = ++requestIdRef.current;
		setStatus("working");
		try {
			if (!globalThis.crypto?.subtle) throw new Error("Web Crypto unavailable");
			const keyPair = await globalThis.crypto.subtle.generateKey(
				{ name: "ECDSA", namedCurve: "P-256" },
				false,
				["sign", "verify"],
			);
			const signature = await globalThis.crypto.subtle.sign(
				{ name: "ECDSA", hash: "SHA-256" },
				keyPair.privateKey,
				new TextEncoder().encode(message),
			);
			if (requestId !== requestIdRef.current) return;
			keyPairRef.current = keyPair;
			signatureRef.current = signature;
			setSignatureHex(toHex(signature));
			setStatus("signed");
		} catch {
			if (requestId === requestIdRef.current) setStatus("error");
		}
	};

	const verify = async () => {
		const keyPair = keyPairRef.current;
		const signature = signatureRef.current;
		if (!keyPair || !signature) return;
		const requestId = ++requestIdRef.current;
		setStatus("working");
		try {
			const isValid = await globalThis.crypto.subtle.verify(
				{ name: "ECDSA", hash: "SHA-256" },
				keyPair.publicKey,
				signature,
				new TextEncoder().encode(message),
			);
			if (requestId === requestIdRef.current) setStatus(isValid ? "valid" : "invalid");
		} catch {
			if (requestId === requestIdRef.current) setStatus("error");
		}
	};

	const reset = () => {
		requestIdRef.current += 1;
		keyPairRef.current = null;
		signatureRef.current = null;
		setMessage(INITIAL_MESSAGE);
		setSignatureHex("");
		setStatus("idle");
	};

	const working = status === "working";
	const hasSignature = signatureHex.length > 0;

	return (
		<div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1fr_0.8fr]">
			<section className="rounded-3xl border border-white/15 bg-white/[0.035] p-5 md:p-6">
				<label htmlFor="signature-message" className="font-mono text-xs uppercase tracking-[0.18em] text-amber-300">Message to approve</label>
				<textarea
					id="signature-message"
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					rows={3}
					maxLength={240}
					className="mt-3 w-full resize-none rounded-2xl border border-white/15 bg-black/35 p-4 text-lg text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/60"
				/>
				<div className="mt-4 flex flex-wrap gap-2">
					<button type="button" onClick={() => void sign()} disabled={working || message.length === 0} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40">
						<FileSignature className="size-4" /> {working && !hasSignature ? "Signing…" : "Create key + sign"}
					</button>
					<button type="button" onClick={() => void verify()} disabled={working || !hasSignature} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/[0.06] px-4 text-sm text-cyan-100 transition hover:border-cyan-200 disabled:cursor-not-allowed disabled:opacity-40">
						<ShieldCheck className="size-4" /> Verify current message
					</button>
					<button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-zinc-300 transition hover:border-white/30">
						<RotateCcw className="size-4" /> Reset
					</button>
				</div>
				<p className="mt-4 text-sm text-zinc-500">Try it: sign → verify → change <strong className="text-zinc-300">001</strong> to <strong className="text-zinc-300">002</strong> → verify again.</p>
			</section>

			<section className="flex flex-col rounded-3xl border border-white/15 bg-black/25 p-5 md:p-6" aria-live="polite">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-2 text-zinc-300"><KeyRound className="size-5 text-violet-300" /><span className="font-mono text-xs uppercase tracking-wider">Browser key pair</span></div>
					{hasSignature ? <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 px-2.5 py-1 font-mono text-[10px] uppercase text-emerald-200"><Check className="size-3" /> created</span> : null}
				</div>
				<div className="mt-4 min-h-24 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
					<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">ECDSA signature</p>
					<p className="mt-2 break-all font-mono text-xs leading-5 text-zinc-400">{signatureHex || "Sign the message to generate a real cryptographic signature."}</p>
				</div>
				<div className={`mt-4 flex min-h-20 items-center gap-3 rounded-2xl border p-4 ${status === "valid" ? "border-emerald-400/40 bg-emerald-400/[0.06]" : status === "invalid" || status === "error" ? "border-rose-400/40 bg-rose-400/[0.06]" : "border-white/10 bg-white/[0.02]"}`} role={status === "invalid" || status === "error" ? "alert" : undefined}>
					{status === "valid" ? <ShieldCheck className="size-7 shrink-0 text-emerald-300" /> : status === "invalid" || status === "error" ? <ShieldX className="size-7 shrink-0 text-rose-300" /> : <FileSignature className="size-7 shrink-0 text-zinc-600" />}
					<div>
						<p className="font-semibold text-white">{status === "valid" ? "Valid signature" : status === "invalid" ? "Verification failed" : status === "error" ? "Crypto operation failed" : status === "signed" ? "Signature ready—verify it" : status === "working" ? "Calculating locally…" : "Waiting for a signature"}</p>
						<p className="mt-1 text-xs text-zinc-400">{status === "invalid" ? "The signature no longer matches the edited message." : "The private key never leaves this browser demo."}</p>
					</div>
				</div>
				<p className="mt-3 text-xs leading-5 text-zinc-600">Educational P-256 Web Crypto demo. Production chains and wallets may use different signature schemes and secure key storage.</p>
			</section>
		</div>
	);
}
