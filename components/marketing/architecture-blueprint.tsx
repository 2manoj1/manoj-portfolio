import { architectureBlueprint } from "@/content/site";

export function ArchitectureBlueprint() {
	return (
		<aside
			aria-label="Production AI architecture blueprint"
			className="min-w-0 overflow-hidden border border-border bg-background/80 backdrop-blur-sm">
			
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
				<p className="min-w-0 break-words font-mono text-xs uppercase tracking-[0.22em] text-amber">
					Production AI Architecture
				</p>

				<p className="hidden min-w-0 break-words font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60 sm:block">
					Design → Operate → Scale
				</p>
			</div>

			{/* Blueprint Steps */}
			<ol className="divide-y divide-border">
				{architectureBlueprint.map((item, index) => (
					<li
						key={item.step}
						className="grid gap-3 px-4 py-4 transition-colors duration-300 hover:bg-secondary/20 sm:grid-cols-[3rem_1fr]">
						
						{/* Step Number */}
						<span className="font-mono text-[10px] tracking-[0.2em] mt-2 text-amber/70">
							0{index + 1}
						</span>

						<div className="min-w-0">
							
							{/* Category */}
							<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber/60">
								{item.category}
							</span>

							{/* Title */}
							<p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
								{item.step}
							</p>

							{/* Description */}
							<p className="mt-2 max-w-[34ch] break-words text-xs leading-4 text-muted-foreground sm:max-w-none">
								{item.detail}
							</p>
						</div>
					</li>
				))}
			</ol>
		</aside>
	);
}