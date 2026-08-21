"use client";

import { useState } from "react";
import {
	ArrowRight,
	Bot,
	Building2,
	ExternalLink,
	Landmark,
	PackageSearch,
	ShieldCheck,
} from "lucide-react";
import type { ComponentType } from "react";
import type { LectureSource } from "@/lib/lectures/types";

type SectorId = "finance" | "india" | "supply-chain" | "ai-agents";

type IndustryCase = {
	id: string;
	name: string;
	status: LectureSource["status"];
	metric: string;
	flow: readonly [string, string, string, string];
	why: string;
	reality: string;
	source: string;
	publisher: string;
};

type Sector = {
	id: SectorId;
	label: string;
	icon: ComponentType<{ className?: string }>;
	cases: readonly IndustryCase[];
};

const sectors: readonly Sector[] = [
	{
		id: "finance",
		label: "Finance",
		icon: Landmark,
		cases: [
			{
				id: "kinexys",
				name: "Kinexys",
				status: "production",
				metric: "$3T+ since inception · $5B+ average daily",
				flow: ["Bank instruction", "Shared ledger", "Programmed rules", "24/7 settlement"],
				why: "Regulated institutions need money and assets to move against the same synchronized state.",
				reality: "Live permissioned infrastructure—not a speculative-token story.",
				source: "https://www.jpmorgan.com/payments/newsroom/kinexys-milestones-2026",
				publisher: "J.P. Morgan",
			},
			{
				id: "digital-rupee",
				name: "Digital rupee · e₹",
				status: "pilot",
				metric: "Retail + wholesale pilots",
				flow: ["RBI liability", "Digital wallet", "Programmed use", "Pilot settlement"],
				why: "Tests digital central-bank money with programmability and offline-use exploration.",
				reality: "A pilot is not a national production rollout; CBDC does not automatically mean public blockchain.",
				source: "https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1436",
				publisher: "Reserve Bank of India",
			},
			{
				id: "agora",
				name: "Project Agorá",
				status: "prototype",
				metric: "Public-private prototype · controlled real-value testing",
				flow: ["Tokenized deposits", "Central-bank reserves", "Atomic exchange", "Cross-border result"],
				why: "Explores whether money and assets can settle together with less reconciliation and liquidity friction.",
				reality: "Controlled real-value testing; BIS explicitly says this is not a finished product.",
				source: "https://www.bis.org/about/bisih/topics/fmis/agora.htm",
				publisher: "Bank for International Settlements",
			},
			{
				id: "dtcc",
				name: "DTCC tokenization",
				status: "prelaunch",
				metric: "Production trades demonstrated · broader launch expected Oct 2026",
				flow: ["Custodied asset", "Tokenized form", "Onchain trade", "Existing market rails"],
				why: "Connects regulated custody and market infrastructure to programmable digital networks.",
				reality: "Production trades are real; the broader service is still described as prelaunch.",
				source: "https://www.dtcc.com/digital-assets/tokenization/live-production-trades",
				publisher: "DTCC",
			},
		],
	},
	{
		id: "india",
		label: "India",
		icon: Building2,
		cases: [
			{
				id: "nic-live",
				name: "NIC live chains",
				status: "production",
				metric: "Certificates · logistics · property · judiciary · ICJS",
				flow: ["Department", "Permissioned chain", "Shared proof", "Citizen / verifier"],
				why: "Independent departments and verifiers can check a common tamper-evident record.",
				reality: "The portal distinguishes its live chains from land, blood bank, GST and PDS proofs of concept.",
				source: "https://blockchain.gov.in/Home/Home",
				publisher: "NIC",
			},
			{
				id: "vishvasya",
				name: "Vishvasya NBF",
				status: "production",
				metric: "BaaS · 3 NIC data-centre locations",
				flow: ["Government app", "Open APIs", "Permissioned nodes", "Verified service"],
				why: "Provides shared infrastructure so public applications do not each build a network from zero.",
				reality: "A production platform does not make every proposed use case a production deployment.",
				source: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2051934&lang=1&reg=3",
				publisher: "MeitY / PIB",
			},
		],
	},
	{
		id: "supply-chain",
		label: "Supply chain",
		icon: PackageSearch,
		cases: [
			{
				id: "drug-logistics",
				name: "NIC drug logistics",
				status: "production",
				metric: "Manufacturer → supplier → warehouse → hospital",
				flow: ["Batch created", "Custody changes", "Hospital receives", "Journey verifies"],
				why: "Organizations need one provenance trail while physical custody changes hands.",
				reality: "Blockchain proves the submitted record; sensors, identity and audits still connect it to reality.",
				source: "https://blockchain.gov.in/Home/LiveChain?LiveChain=LogisticsChain",
				publisher: "NIC",
			},
			{
				id: "walmart",
				name: "Walmart traceability",
				status: "deployment",
				metric: "About 7 days → a few seconds, reported in 2018",
				flow: ["Farm event", "Supplier event", "Store receipt", "Trace query"],
				why: "Faster provenance can narrow a food-safety investigation instead of discarding everything.",
				reality: "A strong historic deployment example—not proof of the platform's exact 2026 scope.",
				source: "https://corporate.walmart.com/news/2018/09/24/in-wake-of-romaine-e-coli-scare-walmart-deploys-blockchain-to-track-leafy-greens",
				publisher: "Walmart",
			},
			{
				id: "tradelens",
				name: "TradeLens",
				status: "closed",
				metric: "Closure announced in 2022 · platform withdrawn in 2023",
				flow: ["Shipping ecosystem", "Shared platform", "Network effects", "Commercial outcome"],
				why: "Global logistics only improves when enough independent participants join and share value.",
				reality: "Maersk cited insufficient collaboration and commercial viability; the source does not assign one simple cause.",
				source: "https://www.maersk.com/news/articles/2022/12/01/information-on-the-closure-of-tradeLens",
				publisher: "A.P. Moller–Maersk",
			},
		],
	},
	{
		id: "ai-agents",
		label: "AI agents",
		icon: Bot,
		cases: [
			{
				id: "ap2",
				name: "Google AP2",
				status: "reference",
				metric: "Open protocol work · verifiable payment mandates",
				flow: ["Human intent", "Verifiable mandate", "Agent action", "Accountable record"],
				why: "Autonomous payments need explicit authority, auditability and dispute evidence.",
				reality: "A standards effort for agent payments—not evidence that every AI agent belongs onchain.",
				source: "https://blog.google/products-and-platforms/platforms/google-pay/agent-payments-protocol-fido-alliance/",
				publisher: "Google",
			},
			{
				id: "x402",
				name: "x402",
				status: "reference",
				metric: "HTTP 402 · machine-readable payment flow",
				flow: ["Agent request", "402 payment terms", "Signed payment", "Resource unlocked"],
				why: "Lets software pay software without a human checkout screen for each tiny transaction.",
				reality: "Useful machine-payment infrastructure still needs scoped wallets, limits and recovery controls.",
				source: "https://docs.cdp.coinbase.com/x402/welcome",
				publisher: "Coinbase Developer Platform",
			},
		],
	},
] as const;

