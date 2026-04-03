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
		<section id="impact" className="relative py-24 px-6">
			<div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_35%)]" />
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 max-w-4xl">
					<p className="text-sm uppercase tracking-[0.4em] text-cyan-300/90 font-semibold">
						Systems Impact
					</p>
					<h2 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
						Architecting intelligence platforms that
						<span className="block text-cyan-400">
							move organizations forward
						</span>
						.
					</h2>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					<Card className="group bg-white/5 border-white/10 p-8 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:bg-white/10 hover:shadow-[0_0_60px_rgba(99,102,241,0.18)] hover:border-cyan-500/30">
						<CardHeader className="pb-4">
							<CardTitle className="text-4xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
								AI Systems
							</CardTitle>
							<CardDescription className="mt-3 text-zinc-400 group-hover:text-zinc-300 transition-colors">
								Architected production-grade RAG and multi-agent systems.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="text-sm text-cyan-400/80 font-medium">
								Platform architecture
							</div>
						</CardContent>
					</Card>

					<Card className="group bg-white/5 border-white/10 p-8 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:bg-white/10 hover:shadow-[0_0_60px_rgba(99,102,241,0.18)] hover:border-blue-500/30">
						<CardHeader className="pb-4">
							<CardTitle className="text-4xl font-bold text-blue-300 group-hover:text-blue-200 transition-colors">
								Automation
							</CardTitle>
							<CardDescription className="mt-3 text-zinc-400 group-hover:text-zinc-300 transition-colors">
								Built GPU-driven platforms reducing operational complexity.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="text-sm text-blue-400/80 font-medium">
								Operational leverage
							</div>
						</CardContent>
					</Card>

					<Card className="group bg-white/5 border-white/10 p-8 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:bg-white/10 hover:shadow-[0_0_60px_rgba(99,102,241,0.18)] hover:border-indigo-500/30">
						<CardHeader className="pb-4">
							<CardTitle className="text-4xl font-bold text-indigo-300 group-hover:text-indigo-200 transition-colors">
								Leadership
							</CardTitle>
							<CardDescription className="mt-3 text-zinc-400 group-hover:text-zinc-300 transition-colors">
								Led engineers and drove system-level thinking across teams.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="text-sm text-indigo-400/80 font-medium">
								Organizational impact
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
