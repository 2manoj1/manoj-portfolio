// components/sections/transition.tsx

export default function Transition() {
	return (
		<section className="relative overflow-hidden py-28 px-6">
			<div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_35%)]" />
			<div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-2xl shadow-slate-950/30 backdrop-blur-3xl">
				<p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
					The challenge
				</p>
				<h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
					Systems today are fragmented, brittle, and hard to scale.
				</h2>
				<p className="mt-6 text-xl leading-8 text-zinc-400 sm:text-2xl">
					The real problem is not AI models — it is making every API, data
					source, and agent operate as a single system.
				</p>
			</div>
		</section>
	);
}
