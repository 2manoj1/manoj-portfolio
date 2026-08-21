"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ExternalLink, FlaskConical, MonitorPlay, ImageIcon, Sparkles, Layers, Maximize2, X } from "lucide-react";
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

function FullscreenLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl" role="dialog" aria-modal="true">
			<div className="relative flex max-h-[92vh] max-w-7xl flex-col items-center overflow-hidden rounded-3xl border border-amber-400/50 bg-zinc-950 p-4 shadow-[0_0_90px_rgba(251,191,36,0.25)]">
				<div className="flex w-full items-center justify-between border-b border-white/10 pb-3">
					<div className="flex items-center gap-2">
						<Sparkles className="size-4 text-amber-300" />
						<span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
							Systems Architecture Infographic
						</span>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-full bg-white/10 p-2 text-zinc-400 transition hover:bg-white/20 hover:text-white"
						aria-label="Close image">
						<X className="size-5" />
					</button>
				</div>
				<div className="relative mt-3 max-h-[78vh] w-full overflow-auto rounded-2xl">
					<Image
						src={src}
						alt={alt}
						width={1920}
						height={1080}
						className="h-auto w-full rounded-2xl object-contain shadow-2xl"
						priority
					/>
				</div>
				<p className="mt-2 text-center font-mono text-xs text-zinc-400">{alt}</p>
			</div>
		</div>
	);
}

function Hero({ scene }: { scene: HeroScene }) {
	return (
		<div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden rounded-3xl text-center py-6">
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
					<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,10,0.35),rgba(7,8,10,0.65)_45%,rgba(7,8,10,0.94))]" />
				</>
			) : null}
			<div className="relative z-10 flex w-full flex-col items-center justify-center px-5 py-6">
				{scene.eyebrow ? (
					<p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-300 md:text-sm font-semibold">
						{scene.eyebrow}
					</p>
				) : null}
				<h1 className="mt-4 max-w-[16ch] text-balance font-display text-[clamp(2.8rem,7vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.05em] text-white">
					{scene.title}
				</h1>
				{scene.lines?.length ? (
					<div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[clamp(0.85rem,1.4vw,1.15rem)] uppercase tracking-[0.18em] text-amber-200">
						{scene.lines.map((line) => (
							<span key={line} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md shadow-md">
								{line}
							</span>
						))}
					</div>
				) : null}
				{scene.callout ? (
					<p className="mt-6 max-w-4xl text-balance text-[clamp(1rem,1.6vw,1.35rem)] leading-relaxed text-zinc-300">
						{scene.callout}
					</p>
				) : null}
			</div>
		</div>
	);
}

function Diagram({ scene }: { scene: DiagramScene }) {
	const [viewMode, setViewMode] = useState<"diagram" | "infographic">("diagram");
	const [fullscreen, setFullscreen] = useState(false);

	return (
		<div className="flex min-h-full flex-col justify-center py-3">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
				{scene.eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-300">{scene.eyebrow}</p> : <div />}
				{scene.image ? (
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setViewMode("infographic")}
							className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 font-mono text-xs font-bold transition ${
								viewMode === "infographic"
									? "bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/30"
									: "border border-white/15 text-zinc-300 hover:border-white/30"
							}`}>
							<ImageIcon className="size-3.5" /> Concept Infographic
						</button>
						<button
							type="button"
							onClick={() => setViewMode("diagram")}
							className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 font-mono text-xs font-bold transition ${
								viewMode === "diagram"
									? "bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/30"
									: "border border-white/15 text-zinc-300 hover:border-white/30"
							}`}>
							<Layers className="size-3.5" /> Interactive Steps
						</button>
					</div>
				) : null}
			</div>

			<h2 className="mx-auto mt-2 max-w-[22ch] text-balance text-center font-display text-[clamp(2rem,4vw,4.2rem)] font-bold leading-[0.98] tracking-[-0.04em] text-white">
				{scene.title}
			</h2>

			<div className="mt-4">
				{viewMode === "infographic" && scene.image ? (
					<div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-amber-300/40 bg-black/60 shadow-[0_0_80px_rgba(251,191,36,0.15)] group">
						<div className="relative h-[380px] sm:h-[420px] md:h-[460px] w-full">
							<Image
								src={scene.image.src}
								alt={scene.image.alt}
								fill
								sizes="(max-width: 1200px) 100vw, 1200px"
								className="object-contain"
								priority
							/>
						</div>
						<button
							type="button"
							onClick={() => setFullscreen(true)}
							className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold text-amber-300 opacity-90 transition hover:bg-black hover:opacity-100 hover:scale-105 border border-white/20">
							<Maximize2 className="size-3.5" /> Fullscreen View
						</button>
					</div>
				) : (
					<ArchitectureDiagram diagramId={scene.diagramId} />
				)}
			</div>

			{scene.callout ? <p className="mt-3 text-center font-mono text-xs uppercase tracking-[0.16em] text-amber-200">{scene.callout}</p> : null}

			{fullscreen && scene.image && (
				<FullscreenLightbox src={scene.image.src} alt={scene.image.alt} onClose={() => setFullscreen(false)} />
			)}
		</div>
	);
}

