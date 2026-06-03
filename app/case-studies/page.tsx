import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { caseStudies } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
	title: "AI Architecture Case Studies | Manoj Mukherjee",
	description:
		"Production-oriented case studies across Agentic RAG, GPU AI platforms, AI architecture enablement, and enterprise AI systems.",
	path: "/case-studies",
});

export default function CaseStudiesPage() {
	return (
		<>
			<PageHero
				kicker="Case Studies"
				title="Architecture decisions under real constraints."
				description="Selected highlights from my work in enterprise AI systems, platform modernization, and engineering enablement. I focus on core decisions, systems tradeoffs, failure handling, and delivery."
			/>
			<Section>
				<SectionHeader
					kicker="Selected Work"
					title="Business problems translated into system design."
					description="I write these case studies as engineering narratives detailing actual technical decisions, rather than generic portfolio summaries."
				/>
				<div className="mt-14 space-y-4">
					{caseStudies.map((study, index) => (
						<article id={study.slug} key={study.slug} className="border border-border p-6 md:p-8 scroll-mt-20">
							<div className="grid gap-6 lg:grid-cols-[4rem_0.9fr_1.1fr]">
								<span className="font-mono text-xs text-muted-foreground/60">
									0{index + 1}
								</span>
								<div>
									<h2 className="text-2xl font-medium text-foreground">
										{study.title}
									</h2>
									<p className="mt-4 text-sm leading-7 text-muted-foreground">
										{study.problem}
									</p>
								</div>
								<div>
									<p className="font-mono text-xs uppercase tracking-wide text-amber">
										Architecture decisions
									</p>
									<ul className="mt-4 space-y-3">
										{study.decisions.map((decision) => (
											<li key={decision} className="flex gap-3 text-sm leading-7 text-foreground">
												<ArrowRight className="mt-1.5 size-4 shrink-0 text-amber" />
												<span>{decision}</span>
											</li>
										))}
									</ul>
									<div className="mt-6 flex flex-wrap gap-2">
										{study.metrics.map((metric) => (
											<span
												key={metric}
												className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">
												{metric}
											</span>
										))}
									</div>
								</div>
							</div>
						</article>
					))}
				</div>
			</Section>
			<CtaBand title="Have a system that needs this level of architecture?" />
		</>
	);
}
