import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { awards, proofMetrics, stackKeywords, testimonials } from "@/content/site";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { TestimonialSlider } from "@/components/marketing/testimonial-slider";
import { GITHUB, GOOGLE_SCHOLAR, LINKEDIN, MEDIUM } from "@/lib/links";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
	title: "About Manoj Mukherjee | AI Systems Architect",
	description:
		"About Manoj Mukherjee, AI Architect Consultant and engineering leader specializing in Agentic RAG, LangGraph, FastAPI, AI platforms, and enterprise systems.",
	path: "/about",
});

const operatingPillars = [
	{
		title: "Architecture before model hype",
		copy: "Every AI system starts from business workflows, data boundaries, and reliability constraints. Model choice comes after architecture clarity.",
	},
	{
		title: "POC-to-production discipline",
		copy: "Designs delivery paths that handle agent state, retrieval quality, latency, observability, and governance from the first iteration.",
	},
	{
		title: "Platform-level execution",
		copy: "Combines product thinking with backend and infrastructure rigor across FastAPI services, orchestration runtimes, and cloud-native deployment.",
	},
	{
		title: "Leadership through enablement",
		copy: "Mentors engineers, aligns stakeholders, and creates reusable architecture patterns so teams scale knowledge, not only code.",
	},
] as const;

export default function AboutPage() {
	return (
		<>
			<PageHero
				kicker="About"
				title="I’m Manoj Mukherjee, an AI systems architect."
				description="I design and ship production AI systems for teams that need architecture depth, platform reliability, and real business execution beyond AI demos."
			>
				<div className="grid gap-6 border border-border p-5 md:grid-cols-[220px_minmax(0,1fr)]">
					<div className="relative aspect-[4/5] overflow-hidden border border-border bg-secondary/20">
						<Image
							src="/mm.png"
							alt="Portrait of Manoj Mukherjee"
							fill
							sizes="(max-width: 768px) 100vw, 220px"
							className="object-cover"
							priority
						/>
					</div>
					<div className="flex flex-col justify-between gap-5">
						<div>
							<p className="font-display text-3xl text-foreground">Manoj Mukherjee</p>
							<p className="mt-2 text-sm leading-7 text-muted-foreground">
								AI Architect Consultant focused on multi-agent orchestration,
								enterprise RAG systems, FastAPI AI backends, and AI platform
								engineering for CTOs, startups, and enterprise AI teams.
							</p>
						</div>
						<div className="grid gap-2 text-sm sm:grid-cols-2">
							<a
								href={LINKEDIN}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-between border border-border px-3 py-2 text-foreground hover:bg-secondary/50">
								LinkedIn
								<ArrowUpRight className="size-4" />
							</a>
							<a
								href={GITHUB}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-between border border-border px-3 py-2 text-foreground hover:bg-secondary/50">
								GitHub
								<ArrowUpRight className="size-4" />
							</a>
							<a
								href={MEDIUM}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-between border border-border px-3 py-2 text-foreground hover:bg-secondary/50">
								Medium
								<ArrowUpRight className="size-4" />
							</a>
							<a
								href={GOOGLE_SCHOLAR}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-between border border-border px-3 py-2 text-foreground hover:bg-secondary/50">
								Scholar
								<ArrowUpRight className="size-4" />
							</a>
						</div>
					</div>
				</div>
			</PageHero>
			<Section>
				<SectionHeader
					kicker="Profile"
					title="From product engineering to AI systems architecture."
					description="Over 10+ years, the work evolved from shipping product surfaces to owning architecture strategy across platform, cloud, and now production AI systems. This background helps connect business goals, engineering constraints, and AI reliability into one delivery model."
				/>
				<div className="mt-10 grid gap-3 md:grid-cols-2">
					<div className="border border-border p-5">
						<h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
							What I deliver
						</h3>
						<p className="mt-3 text-sm leading-7 text-muted-foreground">
							AI architecture for complex enterprise workflows including multi-agent
							systems, hybrid retrieval pipelines, FastAPI service backends,
							deployment topologies, and observability models that survive production
							traffic and governance pressure.
						</p>
					</div>
					<div className="border border-border p-5">
						<h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
							How I partner
						</h3>
						<p className="mt-3 text-sm leading-7 text-muted-foreground">
							Workshops, architecture audits, and embedded advisory with engineering
							and leadership teams. The goal is practical: clear decisions, reduced
							rework, faster release confidence, and stronger technical credibility.
						</p>
					</div>
				</div>
				<div className="mt-14 grid border-y border-border md:grid-cols-4">
					{proofMetrics.map((metric, index) => (
						<div
							key={metric.label}
							className={`py-5 md:px-6 ${
								index > 0 ? "border-t border-border md:border-t-0 md:border-l" : ""
							}`}>
							<p className="font-display text-3xl text-foreground">{metric.value}</p>
							<p className="mt-1 text-sm leading-6 text-muted-foreground">
								{metric.label}
							</p>
						</div>
					))}
				</div>
			</Section>
			<Section className="border-y border-border bg-secondary/20">
				<SectionHeader
					kicker="Operating Principles"
					title="Architecture decisions shaped by production constraints."
					description="These principles guide consulting and implementation work across AI advisory, platform delivery, and engineering enablement."
				/>
				<div className="mt-12 grid gap-3 md:grid-cols-2">
					{operatingPillars.map((pillar) => (
						<div key={pillar.title} className="border border-border bg-background p-5">
							<h3 className="text-base font-medium text-foreground">{pillar.title}</h3>
							<p className="mt-3 text-sm leading-7 text-muted-foreground">
								{pillar.copy}
							</p>
						</div>
					))}
				</div>
			</Section>
			<Section className="border-y border-border">
				<SectionHeader
					kicker="Recognition"
					title="Proof across AI, architecture, and engineering execution."
					description="Awards and certifications support the positioning, but the stronger signal is consistency across AI engineering, architecture, platform work, writing, and recommendations."
				/>
				<div className="mt-12 grid gap-3 md:grid-cols-2">
					{awards.map((award) => (
						<div key={award} className="border border-border p-4 text-sm text-foreground">
							{award}
						</div>
					))}
				</div>
			</Section>
			<Section>
				<SectionHeader
					kicker="Stack"
					title="Hands-on across the AI-native stack."
					description="This is not a narrow prompt-engineering profile. It spans orchestration, retrieval, backend services, frontend product surfaces, deployment, and observability."
				/>
				<div className="mt-12 flex flex-wrap gap-2">
					{stackKeywords.map((keyword) => (
						<span key={keyword} className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground">
							{keyword}
						</span>
					))}
				</div>
			</Section>
			<Section className="border-y border-border">
				<SectionHeader
					kicker="Recommendations"
					title="Trusted for rigor, collaboration, and execution."
				/>
				<TestimonialSlider testimonials={testimonials} />
			</Section>
			<CtaBand />
		</>
	);
}