function Statement({ scene }: { scene: StatementScene }) {
	const [fullscreen, setFullscreen] = useState(false);

	return (
		<div className="flex min-h-full flex-col justify-center py-4">
			{scene.eyebrow ? <p className="text-center font-mono text-xs uppercase tracking-[0.22em] text-amber-300">{scene.eyebrow}</p> : null}

			<h2 className="mt-2 text-center font-display text-[clamp(2.3rem,5vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.045em] text-white">
				{scene.title}
			</h2>

			{/* Direct Split Layout: Statement + Direct Embedded Infographic Image */}
			{scene.image ? (
				<div className="mt-5 grid items-center gap-6 lg:grid-cols-[1.1fr_1.4fr]">
					<div className="flex flex-col justify-center text-left">
						<p className="text-[clamp(1.1rem,2vw,1.8rem)] font-medium leading-snug text-zinc-200">
							{scene.statement}
						</p>
						{scene.fragments?.length ? (
							<div className="mt-6 flex flex-wrap gap-2">
								{scene.fragments.map((fragment) => (
									<span key={fragment} className="rounded-full border border-amber-300/30 bg-amber-300/[0.08] px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-amber-100 shadow-md">
										{fragment}
									</span>
								))}
							</div>
						) : null}
					</div>

					<div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-black/60 shadow-[0_0_70px_rgba(251,191,36,0.15)] group">
						<div className="relative h-[280px] sm:h-[320px] md:h-[360px] w-full">
							<Image
								src={scene.image.src}
								alt={scene.image.alt}
								fill
								sizes="(max-width: 1024px) 100vw, 700px"
								className="object-contain"
								priority
							/>
						</div>
						<button
							type="button"
							onClick={() => setFullscreen(true)}
							className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 font-mono text-[10px] uppercase font-bold text-amber-300 opacity-90 transition hover:opacity-100 hover:scale-105 border border-white/20">
							<Maximize2 className="size-3" /> Fullscreen
						</button>
					</div>
				</div>
			) : (
				<div className="mx-auto flex max-w-5xl flex-col items-center text-center">
					<p className="mt-6 max-w-5xl text-balance text-[clamp(1.2rem,2.3vw,2.2rem)] leading-snug text-zinc-300">
						{scene.statement}
					</p>
					{scene.fragments?.length ? (
						<div className="mt-8 flex flex-wrap justify-center gap-2.5">
							{scene.fragments.map((fragment) => (
								<span key={fragment} className="rounded-full border border-amber-300/30 bg-amber-300/[0.08] px-5 py-2 font-mono text-xs uppercase tracking-wider text-amber-100 shadow-md">
									{fragment}
								</span>
							))}
						</div>
					) : null}
				</div>
			)}

			{fullscreen && scene.image && (
				<FullscreenLightbox src={scene.image.src} alt={scene.image.alt} onClose={() => setFullscreen(false)} />
			)}
		</div>
	);
}

