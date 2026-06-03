import { SystemCard } from "@/components/marketing/cards";
import { ArchitectureDecisionMap } from "@/components/marketing/architecture-decision-map";
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
