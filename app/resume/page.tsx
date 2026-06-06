import Link from "next/link";
import { ArrowLeft, Download, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
	title: "Professional Resume | Manoj Mukherjee",
	description:
		"Professional systems architecture resume for Manoj Mukherjee, detailing 10+ years of engineering leadership, Agentic RAG systems, and AI platform infrastructure.",
	path: "/resume",
});

export default function ResumePage() {
	return (
		<main className="min-h-screen bg-background pt-20 pb-16">
			<div className="mx-auto max-w-5xl px-6">
				{/* Top Navigation & Info */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6 mb-8">
					<div>
						<Link
							href="/about"
							className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-2"
						>
							<ArrowLeft className="size-3" />
							BACK TO ABOUT
						</Link>
						<h1 className="text-2xl font-display font-medium text-foreground flex items-center gap-2">
							<FileText className="size-5 text-amber" />
							Professional Resume
						</h1>
						<p className="text-xs text-muted-foreground mt-1">
							Manoj Mukherjee &middot; 10+ YOE &middot; AI Systems Architect & Advisor
						</p>
					</div>

					<div className="flex items-center gap-2.5">
						<Button asChild size="xs" variant="outline" className="text-xs font-medium">
							<a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
								<ExternalLink className="size-3" />
								Open PDF
							</a>
						</Button>
						<Button asChild size="xs" className="text-xs font-medium bg-amber hover:bg-amber/90">
							<a href="/resume.pdf" download="Manoj_Mukherjee_AI_Architect_Resume.pdf">
								<Download className="size-3" />
								Download PDF
							</a>
						</Button>
					</div>
				</div>

				{/* PDF Viewer Container */}
				<div className="relative rounded-lg border border-border/80 bg-secondary/50 shadow-2xl p-1.5 md:p-3 overflow-hidden backdrop-blur-sm">
					{/* Status Bar */}
					<div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2 px-1 text-xs text-muted-foreground">
						<span className="flex items-center gap-1.5 font-medium">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
							Verified Production Experience
						</span>
						<span className="text-[11px] text-muted-foreground/60">Last updated: June 2026</span>
					</div>

					{/* Embedded PDF Viewer Iframe - Desktop Only */}
					<div className="hidden md:flex w-full bg-card rounded border border-border/50 overflow-hidden h-[800px] items-center justify-center">
						<iframe
							src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=1"
							className="w-full h-full border-none"
							title="Manoj Mukherjee Systems Architecture Resume PDF"
						/>
					</div>

					{/* Mobile Helper - Mobile Only */}
					<div className="md:hidden flex flex-col items-center justify-center text-center p-6 bg-card rounded border border-border/50 min-h-[420px]">
						<div className="size-14 rounded-full bg-amber/10 flex items-center justify-center mb-5 ring-1 ring-amber/20">
							<FileText className="size-6 text-amber" />
						</div>
						<h2 className="text-sm font-semibold text-foreground">Interactive PDF View</h2>
						<p className="text-[11px] text-muted-foreground mt-2.5 max-w-[32ch] leading-relaxed">
							Mobile browsers don&apos;t always support smooth interactive PDF scrolling. For the best reading experience, open the PDF directly or download a copy.
						</p>

						<div className="mt-8 flex flex-col gap-2.5 w-full max-w-[260px]">
							<Button asChild size="xs" className="w-full bg-amber text-amber-foreground hover:bg-amber/90 font-medium">
								<a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
									<ExternalLink className="size-3.5 mr-1.5" />
									Open PDF Fullscreen
								</a>
							</Button>
							<Button asChild size="xs" variant="outline" className="w-full bg-background/50 hover:bg-background">
								<a href="/resume.pdf" download="Manoj_Mukherjee_AI_Architect_Resume.pdf">
									<Download className="size-3.5 mr-1.5" />
									Download PDF copy
								</a>
							</Button>
						</div>

						{/* Quick Summary Grid */}
						<div className="mt-8 pt-6 border-t border-border/30 w-full text-left text-xs text-muted-foreground/80 space-y-1.5">
							<div className="text-foreground font-semibold mb-2">Resume Highlights:</div>
							<div><strong className="text-foreground/90 font-medium">Name:</strong> Manoj Mukherjee</div>
							<div><strong className="text-foreground/90 font-medium">Focus:</strong> AI Platform Engineering & advisory</div>
							<div><strong className="text-foreground/90 font-medium">Stack:</strong> LangGraph, RAG, FastAPI, pgvector</div>
							<div><strong className="text-foreground/90 font-medium">History:</strong> Publicis Sapient, Kotak, Maersk</div>
						</div>
					</div>
				</div>

				{/* Bottom Footer Info */}
				<div className="mt-6 text-center text-xs text-muted-foreground/40">
					<span>Official Systems Resume &middot; Bengaluru, India</span>
				</div>
			</div>
		</main>
	);
}
