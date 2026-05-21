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
		<section id={id} className={cn("py-24 md:py-32", className)}>
			<div className="mx-auto max-w-6xl px-6">{children}</div>
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
		<div className={cn("grid gap-6 lg:grid-cols-[0.9fr_1.1fr]", className)}>
			<div>
				<p className="font-mono text-xs uppercase tracking-wide text-amber">
					{kicker}
				</p>
				<h2 className="mt-4 max-w-[18ch] font-display text-balance text-4xl font-normal leading-[1.05] text-foreground md:text-5xl">
					{title}
				</h2>
			</div>
			{description ? (
				<p className="max-w-[68ch] self-end text-pretty text-base leading-8 text-muted-foreground">
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
