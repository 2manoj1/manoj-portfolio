import { SystemCard } from "@/components/marketing/cards";
import { ArchitectureDecisionMap } from "@/components/marketing/architecture-decision-map";
import { EngineeringJourney } from "@/components/marketing/engineering-journey";
import { EngineeringPhilosophy } from "@/components/marketing/engineering-philosophy";
import { EngineeringPublications } from "@/components/marketing/engineering-publications";
import { TechRadar } from "@/components/marketing/tech-radar";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section, SectionHeader } from "@/components/marketing/section";
import { engineeringSystems } from "@/content/site";
import { createMetadata } from "@/lib/seo";
import {
	BrainCircuit,
	Database,
	GitBranch,
	ServerCog,
	Terminal,
} from "lucide-react";

export const metadata = createMetadata({
	title: "Engineering Radar | Production AI Systems",
	description:
		"Manoj Mukherjee's engineering radar for LangGraph multi-agent systems, RAG reliability, FastAPI AI backends, model runtime choices, and production AI platform decisions.",
	path: "/engineering",
});

const operatingSignals = [
	{
		label: "Primary Lens",
		value: "Production AI systems",
	},
	{
		label: "Current Focus",
		value: "Agents, RAG, backend reliability",
	},
	{
		label: "Architecture Style",
		value: "Explicit state, typed APIs, observable flows",
	},
	{
		label: "Audience",
		value: "Engineers, founders, platform teams",
	},
] as const;

const radarSignals = [
	{
		title: "Orchestration",
		description:
			"Agent state, tool routing, memory boundaries, retries, and human approval gates.",
		icon: GitBranch,
	},
	{
		title: "Models",
		description:
			"Cloud and local runtimes evaluated against latency, privacy, cost, and reasoning depth.",
		icon: BrainCircuit,
	},
	{
		title: "Data",
		description:
			"Retrieval quality, hybrid search, pgvector patterns, reranking, and grounding loops.",
		icon: Database,
	},
	{
		title: "Platform",
		description:
			"FastAPI services, container paths, observability, deployment handoff, and frontend surfaces.",
		icon: ServerCog,
	},
] as const;

const stackGroups = [
	{
		title: "Agent Runtime",
		items: ["LangGraph", "LangChain", "Google ADK", "MCP / ACP / UCP"],
	},
	{
		title: "Retrieval",
		items: ["pgvector", "PostgreSQL", "MongoDB", "Hybrid Search", "Pinecone"],
	},
	{
		title: "AI Backend",
		items: ["Python", "FastAPI", "Async workers", "Model gateways", "Typed APIs"],
	},
	{
		title: "Model Layer",
		items: ["OpenAI", "Claude", "Vertex AI", "AWS Bedrock", "Ollama", "vLLM"],
	},
	{
		title: "Platform",
		items: ["Docker", "Kubernetes", "OpenShift", "NVIDIA Run:AI", "AWS / GCP"],
	},
	{
		title: "Frontend Systems",
		items: ["Next.js", "React", "TypeScript", "Microfrontends", "Module Federation"],
	},
] as const;

function EngineeringIntro() {
	return (
		<header className="border-b border-border pt-14 bg-background/5">
			<div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
				<div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
					<div>
						<p className="font-mono text-xs uppercase tracking-wide text-amber">
							Engineering
						</p>
						<h1 className="mt-5 max-w-[16ch] font-display text-balance text-5xl font-normal leading-[0.96] text-foreground md:text-7xl">
							The technology I trust, test, and question.
						</h1>
						<p className="mt-7 max-w-[68ch] text-pretty text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
							I write and build from the engineering side of AI: stateful agents,
							retrieval quality, backend contracts, model runtime constraints,
							deployment topology, and the tradeoffs that show up after a demo
							becomes a real system.
						</p>
					</div>

					<div className="border border-border bg-card/10 p-5 md:p-6">
						<div className="flex items-center gap-2 border-b border-border pb-4">
							<Terminal className="size-4 text-amber" />
							<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
								engineering.log
							</p>
						</div>
						<div className="grid gap-4 pt-5 sm:grid-cols-2">
							{operatingSignals.map((signal) => (
								<div key={signal.label}>
									<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground/60">
										{signal.label}
									</p>
									<p className="mt-2 text-sm leading-6 text-foreground">
										{signal.value}
									</p>
								</div>
							))}
						</div>
						<p className="mt-6 border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
							This page is for engineers who want to inspect my stack choices,
							developers who want a practical signal, and clients who need to
							understand how I make architecture decisions.
						</p>
					</div>
				</div>
			</div>
		</header>
	);
}

