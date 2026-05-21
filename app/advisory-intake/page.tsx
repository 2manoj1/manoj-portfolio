import { Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { CALENDLY, EMAIL } from "@/lib/links";
import { createMetadata } from "@/lib/seo";

const questions = [
	"What are you building, and who uses it?",
	"Where is the system today: idea, prototype, pilot, or production?",
	"Which constraint hurts most: retrieval quality, agent reliability, latency, cost, observability, security, or adoption?",
	"What is the current stack: models, vector DB, backend, cloud, deployment, and eval tooling?",
	"What decision do you need help making in the next 30 days?",
];

const fit = [
	"AI product moving from prototype to production",
	"RAG system with quality, grounding, or latency issues",
	"Agent workflow that needs state, tools, and observability",
	"AI infra company needing credible DevRel engineering assets",
	"Founder or CTO seeking fractional architecture judgment",
];

export const metadata = createMetadata({
	title: "Advisory Intake | Work With Manoj Mukherjee",
	description:
		"Request an AI architecture review for RAG infrastructure, LangGraph multi-agent systems, FastAPI AI backends, AI platform engineering, or DevRel engineering.",
	path: "/advisory-intake",
});

export default function AdvisoryIntakePage() {
	return (
		<>
			<PageHero
				kicker="Advisory Intake"
				title="Start with the system constraint."
				description="The best conversations are specific. Bring the architecture problem, the stack, the current failure mode, and the decision you need to make next."
			>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button
						asChild
						size="lg"
						className="h-11">
						<a href={CALENDLY} target="_blank" rel="noopener noreferrer">
							<Calendar className="size-4" />
							Book Architecture Review
						</a>
					</Button>
					<Button asChild variant="secondary" size="lg" className="h-11">
						<a href={`mailto:${EMAIL.trim()}`}>
							<Mail className="size-4" />
							Email Manoj with Context
						</a>
					</Button>
				</div>
			</PageHero>
			<Section>
				<div className="grid gap-12 lg:grid-cols-2">
					<div>
						<SectionHeader
							kicker="Qualification"
							title="Good fit if the problem is real."
							description="This intake intentionally filters for serious technical buyers and teams with a production path."
							className="lg:block"
						/>
						<ul className="mt-10 space-y-3">
							{fit.map((item) => (
								<li key={item} className="border border-border p-4 text-sm text-foreground">
									{item}
								</li>
							))}
						</ul>
					</div>
					<div className="border-y border-border">
						<div className="border-b border-border p-6">
							<p className="font-mono text-xs uppercase tracking-wide text-amber">
								Send this context
							</p>
						</div>
						<ol className="divide-y divide-border">
							{questions.map((question, index) => (
								<li key={question} className="grid gap-4 p-6 sm:grid-cols-[3rem_1fr]">
									<span className="font-mono text-xs text-muted-foreground/60">
										0{index + 1}
									</span>
									<p className="text-sm leading-7 text-muted-foreground">
										{question}
									</p>
								</li>
							))}
						</ol>
					</div>
				</div>
			</Section>
		</>
	);
}
