"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCode,
  GitBranch,
  Gauge,
  Monitor,
  Network,
  Pause,
  Play,
  ShieldCheck,
  Terminal,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CtaBand } from "@/components/marketing/cta-band";
import {
  PageHero,
  Section,
  SectionHeader,
} from "@/components/marketing/section";
import { cn } from "@/lib/utils";
import {
  caseStudies,
  type CaseStudy,
  type TopologyNode,
} from "../_data/case-studies";
import { TopologyCanvas } from "./TopologyCanvas";
import { SimulationDeck, type SimMode } from "./SimulationDeck";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import { DocsMdxRenderer } from "@/components/marketing/docs-mdx-renderer";

const SIMULATION_DETAILS = {
  "production-grade-ai-home-lab": {
    HEALTHY:
      "Tunnel, FastAPI, and Ollama are online. The gateway is holding the 10-chat limit.",
    LATENCY:
      "qwen3.5 has one active generation slot. The gateway protects the Mac while tokens queue.",
    FAILURE:
      "All chat slots are full. I return 429 instead of letting work pile up in Ollama.",
  },
  "enterprise-agentic-rag-platform": {
    HEALTHY:
      "LangGraph is routing the query. pgvector is serving grounded candidates.",
    LATENCY:
      "Chunk joins are slow. I would check filters, index shape, and hot query paths.",
    FAILURE:
      "Grounding dropped. The eval node blocks the answer before it reaches the user.",
  },
  "gpu-ai-platform-modernization": {
    HEALTHY: "vLLM pods are serving. Run:AI leases are active.",
    LATENCY: "The scheduler queue is full. Priority and quota need a check.",
    FAILURE:
      "vLLM hit CUDA memory pressure. Traffic should fail over or shed load.",
  },
  "ai-architecture-enablement": {
    HEALTHY: "The MCP host is online. Tool calls are schema-checked.",
    LATENCY:
      "Tool registration is slow. I would inspect host startup and registry calls.",
    FAILURE:
      "A tool call was blocked. The agent gets a safe error, not raw access.",
  },
  "astra-knowledge-graph-engine": {
    HEALTHY: "The graph index is warm. Cached queries return from memory.",
    LATENCY:
      "Trie search is contended. I would check query fan-out and cache hit rate.",
    FAILURE:
      "Index load failed. Retrieval falls back to simple keyword matching.",
  },
};

function statusTone(status: CaseStudy["status"]) {
  if (status === "PRODUCTION") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (status === "ACTIVE") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
  }

  return "border-amber/30 bg-amber/10 text-amber";
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

function SnapshotMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="min-w-0 rounded-[8px] border border-zinc-200/80 bg-white/70 p-3.5 backdrop-blur dark:border-white/10 dark:bg-white/[0.035]">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 shrink-0 text-amber" aria-hidden="true" />
        <p className="truncate font-mono text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
          {label}
        </p>
      </div>
      <p className="mt-2 break-words text-sm font-semibold leading-5 text-zinc-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function CaseStudySnapshot({ study }: { study: CaseStudy }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SnapshotMetric label="status" value={study.status} icon={CheckCircle2} />
      <SnapshotMetric label="environment" value={study.environment} icon={Monitor} />
      <SnapshotMetric label="ingress" value={study.ingress} icon={ShieldCheck} />
      <SnapshotMetric
        label="runtime graph"
        value={`${study.nodes.length} nodes / ${study.connections.length} edges`}
        icon={Network}
      />
    </div>
  );
}

