import Link from "next/link";
import { ArrowRight, Clock3, MonitorPlay, Radio, ShieldCheck } from "lucide-react";
import { PageHero, Section } from "@/components/marketing/section";
import { lectures } from "@/content/lectures/catalog";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
	title: "Lecture Studio | Interactive Technology Lectures",
	description:
		"Interactive, production-minded technology lectures by Manoj Mukherjee, combining live browser simulations, enterprise architecture, verified industry cases, and presenter guidance.",
	path: "/lectures",
	keywords: [
		"Interactive Technology Lecture",
		"Blockchain University Lecture",
		"Technical Speaker Bengaluru",
		"Developer Education",
	],
});

export default function LecturesPage() {
	return (
		<>
			<PageHero
				kicker="Manoj Lecture Studio"
				title="Technical lectures that behave like systems."
				description="Projector-first learning experiences with live simulations, architecture decisions, verified industry evidence, and reusable presenter controls—not exported slide decks."
			/>

			<Section className="bg-card/5 py-16 md:py-20">
				<div className="grid gap-5">
					{lectures.map((lecture) => (
						<article key={lecture.slug} className="group relative overflow-hidden rounded-[18px] border border-border bg-background p-6 transition hover:border-amber/45 md:p-8">
							<div className="absolute inset-y-0 left-0 w-1 bg-amber/70" />
							<div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
								<div>
									<div className="flex flex-wrap gap-2">
										<span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground"><Clock3 className="size-3 text-amber" /> {lecture.totalMinutes} minutes</span>
										<span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground"><MonitorPlay className="size-3 text-amber" /> {lecture.scenes.length} scenes</span>
										<span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground"><ShieldCheck className="size-3 text-amber" /> Offline demos after load</span>
									</div>
									<p className="mt-6 font-mono text-xs uppercase tracking-wide text-amber">University lecture · Interactive</p>
									<h2 className="mt-3 max-w-[22ch] text-balance font-display text-3xl leading-tight text-foreground md:text-5xl">{lecture.title}</h2>
									<p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">{lecture.description}</p>
									<p className="mt-4 text-sm text-muted-foreground">{lecture.audience}</p>
								</div>
								<Link href={`/lectures/${lecture.slug}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber px-5 text-sm font-semibold text-amber-foreground transition hover:bg-amber/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber">
									<Radio className="size-4" /> Launch lecture <ArrowRight className="size-4" />
								</Link>
							</div>
						</article>
					))}
				</div>
			</Section>
		</>
	);
}
