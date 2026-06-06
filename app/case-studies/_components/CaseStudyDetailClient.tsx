"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  FileCode,
  GitBranch,
  Monitor,
  Pause,
  Play,
  Terminal,
  X,
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
import { caseStudies, type CaseStudy } from "../_data/case-studies";
import { TopologyCanvas } from "./TopologyCanvas";
import { SimulationDeck, type SimMode } from "./SimulationDeck";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import { DocsMdxRenderer } from "@/components/marketing/docs-mdx-renderer";

const SIMULATION_DETAILS = {
  "production-grade-ai-home-lab": {
    HEALTHY: "System fully online. Cloudflare Tunnel reaches localhost FastAPI, qwen3.5 is warm in Ollama, and the gateway is enforcing 10 chat slots.",
    LATENCY: "qwen3.5 is exposing one active generation slot. Requests are protected at the gateway but token generation may serialize under load.",
    FAILURE: "All chat slots are busy. Gateway returns an OpenAI-style 429 instead of pushing unbounded work into the local model runtime.",
  },
  "enterprise-agentic-rag-platform": {
    HEALTHY: "StateGraph pipeline routing inquiries. pgvector indices serving queries with semantic relevance checks.",
    LATENCY: "Relational chunk joins taking 5.2s. High query load on pgvector tables during filing scan operations.",
    FAILURE: "Grounding evaluation score dropped to 0.72. Output blocked by safety evaluation node to prevent hallucination.",
  },
  "gpu-ai-platform-modernization": {
    HEALTHY: "vLLM pods serving inference metrics. Run:AI fractional scheduling leases active across H100 node pools.",
    LATENCY: "Run:AI queue scheduler saturated. Fractional allocations delayed for serving request priority class.",
    FAILURE: "CUDA Out of Memory error on vLLM model service pods. Inference requests falling back to backup CPU nodes.",
  },
  "ai-architecture-enablement": {
    HEALTHY: "MCP JSON-RPC transport online. Schema-validated tools executing query pipelines in secure sandbox subnets.",
    LATENCY: "Handshake negotiation queue overhead. High latency in tool registration database server.",
    FAILURE: "External APIs blocked by gateway rule. Access Denied (403). Safe error thrown in agent execution context.",
  },
  "astra-knowledge-graph-engine": {
    HEALTHY: "Graph index fully warm in container memory. Queries matching cached keys return instantly in 0.1ms.",
    LATENCY: "High concurrency queries causing trie search contention. Search latencies increase to 42ms.",
    FAILURE: "Index file deserialization error. Falling back to simple keyword matching on direct page data.",
  },
};

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
            Terminal Logs
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPaused((current) => !current)}
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
        aria-label="System terminal logs"
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
  return (
    <main
      className="relative min-w-0 rounded-lg border border-zinc-250 dark:border-border/80 bg-white dark:bg-black/45 p-4 backdrop-blur-md md:p-5"
    >
      <div
        className="absolute inset-0 -z-10 rounded-lg bg-[linear-gradient(to_right,rgba(9,9,11,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.012)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_68%,transparent)]"
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
                Architecture Topology
              </p>
            </div>
            <h2 className="mt-2 break-words text-xl font-semibold leading-7 text-zinc-900 dark:text-zinc-100">
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
              Problem constraint:{" "}
            </span>
            {study.problem}
          </p>
          <div className="rounded-lg border-l-2 border-amber/60 bg-amber/[0.025] px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wide text-amber">
              Manoj&apos;s Engineering Note
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

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 dark:border-border/40 pt-4">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase text-zinc-555 dark:text-zinc-500">
            <span
              className="size-1.5 rounded-full bg-amber"
              aria-hidden="true"
            />
            Interactive Topology
          </span>
          <p className="max-w-[52ch] break-words text-xs leading-5 text-zinc-555 dark:text-zinc-500">
            Runtime zones, gateway contracts, data-plane edges, and telemetry
            paths stay controlled by the case-study data model.
          </p>
        </footer>
      </div>
    </main>
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
            Fullscreen Topology
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
        ? `[SIMULATION WARNING] Ingress Latency Alert: ${details.LATENCY}`
        : `[SIMULATION CRITICAL] System Fault Alert: ${details.FAILURE}`;

    return [injectLog, ...baseLogs];
  };

  const currentIndex = caseStudies.findIndex((s) => s.slug === study.slug);
  const nextIndex = (currentIndex + 1) % caseStudies.length;
  const nextStudy = caseStudies[nextIndex];

  return (
    <div className="bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 flex-1 flex flex-col">
      <div className="mx-auto w-full max-w-[1540px] px-4 pt-6 md:px-6">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400 hover:text-amber transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to case studies
        </Link>
      </div>

      <PageHero
        kicker={`Case Study ${study.id}`}
        title={study.title}
        description={study.problem}
      />

      <section className="bg-zinc-100/50 dark:bg-zinc-950/40 py-8 md:py-12">
        <div className="mx-auto max-w-[1540px] px-4 md:px-6">
          <div className="grid min-w-0 gap-5">
            <StudyInspector
              study={study}
              activeNodeId={activeNodeId}
              onActiveNodeChange={setActiveNodeId}
              onFullscreen={() => setIsFullscreen(true)}
              simMode={simMode}
            />

            <aside className="grid min-w-0 gap-5 rounded-lg border border-zinc-250 dark:border-border/80 bg-white dark:bg-black/45 p-4 backdrop-blur-md xl:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.7fr)]">
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
                      System Signals
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

      <Section className="border-t border-zinc-200 dark:border-border">
        <SectionHeader
          kicker="Decision Ledger"
          title="Inspect the code-level architecture choice."
          description="Each case study includes the decision context and a compact implementation artifact that anchors the diagram in engineering reality."
        />

        <div className="mt-12 grid min-w-0 gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <Card className="rounded-lg border border-zinc-250 dark:border-border/80 bg-white dark:bg-black/20 backdrop-blur-md">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex items-center gap-2 border-b border-zinc-200 dark:border-border/60 pb-3">
                  <GitBranch className="size-4 text-amber" aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    Decision Context
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
                  ADR Reference
                </span>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-zinc-600 dark:text-zinc-400 hover:text-amber"
                >
                  <Link href="/engineering">
                    Explore decision map
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
 
            <div className="max-h-[280px] md:max-h-[430px] flex-1 overflow-auto bg-zinc-100/50 dark:bg-zinc-950/80 p-5 text-zinc-800 dark:text-zinc-200 streamdown-code-clean [&_[data-streamdown='code-block']]:border-0 [&_[data-streamdown='code-block']]:bg-transparent [&_[data-streamdown='code-block']]:p-0 [&_[data-streamdown='code-block']]:m-0 [&_[data-streamdown='code-block-body']]:border-0 [&_[data-streamdown='code-block-body']]:bg-transparent [&_[data-streamdown='code-block-body']]:p-0 [&_[data-streamdown='code-block-header']]:hidden">
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
        <Section className="border-t border-zinc-200 dark:border-border">
          <SectionHeader
            kicker="Engineering Playbooks"
            title="Technical specifications & production runbooks."
            description="Deep dive into the operational runbooks, architecture specifications, development guides, and diagrams that govern this production system."
          />

          <div className="mt-8 flex flex-col gap-6">
            {/* Playbook Navigation Tabs */}
	            <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-border/40 pb-4">
	              {study.docs.map((doc) => {
	                const isActive = activeDocSlug === doc.slug;
	                return (
	                  <button
	                    key={doc.slug}
	                    type="button"
	                    onClick={() => setRequestedDocSlug(doc.slug)}
	                    className={cn(
	                      "rounded-md border px-4 py-2 font-mono text-xs uppercase transition-all duration-150",
	                      isActive
	                        ? "border-amber/65 bg-amber/[0.06] text-zinc-900 dark:text-white shadow-[0_0_12px_rgba(245,158,11,0.15)]"
	                        : "border-zinc-200 dark:border-border/60 bg-zinc-100/50 dark:bg-zinc-950/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-350 dark:hover:border-border hover:bg-zinc-200 dark:hover:bg-white/[0.02]"
	                    )}
	                  >
	                    {doc.title}
	                  </button>
	                );
	              })}
	            </div>

            {/* Document Render Area */}
            <div className="relative min-h-[300px] rounded-lg border border-zinc-250 dark:border-border/80 bg-white dark:bg-black/45 p-6 backdrop-blur-md md:p-8">
              <div
                className="absolute inset-0 -z-10 rounded-lg bg-[linear-gradient(to_right,rgba(9,9,11,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)]"
                aria-hidden="true"
              />

              {isLoadingDoc ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
                  <div className="size-6 animate-spin rounded-full border-2 border-amber border-t-transparent" />
                  <p className="font-mono text-xs text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">Loading playbook spec...</p>
                </div>
              ) : docError ? (
                <div className="rounded-md border border-rose-500/30 bg-rose-950/10 p-5 text-center">
                  <p className="font-mono text-xs text-rose-400">Error: {docError}</p>
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
      <Section className="border-t border-zinc-200 dark:border-border mt-12 pb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl border border-zinc-200 dark:border-border/60 bg-zinc-100/50 dark:bg-zinc-950/40 p-6 backdrop-blur-md relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10 rounded-xl bg-[linear-gradient(to_right,rgba(9,9,11,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)]"
            aria-hidden="true"
          />
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber font-semibold">
              Explore Next Architecture
            </span>
            <h4 className="mt-1.5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {nextStudy.title}
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-[65ch]">
              {nextStudy.kicker} — {nextStudy.problem.slice(0, 120)}...
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="shrink-0 border-amber-400/40 dark:border-amber/40 hover:bg-amber/[0.05] text-zinc-800 dark:text-white hover:text-zinc-900 dark:hover:text-white"
          >
            <Link href={`/case-studies/${nextStudy.slug}`}>
              Inspect Next System <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      <CtaBand title="Have a system that needs this level of architecture?" />

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
