"use client";

import { useScrollReveal } from "@/components/ui/scroll-reveal";

const impacts = [
  {
    title: "AI Systems Architecture",
    description:
      "Architected production-grade RAG and multi-agent systems serving enterprise BFSI clients. Designed agentic frameworks spanning A2A, ACP, and MCP protocols.",
    tag: "Platform Architecture",
  },
  {
    title: "Engineering Leadership",
    description:
      "Led cross-functional engineering squads, mentoring architects and engineers. Fostered a culture of innovation through AI blogs, webinars, and private forums.",
    tag: "Organizational Impact",
  },
  {
    title: "Enterprise Modernization",
    description:
      "Enabled transition from legacy systems to scalable, AI-first architectures. Delivered GPUaaS platforms on NVIDIA Run:AI + OpenShift, reducing operational complexity.",
    tag: "Operational Leverage",
  },
];

export function Impact() {
  const ref = useScrollReveal();

  return (
    <section id="impact" className="py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <div className="reveal">
          <span className="font-mono text-xs uppercase tracking-wide text-amber sm:text-sm">
            Strategic Impact
          </span>
        </div>
        <h2 className="mt-4 max-w-[35ch] font-display text-balance text-4xl font-normal leading-[1.1] tracking-tight text-foreground reveal md:text-5xl">
          Architecting intelligence platforms that move organizations forward.
        </h2>

        <dl className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {impacts.map((item, i) => (
            <div
              key={item.title}
              className={`reveal ${i > 0 ? "sm:border-l sm:border-border/50 sm:pl-12" : "sm:pl-0"}`}
            >
              <dt className="text-sm font-medium text-foreground">
                {item.title}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </dd>
              <dd className="mt-4">
                <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground/60">
                  {item.tag}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
