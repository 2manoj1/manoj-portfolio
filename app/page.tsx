"use client";

import Navbar from "@/components/navbar";
import SectionWrapper from "@/components/section-wrapper";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Computer as Github, Brain as Linkedin, FileText } from "lucide-react";

/* ---- FIX: Three.js dynamic (no SSR) ---- */
const ThreeScene = dynamic(() => import("@/components/three-scene"), {
	ssr: false,
});

export default function Home() {
	const [chatOpen, setChatOpen] = useState(false);
	const [messages, setMessages] = useState([
		{ role: "ai", text: "Hi, I am Manoj AI." },
	]);
	const [input, setInput] = useState("");

	const sendMessage = () => {
		if (!input) return;

		setMessages([
			...messages,
			{ role: "user", text: input },
			{
				role: "ai",
				text: "Based on Manoj's experience in MCP, Agentic AI, and RAG systems...",
			},
		]);

		setInput("");
	};

	return (
		<main>
			<Navbar />

			{/* HERO */}
			<section className="relative h-screen flex flex-col justify-center items-center text-center pt-20 px-6">
				<motion.h1
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
					className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]">
					Manoj Mukherjee
				</motion.h1>

				<p className="mt-6 text-gray-300 max-w-xl text-lg leading-relaxed">
					AI Systems Architect building MCP-powered intelligent platforms,
					agentic workflows, and production-grade RAG systems.
				</p>

				<button
					onClick={() => setChatOpen(true)}
					className="mt-8 px-8 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
					Ask AI
				</button>

				<div className="absolute bottom-10 text-sm text-muted-foreground animate-pulse">
					Scroll ↓
				</div>
			</section>

			<Divider />

			{/* ABOUT */}
			<SectionWrapper>
				<section className="py-32 px-6 text-center">
					<div className="max-w-4xl mx-auto">
						<h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-10">
							Building Intelligent Systems
						</h2>

						<p className="text-lg text-muted-foreground leading-relaxed">
							I design and build AI systems that go beyond simple applications —
							combining MCP, agentic workflows, and retrieval-based intelligence
							to create scalable, production-ready platforms.
						</p>

						<p className="text-lg text-muted-foreground mt-6 leading-relaxed">
							With 10+ years of experience, I focus on architecture, system
							design, and turning complex AI concepts into real-world solutions.
						</p>
					</div>
				</section>
			</SectionWrapper>

			<Divider />

			{/* MCP SYSTEM */}
			<SectionWrapper>
				<section className="py-32 px-6 text-center">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-16">
							How Intelligence Flows
						</h2>

						<div className="relative flex justify-center items-center">
							{/* animated lines */}
							<svg className="absolute w-full h-full" viewBox="0 0 800 200">
								{[1, 2, 3].map((_, i) => (
									<motion.line
										key={i}
										x1={100 + i * 200}
										y1="100"
										x2={300 + i * 200}
										y2="100"
										stroke="white"
										strokeOpacity="0.2"
										strokeWidth="2"
										initial={{ pathLength: 0 }}
										animate={{ pathLength: 1 }}
										transition={{ duration: 1.5 + i * 0.5 }}
									/>
								))}
							</svg>

							{/* nodes */}
							<div className="flex gap-16 relative z-10">
								{["APIs", "MCP", "Agents", "UI"].map((node, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, y: 40 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: i * 0.2 }}
										className="relative group cursor-pointer">
										<div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/80 to-blue-500/80 flex items-center justify-center text-lg font-semibold shadow-xl group-hover:scale-110 transition">
											{node}
										</div>

										<div className="absolute inset-0 rounded-full bg-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition" />
									</motion.div>
								))}
							</div>
						</div>

						<p className="text-muted-foreground mt-12 max-w-2xl mx-auto text-lg leading-relaxed">
							APIs provide structured data, MCP orchestrates context, agents
							reason and act, and UI delivers intelligence — forming a complete
							AI system.
						</p>
					</div>
				</section>
			</SectionWrapper>

			<Divider />

			{/* THREE VISUAL */}
			<SectionWrapper>
				<section className="py-32 px-6 text-center">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-10">
							System Visualization
						</h2>

						<ThreeScene />
					</div>
				</section>
			</SectionWrapper>

			<Divider />

			{/* PROJECT */}
			<SectionWrapper>
				<section id="projects" className="py-32 px-6">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-center mb-16">
							Featured Work
						</h2>

						<div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition">
							<h3 className="text-2xl font-semibold">MCP Retail Platform</h3>

							<p className="text-muted-foreground mt-4 leading-relaxed">
								A unified AI-driven architecture combining CMS, GraphQL, and MCP
								to power both web applications and intelligent interfaces from a
								single codebase.
							</p>

							<div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
								{["Next.js", "GraphQL", "MCP", "AI"].map((t) => (
									<span
										key={t}
										className="px-3 py-1 border border-border rounded-full">
										{t}
									</span>
								))}
							</div>
						</div>
					</div>
				</section>
			</SectionWrapper>

			<Divider />

			{/* IMPACT */}
			<SectionWrapper>
				<section id="impact" className="py-32 px-6 text-center">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-16">
							Impact
						</h2>

						<div className="grid md:grid-cols-3 gap-8">
							{[
								{ value: "70+", label: "Repositories Built" },
								{ value: "10+", label: "Years Experience" },
								{ value: "AI", label: "Systems in Production" },
							].map((item, i) => (
								<div
									key={i}
									className="p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-xl hover:bg-card/60 hover:scale-105 transition">
									<h3 className="text-3xl font-bold">{item.value}</h3>
									<p className="text-muted-foreground mt-2">{item.label}</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</SectionWrapper>

			{/* CHAT */}
			{chatOpen && (
				<div className="fixed bottom-6 right-6 bg-card/90 backdrop-blur-xl border border-border p-4 w-80 rounded-2xl shadow-2xl">
					<div className="flex justify-between items-center mb-2">
						<h4 className="text-sm font-semibold">Manoj AI</h4>
						<button onClick={() => setChatOpen(false)}>✕</button>
					</div>

					<div className="h-40 overflow-y-auto text-sm space-y-2">
						{messages.map((m, i) => (
							<div
								key={i}
								className={`flex ${
									m.role === "user" ? "justify-end" : "justify-start"
								}`}>
								<p className="bg-muted px-3 py-2 rounded-xl max-w-[80%]">
									{m.text}
								</p>
							</div>
						))}
					</div>

					<div className="flex gap-2 mt-3">
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="flex-1 bg-background border border-border px-2 py-1 rounded"
						/>
						<button
							onClick={sendMessage}
							className="px-3 py-1 border border-border rounded">
							Send
						</button>
					</div>
				</div>
			)}

			{/* FOOTER */}
			<footer id="contact" className="py-20 text-center">
				<div className="flex justify-center gap-6">
					<Github className="w-6 h-6 hover:text-muted-foreground hover:scale-110 transition" />
					<Linkedin className="w-6 h-6 hover:text-muted-foreground hover:scale-110 transition" />
					<FileText className="w-6 h-6 hover:text-muted-foreground hover:scale-110 transition" />
				</div>
			</footer>
		</main>
	);
}

/* ---- small reusable divider ---- */
function Divider() {
	return <div className="h-px bg-border max-w-4xl mx-auto opacity-30" />;
}
