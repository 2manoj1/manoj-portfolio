"use client";

import { useScrollReveal } from "@/components/ui/scroll-reveal";
import { ExternalLink } from "lucide-react";
import { MEDIUM, GOOGLE_SCHOLAR } from "@/lib/links";
import { articles } from "@/content/site";

const leadArticles = articles.filter(a => a.description).slice(0, 5);

export function ThoughtLeadership() {
	const ref = useScrollReveal();

	return (
		<section id="writing" className="py-24 md:py-32">
			<div ref={ref} className="mx-auto max-w-6xl px-6">
				<div className="reveal">
					<span className="font-mono text-xs uppercase tracking-wide text-amber sm:text-sm">
						Thought Leadership
					</span>
				</div>
				<h2 className="mt-4 max-w-[20ch] font-display text-balance text-4xl font-normal leading-[1.1] tracking-tight text-foreground reveal md:text-5xl">
					Writing about the systems I build.
				</h2>

				<div className="mt-16 flex flex-col divide-y divide-border/50">
					{leadArticles.map((article) => (
						<a
							key={article.title}
							href={article.url}
							target="_blank"
							rel="noopener noreferrer"
							className="reveal group py-8 first:pt-0 last:pb-0">
							<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
								<h3 className="text-sm font-medium text-foreground group-hover:text-amber">
									{article.title}
								</h3>
								<span className="shrink-0 font-mono text-xs uppercase tracking-wide text-muted-foreground/60">
									{article.date}
								</span>
							</div>
							<p className="mt-2 max-w-[56ch] text-pretty text-sm leading-relaxed text-muted-foreground">
								{article.description}
							</p>
							<span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber">
								Read on Medium
								<ExternalLink className="size-3 shrink-0" />
							</span>
						</a>
					))}
				</div>

				<div className="mt-10 reveal flex flex-wrap items-center gap-x-6 gap-y-2">
					<a
						href={MEDIUM}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
						View all articles on Medium
						<ExternalLink className="size-3.5 shrink-0" />
					</a>
					<a
						href={GOOGLE_SCHOLAR}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
						View research on Google Scholar
						<ExternalLink className="size-3.5 shrink-0" />
					</a>
				</div>
			</div>
		</section>
	);
}
