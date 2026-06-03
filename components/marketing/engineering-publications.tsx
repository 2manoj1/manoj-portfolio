"use client";

import { Calendar, ArrowUpRight, BookOpen } from "lucide-react";
import { siteConfig } from "@/content/site";

type Publication = {
	title: string;
	description: string;
	topic: string;
	year: string;
	platform: string;
	contribution: string;
	tags: string[];
};

const publications: Publication[] = [
	{
		title: "Agent-to-Agent Communication Systems",
		description: "Architectural guidelines on multi-agent messaging protocols, state serialization, message schemas, and execution synchronization within LangGraph and Model Context Protocol architectures.",
		topic: "Multi-Agent Systems",
		year: "2026",
		platform: "Medium / Research Brief",
		contribution: "Modeled inter-agent execution loops and structured communication gateways to secure workspace routing.",
		tags: ["LangGraph", "MCP", "State Synchronization", "JSON-RPC"]
	},
	{
		title: "Advanced Retrieval-Augmented Generation (RAG)",
		description: "An in-depth systems analysis of hybrid retrieval execution. Focuses on combining dense vector search (pgvector/Qdrant) and sparse document keyword indexes (MongoDB), optimized through cross-encoder reranking.",
		topic: "RAG Infrastructure",
		year: "2026",
		platform: "Medium / Systems Journal",
		contribution: "Designed token-compaction formulas and hybrid search scoring formulas that reduced context payload sizes by 45%.",
		tags: ["pgvector", "Qdrant", "Cross-Encoder", "Hybrid Search"]
	},
	{
		title: "Real-Time AI Agents with LangChain & LangGraph",
		description: "Research on low-latency local agent runtimes. Analyzes hardware-accelerated local execution constraints on Apple Silicon environments using Ollama, MLX, and vLLM gateways.",
		topic: "Local Inference Platform",
		year: "2026",
		platform: "Research Hub / Blog",
		contribution: "Built open-source benchmarks comparing time-to-first-token (TTFT) performance across unified memory lanes.",
		tags: ["Ollama", "MLX", "vLLM", "Local Hardware"]
	},
	{
		title: "AI + OCR + Vision Systems",
		description: "A comprehensive design pattern for enterprise document ingestion. Combines layout-aware OCR parsers, layout bounding boxes, and multimodal LLMs to automate unstructured record extractions.",
		topic: "Vision AI & Ingestion",
		year: "2025",
		platform: "Systems Engineering Digest",
		contribution: "Architected a zero-loss layout parsing pipeline that coordinates structured entity checks with strict data boundaries.",
		tags: ["Vision AI", "Layout-Parser", "OCR Ingestion", "Multimodal"]
	},
	{
		title: "AI-Powered Stock Analysis using LangGraph & DeepSeek",
		description: "Systems research analyzing automated financial market research. Features multi-agent routers executing complex technical audits, sentiment parsing, and algorithmic risk evaluations.",
		topic: "Financial Systems Research",
		year: "2026",
		platform: "Google Scholar / Publications",
		contribution: "Modeled the financial risk checking rules node as a human-in-the-loop validation interrupt.",
		tags: ["DeepSeek", "Redux Saga", "Financial Charts", "Risk Gating"]
	}
];

export function EngineeringPublications() {
	return (
		<div className="space-y-8">
			{/* Publications Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{publications.map((pub) => (
					<article 
						key={pub.title}
						className="group flex flex-col justify-between rounded-xl border border-border bg-card/25 p-5 md:p-6 shadow-sm hover:border-amber/40 hover:bg-secondary/20 transition-all duration-300 relative overflow-hidden"
					>
						<div className="space-y-4">
							{/* Top Metadata */}
							<div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
								<span className="flex items-center gap-1.5 text-amber">
									<BookOpen className="size-3.5" />
									{pub.topic}
								</span>
								<span className="flex items-center gap-1">
									<Calendar className="size-3" />
									{pub.year}
								</span>
							</div>

							<div>
								<h4 className="text-base font-normal text-foreground group-hover:text-amber transition-colors leading-snug">
									{pub.title}
								</h4>
								<span className="mt-0.5 block font-mono text-[9px] text-white/40 uppercase tracking-widest">
									{pub.platform}
								</span>
							</div>

							<p className="text-xs leading-relaxed text-muted-foreground">
								{pub.description}
							</p>

							{/* Contribution note */}
							<div className="rounded bg-secondary/30 p-3 border border-border/50 text-[11px] leading-relaxed text-muted-foreground/90 font-sans">
								<span className="font-mono text-[9px] uppercase font-bold text-foreground block mb-0.5 tracking-wider">
									Architectural Impact:
								</span>
								{pub.contribution}
							</div>
						</div>

						{/* Tags footer */}
						<div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap gap-1">
							{pub.tags.map((tag) => (
								<span 
									key={tag}
									className="rounded bg-zinc-950 border border-border/80 px-2 py-0.5 font-mono text-[8px] tracking-wider text-muted-foreground hover:text-foreground transition-colors"
								>
									{tag}
								</span>
							))}
						</div>
					</article>
				))}
			</div>

			{/* Link Footer */}
			<div className="flex justify-center pt-2">
				<a
					href={siteConfig.profileLinks.googleScholar}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 hover:bg-secondary px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all duration-300"
				>
					<span>View Scholar Citations & Publications</span>
					<ArrowUpRight className="size-3.5" />
				</a>
			</div>
		</div>
	);
}
