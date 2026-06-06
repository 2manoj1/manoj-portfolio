import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Database,
  Layers,
  Network,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/marketing/section";
import { caseStudies, type CaseStudy } from "./_data/case-studies";
import { cn } from "@/lib/utils";
import { LegacyHashRedirect } from "./_components/legacy-hash-redirect";

function statusTone(status: CaseStudy["status"]) {
  if (status === "PRODUCTION") {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.08)]";
  }

  if (status === "ACTIVE") {
    return "bg-sky-500/10 text-sky-400 border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.08)]";
  }

  return "bg-amber/10 text-amber border-amber/30 shadow-[0_0_12px_rgba(245,158,11,0.08)]";
}

function getStudyIcon(id: string) {
  switch (id) {
    case "01":
      return Network;
    case "02":
      return GitBranchIcon;
    case "03":
      return Cpu;
    case "04":
      return ShieldCheck;
    case "05":
      return Database;
    default:
      return Layers;
  }
}

// Inline fallback since GitBranch is not imported from standard bundle
function GitBranchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

export default function CaseStudiesPage() {
  return (
    <>
      <LegacyHashRedirect />
      <PageHero
        kicker="Architecture Portfolio"
        title="System architectures under telemetry."
        description="Detailed command consoles for production-grade AI applications. Select a system below to inspect its runtime boundaries, interactive topologies, telemetry deck simulations, and code ledgers."
      />

      <section className="bg-secondary/5 dark:bg-zinc-950/40 py-8 md:py-12 pb-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
            {caseStudies.map((study) => {
              const Icon = getStudyIcon(study.id);
              // Extract the first 2 telemetry highlights to show inline on the card
              const highlights = study.telemetry.slice(0, 2);

              return (
                <Card
                  key={study.slug}
                  className="group relative rounded-xl border border-border bg-card dark:bg-black/45 p-6 backdrop-blur-md transition-all duration-300 hover:border-amber/40 hover:bg-secondary/15 dark:hover:bg-white/[0.01]"
                >
                  <div
                    className="absolute inset-0 -z-10 rounded-xl bg-[linear-gradient(to_right,rgba(9,9,11,0.008)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.008)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)]"
                    aria-hidden="true"
                  />

                  <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                    {/* Info Block */}
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs text-amber font-semibold">
                          CASE STUDY {study.id}
                        </span>
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                            statusTone(study.status)
                          )}
                        >
                          {study.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold leading-tight text-foreground group-hover:text-amber transition-colors flex items-center gap-2.5">
                          <Icon className="size-5 shrink-0 text-muted-foreground group-hover:text-amber transition-colors" />
                          {study.title}
                        </h3>
                        <p className="mt-1 font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
                          ENVIRONMENT: {study.environment}
                        </p>
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground max-w-[85ch]">
                        {study.problem}
                      </p>
                    </div>

                    {/* Telemetry Highlights Panel & Action */}
                    <div className="flex flex-col gap-5 w-full lg:w-[280px] shrink-0 justify-between self-stretch border-t border-border/40 pt-4 lg:border-t-0 lg:border-l lg:border-border/40 lg:pt-0 lg:pl-6">
                      <div className="space-y-3">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">
                          Telemetry Highlights
                        </span>
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
                          {highlights.map((h) => (
                            <div
                              key={h.label}
                              className="rounded bg-secondary/10 dark:bg-zinc-950/60 p-2.5 border border-border/40 font-mono text-left"
                            >
                              <span className="block text-[8px] uppercase tracking-widest text-zinc-500">
                                {h.label}
                              </span>
                              <span className="block text-xs font-semibold text-foreground dark:text-zinc-300 mt-0.5 truncate">
                                {h.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        asChild
                        className="w-full bg-amber text-amber-foreground hover:bg-amber/90 font-medium mt-auto group-hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300"
                      >
                        <Link href={`/case-studies/${study.slug}`}>
                          Explore System <ArrowRight className="ml-2 size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
