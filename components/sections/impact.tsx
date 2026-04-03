// components/sections/impact.tsx
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Impact() {
	return (
		<section id="impact" className="relative py-28 px-6">
			<div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_30%)]" />
			<div className="mx-auto max-w-7xl">
				<div className="mb-12 max-w-3xl">
					<p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
						Impact
					</p>
					<h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
						Systems impact that moves teams and products forward.
					</h2>
					<p className="mt-5 text-lg leading-8 text-zinc-400">
						I architect platforms that reduce cognitive overhead, accelerate automation, and scale the people building them.
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="bg-white/5 border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
						<CardHeader>
							<CardTitle className="text-3xl text-cyan-300">10+</CardTitle>
							<CardDescription className="mt-2 text-zinc-400">
								AI systems architected for product, automation, and revenue.
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="bg-white/5 border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
						<CardHeader>
							<CardTitle className="text-3xl text-cyan-300">5x</CardTitle>
							<CardDescription className="mt-2 text-zinc-400">
								Automation velocity improved across pipelines, retrieval, and deployment.
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="bg-white/5 border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
						<CardHeader>
							<CardTitle className="text-3xl text-cyan-300">30+</CardTitle>
							<CardDescription className="mt-2 text-zinc-400">
								Leaders and engineers coached in AI architecture, product delivery, and systems thinking.
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</div>
		</section>
	);
}
