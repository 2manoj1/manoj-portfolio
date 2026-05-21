import { ServiceCard } from "@/components/marketing/cards";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { services } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
	title: "AI Architecture Consulting Services | Manoj Mukherjee",
	description:
		"Premium AI architecture advisory, LangGraph consulting, RAG infrastructure, AI platform engineering, DevRel engineering, and fractional AI architect services.",
	path: "/services",
});

export default function ServicesPage() {
	return (
		<>
			<PageHero
				kicker="Services"
				title="AI architecture services for serious technical teams."
				description="Focused advisory and implementation support for founders, CTOs, AI platform teams, and infrastructure companies moving from experiments to production systems."
			/>
			<Section>
				<SectionHeader
					kicker="Offer Map"
					title="Choose the problem surface."
					description="Each engagement is designed around a concrete architecture constraint: agent reliability, retrieval quality, backend infrastructure, platform deployment, or technical adoption."
				/>
				<div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
					{services.map((service) => (
						<ServiceCard
							key={service.slug}
							href={`/services/${service.slug}`}
							title={service.title}
							description={service.description}
							outcomes={service.outcomes}
						/>
					))}
				</div>
			</Section>
			<CtaBand title="Bring an AI system worth architecting." />
		</>
	);
}
