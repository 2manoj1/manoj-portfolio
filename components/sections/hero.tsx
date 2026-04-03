// components/sections/hero.tsx
import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section id="hero" className="relative overflow-hidden px-6 pt-28 pb-24 md:pt-32 md:pb-32">
			<div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-cyan-500/15 via-transparent to-transparent" />
			<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.08),transparent_30%)]" />

			<div className="relative mx-auto max-w-5xl">
				<div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-3xl">
					<p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300/80">
						AI Architect · Systems Designer
					</p>

					<h1 className="mt-8 text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
						I design intelligence systems.
					</h1>

					<p className="mt-6 max-w-3xl text-xl leading-8 text-zinc-400 sm:text-2xl">
						From RAG pipelines to multi-agent orchestration — I build AI-native platforms
						that transform how systems think and operate.
					</p>

					<div className="mt-10 flex flex-wrap gap-4">
						<Button size="lg" className="rounded-2xl bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400">
							Explore the MCP
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="rounded-2xl border-white/15 text-white hover:border-white/30 hover:bg-white/5">
							Connect
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
