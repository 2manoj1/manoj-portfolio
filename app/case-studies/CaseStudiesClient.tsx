"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  FileCode,
  GitBranch,
  Layers,
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
import { caseStudies, type CaseStudy } from "./_data/case-studies";
import { TopologyCanvas } from "./_components/TopologyCanvas";
import { SimulationDeck, type SimMode } from "./_components/SimulationDeck";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";

function statusTone(status: CaseStudy["status"]) {
  if (status === "PRODUCTION") {
    return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.55)]";
  }

  if (status === "ACTIVE") {
    return "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.55)]";
  }

  return "bg-amber shadow-[0_0_10px_rgba(245,158,11,0.55)]";
}

const SIMULATION_DETAILS = {
  "production-grade-ai-home-lab": {
    HEALTHY: "System fully online. Next.js chat requests are brokered over Cloudflare tunnel to local FastAPI gateway.",
    LATENCY: "Cloudflare connection congestion. Traffic experiences 3.4s latency spike. Retrying SSE connection streams...",
    FAILURE: "Ollama service crashed. Out of Memory error in local Qwen model process. Local API gateway fallback engaged.",
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

function BlueprintSelector({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <aside className="flex min-w-0 flex-col justify-between rounded-lg border border-border/80 bg-black/45 p-4 backdrop-blur-md">
      <div>
        <div className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
          <Layers className="size-4 text-amber" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-wide text-zinc-400">
            Blueprints
          </span>
        </div>
        <div
          role="tablist"
          aria-label="Systems case study blueprints"
          className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1"
        >
          {caseStudies.map((study, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={study.slug}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`blueprint-tabpanel-${index}`}
                id={`blueprint-tab-${index}`}
                onClick={() => onSelect(index)}
                className={cn(
                  "group min-w-0 rounded-lg border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                  isActive
                    ? "border-amber/65 bg-amber/[0.06] text-white"
                    : "border-border/60 bg-transparent text-zinc-400 hover:border-border hover:bg-white/[0.025]",
                )}
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase text-amber">
                      {study.id}
                    </p>
                    <h3
                      className={cn(
                        "mt-1 break-words text-sm font-semibold leading-5",
                        isActive ? "text-white" : "group-hover:text-zinc-100",
                      )}
                    >
                      {study.shortTitle}
                    </h3>
                    <p className="mt-1 break-words text-xs leading-5 text-zinc-400">
                      {study.kicker}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 pt-1 font-mono text-[10px] uppercase text-zinc-400">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        statusTone(study.status),
                      )}
                      aria-hidden="true"
                    />
                    {study.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 border-t border-border/60 pt-4">
        <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
          System Context
        </p>
        <p className="mt-2 text-xs leading-5 text-zinc-400">
          Production AI systems, runtime boundaries, and architecture tradeoffs.
        </p>
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
          className="min-w-0 rounded-lg border border-border/60 bg-zinc-950/45 p-3.5"
        >
          <p className="break-words font-mono text-[10px] uppercase tracking-wide text-zinc-500">
            {metric.label}
          </p>
          <p className="mt-1 break-words text-lg font-semibold leading-6 text-zinc-100">
            {metric.value}
          </p>
          <p className="mt-2 break-words text-xs leading-5 text-zinc-400">
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
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-border/60 pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-amber" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-400">
            Terminal Logs
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPaused((current) => !current)}
          disabled={Boolean(prefersReducedMotion)}
          className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-100"
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
        className="h-[180px] md:h-[230px] overflow-y-auto rounded-lg border border-border/80 bg-black/75 p-3.5 font-mono text-xs leading-5 text-emerald-400"
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
  activeIndex,
  activeNodeId,
  onActiveNodeChange,
  onFullscreen,
  simMode,
}: {
  study: CaseStudy;
  activeIndex: number;
  activeNodeId: string | null;
  onActiveNodeChange: (nodeId: string | null) => void;
  onFullscreen: () => void;
  simMode: SimMode;
}) {
  return (
    <main
      id={`blueprint-tabpanel-${activeIndex}`}
      role="tabpanel"
      aria-labelledby={`blueprint-tab-${activeIndex}`}
      className="relative min-w-0 rounded-lg border border-border/80 bg-black/45 p-4 backdrop-blur-md md:p-5"
    >
      <div
        className="absolute inset-0 -z-10 rounded-lg bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_68%,transparent)]"
        aria-hidden="true"
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={study.slug}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="min-w-0"
        >
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Monitor
                  className="size-4 shrink-0 text-amber"
                  aria-hidden="true"
                />
                <p className="font-mono text-xs uppercase tracking-wide text-zinc-400">
                  Architecture Topology
                </p>
              </div>
              <h2 className="mt-2 break-words text-xl font-semibold leading-7 text-zinc-100">
                {study.title}
              </h2>
            </div>
            <div className="grid gap-1 text-left font-mono text-[10px] uppercase leading-5 text-zinc-500 sm:text-right">
              <span className="break-words">Env: {study.environment}</span>
              <span className="break-words">Ingress: {study.ingress}</span>
            </div>
          </header>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.72fr]">
            <p className="break-words text-sm leading-7 text-zinc-300">
              <span className="font-medium text-zinc-100">
                Problem constraint:{" "}
              </span>
              {study.problem}
            </p>
            <div className="rounded-lg border-l-2 border-amber/60 bg-amber/[0.025] px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wide text-amber">
                Manoj&apos;s Engineering Note
              </p>
              <p className="mt-2 break-words text-xs leading-6 text-zinc-300">
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

          <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase text-zinc-500">
              <span
                className="size-1.5 rounded-full bg-amber"
                aria-hidden="true"
              />
              Interactive Topology
            </span>
            <p className="max-w-[52ch] break-words text-xs leading-5 text-zinc-500">
              Runtime zones, gateway contracts, data-plane edges, and telemetry
              paths stay controlled by the case-study data model.
            </p>
          </footer>
        </motion.div>
      </AnimatePresence>
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
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/98 p-4 backdrop-blur-md md:p-6">
      <header className="mb-4 flex items-start justify-between gap-4 border-b border-border/60 pb-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wide text-amber">
            Fullscreen Topology
          </p>
          <h2 className="mt-1 break-words text-lg font-semibold text-white">
            {study.title}
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="border-border/80 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
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

export default function CaseStudiesClient() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [simMode, setSimMode] = useState<SimMode>("HEALTHY");
  const activeStudy = caseStudies[activeIndex];

  const selectStudy = (index: number) => {
    setActiveIndex(index);
    setActiveNodeId(null);
    setSimMode("HEALTHY");
    const study = caseStudies[index];
    if (study) {
      window.history.pushState(null, "", `#${study.slug}`);
    }
  };

  // Synchronize active study tab with URL hash deep links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const foundIndex = caseStudies.findIndex((study) => study.slug === hash);
        if (foundIndex !== -1) {
          setActiveIndex(foundIndex);
          setActiveNodeId(null);
          setSimMode("HEALTHY");
        }
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const getSimulatedLogs = () => {
    const baseLogs = activeStudy.logs;
    if (simMode === "HEALTHY") {
      return baseLogs;
    }

    const details = SIMULATION_DETAILS[activeStudy.slug as keyof typeof SIMULATION_DETAILS];
    const injectLog =
      simMode === "LATENCY"
        ? `[SIMULATION WARNING] Ingress Latency Alert: ${details.LATENCY}`
        : `[SIMULATION CRITICAL] System Fault Alert: ${details.FAILURE}`;

    return [injectLog, ...baseLogs];
  };

  return (
    <>
      <PageHero
        kicker="AI Systems Command Console"
        title="System architectures under telemetry."
        description="A technical case-study console for inspecting runtime boundaries, network zones, orchestration choices, logs, and code-level architecture decisions."
      />

      <section className="bg-zinc-950/40 py-8 md:py-12">
        <div className="mx-auto max-w-[1540px] px-4 md:px-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="hidden lg:block">
                <BlueprintSelector
                  activeIndex={activeIndex}
                  onSelect={selectStudy}
                />
              </div>

              <div className="lg:hidden">
                <select
                  value={activeIndex}
                  onChange={(e) => selectStudy(Number(e.target.value))}
                  className="
        w-full
        rounded-lg
        border
        border-border
        bg-background
        px-3
        py-2
      "
                >
                  {caseStudies.map((study, index) => (
                    <option key={study.slug} value={index}>
                      {study.shortTitle}
                    </option>
                  ))}
                </select>
              </div>

            <div className="grid min-w-0 gap-5">
              <StudyInspector
                study={activeStudy}
                activeIndex={activeIndex}
                activeNodeId={activeNodeId}
                onActiveNodeChange={setActiveNodeId}
                onFullscreen={() => setIsFullscreen(true)}
                simMode={simMode}
              />

              <aside className="grid min-w-0 gap-5 rounded-lg border border-border/80 bg-black/45 p-4 backdrop-blur-md xl:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.7fr)]">
                <div className="flex flex-col gap-5 min-w-0">
                  <SimulationDeck
                    activeMode={simMode}
                    onChangeMode={setSimMode}
                    description={SIMULATION_DETAILS[activeStudy.slug as keyof typeof SIMULATION_DETAILS][simMode]}
                  />
                  <div>
                    <div className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
                      <Activity
                        className="size-4 text-amber"
                        aria-hidden="true"
                      />
                      <span className="font-mono text-xs uppercase tracking-wide text-zinc-400">
                        System Signals
                      </span>
                    </div>
                    <TelemetryPanel study={activeStudy} />
                  </div>
                </div>

                <div className="min-w-0">
                  <TerminalConsole
                    key={activeStudy.slug}
                    logs={getSimulatedLogs()}
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <Section className="border-t border-border">
        <SectionHeader
          kicker="Decision Ledger"
          title="Inspect the code-level architecture choice."
          description="Each case study includes the decision context and a compact implementation artifact that anchors the diagram in engineering reality."
        />

        <div className="mt-12 grid min-w-0 gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <Card className="rounded-lg border border-border/80 bg-black/20 backdrop-blur-md">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
                  <GitBranch className="size-4 text-amber" aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-wide text-zinc-400">
                    Decision Context
                  </span>
                </div>
                <h3 className="text-base font-semibold text-zinc-100">
                  {activeStudy.adr.filename}
                </h3>
                <p className="mt-4 break-words text-sm leading-7 text-zinc-300">
                  {activeStudy.adr.choice}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-zinc-400">
                  <FileCode
                    className="size-3.5 text-amber"
                    aria-hidden="true"
                  />
                  ADR Reference
                </span>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs hover:text-amber"
                >
                  <Link href="/engineering">
                    Explore decision map
                    <ArrowRight
                      className="ml-1.5 size-3.5"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border/80 bg-zinc-950 font-mono text-[11px] leading-relaxed shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 bg-zinc-900 px-4 py-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-rose-500/90" />
                <span className="size-2.5 rounded-full bg-amber/90" />
                <span className="size-2.5 rounded-full bg-emerald-500/90" />
              </div>
              <span className="min-w-0 break-words text-center text-[10px] text-zinc-400">
                {activeStudy.adr.filename}
              </span>
              <span className="font-mono text-[9px] uppercase text-amber">
                {activeStudy.adr.language}
              </span>
            </div>

            <div className="max-h-[280px] md:max-h-[430px] flex-1 overflow-auto bg-zinc-950/80 p-5 text-zinc-200 streamdown-code-clean [&_[data-streamdown='code-block']]:border-0 [&_[data-streamdown='code-block']]:bg-transparent [&_[data-streamdown='code-block']]:p-0 [&_[data-streamdown='code-block']]:m-0 [&_[data-streamdown='code-block-body']]:border-0 [&_[data-streamdown='code-block-body']]:bg-transparent [&_[data-streamdown='code-block-body']]:p-0 [&_[data-streamdown='code-block-header']]:hidden">
              <Streamdown plugins={{ code }} shikiTheme={["dracula", "dracula"]} controls={{ code: { download: false } }}>
                {`\`\`\`${activeStudy.adr.language}\n${activeStudy.adr.code}\n\`\`\``}
              </Streamdown>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand title="Have a system that needs this level of architecture?" />

      {isFullscreen ? (
        <FullscreenTopology
          study={activeStudy}
          activeNodeId={activeNodeId}
          onActiveNodeChange={setActiveNodeId}
          onClose={() => setIsFullscreen(false)}
          simMode={simMode}
        />
      ) : null}
    </>
  );
}
