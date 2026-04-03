// components/sections/cta.tsx

import { Button } from "@/components/ui/button";

export default function CTA() {
	return (
		<section id="contact" className="relative py-28 px-6">
			<div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),transparent_30%)]" />
			<div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/85 p-10 text-center shadow-2xl shadow-slate-950/40 backdrop-blur-3xl">
				<p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
					Ready for the next system
				</p>
				<h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
					Let’s design the next generation of intelligent infrastructure.
				</h2>
				<p className="mt-6 text-lg leading-8 text-zinc-400">
					If you are building platforms, operations, or product systems with AI
					at the center, let’s connect.
				</p>
				<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
					<a
						href="https://www.linkedin.com/in/YOUR-LINK"
						aria-label="Open LinkedIn profile">
						<Button
							asChild
							size="lg"
							className="rounded-2xl bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400">
							<span>LinkedIn</span>
						</Button>
					</a>

					<a href="mailto:hello@manojmukherjee.co.in" aria-label="Send email">
						<Button
							asChild
							variant="outline"
							size="lg"
							className="rounded-2xl border-white/15 text-white hover:border-white/30 hover:bg-white/5">
							<span>Email</span>
						</Button>
					</a>
				</div>
			</div>
		</section>
	);
}
