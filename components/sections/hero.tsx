"use client";

import { Calendar } from "lucide-react";
import { CALENDLY, LINKEDIN } from "@/lib/links";

function LinkedInIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
		</svg>
	);
}

export function Hero() {
	return (
		<header className="relative flex min-h-dvh items-center pt-14">
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute top-1/4 -left-1/4 size-[600px] rounded-full bg-amber/[0.04] blur-3xl dark:bg-amber/[0.02]" />
			</div>

			<div className="mx-auto w-full max-w-6xl px-6 py-24">
				<div className="max-w-3xl">
					{/* Eyebrow */}
					<span className="inline-block font-mono text-xs uppercase tracking-wide text-amber sm:text-sm">
						AI Architect · GenAI Builder &amp; Technology Leader
					</span>

					{/* ✅ FIXED H1 (SEO GOLD) */}
					<h1 className="mt-6 max-w-[22ch] font-display text-balance text-4xl font-normal leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
						Manoj Mukherjee — AI Architect & GenAI Systems Builder
					</h1>

					{/* ✅ IMPROVED CONTENT (KEYWORDS + CONTEXT) */}
					<p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
						I design and build enterprise-grade AI platforms using RAG,
						LangChain, LangGraph, and multi-agent systems. With ~10 years of
						experience, I help organizations scale intelligent automation,
						decision-making, and AI-driven products.
					</p>

					{/* CTA */}
					<div className="mt-10 flex flex-wrap gap-4">
						<a
							href={CALENDLY}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg bg-amber px-4 py-2.5 text-sm font-medium text-amber-foreground hover:brightness-110 active:scale-[0.97]">
							<Calendar className="size-4 shrink-0" />
							Schedule a Conversation
						</a>
						<a
							href={LINKEDIN}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary active:scale-[0.97]">
							<LinkedInIcon className="size-4 shrink-0" />
							Connect on LinkedIn
						</a>
					</div>

					{/* Credibility line */}
					<div className="mt-16 flex items-center gap-3">
						<div className="h-px w-12 bg-amber/30" />
						<span className="text-sm text-muted-foreground">
							~10 Years Experience · AI Systems · GenAI · Enterprise Platforms
						</span>
					</div>
				</div>
			</div>
		</header>
	);
}