const statusClasses: Record<LectureSource["status"], string> = {
	reference: "border-zinc-400/30 bg-zinc-400/10 text-zinc-200",
	poc: "border-sky-400/35 bg-sky-400/10 text-sky-200",
	pilot: "border-amber-300/40 bg-amber-300/10 text-amber-200",
	prototype: "border-violet-400/40 bg-violet-400/10 text-violet-200",
	prelaunch: "border-blue-400/40 bg-blue-400/10 text-blue-200",
	deployment: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
	production: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
	closed: "border-rose-400/40 bg-rose-400/10 text-rose-200",
};

export default function IndustryRealityDemo() {
	const [sectorId, setSectorId] = useState<SectorId>("finance");
	const [caseId, setCaseId] = useState("kinexys");
	const sector = sectors.find((entry) => entry.id === sectorId) ?? sectors[0];
	const selected = sector.cases.find((entry) => entry.id === caseId) ?? sector.cases[0];

	const chooseSector = (nextSector: Sector) => {
		setSectorId(nextSector.id);
		setCaseId(nextSector.cases[0].id);
	};

	return (
		<section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0c0e] shadow-[0_30px_100px_rgba(0,0,0,0.35)]" aria-label="Interactive 2026 blockchain industry reality console">
			<div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.025] p-2" role="tablist" aria-label="Industry sectors">
				{sectors.map((entry) => {
					const Icon = entry.icon;
					const active = entry.id === sector.id;
					return (
						<button key={entry.id} type="button" role="tab" aria-selected={active} onClick={() => chooseSector(entry)} className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors sm:text-xs ${active ? "bg-amber-300 text-zinc-950" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
							<Icon className="size-4" aria-hidden="true" /> {entry.label}
						</button>
					);
				})}
			</div>

			<div className="grid lg:grid-cols-[0.72fr_1.28fr]">
				<div className="grid auto-rows-fr gap-1 border-b border-white/10 p-2 lg:border-r lg:border-b-0" aria-label={`${sector.label} examples`}>
					{sector.cases.map((entry) => {
						const active = entry.id === selected.id;
						return (
							<button key={entry.id} type="button" onClick={() => setCaseId(entry.id)} aria-pressed={active} className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3 text-left transition-colors ${active ? "border-amber-300/35 bg-amber-300/[0.07]" : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"}`}>
								<span className="text-sm font-medium text-white">{entry.name}</span>
								<span className={`rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${statusClasses[entry.status]}`}>{entry.status}</span>
							</button>
						);
					})}
				</div>

				<div className="p-4 md:p-5" aria-live="polite">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div>
							<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Primary-source check · 21 Aug 2026</p>
							<h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">{selected.name}</h3>
						</div>
						<p className="max-w-md text-right font-mono text-xs leading-5 text-amber-200">{selected.metric}</p>
					</div>

					<ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label={`${selected.name} value flow`}>
						{selected.flow.map((step, index) => (
							<li key={step} className="relative rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-xs leading-5 text-zinc-200">
								<span className="mb-1 block font-mono text-[9px] text-amber-300">0{index + 1}</span>
								{step}
								{index < selected.flow.length - 1 ? <ArrowRight className="absolute -right-2.5 top-1/2 z-10 hidden size-4 -translate-y-1/2 rounded-full bg-[#0b0c0e] text-zinc-600 sm:block" aria-hidden="true" /> : null}
							</li>
						))}
					</ol>

					<div className="mt-4 grid gap-2 sm:grid-cols-2">
						<div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.045] p-3">
							<p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-emerald-300"><ShieldCheck className="size-3.5" /> Why blockchain?</p>
							<p className="mt-1 text-xs leading-5 text-zinc-300">{selected.why}</p>
						</div>
						<div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.045] p-3">
							<p className="font-mono text-[9px] uppercase tracking-[0.15em] text-amber-200">Founder&apos;s reality check</p>
							<p className="mt-1 text-xs leading-5 text-zinc-300">{selected.reality}</p>
						</div>
					</div>

					<a href={selected.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-8 items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500 transition-colors hover:text-amber-200 focus-visible:text-amber-200">
						<ExternalLink className="size-3" aria-hidden="true" /> Primary source · {selected.publisher}
					</a>
				</div>
			</div>
		</section>
	);
}
