import Image from "next/image";
import { AdvisoryEstimator } from "@/components/marketing/advisory-estimator";
import { LabDashboard } from "@/components/marketing/lab-dashboard";
import { OrchestrationPlayground } from "@/components/marketing/orchestration-playground";
import { SandboxDashboard } from "@/components/marketing/sandbox-dashboard";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section, SectionHeader } from "@/components/marketing/section";
import { createMetadata } from "@/lib/seo";
import {
	BookOpen,
	Boxes,
	Database,
	FileText,
	FlaskConical,
	GitBranch,
	Network,
	ShieldCheck,
	Terminal,
	Wrench,
} from "lucide-react";

export const metadata = createMetadata({
	title: "Architecture Lab | AI Home Lab, RAG, Agents",
	description:
		"Manoj Mukherjee's Architecture Lab for AI home-lab diagrams, LangGraph orchestration playgrounds, local sandbox metrics, AI audit estimation, Agentic RAG research, and production AI system notes.",
	path: "/architecture-lab",
});

const labSignals = [
	{
		label: "Primary Use",
		value: "Learn how the architecture is built",
	},
	{
		label: "Core Lab",
		value: "Self-hosted AI home lab on Apple Silicon",
	},
	{
		label: "Research Focus",
		value: "Agents, RAG, gateways, local models",
	},
	{
		label: "For",
		value: "Architects, engineers, developers, clients",
	},
] as const;

const blueprintLayers = [
	{
		title: "Secure Ingress",
		description:
			"Cloudflare Tunnel, DNS, custom rules, and zero-open-port access into the local lab.",
		icon: ShieldCheck,
	},
	{
		title: "AI Gateway",
		description:
			"FastAPI gateway with OpenAI-compatible contracts, auth, rate limits, logging, and model routing.",
		icon: Network,
	},
	{
		title: "Agent Runtime",
		description:
			"Python LangGraph orchestration inside the FastAPI gateway; Astra remains the JS/TS website-side agent surface.",
		icon: GitBranch,
	},
	{
		title: "Model Layer",
		description:
			"Ollama and MLX for local model experiments, with fallback thinking for cloud model lanes.",
		icon: Boxes,
	},
	{
		title: "Data Layer",
		description:
			"PostgreSQL, Redis, and Qdrant for metadata, cache, queues, and vector search.",
		icon: Database,
	},
	{
		title: "Frontend Surface",
		description:
			"Next.js interfaces that turn the lab into a usable architecture playground and learning surface.",
		icon: Terminal,
	},
] as const;

const researchThreads = [
	{
		id: "LAB-01",
		status: "Publishing",
		title: "AI Home Lab Blueprint",
		focus:
			"Private AI platform on MacBook M1 Pro with Vercel-hosted Astra, Cloudflare Tunnel, FastAPI, Python LangGraph, Ollama, PostgreSQL, Redis, and Qdrant.",
		nextDetail:
			"Topology notes, constraints, and failure-mode checks.",
	},
	{
		id: "LAB-02",
		status: "Measuring",
		title: "Agentic RAG Grounding",
		focus:
			"Source routing, context assembly, reranking, local reasoning, and grounded answer checks.",
		nextDetail:
			"Eval cases for weak grounding, source gaps, and freshness.",
	},
	{
		id: "LAB-03",
		status: "Hardening",
		title: "OpenAI-Compatible AI Gateway",
		focus:
			"One API contract for local models, cloud models, tools, scripts, and future MCP clients.",
		nextDetail:
			"Validation, auth, fallback routing, traces, and cost/privacy tradeoffs.",
	},
	{
		id: "LAB-04",
		status: "Designing",
		title: "Architecture Playground",
		focus:
			"Interactive diagrams for layers, failure modes, metrics, and decisions.",
		nextDetail:
			"Topology, sequence, data-flow, and reliability views.",
	},
	{
		id: "LAB-05",
		status: "Planned",
		title: "Native MDX Editorial Engine",
		focus:
			"First-party architecture notes with diagrams, code walkthroughs, and file-aware references.",
		nextDetail:
			"MDX model, Mermaid rendering, code highlighting, SEO, and newsletter capture.",
	},
] as const;

