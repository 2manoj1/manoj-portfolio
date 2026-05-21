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
	return (
		<article className="border border-border p-6">
			<h3 className="text-lg font-medium text-foreground">{title}</h3>
			<p className="mt-4 text-sm leading-7 text-muted-foreground">
				{description}
			</p>
			<ol className="mt-8 grid gap-2 sm:grid-cols-2">
				{flow.map((step, index) => (
					<li key={step} className="border border-border/70 p-3">
						<span className="font-mono text-[11px] text-muted-foreground/60">
							0{index + 1}
						</span>
						<p className="mt-3 text-sm font-medium text-foreground">{step}</p>
					</li>
				))}
			</ol>
			{tradeoffs ? (
				<div className="mt-6 border-t border-border pt-5">
					<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground/60">
						Tradeoffs
					</p>
					<div className="mt-3 flex flex-wrap gap-2">
						{tradeoffs.map((tradeoff) => (
							<span
								key={tradeoff}
								className="rounded-md border border-border/70 px-2.5 py-1 text-xs text-muted-foreground">
								{tradeoff}
							</span>
						))}
					</div>
				</div>
			) : null}
		</article>
	);
}
