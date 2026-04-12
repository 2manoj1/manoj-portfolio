// components/sections/about.tsx

export default function About() {
	return (
		<section id="about" className="relative py-24 px-6">
			<div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_40%)]" />
			<div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/10 bg-slate-950/85 p-12 shadow-2xl shadow-slate-950/40 backdrop-blur-3xl">
				<p className="text-sm uppercase tracking-[0.4em] text-cyan-300/90 font-semibold">
					The Architect
				</p>
				<h2 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
					From product engineering to
					<span className="block text-cyan-400">AI systems architecture</span>.
				</h2>
				<div className="mt-10 space-y-6 text-xl leading-9 text-zinc-300">
					<p className="text-xl">
						I started in product engineering, then moved to designing platforms
						where data, models, and business logic operate together.
					</p>
					<p className="text-xl">
						Today I create MCP applications that make intelligence composable,
						observable, and dependable across engineering, product, and ops.
					</p>
					<p className="text-xl">
						I help leadership turn technical complexity into system clarity and
						build platforms that scale teams as much as they scale code.
					</p>
				</div>
			</div>
		</section>
	);
}
