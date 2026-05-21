import { ArrowRight, ExternalLink } from "lucide-react";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { articles } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
	title: "AI Engineering Writing | Manoj Mukherjee",
	description:
		"Technical writing on LangGraph, multi-agent systems, RAG infrastructure, local AI workflows, AI observability, and AI platform engineering.",
	path: "/blog",
});

export default function BlogPage() {
	return (
		<>
			<PageHero
				kicker="Writing"
				title="Technical writing for AI infrastructure builders."
				description="A long-term authority engine for senior engineers, AI founders, platform teams, and DevRel leaders. Current articles live on Medium while the MDX system is prepared."
			/>
			<Section>
				<SectionHeader
					kicker="Articles"
					title="Systems-first writing, not beginner tutorials."
					description="The editorial lane is LangGraph orchestration, RAG reliability, pgvector, FastAPI scaling, context engineering, token budgets, AI observability, and infrastructure adoption."
				/>
				<div className="mt-14 divide-y divide-border">
					{articles.map((article) => (
						<a
							key={article.title}
							href={article.url}
							target="_blank"
							rel="noopener noreferrer"
							className="group grid gap-6 py-7 first:pt-0 md:grid-cols-[1fr_auto]">
							<div>
								<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/60">
									{article.topic} / {article.date}
								</p>
								<h2 className="mt-2 max-w-[58ch] text-xl font-medium text-foreground group-hover:text-amber">
									{article.title}
								</h2>
							</div>
							<span className="inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-amber md:mt-8">
								Read
								<ExternalLink className="size-4" />
							</span>
						</a>
					))}
				</div>
			</Section>
			<Section className="border-y border-border">
				<SectionHeader
					kicker="Roadmap"
					title="Next: production-grade MDX."
					description="The next iteration should add MDX, syntax highlighting, reading time, tag filtering, RSS, related articles, table of contents, and dynamic metadata for owned SEO growth."
				/>
				<div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
					<ArrowRight className="size-4 text-amber" />
					<span>Prioritize owned articles after the service and engineering pages are indexed.</span>
				</div>
			</Section>
			<CtaBand title="Need technical content that sounds like an engineer wrote it?" />
		</>
	);
}
