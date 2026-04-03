// components/sections/transition.tsx

export default function Transition() {
	return (
		<section className="relative overflow-hidden py-32 px-6">
			<div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_45%)]" />
			<div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/10 bg-slate-950/85 p-12 shadow-2xl shadow-slate-950/40 backdrop-blur-3xl">
				<p className="text-sm uppercase tracking-[0.4em] text-cyan-300/90 font-semibold">
					The Reality
				</p>
				<h2 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
					Enterprise systems are
					<span className="block text-red-400">fundamentally broken</span>.
				</h2>
				<p className="mt-8 text-xl leading-9 text-zinc-300 sm:text-2xl md:text-3xl max-w-4xl">
					APIs in silos. Data disconnected. Intelligence scattered across teams.
					No unified operational layer. The result? Slow decisions, wasted
					resources, and systems that can't scale.
				</p>
				<div className="mt-10 grid gap-6 sm:grid-cols-3 text-center">
					<div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
						<div className="text-2xl font-bold text-red-400">APIs</div>
						<div className="mt-2 text-sm text-zinc-400">
							Fragmented and siloed
						</div>
					</div>
					<div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
						<div className="text-2xl font-bold text-orange-400">Data</div>
						<div className="mt-2 text-sm text-zinc-400">
							Lost between systems
						</div>
					</div>
					<div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
						<div className="text-2xl font-bold text-yellow-400">
							Intelligence
						</div>
						<div className="mt-2 text-sm text-zinc-400">No shared context</div>
					</div>
				</div>
			</div>
		</section>
	);
}
