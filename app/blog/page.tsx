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
		"Deep technical writing on LangGraph architecture, production multi-agent systems, enterprise RAG, AI observability, and platform engineering patterns.",
	path: "/blog",
});

export default function BlogPage() {
	return (
		<>
			<PageHero
				kicker="Writing"
				title="Systems thinking applied to AI infrastructure."
				description="Architecture-first writing on production challenges. How real teams build durable agents, secure workflows, observable systems, and reliable AI infrastructure that doesn't break under load."
			/>
			<Section>
				<SectionHeader
					kicker="Featured Research"
					title="Architecture problems I've actually solved."
					description="These aren't tutorials. They're systems breakdowns of real challenges: stateful agent execution, tool governance, observability at scale, and production reliability patterns that matter when things fail at 3 AM."
				/>
				<div className="mt-14 grid gap-3 lg:grid-cols-2">
					{blogArticles.map((article) => (
						<Link
							key={article.slug}
							href={`/blog/${article.slug}`}
							className="group border border-border bg-card/25 p-6 transition-colors hover:border-amber/50">
							<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/60">
								{article.topic} · {article.date} · {article.readingTime}
							</p>
							<h2 className="mt-4 max-w-[28ch] text-2xl font-medium leading-tight text-foreground group-hover:text-amber">
								{article.title}
							</h2>
							<p className="mt-5 text-sm leading-7 text-muted-foreground">
								{article.summary}
							</p>
							<div className="mt-8 flex items-center gap-2 text-sm text-amber">
								Read the full breakdown
								<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
							</div>
						</Link>
					))}
				</div>
			</Section>
			<Section className="border-y border-border">
				<SectionHeader
					kicker="Medium & Distribution"
					title="Where ideas amplify."
					description="Medium remains the fastest way to reach engineers at scale. I publish canonical research here first, then use other platforms to extend reach. RSS syndication and cross-posting to LinkedIn happen automatically."
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
					kicker="What's Next"
					title="Building a living architecture journal."
					description="MDX support for live code examples, interactive diagrams, searchable tag filters, and RSS feeds. The goal is to make this a reference resource—not just another blog."
				/>
				<div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
					<ArrowRight className="size-4 text-amber" />
					<span>I build in public here, learn through writing, and maintain a searchable archive of what actually works in production systems.</span>
				</div>
			</Section>
			<CtaBand title="Building systems that matter? Let's talk." />
		</>
	);
}
