// components/sections/mcp-story.tsx
"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import MCPInsane from "../three/mcp-insane";

const STAGE_COPY = [
	{
		title: "Fragmentation",
		subtitle: "Systems are fragmented.",
		description:
			"APIs, data, and intelligence exist in silos. The platform cannot reason across the system, so every interaction feels disconnected.",
		metrics: ["APIs in silos", "Data siloed", "No shared context"],
	},
	{
		title: "Connection",
		subtitle: "Data starts connecting.",
		description:
			"RAG creates the first shared layer of context. Information begins to travel between sources, and the system starts to form a common memory.",
		metrics: ["Shared context", "Signal emergence", "Knowledge flow"],
	},
	{
		title: "Activation",
		subtitle: "Agents begin acting.",
		description:
			"Intelligent agents start coordinating decisions and converting context into action. The system shifts from passive data to active orchestration.",
		metrics: [
			"Agent coordination",
			"Automated workflows",
			"Actionable intelligence",
		],
	},
	{
		title: "Intelligence",
		subtitle: "Systems become intelligent.",
		description:
			"The MCP becomes the system layer. Every component shares state, decisions are informed, and the platform operates with real coherence.",
		metrics: ["System coherence", "Operational unity", "Intelligent scale"],
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
		<section
			id="mcp"
			ref={ref}
			className="relative h-[350vh] overflow-hidden py-32">
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
