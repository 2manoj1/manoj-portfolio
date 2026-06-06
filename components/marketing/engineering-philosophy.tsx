"use client";

import { BookOpen, Code, RefreshCw, Terminal, ArrowUpRight, Flame } from "lucide-react";

export function EngineeringPhilosophy() {
	return (
		<div className="grid gap-8 lg:grid-cols-[1fr_minmax(20rem,0.85fr)] border border-border bg-card/15 rounded-xl p-6 md:p-8 shadow-sm overflow-hidden">
			{/* Left Column: Narrative Philosophy */}
			<div className="flex flex-col justify-between space-y-6">
				<div className="space-y-4">
					<div>
						<span className="inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-amber border border-amber/20">
							Engineering Creed
						</span>
						<h3 className="mt-3 text-2xl font-normal text-foreground font-display leading-tight">
							Manoj Mukherjee
						</h3>
						<p className="font-mono text-xs text-muted-foreground mt-0.5">
							By heart a Software Engineer &mdash; <span className="text-amber">Look Beyond the System</span>
						</p>
					</div>

					<p className="text-sm leading-7 text-muted-foreground font-sans">
						I do not treat AI as a collection of magical black boxes. To build platforms that scale, you must look beyond the models themselves and understand the systems supporting them. For me, AI architecture is software engineering at its highest resolution&mdash;requiring the same rigor in state persistence, API contracts, latency budget allocations, and performance optimization as any legacy system.
					</p>

					<p className="text-sm leading-7 text-muted-foreground font-sans">
						Staying at the cutting edge requires a continuous feedback loop: reading research papers, analyzing distributed systems designs, exploring new tooling (like the Model Context Protocol or the UV package manager), and writing proof-of-concept (POC) scripts to evaluate performance limitations under load.
					</p>

					<p className="text-sm leading-7 text-muted-foreground font-sans">
						I treat AI as a powerful engineering multiplier. I utilize agent runtimes to automate scaffolding, test setups, and documentation. However, I anchor these tools with rigorous context engineering, ensuring structured inputs, predictable constraints, and direct architectural guardrails.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/60">
					<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
						<Flame className="size-4 text-amber" />
						<span>Hands-on POCs first, model hype second.</span>
					</div>
				</div>
			</div>

			{/* Right Column: Monospace Research Ledger Terminal */}
			<div className="flex flex-col rounded-xl border border-zinc-200 dark:border-border bg-zinc-50 dark:bg-[#0d0d0d] shadow-md dark:shadow-2xl overflow-hidden justify-between min-h-[22rem]">
				{/* Terminal Header */}
				<div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-950 px-4 py-3 border-b border-zinc-200/65 dark:border-border/60 select-none">
					<div className="flex items-center gap-2">
						<Terminal className="size-4 text-amber" />
						<span className="font-mono text-[10px] text-zinc-500 dark:text-muted-foreground uppercase tracking-widest">
							manoj@research-ledger
						</span>
					</div>
					<span className="font-mono text-[9px] text-amber/60 tracking-wider">
						STABLE_SYNC
					</span>
				</div>
 
				{/* Terminal Logs/Content */}
				<div className="flex-1 p-5 font-mono text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-5 overflow-y-auto">
					{/* Research Inputs */}
					<div className="space-y-1.5">
						<div className="flex items-center gap-2 text-zinc-400 dark:text-white/40">
							<BookOpen className="size-3 text-amber/70" />
							<span className="uppercase font-semibold tracking-wider">Research & Subscriptions</span>
						</div>
						<ul className="space-y-1 pl-4 list-disc list-outside text-zinc-650 dark:text-zinc-400">
							<li>Weekly review of arXiv GenAI and System Architecture papers</li>
							<li>Subscribed to engineering publications (Vercel, Stripe, InfoQ)</li>
							<li>LangGraph, LlamaIndex, and OpenAI API spec updates monitoring</li>
						</ul>
					</div>
 
					{/* System Design Exercises */}
					<div className="space-y-1.5">
						<div className="flex items-center gap-2 text-zinc-400 dark:text-white/40">
							<Code className="size-3 text-amber/70" />
							<span className="uppercase font-semibold tracking-wider">System Design & POC Lab</span>
						</div>
						<ul className="space-y-1 pl-4 list-disc list-outside text-zinc-650 dark:text-zinc-400">
							<li>State preservation using SQLite/Postgres checkpointers</li>
							<li>Benchmarking local SLMs (Qwen-14B/Llama-3.2) on Apple Silicon</li>
							<li>Model Context Protocol (MCP) tool security gateway mocks</li>
						</ul>
					</div>
 
					{/* AI Multipliers */}
					<div className="space-y-1.5">
						<div className="flex items-center gap-2 text-zinc-400 dark:text-white/40">
							<RefreshCw className="size-3 text-amber/70" />
							<span className="uppercase font-semibold tracking-wider">AI Integration & Context Eng.</span>
						</div>
						<ul className="space-y-1 pl-4 list-disc list-outside text-zinc-650 dark:text-zinc-400">
							<li>Utilizing AI for rapid boilerplate generation & testing</li>
							<li>Context engineering: window compaction & RAG compression</li>
							<li>Continuous prompt optimization using structured JSON evaluations</li>
						</ul>
					</div>
				</div>
 
				{/* Terminal Footer */}
				<div className="bg-zinc-100/60 dark:bg-zinc-950/60 px-4 py-2.5 border-t border-zinc-200/60 dark:border-border/60 flex items-center justify-between text-[9px] text-zinc-500 dark:text-muted-foreground select-none">
					<span className="flex items-center gap-1">
						<span className="size-1.5 rounded-full bg-emerald-500" />
						ACTIVE DISCOVERY HUB
					</span>
					<a
						href="https://github.com/2manoj1"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 hover:text-amber transition-colors"
					>
						<span>Explore GitHub</span>
						<ArrowUpRight className="size-2.5" />
					</a>
				</div>
			</div>
		</div>
	);
}
