"use client";

import { useState, type ComponentType } from "react";
import {
	Landmark,
	Truck,
	HeartPulse,
	GraduationCap,
	Fingerprint,
	Wheat,
	Building,
	FileCode,
	ShieldCheck,
} from "lucide-react";

type Sector = {
	id: string;
	name: string;
	icon: ComponentType<{ className?: string }>;
	color: string;
	glowClass: string;
	headline: string;
	useCase: string;
	realWorldExample: string;
	verifiedStatus: "Production" | "Pilot" | "Deployment";
};

const SECTORS: Sector[] = [
	{
		id: "finance",
		name: "Finance & Banking",
		icon: Landmark,
		color: "text-amber-300 border-amber-400/50 bg-amber-950/20",
		glowClass: "shadow-[0_0_30px_rgba(251,191,36,0.2)]",
		headline: "Programmable Settlement & 24/7 Liquidity",
		useCase: "Instant multi-currency cross-border clearing without correspondent bank friction.",
		realWorldExample: "J.P. Morgan Kinexys ($3T+ processed volume since launch).",
		verifiedStatus: "Production",
	},
	{
		id: "supply-chain",
		name: "Supply Chain",
		icon: Truck,
		color: "text-emerald-300 border-emerald-400/50 bg-emerald-950/20",
		glowClass: "shadow-[0_0_30px_rgba(52,211,153,0.2)]",
		headline: "End-to-End Custody Provenance",
		useCase: "Batch-level tracking of medicines and perishables across multi-tier vendors.",
		realWorldExample: "NIC Drug Logistics Chain (India) & Walmart leafy greens traceability.",
		verifiedStatus: "Production",
	},
	{
		id: "healthcare",
		name: "Healthcare",
		icon: HeartPulse,
		color: "text-rose-300 border-rose-400/50 bg-rose-950/20",
		glowClass: "shadow-[0_0_30px_rgba(244,63,94,0.2)]",
		headline: "Patient-Controlled Medical Provenance",
		useCase: "Tamper-evident clinical trial records and portable cryptographic health credentials.",
		realWorldExample: "European Blockchain Services Infrastructure (EBSI) Health Credentials.",
		verifiedStatus: "Deployment",
	},
	{
		id: "education",
		name: "Education & Credentials",
		icon: GraduationCap,
		color: "text-sky-300 border-sky-400/50 bg-sky-950/20",
		glowClass: "shadow-[0_0_30px_rgba(56,189,248,0.2)]",
		headline: "Instant Digital Degree Verification",
		useCase: "Employers verify certificate authenticity directly against issuer root signatures.",
		realWorldExample: "CBSE Academic Certificate Chain on National Blockchain Portal.",
		verifiedStatus: "Production",
	},
	{
		id: "identity",
		name: "Identity & Governance",
		icon: Fingerprint,
		color: "text-violet-300 border-violet-400/50 bg-violet-950/20",
		glowClass: "shadow-[0_0_30px_rgba(167,139,250,0.2)]",
		headline: "Self-Sovereign Identity & Public Registries",
		useCase: "Verifiable credentials (W3C DID) without relying on centralized single login servers.",
		realWorldExample: "Vishvasya National Blockchain Technology Stack by MeitY (India).",
		verifiedStatus: "Production",
	},
	{
		id: "agriculture",
		name: "Agriculture & Climate",
		icon: Wheat,
		color: "text-yellow-300 border-yellow-400/50 bg-yellow-950/20",
		glowClass: "shadow-[0_0_30px_rgba(250,204,21,0.2)]",
		headline: "Automated Parametric Crop Insurance",
		useCase: "Smart contracts trigger immediate relief payouts to farmers upon verified weather oracle data.",
		realWorldExample: "Arbol Parametric Weather Smart Contracts & Carbon Credit registries.",
		verifiedStatus: "Pilot",
	},
	{
		id: "realestate",
		name: "Real Estate & Assets",
		icon: Building,
		color: "text-cyan-300 border-cyan-400/50 bg-cyan-950/20",
		glowClass: "shadow-[0_0_30px_rgba(34,211,238,0.2)]",
		headline: "Fractional Asset Tokenization & Titles",
		useCase: "Liquid secondary markets and fraud-proof digital land ownership registries.",
		realWorldExample: "NIC Property Chain & DTCC Digital Assets Infrastructure.",
		verifiedStatus: "Deployment",
	},
	{
		id: "ip",
		name: "Digital Rights & AI IP",
		icon: FileCode,
		color: "text-fuchsia-300 border-fuchsia-400/50 bg-fuchsia-950/20",
		glowClass: "shadow-[0_0_30px_rgba(232,121,249,0.2)]",
		headline: "AI Attribution & Content Provenance",
		useCase: "Cryptographic watermarking and programmable micro-payments for AI training data creators.",
		realWorldExample: "Story Protocol & C2PA Content Authenticity Blockchain Anchor.",
		verifiedStatus: "Pilot",
	},
];

export default function EcosystemRadialDemo() {
	const [activeId, setActiveId] = useState<string>("finance");
	const activeSector = SECTORS.find((s) => s.id === activeId) ?? SECTORS[0];

	return (
		<div className="mx-auto w-full max-w-6xl">
			{/* Top Bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
				<div>
					<span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">Enterprise Reach</span>
					<h3 className="font-display text-lg text-white">Beyond Cryptocurrency: The Real Multi-Industry Landscape</h3>
				</div>
				<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-400">
					Select an industry sector below
				</span>
			</div>

			{/* Grid of 8 Sectors */}
			<div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
				{SECTORS.map((sector) => {
					const Icon = sector.icon;
					const isSelected = sector.id === activeId;
					return (
						<button
							key={sector.id}
							type="button"
							onClick={() => setActiveId(sector.id)}
							className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-all ${
								isSelected
									? `${sector.color} ${sector.glowClass} scale-[1.02]`
									: "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white"
							}`}>
							<Icon className="size-4 shrink-0" />
							<span className="truncate text-xs font-semibold">{sector.name}</span>
						</button>
					);
				})}
			</div>

			{/* Active Sector Showcase Card */}
			<div className={`mt-5 rounded-3xl border p-6 transition-all duration-300 md:p-8 ${activeSector.color} ${activeSector.glowClass}`}>
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
					<div className="flex items-center gap-3">
						<div className="grid size-12 place-items-center rounded-2xl bg-black/40 text-white">
							<activeSector.icon className="size-6 text-amber-300" />
						</div>
						<div>
							<h4 className="font-display text-2xl text-white md:text-3xl">{activeSector.name}</h4>
							<p className="font-mono text-xs text-amber-200">{activeSector.headline}</p>
						</div>
					</div>
					<span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
						{activeSector.verifiedStatus}
					</span>
				</div>

				<div className="mt-6 grid gap-6 md:grid-cols-2">
					<div className="rounded-2xl border border-white/10 bg-black/30 p-5">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">Core Problem & Blockchain Solution</p>
						<p className="mt-2 text-base leading-relaxed text-zinc-200">{activeSector.useCase}</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-black/30 p-5">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">Authoritative Real-World Deployment</p>
						<div className="mt-2 flex items-start gap-2">
							<ShieldCheck className="size-5 shrink-0 text-emerald-400" />
							<p className="text-base font-semibold text-white">{activeSector.realWorldExample}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
