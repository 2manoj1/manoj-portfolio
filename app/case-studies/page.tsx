import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Network,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/section";
import { caseStudies, type CaseStudy } from "./_data/case-studies";
import { cn } from "@/lib/utils";
import { LegacyHashRedirect } from "./_components/legacy-hash-redirect";

const evidenceChips = [
  { label: "System map", kind: "topology" },
  { label: "Delivery notes", kind: "proof" },
  { label: "Boundaries", kind: "security" },
  { label: "Decisions", kind: "decision" },
] as const;

function statusTone(status: CaseStudy["status"]) {
  if (status === "PRODUCTION") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (status === "ACTIVE") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
  }

  return "border-amber/30 bg-amber/10 text-amber";
}

function StudyIcon({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case "01":
      return <Network className={className} aria-hidden="true" />;
    case "02":
      return <GitBranch className={className} aria-hidden="true" />;
    case "03":
      return <Cpu className={className} aria-hidden="true" />;
    case "04":
      return <ShieldCheck className={className} aria-hidden="true" />;
    case "05":
      return <Database className={className} aria-hidden="true" />;
    default:
      return <Layers className={className} aria-hidden="true" />;
  }
}

function EvidenceIcon({
  kind,
  className,
}: {
  kind: "topology" | "proof" | "security" | "decision";
  className?: string;
}) {
  if (kind === "topology") {
    return <Radar className={className} aria-hidden="true" />;
  }

  if (kind === "proof") {
    return <CheckCircle2 className={className} aria-hidden="true" />;
  }

  if (kind === "security") {
    return <ShieldCheck className={className} aria-hidden="true" />;
  }

  return <GitBranch className={className} aria-hidden="true" />;
}

function StatusBadge({ status }: { status: CaseStudy["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide",
        statusTone(status),
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

function PortfolioStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[8px] border border-zinc-200/80 bg-white/70 p-3.5 shadow-[0_14px_34px_rgba(0,0,0,0.04)] backdrop-blur dark:border-white/10 dark:bg-white/[0.035]">
      <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
        {detail}
      </p>
    </div>
  );
}

function TelemetryPreview({ study }: { study: CaseStudy }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {study.telemetry.slice(0, 4).map((metric) => (
        <div
          key={metric.label}
          className="min-w-0 rounded-[8px] border border-zinc-200/75 bg-zinc-50/80 p-3 dark:border-white/10 dark:bg-black/24"
        >
          <p className="truncate font-mono text-[9px] uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
            {metric.label}
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-zinc-950 dark:text-white">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="group relative overflow-hidden rounded-[8px] border border-zinc-200/80 bg-white/78 p-4 shadow-[0_22px_55px_rgba(0,0,0,0.055)] backdrop-blur-xl transition duration-300 hover:border-amber/45 hover:shadow-[0_26px_65px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-zinc-950/62 dark:shadow-black/30 dark:hover:bg-zinc-950/78 sm:p-5 lg:p-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(9,9,11,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.025)_1px,transparent_1px)] bg-[size:26px_26px] opacity-55 [mask-image:linear-gradient(to_bottom,black,transparent_88%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]"
        aria-hidden="true"
      />

      <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.36fr)] lg:items-stretch">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[8px] border border-zinc-200 bg-zinc-50 text-amber shadow-inner dark:border-white/10 dark:bg-white/[0.04]">
                <StudyIcon id={study.id} className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-wide text-amber">
                  Case Study {study.id}
                </p>
                <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-wide text-zinc-500">
                  {study.kicker}
                </p>
              </div>
            </div>
            <StatusBadge status={study.status} />
          </div>

          <div className="mt-5">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-zinc-950 transition-colors group-hover:text-amber dark:text-white sm:text-3xl">
              {study.title}
            </h2>
            <p className="mt-3 max-w-[72ch] text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base sm:leading-8">
              {study.problem}
            </p>
          </div>

          <div className="mt-5 grid gap-2 text-left font-mono text-[10px] uppercase tracking-wide text-zinc-500 sm:grid-cols-2">
            <span className="min-w-0 rounded-[8px] border border-zinc-200/75 bg-zinc-50/80 px-3 py-2 dark:border-white/10 dark:bg-white/[0.035]">
              <span className="text-zinc-400">Env</span>{" "}
              <span className="text-zinc-800 dark:text-zinc-200">
                {study.environment}
              </span>
            </span>
            <span className="min-w-0 rounded-[8px] border border-zinc-200/75 bg-zinc-50/80 px-3 py-2 dark:border-white/10 dark:bg-white/[0.035]">
              <span className="text-zinc-400">Ingress</span>{" "}
              <span className="text-zinc-800 dark:text-zinc-200">
                {study.ingress}
              </span>
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-4 border-t border-zinc-200/75 pt-4 dark:border-white/10 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <TelemetryPreview study={study} />

          <Button
            asChild
            className="h-11 w-full rounded-[8px] bg-amber text-sm text-amber-foreground hover:bg-amber/90"
          >
            <Link href={`/case-studies/${study.slug}`}>
              Read case study
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function CaseStudiesPage() {
  const productionCount = caseStudies.filter(
    (study) => study.status === "PRODUCTION",
  ).length;
  const nodeCount = caseStudies.reduce(
    (total, study) => total + study.nodes.length,
    0,
  );
  const connectionCount = caseStudies.reduce(
    (total, study) => total + study.connections.length,
    0,
  );

  return (
    <>
      <LegacyHashRedirect />
      <PageHero
        kicker="Case Studies"
        title="Systems I have designed, mapped, and debugged."
        description="Short case studies from my AI architecture work: the problem, the boundary, the tradeoff, and the operating signal I watch."
      />

      <section className="border-b border-zinc-200/70 bg-zinc-50/70 py-5 dark:border-white/10 dark:bg-zinc-950/36 md:py-8">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <PortfolioStat
              label="systems"
              value={String(caseStudies.length)}
              detail="Architecture stories, not mockups"
            />
            <PortfolioStat
              label="production"
              value={String(productionCount)}
              detail="Built from real delivery patterns"
            />
            <PortfolioStat
              label="runtime graph"
              value={`${nodeCount}/${connectionCount}`}
              detail="Runtime nodes and edges"
            />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {evidenceChips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-zinc-650 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-350"
              >
                <EvidenceIcon
                  kind={chip.kind}
                  className="size-3.5 text-amber"
                />
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 dark:bg-zinc-950/40 py-6 md:py-10 pb-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6">
          <div className="grid gap-4 md:gap-5">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.slug} study={study} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
