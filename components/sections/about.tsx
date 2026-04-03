// components/sections/about.tsx

export default function About() {
	return (
		<section id="about" className="relative py-28 px-6">
			<div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_35%)]" />
			<div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-2xl shadow-slate-950/30 backdrop-blur-3xl">
				<p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">About</p>
				<h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
					A systems mindset shaped by product engineering and AI architecture.
				</h2>
				<div className="mt-8 space-y-6 text-base leading-8 text-zinc-400">
					<p>
						I began in product-facing frontend design, then moved into building
						systems that orchestrate models, data, and automation in production.
					</p>
					<p>
						Today I architect MCP platforms for teams that need reliable, composable
						intelligence across engineering, operations, and product.
					</p>
				</div>
			</div>
		</section>
	);
}
