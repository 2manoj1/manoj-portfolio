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
const SharedLedgerDemo = dynamic(
	() => import("@/components/lectures/demos/shared-ledger-demo"),
	{ loading: () => <DemoLoading /> },
);
const IntegrityLab = dynamic(
	() => import("@/components/lectures/demos/integrity-lab"),
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
					<Image src={scene.image.src} alt={scene.image.alt} fill sizes="100vw" preload={scene.image.preload} className="object-cover opacity-80" />
					<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.22),rgba(8,8,10,0.5)_48%,rgba(8,8,10,0.9))]" />
				</>
			) : null}
			<div className="relative z-10 flex w-full flex-col items-center justify-center px-5 py-10">
			{scene.eyebrow ? (
				<p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-300 md:text-sm">
					{scene.eyebrow}
				</p>
			) : null}
			<h1 className="mt-5 max-w-[15ch] text-balance font-display text-[clamp(3.2rem,8vw,8.8rem)] font-medium leading-[0.86] tracking-[-0.055em] text-white">
				{scene.title}
			</h1>
			{scene.lines?.length ? (
				<div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[clamp(0.8rem,1.45vw,1.15rem)] uppercase tracking-[0.18em] text-zinc-400">
					{scene.lines.map((line) => (
						<span key={line}>{line}</span>
					))}
				</div>
			) : null}
			{scene.callout ? (
				<p className="mt-10 max-w-4xl text-balance text-[clamp(1rem,1.7vw,1.45rem)] leading-relaxed text-zinc-300">
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
			<h2 className="mx-auto mt-4 max-w-[20ch] text-balance text-center font-display text-[clamp(2.4rem,4.8vw,5.5rem)] leading-[0.98] tracking-[-0.04em] text-white">{scene.title}</h2>
			<div className="mt-7">
				<ArchitectureDiagram diagramId={scene.diagramId} />
			</div>
			{scene.callout ? <p className="mt-5 text-center font-mono text-xs uppercase tracking-[0.16em] text-amber-200">{scene.callout}</p> : null}
		</div>
	);
}