const resourceTypes = [
	{
		title: "Architecture Diagrams",
		description:
			"Topology maps, data-flow diagrams, sequence flows, failure-mode maps, and infra stack references.",
		icon: Network,
	},
	{
		title: "Research Notes",
		description:
			"Short field notes on what worked, what failed, what changed, and which tradeoffs still need proof.",
		icon: BookOpen,
	},
	{
		title: "Data Resources",
		description:
			"Evaluation fixtures, source inventories, prompt contracts, retrieval examples, and grounding checklists.",
		icon: FileText,
	},
	{
		title: "Tool Reviews",
		description:
			"Practical reviews of agent frameworks, vector databases, model runtimes, gateways, and observability tools.",
		icon: Wrench,
	},
	{
		title: "Playgrounds",
		description:
			"Interactive inspectors for agent routing, retrieval assembly, gateway fallback, and architecture decisions.",
		icon: FlaskConical,
	},
	{
		title: "Reusable Patterns",
		description:
			"Reference patterns that teams can adapt for private AI, RAG reliability, agent orchestration, and platform handoff.",
		icon: Boxes,
	},
] as const;

function LabHero() {
	return (
		<header className="min-w-0 overflow-x-clip border-b border-border pt-14 bg-background/5">
			<div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
				<div className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
					<div className="min-w-0">
						<p className="font-mono text-xs uppercase tracking-wide text-amber">
							Architecture Lab
						</p>
						<h1 className="mt-5 max-w-[11ch] font-display text-4xl font-normal leading-[0.98] text-foreground sm:max-w-[14ch] sm:text-balance md:text-7xl md:leading-[0.96]">
							Where I open the system and show the work.
						</h1>
						<p className="mt-7 max-w-[34ch] break-words text-base leading-7 text-muted-foreground md:max-w-[62ch] md:text-xl md:leading-9">
							My lab notebook for AI diagrams, RAG flows, gateways, local models,
							and architecture research.
						</p>
					</div>

					<div className="min-w-0 border border-border bg-card/10 p-5 md:p-6">
						<div className="flex items-center gap-2 border-b border-border pb-4">
							<FlaskConical className="size-4 text-amber" />
							<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
								lab.index
							</p>
						</div>
						<div className="grid gap-4 pt-5 sm:grid-cols-2">
							{labSignals.map((signal) => (
								<div key={signal.label}>
									<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
										{signal.label}
									</p>
									<p className="mt-2 text-sm leading-6 text-foreground">
										{signal.value}
									</p>
								</div>
							))}
						</div>
						<p className="mt-6 border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
							Diagrams, field notes, resources, and interactive tools will keep
							landing here.
						</p>
					</div>
				</div>
			</div>
		</header>
	);
}

function BlueprintLayerGrid() {
	return (
		<div className="mt-10 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{blueprintLayers.map((layer) => {
				const Icon = layer.icon;

				return (
					<article key={layer.title} className="min-w-0 border border-border bg-card/10 p-5">
						<div className="flex items-center gap-2">
							<Icon className="size-4 text-amber" />
							<h3 className="font-mono text-xs uppercase tracking-wide text-foreground">
								{layer.title}
							</h3>
						</div>
						<p className="mt-4 break-words text-sm leading-7 text-muted-foreground">
							{layer.description}
						</p>
					</article>
				);
			})}
		</div>
	);
}

function ResearchThreads() {
	return (
		<div className="mt-12 grid min-w-0 gap-3 lg:grid-cols-2">
			{researchThreads.map((thread) => (
				<article key={thread.id} className="min-w-0 border border-border p-5 md:p-6">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<p className="font-mono text-xs uppercase tracking-wide text-amber">
							{thread.id}
						</p>
						<span className="rounded-md border border-border bg-card/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
							{thread.status}
						</span>
					</div>
					<h3 className="mt-5 text-xl font-medium text-foreground">
						{thread.title}
					</h3>
					<p className="mt-3 break-words text-sm leading-7 text-muted-foreground">
						{thread.focus}
					</p>
					<div className="mt-5 border-t border-border pt-4">
						<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
							Next detail to publish
						</p>
						<p className="mt-2 break-words text-sm leading-7 text-foreground">
							{thread.nextDetail}
						</p>
					</div>
				</article>
			))}
		</div>
	);
}

