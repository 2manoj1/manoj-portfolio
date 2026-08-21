"use client";

import { useState } from "react";
import { Smartphone, Sparkles, Copy, Check, ExternalLink, ShieldCheck, Flame } from "lucide-react";

export default function QrTakeawayDemo() {
	const [copied, setCopied] = useState(false);
	const lectureUrl = "https://www.manojmukherjee.co.in/lectures/blockchain-finance-supply-chain";

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
		<div className="mx-auto w-full max-w-5xl">
			<div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
				{/* Left: QR Code Card */}
				<div className="flex flex-col items-center justify-center rounded-3xl border border-amber-300/40 bg-amber-300/[0.04] p-8 text-center shadow-[0_0_60px_rgba(251,191,36,0.08)]">
					<div className="relative rounded-2xl bg-white p-4 shadow-2xl">
						{/* Clean High-Contrast SVG QR code visual for lecture URL */}
						<svg
							viewBox="0 0 200 200"
							className="size-48 sm:size-56"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							{/* Background */}
							<rect width="200" height="200" fill="white" />
							{/* Corner finder patterns */}
							{/* Top-Left */}
							<rect x="15" y="15" width="45" height="45" rx="6" fill="#09090b" />
							<rect x="23" y="23" width="29" height="29" rx="3" fill="white" />
							<rect x="29" y="29" width="17" height="17" rx="2" fill="#d97706" />

							{/* Top-Right */}
							<rect x="140" y="15" width="45" height="45" rx="6" fill="#09090b" />
							<rect x="148" y="23" width="29" height="29" rx="3" fill="white" />
							<rect x="154" y="29" width="17" height="17" rx="2" fill="#d97706" />

							{/* Bottom-Left */}
							<rect x="15" y="140" width="45" height="45" rx="6" fill="#09090b" />
							<rect x="23" y="148" width="29" height="29" rx="3" fill="white" />
							<rect x="29" y="154" width="17" height="17" rx="2" fill="#d97706" />

							{/* Matrix pattern elements */}
							<rect x="70" y="20" width="10" height="10" fill="#09090b" />
							<rect x="90" y="20" width="10" height="10" fill="#09090b" />
							<rect x="110" y="20" width="10" height="10" fill="#09090b" />
							<rect x="70" y="40" width="20" height="10" fill="#09090b" />
							<rect x="100" y="40" width="10" height="20" fill="#09090b" />
							<rect x="120" y="40" width="10" height="10" fill="#09090b" />

							<rect x="20" y="70" width="10" height="20" fill="#09090b" />
							<rect x="40" y="80" width="20" height="10" fill="#09090b" />
							<rect x="70" y="70" width="20" height="20" rx="3" fill="#d97706" />
							<rect x="100" y="70" width="30" height="10" fill="#09090b" />
							<rect x="140" y="70" width="10" height="20" fill="#09090b" />
							<rect x="160" y="70" width="20" height="10" fill="#09090b" />

							<rect x="20" y="100" width="20" height="10" fill="#09090b" />
							<rect x="50" y="100" width="10" height="30" fill="#09090b" />
							<rect x="70" y="100" width="10" height="10" fill="#09090b" />
							<rect x="90" y="90" width="20" height="20" rx="3" fill="#09090b" />
							<rect x="120" y="100" width="20" height="10" fill="#09090b" />
							<rect x="150" y="100" width="10" height="20" fill="#09090b" />
							<rect x="170" y="100" width="10" height="20" fill="#09090b" />

							<rect x="70" y="130" width="20" height="10" fill="#09090b" />
							<rect x="100" y="120" width="10" height="20" fill="#09090b" />
							<rect x="120" y="130" width="20" height="20" rx="3" fill="#d97706" />
							<rect x="150" y="130" width="20" height="10" fill="#09090b" />

							<rect x="70" y="150" width="10" height="30" fill="#09090b" />
							<rect x="90" y="160" width="20" height="10" fill="#09090b" />
							<rect x="120" y="160" width="10" height="20" fill="#09090b" />
							<rect x="140" y="150" width="20" height="10" fill="#09090b" />
							<rect x="170" y="160" width="10" height="20" fill="#09090b" />
						</svg>
					</div>

					<div className="mt-4 flex items-center gap-2 text-zinc-400">
						<Smartphone className="size-4 text-amber-300" />
						<p className="font-mono text-xs text-zinc-300">Scan with your phone camera</p>
					</div>
				</div>

				{/* Right: Actions & Student Challenge */}
				<div className="flex flex-col justify-center space-y-5">
					<div>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300">
							<Sparkles className="size-3" /> Live Artifact Takeaway
						</span>
						<h3 className="mt-3 font-display text-3xl text-white md:text-4xl">
							Break The Blockchain on Your Phone
						</h3>
						<p className="mt-3 text-base leading-relaxed text-zinc-300">
							You don&apos;t need a presentation to remember this. The entire interactive engine is live on the web. Run your own tamper attacks, test smart contract conditions, and explore real 2026 enterprise architectures.
						</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-black/40 p-4">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Live URL</p>
						<div className="mt-2 flex items-center justify-between gap-3">
							<span className="truncate font-mono text-xs text-amber-200">{lectureUrl}</span>
							<button
								type="button"
								onClick={copyLink}
								className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:border-amber-300 hover:text-white">
								{copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
								{copied ? "Copied!" : "Copy Link"}
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
							<ShieldCheck className="mr-1.5 size-4" /> Zero Install / Runs in Browser
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
