import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

type SeoInput = {
	title: string;
	description: string;
	path?: string;
	keywords?: readonly string[];
};

export function createMetadata({
	title,
	description,
	path = "/",
	keywords = [],
}: SeoInput): Metadata {
	const url = new URL(path, siteConfig.url).toString();

	return {
		title: {
			absolute: title,
		},
		description,
		keywords: [
			"Manoj Mukherjee",
			"AI Architect Consultant",
			"AI Systems Architect",
			"LangGraph Consultant",
			"RAG Infrastructure",
			"FastAPI AI Backend",
			"Multi-Agent Systems",
			"AI Platform Engineering",
			"AI Infrastructure Consulting",
			"DevRel Engineering",
			...keywords,
		],
		alternates: {
			canonical: url,
		},
		openGraph: {
			title,
			description,
			url,
			type: "website",
			siteName: siteConfig.name,
			locale: "en_IN",
			images: [
				{
					url: "/opengraph.webp",
					width: 1200,
					height: 600,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: ["/opengraph.webp"],
		},
	};
}
