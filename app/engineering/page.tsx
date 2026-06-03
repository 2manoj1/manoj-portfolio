import { SystemCard } from "@/components/marketing/cards";
import { ArchitectureDecisionMap } from "@/components/marketing/architecture-decision-map";
import { EngineeringJourney } from "@/components/marketing/engineering-journey";
import { EngineeringPhilosophy } from "@/components/marketing/engineering-philosophy";
import { EngineeringPublications } from "@/components/marketing/engineering-publications";
import { TechRadar } from "@/components/marketing/tech-radar";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { engineeringSystems, stackKeywords } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
	title: "Engineering Authority | AI Systems Architecture",
	description:
		"Production-grade engineering notes on LangGraph multi-agent systems, RAG reliability, pgvector retrieval, FastAPI AI backends, and AI observability.",
	path: "/engineering",
});

export default function EngineeringPage() {
	return (
		<>
			<PageHero
				kicker="Engineering"
				title="Production AI systems, explained architecturally."
				description="This is the technical proof layer: how retrieval, agent state, backend services, evaluation, and deployment fit together when AI moves beyond prototypes."
			/>
			<Section>
				<SectionHeader
					kicker="System Maps"
					title="Architecture patterns for AI-native products."
					description="Each pattern I deploy features distinct tradeoffs, failure modes, and observability telemetry. The common thread is explicit, deterministic system layout."
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
				<ArchitectureDecisionMap />
			</Section>

			<Section className="border-t border-border bg-card/5">
				<SectionHeader
					kicker="Trajectory"
					title="From code foundations to systems architecture."
					description="A career built on execution. I spent years in full-stack engineering and enterprise microfrontends before moving to AI systems orchestration, platform design, and infrastructure automation."
				/>
				<div className="mt-12">
					<EngineeringJourney />
				</div>
			</Section>

			<Section className="border-t border-border bg-background">
				<SectionHeader
					kicker="Philosophy"
					title="Read, explore, POC, repeat."
					description="A transparent look into how I stay at the cutting edge. Continuous research, deep systems analysis, and utilizing AI as an engineering multiplier define my solution framework."
				/>
				<div className="mt-12">
					<EngineeringPhilosophy />
				</div>
			</Section>

			<Section className="border-t border-border bg-card/5">
				<SectionHeader
					kicker="Radar"
					title="Interactive Technology Radar."
					description="Click and hover over points to inspect my current architectural verdict, production insights, and evaluation statuses of core ecosystem solutions."
				/>
				<div className="mt-12">
					<TechRadar />
				</div>
			</Section>

			<Section className="border-t border-border bg-background">
				<SectionHeader
					kicker="Publications"
					title="Systems research & technical publications."
					description="Academic credibility meets production execution. Below are publications and R&D design briefs spanning agentic communication, steganography, agricultural computer vision, and stock analytics graphs."
				/>
				<div className="mt-12">
					<EngineeringPublications />
				</div>
			</Section>

			<Section className="border-y border-border">
				<SectionHeader
					kicker="Stack"
					title="Hands-on where modern AI platforms actually break."
					description="My stack is broad by design because I treat production AI as a cross-layer problem spanning API services, retrieval, model runtime, infrastructure deployment, and team adoption."
				/>
				<div className="mt-12 flex flex-wrap gap-2">
					{stackKeywords.map((keyword) => (
						<span
							key={keyword}
							className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground">
							{keyword}
						</span>
					))}
				</div>
			</Section>
			<CtaBand title="Want a second brain on your AI architecture?" />
		</>
	);
}
