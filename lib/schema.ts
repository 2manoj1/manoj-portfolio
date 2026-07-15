import { GITHUB, GOOGLE_SCHOLAR, LINKEDIN, MEDIUM } from "@/lib/links";
import { aiCredentials, siteConfig, stackKeywords } from "@/content/site";

const personId = `${siteConfig.url}/#person`;

const credentialSchema = aiCredentials.map((credential) => ({
	"@type": "EducationalOccupationalCredential",
	name: credential.title,
	credentialCategory: credential.status,
	url: credential.href,
	recognizedBy: {
		"@type": "Organization",
		name: credential.issuer,
		url: "https://aws.amazon.com/training/",
	},
}));

export function personSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": personId,
		name: siteConfig.name,
		alternateName: "Manoj Mukherjee AI Architect",
		url: siteConfig.url,
		jobTitle: [
			"AI Architect",
			"Enterprise AI Systems Engineer",
			"AI Platform Engineer",
		],
		description: siteConfig.description,
		image: `${siteConfig.url}/mm.png`,
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
		knowsAbout: [
			"Enterprise AI Architecture",
			"Agentic AI",
			"Multi-Agent Systems",
			"LangGraph",
			"Enterprise RAG",
			"Retrieval-Augmented Generation",
			"AI Platform Engineering",
			"FastAPI AI Backends",
			"AI Observability",
			"Context Engineering",
			...stackKeywords,
		],
		hasCredential: credentialSchema,
		subjectOf: {
			"@type": "DigitalDocument",
			name: "Manoj Mukherjee AI Architect Resume",
			url: `${siteConfig.url}/resume`,
			encoding: `${siteConfig.url}/resume.pdf`,
		},
	};
}

export function profilePageSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		"@id": `${siteConfig.url}/about#profile-page`,
		name: "Manoj Mukherjee - AI Architect Profile",
		url: `${siteConfig.url}/about`,
		dateModified: "2026-07-15",
		mainEntity: personSchema(),
	};
}

export function resumePageSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		"@id": `${siteConfig.url}/resume#webpage`,
		name: "Manoj Mukherjee - AI Architect Resume",
		description:
			"Resume of Manoj Mukherjee, an enterprise AI architect and engineering leader in Bengaluru with 10+ years of experience.",
		url: `${siteConfig.url}/resume`,
		dateModified: "2026-07-15",
		about: { "@id": personId },
		primaryImageOfPage: `${siteConfig.url}/opengraph.webp`,
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
