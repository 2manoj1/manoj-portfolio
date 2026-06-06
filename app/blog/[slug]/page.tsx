import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section } from "@/components/marketing/section";
import { blogArticles, getBlogArticle } from "@/content/blog";
import { siteConfig } from "@/content/site";
import { createMetadata } from "@/lib/seo";
import { BlogArticleReader } from "@/components/marketing/blog-article-reader";

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
		keywords: [...article.keywords],
	});
}

export default async function BlogArticlePage({ params }: PageProps) {
	const { slug } = await params;
	const article = getBlogArticle(slug);

	if (!article) {
		notFound();
	}

	const articleUrl = `${siteConfig.url}/blog/${article.slug}`;
	const articleDate =
		article.date === "June 2026" ? "2026-06-06" : "2026-05-25";
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: article.title,
		description: article.seoDescription,
		url: articleUrl,
		datePublished: articleDate,
		dateModified: articleDate,
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
				kicker={`${article.topic} · ${article.date}`}
				title={article.title}
				description={article.seoDescription}>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-amber">
						<ArrowLeft className="size-4" />
						Back to Blog
					</Link>
					<span className="hidden sm:block text-muted-foreground text-sm">·</span>
					<span className="text-sm text-muted-foreground font-mono">{article.readingTime}</span>
				</div>
			</PageHero>

			<Section className="pt-4 md:pt-6">
				<BlogArticleReader article={article} />
			</Section>

			<CtaBand title="Building production AI systems? Let's work together." />
			
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</>
	);
}