function Statement({ scene }: { scene: StatementScene }) {
	return (
		<div className="flex h-full flex-col items-center justify-center text-center">
			{scene.eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-300">{scene.eyebrow}</p> : null}
			<h2 className="mt-5 max-w-[17ch] text-balance font-display text-[clamp(2.7rem,6.5vw,7.5rem)] leading-[0.92] tracking-[-0.045em] text-white">
				{scene.title}
			</h2>
			<p className="mt-8 max-w-5xl text-balance text-[clamp(1.3rem,2.6vw,2.45rem)] leading-snug text-zinc-300">
				{scene.statement}
			</p>
			{scene.fragments?.length ? (
				<div className="mt-10 flex flex-wrap justify-center gap-2">
					{scene.fragments.map((fragment) => (
						<span key={fragment} className="rounded-full border border-amber-300/25 bg-amber-300/[0.06] px-4 py-2 font-mono text-xs uppercase tracking-wider text-amber-100">
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
			<h2 className="mx-auto mt-4 max-w-[19ch] text-balance text-center font-display text-[clamp(2.5rem,5vw,5.8rem)] leading-[0.96] tracking-[-0.04em] text-white">{scene.title}</h2>
			<div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{scene.items.map((item, index) => (
					<article key={item.title} className="rounded-2xl border border-white/15 bg-white/[0.035] p-5">
						<div className="flex items-center justify-between gap-3">
							<p className="font-mono text-xs text-amber-300">{String(index + 1).padStart(2, "0")}</p>
							{item.status ? <span className="font-mono text-[10px] uppercase text-zinc-500">{item.status}</span> : null}
						</div>
						<h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
						<p className="mt-2 text-sm leading-6 text-zinc-400">{item.detail}</p>
					</article>
				))}
			</div>
			{scene.callout ? <p className="mt-6 text-center text-base text-amber-100">{scene.callout}</p> : null}
		</div>
	);
}

function Comparison({ scene }: { scene: ComparisonScene }) {
	return (
		<div className="flex h-full flex-col justify-center">
			<h2 className="text-center font-display text-[clamp(2.5rem,5vw,5.8rem)] leading-none tracking-[-0.04em] text-white">{scene.title}</h2>
			<div className="mt-8 grid gap-4 lg:grid-cols-2">
				{[scene.left, scene.right].map((side, sideIndex) => (
					<div key={side.label} className={`rounded-3xl border p-5 md:p-7 ${sideIndex === 1 ? "border-amber-300/40 bg-amber-300/[0.055]" : "border-white/15 bg-white/[0.03]"}`}>
						<p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">{side.label}</p>
						<div className="mt-5 flex flex-wrap items-center gap-2">
							{side.steps.map((step, index) => (
								<span key={`${side.label}-${index}-${step}`} className="contents">
									<span className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-100">{step}</span>
									{index < side.steps.length - 1 ? <ArrowRight className="size-4 text-zinc-600" /> : null}
								</span>
							))}
						</div>
						<p className="mt-6 text-base leading-7 text-zinc-400">{side.caption}</p>
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
			<h2 className="mx-auto mt-4 max-w-[20ch] text-balance text-center font-display text-[clamp(2.4rem,4.8vw,5.5rem)] leading-[0.98] tracking-[-0.04em] text-white">{scene.title}</h2>
			<div className={`mx-auto mt-8 grid w-full max-w-6xl gap-3 ${scene.items.length > 2 ? "sm:grid-cols-2" : ""}`}>
				{scene.items.map((item) => {
					const source = sources.find((entry) => entry.id === item.sourceId);
					return (
						<article key={`${item.title}-${item.status}`} className="rounded-2xl border border-white/15 bg-white/[0.035] p-5">
							<span className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${statusClasses[item.status]}`}>{item.status}</span>
							<h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
							<p className="mt-2 text-sm leading-6 text-zinc-400">{item.detail}</p>
							{source ? <a href={source.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-amber-200"><ExternalLink className="size-3" /> {source.publisher}</a> : null}
						</article>
					);
				})}
			</div>
		</div>
	);
}

function Demo({ scene }: { scene: Extract<LectureScene, { kind: "demo" }> }) {
	const guide = demoGuides[scene.demoId];
	return (
		<div className="flex h-full flex-col justify-center">
			<div className="mb-3 flex flex-wrap items-end justify-between gap-3">
				<div>
					<p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-amber-300"><FlaskConical className="size-4" /> Live lab · runs inside this slide</p>
					<h2 className="mt-2 font-display text-[clamp(2rem,3.5vw,4.2rem)] leading-none tracking-[-0.035em] text-white">{scene.title}</h2>
				</div>
				<div className="flex max-w-xl items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.045] px-4 py-3">
					<MonitorPlay className="size-5 shrink-0 text-emerald-300" />
					<div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-200">No tab switch · no external network</p>{scene.callout ? <p className="mt-1 text-xs leading-5 text-zinc-400">{scene.callout}</p> : null}</div>
				</div>
			</div>
			<ol className="mb-4 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]" aria-label="Live demonstration sequence">
				{guide.map((step, index) => <li key={step} className="flex min-h-11 items-center gap-2 border-r border-white/10 px-3 last:border-r-0"><span className="font-mono text-[10px] text-amber-300">0{index + 1}</span><span className="truncate text-xs text-zinc-300 sm:text-sm">{step}</span></li>)}
			</ol>
			{scene.demoId === "shared-ledger" ? <SharedLedgerDemo /> : null}
			{scene.demoId === "hash" ? <HashDemo /> : null}
			{scene.demoId === "integrity" ? <IntegrityLab /> : null}
			{scene.demoId === "smart-contract" ? <SmartContractDemo /> : null}
			{scene.demoId === "supply-chain" ? <SupplyChainJourney /> : null}
			{scene.demoId === "web-evolution" ? <WebEvolutionDemo /> : null}
			{scene.demoId === "signature" ? <SignatureDemo /> : null}
			{scene.demoId === "ai-convergence" ? <AiConvergenceDemo /> : null}
			{scene.demoId === "industry-reality" ? <IndustryRealityDemo /> : null}
		</div>
	);
}

const demoGuides: Record<Extract<LectureScene, { kind: "demo" }>["demoId"], readonly [string, string, string]> = {
	"shared-ledger": ["Predict the copies", "Broadcast the record", "Change one copy"],
	hash: ["Predict the fingerprint", "Edit one character", "Compare the pattern"],
	integrity: ["Confirm the green chain", "Tamper with history", "Restore trust"],
	"smart-contract": ["Read the rule", "Toggle one condition", "Explain the decision"],
	"supply-chain": ["Select a handoff", "Tamper the quantity", "Restore the journey"],
	"web-evolution": ["Choose an era", "Inspect who controls", "Compare the tradeoff"],
	signature: ["Sign the original", "Edit the message", "Verify again"],
	"ai-convergence": ["Give the intent", "Scope authority", "Settle and prove"],
	"industry-reality": ["Choose a sector", "Inspect the maturity", "Challenge the claim"],
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
