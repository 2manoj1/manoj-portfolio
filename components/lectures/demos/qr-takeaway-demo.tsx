"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Smartphone, Sparkles, Copy, Check, ExternalLink, ShieldCheck, Flame, UserCheck, Share2, Globe } from "lucide-react";

export default function QrTakeawayDemo() {
	const [studioQrUrl, setStudioQrUrl] = useState<string>("");
	const [aboutQrUrl, setAboutQrUrl] = useState<string>("");
	const [copiedStudio, setCopiedStudio] = useState(false);
	const [copiedAbout, setCopiedAbout] = useState(false);

	const lectureUrl = "https://www.manojmukherjee.co.in/lectures/blockchain-finance-supply-chain";
	const aboutUrl = "https://www.manojmukherjee.co.in/about";
	const linkedinUrl = "https://www.linkedin.com/in/manoj-mukherjee";

	useEffect(() => {
		QRCode.toDataURL(lectureUrl, {
			width: 280,
			margin: 2,
			color: { dark: "#09090b", light: "#ffffff" },
			errorCorrectionLevel: "H",
		})
			.then((url) => setStudioQrUrl(url))
			.catch(() => {});

		QRCode.toDataURL(aboutUrl, {
			width: 280,
			margin: 2,
			color: { dark: "#09090b", light: "#ffffff" },
			errorCorrectionLevel: "H",
		})
			.then((url) => setAboutQrUrl(url))
			.catch(() => {});
	}, [lectureUrl, aboutUrl]);

	const copyStudio = async () => {
		try {
			await navigator.clipboard.writeText(lectureUrl);
			setCopiedStudio(true);
			setTimeout(() => setCopiedStudio(false), 2000);
		} catch {
			// fallback
		}
	};

	const copyAbout = async () => {
		try {
			await navigator.clipboard.writeText(aboutUrl);
			setCopiedAbout(true);
			setTimeout(() => setCopiedAbout(false), 2000);
		} catch {
			// fallback
		}
	};

	return (
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
			{/* Top Header Banner */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
				<div>
					<span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">BCA 1st Year Keynote Takeaway</span>
					<h3 className="font-display text-lg font-bold text-white">Scan & Take The Engineering Studio With You</h3>
				</div>
				<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-300">
					<Sparkles className="size-3" /> Live Artifacts Ready
				</span>
			</div>

			{/* Dual QR Code Display */}
			<div className="mt-4 grid gap-5 lg:grid-cols-2">
				{/* QR 1: Interactive Lecture Studio */}
				<div className="flex flex-col justify-between rounded-3xl border border-amber-300/40 bg-amber-300/[0.04] p-6 shadow-[0_0_50px_rgba(251,191,36,0.08)]">
					<div className="flex items-center justify-between border-b border-white/10 pb-3">
						<div className="flex items-center gap-2">
							<span className="grid size-7 place-items-center rounded-lg bg-amber-400 font-mono text-xs font-bold text-zinc-950">
								01
							</span>
							<div>
								<h4 className="font-display text-base font-bold text-white">Live Interactive Lecture Studio</h4>
								<p className="font-mono text-[10px] text-amber-200">Replay Every Lab on Mobile</p>
							</div>
						</div>
						<span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-mono text-[9px] uppercase font-semibold text-amber-300">
							Web Simulator
						</span>
					</div>

					<div className="my-5 flex flex-col items-center justify-center">
						<div className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-2xl transition hover:scale-105">
							{studioQrUrl ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={studioQrUrl}
									alt="Scan QR code for interactive blockchain studio"
									className="size-44 rounded-lg sm:size-48"
								/>
							) : (
								<div className="grid size-44 place-items-center bg-white font-mono text-xs text-zinc-600 sm:size-48">
									Generating QR…
								</div>
							)}
						</div>
						<p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-amber-200">
							<Smartphone className="size-3.5 text-amber-300" /> Point phone camera to open lab
						</p>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs">
							<span className="truncate font-mono text-[11px] text-zinc-300">{lectureUrl}</span>
							<button
								type="button"
								onClick={copyStudio}
								className="ml-2 inline-flex shrink-0 items-center gap-1 text-[11px] text-amber-300 hover:text-white">
								{copiedStudio ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
								{copiedStudio ? "Copied" : "Copy"}
							</button>
						</div>
						<a
							href={lectureUrl}
							target="_blank"
							rel="noreferrer"
							className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-bold text-zinc-950 transition hover:bg-amber-300">
							<Flame className="size-3.5" /> Launch Studio in New Tab <ExternalLink className="size-3.5" />
						</a>
					</div>
				</div>

				{/* QR 2: Connect with Manoj (About & LinkedIn) */}
				<div className="flex flex-col justify-between rounded-3xl border border-cyan-400/40 bg-cyan-400/[0.04] p-6 shadow-[0_0_50px_rgba(34,211,238,0.08)]">
					<div className="flex items-center justify-between border-b border-white/10 pb-3">
						<div className="flex items-center gap-2">
							<span className="grid size-7 place-items-center rounded-lg bg-cyan-400 font-mono text-xs font-bold text-zinc-950">
								02
							</span>
							<div>
								<h4 className="font-display text-base font-bold text-white">Connect with Manoj Mukherjee</h4>
								<p className="font-mono text-[10px] text-cyan-200">Founder · AI Scientist · Architect</p>
							</div>
						</div>
						<span className="rounded-full bg-cyan-400/20 px-2 py-0.5 font-mono text-[9px] uppercase font-semibold text-cyan-300">
							About & Bio
						</span>
					</div>

					<div className="my-5 flex flex-col items-center justify-center">
						<div className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-2xl transition hover:scale-105">
							{aboutQrUrl ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={aboutQrUrl}
									alt="Scan QR code to view Manoj Mukherjee about page"
									className="size-44 rounded-lg sm:size-48"
								/>
							) : (
								<div className="grid size-44 place-items-center bg-white font-mono text-xs text-zinc-600 sm:size-48">
									Generating QR…
								</div>
							)}
						</div>
						<p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-cyan-200">
							<UserCheck className="size-3.5 text-cyan-300" /> Connect for research & AI systems
						</p>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs">
							<span className="truncate font-mono text-[11px] text-zinc-300">{aboutUrl}</span>
							<button
								type="button"
								onClick={copyAbout}
								className="ml-2 inline-flex shrink-0 items-center gap-1 text-[11px] text-cyan-300 hover:text-white">
								{copiedAbout ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
								{copiedAbout ? "Copied" : "Copy"}
							</button>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<a
								href={aboutUrl}
								target="_blank"
								rel="noreferrer"
								className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-950/40 text-xs font-bold text-cyan-200 transition hover:bg-cyan-900/60">
								<Globe className="size-3.5" /> /about Page
							</a>
							<a
								href={linkedinUrl}
								target="_blank"
								rel="noreferrer"
								className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-cyan-400 text-xs font-bold text-zinc-950 transition hover:bg-cyan-300">
								<Share2 className="size-3.5" /> LinkedIn Profile
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* Closing Vision Note */}
			<div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-3 text-xs text-zinc-400">
				<p>
					<strong className="text-white">Kristu Jayanti University BCA 1st Year:</strong> Build systems with cryptographic rigor and distributed consensus.
				</p>
				<span className="hidden font-mono text-[10px] uppercase text-emerald-300 sm:inline-block">
					<ShieldCheck className="mr-1 inline size-3.5" /> 2026 Production Verified
				</span>
			</div>
		</div>
	);
}
