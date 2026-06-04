import { GitHubIcon } from "@/components/marketing/icons";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { GITHUB } from "@/lib/links";
import { createMetadata } from "@/lib/seo";

const projects = [
	{
		title: "FastAPI OpenAI Gateway Proxy",
		description:
			"An OpenAI-compatible high-performance API router proxy offering request validation, rate limiting, and smart load-balanced routing to local SLMs and cloud endpoints.",
		status: "Active",
	},
	{
		title: "LangGraphJS Orchestrator Template",
		description:
			"Stateful multi-agent workflows modeling planner/executor patterns, intent routing, memory nodes, and SQLite-backed thread checkpointing.",
		status: "Active",
	},
	{
		title: "MacBook Silicon AI Home Lab Deployment",
		description:
			"A 100% self-hosted, containerized deployment template utilizing Cloudflare tunnels, Podman, Redis, and Qdrant vector databases for local execution.",
		status: "Active",
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
				description="I publish open-source starter kits, orchestration templates, and reference architectures to share how production AI systems are actually wired under the hood."
			/>
			<Section className="pt-4 md:pt-6">
				<SectionHeader
					kicker="Codebases"
					title="Reusable repositories for production AI patterns."
					description="I design each repository with complete architecture logs, deployment files, and deep technical write-ups so teams can reuse them immediately."
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
