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
	Sparkles,
} from "lucide-react";

type Sector = {
	id: string;
	name: string;
	short: string;
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
		short: "Finance",
		icon: Landmark,
		color: "text-amber-300 border-amber-400/60 bg-amber-950/30",
		glowClass: "shadow-[0_0_35px_rgba(251,191,36,0.25)]",
		headline: "Programmable Settlement & 24/7 Liquidity",
		useCase: "Instant multi-currency cross-border clearing without correspondent bank friction or multi-day reconciliation.",
		realWorldExample: "J.P. Morgan Kinexys ($3T+ processed institutional volume).",
		verifiedStatus: "Production",
	},
	{
		id: "supply-chain",
		name: "Supply Chain & Health",
		short: "Supply Chain",
		icon: Truck,
		color: "text-emerald-300 border-emerald-400/60 bg-emerald-950/30",
		glowClass: "shadow-[0_0_35px_rgba(52,211,153,0.25)]",
		headline: "End-to-End Custody Provenance",
		useCase: "Batch-level tracking of medicines, vaccines, and perishables across multi-tier global vendors.",
		realWorldExample: "NIC Drug Logistics Chain (India) & Walmart produce traceability.",
		verifiedStatus: "Production",
	},
	{
		id: "healthcare",
		name: "Healthcare Records",
		short: "Healthcare",
		icon: HeartPulse,
		color: "text-rose-300 border-rose-400/60 bg-rose-950/30",
		glowClass: "shadow-[0_0_35px_rgba(244,63,94,0.25)]",
		headline: "Patient-Controlled Medical Provenance",
		useCase: "Tamper-evident clinical trial data integrity and portable cryptographic health credentials.",
		realWorldExample: "EBSI European Health Credentials & Clinical Trial Audits.",
		verifiedStatus: "Deployment",
	},
	{
		id: "education",
		name: "Education & Degrees",
		short: "Education",
		icon: GraduationCap,
		color: "text-sky-300 border-sky-400/60 bg-sky-950/30",
		glowClass: "shadow-[0_0_35px_rgba(56,189,248,0.25)]",
		headline: "Instant Digital Credential Verification",
		useCase: "Employers verify certificate authenticity directly against university root cryptographic signatures.",
		realWorldExample: "CBSE Academic Certificate Chain on National Blockchain Portal.",
		verifiedStatus: "Production",
	},
	{
		id: "identity",
		name: "Identity & Governance",
		short: "Identity",
		icon: Fingerprint,
		color: "text-violet-300 border-violet-400/60 bg-violet-950/30",
		glowClass: "shadow-[0_0_35px_rgba(167,139,250,0.25)]",
		headline: "Self-Sovereign Identity (W3C DID)",
		useCase: "User-owned cryptographic credentials without single-point-of-failure centralized login servers.",
		realWorldExample: "Vishvasya National Blockchain Technology Stack by MeitY (India).",
		verifiedStatus: "Production",
	},
	{
		id: "agriculture",
		name: "Agriculture & Climate",
		short: "Agriculture",
		icon: Wheat,
		color: "text-yellow-300 border-yellow-400/60 bg-yellow-950/30",
		glowClass: "shadow-[0_0_35px_rgba(250,204,21,0.25)]",
		headline: "Automated Parametric Crop Insurance",
		useCase: "Smart contracts trigger immediate relief payouts to farmers upon verified IoT weather oracle feeds.",
		realWorldExample: "Arbol Parametric Weather Smart Contracts & Carbon Credit registries.",
		verifiedStatus: "Pilot",
	},
	{
		id: "realestate",
		name: "Real Estate & Land",
		short: "Real Estate",
		icon: Building,
		color: "text-cyan-300 border-cyan-400/60 bg-cyan-950/30",
		glowClass: "shadow-[0_0_35px_rgba(34,211,238,0.25)]",
		headline: "Fractional Tokenization & Titles",
		useCase: "Liquid secondary investment markets and fraud-proof digital land registry ownership records.",
		realWorldExample: "NIC Property Chain & DTCC Digital Assets Infrastructure.",
		verifiedStatus: "Deployment",
	},
	{
		id: "ip",
		name: "Digital Rights & AI IP",
		short: "AI & IP",
		icon: FileCode,
		color: "text-fuchsia-300 border-fuchsia-400/60 bg-fuchsia-950/30",
		glowClass: "shadow-[0_0_35px_rgba(232,121,249,0.25)]",
		headline: "AI Attribution & Content Provenance",
		useCase: "Cryptographic watermarking and programmatic micro-payments for AI training data creators.",
		realWorldExample: "Story Protocol & C2PA Content Authenticity Blockchain Anchor.",
		verifiedStatus: "Pilot",
	},
];

export default function EcosystemRadialDemo() {
	const [activeId, setActiveId] = useState<string>("finance");
	const activeSector = SECTORS.find((s) => s.id === activeId) ?? SECTORS[0];

	return (
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
			{/* Top Bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
				<div>
					<span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">Multi-Industry Infographic Hub</span>
					<h3 className="font-display text-lg font-bold text-white">Beyond Cryptocurrency: 8 Enterprise Sectors</h3>
				</div>
				<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-xs text-amber-300">
					<Sparkles className="size-3" /> Select any sector to inspect architecture
				</span>
			</div>

			{/* 8-Sector Interactive Infographic Grid */}
			<div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
				{SECTORS.map((sector) => {
					const Icon = sector.icon;
					const isSelected = sector.id === activeId;
					return (
						<button
							key={sector.id}
							type="button"
							onClick={() => setActiveId(sector.id)}
							className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-300 ${
								isSelected
									? `${sector.color} ${sector.glowClass} scale-[1.03] ring-1 ring-white/20`
									: "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
							}`}>
							<div className={`grid size-9 shrink-0 place-items-center rounded-xl transition ${
								isSelected ? "bg-black/50 text-white" : "bg-white/5 text-zinc-400 group-hover:text-white"
							}`}>
								<Icon className="size-4.5" />
							</div>
							<div className="min-w-0">
								<p className="truncate text-xs font-bold">{sector.name}</p>
								<p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">{sector.verifiedStatus}</p>
							</div>
						</button>
					);
				})}
			</div>

			{/* Active Sector Showcase Infographic Card */}
			<div className={`mt-5 rounded-3xl border p-6 transition-all duration-300 md:p-8 ${activeSector.color} ${activeSector.glowClass}`}>
				<div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
					<div className="flex items-center gap-4">
						<div className="grid size-14 place-items-center rounded-2xl bg-black/50 text-amber-300 shadow-lg">
							<activeSector.icon className="size-7" />
						</div>
						<div>
							<h4 className="font-display text-2xl font-bold text-white md:text-3xl">{activeSector.name}</h4>
							<p className="font-mono text-xs font-semibold text-amber-200">{activeSector.headline}</p>
						</div>
					</div>
					<span className="rounded-full border border-white/20 bg-black/60 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-emerald-300 shadow-md">
						Verified Status: {activeSector.verifiedStatus}
					</span>
				</div>

				<div className="mt-6 grid gap-5 md:grid-cols-2">
					<div className="rounded-2xl border border-white/10 bg-black/40 p-5">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">Core Problem & Blockchain Solution</p>
						<p className="mt-2 text-base leading-relaxed text-zinc-200">{activeSector.useCase}</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-black/40 p-5">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">Authoritative Real-World Deployment</p>
						<div className="mt-2 flex items-start gap-2.5">
							<ShieldCheck className="size-5 shrink-0 text-emerald-400 mt-0.5" />
							<p className="text-base font-semibold text-white">{activeSector.realWorldExample}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