function Cards({ scene }: { scene: CardsScene }) {
	const [fullscreen, setFullscreen] = useState(false);

	return (
		<div className="flex min-h-full flex-col justify-center py-3">
			{scene.eyebrow ? <p className="text-center font-mono text-xs uppercase tracking-[0.22em] text-amber-300">{scene.eyebrow}</p> : null}
			<h2 className="mx-auto mt-2 max-w-[20ch] text-balance text-center font-display text-[clamp(2.1rem,4.2vw,4.6rem)] font-bold leading-[0.96] tracking-[-0.04em] text-white">
				{scene.title}
			</h2>

			{/* If scene has an image (e.g. BCA Systems Roadmap), render image on left & cards on right! */}
			{scene.image ? (
				<div className="mt-5 grid items-center gap-5 lg:grid-cols-[1.3fr_1.1fr]">
					<div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-black/60 shadow-[0_0_70px_rgba(251,191,36,0.15)] group">
						<div className="relative h-[340px] sm:h-[380px] md:h-[420px] w-full">
							<Image
								src={scene.image.src}
								alt={scene.image.alt}
								fill
								sizes="(max-width: 1024px) 100vw, 700px"
								className="object-contain"
								priority
							/>
						</div>
						<button
							type="button"
							onClick={() => setFullscreen(true)}
							className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 font-mono text-[10px] uppercase font-bold text-amber-300 opacity-90 transition hover:opacity-100 hover:scale-105 border border-white/20">
							<Maximize2 className="size-3" /> Fullscreen
						</button>
					</div>

					<div className="grid gap-2.5 sm:grid-cols-2">
						{scene.items.map((item, index) => (
							<article key={item.title} className="rounded-2xl border border-white/15 bg-white/[0.035] p-3.5 backdrop-blur-sm transition hover:border-amber-400/50 hover:bg-white/[0.06]">
								<div className="flex items-center justify-between gap-2">
									<p className="font-mono text-xs font-bold text-amber-300">{String(index + 1).padStart(2, "0")}</p>
									{item.status ? <span className="rounded-full border border-white/10 bg-black/50 px-2 py-0.5 font-mono text-[8px] uppercase text-zinc-300">{item.status}</span> : null}
								</div>
								<h3 className="mt-1.5 text-sm font-bold text-white leading-snug">{item.title}</h3>
								<p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{item.detail}</p>
							</article>
						))}
					</div>
				</div>
			) : (
				<div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
					{scene.items.map((item, index) => (
						<article key={item.title} className="rounded-3xl border border-white/15 bg-white/[0.035] p-5.5 backdrop-blur-sm transition-all hover:border-amber-400/50 hover:bg-white/[0.06]">
							<div className="flex items-center justify-between gap-3">
								<p className="font-mono text-xs font-bold text-amber-300">{String(index + 1).padStart(2, "0")}</p>
								{item.status ? <span className="rounded-full border border-white/10 bg-black/50 px-2.5 py-0.5 font-mono text-[9px] uppercase text-zinc-300">{item.status}</span> : null}
							</div>
							<h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
							<p className="mt-1.5 text-xs leading-relaxed text-zinc-300">{item.detail}</p>
						</article>
					))}
				</div>
			)}

			{scene.callout ? <p className="mt-3 text-center text-xs font-semibold text-amber-200">{scene.callout}</p> : null}

			{fullscreen && scene.image && (
				<FullscreenLightbox src={scene.image.src} alt={scene.image.alt} onClose={() => setFullscreen(false)} />
			)}
		</div>
	);
}

