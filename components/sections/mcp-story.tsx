// components/sections/mcp-story.tsx
"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import MCPInsane from "../three/mcp-insane";

const STAGE_COPY = [
	"Systems start fragmented: APIs, data, and workflows are disconnected.",
	"RAG surfaces the signal and builds a shared context across data sources.",
	"Agents begin to coordinate decisions, turning logic into action.",
	"MCP becomes the unified intelligence layer, powering connected systems at scale.",
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
		<section id="mcp" ref={ref} className="relative h-[260vh] overflow-hidden">
			<div className="sticky top-0 h-screen">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.08),transparent_32%)]" />
				<MCPInsane scroll={scrollYProgress} />
				<div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(15,23,42,0.00),rgba(15,23,42,0.65))]" />
			</div>

			<div className="pointer-events-none absolute left-1/2 top-[50%] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-6">
				<div className="pointer-events-auto rounded-[2rem] border border-white/10 bg-slate-950/85 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-3xl">
					<p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
						Story-driven MCP
					</p>
					<h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
						From disconnected systems to unified operational intelligence.
					</h2>
					<p className="mt-5 text-xl leading-8 text-zinc-400 sm:text-2xl">
						{STAGE_COPY[stage]}
					</p>
					<div className="mt-8 grid gap-4 text-sm text-zinc-400 sm:grid-cols-3">
						<span>01. APIs in silos</span>
						<span>02. Data loss between teams</span>
						<span>03. No shared operational layer</span>
					</div>
				</div>
			</div>
		</section>
	);
}
