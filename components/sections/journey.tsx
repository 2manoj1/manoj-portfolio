"use client";

import Image from "next/image";
import { useScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

function CompanyLogo({
  src,
  size = "md",
}: {
  src: string;
  size?: "sm" | "md" | "lg";
}) {
  const dimensions = {
    sm: { outer: "size-8", inner: 16, padding: "p-1.5" },
    md: { outer: "size-10", inner: 20, padding: "p-2" },
    lg: { outer: "size-12", inner: 24, padding: "p-2.5" },
  };

  const d = dimensions[size];

  return (
    <div
      className={cn(
        "shrink-0 rounded-lg bg-muted/50",
        d.outer,
        d.padding
      )}
    >
      <Image
        src={src}
        alt=""
        width={d.inner}
        height={d.inner}
        className="size-full object-contain"
      />
    </div>
  );
}

const experiences = [
  {
    company: "Publicis Sapient",
    title: "Technical Lead",
    type: "Full-time",
    period: "Mar 2023 – Present",
    duration: "3 yrs 2 mos",
    location: "Bengaluru, Karnataka, India · Hybrid",
    current: true,
    logo: "/logos/publicis_sapient.webp",
    summary:
      "Architecting enterprise-grade GenAI platforms using Agentic RAG, multi-agent systems, and cloud-native architectures. Led design and delivery of scalable AI systems enabling enterprise adoption of AI-first solutions.",
    highlights: [
      "Built LangGraph-based multi-agent systems with MCP integrations for dynamic AI workflows",
      "Architected hybrid search using pgvector + MongoDB for improved retrieval and context",
      "Designed long-term memory and contextual retrieval pipelines",
      "Developed AI microservices using FastAPI (Python, uv) with containerized deployments",
      "Built full-stack AI apps with Next.js, TypeScript, and AI SDKs",
      "Deployed AI workloads on Docker & Kubernetes",
    ],
    tags: [
      "NVIDIA Run:AI",
      "LangChain",
      "LangGraph",
      "Google ADK",
      "MCP/ACP/UCP",
      "Vertex AI",
      "vLLM",
      "Ollama",
    ],
  },
  {
    company: "Kotak Mahindra Bank",
    title: "Chief Manager (SDE - III)",
    type: "Full-time",
    period: "Sep 2022 – Feb 2023",
    duration: "6 mos",
    location: "Bengaluru, Karnataka, India · Hybrid",
    current: false,
    logo: "/logos/kotak_mahindra_bank_logo.webp",
    summary:
      "Part of the early decision-making and R&D team for the Kotak811 mobile banking platform. Collaborated on building secure and scalable mobile banking features with focus on fraud detection, security, and compliance.",
    highlights: [
      "React Native developer for Kotak811 digital banking platform",
      "Guided external/vendor engineering teams on frontend best practices and architecture",
      "Engaged in UPI 2.0 integration and design discussions",
      "Participated in product and architecture discussions with CTO and business stakeholders",
    ],
    tags: ["React.js", "TypeScript", "React Native", "UPI 2.0"],
  },
  {
    company: "A.P. Moller - Maersk",
    title: "Software Engineer III",
    type: "Full-time",
    period: "Aug 2021 – Aug 2022",
    duration: "1 yr 1 mo",
    location: "Bengaluru, Karnataka, India · Hybrid",
    current: false,
    logo: "/logos/maersk_group_logo.webp",
    summary:
      "Developed scalable frontend applications using React and Next.js. Key contributor in establishing microfrontend architecture using Module Federation. Received the Star Award for technical contributions.",
    highlights: [
      "Established microfrontend architecture using Module Federation",
      "Enabled early adoption of Next.js Module Federation (next-mf)",
      "Contributed to Server-Side Rendering (SSR) capabilities for microfrontends",
      "Key role in shaping the Anchor Design System within Maersk's React ecosystem",
      "Star Award recipient — June 2022",
    ],
    tags: ["Cypress.io", "React.js", "Next.js", "Module Federation", "SSR"],
  },
  {
    company: "Krista Software",
    title: "Senior Software Engineer / Founding Engineer",
    type: "Full-time",
    period: "Jun 2020 – Jul 2021",
    duration: "1 yr 2 mos",
    location: "Bengaluru, Karnataka, India · Remote",
    current: false,
    logo: "/logos/antbrains_logo.webp",
    summary:
      "Founding member of the core engineering team for an AI-driven automation platform. Developed and scaled cross-platform mobile and web applications using the Ionic Framework.",
    highlights: [
      "Founding member of core engineering team for AI-driven automation platform",
      "Led functional development and conducted code reviews",
      "GA Award recipient for outstanding contributions and impact",
    ],
    tags: ["React.js", "TypeScript", "Ionic Framework"],
  },
  {
    company: "Optiv Inc",
    title: "Software Engineer",
    type: "Full-time",
    period: "Jun 2019 – Jun 2020",
    duration: "1 yr 1 mo",
    location: "Greater Bengaluru Area · On-site",
    current: false,
    logo: "/logos/optiv_inc_logo.webp",
    summary:
      "Collaborated with the innovation engineering team to build internal platforms using React.js, Redux, GraphQL, Node.js, and Express. Developed cybersecurity-focused dashboards and internal analytics tools.",
    highlights: [
      "Developed cybersecurity dashboards and internal analytics tools",
      "Early-stage adoption of GraphQL for modern API design",
      "Built backend services using Express.js with MongoDB and Mongoose ORM",
      "Optimized frontend performance by improving Webpack configurations",
      "Exposure to data engineering using Python and PySpark",
    ],
    tags: ["Cypress.io", "React.js", "GraphQL", "Node.js", "Express"],
  },
  {
    company: "Hewlett Packard Enterprise",
    title: "Software Engineer I",
    type: "Full-time",
    period: "Dec 2018 – Jun 2019",
    duration: "7 mos",
    location: "Bengaluru, Karnataka, India · On-site",
    current: false,
    logo: "/logos/hewlett_packard_enterprise_logo.webp",
    summary:
      "Contributed to hybrid cloud solutions, focusing on frontend platforms for unified cloud service management. Built UIs using React.js and Redux for products like OpenSphere and GreenLake.",
    highlights: [
      "Built UIs for hybrid cloud products — OpenSphere and GreenLake",
      "Contributed to the open-source Grommet design system",
      "Gained exposure to Docker, Kubernetes, and distributed system design",
      "Participated in SAFe Agile processes",
    ],
    tags: ["React.js", "TypeScript", "Redux", "Grommet"],
  },
  {
    company: "William O'Neil India",
    title: "Software Engineer",
    type: "Full-time",
    period: "Jul 2016 – Dec 2018",
    duration: "2 yrs 6 mos",
    location: "Bengaluru Area, India · On-site",
    current: false,
    logo: "/logos/william_oneil.webp",
    summary:
      "Core engineering team member building Panaray, a stock market research and analytics platform. Developed end-to-end web features using React.js from early versions (0.14 to 16.8). Outstanding Performance Award — Q3 2016.",
    highlights: [
      "Built Panaray — stock market research and analytics platform from scratch",
      "Set up frontend architecture including JSX, Webpack, and build optimization",
      "Evolved state management from Flux to Redux with Saga",
      "Built BFF services using Node.js and Express",
      "Mentored junior engineers — several progressed to senior and tech lead roles",
    ],
    tags: ["React.js", "Flux", "Redux", "Node.js", "Express"],
  },
];

export function Journey() {
  const ref = useScrollReveal();

  return (
    <section id="journey" className="py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <div className="reveal">
          <span className="font-mono text-xs uppercase tracking-wide text-amber sm:text-sm">
            Career Journey
          </span>
        </div>
        <h2 className="mt-4 max-w-[30ch] font-display text-balance text-4xl font-normal leading-[1.1] tracking-tight text-foreground reveal md:text-5xl">
          From product engineering to AI systems architecture.
        </h2>

        <Accordion type="multiple" className="mt-16 flex flex-col">
          {experiences.map((exp) => (
            <AccordionItem
              key={exp.company}
              value={exp.company}
              className="reveal border-t border-border/50 py-6 first:border-t-0 first:pt-0 last:pb-0"
            >
              <AccordionTrigger className="py-0 hover:no-underline">
                <div className="flex items-start gap-3 sm:gap-4">
                  <CompanyLogo src={exp.logo} size="md" />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-foreground">
                      {exp.company}
                      {exp.current && (
                        <span className="ml-2 font-mono text-xs uppercase tracking-wide text-amber">
                          Current
                        </span>
                      )}
                    </h3>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {exp.title}
                      <span className="mx-1.5 text-muted-foreground/40">&middot;</span>
                      <span className="text-muted-foreground/70">{exp.type}</span>
                    </p>

                    <p className="mt-1 font-mono text-xs text-muted-foreground/50">
                      {exp.location}
                    </p>
                  </div>
                </div>

                <span className="ml-4 shrink-0 font-mono text-xs uppercase tracking-wide text-muted-foreground/60">
                  {exp.period}
                </span>
              </AccordionTrigger>

              <AccordionContent className="pb-0">
                <div className="pl-0 sm:pl-[52px]">
                  <p className="mt-4 max-w-[64ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                    {exp.summary}
                  </p>

                  {exp.highlights.length > 0 && (
                    <ul className="mt-4 max-w-[64ch] space-y-1.5">
                      {exp.highlights.map((h) => (
                        <li
                          key={h}
                          className="text-sm leading-relaxed text-muted-foreground/80 pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:size-1 before:rounded-full before:bg-amber/60"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[0.6875rem] text-muted-foreground/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