function NodeFocusPanel({
  node,
  study,
  simMode,
}: {
  node: TopologyNode | null;
  study: CaseStudy;
  simMode: SimMode;
}) {
  return (
    <aside className="mt-4 rounded-[8px] border border-zinc-200/80 bg-zinc-50/85 p-4 dark:border-white/10 dark:bg-white/[0.035]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gauge className="size-4 text-amber" aria-hidden="true" />
          <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            {node ? "Selected node" : "How to read this"}
          </p>
        </div>
        <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide text-zinc-500 dark:border-white/10 dark:bg-black/22 dark:text-zinc-400">
          {simMode.toLowerCase()}
        </span>
      </div>

      {node ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
          <div className="min-w-0">
            <p className="text-base font-semibold text-zinc-950 dark:text-white">
              {node.label}
            </p>
            <p className="mt-1 break-words text-xs leading-5 text-zinc-600 dark:text-zinc-400">
              {node.description}
            </p>
          </div>
          <p className="break-words text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {node.detail}
          </p>
        </div>
      ) : (
        <p className="mt-3 max-w-[76ch] text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          Tap a node to see why it exists, what it owns, and what can fail.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {study.telemetry.slice(0, 3).map((metric) => (
          <span
            key={metric.label}
            className="inline-flex min-w-0 items-center gap-2 rounded-full border border-zinc-200 bg-white/75 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-zinc-600 dark:border-white/10 dark:bg-black/22 dark:text-zinc-350"
          >
            <span className="shrink-0 text-zinc-400">{metric.label}</span>
            <span className="truncate font-semibold text-zinc-950 dark:text-white">
              {metric.value}
            </span>
          </span>
        ))}
      </div>
    </aside>
  );
}

