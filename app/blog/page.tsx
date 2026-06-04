import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section } from "@/components/marketing/section";
import { blogArticles } from "@/content/blog";
import { articles } from "@/content/site";
import { createMetadata } from "@/lib/seo";
import { BlogHubDashboard } from "@/components/marketing/blog-hub-dashboard";

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
				<BlogHubDashboard blogArticles={blogArticles} mediumArticles={articles} />
			</Section>
			<CtaBand title="Building systems that matter? Let's talk." />
		</>
	);
}
