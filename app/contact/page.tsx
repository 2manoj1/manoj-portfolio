import Link from "next/link";
import { Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { CALENDLY, EMAIL, GITHUB, LINKEDIN, MEDIUM } from "@/lib/links";
import { createMetadata } from "@/lib/seo";

const links = [
	{ label: "LinkedIn", href: LINKEDIN },
	{ label: "GitHub", href: GITHUB },
	{ label: "Medium", href: MEDIUM },
];

export const metadata = createMetadata({
	title: "Contact Manoj Mukherjee | AI Architect Consultant",
	description:
		"Contact Manoj Mukherjee for AI architecture advisory, LangGraph consulting, RAG infrastructure, AI platform engineering, or DevRel engineering partnerships.",
	path: "/contact",
});

export default function ContactPage() {
	return (
		<>
			<PageHero
				kicker="Contact"
				title="Start with context, not a generic form."
				description="For consulting, advisory, DevRel partnerships, or technical writing, send the system context and the decision you need to make next."
			>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button
						asChild
						size="lg"
						className="h-11">
						<a href={CALENDLY} target="_blank" rel="noopener noreferrer">
							<Calendar className="size-4" />
							Book a Review
						</a>
					</Button>
					<Button asChild variant="secondary" size="lg" className="h-11">
						<a href={`mailto:${EMAIL.trim()}`}>
							<Mail className="size-4" />
							Email Manoj
						</a>
					</Button>
				</div>
			</PageHero>
			<Section>
				<SectionHeader
					kicker="Routing"
					title="For serious AI work, use the advisory intake."
					description="The intake page gives you the exact questions to answer before a productive architecture conversation."
				/>
				<div className="mt-10 flex flex-wrap gap-3">
					<Button asChild>
						<Link href="/advisory-intake">Open Advisory Intake</Link>
					</Button>
					{links.map((link) => (
						<Button key={link.href} asChild variant="secondary">
							<a href={link.href} target="_blank" rel="noopener noreferrer">
								{link.label}
							</a>
						</Button>
					))}
				</div>
			</Section>
		</>
	);
}
