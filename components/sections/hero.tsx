// components/sections/hero.tsx
import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section
			id="hero"
			className="relative overflow-hidden px-6 pt-32 pb-32 md:pt-40 md:pb-40">
			<div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent" />
			<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.12),transparent_40%)]" />

			<div className="relative mx-auto max-w-6xl">
				<div className="rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-12 shadow-2xl shadow-cyan-500/15 backdrop-blur-3xl">
					<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300/90">
						AI Systems Architect
					</p>

					<h1 className="mt-8 text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl">
						I design
						<span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
							intelligence
						</span>
						systems.
					</h1>

					<p className="mt-8 max-w-4xl text-xl leading-9 text-zinc-300 sm:text-2xl md:text-3xl">
						From fragmented APIs to unified operational intelligence — I
						architect platforms that transform how enterprises think, decide,
						and scale.
					</p>

					<div className="mt-12 flex flex-wrap gap-6">
						<Button
							asChild
							size="lg"
							className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-semibold text-slate-950 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300">
							<a href="#mcp">Experience the MCP</a>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="rounded-2xl border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:border-white/40 hover:bg-white/10 hover:scale-105 transition-all duration-300">
							<a href="#contact">Connect</a>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