function TelemetryPanel({ study }: { study: CaseStudy }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {study.telemetry.map((metric) => (
        <div
          key={metric.label}
          className="min-w-0 rounded-lg border border-zinc-200 dark:border-border/60 bg-zinc-100/50 dark:bg-zinc-950/45 p-3.5"
        >
          <p className="break-words font-mono text-[10px] uppercase tracking-wide text-zinc-650 dark:text-zinc-500">
            {metric.label}
          </p>
          <p className="mt-1 break-words text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
            {metric.value}
          </p>
          <p className="mt-2 break-words text-xs leading-5 text-zinc-600 dark:text-zinc-400">
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function TerminalConsole({ logs }: { logs: readonly string[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [displayed, setDisplayed] = useState<string[]>(() => [
    ...logs.slice(0, 6),
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused || prefersReducedMotion || logs.length <= 6) {
      return;
    }

    let offset = 6;
    const interval = window.setInterval(() => {
      setDisplayed((previous) => {
        const next = [...previous, logs[offset % logs.length]];
        offset += 1;

        return next.slice(-8);
      });
    }, 1800);

    return () => window.clearInterval(interval);
  }, [isPaused, logs, prefersReducedMotion]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [displayed]);

  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-zinc-200 dark:border-border/60 pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-amber" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Run logs
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPaused((current) => !current)}
          aria-pressed={isPaused}
          disabled={Boolean(prefersReducedMotion)}
          className="h-7 px-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {isPaused || prefersReducedMotion ? (
            <Play className="size-3.5" aria-hidden="true" />
          ) : (
            <Pause className="size-3.5" aria-hidden="true" />
          )}
          {isPaused || prefersReducedMotion ? "Resume" : "Pause"}
        </Button>
      </div>
      <div
        ref={logContainerRef}
        role="log"
        aria-live="polite"
        aria-label="Case study run logs"
        className="h-[180px] md:h-[230px] overflow-y-auto rounded-lg border border-zinc-200 dark:border-border/80 bg-zinc-950 dark:bg-black/75 p-3.5 font-mono text-xs leading-5 text-emerald-400"
      >
        {displayed.map((log, index) => (
          <p
            key={`${log}-${index}`}
            className="break-words whitespace-pre-wrap text-emerald-400"
          >
            <span className="select-none text-emerald-600">&gt; </span>
            {log}
          </p>
        ))}
        <span
          className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-emerald-400 align-middle motion-reduce:animate-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function StudyInspector({
  study,
  activeNodeId,
  onActiveNodeChange,
  onFullscreen,
  simMode,
}: {
  study: CaseStudy;
  activeNodeId: string | null;
  onActiveNodeChange: (nodeId: string | null) => void;
  onFullscreen: () => void;
  simMode: SimMode;
}) {
  const activeNode =
    activeNodeId ? study.nodes.find((node) => node.id === activeNodeId) ?? null : null;

  return (
    <section
      aria-labelledby="case-study-topology-title"
      className="relative min-w-0 rounded-[8px] border border-zinc-250 bg-white p-3 shadow-[0_22px_55px_rgba(0,0,0,0.055)] backdrop-blur-md dark:border-border/80 dark:bg-black/45 dark:shadow-black/30 sm:p-4 md:p-5"
    >
      <div
        className="absolute inset-0 -z-10 rounded-[8px] bg-[linear-gradient(to_right,rgba(9,9,11,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.012)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_68%,transparent)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)]"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 dark:border-border/60 pb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Monitor
                className="size-4 shrink-0 text-amber"
                aria-hidden="true"
              />
              <p className="font-mono text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                System map
              </p>
            </div>
            <h2
              id="case-study-topology-title"
              className="mt-2 break-words text-xl font-semibold leading-7 text-zinc-900 dark:text-zinc-100"
            >
              {study.title}
            </h2>
          </div>
          <div className="grid gap-1 text-left font-mono text-[10px] uppercase leading-5 text-zinc-550 dark:text-zinc-500 sm:text-right">
            <span className="break-words">Env: {study.environment}</span>
            <span className="break-words">Ingress: {study.ingress}</span>
          </div>
        </header>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.72fr]">
          <p className="break-words text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Problem:{" "}
            </span>
            {study.problem}
          </p>
          <div className="rounded-lg border-l-2 border-amber/60 bg-amber/[0.025] px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wide text-amber">
              My engineering note
            </p>
            <p className="mt-2 break-words text-xs leading-6 text-zinc-700 dark:text-zinc-300">
              {study.narration}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <TopologyCanvas
            study={study}
            activeNodeId={activeNodeId}
            onActiveNodeChange={onActiveNodeChange}
            onFullscreen={onFullscreen}
            simMode={simMode}
          />
        </div>

        <NodeFocusPanel node={activeNode} study={study} simMode={simMode} />

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 dark:border-border/40 pt-4">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase text-zinc-555 dark:text-zinc-500">
            <span
              className="size-1.5 rounded-full bg-amber"
              aria-hidden="true"
            />
            Interactive map
          </span>
          <p className="max-w-[52ch] break-words text-xs leading-5 text-zinc-555 dark:text-zinc-500">
            Zones, edges, and logs come from the case-study data model.
          </p>
        </footer>
      </div>
    </section>
  );
}

function FullscreenTopology({
  study,
  activeNodeId,
  onActiveNodeChange,
  onClose,
  simMode,
}: {
  study: CaseStudy;
  activeNodeId: string | null;
  onActiveNodeChange: (nodeId: string | null) => void;
  onClose: () => void;
  simMode: SimMode;
}) {
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-100/98 dark:bg-zinc-950/98 p-4 backdrop-blur-md md:p-6">
      <header className="mb-4 flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-border/60 pb-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wide text-amber">
            Full screen map
          </p>
          <h2 className="mt-1 break-words text-lg font-semibold text-zinc-950 dark:text-white">
            {study.title}
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          aria-label="Close full screen map"
          className="border-zinc-200 dark:border-border/80 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X className="size-5" aria-hidden="true" />
        </Button>
      </header>
      <div className="min-h-0 flex-1">
        <TopologyCanvas
          study={study}
          activeNodeId={activeNodeId}
          onActiveNodeChange={onActiveNodeChange}
          isFullscreen
          simMode={simMode}
        />
      </div>
    </div>
  );
}

interface CaseStudyDetailClientProps {
  slug: string;
}

export function CaseStudyDetailClient({ slug }: CaseStudyDetailClientProps) {
  const study = caseStudies.find((s) => s.slug === slug);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [simMode, setSimMode] = useState<SimMode>("HEALTHY");

  const [requestedDocSlug, setRequestedDocSlug] = useState<string | null>(null);
  const [docContentBySlug, setDocContentBySlug] = useState<Record<string, string>>({});
  const [docErrorBySlug, setDocErrorBySlug] = useState<Record<string, string>>({});
  const docs = study?.docs ?? [];
  const defaultDocSlug = docs[0]?.slug ?? null;
  const activeDocSlug = docs.some((doc) => doc.slug === requestedDocSlug)
    ? requestedDocSlug
    : defaultDocSlug;
  const hasLoadedDoc = activeDocSlug
    ? Object.prototype.hasOwnProperty.call(docContentBySlug, activeDocSlug)
    : false;
  const docContent =
    activeDocSlug && hasLoadedDoc ? docContentBySlug[activeDocSlug] : "";
  const docError = activeDocSlug ? (docErrorBySlug[activeDocSlug] ?? null) : null;
  const isLoadingDoc = Boolean(activeDocSlug && !hasLoadedDoc && !docError);

  useEffect(() => {
    if (!study?.docs?.length) {
      return;
    }

    const parseUrlTab = () => {
      const searchParams = new URLSearchParams(window.location.search);
      let tab = searchParams.get("tab");

      if (!tab) {
        const hash = window.location.hash.replace("#", "");
        const [, queryStr] = hash.split("?");
        if (queryStr) {
          const hashParams = new URLSearchParams(queryStr);
          tab = hashParams.get("tab");
        }
      }

      if (tab && study.docs?.some((d) => d.slug === tab)) {
        setRequestedDocSlug(tab);
      }
    };

    parseUrlTab();
    window.addEventListener("hashchange", parseUrlTab);
    return () => window.removeEventListener("hashchange", parseUrlTab);
  }, [study]);

  useEffect(() => {
    if (
      !activeDocSlug ||
      Object.prototype.hasOwnProperty.call(docContentBySlug, activeDocSlug) ||
      Object.prototype.hasOwnProperty.call(docErrorBySlug, activeDocSlug)
    ) {
      return;
    }

    let isMounted = true;

    fetch(`/api/docs?slug=${activeDocSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load playbook document");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setDocContentBySlug((current) => ({
            ...current,
            [activeDocSlug]: data.content || "",
          }));
        }
      })
      .catch((err) => {
        if (isMounted) {
          setDocErrorBySlug((current) => ({
            ...current,
            [activeDocSlug]: err.message || "Failed to load document",
          }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeDocSlug, docContentBySlug, docErrorBySlug]);

  if (!study) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-mono text-xs">
        Case study not found: {slug}
      </div>
    );
  }

  const getSimulatedLogs = () => {
    const baseLogs = study.logs;
    if (simMode === "HEALTHY") {
      return baseLogs;
    }

    const details = SIMULATION_DETAILS[study.slug as keyof typeof SIMULATION_DETAILS];
    const injectLog =
      simMode === "LATENCY"
        ? `[READOUT WARNING] Slow path: ${details.LATENCY}`
        : `[READOUT CRITICAL] Fault: ${details.FAILURE}`;

    return [injectLog, ...baseLogs];
  };

  const currentIndex = caseStudies.findIndex((s) => s.slug === study.slug);
  const nextIndex = (currentIndex + 1) % caseStudies.length;
  const nextStudy = caseStudies[nextIndex];

  return (
    <div className="bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 flex-1 flex flex-col">
      <PageHero
        kicker={`${study.kicker} · Case Study ${study.id}`}
        title={study.title}
        description={study.narration}
      >
        <div className="grid gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={study.status} />
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-zinc-600 transition-colors hover:text-amber dark:text-zinc-400"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back to case studies
            </Link>
          </div>
          <CaseStudySnapshot study={study} />
          <div className="flex flex-col items-start gap-2 sm:flex-row">
            <Button
              asChild
              className="h-11 w-full rounded-[8px] bg-amber text-amber-foreground hover:bg-amber/90 sm:w-auto"
            >
              <Link href="#topology">
                View system map
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            {docs.length > 0 ? (
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-[8px] border-zinc-200 bg-white/60 text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.035] dark:text-zinc-200 dark:hover:bg-white/[0.07]"
              >
                <Link href="#playbooks">Open docs</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </PageHero>

      <section
        id="topology"
        className="scroll-mt-20 bg-zinc-100/50 py-6 dark:bg-zinc-950/40 md:py-10"
      >
        <div className="mx-auto max-w-[1540px] px-4 md:px-6">
          <div className="grid min-w-0 gap-5">
            <StudyInspector
              study={study}
              activeNodeId={activeNodeId}
              onActiveNodeChange={setActiveNodeId}
              onFullscreen={() => setIsFullscreen(true)}
              simMode={simMode}
            />

            <aside className="grid min-w-0 gap-5 rounded-[8px] border border-zinc-250 bg-white p-3 shadow-[0_22px_55px_rgba(0,0,0,0.045)] backdrop-blur-md dark:border-border/80 dark:bg-black/45 dark:shadow-black/30 sm:p-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.7fr)]">
              <div className="flex flex-col gap-5 min-w-0">
                <SimulationDeck
                  activeMode={simMode}
                  onChangeMode={setSimMode}
                  description={SIMULATION_DETAILS[study.slug as keyof typeof SIMULATION_DETAILS][simMode]}
                />
                <div>
                  <div className="mb-4 flex items-center gap-2 border-b border-zinc-200 dark:border-border/60 pb-3">
                    <Activity className="size-4 text-amber" aria-hidden="true" />
                    <span className="font-mono text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                      Signals
                    </span>
                  </div>
                  <TelemetryPanel study={study} />
                </div>
              </div>

              <div className="min-w-0">
                <TerminalConsole key={study.slug} logs={getSimulatedLogs()} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Section className="border-t border-zinc-200 py-16 dark:border-border md:py-24">
        <SectionHeader
          kicker="Architecture Decision"
          title="Why I chose this design."
          description="Short decision notes tied to the code or config that mattered."
        />

        <div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-[0.42fr_0.58fr]">
          <Card className="rounded-[8px] border border-zinc-250 bg-white backdrop-blur-md dark:border-border/80 dark:bg-black/20">
            <CardContent className="flex h-full flex-col justify-between p-4 sm:p-6">
              <div>
                <div className="mb-4 flex items-center gap-2 border-b border-zinc-200 dark:border-border/60 pb-3">
                  <GitBranch className="size-4 text-amber" aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    Decision
                  </span>
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {study.adr.filename}
                </h3>
                <p className="mt-4 break-words text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                  {study.adr.choice}
                </p>
              </div>
 
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 dark:border-border/40 pt-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-zinc-600 dark:text-zinc-400">
                  <FileCode className="size-3.5 text-amber" aria-hidden="true" />
                  Code note
                </span>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-zinc-600 dark:text-zinc-400 hover:text-amber"
                >
                  <Link href="/engineering">
                    See engineering notes
                    <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-zinc-250 dark:border-border/80 bg-zinc-100 dark:bg-zinc-950 font-mono text-[11px] leading-relaxed shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-250 dark:border-border/80 bg-zinc-200/50 dark:bg-zinc-900 px-4 py-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-rose-500/90" />
                <span className="size-2.5 rounded-full bg-amber/90" />
                <span className="size-2.5 rounded-full bg-emerald-500/90" />
              </div>
              <span className="min-w-0 break-words text-center text-[10px] text-zinc-600 dark:text-zinc-400">
                {study.adr.filename}
              </span>
              <span className="font-mono text-[9px] uppercase text-amber">
                {study.adr.language}
              </span>
            </div>
 
            <div className="max-h-[320px] flex-1 overflow-auto bg-zinc-100/50 p-4 text-zinc-800 streamdown-code-clean dark:bg-zinc-950/80 dark:text-zinc-200 md:max-h-[430px] md:p-5 [&_[data-streamdown='code-block']]:m-0 [&_[data-streamdown='code-block']]:border-0 [&_[data-streamdown='code-block']]:bg-transparent [&_[data-streamdown='code-block']]:p-0 [&_[data-streamdown='code-block-body']]:border-0 [&_[data-streamdown='code-block-body']]:bg-transparent [&_[data-streamdown='code-block-body']]:p-0 [&_[data-streamdown='code-block-header']]:hidden">
              <Streamdown
                plugins={{ code }}
                shikiTheme={["dracula", "dracula"]}
                controls={{ code: { download: false } }}
              >
                {`\`\`\`${study.adr.language}\n${study.adr.code}\n\`\`\``}
              </Streamdown>
            </div>
          </div>
        </div>
      </Section>

      {study.docs && study.docs.length > 0 && (
        <Section
          id="playbooks"
          className="scroll-mt-20 border-t border-zinc-200 py-16 dark:border-border md:py-24"
        >
          <SectionHeader
            kicker="Docs"
            title="Runbooks and specs."
            description="Supporting docs for the system: architecture, diagrams, runbook, and development notes."
          />

          <div className="mt-8 flex flex-col gap-5">
            <nav
              aria-label="Case study docs"
              className="-mx-6 overflow-x-auto border-b border-zinc-200 px-6 pb-4 dark:border-border/40"
            >
              <div className="flex w-max min-w-full gap-2">
                {study.docs.map((doc) => {
                  const isActive = activeDocSlug === doc.slug;
                  return (
                    <button
                      key={doc.slug}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setRequestedDocSlug(doc.slug)}
                      className={cn(
                        "min-h-10 shrink-0 rounded-[8px] border px-3.5 py-2 font-mono text-[11px] uppercase tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60",
                        isActive
                          ? "border-amber/65 bg-amber/[0.08] text-zinc-900 shadow-[0_0_12px_rgba(245,158,11,0.13)] dark:text-white"
                          : "border-zinc-200 bg-zinc-100/50 text-zinc-600 hover:border-zinc-350 hover:bg-zinc-200 dark:border-border/60 dark:bg-zinc-950/40 dark:text-zinc-400 dark:hover:border-border dark:hover:bg-white/[0.03]",
                      )}
                    >
                      {doc.title}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Document Render Area */}
            <div className="relative min-h-[300px] rounded-[8px] border border-zinc-250 bg-white p-4 backdrop-blur-md dark:border-border/80 dark:bg-black/45 sm:p-6 md:p-8">
              <div
                className="absolute inset-0 -z-10 rounded-lg bg-[linear-gradient(to_right,rgba(9,9,11,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)]"
                aria-hidden="true"
              />

              {isLoadingDoc ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
                  <div className="size-6 animate-spin rounded-full border-2 border-amber border-t-transparent" />
                  <p className="font-mono text-xs text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Loading docs...</p>
                </div>
              ) : docError ? (
                <div className="rounded-md border border-rose-500/30 bg-rose-950/10 p-5 text-center">
                  <p className="font-mono text-xs text-rose-400">Could not load docs: {docError}</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                     key={activeDocSlug}
                     initial={{ opacity: 0, y: 4 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -4 }}
                     transition={{ duration: 0.15 }}
                  >
                    <DocsMdxRenderer content={docContent} />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Footer Next Case Study Selector */}
      <Section className="mt-8 border-t border-zinc-200 pb-16 pt-12 dark:border-border md:pt-16">
        <div className="relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-[8px] border border-zinc-200 bg-zinc-100/50 p-4 backdrop-blur-md dark:border-border/60 dark:bg-zinc-950/40 sm:p-6 md:flex-row md:items-center">
          <div
            className="absolute inset-0 -z-10 rounded-xl bg-[linear-gradient(to_right,rgba(9,9,11,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)]"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber font-semibold">
              Next case study
            </span>
            <h4 className="mt-1.5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {nextStudy.title}
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-[65ch]">
              {nextStudy.kicker} - {nextStudy.problem.slice(0, 120)}...
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full shrink-0 rounded-[8px] border-amber-400/40 text-zinc-800 hover:bg-amber/[0.05] hover:text-zinc-900 dark:border-amber/40 dark:text-white dark:hover:text-white md:w-auto"
          >
            <Link href={`/case-studies/${nextStudy.slug}`}>
              Read next <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Section>

      <CtaBand title="Need this level of architecture review?" />

      {isFullscreen ? (
        <FullscreenTopology
          study={study}
          activeNodeId={activeNodeId}
          onActiveNodeChange={setActiveNodeId}
          onClose={() => setIsFullscreen(false)}
          simMode={simMode}
        />
      ) : null}
    </div>
  );
}
