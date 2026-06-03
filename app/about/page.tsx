import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, GraduationCap } from "lucide-react";
import { awards, proofMetrics, stackKeywords, testimonials } from "@/content/site";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section, SectionHeader } from "@/components/marketing/section";
import { TestimonialSlider } from "@/components/marketing/testimonial-slider";
import { CareerJourneySection } from "@/components/marketing/career-journey";
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
		copy: "I start every AI system from business workflows, data boundaries, and reliability constraints. I evaluate models only after we establish architecture clarity.",
	},
	{
		title: "POC-to-production discipline",
		copy: "I design delivery paths that address agent state, retrieval quality, latency budgets, observability, and governance from the very first iteration.",
	},
	{
		title: "Platform-level execution",
		copy: "I combine product thinking with backend and infrastructure engineering, delivering robust FastAPI services, orchestration graphs, and containerized deployments.",
	},
	{
		title: "Leadership through enablement",
		copy: "I mentor engineers, align stakeholders on key tradeoffs, and build reusable architecture patterns so your team scales technical knowledge, not just code.",
	},
] as const;

function LinkedinIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
		</svg>
	);
}

function GithubIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
		</svg>
	);
}

function MediumIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75c.66 0 1.19 2.58 1.19 5.75z" />
		</svg>
	);
}

function ScholarIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M5.242 13.769L0 9.5 12 2l12 7.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
		</svg>
	);
}

const profileLinks = [
	{ label: "LinkedIn", href: LINKEDIN, icon: LinkedinIcon },
	{ label: "GitHub", href: GITHUB, icon: GithubIcon },
	{ label: "Medium", href: MEDIUM, icon: MediumIcon },
	{ label: "Scholar", href: GOOGLE_SCHOLAR, icon: ScholarIcon },
] as const;

