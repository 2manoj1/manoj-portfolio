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
		<section id="impact" className="relative py-32 px-6">
			<div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_35%)]" />
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 max-w-4xl">
					<p className="text-sm uppercase tracking-[0.4em] text-cyan-300/90 font-semibold">
						Systems Impact
					</p>
					<h2 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
						Architecting intelligence that
						<span className="block text-cyan-400">transforms enterprises</span>.
					</h2>
					<p className="mt-8 text-xl leading-9 text-zinc-300 sm:text-2xl">
						Every system I build reduces cognitive overhead, accelerates
						automation, and scales the people building them. These are the
						measurable outcomes.
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					<Card className="group bg-white/5 border-white/10 p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/30">
						<CardHeader className="pb-4">
							<CardTitle className="text-4xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
								10+
							</CardTitle>
							<CardDescription className="mt-3 text-zinc-400 group-hover:text-zinc-300 transition-colors">
								AI-native platforms architected for product, automation, and
								revenue generation.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="text-sm text-cyan-400/80 font-medium">
								Enterprise-scale systems
							</div>
						</CardContent>
					</Card>

					<Card className="group bg-white/5 border-white/10 p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/30">
						<CardHeader className="pb-4">
							<CardTitle className="text-4xl font-bold text-blue-300 group-hover:text-blue-200 transition-colors">
								5x
							</CardTitle>
							<CardDescription className="mt-3 text-zinc-400 group-hover:text-zinc-300 transition-colors">
								Automation velocity improvement across ML pipelines, retrieval
								systems, and deployment workflows.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="text-sm text-blue-400/80 font-medium">
								Operational efficiency
							</div>
						</CardContent>
					</Card>

					<Card className="group bg-white/5 border-white/10 p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/30">
						<CardHeader className="pb-4">
							<CardTitle className="text-4xl font-bold text-indigo-300 group-hover:text-indigo-200 transition-colors">
								30+
							</CardTitle>
							<CardDescription className="mt-3 text-zinc-400 group-hover:text-zinc-300 transition-colors">
								Engineering leaders and teams mentored in AI architecture,
								product delivery, and systems thinking.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="text-sm text-indigo-400/80 font-medium">
								Leadership development
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
