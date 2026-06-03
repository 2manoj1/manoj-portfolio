import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section } from "@/components/marketing/section";
import { blogArticles, getBlogArticle } from "@/content/blog";
import { siteConfig } from "@/content/site";
import { createMetadata } from "@/lib/seo";

interface BlogSection {
	heading: string;
	body: readonly string[];
	codeBlock?: {
		language: string;
		filename: string;
		code: string;
	};
}

type PageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const article = getBlogArticle(slug);

	if (!article) {
		return {};
	}

	return createMetadata({
		title: `${article.title} | Manoj Mukherjee`,
		description: article.seoDescription,
		path: `/blog/${article.slug}`,
		keywords: article.keywords,
	});
}

export default async function BlogArticlePage({ params }: PageProps) {
	const { slug } = await params;
	const article = getBlogArticle(slug);

	if (!article) {
		notFound();
	}

	const articleUrl = `${siteConfig.url}/blog/${article.slug}`;
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: article.title,
		description: article.seoDescription,
		url: articleUrl,
		datePublished: "2026-05-25",
		dateModified: "2026-05-25",
		author: {
			"@type": "Person",
			name: siteConfig.name,
			url: siteConfig.url,
		},
		publisher: {
			"@type": "Person",
			name: siteConfig.name,
		},
		keywords: article.keywords.join(", "),
		mainEntityOfPage: articleUrl,
	};

	return (
		<>
			<PageHero
				kicker={`${article.topic} / ${article.date}`}
				title={article.title}
				description={article.seoDescription}>
				<Link
					href="/blog"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-amber">
					<ArrowLeft className="size-4" />
					Back to writing
				</Link>
			</PageHero>
			<Section>
				<div className="grid gap-12 lg:grid-cols-[0.72fr_0.28fr]">
					<article className="min-w-0">
						<div className="border-y border-border py-8">
							<p className="font-mono text-xs uppercase tracking-wide text-amber">
								Core thesis / {article.readingTime}
							</p>
							<p className="mt-4 text-2xl leading-10 text-foreground">
								{article.heroTakeaway}
							</p>
						</div>
						<div className="mt-14 space-y-14">
							{(article.sections as readonly BlogSection[]).map((section) => (
								<section key={section.heading}>
									<h2 className="font-display text-2xl md:text-3xl font-normal text-foreground">
										{section.heading}
									</h2>
									<div className="mt-6 space-y-5">
										{section.body.map((paragraph: string, pIdx: number) => {
											// Parse inline markdown code highlights
											const parts = paragraph.split(/(`[^`]+`)/g);
											return (
												<p
													key={pIdx}
													className="text-base leading-8 text-muted-foreground">
													{parts.map((part, partIdx) => {
														if (part.startsWith("`") && part.endsWith("`")) {
															return (
																<code key={partIdx} className="rounded bg-secondary/50 px-1.5 py-0.5 font-mono text-xs text-amber font-semibold border border-border/40">
																	{part.slice(1, -1)}
																</code>
															);
														}
														return part;
													})}
												</p>
											);
										})}
									</div>

									{/* Render Code Block if defined in schema */}
									{section.codeBlock && (
										<div className="mt-6 overflow-hidden rounded-lg border border-border bg-[#0d0d0d] font-mono text-[11px] leading-relaxed shadow-lg">
											{section.codeBlock.filename && (
												<div className="bg-zinc-950 px-4 py-2 border-b border-border/80 text-[10px] text-muted-foreground tracking-wide flex justify-between select-none">
													<span>{section.codeBlock.filename}</span>
													<span className="uppercase text-[9px] text-amber">{section.codeBlock.language}</span>
												</div>
											)}
											<pre className="p-4 overflow-x-auto text-zinc-300">
												<code>{section.codeBlock.code}</code>
											</pre>
										</div>
									)}
								</section>
							))}
						</div>
					</article>
					<aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
						<div className="border border-border p-5">
							<p className="font-mono text-xs uppercase tracking-wide text-amber">
								Architecture signals
							</p>
							<ul className="mt-5 space-y-4">
								{article.architectureSignals.map((signal) => (
									<li
										key={signal}
										className="flex gap-3 text-sm leading-6 text-muted-foreground">
										<ArrowRight className="mt-1 size-4 shrink-0 text-amber" />
										<span>{signal}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="border border-border p-5">
							<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/70">
								References
							</p>
							<div className="mt-5 space-y-4">
								{article.references.map((reference) => (
									<a
										key={reference.url}
										href={reference.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-start justify-between gap-3 text-sm leading-6 text-muted-foreground transition-colors hover:text-amber">
										<span>{reference.label}</span>
										<ExternalLink className="mt-1 size-4 shrink-0" />
									</a>
								))}
							</div>
						</div>
					</aside>
				</div>
			</Section>
			<CtaBand title="Need an architect for production AI systems?" />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</>
	);
}
