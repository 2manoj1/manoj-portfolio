"use client";

import React, { useState } from "react";
import { Activity, ArrowRight, Cpu, FileCode, ShieldAlert } from "lucide-react";

interface StepDetail {
  spec: string;
  contract: string;
  mitigation: string;
  description: string;
}

interface SystemData {
  slug: string;
  title: string;
  description: string;
  flow: string[];
  tradeoffs: string[];
  stepDetails: Record<string, StepDetail>;
  tradeoffExplanations: Record<string, string>;
}

const systemsData: SystemData[] = [
  {
    slug: "multi-agent-systems",
    title: "Multi-Agent Systems",
    description: "LangGraph-based workflows with explicit state, tool routing, memory, fallbacks, and evaluation.",
    flow: ["Intent", "Planner", "Agent State", "Tools", "Human Gate", "Trace"],
    tradeoffs: ["state visibility", "tool safety", "retry behavior", "human control"],
    tradeoffExplanations: {
      "state visibility": "High state visibility (85%) is required to debug agent path decisions, tracking prompt history and token usage.",
      "tool safety": "Strict tool safety (95%) is enforced using sandboxed environment execution and input validations to prevent prompt injection.",
      "retry behavior": "Moderate retries (75%) with exponential backoffs are configured to mitigate API failures without loop locks.",
      "human control": "High human control (90%) enforces human-in-the-loop gates for high-cost or external write tool paths."
    },
    stepDetails: {
      "Intent": {
        spec: "Natural Language Intent Parser (Router LLM)",
        contract: "QueryText -> SystemIntent{target_agent: string, confidence: float}",
        mitigation: "Fallback routing to supervisor agent if classification confidence drops below 0.85.",
        description: "Classifies the incoming user query and determines the target execution context."
      },
      "Planner": {
        spec: "Goal Decomposition Engine (Reasoner)",
        contract: "SystemIntent -> TaskPlan{steps: List[Goal], parameters: dict}",
        mitigation: "Dynamic plan-regeneration loops if tool execution returns invalid output states.",
        description: "Decomposes the classified intent into a structured sequence of actionable execution sub-goals."
      },
      "Agent State": {
        spec: "Shared Thread Memory Node (Postgres / Redis)",
        contract: "TaskPlan + StateDelta -> UpdatedStateSnapshot",
        mitigation: "Optimistic locking and atomic writes to prevent race conditions during concurrent agent steps.",
        description: "Stores and updates thread variables, memory contexts, and graph-traversal state records."
      },
      "Tools": {
        spec: "Sandboxed Execution Gateway",
        contract: "ToolCallArguments -> ToolOutput{data: json, exit_code: int}",
        mitigation: "Strict execution timeouts (max 15s) and automatic inputs sanitization filtering.",
        description: "Executes Python code scripts, performs API lookups, or query vector databases in a sandbox."
      },
      "Human Gate": {
        spec: "Human-in-the-Loop validation interface",
        contract: "RequiresApproval -> ApprovalDecision{approved: bool, state_correction: str}",
        mitigation: "Token expiration hooks; automatic graph rollback to previous state on approval timeouts.",
        description: "Pauses graph execution to request user confirmation before writing changes or calling expensive actions."
      },
      "Trace": {
        spec: "OpenTelemetry tracing instrumentation",
        contract: "TraceSpan -> OTELCollectorEvent",
        mitigation: "Asynchronous log batching to prevent telemetry pipelines from blocking query response paths.",
        description: "Records latency logs, model cost, grounding scores, and calls execution trace spans."
      }
    }
  },
  {
    slug: "rag-reliability",
    title: "RAG Reliability",
    description: "Retrieval pipelines designed for grounding quality, latency budgets, observability, and regression testing.",
    flow: ["Corpus", "Chunking", "pgvector", "Hybrid Search", "Rerank", "Evals"],
    tradeoffs: ["chunking", "ranking", "grounding", "latency"],
    tradeoffExplanations: {
      "chunking": "Standardized token sizing (80%) balances document retrieval relevance and LLM context window cost.",
      "ranking": "Dense/sparse hybrid ranking (88%) optimizes the top-K retrieval relevance over raw speed.",
      "grounding": "High grounding thresholds (95%) filter out hallucinated context inputs before model parsing.",
      "latency": "Strict latency budgets (70%) ensure average query response times remain under 180ms."
    },
    stepDetails: {
      "Corpus": {
        spec: "Ground Truth Knowledge Ingestion Pipeline",
        contract: "RawDocument -> NormalizedDocument{metadata: dict, schema: str}",
        mitigation: "Document deduplication filters and structural schema validations during imports.",
        description: "Processes raw PDFs, databases, or documentation folders into standard parsed document models."
      },
      "Chunking": {
        spec: "Semantic sliding tokens chunker",
        contract: "NormalizedDocument -> List[TextChunk{tokens: 512, overlap: 64}]",
        mitigation: "Parent-child structural references to preserve wider context during semantic match steps.",
        description: "Splits raw document texts into optimized tokens segments with overlap mapping."
      },
      "pgvector": {
        spec: "HNSW Vector Index Store (PostgreSQL)",
        contract: "TextChunk -> pgvectorEmbeddings[1536]",
        mitigation: "Strict vector dimensions match assertions; automated HNSW index rebuild scheduling.",
        description: "Indexes token chunks into a relational database using vector embeddings for semantic query matching."
      },
      "Hybrid Search": {
        spec: "Dense Vector + Sparse BM25 Query Fusion",
        contract: "QueryText -> DenseResult + SparseResult",
        mitigation: "Reciprocal Rank Fusion (RRF) scoring with adjustable dense/sparse weights.",
        description: "Queries the vector store using both semantic similarity and lexical keywords, combining outcomes."
      },
      "Rerank": {
        spec: "Cross-Encoder Reranker Node (Cohere/BGE)",
        contract: "List[TextChunk] -> List[RerankedChunk]{relevance_score > 0.65}",
        mitigation: "Similarity threshold filter to prune low-relevance documents and reduce prompt noise.",
        description: "Scores and re-orders the retrieved chunks, keeping only the highest relevance records."
      },
      "Evals": {
        spec: "Real-time LLM-assisted evaluation loop",
        contract: "ResponseContext -> EvalsMetric{grounding: float, faithfulness: float}",
        mitigation: "Real-time completion blocking if grounding evaluation scores fall below 0.85.",
        description: "Evaluates model responses against retrieved source context in real-time to prevent hallucinations."
      }
    }
  },
  {
    slug: "fastapi-ai-backends",
    title: "FastAPI AI Backends",
    description: "Async Python services, model gateways, queues, trace IDs, and deployment paths for AI product teams.",
    flow: ["API", "Queue", "Workers", "Model Gateway", "Store", "Observability"],
    tradeoffs: ["async workloads", "API contracts", "cost controls", "deployment"],
    tradeoffExplanations: {
      "async workloads": "Full async workflow loop (90%) keeps API endpoints responsive during long-running tasks.",
      "API contracts": "Strict API contract validation (85%) uses Pydantic to ensure reliable inputs.",
      "cost controls": "Rate-limits and prompt cache layers (75%) control API operational costs.",
      "deployment": "Containerized Kubernetes patterns (80%) automate backend cluster auto-scaling."
    },
    stepDetails: {
      "API": {
        spec: "Asynchronous FastAPI routing interface",
        contract: "RequestPayload -> APIRouteResponse",
        mitigation: "Pydantic request payload validations and API rate limiting middleware.",
        description: "Handles HTTP queries, verifies JWT credentials, and routes inputs to task queues."
      },
      "Queue": {
        spec: "Redis Task Message Broker",
        contract: "AsyncTaskEnvelope -> RedisTaskQueue",
        mitigation: "Dedicated dead-letter queues (DLQ) to capture and debug unprocessable tasks.",
        description: "Enqueues long-running agent tasks to execute asynchronously without blocking API responses."
      },
      "Workers": {
        spec: "Distributed Celery/RQ execution workers",
        contract: "RedisTaskQueue -> WorkerTaskRun",
        mitigation: "Process isolation and memory leak recycle limits on worker runtimes.",
        description: "Subscribes to Redis, spins up isolated graph runtimes, and processes agent steps."
      },
      "Model Gateway": {
        spec: "Multi-provider LLM failover gateway",
        contract: "PromptPayload -> LLMCompletion",
        mitigation: "Auto-failover to backup providers if primary models return 429 rate limit errors.",
        description: "Wraps Anthropic, OpenAI, and local Vertex models into a unified gateway with prompt caching."
      },
      "Store": {
        spec: "Persistent State Repository (PostgreSQL/MongoDB)",
        contract: "ThreadId -> ThreadHistory",
        mitigation: "Database indexing optimization and partition tuning for fast read-write performance.",
        description: "Persists thread states, chat histories, agent parameters, and completed execution logs."
      },
      "Observability": {
        spec: "Prometheus scraper + trace instrumentation",
        contract: "ServerMetric -> PrometheusScrapedData",
        mitigation: "Ephemeral task push-gateways to prevent metrics loss during autoscaling.",
        description: "Collects system CPU/RAM logs, request latencies, queue depths, and traces metrics."
      }
    }
  }
];

