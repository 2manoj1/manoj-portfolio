"use client";

import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const ThreeScene = dynamic(() => import("@/components/three-scene"), {
	ssr: false,
});

export default function Home() {
	return (
		<main>
			<Navbar />

			{/* HERO (LEFT-ALIGNED PREMIUM) */}
			<section className="min-h-screen flex items-center px-6 md:px-20">
				<div className="max-w-5xl">
					<motion.h1
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-5xl md:text-7xl font-semibold leading-[1.1]">
						Designing Intelligent Systems <br />
						<span className="text-muted-foreground">for the AI Era</span>
					</motion.h1>

					<p className="mt-8 text-xl text-muted-foreground max-w-2xl leading-relaxed">
						I build MCP-powered architectures, agentic workflows, and
						production-grade RAG systems that scale beyond demos.
					</p>

					<div className="mt-10 flex gap-4">
						<button className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90">
							View Work
						</button>

						<button className="px-6 py-3 rounded-xl border border-border hover:bg-white/5">
							Contact
						</button>
					</div>
				</div>
			</section>

			{/* VISUAL BREAK */}
			<section className="px-6 md:px-20 py-20">
				<div className="max-w-6xl mx-auto">
					<ThreeScene />
				</div>
			</section>

			{/* ABOUT (LEFT STORY) */}
			<section className="px-6 md:px-20 py-32">
				<div className="max-w-3xl">
					<h2 className="text-3xl md:text-4xl font-semibold">
						Architecture over code.
					</h2>

					<p className="mt-6 text-muted-foreground text-lg leading-relaxed">
						Most systems fail not because of implementation, but because of poor
						design. I focus on building AI systems where data, context, and
						reasoning work together.
					</p>

					<p className="mt-4 text-muted-foreground text-lg leading-relaxed">
						My work combines MCP, retrieval systems, and agentic execution to
						deliver real-world impact.
					</p>
				</div>
			</section>

			{/* MCP SECTION (SIMPLIFIED PREMIUM) */}
			<section className="px-6 md:px-20 py-32">
				<div className="max-w-5xl">
					<h2 className="text-3xl md:text-4xl font-semibold mb-16">
						How intelligence flows
					</h2>

					<div className="grid md:grid-cols-4 gap-10 text-left">
						{["APIs", "MCP", "Agents", "UI"].map((item) => (
							<div key={item}>
								<div className="text-lg font-medium">{item}</div>
								<p className="text-sm text-muted-foreground mt-2">
									Core system layer
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* PROJECT (HERO CARD) */}
			<section className="px-6 md:px-20 py-32">
				<div className="max-w-6xl">
					<div className="rounded-3xl border border-border p-10 bg-card/40 backdrop-blur-xl">
						<h3 className="text-2xl font-semibold">MCP Retail Platform</h3>

						<p className="text-muted-foreground mt-4 max-w-2xl">
							A unified system where CMS, GraphQL, and AI operate as a single
							layer — powering both frontend and intelligent interfaces.
						</p>

						<div className="mt-6 flex gap-3 flex-wrap text-sm text-muted-foreground">
							<span>Next.js</span>
							<span>GraphQL</span>
							<span>MCP</span>
							<span>AI</span>
						</div>
					</div>
				</div>
			</section>

			{/* IMPACT (MINIMAL) */}
			<section className="px-6 md:px-20 py-32">
				<div className="max-w-5xl grid md:grid-cols-3 gap-10">
					{[
						["70+", "Repositories"],
						["10+", "Years"],
						["AI", "Systems"],
					].map(([value, label]) => (
						<div key={value}>
							<div className="text-3xl font-semibold">{value}</div>
							<div className="text-muted-foreground mt-2">{label}</div>
						</div>
					))}
				</div>
			</section>

			{/* FOOTER */}
			<footer className="px-6 md:px-20 py-20 text-muted-foreground">
				© Manoj Mukherjee
			</footer>
		</main>
	);
}
