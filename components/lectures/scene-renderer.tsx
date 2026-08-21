"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowRight, ExternalLink, FlaskConical, MonitorPlay } from "lucide-react";
import { ArchitectureDiagram } from "@/components/lectures/diagrams/architecture-diagram";
import { InteractiveFlow } from "@/components/lectures/interactive-flow";
import { InteractiveQuestion } from "@/components/lectures/interactive-question";
import type {
	CardsScene,
	ComparisonScene,
	DiagramScene,
	HeroScene,
	LectureScene,
	LectureSource,
	SourcesScene,
	StatementScene,
} from "@/lib/lectures/types";

const HashDemo = dynamic(() => import("@/components/lectures/demos/hash-demo"), {
	loading: () => <DemoLoading />,
});
const TrustProblemDemo = dynamic(
	() => import("@/components/lectures/demos/trust-problem-demo"),
	{ loading: () => <DemoLoading /> },
);
const SharedLedgerDemo = dynamic(
	() => import("@/components/lectures/demos/shared-ledger-demo"),
	{ loading: () => <DemoLoading /> },
);
const IntegrityLab = dynamic(
	() => import("@/components/lectures/demos/integrity-lab"),
	{ loading: () => <DemoLoading /> },
);
const ConsensusFlowDemo = dynamic(
	() => import("@/components/lectures/demos/consensus-flow-demo"),
	{ loading: () => <DemoLoading /> },
);
const SmartContractDemo = dynamic(
	() => import("@/components/lectures/demos/smart-contract-demo"),
	{ loading: () => <DemoLoading /> },
);
const SupplyChainJourney = dynamic(
	() => import("@/components/lectures/demos/supply-chain-journey"),
	{ loading: () => <DemoLoading /> },
);
const EnterpriseArchFlowDemo = dynamic(
	() => import("@/components/lectures/demos/enterprise-arch-flow-demo"),
	{ loading: () => <DemoLoading /> },
);
const DecisionTreeDemo = dynamic(
	() => import("@/components/lectures/demos/decision-tree-demo"),
	{ loading: () => <DemoLoading /> },
);
const EcosystemRadialDemo = dynamic(
	() => import("@/components/lectures/demos/ecosystem-radial-demo"),
	{ loading: () => <DemoLoading /> },
);
const WebEvolutionDemo = dynamic(
	() => import("@/components/lectures/demos/web-evolution-demo"),
	{ loading: () => <DemoLoading /> },
);
const AiConvergenceDemo = dynamic(
	() => import("@/components/lectures/demos/ai-convergence-demo"),
	{ loading: () => <DemoLoading /> },
);
const SignatureDemo = dynamic(
	() => import("@/components/lectures/demos/signature-demo"),
	{ loading: () => <DemoLoading /> },
);
const IndustryRealityDemo = dynamic(
	() => import("@/components/lectures/demos/industry-reality-demo"),
	{ loading: () => <DemoLoading /> },
);
const QrTakeawayDemo = dynamic(
	() => import("@/components/lectures/demos/qr-takeaway-demo"),
	{ loading: () => <DemoLoading /> },
);

function DemoLoading() {
	return (
		<div className="grid min-h-64 place-items-center rounded-3xl border border-white/10 bg-white/[0.025] font-mono text-sm uppercase tracking-widest text-zinc-500">
			Preparing local simulation…
		</div>
	);
}

