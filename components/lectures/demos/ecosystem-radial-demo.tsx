"use client";

import { useState, type ComponentType } from "react";
import {
	Landmark,
	Truck,
	GraduationCap,
	Building,
	ShieldCheck,
	Sparkles,
	Scale,
	Network,
	Bot,
	Globe2,
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
	verifiedStatus: "Production" | "Prototype" | "Standards";
};

const SECTORS: Sector[] = [
	{
		id: "finance",
		name: "Finance & Banking",
		short: "Finance",
		icon: Landmark,
		color: "text-amber-300 border-amber-400/60 bg-amber-950/30",
		glowClass: "shadow-[0_0_35px_rgba(251,191,36,0.25)]",
		headline: "Institutional Payment & Settlement Rail",
		useCase: "Regulated institutions coordinate programmable deposit payments on a permissioned shared network.",
		realWorldExample: "J.P. Morgan reports Kinexys has processed more than $3T since inception.",
		verifiedStatus: "Production",
	},
	{
		id: "supply-chain",
		name: "Drug Logistics",
		short: "Drug Logistics",
		icon: Truck,
		color: "text-emerald-300 border-emerald-400/60 bg-emerald-950/30",
		glowClass: "shadow-[0_0_35px_rgba(52,211,153,0.25)]",
		headline: "Shared Medicine Logistics Records",
		useCase: "Suppliers, warehouses, and hospitals coordinate custody and inventory events under common rules.",
		realWorldExample: "NIC National Blockchain Portal lists Drug Logistics as a live chain.",
		verifiedStatus: "Production",
	},
	{
		id: "education",
		name: "Education Credentials",
		short: "Education",
		icon: GraduationCap,
		color: "text-rose-300 border-rose-400/60 bg-rose-950/30",
		glowClass: "shadow-[0_0_35px_rgba(244,63,94,0.25)]",
		headline: "Issuer-Backed Document Verification",
		useCase: "A verifier checks an academic document against an issuer-backed shared record instead of trusting a photocopy.",
		realWorldExample: "NIC Certificate Chain includes CBSE academic documents.",
		verifiedStatus: "Production",
	},
	{
		id: "property",
		name: "Property Records",
		short: "Property",
		icon: Building,
		color: "text-sky-300 border-sky-400/60 bg-sky-950/30",
		glowClass: "shadow-[0_0_35px_rgba(56,189,248,0.25)]",
		headline: "Shared Land-Record History",
		useCase: "Authorized departments and verifiers coordinate selected property records and their change history.",
		realWorldExample: "NIC National Blockchain Portal lists Property Chain as live.",
		verifiedStatus: "Production",
	},
	{
		id: "justice",
		name: "Justice & ICJS",
		short: "Justice",
		icon: Scale,
		color: "text-violet-300 border-violet-400/60 bg-violet-950/30",
		glowClass: "shadow-[0_0_35px_rgba(167,139,250,0.25)]",
		headline: "Cross-Agency Record Verification",
		useCase: "Independently administered justice institutions can verify selected shared records and provenance.",
		realWorldExample: "NIC portal lists Judiciary and ICJS among its live chains.",
		verifiedStatus: "Production",
	},
	{
		id: "infrastructure",
		name: "Public Infrastructure",
		short: "Vishvasya",
		icon: Network,
		color: "text-yellow-300 border-yellow-400/60 bg-yellow-950/30",
		glowClass: "shadow-[0_0_35px_rgba(250,204,21,0.25)]",
		headline: "Government Blockchain-as-a-Service",
		useCase: "Departments can build permissioned applications on shared national infrastructure instead of provisioning a ledger stack from scratch.",
		realWorldExample: "MeitY launched Vishvasya National Blockchain Framework in 2024.",
		verifiedStatus: "Production",
	},
	{
		id: "cross-border",
		name: "Cross-Border Research",
		short: "Project Agorá",
		icon: Globe2,
		color: "text-cyan-300 border-cyan-400/60 bg-cyan-950/30",
		glowClass: "shadow-[0_0_35px_rgba(34,211,238,0.25)]",
		headline: "Tokenised Wholesale Settlement Research",
		useCase: "Central banks and regulated institutions test whether tokenised money can improve cross-border wholesale coordination.",
		realWorldExample: "BIS Project Agorá remains a public-private prototype.",
		verifiedStatus: "Prototype",
	},
	{
		id: "agents",
		name: "AI Agent Payments",
		short: "AI Payments",
		icon: Bot,
		color: "text-fuchsia-300 border-fuchsia-400/60 bg-fuchsia-950/30",
		glowClass: "shadow-[0_0_35px_rgba(232,121,249,0.25)]",
		headline: "Verifiable Intent & Programmatic Payments",
		useCase: "Emerging protocols explore how agents can present scoped authority and respond to machine-readable payment requests.",
		realWorldExample: "Google AP2 and Coinbase x402 are protocol work—not universal production adoption.",
		verifiedStatus: "Standards",
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
					<span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">Evidence-Backed Systems Map</span>
					<h3 className="font-display text-lg font-bold text-white">Eight systems · different maturity</h3>
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
						Maturity: {activeSector.verifiedStatus}
					</span>
				</div>

				<div className="mt-6 grid gap-5 md:grid-cols-2">
					<div className="rounded-2xl border border-white/10 bg-black/40 p-5">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">Coordination problem & ledger role</p>
						<p className="mt-2 text-base leading-relaxed text-zinc-200">{activeSector.useCase}</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-black/40 p-5">
						<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">Documented example</p>
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
