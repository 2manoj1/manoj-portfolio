"use client";

import { useScrollReveal } from "@/components/ui/scroll-reveal";

const principles = [
  {
    title: "Unified Intelligence",
    description:
      "Breaking silos between data, agents, and operations into one coherent platform.",
  },
  {
    title: "Operational Clarity",
    description:
      "Turning fragmented systems into observable, dependable architectures.",
  },
  {
    title: "Organizational Leverage",
    description:
      "Building systems that amplify teams, not just automate tasks.",
  },
];

export function Vision() {
  const ref = useScrollReveal();

  return (
    <section id="vision" className="py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <div className="reveal">
          <span className="font-mono text-xs uppercase tracking-wide text-amber sm:text-sm">
            Leadership Philosophy
          </span>
        </div>
        <h2 className="mt-4 max-w-[24ch] font-display text-balance text-4xl font-normal leading-[1.1] tracking-tight text-foreground reveal md:text-5xl">
          I don&apos;t just build systems. I design how systems think.
        </h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-6 reveal">
            <p className="max-w-[48ch] text-pretty text-base leading-relaxed text-muted-foreground">
              I began in product engineering, then shifted to architecting
              systems where AI, data, and workflows converge into a single
              operational layer.
            </p>
            <p className="max-w-[48ch] text-pretty text-base leading-relaxed text-muted-foreground">
              Today I design platforms that make intelligence composable,
              observable, and dependable, across engineering, operations,
              and product.
            </p>
            <p className="max-w-[48ch] text-pretty text-base leading-relaxed text-muted-foreground">
              I help leadership turn technical complexity into clarity, building
              systems that scale teams as much as they scale code.
            </p>
          </div>

          <div className="flex flex-col">
            {principles.map((p, i) => (
              <div
                key={p.title}
                className={`reveal ${i > 0 ? "border-t border-border/50 pt-6 mt-6" : ""}`}
              >
                <h3 className="text-sm font-medium text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1.5 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
