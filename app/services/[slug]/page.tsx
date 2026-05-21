import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { services } from "@/content/site";
import { createMetadata } from "@/lib/seo";

type PageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const service = services.find((item) => item.slug === slug);

	if (!service) {
		return {};
	}

	return createMetadata({
		title: `${service.title} | Manoj Mukherjee`,
		description: service.description,
		path: `/services/${service.slug}`,
		keywords: service.keywords,
	});
}

export default async function ServiceDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const service = services.find((item) => item.slug === slug);

	if (!service) {
		notFound();
	}

	return (
		<>
			<PageHero
				kicker="Service"
				title={service.title}
				description={service.description}
			/>
			<Section>
				<div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
					<div>
						<SectionHeader
							kicker="Engagement"
							title="Built for outcomes, not hours."
							description={service.depth}
							className="lg:block"
						/>
					</div>
					<div className="border-y border-border">
						<div className="border-b border-border p-6">
							<p className="font-mono text-xs uppercase tracking-wide text-amber">
								Business outcomes
							</p>
							<ul className="mt-5 space-y-4">
								{service.outcomes.map((outcome) => (
									<li key={outcome} className="flex gap-3 text-sm leading-7 text-foreground">
										<ArrowRight className="mt-1.5 size-4 shrink-0 text-amber" />
										<span>{outcome}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="p-6">
							<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/70">
								Ideal client
							</p>
							<p className="mt-3 text-sm leading-7 text-muted-foreground">
								{service.idealClient}
							</p>
						</div>
					</div>
				</div>
			</Section>
			<CtaBand title={`Need ${service.shortTitle.toLowerCase()} support?`} />
		</>
	);
}
