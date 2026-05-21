import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GITHUB } from "@/lib/links";
import { GitHubIcon } from "@/components/marketing/icons";

export function CtaBand({
	title = "Need senior AI architecture judgment?",
	description = "Bring the hard system constraint: retrieval quality, agent failure modes, latency, evaluation, deployment topology, or technical market education.",
}: {
	title?: string;
	description?: string;
}) {
	return (
		<section className="py-24 md:py-32">
			<div className="mx-auto max-w-6xl px-6">
				<div className="border-y border-border py-10 md:py-14">
					<div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
						<div>
							<p className="font-mono text-xs uppercase tracking-wide text-amber">
								Work With Me
							</p>
							<h2 className="mt-4 max-w-[20ch] font-display text-balance text-4xl font-normal leading-[1.05] text-foreground md:text-5xl">
								{title}
							</h2>
							<p className="mt-5 max-w-[68ch] text-base leading-8 text-muted-foreground">
								{description}
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
							<Button
								asChild
								size="lg"
								className="h-11">
								<Link href="/advisory-intake">
									<Calendar className="size-4" />
									Start Advisory Intake
									<ArrowRight className="size-4" />
								</Link>
							</Button>
							<Button asChild variant="secondary" size="lg" className="h-11">
								<a href={GITHUB} target="_blank" rel="noopener noreferrer">
									<GitHubIcon className="size-4" />
									View GitHub
								</a>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
