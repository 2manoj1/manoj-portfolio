// components/seo-schema.tsx

export default function SeoSchema() {
	const data = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Manoj Mukherjee",
		url: "https://www.manojmukherjee.co.in",
		jobTitle: "AI Architect",
		sameAs: [
			"https://www.linkedin.com/in/YOUR-LINK",
			"https://github.com/2manoj1",
		],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