export default function AboutPage() {
	return (
		<>
			<header className="border-b border-border pt-14 bg-background/5">
				<div className="mx-auto max-w-6xl px-6 pt-10 pb-16 md:pt-14 md:pb-24">
					<p className="font-mono text-xs uppercase tracking-wide text-amber mb-6">
						About Manoj
					</p>

					<article aria-labelledby="about-profile-title">
						<Card className="border-border bg-card/30 p-0 shadow-sm shadow-black/5 overflow-visible">
							{/* 1. Cover Banner Image at the top of the Card */}
							<div className="relative w-full aspect-[2.8/1] md:aspect-[3.6/1] rounded-t-2xl overflow-hidden border-b border-border/80 bg-zinc-950/20">
								<Image
									src="/manoj_banner.png"
									alt="Manoj Mukherjee Systems Architecture Cover Banner"
									fill
									sizes="(max-width: 1024px) 100vw, 1024px"
									className="object-cover object-center"
									priority
								/>
							</div>

							{/* 2. Profile Details Grid - overlapping the banner */}
							<CardContent className="grid gap-7 p-5 md:grid-cols-[208px_minmax(0,1fr)_150px] md:items-stretch md:p-6 md:gap-8 overflow-visible">
								<figure className="mx-auto md:mx-0 flex items-center -mt-16 md:-mt-24 z-20 relative">
									<div className="relative w-36 h-36 md:w-48 md:h-48 overflow-hidden rounded-2xl border-4 border-background bg-secondary/30 shadow-2xl shadow-black/30">
										<Image
											src="/mm.png"
											alt="Manoj Mukherjee AI Systems Architect profile photo"
											fill
											sizes="(max-width: 768px) 144px, 192px"
											className="object-cover object-center scale-105"
											priority
										/>
									</div>
									<figcaption className="sr-only">
										Manoj Mukherjee, AI Systems Architect
									</figcaption>
								</figure>

								<section
									aria-labelledby="about-profile-title"
									className="flex flex-col justify-between gap-5 text-center md:text-left pt-2 md:pt-4">
									<header>
										<div className="flex flex-col sm:flex-row sm:items-baseline gap-2 justify-center md:justify-start">
											<h2
												id="about-profile-title"
												className="font-display text-3xl font-normal text-foreground">
												Manoj Mukherjee
											</h2>
											<span className="inline-flex self-center sm:self-baseline items-center rounded-full bg-amber/10 px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider text-amber border border-amber/20">
												AI Systems Architect
											</span>
										</div>
										
										{/* Headline */}
										<p className="mt-4 font-display text-balance text-lg md:text-xl font-normal leading-relaxed text-foreground">
											I design and ship production AI systems for teams that need architecture depth, platform reliability, and real business execution.
										</p>

										{/* Description */}
										<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
											AI Architect Consultant focused on multi-agent orchestration,
											enterprise RAG systems, FastAPI AI backends, and AI platform
											engineering for CTOs, startups, and enterprise AI teams.
										</p>
									</header>
									<nav
										aria-label="Manoj Mukherjee professional profiles"
										className="grid gap-2 sm:grid-cols-2">
										{profileLinks.map((link) => {
											const Icon = link.icon;
											return (
												<Button
													key={link.label}
													asChild
													variant="outline"
													size="lg"
													className="w-full justify-between bg-background/60 hover:border-amber/40 hover:bg-secondary/60 group">
													<a
														href={link.href}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center justify-between w-full">
														<span className="flex items-center gap-2">
															<Icon className="size-3.5 text-muted-foreground group-hover:text-amber transition-colors duration-200" />
															{link.label}
														</span>
														<ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:text-amber transition-all duration-200" />
													</a>
												</Button>
											);
										})}
										<Button
											asChild
											variant="default"
											size="lg"
											className="w-full justify-between sm:col-span-2 bg-amber text-amber-foreground hover:bg-amber/90 font-medium shadow-sm">
											<Link href="/resume">
												<span>View Systems Resume</span>
												<FileText className="size-4" />
											</Link>
										</Button>
									</nav>
								</section>

								<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/60 bg-zinc-950/20 p-4 text-center dark:bg-zinc-900/10 md:justify-between md:py-6 md:h-full md:self-end">
									<div className="relative size-24 rounded border border-border bg-white p-1">
										<Image
											src="/manoj_qr.png"
											alt="Scan to Connect QR Code"
											fill
											className="object-contain"
										/>
									</div>
									<div className="mt-1">
										<p className="font-mono text-[9px] uppercase tracking-widest text-amber">
											Let&apos;s Connect
										</p>
										<p className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
											Scan on mobile
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</article>
				</div>
			</header>
			<Section>
				<SectionHeader
					kicker="Profile"
					title="How a decade of production systems shaped my architectural lens."
					description="Over the past 10+ years, my work has evolved from shipping frontend application surfaces to owning architecture strategy across enterprise platforms, cloud, and production AI. This hands-on path allows me to bridge business goals, technical constraints, and operational reliability into one clear delivery model."
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
			<Section className="border-t border-border">
				<SectionHeader
					kicker="Capabilities"
					title="Strategic leadership & platform governance."
					description="As an AI systems architect and engineering leader, my role extends beyond coding pipelines. I align business parameters and operational constraints to build safe, performant, and cost-controlled AI platforms."
				/>
				<div className="mt-10 grid gap-3 md:grid-cols-3">
					<div className="border border-border p-5 bg-card/10">
						<h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
							1. AI Governance & Evals
						</h3>
						<p className="mt-3 text-sm leading-6 text-muted-foreground">
							Designing model evaluation harnesses, safety filters, regression testing suites, 
							and observability guardrails to guarantee LLM alignment and mitigate hallucinations.
						</p>
					</div>
					<div className="border border-border p-5 bg-card/10">
						<h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
							2. Latency & Token Budgeting
						</h3>
						<p className="mt-3 text-sm leading-6 text-muted-foreground">
							Optimizing vector search indexing, context window compaction, model fine-tuning 
							topologies, and semantic caching to control cloud costs and guarantee sub-50ms budgets.
						</p>
					</div>
					<div className="border border-border p-5 bg-card/10">
						<h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
							3. Team Leadership & Advisory
						</h3>
						<p className="mt-3 text-sm leading-6 text-muted-foreground">
							Establishing solution architecture guilds, mentoring senior engineering teams, 
							auditing vendor roadmaps, and translating abstract AI research into shipping code.
						</p>
					</div>
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
			<CareerJourneySection className="border-b border-border bg-transparent" />
			<Section className="border-b border-border">
				<SectionHeader
					kicker="Recognition"
					title="Proof across AI, architecture, and engineering execution."
					description="Awards and certifications support the positioning, but the stronger signal is consistency across AI engineering, architecture, platform work, writing, and recommendations."
				/>
				<div className="mt-12 grid gap-4 sm:grid-cols-2">
					{awards.map((award, index) => (
						<div
							key={`${award.title}-${index}`}
							className="flex items-center gap-4 rounded-lg border border-border/85 bg-card/25 p-4 shadow-sm hover:border-amber/40 hover:bg-secondary/45 transition-all duration-300 group"
						>
							<div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-background p-2.5 shadow-sm group-hover:border-amber/25 transition-colors">
								{award.logo ? (
									<Image
										src={award.logo}
										alt={`${award.issuer} logo`}
										width={24}
										height={24}
										className="size-6 object-contain"
									/>
								) : (
									<GraduationCap className="size-6 text-amber" />
								)}
							</div>
							<div>
								<h3 className="text-sm font-medium leading-snug text-foreground">
									{award.title}
								</h3>
								<p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-amber">
									{award.issuer}
								</p>
							</div>
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
			<Section className="border-y border-border bg-amber/5 dark:bg-amber/10 py-10">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div>
						<h2 className="text-xl font-display font-medium text-foreground">
							Executive Dossier
						</h2>
						<p className="text-sm text-muted-foreground mt-1 max-w-[60ch]">
							Need a structured CV for stakeholder review or advisory proposals? 
							View or download my full systems architecture resume dossier.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<Button asChild variant="outline" className="bg-background">
							<a href="/resume.pdf" download="Manoj_Mukherjee_AI_Architect_Resume.pdf">
								Download PDF
							</a>
						</Button>
						<Button asChild className="bg-amber text-amber-foreground hover:bg-amber/90">
							<Link href="/resume">Open Viewer</Link>
						</Button>
					</div>
				</div>
			</Section>
			<CtaBand />
		</>
	);
}
