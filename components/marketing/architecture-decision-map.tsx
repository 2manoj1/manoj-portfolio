import { architectureDecisionMap } from "@/content/site";
import { MotionReveal } from "@/components/marketing/motion-reveal";

export function ArchitectureDecisionMap() {
	return (
		<div className="mt-12 border-y border-border">
			<MotionReveal>
				<div className="grid border-b border-border px-4 py-3 md:grid-cols-[8rem_1fr]">
					<p className="font-mono text-xs uppercase tracking-wide text-amber">
						Decision map
					</p>
					<p className="text-sm text-muted-foreground">
						How production constraints shape architecture choices
					</p>
				</div>
			</MotionReveal>

			<div className="divide-y divide-border">
				{architectureDecisionMap.map((item, index) => (
					<MotionReveal key={item.stage} delay={index * 0.04}>
						<article className="grid gap-5 p-5 md:grid-cols-[8rem_1fr_1fr_1fr]">
							<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/70">
								{item.stage}
							</p>
							<div>
								<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground/60">
									Problem
								</p>
								<p className="mt-2 text-sm leading-6 text-foreground">
									{item.problem}
								</p>
							</div>
							<div>
								<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground/60">
									Decision
								</p>
								<p className="mt-2 text-sm leading-6 text-foreground">
									{item.decision}
								</p>
							</div>
							<div>
								<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground/60">
									Tradeoff
								</p>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									{item.tradeoff}
								</p>
							</div>
						</article>
					</MotionReveal>
				))}
			</div>
		</div>
	);
}
