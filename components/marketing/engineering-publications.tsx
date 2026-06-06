"use client";

import { Calendar, ArrowUpRight, BookOpen } from "lucide-react";
import { siteConfig, publications } from "@/content/site";

export function EngineeringPublications() {
	return (
		<div className="space-y-8">
			{/* Publications Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{publications.map((pub) => (
					<article 
						key={pub.title}
						className="group flex flex-col justify-between rounded-xl border border-border bg-card/25 p-5 md:p-6 shadow-sm hover:border-amber/40 hover:bg-secondary/20 transition-all duration-300 relative overflow-hidden"
					>
						{pub.url && (
							<a
								href={pub.url}
								target={pub.url.startsWith("/") ? undefined : "_blank"}
								rel={pub.url.startsWith("/") ? undefined : "noopener noreferrer"}
								className="absolute inset-0 z-10"
								aria-label={`Read spec: ${pub.title}`}
							/>
						)}
						<div className="space-y-4">
							{/* Top Metadata */}
							<div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
								<span className="flex items-center gap-1.5 text-amber">
									<BookOpen className="size-3.5" />
									{pub.topic}
								</span>
								<span className="flex items-center gap-1">
									<Calendar className="size-3" />
									{pub.year}
								</span>
							</div>

							<div>
								<h4 className="text-base font-normal text-foreground group-hover:text-amber transition-colors leading-snug">
									{pub.title}
								</h4>
								<span className="mt-0.5 block font-mono text-[9px] text-muted-foreground/60 dark:text-white/40 uppercase tracking-widest">
									{pub.platform}
								</span>
							</div>

							<p className="text-xs leading-relaxed text-muted-foreground">
								{pub.description}
							</p>

							{/* Contribution note */}
							<div className="rounded bg-secondary/30 p-3 border border-border/50 text-[11px] leading-relaxed text-muted-foreground/90 font-sans">
								<span className="font-mono text-[9px] uppercase font-bold text-foreground block mb-0.5 tracking-wider">
									Architectural Impact:
								</span>
								{pub.contribution}
							</div>
						</div>

						{/* Tags footer */}
						<div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap gap-1">
							{pub.tags.map((tag) => (
								<span 
									key={tag}
									className="rounded bg-secondary/80 dark:bg-zinc-950 border border-border px-2 py-0.5 font-mono text-[8px] tracking-wider text-muted-foreground hover:text-foreground transition-colors"
								>
									{tag}
								</span>
							))}
						</div>
					</article>
				))}
			</div>

			{/* Link Footer */}
			<div className="flex justify-center pt-2">
				<a
					href={siteConfig.profileLinks.googleScholar}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 hover:bg-secondary px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all duration-300"
				>
					<span>View Scholar Citations & Publications</span>
					<ArrowUpRight className="size-3.5" />
				</a>
			</div>
		</div>
	);
}
