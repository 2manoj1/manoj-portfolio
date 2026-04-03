// components/sections/cta.tsx

import { Button } from "@/components/ui/button";

export default function CTA() {
	return (
		<section id="contact" className="relative py-32 px-6">
			<div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_35%)]" />
			<div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/10 bg-slate-950/90 p-16 text-center shadow-2xl shadow-slate-950/50 backdrop-blur-3xl">
				<p className="text-sm uppercase tracking-[0.4em] text-cyan-300/90 font-semibold">
					Ready to Build Intelligence
				</p>
				<h2 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
					Let’s architect the next generation of{" "}
					<span className="block text-cyan-400">operational intelligence</span>.
				</h2>
				<p className="mt-8 text-xl leading-9 text-zinc-300 sm:text-2xl max-w-4xl mx-auto">
					If you're building platforms where AI is the foundation — not an
					afterthought — let's connect. I help CTOs and engineering leaders
					design systems that scale minds, not just code.
				</p>
				<div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
					<Button
						asChild
						size="lg"
						className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-10 py-5 text-lg font-semibold text-slate-950 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300">
						<a
							href="https://www.linkedin.com/in/YOUR-LINK"
							aria-label="Open LinkedIn profile">
							Connect on LinkedIn
						</a>
					</Button>

					<Button
						asChild
						variant="outline"
						size="lg"
						className="rounded-2xl border-white/20 bg-white/5 px-10 py-5 text-lg font-semibold text-white shadow-lg hover:border-white/40 hover:bg-white/10 hover:scale-105 transition-all duration-300">
						<a href="mailto:hello@manojmukherjee.co.in" aria-label="Send email">
							Send Message
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
