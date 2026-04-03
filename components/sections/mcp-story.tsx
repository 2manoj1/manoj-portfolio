// components/sections/mcp-story.tsx
"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import MCPInsane from "../three/mcp-insane";

export default function MCPStory() {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({ target: ref });

	const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

	return (
		<section id="mcp" ref={ref} className="h-[250vh] relative">
			{/* Animation */}
			<div className="sticky top-0 h-screen">
				<MCPInsane scroll={scrollYProgress} />
			</div>

			{/* Text */}
			<motion.div
				style={{ opacity }}
				className="absolute inset-0 flex items-center justify-center text-center px-6">
				<div>
					<h2 className="text-4xl md:text-5xl font-semibold">
						MCP — Unified Intelligence Layer
					</h2>

					<p className="mt-6 text-zinc-400 max-w-xl mx-auto">
						APIs, RAG, and Agents orchestrated into a single intelligent system.
					</p>
				</div>
			</motion.div>
		</section>
	);
}
