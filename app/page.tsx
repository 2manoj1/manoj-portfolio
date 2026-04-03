"use client";

import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/three-scene"), {
	ssr: false,
});

export default function Home() {
	return (
		<main className="bg-background text-foreground">
			<Navbar />

			{/* HERO */}
			<section className="px-6 md:px-24 py-40">
				<div className="max-w-4xl">
					<h1 className="text-5xl md:text-7xl font-semibold leading-[1.1] tracking-tight">
						AI Systems Architect
						<br />
						building production-grade intelligence.
					</h1>

					<p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
						I design and build scalable AI systems using MCP, agentic workflows,
						and retrieval architectures — focused on real-world deployment, not
						demos.
					</p>
				</div>
			</section>

			{/* ABOUT */}
			<section className="px-6 md:px-24 py-24">
				<div className="max-w-3xl">
					<h2 className="text-2xl font-semibold">Approach</h2>

					<p className="mt-6 text-muted-foreground leading-relaxed">
						Most AI implementations fail due to poor system design. I focus on
						architecture — structuring how data, context, and reasoning interact
						across services.
					</p>

					<p className="mt-4 text-muted-foreground leading-relaxed">
						My work combines MCP, GraphQL, and agent-based execution to create
						systems that are scalable, maintainable, and production-ready.
					</p>
				</div>
			</section>

			{/* MCP SECTION */}
			<section className="px-6 md:px-24 py-32">
				<div className="max-w-5xl">
					<h2 className="text-2xl font-semibold mb-12">
						System Design: MCP Architecture
					</h2>

					<div className="grid md:grid-cols-4 gap-10">
						{[
							["APIs", "Data sources and services"],
							["MCP", "Context orchestration layer"],
							["Agents", "Decision and execution layer"],
							["UI", "Interface and delivery"],
						].map(([title, desc]) => (
							<div key={title}>
								<div className="text-base font-medium">{title}</div>
								<div className="h-px bg-border my-3"></div>
								<p className="text-sm text-muted-foreground">{desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* VISUAL (OPTIONAL BUT CLEAN) */}
			<section className="px-6 md:px-24 py-24">
				<div className="max-w-6xl mx-auto">
					<ThreeScene />
				</div>
			</section>

			{/* PROJECT */}
			<section className="px-6 md:px-24 py-32">
				<div className="max-w-4xl">
					<h2 className="text-2xl font-semibold mb-8">Selected Work</h2>

					<div className="border border-border rounded-xl p-8">
						<h3 className="text-xl font-semibold">MCP Retail Platform</h3>

						<p className="mt-4 text-muted-foreground leading-relaxed">
							Designed a unified architecture integrating CMS, GraphQL, and MCP
							to support both traditional applications and AI-driven interfaces
							from a single system.
						</p>

						<div className="mt-4 text-sm text-muted-foreground">
							Stack: Next.js, GraphQL, MCP, AI
						</div>
					</div>
				</div>
			</section>

			{/* IMPACT */}
			<section className="px-6 md:px-24 py-24">
				<div className="max-w-4xl grid md:grid-cols-3 gap-10">
					{[
						["70+", "Repositories"],
						["10+", "Years Experience"],
						["AI", "Systems Built"],
					].map(([value, label]) => (
						<div key={value}>
							<div className="text-3xl font-semibold">{value}</div>
							<div className="text-muted-foreground mt-2 text-sm">{label}</div>
						</div>
					))}
				</div>
			</section>

			{/* FOOTER */}
			<footer className="px-6 md:px-24 py-16 text-sm text-muted-foreground">
				© Manoj Mukherjee — AI Systems Architect
			</footer>
		</main>
	);
}
