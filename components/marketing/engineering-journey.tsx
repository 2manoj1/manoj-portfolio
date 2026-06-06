"use client";

import { useState } from "react";
import { Terminal, Cpu, Layers, ShieldCheck, Award, Briefcase, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type EraData = {
	period: string;
	title: string;
	company: string;
	summary: string;
	moat: string;
	achievements: string[];
	techRadar: {
		category: string;
		items: string[];
	}[];
};

const eras: EraData[] = [
	{
		period: "2023 - PRESENT",
		title: "AI Systems Architect",
		company: "Publicis Sapient",
		summary: "Leading the architecture design and POC-to-production lifecycle of enterprise Generative AI platforms, multi-agent orchestrations, and high-recall retrieval systems.",
		moat: "Designing resilient state-machine graphs (LangGraph), secure Cloudflare egress proxy tunnels, pgvector database configurations, and context compaction pipelines that survive enterprise audits.",
		achievements: [
			"FS West Supernova Award for enterprise AI transformation and execution strategy",
			"Publicis Sapient Spot Award for GenAI platform innovation and team mentoring",
			"Reduced manual workflow lifecycle overhead by 40%+ using stateful agentic automations",
			"Accelerated POC-to-production lifecycle by nearly 2x across enterprise teams"
		],
		techRadar: [
			{
				category: "Orchestration & Logic",
				items: ["LangGraph", "LangChain", "Google ADK", "MCP / ACP / UCP schemas"]
			},
			{
				category: "Compute & Models",
				items: ["OpenAI (GPT-4o)", "Claude (3.5 Sonnet)", "AWS Bedrock", "GCP Vertex AI", "Ollama", "vLLM", "DeepSeek", "LLaMA"]
			},
			{
				category: "Databases & Retrieval",
				items: ["pgvector", "PostgreSQL", "Qdrant", "MongoDB", "Hybrid Search"]
			},
			{
				category: "Infrastructure & Containers",
				items: ["Docker", "Kubernetes", "Red Hat OpenShift", "OpenShift AI", "NVIDIA Run:AI", "GCP Compute", "GCS", "Cloudflare WAF"]
			},
			{
				category: "Package & Tooling",
				items: ["UV", "pnpm", "NPM", "GitHub Actions", "CI/CD"]
			}
		]
	},
	{
		period: "2021 - 2023",
		title: "Enterprise Full Stack Architect",
		company: "Kotak Mahindra Bank & A.P. Moller - Maersk",
		summary: "Directed solution design for high-stakes digital banking platforms and engineered modular distributed microfrontend architectures for global logistics systems.",
		moat: "Spearheaded Next.js Module Federation and SSR pipelines to decouple monolithic applications into independently deployable, low-latency client interfaces subject to strict compliance SLAs.",
		achievements: [
			"Maersk Star Award for early adoption of Module Federation and custom SSR pipelines",
			"Achieved 25–30% performance rendering speedups on core user interfaces",
			"Reviewed and secured digital banking integrations including UPI 2.0 and Kotak811 APIs",
			"Established modular, reusable design system patterns (Maersk Anchor / Kotak811 UI)"
		],
		techRadar: [
			{
				category: "Architecture & APIs",
				items: ["REST APIs", "SOAP endpoints", "GraphQL", "UPI 2.0 gateway routing", "Secure API Auth"]
			},
			{
				category: "Compute & Serverless",
				items: ["Node.js", "Express.js", "AWS Lambda", "Serverless runtimes"]
			},
			{
				category: "Frontend Infrastructure",
				items: ["Next.js (Module Federation / next-mf)", "React.js", "React Native", "Redux", "TypeScript"]
			},
			{
				category: "Databases & Cache",
				items: ["PostgreSQL", "MongoDB", "Redis"]
			},
			{
				category: "Infrastructure & DevOps",
				items: ["Docker", "Kubernetes", "AWS", "Jenkins CI/CD"]
			}
		]
	},
	{
		period: "2016 - 2021",
		title: "Full Stack Systems Engineer",
		company: "Krista Software, Optiv, HPE, William O'Neil",
		summary: "Engineered scalable web applications, real-time stock market analytics dashboards, and founding core engine features for process automation platforms.",
		moat: "Established enterprise frontends from scratch, managed complex global state models (Redux Saga), and integrated full stack services with secure hybrid cloud platforms.",
		achievements: [
			"Krista Excellence GA Award as a founding engineer of the AI-driven process automation platform",
			"William O'Neil Excellence Award for rapid delivery of Panaray financial analytics charts",
			"Contributed to HPE GreenLake hybrid cloud service management console and the open-source Grommet design system",
			"Built cybersecurity analytics dashboards and GraphQL API endpoints under strict performance SLAs"
		],
		techRadar: [
			{
				category: "Logic & Automation",
				items: ["Process Automation Workflows", "Rule Engine Integration", "TypeScript", "JavaScript (mljs)"]
			},
			{
				category: "Backend & Services",
				items: ["Node.js", "Express.js", "GraphQL", "REST microservices"]
			},
			{
				category: "Frontend Frameworks",
				items: ["React.js", "Angular", "Ionic Framework", "Redux Saga", "TailwindCSS", "TensorFlow.js"]
			},
			{
				category: "Databases & Storage",
				items: ["MongoDB", "PostgreSQL", "SQL Server", "Redis"]
			},
			{
				category: "DevOps & Tooling",
				items: ["Docker", "Podman", "Jenkins CI/CD", "AWS", "GCP", "NPM", "Yarn", "Webpack"]
			}
		]
	}
];

export function EngineeringJourney() {
	const [activeIdx, setActiveIdx] = useState(0);
	const currentEra = eras[activeIdx];

	return (
		<div className="space-y-10">
			{/* Stateful Era Toggle */}
			<div className="flex flex-col sm:flex-row gap-3 border-b border-border/80 pb-6">
				{eras.map((era, idx) => (
					<button
						key={era.title}
						type="button"
						onClick={() => setActiveIdx(idx)}
						className={cn(
							"flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-300 relative overflow-hidden flex-1 group",
							activeIdx === idx
								? "border-amber/80 bg-amber/5 ring-1 ring-amber/10 shadow-md shadow-amber/5"
								: "border-border bg-card/25 hover:border-muted-foreground/30 hover:bg-card/50"
						)}
					>
						{activeIdx === idx && (
							<span className="absolute top-0 right-0 h-[2px] w-full bg-amber animate-pulse" />
						)}
						<span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/75 group-hover:text-amber transition-colors duration-300">
							{era.period}
						</span>
						<span className="mt-2 text-sm font-medium text-foreground">
							{era.title}
						</span>
						<span className="mt-1 text-[11px] text-muted-foreground/80 truncate w-full">
							{era.company.split(" & ")[0]}
						</span>
					</button>
				))}
			</div>

			{/* Main Grid Content Display */}
			<div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
				{/* Left Column: Era Summary + Moat + Milestones */}
				<div className="flex flex-col rounded-xl border border-border bg-card/20 p-6 md:p-8 justify-between shadow-sm">
					<div className="space-y-6">
						<div>
							<div className="flex items-center gap-2">
								<Briefcase className="size-4 text-amber" />
								<span className="font-mono text-[10px] text-amber uppercase tracking-widest">{currentEra.period}</span>
							</div>
							<h3 className="mt-2 text-2xl font-normal text-foreground leading-snug">
								{currentEra.title}
							</h3>
							<p className="mt-1 font-mono text-[11px] text-muted-foreground/75 uppercase tracking-wide">
								{currentEra.company}
							</p>
							<p className="mt-4 text-sm leading-7 text-muted-foreground">
								{currentEra.summary}
							</p>
						</div>

						<div className="border-t border-border/80 pt-5 space-y-3">
							<div className="flex items-center gap-2 text-xs font-mono text-foreground font-semibold">
								<Cpu className="size-4 text-amber/80" />
								<span>CORE ARCHITECTURAL FOCUS</span>
							</div>
							<p className="text-xs leading-6 text-muted-foreground font-sans pl-6 border-l border-border/60">
								{currentEra.moat}
							</p>
						</div>

						<div className="border-t border-border/80 pt-5 space-y-4">
							<div className="flex items-center gap-2 text-xs font-mono text-foreground font-semibold">
								<Award className="size-4 text-amber/80" />
								<span>PRODUCTION MILESTONES & AWARDS</span>
							</div>
							<ul className="space-y-2.5 text-xs text-muted-foreground pl-1">
								{currentEra.achievements.map((achievement, aIdx) => (
									<li key={aIdx} className="flex items-start gap-2.5 leading-relaxed">
										<ChevronRight className="size-3.5 text-amber shrink-0 mt-0.5" />
										<span>{achievement}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* Right Column: Monospace Technology Radar */}
				<div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0d0d0d] p-5 md:p-6 shadow-md dark:shadow-2xl overflow-hidden justify-between">
					<div>
						{/* Top Bar */}
						<div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4 mb-5 select-none">
							<div className="flex items-center gap-2">
								<Terminal className="size-4 text-amber" />
								<span className="font-mono text-xs uppercase tracking-widest text-zinc-700 dark:text-zinc-200 font-semibold">
									Technology Radar
								</span>
							</div>
							<div className="flex items-center gap-1.5">
								<span className="size-2 rounded-full bg-rose-500/80 animate-pulse" />
								<span className="font-mono text-[9px] text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">
									System.Scan_active
								</span>
							</div>
						</div>
 
						{/* Radar Categories */}
						<div className="space-y-6 font-mono text-[11px] leading-relaxed">
							{currentEra.techRadar.map((group) => (
								<div key={group.category} className="space-y-2">
									<div className="flex items-center gap-2 text-zinc-400 dark:text-white/40 border-b border-zinc-200/50 dark:border-zinc-800/30 pb-1">
										<Layers className="size-3 text-amber/70" />
										<span className="uppercase tracking-wider font-semibold">
											{group.category}
										</span>
									</div>
									<div className="flex flex-wrap gap-1.5 pt-1 pl-3">
										{group.items.map((item) => (
											<span
												key={item}
												className="rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 px-2 py-1 text-zinc-700 dark:text-zinc-300 transition-colors hover:border-amber/40 hover:text-amber"
											>
												{item}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
 
					<div className="mt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-4 flex items-center justify-between text-[9px] font-mono text-zinc-500 dark:text-zinc-500">
						<div className="flex items-center gap-1.5">
							<ShieldCheck className="size-3.5 text-amber/70" />
							<span>VERIFIED PRODUCTION STACK</span>
						</div>
						<span className="uppercase tracking-widest">Manoj.Mukherjee_v1.0</span>
					</div>
				</div>
			</div>
		</div>
	);
}