function RadarSignalStrip() {
	return (
		<div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
			{radarSignals.map((signal) => {
				const Icon = signal.icon;

				return (
					<div key={signal.title} className="border border-border bg-card/10 p-5">
						<div className="flex items-center gap-2">
							<Icon className="size-4 text-amber" />
							<h3 className="font-mono text-xs uppercase tracking-wide text-foreground">
								{signal.title}
							</h3>
						</div>
						<p className="mt-4 text-sm leading-7 text-muted-foreground">
							{signal.description}
						</p>
					</div>
				);
			})}
		</div>
	);
}

function StackGroups() {
	return (
		<div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
			{stackGroups.map((group) => (
				<article key={group.title} className="border border-border p-5">
					<h3 className="font-mono text-xs uppercase tracking-wide text-amber">
						{group.title}
					</h3>
					<div className="mt-5 flex flex-wrap gap-2">
						{group.items.map((item) => (
							<span
								key={item}
								className="rounded-md border border-border bg-card/10 px-3 py-1.5 text-sm text-muted-foreground">
								{item}
							</span>
						))}
					</div>
				</article>
			))}
		</div>
	);
}

export default function EngineeringPage() {
	return (
		<>
			<EngineeringIntro />

			<Section className="bg-card/5">
				<SectionHeader
					kicker="Architecture Radar"
					title="My current technology radar for production AI."
					description="I use this as an engineering ledger: what I trust in production, what I am testing in labs, what I am studying carefully, and what I avoid when reliability matters."
				/>
				<RadarSignalStrip />
				<div className="mt-12">
					<TechRadar />
				</div>
			</Section>

			<Section className="border-t border-border bg-background">
				<SectionHeader
					kicker="Decision Ledger"
					title="The stack is only useful when the tradeoffs are visible."
					description="I do not pick tools because they are fashionable. I start from failure modes: weak grounding, opaque agent loops, prototype backends, missing traces, slow feedback cycles, and platform handoff risk."
				/>
				<ArchitectureDecisionMap />
			</Section>

			<Section className="border-t border-border bg-card/5">
				<SectionHeader
					kicker="System Maps"
					title="Where the radar turns into deployable systems."
					description="These are the recurring patterns I come back to when an AI product has to leave a notebook and become a service that developers can own, debug, and improve."
				/>
				<div className="mt-14 grid gap-3 lg:grid-cols-3">
					{engineeringSystems.map((system) => (
						<SystemCard
							key={system.slug}
							title={system.title}
							description={system.description}
							flow={system.flow}
							tradeoffs={system.tradeoffs}
						/>
					))}
				</div>
			</Section>

			<Section className="border-t border-border bg-background">
				<SectionHeader
					kicker="Stack"
					title="Hands-on across the layers where AI systems break."
					description="My work sits across orchestration, retrieval, model runtime, backend services, infrastructure, and frontend delivery. The breadth is intentional because production AI rarely fails in only one layer."
				/>
				<StackGroups />
			</Section>

			<Section className="border-t border-border bg-card/5">
				<SectionHeader
					kicker="Trajectory"
					title="My engineering path started before the AI layer."
					description="The AI work is built on years of frontend architecture, enterprise platform delivery, microfrontends, backend APIs, regulated banking systems, and cloud-native engineering."
				/>
				<div className="mt-12">
					<EngineeringJourney />
				</div>
			</Section>

			<Section className="border-t border-border bg-background">
				<SectionHeader
					kicker="Publications"
					title="Research notes, papers, and engineering writing."
					description="I treat writing as part of the engineering loop. It forces architecture decisions to become clear enough for other developers, technical buyers, and platform teams to evaluate."
				/>
				<div className="mt-12">
					<EngineeringPublications />
				</div>
			</Section>

			<Section className="border-t border-border bg-card/5">
				<SectionHeader
					kicker="Operating Philosophy"
					title="Read, explore, POC, repeat."
					description="My engineering style is practical: study the system, build the smallest credible proof, measure the failure modes, and only then decide whether a tool deserves production trust."
				/>
				<div className="mt-12">
					<EngineeringPhilosophy />
				</div>
			</Section>

			<CtaBand
				title="Need an engineering review for your AI system?"
				description="Bring the architecture constraint: retrieval quality, agent failure modes, backend latency, evaluation gaps, deployment topology, platform handoff, or developer adoption."
			/>
		</>
	);
}
