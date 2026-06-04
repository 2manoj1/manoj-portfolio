import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
	id,
	children,
	className,
}: {
	id?: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section id={id} className={cn("min-w-0 py-24 md:py-32", className)}>
			<div className="mx-auto max-w-6xl px-6 min-w-0">
				{children}
			</div>
		</section>
	);
}

export function SectionHeader({
	kicker,
	title,
	description,
	className,
}: {
	kicker: string;
	title: string;
	description?: string;
	className?: string;
}) {
	return (
		<div className={cn("grid min-w-0 gap-6 lg:grid-cols-[0.9fr_1.1fr]", className)}>
			<div className="min-w-0">
				<p className="font-mono text-xs uppercase tracking-wide text-amber">
					{kicker}
				</p>
				<h2 className="mt-4 max-w-full font-display text-balance text-3xl font-normal leading-[1.08] text-foreground sm:max-w-[18ch] sm:text-4xl md:text-5xl md:leading-[1.05]">
					{title}
				</h2>
			</div>
			{description ? (
				<p className="min-w-0 max-w-[68ch] break-words self-end text-pretty text-base leading-8 text-muted-foreground">
					{description}
				</p>
			) : null}
		</div>
	);
}

export function PageHero({
	kicker,
	title,
	description,
	children,
}: {
	kicker: string;
	title: string;
	description: string;
	children?: ReactNode;
}) {
	return (
		<header className="border-b border-border pt-14">
			<div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
				<p className="font-mono text-xs uppercase tracking-wide text-amber">
					{kicker}
				</p>
				<h1 className="mt-5 max-w-[15ch] font-display text-balance text-5xl font-normal leading-[0.96] text-foreground md:text-7xl">
					{title}
				</h1>
				<p className="mt-7 max-w-[68ch] text-pretty text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
					{description}
				</p>
				{children ? <div className="mt-10">{children}</div> : null}
			</div>
		</header>
	);
}
