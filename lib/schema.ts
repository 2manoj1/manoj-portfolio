import { GITHUB, GOOGLE_SCHOLAR, LINKEDIN, MEDIUM } from "@/lib/links";
import { siteConfig, stackKeywords } from "@/content/site";

export function personSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: siteConfig.name,
		url: siteConfig.url,
		jobTitle: "AI Architect Consultant",
		description: siteConfig.description,
		image: `${siteConfig.url}/opengraph.webp`,
		address: {
			"@type": "Place",
			addressLocality: "Bengaluru",
			addressCountry: "India",
		},
		worksFor: {
			"@type": "Organization",
			name: "Publicis Sapient",
		},
		sameAs: [LINKEDIN, GITHUB, MEDIUM, GOOGLE_SCHOLAR],
		knowsAbout: stackKeywords,
	};
}

export function professionalServiceSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		name: "Manoj Mukherjee AI Architecture Advisory",
		url: siteConfig.url,
		description: siteConfig.description,
		areaServed: "Global",
		serviceType: [
			"AI Architecture Advisory",
			"LangGraph Consulting",
			"RAG Infrastructure Consulting",
			"AI Platform Engineering",
			"DevRel Engineering",
			"Fractional AI Architect",
		],
		founder: {
			"@type": "Person",
			name: siteConfig.name,
		},
	};
}