function ResourceGrid() {
	return (
		<div className="mt-12 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{resourceTypes.map((resource) => {
				const Icon = resource.icon;

				return (
					<article key={resource.title} className="min-w-0 border border-border bg-card/10 p-5">
						<div className="flex items-center gap-2">
							<Icon className="size-4 text-amber" />
							<h3 className="font-mono text-xs uppercase tracking-wide text-foreground">
								{resource.title}
							</h3>
						</div>
						<p className="mt-4 break-words text-sm leading-7 text-muted-foreground">
							{resource.description}
						</p>
					</article>
				);
			})}
		</div>
	);
}

export default function ArchitectureLabPage() {
	return (
		<main className="min-w-0 overflow-x-clip">
			<LabHero />

			<Section className="bg-card/5 py-16 md:py-20">
				<SectionHeader
					kicker="Home Lab Blueprint"
					title="The first lab artifact is my private AI platform."
					description="Secure ingress, API gateway, agent runtime, local inference, data stores, and frontend surfaces."
				/>
				<figure className="mt-12 min-w-0 overflow-hidden border border-border bg-background">
					<div className="relative aspect-[3/2] min-w-0 bg-card/10">
						<Image
							src="/lab/home-lab-arch.png"
							alt="Five-panel AI home lab architecture deck showing Cloudflare, FastAPI Gateway, LangGraphJS, Ollama and MLX, PostgreSQL, Redis, Qdrant, Agentic RAG, and infrastructure stack layers."
							fill
							sizes="(min-width: 1024px) 1100px, 100vw"
							className="object-contain"
						/>
					</div>
					<figcaption className="border-t border-border px-5 py-4 text-sm leading-7 text-muted-foreground">
						Home lab topology, Agentic RAG, AI gateway, and infrastructure stack.
					</figcaption>
				</figure>
				<BlueprintLayerGrid />
			</Section>

			<Section className="border-t border-border bg-background py-16 md:py-20">
				<SectionHeader
					kicker="Graph Playground"
					title="Simulate a LangGraph-style agent run."
					description="Preset inputs, node transitions, checkpoints, approval gates, retries, and state inspection."
				/>
				<div className="mt-12">
					<OrchestrationPlayground />
				</div>
			</Section>

			<Section className="border-t border-border bg-background py-16 md:py-20">
				<SectionHeader
					kicker="Interactive Workbench"
					title="Inspect the flows, then inspect the tradeoffs."
					description="Select a system and inspect inputs, outputs, metrics, and failure modes."
				/>
				<div className="mt-12">
					<LabDashboard />
				</div>
			</Section>

			<Section className="border-t border-border bg-card/5 py-16 md:py-20">
				<SectionHeader
					kicker="Empirical Sandbox"
					title="Ground the lab in local hardware reality."
					description="Live-ready local model inventory, throughput, memory, and tunnel health."
				/>
				<div className="mt-12">
					<SandboxDashboard />
				</div>
			</Section>

			<Section className="border-t border-border bg-background py-16 md:py-20">
				<SectionHeader
					kicker="Audit Estimator"
					title="Turn architecture variables into a review signal."
					description="Estimate token budget, latency shape, and cache/compaction savings."
				/>
				<div className="mt-12">
					<AdvisoryEstimator />
				</div>
			</Section>

			<Section className="border-t border-border bg-card/5 py-16 md:py-20">
				<SectionHeader
					kicker="Research Queue"
					title="What I am turning into deeper notes."
					description="Future notes, experiments, proof gaps, and publishable architecture decisions."
				/>
				<ResearchThreads />
			</Section>

			<Section className="border-t border-border bg-background py-16 md:py-20">
				<SectionHeader
					kicker="Lab Resources"
					title="What this page will become over time."
					description="Diagrams, data resources, tool reviews, playgrounds, and reusable patterns."
				/>
				<ResourceGrid />
			</Section>

			<CtaBand
				title="Want to turn your AI architecture question into a lab experiment?"
				description="Bring one constraint: grounding, routing, gateway design, observability, data ownership, deployment, or developer adoption."
			/>
		</main>
	);
}