export function SystemTopologyInspector() {
  const [activeSystemIndex, setActiveSystemIndex] = useState<number>(0);
  const [activeStepName, setActiveStepName] = useState<string>("Intent");
  const [activePanelTab, setActivePanelTab] = useState<"pipeline" | "tradeoffs">("pipeline");

  const system = systemsData[activeSystemIndex];
  
  // Verify that the active step exists in the selected system, fallback if not
  const steps = system.flow;
  const currentStepName = steps.includes(activeStepName) ? activeStepName : steps[0];
  const stepInfo = system.stepDetails[currentStepName];

  // Helper for tradeoff levels
  const levels: Record<string, string> = {
    "state visibility": "85%",
    "tool safety": "95%",
    "retry behavior": "75%",
    "human control": "90%",
    "chunking": "80%",
    "ranking": "88%",
    "grounding": "95%",
    "latency": "70%",
    "async workloads": "90%",
    "API contracts": "85%",
    "cost controls": "75%",
    "deployment": "80%",
  };

  const handleSystemChange = (index: number) => {
    setActiveSystemIndex(index);
    setActiveStepName(systemsData[index].flow[0]);
  };

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.8fr]">
      
      {/* Left panel: System selector tabs */}
      <div className="flex flex-col gap-3">
        {systemsData.map((sys, idx) => (
          <button
            key={sys.slug}
            onClick={() => handleSystemChange(idx)}
            className={`group relative text-left rounded-xl border p-5 transition-all duration-300 ${
              activeSystemIndex === idx
                ? "border-amber/40 bg-zinc-900/40 shadow-[0_0_12px_rgba(245,158,11,0.06)]"
                : "border-border/60 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-900/10"
            }`}
          >
            {/* Top border glow indicator */}
            {activeSystemIndex === idx && (
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber/35 to-transparent" />
            )}

            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-semibold transition-colors ${
                activeSystemIndex === idx ? "text-amber" : "text-foreground group-hover:text-zinc-100"
              }`}>
                {sys.title}
              </h4>
              <ArrowRight className={`size-3.5 transition-all ${
                activeSystemIndex === idx ? "translate-x-0.5 text-amber" : "text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5"
              }`} />
            </div>
            
            <p className="mt-2 text-xs leading-5 text-muted-foreground/80">
              {sys.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {sys.flow.map((step) => (
                <span
                  key={step}
                  className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${
                    activeSystemIndex === idx && activeStepName === step
                      ? "bg-amber/10 border-amber/30 text-amber font-bold"
                      : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400"
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Right panel: Active system detailed inspector board */}
      <div className="relative flex flex-col justify-between rounded-xl border border-border bg-zinc-950/40 p-6 shadow-md">
        
        {/* Top window headers */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-zinc-800" />
                <span className="size-2.5 rounded-full bg-zinc-800" />
                <span className="size-2.5 rounded-full bg-zinc-800" />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest pl-2 border-l border-zinc-800">
                system_topology_inspector.cfg
              </span>
            </div>

            {/* Toggle panels */}
            <div className="flex gap-1 bg-zinc-900/80 border border-zinc-800/80 p-0.5 rounded-md">
              <button
                onClick={() => setActivePanelTab("pipeline")}
                className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  activePanelTab === "pipeline"
                    ? "bg-zinc-950 text-amber font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pipeline View
              </button>
              <button
                onClick={() => setActivePanelTab("tradeoffs")}
                className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  activePanelTab === "tradeoffs"
                    ? "bg-zinc-950 text-amber font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tradeoffs Map
              </button>
            </div>
          </div>

          <h3 className="text-base font-semibold text-foreground tracking-tight mt-5">
            {system.title} Specs
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            {system.description}
          </p>

          {activePanelTab === "pipeline" ? (
            /* Pipeline execution flow visualizer */
            <div className="mt-8">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-3.5">
                {"// Execution Pipeline (Click to inspect)"}
              </p>
              
              {/* Linked steps buttons layout */}
              <div className="flex flex-wrap items-center gap-y-2.5 gap-x-1.5">
                {steps.map((step, index) => {
                  const isActive = currentStepName === step;
                  return (
                    <div key={step} className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveStepName(step)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-mono text-[11px] transition-all duration-200 ${
                          isActive
                            ? "bg-amber/5 border-amber/40 text-amber shadow-[0_0_8px_rgba(245,158,11,0.06)] font-semibold"
                            : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700/60 hover:bg-zinc-900/50 text-zinc-400"
                        }`}
                      >
                        <span className={`text-[9px] font-bold ${isActive ? "text-amber/70" : "text-zinc-500"}`}>
                          0{index + 1}
                        </span>
                        <span>{step}</span>
                      </button>
                      {index < steps.length - 1 && (
                        <span className="text-zinc-700 font-mono text-[10px] pr-0.5">→</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step Detail Card */}
              {stepInfo && (
                <div className="mt-6 border border-border bg-zinc-900/20 p-5 rounded-lg relative overflow-hidden animate-fadeIn">
                  
                  {/* Glowing active step bullet */}
                  <div className="absolute top-0 right-0 p-3 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-400">ACTIVE STATE</span>
                  </div>

                  <h4 className="text-xs font-bold text-foreground">
                    Stage {steps.indexOf(currentStepName) + 1}: {currentStepName}
                  </h4>
                  <p className="text-xs text-muted-foreground/90 mt-2 leading-relaxed max-w-xl">
                    {stepInfo.description}
                  </p>

                  <div className="mt-5 space-y-3.5 border-t border-zinc-800/80 pt-4">
                    <div className="grid gap-1 sm:grid-cols-[120px_1fr]">
                      <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                        <Cpu className="size-3 text-amber/60" /> SPECIFICATION:
                      </span>
                      <span className="font-mono text-[10px] text-zinc-300 leading-relaxed truncate-lines">
                        {stepInfo.spec}
                      </span>
                    </div>

                    <div className="grid gap-1 sm:grid-cols-[120px_1fr]">
                      <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                        <FileCode className="size-3 text-amber/60" /> DATA CONTRACT:
                      </span>
                      <span className="font-mono text-[10px] text-zinc-300 leading-relaxed break-all bg-zinc-950/60 border border-zinc-900 px-2 py-1.5 rounded">
                        {stepInfo.contract}
                      </span>
                    </div>

                    <div className="grid gap-1 sm:grid-cols-[120px_1fr]">
                      <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                        <ShieldAlert className="size-3 text-amber/60" /> MITIGATION:
                      </span>
                      <span className="font-mono text-[10px] text-zinc-300 leading-relaxed">
                        {stepInfo.mitigation}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Tradeoffs values explainers panel */
            <div className="mt-8 space-y-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-1.5">
                  {"// Architectural Tradeoffs & System Constraints"}
                </p>
                <p className="text-xs text-muted-foreground/80 max-w-xl">
                  Adjusting state contracts directly changes verification capabilities, caching ratios, and operational latency budgets.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {system.tradeoffs.map((tradeoff) => {
                  const percent = levels[tradeoff] || "80%";
                  const explanation = system.tradeoffExplanations[tradeoff] || "System operational constraint.";
                  return (
                    <div key={tradeoff} className="border border-border bg-zinc-900/10 p-4 rounded-lg flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                          <span className="font-semibold text-zinc-300 uppercase tracking-wide">{tradeoff}</span>
                          <span className="text-amber font-bold text-[10px] font-mono">{percent}</span>
                        </div>
                        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground/75">
                          {explanation}
                        </p>
                      </div>

                      {/* Slider bar */}
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-900/50">
                        <div 
                          className="absolute left-0 top-0 h-full bg-amber/50 rounded-full"
                          style={{ width: percent }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer info link */}
        <div className="mt-8 border-t border-border/80 pt-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60">
          <span className="flex items-center gap-1.5">
            <Activity className="size-3 text-emerald-500 animate-pulse" /> Trace status: telemetry active
          </span>
          <span>SYSTEM RUNTIME // VERIFIED</span>
        </div>

      </div>

    </div>
  );
}