function Hero({ scene }: { scene: HeroScene }) {
	return (
		<div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-3xl text-center">
			{scene.image ? (
				<>
					<Image
						src={scene.image.src}
						alt={scene.image.alt}
						fill
						sizes="100vw"
						priority={scene.image.preload}
						className="object-cover opacity-75"
					/>
					<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,10,0.3),rgba(7,8,10,0.6)_45%,rgba(7,8,10,0.92))]" />
				</>
			) : null}
			<div className="relative z-10 flex w-full flex-col items-center justify-center px-5 py-10">
				{scene.eyebrow ? (
					<p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-300 md:text-sm">
						{scene.eyebrow}
					</p>
				) : null}
				<h1 className="mt-5 max-w-[16ch] text-balance font-display text-[clamp(3.2rem,8vw,8.5rem)] font-medium leading-[0.88] tracking-[-0.055em] text-white">
					{scene.title}
				</h1>
				{scene.lines?.length ? (
					<div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[clamp(0.8rem,1.45vw,1.15rem)] uppercase tracking-[0.18em] text-amber-200">
						{scene.lines.map((line) => (
							<span key={line} className="rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-1.5 backdrop-blur-md">
								{line}
							</span>
						))}
					</div>
				) : null}
				{scene.callout ? (
					<p className="mt-8 max-w-4xl text-balance text-[clamp(1rem,1.7vw,1.45rem)] leading-relaxed text-zinc-300">
						{scene.callout}
					</p>
				) : null}
			</div>
		</div>
	);
}

function Diagram({ scene }: { scene: DiagramScene }) {
	return (
		<div className="flex h-full flex-col justify-center">
			{scene.eyebrow ? <p className="text-center font-mono text-xs uppercase tracking-[0.22em] text-amber-300">{scene.eyebrow}</p> : null}
			<h2 className="mx-auto mt-3 max-w-[22ch] text-balance text-center font-display text-[clamp(2.2rem,4.5vw,5rem)] leading-[0.98] tracking-[-0.04em] text-white">
				{scene.title}
			</h2>
			<div className="mt-6">
				<ArchitectureDiagram diagramId={scene.diagramId} />
			</div>
			{scene.callout ? <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.16em] text-amber-200">{scene.callout}</p> : null}
		</div>
	);
}

function Statement({ scene }: { scene: StatementScene }) {
	return (
		<div className="flex h-full flex-col items-center justify-center text-center">
			{scene.eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-300">{scene.eyebrow}</p> : null}
			<h2 className="mt-5 max-w-[18ch] text-balance font-display text-[clamp(2.7rem,6.5vw,7.5rem)] leading-[0.92] tracking-[-0.045em] text-white">
				{scene.title}
			</h2>
			<p className="mt-8 max-w-5xl text-balance text-[clamp(1.3rem,2.6vw,2.45rem)] leading-snug text-zinc-300">
				{scene.statement}
			</p>
			{scene.fragments?.length ? (
				<div className="mt-10 flex flex-wrap justify-center gap-2">
					{scene.fragments.map((fragment) => (
						<span key={fragment} className="rounded-full border border-amber-300/25 bg-amber-300/[0.06] px-5 py-2 font-mono text-xs uppercase tracking-wider text-amber-100 shadow-sm">
							{fragment}
						</span>
					))}
				</div>
			) : null}
		</div>
	);
}

function Cards({ scene }: { scene: CardsScene }) {
	return (
		<div className="flex h-full flex-col justify-center">
			{scene.eyebrow ? <p className="text-center font-mono text-xs uppercase tracking-[0.22em] text-amber-300">{scene.eyebrow}</p> : null}
			<h2 className="mx-auto mt-3 max-w-[20ch] text-balance text-center font-display text-[clamp(2.3rem,4.8vw,5.5rem)] leading-[0.96] tracking-[-0.04em] text-white">
				{scene.title}
			</h2>
			<div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
				{scene.items.map((item, index) => (
					<article key={item.title} className="rounded-3xl border border-white/15 bg-white/[0.035] p-5.5 backdrop-blur-sm transition-all hover:border-amber-400/40">
						<div className="flex items-center justify-between gap-3">
							<p className="font-mono text-xs font-bold text-amber-300">{String(index + 1).padStart(2, "0")}</p>
							{item.status ? <span className="rounded-full border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[9px] uppercase text-zinc-400">{item.status}</span> : null}
						</div>
						<h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
						<p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.detail}</p>
					</article>
				))}
			</div>
			{scene.callout ? <p className="mt-5 text-center text-sm font-semibold text-amber-200">{scene.callout}</p> : null}
		</div>
	);
}

