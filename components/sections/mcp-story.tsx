// components/sections/mcp-story.tsx
"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import MCPInsane from "../three/mcp-insane";

const STAGE_COPY = [
	{
		title: "Fragmentation",
		subtitle: "APIs. Data. Intelligence.",
		description:
			"Enterprise systems start as disconnected islands. APIs talk only to themselves. Data gets lost between teams. Intelligence remains siloed and ineffective.",
		metrics: ["APIs in isolation", "Data fragmentation", "No shared context"],
	},
	{
		title: "Context Emergence",
		subtitle: "RAG surfaces the signal.",
		description:
			"Retrieval-Augmented Generation creates shared context across data sources. Knowledge becomes accessible. Patterns emerge from the noise.",
		metrics: [
			"Unified data access",
			"Context preservation",
			"Signal extraction",
		],
	},
	{
		title: "Coordination",
		subtitle: "Agents take action.",
		description:
			"Intelligent agents begin coordinating decisions. Logic transforms into automated workflows. Systems start thinking and acting as one.",
		metrics: [
			"Agent orchestration",
			"Automated decisions",
			"Workflow unification",
		],
	},
	{
		title: "Unified Intelligence",
		subtitle: "MCP at scale.",
		description:
			"The Model Context Protocol becomes the nervous system of enterprise intelligence. Every component communicates. Every decision is informed. Scale becomes possible.",
		metrics: ["Operational unity", "Intelligent scaling", "System coherence"],
	},
];

export default function MCPStory() {
	const ref = useRef<HTMLDivElement | null>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});
	const [stage, setStage] = useState(0);

	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		const nextStage = Math.min(3, Math.floor(latest * 4));
		setStage(nextStage);
	});

	return (
		<section id="mcp" ref={ref} className="relative h-[300vh] overflow-hidden">
			<div className="sticky top-0 h-screen">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.10),transparent_40%)]" />
				<MCPInsane scroll={scrollYProgress} />
				<div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(15,23,42,0.00)_0%,rgba(15,23,42,0.20)_40%,rgba(15,23,42,0.80)_100%)]" />
			</div>

			<div className="pointer-events-none absolute left-1/2 top-[45%] w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 px-6">
				<motion.div
					className="pointer-events-auto rounded-[2.5rem] border border-white/10 bg-slate-950/90 p-12 shadow-2xl shadow-slate-950/50 backdrop-blur-3xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}>
					<div className="flex flex-wrap items-center gap-4">
						<span className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.45em] text-cyan-300">
							Stage {stage + 1}
						</span>
						<p className="text-sm uppercase tracking-[0.4em] text-cyan-300/90 font-semibold">
							The MCP Evolution
						</p>
					</div>
					<h2 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
						{STAGE_COPY[stage].title}
					</h2>
					<p className="mt-4 text-2xl font-semibold text-cyan-400 sm:text-3xl">
						{STAGE_COPY[stage].subtitle}
					</p>
					<p className="mt-6 text-xl leading-9 text-zinc-300 sm:text-2xl max-w-4xl">
						{STAGE_COPY[stage].description}
					</p>
					<div className="mt-10 grid gap-4 sm:grid-cols-3">
						{STAGE_COPY[stage].metrics.map((metric, index) => (
							<motion.div
								key={metric}
								className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1, duration: 0.5 }}>
								<div className="text-sm font-semibold text-cyan-300">
									{metric}
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
