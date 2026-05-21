import Image from "next/image";
import { careerJourney } from "@/content/site";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Section, SectionHeader } from "@/components/marketing/section";

export function CareerJourneySection() {
	return (
		<Section className="border-y border-border bg-secondary/20">
			<MotionReveal>
				<SectionHeader
					kicker="Career Journey"
					title="From product engineering to AI systems architecture."
					description="The AI architecture position is built on a decade of production work: product surfaces, enterprise platforms, regulated systems, cloud-native delivery, and now agentic AI infrastructure."
				/>
			</MotionReveal>

			<div className="mt-14 border-y border-border">
				{careerJourney.map((item, index) => (
					<MotionReveal key={`${item.period}-${item.title}`} delay={index * 0.04}>
						<article
							className={`grid gap-6 py-8 md:grid-cols-[8rem_1fr_1.05fr] ${
								index > 0 ? "border-t border-border" : ""
							}`}>
							<div>
								<p className="font-mono text-xs text-muted-foreground/70">
									{item.period}
								</p>
							</div>
							<div>
								<div className="mb-4 flex flex-wrap items-center gap-2">
									{item.logos.map((logo, logoIndex) => (
										<div
											key={`${logo}-${logoIndex}`}
											className="rounded-md border border-border bg-background p-2">
											<Image
												src={logo}
												alt={`${item.company} logo`}
												width={22}
												height={22}
												className="size-[22px] object-contain"
											/>
										</div>
									))}
								</div>
								<h3 className="text-xl font-medium text-foreground">
									{item.title}
								</h3>
								<p className="mt-1 font-mono text-xs uppercase tracking-wide text-amber">
									{item.company}
								</p>
								<p className="mt-4 text-sm leading-7 text-muted-foreground">
									{item.summary}
								</p>
							</div>
							<div className="border-t border-border pt-5 md:border-t-0 md:border-l md:pl-6 md:pt-0">
								<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/70">
									Production signal
								</p>
								<p className="mt-3 text-sm leading-7 text-foreground">
									{item.productionSignal}
								</p>
								<div className="mt-5 flex flex-wrap gap-2">
									{item.stack.map((tag) => (
										<span
											key={tag}
											className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">
											{tag}
										</span>
									))}
								</div>
							</div>
						</article>
					</MotionReveal>
				))}
			</div>
		</Section>
	);
}
