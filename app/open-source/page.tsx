import { GitHubIcon } from "@/components/marketing/icons";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { GITHUB } from "@/lib/links";
import { createMetadata } from "@/lib/seo";

const projects = [
	{
		title: "LangGraph Agent Templates",
		description:
			"Reusable graph patterns for planner/executor workflows, tool routing, stateful memory, and human review gates.",
		status: "Planned",
	},
	{
		title: "FastAPI AI Backend Starter",
		description:
			"Async Python service template for model gateways, queue-backed workloads, tracing, and typed API contracts.",
		status: "Planned",
	},
	{
		title: "RAG Reliability Kit",
		description:
			"Reference implementation for chunking, pgvector indexing, retrieval evaluation, and answer grounding checks.",
		status: "Planned",
	},
];

export const metadata = createMetadata({
	title: "Open Source AI Infrastructure | Manoj Mukherjee",
	description:
		"Open source AI infrastructure starter kits, LangGraph templates, FastAPI AI backends, RAG systems, and production-ready examples.",
	path: "/open-source",
});

export default function OpenSourcePage() {
	return (
		<>
			<PageHero
				kicker="Open Source"
				title="Production AI examples for serious builders."
				description="The open source strategy should reinforce authority: starter kits, templates, and reference architectures that show how AI systems are actually wired."
			/>
			<Section>
				<SectionHeader
					kicker="Project Roadmap"
					title="Build public proof around reusable AI infrastructure."
					description="Each project should include an architecture overview, deployment strategy, screenshots, GitHub links, and technical explanations."
				/>
				<div className="mt-14 grid gap-3 lg:grid-cols-3">
					{projects.map((project) => (
						<article key={project.title} className="border border-border p-6">
							<p className="font-mono text-xs uppercase tracking-wide text-amber">
								{project.status}
							</p>
							<h2 className="mt-4 text-xl font-medium text-foreground">
								{project.title}
							</h2>
							<p className="mt-4 text-sm leading-7 text-muted-foreground">
								{project.description}
							</p>
						</article>
					))}
				</div>
				<a
					href={GITHUB}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber">
					<GitHubIcon className="size-4" />
					View current GitHub profile
				</a>
			</Section>
			<CtaBand title="Want a reference app for your AI infrastructure product?" />
		</>
	);
}