function Comparison({ scene }: { scene: ComparisonScene }) {
	return (
		<div className="flex h-full flex-col justify-center">
			<h2 className="text-center font-display text-[clamp(2.3rem,4.8vw,5.5rem)] leading-none tracking-[-0.04em] text-white">{scene.title}</h2>
			<div className="mt-8 grid gap-5 lg:grid-cols-2">
				{[scene.left, scene.right].map((side, sideIndex) => (
					<div key={side.label} className={`rounded-3xl border p-6 md:p-8 ${sideIndex === 1 ? "border-amber-300/40 bg-amber-300/[0.055] shadow-[0_0_50px_rgba(251,191,36,0.06)]" : "border-white/15 bg-white/[0.03]"}`}>
						<p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">{side.label}</p>
						<div className="mt-5 flex flex-wrap items-center gap-2">
							{side.steps.map((step, index) => (
								<span key={`${side.label}-${index}-${step}`} className="contents">
									<span className="rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-sm font-medium text-zinc-100">{step}</span>
									{index < side.steps.length - 1 ? <ArrowRight className="size-4 text-zinc-600" /> : null}
								</span>
							))}
						</div>
						<p className="mt-6 text-base leading-relaxed text-zinc-300">{side.caption}</p>
					</div>
				))}
			</div>
		</div>
	);
}

const statusClasses: Record<LectureSource["status"], string> = {
	reference: "border-zinc-400/30 text-zinc-300",
	poc: "border-sky-400/40 text-sky-200",
	pilot: "border-amber-300/50 text-amber-200",
	prototype: "border-violet-400/40 text-violet-200",
	prelaunch: "border-blue-400/40 text-blue-200",
	deployment: "border-cyan-400/40 text-cyan-200",
	production: "border-emerald-400/50 text-emerald-200",
	closed: "border-rose-400/50 text-rose-200",
};