function Comparison({ scene }: { scene: ComparisonScene }) {
	const [viewMode, setViewMode] = useState<"comparison" | "infographic">("comparison");
	const [fullscreen, setFullscreen] = useState(false);

	return (
		<div className="flex min-h-full flex-col justify-center py-4">
			<div className="flex items-center justify-between border-b border-white/10 pb-2">
				{scene.eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">{scene.eyebrow}</p> : <div />}
				{scene.image ? (
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setViewMode("infographic")}
							className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 font-mono text-xs font-bold transition ${
								viewMode === "infographic"
									? "bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/30"
									: "border border-white/15 text-zinc-300 hover:border-white/30"
							}`}>
							<ImageIcon className="size-3.5" /> Concept Infographic
						</button>
						<button
							type="button"
							onClick={() => setViewMode("comparison")}
							className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 font-mono text-xs font-bold transition ${
								viewMode === "comparison"
									? "bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/30"
									: "border border-white/15 text-zinc-300 hover:border-white/30"
							}`}>
							<Layers className="size-3.5" /> Comparison Cards
						</button>
					</div>
				) : null}
			</div>

			<h2 className="mt-2 text-center font-display text-[clamp(2.2rem,4.5vw,4.8rem)] font-bold leading-none tracking-[-0.04em] text-white">{scene.title}</h2>

			{viewMode === "infographic" && scene.image ? (
				<div className="relative mx-auto mt-4 max-w-5xl overflow-hidden rounded-3xl border border-amber-300/40 bg-black/60 shadow-[0_0_80px_rgba(251,191,36,0.15)] group">
					<div className="relative h-[360px] sm:h-[400px] md:h-[440px] w-full">
						<Image
							src={scene.image.src}
							alt={scene.image.alt}
							fill
							sizes="(max-width: 1200px) 100vw, 1200px"
							className="object-contain"
							priority
						/>
					</div>
					<button
						type="button"
						onClick={() => setFullscreen(true)}
						className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold text-amber-300 opacity-90 transition hover:bg-black hover:opacity-100 hover:scale-105 border border-white/20">
						<Maximize2 className="size-3.5" /> Fullscreen View
					</button>
				</div>
			) : (
				<div className="mt-6 grid gap-5 lg:grid-cols-2">
					{[scene.left, scene.right].map((side, sideIndex) => (
						<div key={side.label} className={`rounded-3xl border p-6 md:p-8 ${sideIndex === 1 ? "border-amber-300/40 bg-amber-300/[0.055] shadow-[0_0_50px_rgba(251,191,36,0.06)]" : "border-white/15 bg-white/[0.03]"}`}>
							<p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">{side.label}</p>
							<div className="mt-4 flex flex-wrap items-center gap-2">
								{side.steps.map((step, index) => (
									<span key={`${side.label}-${index}-${step}`} className="contents">
										<span className="rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-semibold text-zinc-100">{step}</span>
										{index < side.steps.length - 1 ? <ArrowRight className="size-4 text-zinc-500" /> : null}
									</span>
								))}
							</div>
							<p className="mt-5 text-sm leading-relaxed text-zinc-300">{side.caption}</p>
						</div>
					))}
				</div>
			)}

			{fullscreen && scene.image && (
				<FullscreenLightbox src={scene.image.src} alt={scene.image.alt} onClose={() => setFullscreen(false)} />
			)}
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
	const [fullscreen, setFullscreen] = useState(false);

	return (
		<div className="flex min-h-full flex-col justify-center py-4">
			{scene.eyebrow ? <p className="text-center font-mono text-xs uppercase tracking-[0.22em] text-amber-300">{scene.eyebrow}</p> : null}
			<h2 className="mx-auto mt-2 max-w-[20ch] text-balance text-center font-display text-[clamp(2.2rem,4.5vw,4.8rem)] font-bold leading-[0.98] tracking-[-0.04em] text-white">{scene.title}</h2>
			<div className={`mx-auto mt-6 grid w-full max-w-6xl gap-4 ${scene.items.length > 2 ? "sm:grid-cols-2" : ""}`}>
				{scene.items.map((item) => {
					const source = sources.find((entry) => entry.id === item.sourceId);
					return (
						<article key={`${item.title}-${item.status}`} className="rounded-3xl border border-white/15 bg-white/[0.035] p-6 backdrop-blur-sm">
							<span className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider font-bold ${statusClasses[item.status]}`}>{item.status}</span>
							<h3 className="mt-3 text-xl font-bold text-white">{item.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.detail}</p>
							{source ? (
								<a href={source.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200">
									<ExternalLink className="size-3" /> {source.publisher} · Verify source
								</a>
							) : null}
						</article>
					);
				})}
			</div>

			{fullscreen && scene.image && (
				<FullscreenLightbox src={scene.image.src} alt={scene.image.alt} onClose={() => setFullscreen(false)} />
			)}
		</div>
	);
}

function Demo({ scene }: { scene: Extract<LectureScene, { kind: "demo" }> }) {
	const guide = demoGuides[scene.demoId] ?? ["Explore simulation", "Test parameters", "Observe results"];
	const [viewMode, setViewMode] = useState<"lab" | "infographic">("lab");
	const [fullscreen, setFullscreen] = useState(false);

	return (
		<div className="flex min-h-full flex-col justify-center py-2">
			{/* Sleek Header with View Mode Switcher when Image is Available */}
			<div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
				<div className="flex items-center gap-3">
					<div className="grid size-8 place-items-center rounded-xl bg-amber-400/20 text-amber-300">
						<FlaskConical className="size-4" />
					</div>
					<div>
						<h2 className="font-display text-lg font-bold text-white sm:text-xl">
							{scene.title}
						</h2>
						{scene.callout ? <p className="font-mono text-xs text-amber-200/90">{scene.callout}</p> : null}
					</div>
				</div>

				<div className="flex items-center gap-2">
					{scene.image ? (
						<div className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/50 p-1">
							<button
								type="button"
								onClick={() => setViewMode("lab")}
								className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition ${
									viewMode === "lab"
										? "bg-amber-400 text-zinc-950 shadow-md"
										: "text-zinc-400 hover:text-white"
								}`}>
								<FlaskConical className="size-3.5" /> Interactive Lab
							</button>
							<button
								type="button"
								onClick={() => setViewMode("infographic")}
								className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition ${
									viewMode === "infographic"
										? "bg-amber-400 text-zinc-950 shadow-md"
										: "text-zinc-400 hover:text-white"
								}`}>
								<ImageIcon className="size-3.5" /> Concept Infographic
							</button>
						</div>
					) : null}

					<div className="hidden items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300 sm:flex font-mono">
						<MonitorPlay className="size-3.5" />
						<span>Local classroom simulation</span>
					</div>
				</div>
			</div>

			{/* Main Body: Either the Interactive Lab or the High-Res Infographic Image */}
			<div className="flex-1 min-h-0">
				{viewMode === "infographic" && scene.image ? (
					<div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-amber-300/40 bg-black/60 shadow-[0_0_80px_rgba(251,191,36,0.15)] group">
						<div className="relative h-[380px] sm:h-[420px] md:h-[460px] w-full">
							<Image
								src={scene.image.src}
								alt={scene.image.alt}
								fill
								sizes="(max-width: 1200px) 100vw, 1200px"
								className="object-contain"
								priority
							/>
						</div>
						<button
							type="button"
							onClick={() => setFullscreen(true)}
							className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold text-amber-300 opacity-90 transition hover:bg-black hover:opacity-100 hover:scale-105 border border-white/20">
							<Maximize2 className="size-3.5" /> Fullscreen View
						</button>
					</div>
				) : (
					<>
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
					</>
				)}
			</div>

			{/* Subtle Bottom Steps Guide */}
			<div className="mt-2.5 flex items-center justify-between font-mono text-[10px] uppercase text-zinc-500">
				<span className="flex items-center gap-2">
					<span className="size-1.5 rounded-full bg-amber-400" />
					Flow: {guide.join(" → ")}
				</span>
				<span className="hidden sm:inline">Interactive Classroom Mode</span>
			</div>

			{fullscreen && scene.image && (
				<FullscreenLightbox src={scene.image.src} alt={scene.image.alt} onClose={() => setFullscreen(false)} />
			)}
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
	"qr-takeaway": ["Scan mobile QR code", "Open live lecture on phone", "Connect on LinkedIn"],
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
