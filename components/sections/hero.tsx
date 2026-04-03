// components/sections/hero.tsx
import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section id="hero" className="relative overflow-hidden py-40 px-6">
			<div className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent" />
			<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.12),transparent_40%)]" />

			<div className="relative mx-auto max-w-5xl">
				<div className="rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-14 shadow-2xl shadow-cyan-500/15 backdrop-blur-3xl">
					<h1 className="text-7xl font-semibold tracking-tight leading-[1.1] text-white sm:text-8xl md:text-9xl">
						I design intelligence systems.
					</h1>

					<p className="mt-10 max-w-xl text-xl leading-relaxed text-zinc-400">
						From RAG pipelines to multi-agent orchestration, I build AI-native
						platforms that redefine how systems think and operate.
					</p>

					<div className="mt-12 flex flex-wrap gap-4">
						<Button
							asChild
							size="lg"
							className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-10 py-4 text-lg font-semibold text-slate-950 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300">
							<a href="#mcp">Explore the MCP</a>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="rounded-2xl border-white/20 bg-white/5 px-10 py-4 text-lg font-semibold text-white shadow-lg hover:border-white/40 hover:bg-white/10 hover:scale-105 transition-all duration-300">
							<a href="#contact">Connect</a>
						</Button>
					</div>

					<p className="mt-16 text-sm text-zinc-500">
						Manoj Mukherjee · AI Architect
					</p>
					<p className="mt-8 text-center text-zinc-500 text-lg">
						I don’t just build systems. I design how systems think.
					</p>
				</div>
			</div>
		</section>
	);
}
