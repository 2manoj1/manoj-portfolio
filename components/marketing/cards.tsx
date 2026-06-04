import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ServiceCard({
	href,
	title,
	description,
	buyerPain,
	outcomes,
}: {
	href: string;
	title: string;
	description: string;
	buyerPain?: string;
	outcomes: readonly string[];
}) {
	return (
		<Link
			href={href}
			className="group flex min-h-80 flex-col justify-between border border-border p-6 transition-colors hover:bg-secondary/40">
			<div>
				<div className="flex items-start justify-between gap-4">
					<h3 className="max-w-[18ch] text-lg font-medium text-foreground">
						{title}
					</h3>
					<ArrowRight className="mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-amber" />
				</div>
				<p className="mt-5 text-sm leading-7 text-muted-foreground">
					{description}
				</p>
				{buyerPain ? (
					<div className="mt-6 border-t border-border pt-4">
						<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground/60">
							Buyer pain
						</p>
						<p className="mt-2 text-sm leading-6 text-foreground">
							{buyerPain}
						</p>
					</div>
				) : null}
			</div>
			<ul className="mt-8 space-y-2">
				{outcomes.slice(0, 3).map((outcome) => (
					<li key={outcome} className="text-sm leading-6 text-foreground">
						{outcome}
					</li>
				))}
			</ul>
		</Link>
	);
}

export function SystemCard({
	title,
	description,
	flow,
	tradeoffs,
}: {
	title: string;
	description: string;
	flow: readonly string[];
	tradeoffs?: readonly string[];
}) {
	// Deterministic optimization levels for architectural constraints
	const levels: Record<string, string> = {
		"state visibility": "85%",
		"tool safety": "95%",
		"retry behavior": "75%",
		"human control": "90%",
		"chunking": "80%",
		"ranking": "88%",
		"grounding": "95%",
		"latency": "70%",
		"async workloads": "90%",
		"API contracts": "85%",
		"cost controls": "75%",
		"deployment": "80%",
	};

	return (
		<article className="group relative flex h-full flex-col justify-between rounded-xl border border-border/80 bg-zinc-950/40 p-6 shadow-md transition-all duration-300 hover:border-amber/40 hover:bg-zinc-900/20">
			{/* Top glow indicator */}
			<div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

			<div>
				<h3 className="text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-zinc-100">
					{title}
				</h3>
				<p className="mt-3.5 text-sm leading-7 text-muted-foreground">
					{description}
				</p>

				{/* Connected Pipeline Flow */}
				<div className="mt-7">
					<p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
						Execution Pipeline
					</p>
					<div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-1.5">
						{flow.map((step, index) => (
							<div key={step} className="flex items-center gap-1.5">
								<div className="flex items-center gap-1.5 bg-zinc-900/50 border border-zinc-800/80 px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-300 group-hover:border-zinc-700/60 transition-colors">
									<span className="text-[9px] text-zinc-500 font-bold">0{index + 1}</span>
									<span className="font-medium">{step}</span>
								</div>
								{index < flow.length - 1 && (
									<span className="text-zinc-650 group-hover:text-zinc-500 font-mono text-[10px] transition-colors">→</span>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Tradeoffs with metric sliders */}
			{tradeoffs ? (
				<div className="mt-8 border-t border-border/60 pt-5">
					<p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
						Architectural Tradeoffs
					</p>
					<div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5">
						{tradeoffs.map((tradeoff) => {
							const percent = levels[tradeoff] || "80%";
							return (
								<div key={tradeoff} className="flex flex-col gap-1.5">
									<div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 leading-none">
										<span className="truncate pr-1 capitalize">{tradeoff}</span>
										<span className="text-amber/80 font-bold text-[9px] font-mono shrink-0">{percent}</span>
									</div>
									<div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-900/50">
										<div 
											className="absolute left-0 top-0 h-full bg-amber/50 rounded-full transition-all duration-500 group-hover:bg-amber"
											style={{ width: percent }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			) : null}
		</article>
	);
}
