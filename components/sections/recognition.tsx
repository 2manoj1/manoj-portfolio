"use client";

import { useScrollReveal } from "@/components/ui/scroll-reveal";

const awards = [
  {
    title: "ASPIRE Speed Hackathon 2024",
    subtitle: "GenAI Semifinalist",
    issuer: "Publicis Sapient",
  },
  {
    title: "FS West Supernova 2023",
    subtitle: "Innovation & Dialogue",
    issuer: "Publicis Sapient",
  },
  {
    title: "Star Award",
    subtitle: "Anchor Ecosystem",
    issuer: "A.P. Moller · Maersk",
  },
  {
    title: "University 3rd Rank",
    subtitle: "BCA (Honours)",
    issuer: "University of Burdwan",
  },
];

const testimonials = [
  {
    quote:
      "Manoj brings a collaborative and supportive approach to everything he does. He actively mentors new team members, shares knowledge openly, and creates an environment where others can thrive.",
    author: "Prabhat Y.",
    role: "Engineering Colleague, Publicis Sapient",
  },
  {
    quote:
      "You Are Creative Problem Solver: Working with Manoj, I've witnessed his way of identifying, analyzing, and resolving issues. It encompasses a range of activities, including understanding requirements, designing solutions, implementing code, testing, and debugging.",
    author: "Amit S.",
    role: "Engineering Colleague, Publicis Sapient",
  },
];

export function Recognition() {
  const ref = useScrollReveal();

  return (
    <section className="py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <div className="reveal">
          <span className="font-mono text-xs uppercase tracking-wide text-amber sm:text-sm">
            Recognition
          </span>
        </div>
        <h2 className="mt-4 max-w-[24ch] font-display text-balance text-4xl font-normal leading-[1.1] tracking-tight text-foreground reveal md:text-5xl">
          Acknowledged for impact and leadership.
        </h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          <dl className="flex flex-col divide-y divide-border/50">
            {awards.map((award) => (
              <div key={award.title} className="reveal py-5 first:pt-0 last:pb-0">
                <dt className="text-sm font-medium text-foreground">
                  {award.title}
                </dt>
                <dd className="mt-0.5 text-sm text-muted-foreground">
                  {award.subtitle}
                </dd>
                <dd className="mt-1 font-mono text-xs uppercase tracking-wide text-muted-foreground/60">
                  {award.issuer}
                </dd>
              </div>
            ))}
          </dl>

          <div className="reveal flex flex-col gap-8">
            {testimonials.map((t) => (
              <blockquote key={t.author} className="flex flex-col">
                <p className="text-pretty text-sm leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-4 flex items-baseline gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {t.author}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t.role}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
