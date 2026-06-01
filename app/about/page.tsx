import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { awards, proofMetrics, stackKeywords, testimonials } from "@/content/site";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { TestimonialSlider } from "@/components/marketing/testimonial-slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const profileLinks = [
	{ label: "LinkedIn", href: LINKEDIN },
	{ label: "GitHub", href: GITHUB },
	{ label: "Medium", href: MEDIUM },
	{ label: "Scholar", href: GOOGLE_SCHOLAR },
] as const;

export default function AboutPage() {
	return (
		<>
			<PageHero
				kicker="About"
				title="I’m Manoj Mukherjee, an AI systems architect."
				description="I design and ship production AI systems for teams that need architecture depth, platform reliability, and real business execution beyond AI demos."
			>
				<article aria-labelledby="about-profile-title">
					<Card className="border-border bg-card/30 p-0 shadow-sm shadow-black/5">
						<CardContent className="grid gap-7 p-5 md:grid-cols-[180px_minmax(0,1fr)] md:items-center md:p-6">
							<figure className="mx-auto md:mx-0">
								<div className="size-44 rounded-full border border-border/80 bg-secondary/30 p-1 shadow-xl shadow-black/10 ring-1 ring-amber/15 md:size-[180px]">
									<div className="relative size-full overflow-hidden rounded-full bg-background">
										<Image
											src="/mm.png"
											alt="Portrait of Manoj Mukherjee"
											fill
											sizes="(max-width: 768px) 176px, 180px"
											className="rounded-full object-cover object-center"
											priority
										/>
									</div>
								</div>
								<figcaption className="sr-only">
									Manoj Mukherjee, AI Systems Architect
								</figcaption>
							</figure>
							<section
								aria-labelledby="about-profile-title"
								className="flex flex-col justify-between gap-6 text-center md:text-left">
								<header>
									<h2
										id="about-profile-title"
										className="font-display text-3xl text-foreground">
										Manoj Mukherjee
									</h2>
									<p className="mt-2 text-sm leading-7 text-muted-foreground">
										AI Architect Consultant focused on multi-agent orchestration,
										enterprise RAG systems, FastAPI AI backends, and AI platform
										engineering for CTOs, startups, and enterprise AI teams.
									</p>
								</header>
								<nav
									aria-label="Manoj Mukherjee professional profiles"
									className="grid gap-2 sm:grid-cols-2">
									{profileLinks.map((link) => (
										<Button
											key={link.label}
											asChild
											variant="outline"
											size="lg"
											className="w-full justify-between bg-background/60 hover:border-amber/40 hover:bg-secondary/60">
											<a
												href={link.href}
												target="_blank"
												rel="noopener noreferrer">
												{link.label}
												<ArrowUpRight className="size-4" />
											</a>
										</Button>
									))}
								</nav>
							</section>
						</CardContent>
					</Card>
				</article>
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
