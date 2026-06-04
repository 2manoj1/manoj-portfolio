import { ServiceCard } from "@/components/marketing/cards";
import { AdvisoryScopeConstructor } from "@/components/marketing/advisory-scope-constructor";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { services } from "@/content/site";
import { createMetadata } from "@/lib/seo";
import { Code, Compass, Layers, ShieldAlert, Cpu } from "lucide-react";

export const metadata = createMetadata({
	title: "AI Architecture Consulting Services | Manoj Mukherjee",
	description:
		"Premium AI architecture advisory, LangGraph consulting, RAG infrastructure, AI platform engineering, DevRel engineering, and fractional AI architect services.",
	path: "/services",
});

const deliverySteps = [
	{
		number: "01",
		title: "Discovery & Failure Audit",
		description: "Audit raw notebooks, prototype API graphs, or ingestion layouts. Identify execution bottlenecks, hallucinations risk, and token costs.",
		icon: Compass
	},
	{
		number: "02",
		title: "Technical Contracts Specification",
		description: "Decompose query intents and map state variable schemas. Establish execution queues, API data structures, and latency constraints.",
		icon: Code
	},
	{
		number: "03",
		title: "Stateful Graph & Infrastructure Ingestion",
		description: "Ingest vector indices, write explicit LangGraph transitions, build model gate routing, and deploy telemetry collectors.",
		icon: Layers
	},
	{
		number: "04",
		title: "Regression Evaluations Testing",
		description: "Run automated tests against faithfulness metrics, chunk recall ratios, and latency. Iterate steps to guarantee system safety.",
		icon: ShieldAlert
	},
	{
		number: "05",
		title: "Platform Hand-off & Observability Handoff",
		description: "Deliver production repositories, Docker/Kubernetes configurations, and host system run-through alignment sessions.",
		icon: Cpu
	}
] as const;

export default function ServicesPage() {
	return (
		<>
			<PageHero
				kicker="Services"
				title="AI architecture services for serious technical teams."
				description="Focused advisory and implementation support for founders, CTOs, AI platform teams, and infrastructure companies moving from experiments to production systems."
			/>

			{/* Interactive Scope Constructor Section */}
			<Section className="bg-card/5 pt-4 md:pt-6">
				<SectionHeader
					kicker="Architect's Systems Sandbox"
					title="Simulate cost, latency, and system execution."
					description="Use the interactive tools to route your advisory requirements, run cost & latency simulations, or trigger live-simulated terminal traces of Manoj's production patterns."
				/>
				<AdvisoryScopeConstructor />
			</Section>

			{/* Offer Map List */}
			<Section className="border-t border-border bg-background">
				<SectionHeader
					kicker="Offer Map"
					title="Choose the problem surface."
					description="Each engagement is designed around a concrete architecture constraint: agent reliability, retrieval quality, backend infrastructure, platform deployment, or technical adoption."
				/>
				<div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
					{services.map((service) => (
						<ServiceCard
							key={service.slug}
							href="/advisory-intake"
							title={service.title}
							description={service.description}
							outcomes={service.outcomes}
						/>
					))}
				</div>
			</Section>

			{/* Delivery Pipeline Section */}
			<Section className="border-t border-border bg-card/5">
				<SectionHeader
					kicker="Delivery Pipeline"
					title="Discovery to scale: how I implement."
					description="I do not operate as an ad-hoc freelancer. I lead engagements through a strict, transparent system pipeline to guarantee that your production workloads are maintainable and debuggable."
				/>
				
				<div className="mt-14 relative">
					{/* Connecting Line (Desktop) */}
					<div className="hidden lg:block absolute top-[45px] left-10 right-10 h-0.5 bg-gradient-to-r from-amber/30 via-zinc-800 to-amber/30" />

					<div className="grid gap-6 lg:grid-cols-5">
						{deliverySteps.map((step) => {
							const Icon = step.icon;
							return (
								<div key={step.number} className="group relative border border-border bg-zinc-950/30 p-5 rounded-lg flex flex-col justify-between hover:border-amber/35 hover:bg-zinc-900/10 transition-all duration-300">
									
									{/* Top hover indicator */}
									<div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

									<div>
										<div className="flex items-center justify-between">
											<div className="flex size-9 items-center justify-center rounded-lg border border-border bg-zinc-900 text-zinc-400 group-hover:bg-zinc-900/50 group-hover:text-amber group-hover:border-amber/25 transition-all duration-300">
												<Icon className="size-4 shrink-0" />
											</div>
											<span className="font-mono text-xs font-bold text-muted-foreground/45 group-hover:text-amber/40 transition-colors">
												{step.number}
											</span>
										</div>

										<h4 className="mt-4 text-xs font-bold text-foreground transition-colors group-hover:text-zinc-100">
											{step.title}
										</h4>
										<p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground/80">
											{step.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Section>

			<CtaBand title="Bring an AI system worth architecting." />
		</>
	);
}
