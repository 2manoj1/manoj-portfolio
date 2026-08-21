"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Smartphone, Sparkles, Copy, Check, ExternalLink, ShieldCheck, Flame } from "lucide-react";

export default function QrTakeawayDemo() {
	const [qrDataUrl, setQrDataUrl] = useState<string>("");
	const [copied, setCopied] = useState(false);
	const lectureUrl = "https://www.manojmukherjee.co.in/lectures/blockchain-finance-supply-chain";

	useEffect(() => {
		QRCode.toDataURL(lectureUrl, {
			width: 320,
			margin: 2,
			color: {
				dark: "#09090b",
				light: "#ffffff",
			},
			errorCorrectionLevel: "H",
		})
			.then((url) => setQrDataUrl(url))
			.catch(() => {});
	}, [lectureUrl]);

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(lectureUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2500);
		} catch {
			// fallback
		}
	};

	return (
		<div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
			<div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-center">
				{/* Left: Scannable QR Code Card */}
				<div className="flex flex-col items-center justify-center rounded-3xl border border-amber-300/40 bg-amber-300/[0.04] p-8 text-center shadow-[0_0_70px_rgba(251,191,36,0.1)]">
					<div className="relative overflow-hidden rounded-2xl bg-white p-3.5 shadow-2xl transition hover:scale-105">
						{qrDataUrl ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={qrDataUrl}
								alt="Scan QR code to open the interactive lecture studio"
								className="size-52 rounded-lg sm:size-60"
							/>
						) : (
							<div className="grid size-52 place-items-center bg-white font-mono text-xs text-zinc-600 sm:size-60">
								Generating scannable QR…
							</div>
						)}
					</div>

					<div className="mt-4 flex items-center gap-2 text-zinc-300">
						<Smartphone className="size-4 text-amber-300" />
						<p className="font-mono text-xs text-amber-200">Point your phone camera to scan</p>
					</div>
				</div>

				{/* Right: Actions & Student Takeaway Lab */}
				<div className="flex flex-col justify-center space-y-5">
					<div>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300">
							<Sparkles className="size-3" /> Live Artifact · Zero App Install
						</span>
						<h3 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
							You Control The Simulations Now
						</h3>
						<p className="mt-2 text-base leading-relaxed text-zinc-300">
							This entire keynote is a live, browser-powered system. Open it on your phone or laptop to replay the SHA-256 avalanche simulator, test tamper attacks on Block #2, experiment with smart contract logic gates, and study real 2026 enterprise architectures.
						</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-black/40 p-4">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Live Studio URL</p>
						<div className="mt-2 flex items-center justify-between gap-3">
							<span className="truncate font-mono text-xs font-semibold text-amber-200">{lectureUrl}</span>
							<button
								type="button"
								onClick={copyLink}
								className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-zinc-200 transition hover:border-amber-300 hover:text-white">
								{copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
								{copied ? "Copied Link!" : "Copy Link"}
							</button>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<a
							href={lectureUrl}
							target="_blank"
							rel="noreferrer"
							className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 font-display text-sm font-bold text-zinc-950 transition hover:bg-amber-300 shadow-lg shadow-amber-950/40">
							<Flame className="size-4" /> Open Full Studio <ExternalLink className="size-4" />
						</a>
						<div className="flex items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/5 px-4 text-center font-mono text-xs text-emerald-300">
							<ShieldCheck className="mr-1.5 size-4" /> Web Crypto Powered
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
