"use client";

import { Check, FileSignature, KeyRound, RotateCcw, ShieldCheck, ShieldX, Sparkles, Zap } from "lucide-react";
import { useRef, useState } from "react";

type DemoStatus = "idle" | "working" | "signed" | "valid" | "invalid" | "error";

const INITIAL_MESSAGE = "Approve credential KJU-2026-001 for Student Rahul";

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
			if (requestId !== requestIdRef.current) return;
			setStatus(isValid ? "valid" : "invalid");
		} catch {
			if (requestId === requestIdRef.current) setStatus("error");
		}
	};

	const injectTamper = () => {
		setMessage((prev) => (prev.includes("Rahul") ? prev.replace("Rahul", "FakeStudent_X") : prev + " [TAMPERED]"));
		setStatus("signed");
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
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
			<div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
				{/* Signer Console */}
				<section className="flex flex-col justify-between rounded-3xl border border-white/15 bg-white/[0.035] p-6 shadow-xl">
					<div>
						<div className="flex items-center justify-between">
							<label htmlFor="signature-message" className="font-mono text-xs uppercase tracking-[0.18em] text-amber-300">
								Message Payload to Authorize
							</label>
							<span className="font-mono text-[10px] text-zinc-500">ECDSA P-256</span>
						</div>
						<textarea
							id="signature-message"
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							rows={3}
							maxLength={240}
							className="mt-3 w-full resize-none rounded-2xl border border-white/15 bg-black/40 p-4 font-sans text-base text-white outline-none transition focus:border-amber-400"
						/>
					</div>

					<div className="mt-5 space-y-3">
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => void sign()}
								disabled={working || message.length === 0}
								className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-5 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 disabled:opacity-40 shadow-lg shadow-amber-950/40">
								<FileSignature className="size-4" /> {working && !hasSignature ? "Signing…" : "1. Generate Key + Sign"}
							</button>
							<button
								type="button"
								onClick={() => void verify()}
								disabled={working || !hasSignature}
								className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-400/50 px-5 text-xs font-bold text-cyan-200 transition hover:bg-cyan-500/30 disabled:opacity-40">
								<ShieldCheck className="size-4" /> 2. Verify Signature
							</button>
							<button
								type="button"
								onClick={injectTamper}
								disabled={!hasSignature}
								className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-600/20 border border-rose-500/40 px-4 text-xs font-bold text-rose-300 transition hover:bg-rose-600/30 disabled:opacity-40">
								<Zap className="size-3.5" /> ⚡ Tamper Message
							</button>
							<button
								type="button"
								onClick={reset}
								className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-white/15 px-3.5 text-xs text-zinc-400 transition hover:border-white/30 hover:text-white">
								<RotateCcw className="size-3.5" /> Reset
							</button>
						</div>

						<p className="rounded-xl border border-white/5 bg-black/30 p-2.5 font-mono text-xs text-zinc-400">
							<strong className="text-amber-200">Try it:</strong> Sign → Verify (Valid ✓) → Click &quot;⚡ Tamper Message&quot; → Verify again (Fails ✗).
						</p>
					</div>
				</section>

				{/* Cryptographic Result Card */}
				<section className="flex flex-col justify-between rounded-3xl border border-white/15 bg-black/40 p-6 shadow-xl" aria-live="polite">
					<div>
						<div className="flex items-center justify-between border-b border-white/10 pb-3">
							<div className="flex items-center gap-2 text-zinc-300">
								<KeyRound className="size-4 text-violet-300" />
								<span className="font-mono text-xs uppercase tracking-wider font-bold">Public Key & Signature</span>
							</div>
							{hasSignature && (
								<span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-300">
									<Check className="size-3" /> Signed
								</span>
							)}
						</div>

						<div className="mt-4 rounded-2xl border border-white/10 bg-black/50 p-4">
							<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">64-Byte ECDSA Hex Signature</p>
							<p className="mt-1.5 break-all font-mono text-xs leading-relaxed text-amber-200">
								{signatureHex || "Click 'Generate Key + Sign' to create a real cryptographic ECDSA P-256 signature in browser memory."}
							</p>
						</div>
					</div>

					<div className={`mt-4 flex min-h-24 items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${
						status === "valid"
							? "border-emerald-400/60 bg-emerald-950/40 text-emerald-100 shadow-[0_0_40px_rgba(52,211,153,0.15)]"
							: status === "invalid"
								? "border-rose-500/60 bg-rose-950/40 text-rose-100 shadow-[0_0_40px_rgba(244,63,94,0.15)]"
								: "border-white/10 bg-white/[0.02] text-zinc-300"
					}`}>
						{status === "valid" ? (
							<ShieldCheck className="size-8 shrink-0 text-emerald-400" />
						) : status === "invalid" ? (
							<ShieldX className="size-8 shrink-0 text-rose-400" />
						) : (
							<Sparkles className="size-8 shrink-0 text-amber-300" />
						)}
						<div>
							<p className="font-display text-lg font-bold text-white">
								{status === "valid" && "SIGNATURE VERIFIED ✓"}
								{status === "invalid" && "SIGNATURE FORGERY DETECTED ✗"}
								{status === "signed" && "Signature Ready · Click Verify"}
								{status === "working" && "Calculating Web Crypto Hash…"}
								{status === "idle" && "Awaiting Digital Signature"}
							</p>
							<p className="mt-0.5 text-xs text-zinc-400">
								{status === "valid" && "Public key confirms this exact message was signed by the private key holder."}
								{status === "invalid" && "Message was altered! Mathematical verification rejects the forged payload."}
								{status === "signed" && "Private key remains private in browser memory."}
								{status === "idle" && "Digital signatures guarantee identity and non-repudiation."}
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
