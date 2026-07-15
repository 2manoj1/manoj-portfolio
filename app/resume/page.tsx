import Link from "next/link";
import { ArrowLeft, Download, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";
import { resumePageSchema } from "@/lib/schema";

const mobileValueMetrics = [
	{
		value: "10+ yrs",
		label: "Enterprise software, cloud-native platforms, and AI systems",
	},
	{
		value: "3+ yrs",
		label: "Focused GenAI, RAG, agents, and LLM platforms",
	},
	{
		value: "40%+",
		label: "Manual workflow reduction via AI automation",
	},
	{
		value: "~2x",
		label: "Faster AI delivery lifecycle using reusable patterns",
	},
];

const mobileSkillGroups = [
	{
		title: "Agentic AI",
		items: "LangGraph, Google ADK, LangChain, MCP/ACP/UCP, Agentic RAG",
	},
	{
		title: "AI Platforms",
		items: "OpenAI, Claude, AWS Bedrock, Vertex AI, Gemini, vLLM, Ollama",
	},
	{
		title: "Backend / APIs",
		items: "Python, FastAPI, Node.js, REST, GraphQL, WebSockets, microservices",
	},
	{
		title: "Data & Retrieval",
		items: "PostgreSQL, MongoDB, pgvector, Pinecone, ChromaDB, hybrid search",
	},
	{
		title: "Cloud & DevOps",
		items: "AWS, GCP, Kubernetes, Docker, OpenShift AI, GitHub Actions, CI/CD",
	},
	{
		title: "Leadership",
		items: "AI strategy, enterprise architecture, stakeholder management, mentoring",
	},
];

const credentials = [
	{
		title: "AWS Certified AI Practitioner",
		detail: "Amazon Web Services · Issued July 12, 2026 · Credly verified",
		href: "https://www.credly.com/badges/7ea65b79-ee4d-449f-8d98-f52fd0734b88",
	},
	{
		title: "AWS Partner: Generative AI Essentials",
		detail: "Amazon Web Services · Training badge · Credly verified",
		href: "https://www.credly.com/badges/d73299c5-9799-40e3-aa36-3154e0e85933",
	},
];

export const metadata = createMetadata({
	title: "Manoj Mukherjee Resume | Enterprise AI Architect",
	description:
		"Resume of Manoj Mukherjee, Enterprise AI Architect in Bengaluru with 10+ years in Agentic AI, LangGraph, enterprise RAG, FastAPI, AWS, GCP, and AI platforms.",
	path: "/resume",
	keywords: [
		"Manoj Mukherjee resume",
		"AI Architect resume India",
		"Enterprise AI Architect CV",
		"GenAI Engineering Leader resume",
	],
});

export default function ResumePage() {
	return (
		<main className="min-h-screen bg-background pt-20 pb-16">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(resumePageSchema()) }}
			/>
			<div className="mx-auto max-w-5xl px-6">
				{/* Top Navigation & Info */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6 mb-8">
					<div>
						<Link
							href="/about"
							className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-2"
						>
							<ArrowLeft className="size-3" />
							BACK TO ABOUT
						</Link>
						<h1 className="text-2xl font-display font-medium text-foreground flex items-center gap-2">
							<FileText className="size-5 text-amber" />
							Professional Resume
						</h1>
						<p className="text-xs text-muted-foreground mt-1">
							Manoj Mukherjee &middot; 10+ YOE &middot; AI Systems Architect & Advisor
						</p>
					</div>

					<div className="hidden items-center gap-2.5 md:flex">
						<Button asChild size="xs" variant="outline" className="text-xs font-medium">
							<a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
								<ExternalLink className="size-3" />
								Open PDF
							</a>
						</Button>
						<Button asChild size="xs" className="text-xs font-medium bg-amber hover:bg-amber/90">
							<a href="/api/resume?download=1">
								<Download className="size-3" />
								Download PDF
							</a>
						</Button>
					</div>
				</div>

				<div className="sticky top-14 z-40 mb-5 md:hidden">
					<div className="rounded border border-border/70 bg-background/92 p-2 shadow-lg shadow-background/30 backdrop-blur-xl">
						<div className="grid grid-cols-2 gap-2">
							<Button asChild size="xs" variant="outline" className="h-10 bg-background/70 text-xs font-medium">
								<a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
									<ExternalLink className="size-3.5" />
									View PDF
								</a>
							</Button>
							<Button asChild size="xs" className="h-10 bg-amber text-xs font-medium text-amber-foreground hover:bg-amber/90">
								<a href="/api/resume?download=1">
									<Download className="size-3.5" />
									Download
								</a>
							</Button>
						</div>
					</div>
				</div>

				{/* PDF Viewer Container */}
				<div className="relative rounded-lg border border-border/80 bg-secondary/50 shadow-2xl p-1.5 md:p-3 overflow-hidden backdrop-blur-sm">
					{/* Status Bar */}
					<div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2 px-1 text-xs text-muted-foreground">
						<span className="flex items-center gap-1.5 font-medium">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
							Verified Production Experience
						</span>
						<span className="text-[11px] text-muted-foreground/60">Last updated: July 2026</span>
					</div>

					{/* Embedded PDF Viewer - Desktop Only */}
					<div className="hidden md:flex w-full bg-card rounded border border-border/50 overflow-hidden h-[800px] items-center justify-center">
						<object
							data="/resume.pdf#toolbar=0&navpanes=0&scrollbar=1"
							type="application/pdf"
							className="h-full w-full"
							aria-label="Manoj Mukherjee Systems Architecture Resume PDF"
						>
							<div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
								<FileText className="size-8 text-amber" />
								<p className="max-w-[42ch] text-sm text-muted-foreground">
									The embedded PDF viewer is unavailable in this browser. Open the resume in a new tab or download a copy.
								</p>
								<div className="flex items-center gap-2">
									<Button asChild size="xs" variant="outline" className="text-xs">
										<a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
											<ExternalLink className="size-3" />
											Open PDF
										</a>
									</Button>
									<Button asChild size="xs" className="bg-amber text-xs hover:bg-amber/90">
										<a href="/api/resume?download=1">
											<Download className="size-3" />
											Download PDF
										</a>
									</Button>
								</div>
							</div>
						</object>
					</div>

					{/* Mobile Helper - Mobile Only */}
					<div className="md:hidden bg-card rounded border border-border/50 p-4 text-left">
						<div className="flex items-start gap-3">
							<div className="size-11 shrink-0 rounded bg-amber/10 flex items-center justify-center ring-1 ring-amber/20">
								<FileText className="size-5 text-amber" />
							</div>
							<div>
								<p className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber">
									Resume snapshot
								</p>
								<h2 className="mt-1 text-base font-semibold text-foreground">
									AI Architect & Engineering Leader
								</h2>
								<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
									10+ years delivering enterprise-scale AI systems, cloud-native platforms,
									and production GenAI applications across BFSI, Logistics, Cybersecurity,
									and Retail.
								</p>
							</div>
						</div>

						<div className="mt-5 grid grid-cols-2 gap-2">
							{mobileValueMetrics.map((metric) => (
								<div key={metric.value} className="rounded border border-border/50 bg-background/60 p-3">
									<div className="font-mono text-lg font-semibold text-foreground">
										{metric.value}
									</div>
									<p className="mt-1 text-[10px] leading-snug text-muted-foreground">
										{metric.label}
									</p>
								</div>
							))}
						</div>

						<div className="mt-5 rounded border border-border/50 bg-secondary/30 p-3">
							<div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
								Professional summary
							</div>
							<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
								Specializes in Agentic AI, multi-agent orchestration, and Enterprise RAG
								pipelines. Drives 0 to 1 AI initiatives from architecture and rapid POC
								through production deployment and scale, while partnering with senior
								stakeholders and mentoring high-performing engineering teams.
							</p>
							<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
								Currently architecting AI platforms at Publicis Sapient that reduced manual
								workflows by 40%+ and accelerated delivery lifecycles by 2x.
							</p>
						</div>

						<div className="mt-5">
							<div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
								Core skills
							</div>
							<div className="mt-3 space-y-2">
								{mobileSkillGroups.map((group) => (
									<div key={group.title} className="rounded border border-border/40 bg-background/50 p-3">
										<div className="text-xs font-semibold text-foreground">{group.title}</div>
										<p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
											{group.items}
										</p>
									</div>
								))}
							</div>
						</div>

						<div className="mt-5 rounded border border-border/50 bg-secondary/30 p-3">
							<div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
								Credentials & continuing education
							</div>
							<div className="mt-3 space-y-3">
								{credentials.map((credential) => (
									<a key={credential.title} href={credential.href} target="_blank" rel="noopener noreferrer" className="block text-xs text-foreground hover:text-amber">
										{credential.title}
										<span className="mt-1 block text-[10px] leading-relaxed text-muted-foreground">{credential.detail}</span>
									</a>
								))}
							</div>
							<p className="mt-3 border-t border-border/40 pt-3 text-[10px] leading-relaxed text-muted-foreground">
								Google AI Leadership — Udemy coursework completed; Google certification exam planned.
							</p>
						</div>

						<div className="mt-6 border-t border-border/40 pt-5 text-center">
							<h3 className="text-sm font-semibold text-foreground">
								Download the resume or view it in your native PDF viewer.
							</h3>
							<p className="mx-auto mt-2 max-w-[34ch] text-[11px] leading-relaxed text-muted-foreground">
								Mobile PDF embedding varies by browser, so the native viewer usually gives the
								cleanest reading experience.
							</p>

							<div className="mt-5 flex flex-col gap-2.5">
								<Button asChild size="xs" className="w-full bg-amber text-amber-foreground hover:bg-amber/90 font-medium">
									<a href="/api/resume?download=1">
										<Download className="size-3.5 mr-1.5" />
										Download PDF
									</a>
								</Button>
								<Button asChild size="xs" variant="outline" className="w-full bg-background/50 hover:bg-background">
									<a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
										<ExternalLink className="size-3.5 mr-1.5" />
										View in native PDF viewer
									</a>
								</Button>
							</div>
						</div>
					</div>
				</div>

				<section className="mt-6 hidden rounded-lg border border-border/80 bg-card/30 p-5 md:block" aria-labelledby="resume-credentials-title">
					<h2 id="resume-credentials-title" className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
						Credentials & continuing education
					</h2>
					<div className="mt-4 grid gap-3 lg:grid-cols-2">
						{credentials.map((credential) => (
							<a key={credential.title} href={credential.href} target="_blank" rel="noopener noreferrer" className="rounded border border-border/60 bg-background/60 p-4 transition-colors hover:border-amber/40">
								<span className="text-sm font-medium text-foreground">{credential.title}</span>
								<span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{credential.detail}</span>
							</a>
						))}
					</div>
					<p className="mt-3 rounded border border-dashed border-border p-4 text-xs leading-relaxed text-muted-foreground">
						<span className="font-medium text-foreground">Google AI Leadership:</span> Udemy coursework completed; Google certification exam planned.
					</p>
				</section>

				{/* Bottom Footer Info */}
				<div className="mt-6 text-center text-xs text-muted-foreground/40">
					<span>Official Systems Resume &middot; Bengaluru, India</span>
				</div>
			</div>
		</main>
	);
}
