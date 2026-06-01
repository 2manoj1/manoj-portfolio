import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { blogArticles } from "@/content/blog";
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
				title="AI systems writing for technical buyers."
				description="Owned architecture briefs and Medium essays for senior engineers, AI founders, platform teams, and DevRel leaders evaluating production AI systems."
			/>
			<Section>
				<SectionHeader
					kicker="SEO Articles"
					title="Trending topics with enterprise architecture depth."
					description="These articles target high-intent AI search demand without drifting into hype: LangGraph v1, MCP security, GenAI observability, context engineering, and FastAPI AI backends."
				/>
				<div className="mt-14 grid gap-3 lg:grid-cols-2">
					{blogArticles.map((article) => (
						<Link
							key={article.slug}
							href={`/blog/${article.slug}`}
							className="group border border-border bg-card/25 p-6 transition-colors hover:border-amber/50">
							<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/60">
								{article.topic} / {article.date}
							</p>
							<h2 className="mt-4 max-w-[28ch] text-2xl font-medium leading-tight text-foreground group-hover:text-amber">
								{article.title}
							</h2>
							<p className="mt-5 text-sm leading-7 text-muted-foreground">
								{article.summary}
							</p>
							<div className="mt-8 flex items-center gap-2 text-sm text-amber">
								Read architecture brief
								<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
							</div>
						</Link>
					))}
				</div>
			</Section>
			<Section className="border-y border-border">
				<SectionHeader
					kicker="Medium Archive"
					title="Distribution essays and technical experiments."
					description="Medium remains useful for reach and discovery. The owned blog now carries the canonical SEO pages, while Medium can syndicate and amplify these ideas."
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
			<Section>
				<SectionHeader
					kicker="Roadmap"
					title="Next: production-grade MDX."
					description="The next editorial upgrade should add MDX, syntax highlighting, tag filtering, RSS, related articles, table of contents, and richer architecture diagrams."
				/>
				<div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
					<ArrowRight className="size-4 text-amber" />
					<span>Use these owned pages as the canonical URLs, then syndicate excerpts to LinkedIn and Medium.</span>
				</div>
			</Section>
			<CtaBand title="Need technical content that sounds like an engineer wrote it?" />
		</>
	);
}
