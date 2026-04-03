// components/sections/transition.tsx

export default function Transition() {
	return (
		<section className="relative overflow-hidden py-40 px-6">
			<div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_45%)]" />
			<div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/10 bg-slate-950/85 p-14 shadow-2xl shadow-slate-950/40 backdrop-blur-3xl text-center">
				<p className="text-sm uppercase tracking-[0.4em] text-cyan-300/90 font-semibold">
					The Reality
				</p>
				<h2 className="mt-6 text-6xl font-semibold tracking-tight text-white sm:text-7xl md:text-8xl">
					Systems today are fragmented.
				</h2>
				<p className="mt-6 text-xl leading-9 text-zinc-400 sm:text-2xl max-w-3xl mx-auto">
					APIs, data, and intelligence exist in silos.
				</p>
				<div className="mt-12 grid gap-6 sm:grid-cols-3 text-left">
					<div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-sm shadow-red-500/10">
						<div className="text-2xl font-semibold text-red-400">APIs</div>
						<div className="mt-2 text-sm text-zinc-400">
							Fragmented and siloed
						</div>
					</div>
					<div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6 shadow-sm shadow-orange-500/10">
						<div className="text-2xl font-semibold text-orange-400">Data</div>
						<div className="mt-2 text-sm text-zinc-400">
							Lost between systems
						</div>
					</div>
					<div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 shadow-sm shadow-yellow-500/10">
						<div className="text-2xl font-semibold text-yellow-400">
							Intelligence
						</div>
						<div className="mt-2 text-sm text-zinc-400">No shared context</div>
					</div>
				</div>
			</div>
		</section>
	);
}
