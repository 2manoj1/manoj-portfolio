"use client";

import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ThreeScene = dynamic(() => import("@/components/three-scene"), {
	ssr: false,
});

export default function Home() {
	const ref = useRef(null);

	const { scrollYProgress } = useScroll({ target: ref });
	const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
	const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

	return (
		<main ref={ref} className="bg-background text-foreground">
			<Navbar />

			{/* HERO */}
			<section className="h-screen flex items-center px-6 md:px-24 relative overflow-hidden">
				{/* soft background glow */}
				<motion.div
					style={{ y }}
					className="absolute w-[800px] h-[800px] bg-purple-500/20 blur-[160px] rounded-full"
				/>

				<motion.div style={{ opacity }} className="max-w-4xl z-10">
					<h1 className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
						Designing intelligence
						<br />
						that works in the real world.
					</h1>

					<p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
						I build AI systems using MCP, agents, and retrieval — focusing on
						architecture, not just implementation.
					</p>
				</motion.div>

				<div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-muted-foreground tracking-wide">
					SCROLL
				</div>
			</section>

			{/* SPACE */}
			<div className="h-[30vh]" />

			{/* ABOUT */}
			<section className="px-6 md:px-24 py-24">
				<div className="max-w-2xl">
					<h2 className="text-3xl md:text-4xl font-semibold">
						Systems over features.
					</h2>

					<p className="mt-6 text-muted-foreground leading-relaxed">
						Most software focuses on isolated features. I focus on building
						systems where data, reasoning, and execution are connected —
						enabling intelligence instead of just functionality.
					</p>
				</div>
			</section>

			{/* MCP FLOW */}
			<section className="px-6 md:px-24 py-32">
				<div className="max-w-5xl">
					<h2 className="text-2xl md:text-3xl font-semibold mb-16">
						Intelligence flow
					</h2>

					<div className="grid md:grid-cols-4 gap-12 text-sm">
						{["APIs", "MCP", "Agents", "UI"].map((item, i) => (
							<motion.div
								key={item}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.15 }}>
								<div className="font-medium text-base">{item}</div>
								<div className="h-px bg-border my-3"></div>
								<p className="text-muted-foreground">
									Core layer of intelligence
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* VISUAL */}
			<section className="px-6 md:px-24 py-32">
				<div className="max-w-6xl mx-auto">
					<ThreeScene />
				</div>
			</section>

			{/* PROJECT */}
			<section className="px-6 md:px-24 py-32">
				<div className="max-w-4xl">
					<div className="p-10 border border-border rounded-2xl bg-card/40 backdrop-blur-md">
						<h3 className="text-2xl font-semibold">MCP Retail Platform</h3>

						<p className="mt-4 text-muted-foreground leading-relaxed">
							A unified architecture combining CMS, GraphQL, and AI — enabling a
							single system to power both applications and intelligent
							interfaces.
						</p>
					</div>
				</div>
			</section>

			{/* IMPACT */}
			<section className="px-6 md:px-24 py-24">
				<div className="max-w-4xl grid md:grid-cols-3 gap-10">
					{[
						["70+", "Repositories"],
						["10+", "Years"],
						["AI", "Systems"],
					].map(([value, label]) => (
						<div key={value}>
							<div className="text-3xl font-semibold">{value}</div>
							<div className="text-muted-foreground text-sm mt-1">{label}</div>
						</div>
					))}
				</div>
			</section>

			{/* FOOTER */}
			<footer className="px-6 md:px-24 py-16 text-xs text-muted-foreground">
				© Manoj Mukherjee
			</footer>
		</main>
	);
}