function SourceCases({ scene, sources }: { scene: SourcesScene; sources: LectureSource[] }) {
	return (
		<div className="flex h-full flex-col justify-center">
			{scene.eyebrow ? <p className="text-center font-mono text-xs uppercase tracking-[0.22em] text-amber-300">{scene.eyebrow}</p> : null}
			<h2 className="mx-auto mt-3 max-w-[20ch] text-balance text-center font-display text-[clamp(2.4rem,4.8vw,5.5rem)] leading-[0.98] tracking-[-0.04em] text-white">{scene.title}</h2>
			<div className={`mx-auto mt-7 grid w-full max-w-6xl gap-3.5 ${scene.items.length > 2 ? "sm:grid-cols-2" : ""}`}>
				{scene.items.map((item) => {
					const source = sources.find((entry) => entry.id === item.sourceId);
					return (
						<article key={`${item.title}-${item.status}`} className="rounded-3xl border border-white/15 bg-white/[0.035] p-6 backdrop-blur-sm">
							<span className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${statusClasses[item.status]}`}>{item.status}</span>
							<h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.detail}</p>
							{source ? (
								<a href={source.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-200">
									<ExternalLink className="size-3" /> {source.publisher}
								</a>
							) : null}
						</article>
					);
				})}
			</div>
		</div>
	);
}

function Demo({ scene }: { scene: Extract<LectureScene, { kind: "demo" }> }) {
	const guide = demoGuides[scene.demoId] ?? ["Explore simulation", "Test parameters", "Observe results"];
	return (
		<div className="flex h-full flex-col justify-center">
			<div className="mb-3 flex flex-wrap items-end justify-between gap-3">
				<div>
					<p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
						<FlaskConical className="size-4" /> Live Interactive Lab · Browser Engine
					</p>
					<h2 className="mt-1.5 font-display text-[clamp(1.8rem,3.2vw,3.8rem)] leading-none tracking-[-0.035em] text-white">
						{scene.title}
					</h2>
				</div>
				<div className="flex max-w-xl items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.045] px-4 py-2.5">
					<MonitorPlay className="size-5 shrink-0 text-emerald-300" />
					<div>
						<p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-200">Zero Network Lag · Web Crypto Powered</p>
						{scene.callout ? <p className="mt-0.5 text-xs text-zinc-400">{scene.callout}</p> : null}
					</div>
				</div>
			</div>

			<ol className="mb-3.5 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]" aria-label="Live demonstration sequence">
				{guide.map((step, index) => (
					<li key={step} className="flex min-h-10 items-center gap-2 border-r border-white/10 px-3 last:border-r-0">
						<span className="font-mono text-[10px] text-amber-300">0{index + 1}</span>
						<span className="truncate text-xs text-zinc-300">{step}</span>
					</li>
				))}
			</ol>

			{scene.demoId === "trust-problem" ? <TrustProblemDemo /> : null}
			{scene.demoId === "shared-ledger" ? <SharedLedgerDemo /> : null}
			{scene.demoId === "hash" ? <HashDemo /> : null}
			{scene.demoId === "integrity" ? <IntegrityLab /> : null}
			{scene.demoId === "consensus-flow" ? <ConsensusFlowDemo /> : null}
			{scene.demoId === "smart-contract" ? <SmartContractDemo /> : null}
			{scene.demoId === "supply-chain" ? <SupplyChainJourney /> : null}
			{scene.demoId === "enterprise-arch-flow" ? <EnterpriseArchFlowDemo /> : null}
			{scene.demoId === "decision-tree" ? <DecisionTreeDemo /> : null}
			{scene.demoId === "ecosystem-radial" ? <EcosystemRadialDemo /> : null}
			{scene.demoId === "web-evolution" ? <WebEvolutionDemo /> : null}
			{scene.demoId === "signature" ? <SignatureDemo /> : null}
			{scene.demoId === "ai-convergence" ? <AiConvergenceDemo /> : null}
			{scene.demoId === "industry-reality" ? <IndustryRealityDemo /> : null}
			{scene.demoId === "qr-takeaway" ? <QrTakeawayDemo /> : null}
		</div>
	);
}

const demoGuides: Record<Extract<LectureScene, { kind: "demo" }>["demoId"], readonly [string, string, string]> = {
	"trust-problem": ["Inspect 5 database silos", "Simulate record dispute", "Unify on shared ledger"],
	"shared-ledger": ["Predict the copies", "Broadcast the record", "Change one copy"],
	hash: ["Type transaction message", "Observe 32-byte avalanche", "Compare 1-digit change"],
	integrity: ["Verify 3 green blocks", "Tamper with Block #2", "Restore cryptographic chain"],
	"consensus-flow": ["Select consensus model", "Advance consensus round", "Verify 5-node agreement"],
	"smart-contract": ["Inspect agreed rules", "Toggle sensor conditions", "Observe automated settlement"],
	"supply-chain": ["Select custody handoff", "Inspect batch provenance", "Simulate quantity dispute"],
	"enterprise-arch-flow": ["User triggers request", "API routes to DB + Chain", "State committed to ledger"],
	"decision-tree": ["Evaluate 4 architecture checks", "Answer Yes or No", "Receive database vs chain verdict"],
	"ecosystem-radial": ["Select enterprise sector", "Inspect verified deployment", "Review problem-solution fit"],
	"web-evolution": ["Choose an era", "Inspect who controls", "Compare the tradeoff"],
	signature: ["Sign the original", "Edit the message", "Verify again"],
	"ai-convergence": ["Give the intent", "Scope authority", "Settle and prove"],
	"industry-reality": ["Choose a sector", "Inspect the maturity", "Challenge the claim"],
	"qr-takeaway": ["Scan mobile QR code", "Open live lecture on phone", "Break blockchain independently"],
};

export function SceneRenderer({ scene, sources }: { scene: LectureScene; sources: LectureSource[] }) {
	switch (scene.kind) {
		case "hero":
			return <Hero scene={scene} />;
		case "statement":
			return <Statement scene={scene} />;
		case "flow":
			return <InteractiveFlow scene={scene} />;
		case "cards":
			return <Cards scene={scene} />;
		case "comparison":
			return <Comparison scene={scene} />;
		case "question":
			return <InteractiveQuestion scene={scene} />;
		case "diagram":
			return <Diagram scene={scene} />;
		case "demo":
			return <Demo scene={scene} />;
		case "sources":
			return <SourceCases scene={scene} sources={sources} />;
	}
}
