import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemsConsole } from "@/components/marketing/systems-console";
import { TechStackGrid } from "@/components/marketing/tech-stack-grid";
import { ServiceCard, SystemCard } from "@/components/marketing/cards";
import { CareerJourneySection } from "@/components/marketing/career-journey";
import { CtaBand } from "@/components/marketing/cta-band";
import { GitHubIcon } from "@/components/marketing/icons";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { ProductionProofSection } from "@/components/marketing/production-proof";
import { Section, SectionHeader } from "@/components/marketing/section";
import { TestimonialSlider } from "@/components/marketing/testimonial-slider";
import {
  articles,
  careerJourneyCompact,
  engineeringSystems,
  proofMetrics,
  services,
  testimonials,
} from "@/content/site";
import { GITHUB } from "@/lib/links";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Manoj Mukherjee | AI Architect & GenAI Systems Builder",
  description:
    "CTO-grade AI Architect Consultant for LangGraph multi-agent systems, RAG infrastructure, FastAPI AI backends, and AI platform engineering.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <header className="relative overflow-hidden border-b border-border pt-14">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:88px_88px] opacity-[0.12]" />
        <div className="mx-auto grid min-w-0 max-w-6xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[minmax(0,1.02fr)_minmax(23rem,0.98fr)] lg:items-center">
          <div className="min-w-0">
            <MotionReveal>
              <p className="max-w-full break-words font-mono text-xs uppercase leading-5 tracking-wide text-amber sm:max-w-full">
                Enterprise AI Systems Architect
              </p>
              <div className="mt-6 mb-4 flex items-center gap-3">
                <div className="h-px w-10 bg-amber/60" />
                <span className="text-sm uppercase tracking-[0.22em] text-amber/90 sm:text-base">
                  Manoj Mukherjee
                </span>
              </div>
              <h1 className="mt-6 max-w-full font-display text-balance text-3xl font-normal leading-[0.98] text-foreground sm:max-w-[15ch] sm:text-5xl sm:leading-[0.94] lg:text-6xl">
                <span className="block">Architecting</span>
                <span className="block">Production-Grade</span>
                <span className="block">AI Systems</span>
              </h1>
              <p className="mt-7 max-w-[34ch] text-pretty text-base leading-7 text-muted-foreground md:max-w-[62ch] md:text-xl md:leading-9">
                I help CTOs, AI startups, and platform teams design reliable
                multi-agent systems, enterprise RAG infrastructure, and FastAPI
                AI backends.
                <span className="mt-4 block">
                  The focus is production-grade AI systems built for real-world
                  scale, latency, reliability, and governance constraints.
                </span>
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-11 w-full sm:w-auto">
                  <Link href="/advisory-intake">
                    <Calendar className="size-4" />
                    Start Architecture Review
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="h-11 w-full sm:w-auto"
                >
                  <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon className="size-4" />
                    View Engineering Proof
                  </a>
                </Button>
              </div>
              <p className="mt-5 max-w-[32ch] text-sm leading-6 text-muted-foreground sm:max-w-full md:max-w-[58ch]">
                Best fit for: AI architecture audits, LangGraph orchestration
                consulting, RAG reliability reviews, fractional AI architect
                retainers, and DevRel engineering partnerships.
              </p>
            </MotionReveal>
          </div>

          <MotionReveal delay={0.1}>
            <SystemsConsole />
          </MotionReveal>

          <MotionReveal
            delay={0.08}
            className="grid border-y border-border md:grid-cols-4 lg:col-span-2"
          >
            {proofMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`py-5 md:px-6 ${
                  index > 0
                    ? "border-t border-border md:border-t-0 md:border-l"
                    : ""
                }`}
              >
                <p className="font-display text-3xl text-foreground">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            ))}
          </MotionReveal>
        </div>
      </header>

      <ProductionProofSection />

      <Section>
        <MotionReveal>
          <SectionHeader
            kicker="Services"
            title="Premium AI architecture work for technical buyers."
            description="The offer is not generic implementation help. It is architecture, reliability, platform design, and technical market credibility for teams where AI has become a product and infrastructure problem."
          />
        </MotionReveal>
        <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((service, index) => (
            <MotionReveal key={service.slug} delay={index * 0.03}>
              <ServiceCard
                href="/advisory-intake"
                title={service.title}
                description={service.description}
                buyerPain={service.buyerPain}
                outcomes={service.outcomes}
              />
            </MotionReveal>
          ))}
        </div>
        <MotionReveal>
          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/services">
                View All Consulting Services
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </MotionReveal>
      </Section>

      <Section className="border-y border-border bg-secondary/20">
        <MotionReveal>
          <SectionHeader
            kicker="Engineering Authority"
            title="The work is architecture, not AI theater."
            description="A credible AI platform needs more than a model call. It needs retrieval quality, state management, evaluation, deployment constraints, failure handling, and observability designed from the start."
          />
        </MotionReveal>
        <div className="mt-14 grid gap-3 lg:grid-cols-3">
          {engineeringSystems.map((system, index) => (
            <MotionReveal key={system.slug} delay={index * 0.04}>
              <SystemCard
                title={system.title}
                description={system.description}
                flow={system.flow}
                tradeoffs={system.tradeoffs}
              />
            </MotionReveal>
          ))}
        </div>
        <MotionReveal>
          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/engineering">
                Explore Engineering Details & Decision Map
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </MotionReveal>
      </Section>

      <CtaBand
        title="Need an architecture review before AI decisions harden?"
        description="Use the advisory intake for RAG quality, agent reliability, platform backend, deployment, observability, or DevRel architecture questions."
      />

      <Section>
        <MotionReveal>
          <SectionHeader
            kicker="Technical Surface"
            title="A modern AI platform stack, grounded in delivery."
            description="Hands-on across the ecosystem needed to move from POC to production: orchestration, retrieval, backend services, deployment, and developer education."
          />
        </MotionReveal>
        <MotionReveal>
          <TechStackGrid />
        </MotionReveal>
      </Section>

      <CareerJourneySection items={careerJourneyCompact} showMoreButton={true} />

      <Section className="border-y border-border">
        <MotionReveal>
          <SectionHeader
            kicker="Trust"
            title="People I’ve worked closely with."
            description="Thoughts from engineers, leaders, and collaborators across production systems, architecture, and platform engineering."
          />
        </MotionReveal>
        <MotionReveal delay={0.06}>
          <TestimonialSlider testimonials={testimonials} />
        </MotionReveal>
      </Section>

      <Section>
        <MotionReveal>
          <SectionHeader
            kicker="Writing"
            title="Technical content for senior builders."
            description="Writing focuses on AI infrastructure, local agentic workflows, LangGraph systems, and practical implementation choices."
          />
        </MotionReveal>
        <div className="mt-14 divide-y divide-border">
          {articles.slice(0, 3).map((article) => (
            <a
              key={article.title}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-4 py-6 first:pt-0 md:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/60">
                  {article.topic} / {article.date}
                </p>
                <h3 className="mt-2 text-base font-medium text-foreground group-hover:text-amber">
                  {article.title}
                </h3>
              </div>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-amber md:mt-8" />
            </a>
          ))}
        </div>
        <MotionReveal>
          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">
                Read All Writing
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </MotionReveal>
      </Section>

      <CtaBand
        title="Bring the AI system constraint."
        description="If the challenge involves LangGraph orchestration, RAG infrastructure, FastAPI AI backends, AI platform engineering, or technical DevRel, start with the system context."
      />
    </>
  );
}
