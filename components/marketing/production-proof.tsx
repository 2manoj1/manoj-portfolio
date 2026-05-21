import { productionSignals } from "@/content/site";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Section, SectionHeader } from "@/components/marketing/section";

export function ProductionProofSection() {
	return (
		<Section className="border-y border-border">
			<MotionReveal>
				<SectionHeader
					kicker="Production Proof"
					title="Enterprise AI credibility, grounded in delivery."
					description="The strongest signal is not audience size. It is the ability to connect AI workflows, retrieval systems, backend services, deployment constraints, and engineering adoption into one production path."
				/>
			</MotionReveal>
			<div className="mt-14 grid border-y border-border lg:grid-cols-4">
				{productionSignals.map((signal, index) => (
					<MotionReveal key={signal.label} delay={index * 0.04}>
						<div
							className={`h-full p-5 ${
								index > 0 ? "border-t border-border lg:border-t-0 lg:border-l" : ""
							}`}>
							<p className="font-mono text-xs uppercase tracking-wide text-amber">
								{signal.label}
							</p>
							<p className="mt-4 text-sm leading-7 text-muted-foreground">
								{signal.value}
							</p>
						</div>
					</MotionReveal>
				))}
			</div>
		</Section>
	);
}
