"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  Clipboard, 
  Sparkles, 
  Calculator, 
  Sliders, 
  Activity, 
  Mail, 
  Calendar,
  ArrowUpRight,
  Terminal,
  Play,
  RotateCcw,
  Sparkle,
  Copy,
  Check
} from "lucide-react";
import { LINKEDIN, EMAIL, CALENDLY } from "@/lib/links";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface BottleneckOption {
  id: string;
  label: string;
  recommendation: string;
  deliverables: string[];
}

const bottlenecks: BottleneckOption[] = [
  {
    id: "agents",
    label: "Agent Loops are opaque, brittle, or fail in production",
    recommendation: "LangGraph Consultant Engagement",
    deliverables: [
      "Explicit LangGraph state machine flow mapping",
      "Deterministic tool routing and failover checkpoints",
      "Multi-agent regression evaluation datasets",
      "Human-in-the-loop validation gate integrations"
    ]
  },
  {
    id: "rag",
    label: "Poor retrieval grounding, hallucinations, or latency budgets",
    recommendation: "RAG Infrastructure Consulting",
    deliverables: [
      "pgvector and HNSW index tuning in PostgreSQL",
      "Dense vector + BM25 reciprocal rank fusion (RRF)",
      "Cross-encoder reranking threshold optimizations",
      "Automated faithfulness and relevancy evals pipeline"
    ]
  },
  {
    id: "platform",
    label: "Prototype code needs to scale and be containerized",
    recommendation: "AI Platform Engineering Engagement",
    deliverables: [
      "Asynchronous FastAPI microservices blueprints",
      "Redis/Celery workers and queue design patterns",
      "Kubernetes / OpenShift container configurations",
      "OpenTelemetry tracing and Prometheus metrics"
    ]
  },
  {
    id: "adoption",
    label: "Infrastructure developer adoption or templates are missing",
    recommendation: "DevRel Engineering Partnership",
    deliverables: [
      "Production-grade reference application builds",
      "High-fidelity architecture diagram flows and write-ups",
      "Senior engineer-level technical articles and guides",
      "Interactive code templates for quick developer onboarding"
    ]
  },
  {
    id: "roadmap",
    label: "AI roadmap is moving faster than architecture decisions",
    recommendation: "AI Architecture Advisory / Fractional Architect",
    deliverables: [
      "Technical decision records (ADRs) mapping stack choices",
      "Vendor and platform capability audit logs",
      "POC-to-production roadmap sequencing blueprints",
      "Fractional engineering advisory team review sessions"
    ]
  }
];

const scales = [
  { id: "poc", label: "Proof-of-Concept / Rapid Pilot", timeline: "2 - 3 weeks scope" },
  { id: "scale", label: "Scaling to Production (10k+ runs)", timeline: "4 - 6 weeks scope" },
  { id: "enterprise", label: "Enterprise Security & Compliance", timeline: "8+ weeks scope" }
];

const stacks = [
  { id: "cloud", label: "Serverless Cloud (AWS Bedrock / GCP Vertex)" },
  { id: "hybrid", label: "Kubernetes / RedHat OpenShift / NVIDIA Run:AI" },
  { id: "local", label: "Local / Private weights (Ollama / vLLM)" }
];

// Models price sheet (per 1M tokens)
const modelsConfig = {
  sonnet: { name: "Claude 3.5 Sonnet", input: 3.0, output: 15.0, latency: 350 },
  gpt4o: { name: "GPT-4o", input: 2.50, output: 10.0, latency: 280 },
  deepseek: { name: "DeepSeek V3 / R1", input: 0.55, output: 2.19, latency: 420 },
  llama: { name: "LLaMA 3.3 70B (vLLM)", input: 0.80, output: 0.80, latency: 180 }
};

// Telemetry Sandbox scenarios
const telemetryScenarios = {
  agent: {
    name: "Stateful Agent Workflow (LangGraph)",
    description: "Evaluates multi-agent graph routing, state checks, and loop cycles.",
    metrics: { latency: "1,120 ms", tokens: "4,120", cost: "$0.0028" },
    logs: [
      { text: "[INIT] Starting LangGraph engine...", type: "system" },
      { text: "[SCHEMA] Initializing active graph: StateGraph(input, history, path, attempts)", type: "info" },
      { text: "[SUPERVISOR] Routing intent: 'Generate api specs for order pipeline'", type: "query" },
      { text: "[NODE] supervisor -> Routing payload to 'spec_writer' agent", type: "info" },
      { text: "[NODE] spec_writer -> Executing node runtime (attempt 1/3)...", type: "info" },
      { text: "[TOOL] calling tool 'fetch_existing_contracts' with: { endpoint: 'orders' }", type: "tool" },
      { text: "[DATABASE] PostgreSQL: Found 4 candidate endpoints in 84ms", type: "db" },
      { text: "[NODE] spec_writer -> Output payload generated (1,240 tokens)", type: "info" },
      { text: "[SUPERVISOR] supervisor -> Routing output to 'evaluator' agent", type: "info" },
      { text: "[NODE] evaluator -> Running evaluations checks...", type: "info" },
      { text: "[EVAL] Check 'Faithfulness': 0.94 | Check 'Completeness': 0.91", type: "success" },
      { text: "[EVAL] Hallucination Check: PASS (0.00% probability)", type: "success" },
      { text: "[WARNING] evaluator -> Rejected: Draft lacks latency constraints schema", type: "warning" },
      { text: "[SUPERVISOR] supervisor -> Routing back to 'spec_writer' with feedback", type: "info" },
      { text: "[NODE] spec_writer -> Executing node runtime (attempt 2/3)...", type: "info" },
      { text: "[NODE] spec_writer -> Added P95 timeout contracts (150ms budget)", type: "info" },
      { text: "[SUPERVISOR] supervisor -> Routing output to 'evaluator' agent", type: "info" },
      { text: "[NODE] evaluator -> Running evaluations checks...", type: "info" },
      { text: "[EVAL] Check 'Faithfulness': 0.98 | Check 'Completeness': 0.99", type: "success" },
      { text: "[SYSTEM] Graph execution completed. Final state saved to postgres store.", type: "system" },
      { text: "[METRICS] Nodes Traversed: 6 | Latency: 1.12s | Total Cost: $0.0028 (caching active)", type: "metric" }
    ]
  },
  rag: {
    name: "Hybrid pgvector Search (RAG Index)",
    description: "Evaluates HNSW vector indexing, BM25 keyword search, and Cohere reranker.",
    metrics: { latency: "134 ms", tokens: "2,450", cost: "$0.0049" },
    logs: [
      { text: "[INIT] Ingesting query: 'How do we handle idempotency in celery workers?'", type: "query" },
      { text: "[EMBED] Generating 1536-dim embeddings via text-embedding-3-small...", type: "info" },
      { text: "[EMBED] Embeddings complete in 28ms", type: "success" },
      { text: "[SEARCH] Querying database: vector match (pgvector) + lexical (BM25)", type: "info" },
      { text: "[DATABASE] pgvector: Scan table 'technical_documentation' with HNSW operator", type: "db" },
      { text: "[DATABASE] pgvector: Index scan 'idx_embeddings_hnsw' [COMPLETED in 32ms]", type: "db" },
      { text: "[DATABASE] pgvector: Retrieved 5 vector match candidates", type: "db" },
      { text: "[DATABASE] BM25: Scanned text index 'idx_doc_text' in 14ms", type: "db" },
      { text: "[RAG] Reciprocal Rank Fusion: Merging dense and sparse ranks (k=60)...", type: "info" },
      { text: "[RAG] RRF rank merge completed in 3ms", type: "success" },
      { text: "[RERANK] Passing top 10 candidates to Cohere-v3-Rerank...", type: "info" },
      { text: "[RERANK] Cohere rerank scores returned in 52ms:", type: "info" },
      { text: "  -> docs/celery_guide.md (score: 0.965)", type: "success" },
      { text: "  -> docs/idempotent_workers.md (score: 0.921)", type: "success" },
      { text: "  -> docs/redis_locking.md (score: 0.814)", type: "success" },
      { text: "[RAG] Slicing top 3 context chunks (total: 2,450 tokens)", type: "info" },
      { text: "[RAG] RAG pipeline output ready. Sending to model gateway.", type: "system" },
      { text: "[METRICS] Latency: 134ms | Context Precision: 98% | Grounding: OK", type: "metric" }
    ]
  },
  gateway: {
    name: "API Gateway & Guardrails (FastAPI / Redis)",
    description: "Evaluates semantic prompt caching, Llama-Guard checks, and PII filtering.",
    metrics: { latency: "42 ms", tokens: "3,000", cost: "$0.0006" },
    logs: [
      { text: "[INGRESS] FastAPI: POST /api/v1/chat/completions", type: "system" },
      { text: "[AUTH] API Key verified for client 'enterprise_platform'", type: "info" },
      { text: "[REDIS] Checking semantic cache with query hash: '5e3f49...'", type: "db" },
      { text: "[REDIS] Cache Miss (cosine distance 0.28 > threshold 0.15)", type: "warning" },
      { text: "[GUARD] Running input safety checks against Llama-Guard-3...", type: "info" },
      { text: "[GUARD] Input Safety: Toxicity 0.002 | Prompt Injection 0.005 -> SAFE", type: "success" },
      { text: "[GATEWAY] Routing payload to LLM endpoint: Claude 3.5 Sonnet", type: "info" },
      { text: "[HTTP] Initiated client POST to api.anthropic.com", type: "info" },
      { text: "[HTTP] Chunk stream response header received in 230ms", type: "success" },
      { text: "[GATEWAY] LLM complete response received (680ms total)", type: "info" },
      { text: "[GUARD] Running output safety filters...", type: "info" },
      { text: "[GUARD] PII Filter: SSN check [PASS], API Keys check [PASS]", type: "success" },
      { text: "[GUARD] Output Safety: Grounding Relevancy check: 0.97", type: "success" },
      { text: "[REDIS] Writing response to semantic cache...", type: "db" },
      { text: "[REDIS] Cache write OK in 4ms", type: "db" },
      { text: "[EGRESS] FastAPI: Returning status 200 OK to client", type: "system" },
      { text: "[METRICS] Total Time: 680ms | Cache Status: MISSED & WRITTEN | Cost: $0.0048", type: "metric" }
    ]
  }
};

export function AdvisoryScopeConstructor() {
  const [activeTab, setActiveTab] = useState<"router" | "simulator" | "telemetry">("router");
  
  // State for Scope Router
  const [selectedBottleneck, setSelectedBottleneck] = useState<string>("agents");
  const [selectedScale, setSelectedScale] = useState<string>("scale");
  const [selectedStack, setSelectedStack] = useState<string>("hybrid");
  const [copied, setCopied] = useState<boolean>(false);

  // State for Simulator
  const [selectedModel, setSelectedModel] = useState<keyof typeof modelsConfig>("sonnet");
  const [requestsVolume, setRequestsVolume] = useState<number>(100000); // 100k requests/mo
  const [avgTokens, setAvgTokens] = useState<number>(3000); // 3k tokens/request
  const [cacheRatio, setCacheRatio] = useState<number>(0.6); // 60% cache hit
  const [hasHnsw, setHasHnsw] = useState<boolean>(true);
  const [hasGuardrails, setHasGuardrails] = useState<boolean>(true);

  // State for Telemetry Sandbox
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof telemetryScenarios>("agent");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [displayedLogs, setDisplayedLogs] = useState<Array<{ text: string; type: string }>>([]);
  const [logIndex, setLogIndex] = useState<number>(0);
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  // State for Clipboard copy notes
  const [noteCopied, setNoteCopied] = useState<boolean>(false);

  // Auto-scroll terminal console to bottom
  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  // Terminal telemetry log loop
  useEffect(() => {
    if (!isSimulating) return;
    const scenarioData = telemetryScenarios[selectedScenario];
    if (logIndex < scenarioData.logs.length) {
      const timer = setTimeout(() => {
        setDisplayedLogs(prev => [...prev, scenarioData.logs[logIndex]]);
        setLogIndex(prev => prev + 1);
      }, logIndex === 0 ? 150 : Math.random() * 150 + 80);
      return () => clearTimeout(timer);
    } else {
      setIsSimulating(false);
    }
  }, [isSimulating, logIndex, selectedScenario]);

  const handleStartSimulation = () => {
    setDisplayedLogs([]);
    setLogIndex(0);
    setIsSimulating(true);
  };

  // Scope Router calculations
  const bottleneck = bottlenecks.find(b => b.id === selectedBottleneck) || bottlenecks[0];
  const scale = scales.find(s => s.id === selectedScale) || scales[1];
  const stack = stacks.find(st => st.id === selectedStack) || stacks[0];

  const scopeSummary = `AI ARCHITECTURE ENGAGEMENT SCOPE SUMMARY
------------------------------------------
Primary Focus: ${bottleneck.recommendation}
Bottleneck: ${bottleneck.label}
Scale Target: ${scale.label} (${scale.timeline})
Infrastructure Stack: ${stack.label}

Expected Key Deliverables:
${bottleneck.deliverables.map(d => `- ${d}`).join("\n")}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scopeSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulator calculations
  const model = modelsConfig[selectedModel];
  const totalTokensPerRequest = avgTokens;
  const inputRatio = 0.75;
  const outputRatio = 0.25;
  const inputTokens = totalTokensPerRequest * inputRatio;
  const outputTokens = totalTokensPerRequest * outputRatio;

  // Raw costs (No caching)
  const rawInputCost = (requestsVolume * inputTokens * model.input) / 1000000;
  const rawOutputCost = (requestsVolume * outputTokens * model.output) / 1000000;
  const rawMonthlyCost = rawInputCost + rawOutputCost;

  // Optimized costs (With prompt caching)
  // Caching hit ratio saves 80% of input token price for hits
  const optimizedInputCost = (requestsVolume * inputTokens * (1 - cacheRatio * 0.8) * model.input) / 1000000;
  const optimizedMonthlyCost = optimizedInputCost + rawOutputCost;
  const monthlySavings = rawMonthlyCost - optimizedMonthlyCost;

  // Latency calculation: pgvector HNSW reduces query latency by 25%. Caching hit reduces model lookup.
  const baseLatency = model.latency;
  const cacheLatencyAdjustment = cacheRatio * 0.5; // Up to 50% decrease in average latency
  const hnswAdjustment = hasHnsw ? 0.25 : 0;
  const estimatedLatency = Math.round(baseLatency * (1 - cacheLatencyAdjustment) * (1 - hnswAdjustment));

  // Grounding safety score representation
  const baseGrounding = 0.82;
  const guardrailsAdjustment = hasGuardrails ? 0.16 : 0;
  const estimatedGrounding = Math.min(0.99, baseGrounding + guardrailsAdjustment) * 100;

  // Dynamic templates for mailto
  const emailSubject1 = encodeURIComponent(`AI Advisory Scope: ${bottleneck.recommendation}`);
  const emailBody1 = encodeURIComponent(`Hi Manoj,

I configured an advisory scope on your platform:
- Focus Surface: ${bottleneck.recommendation}
- System Bottleneck: ${bottleneck.label}
- Target Scale: ${scale.label} (${scale.timeline})
- Infrastructure Style: ${stack.label}

Deliverables requested:
${bottleneck.deliverables.map(d => `- ${d}`).join("\n")}

I'd like to discuss scheduling an intake briefing.`);

  const emailSubject2 = encodeURIComponent(`AI Architecture Optimization Inquiry`);
  const emailBody2 = encodeURIComponent(`Hi Manoj,

I ran your Cost & Latency Simulator with the following setup:
- Foundation Model: ${model.name}
- Monthly Volume: ${requestsVolume.toLocaleString()} calls/mo
- Prompt Cache Hit Ratio: ${(cacheRatio * 100).toFixed(0)}%
- Optimization Layers: ${hasHnsw ? "pgvector HNSW index" : "None"}, ${hasGuardrails ? "LangGraph Guardrails" : "None"}

Projected Metrics:
- Average Latency: ${estimatedLatency} ms
- Safety Grounding: ${estimatedGrounding.toFixed(0)}%
- Raw Monthly Cost: $${rawMonthlyCost.toFixed(0)}
- Optimized Monthly Cost: $${optimizedMonthlyCost.toFixed(0)}
- Monthly Savings: $${monthlySavings.toFixed(0)} (${((monthlySavings / rawMonthlyCost) * 100).toFixed(0)}% savings)

I would love to explore how we can deploy these caching mechanisms and optimization layers on our stack.`);

  const emailSubject3 = encodeURIComponent(`AI Telemetry Sandbox Discovery: ${telemetryScenarios[selectedScenario].name}`);
  const emailBody3 = encodeURIComponent(`Hi Manoj,

I ran the simulated trace for "${telemetryScenarios[selectedScenario].name}" on your AI Architecture Services platform.

I'm interested in implementing robust telemetry, evaluations, and observability metrics (like P95 latency of ${telemetryScenarios[selectedScenario].metrics.latency} and grounding checking) for our production LLM workloads.

Let's schedule a brief conversation.`);

  // Copy helper for LinkedIn connect note
  const linkedInNote = "Hi Manoj, I used your AI Architecture Simulator and was impressed by the telemetry console. I'd love to connect and discuss optimization options for our production LLM pipelines.";
  const handleCopyLinkedInNote = () => {
    navigator.clipboard.writeText(linkedInNote);
    setNoteCopied(true);
    setTimeout(() => setNoteCopied(false), 3000);
  };

  return (
    <div className="mt-12 overflow-hidden rounded-xl border border-border bg-zinc-950/40 shadow-lg">
      
      {/* Chrome Window Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-zinc-900/50 px-6 py-4 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-zinc-800" />
            <span className="size-2.5 rounded-full bg-zinc-800" />
            <span className="size-2.5 rounded-full bg-zinc-800" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest pl-2 border-l border-zinc-800 flex items-center gap-1.5">
            <Sparkles className="size-3 text-amber animate-pulse" /> architect_sandbox_hub.exe
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-1 bg-zinc-900/80 border border-zinc-800/80 p-0.5 rounded-md">
          <button
            onClick={() => setActiveTab("router")}
            className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === "router" ? "bg-zinc-950 text-amber font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sliders className="size-3" /> Scope Router
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === "simulator" ? "bg-zinc-950 text-amber font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calculator className="size-3" /> Cost Simulator
          </button>
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === "telemetry" ? "bg-zinc-950 text-amber font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="size-3" /> Telemetry Sandbox
          </button>
        </div>
      </div>

      {activeTab === "router" ? (
        /* ================== TAB 1: SCOPE ROUTER ================== */
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_1fr]">
          
          {/* Left Side: Form questions */}
          <div className="space-y-6">
            
            {/* Question 1: Core Bottleneck */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-amber font-semibold">
                01 // Select Core System Bottleneck
              </label>
              <div className="grid gap-2">
                {bottlenecks.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedBottleneck(opt.id)}
                    className={`text-left text-xs px-4 py-3 rounded-lg border transition-all duration-200 leading-relaxed ${
                      selectedBottleneck === opt.id
                        ? "border-amber/40 bg-zinc-900/30 text-zinc-100"
                        : "border-border bg-zinc-950/20 text-muted-foreground hover:border-zinc-855 hover:bg-zinc-900/10 hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Target Scale */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-amber font-semibold">
                02 // Select Scale & Target Timeline
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                {scales.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedScale(opt.id)}
                    className={`text-left rounded-lg border px-3 py-2.5 transition-all duration-200 ${
                      selectedScale === opt.id
                        ? "border-amber/40 bg-zinc-900/30 text-zinc-100"
                        : "border-border bg-zinc-950/20 text-muted-foreground hover:border-zinc-855 hover:bg-zinc-900/10 hover:text-foreground"
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">{opt.label}</div>
                    <div className="font-mono text-[9px] text-muted-foreground/60 mt-0.5">{opt.timeline}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Platform Stack */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-amber font-semibold">
                03 // Choose Platform Infrastructure Style
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                {stacks.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedStack(opt.id)}
                    className={`text-left rounded-lg border px-3 py-2.5 transition-all duration-200 ${
                      selectedStack === opt.id
                        ? "border-amber/40 bg-zinc-900/30 text-zinc-100"
                        : "border-border bg-zinc-950/20 text-muted-foreground hover:border-zinc-855 hover:bg-zinc-900/10 hover:text-foreground"
                    }`}
                  >
                    <div className="text-[11px] leading-snug">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: Output Scope Panel */}
          <div className="flex flex-col justify-between border-t border-border/80 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <div className="space-y-5">
              
              <div>
                <span className="font-mono text-[9px] font-bold text-amber uppercase tracking-widest">// ARCHITECTURE ROUTING OUTPUT</span>
                <h3 className="text-base font-bold text-foreground mt-1">
                  {bottleneck.recommendation}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Based on your selections, Manoj will customize an engagement to resolve {scale.timeline} bottlenecks, building structured templates and running code optimizations.
                </p>
              </div>

              {/* Deliverables lists */}
              <div className="border border-border bg-zinc-900/20 p-4 rounded-lg">
                <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest block mb-2.5">
                  Expected System Deliverables:
                </span>
                <ul className="space-y-2">
                  {bottleneck.deliverables.map(deliv => (
                    <li key={deliv} className="flex items-start gap-2 text-xs text-zinc-300 leading-snug">
                      <CheckCircle2 className="size-3.5 text-amber/80 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scope Summary Preview */}
              <div className="relative">
                <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest block mb-1.5">
                  Scope Summary Config:
                </span>
                <pre className="font-mono text-[9px] leading-relaxed text-zinc-400 bg-zinc-950/80 border border-zinc-900 p-3.5 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-40">
                  {scopeSummary}
                </pre>
                
                <button
                  onClick={handleCopy}
                  className="absolute top-8 right-2.5 p-1.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Copy Scope Configuration"
                >
                  {copied ? (
                    <span className="text-[8px] font-mono px-1 font-bold text-emerald-400 uppercase">Copied!</span>
                  ) : (
                    <Clipboard className="size-3.5" />
                  )}
                </button>
              </div>

            </div>

            {/* Direct Connect Hub */}
            <div className="mt-8 pt-4 border-t border-border/60 space-y-3">
              <div className="p-3 bg-amber/5 border border-amber/25 rounded-lg">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber uppercase font-semibold">
                  <Sparkle className="size-3 animate-spin-slow" /> Conversion Hub
                </div>
                <p className="text-[11px] text-muted-foreground/80 mt-1 leading-relaxed">
                  Submit below to automatically compile this specification and load your local mail composer to email Manoj. Or connect via LinkedIn.
                </p>
                
                {/* Copy LinkedIn template helper */}
                <div className="mt-2.5 flex items-center justify-between border border-zinc-800 bg-zinc-900/60 rounded px-2.5 py-1.5 gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px]">
                    "{linkedInNote}"
                  </span>
                  <button
                    onClick={handleCopyLinkedInNote}
                    className="flex items-center gap-1 shrink-0 font-mono text-[9px] uppercase font-bold text-amber hover:text-amber/80 transition-colors"
                  >
                    {noteCopied ? (
                      <>
                        <Check className="size-3 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" /> Copy Note
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit builds and opens the mail immediately */}
              <a
                href={`mailto:${EMAIL}?subject=${emailSubject1}&body=${emailBody1}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-4 py-3 font-mono text-xs font-semibold text-zinc-950 transition-all duration-300 hover:bg-amber/90 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
              >
                Submit & Open Email Spec
                <ChevronRight className="size-4 shrink-0" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-zinc-900/35 hover:bg-zinc-900/60 hover:text-foreground text-muted-foreground px-3 py-2 font-mono text-[10px] transition-colors"
                >
                  <LinkedInIcon className="size-3.5 text-sky-500" /> Connect on LinkedIn
                </a>
                <a
                  href={CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-zinc-900/35 hover:bg-zinc-900/60 hover:text-foreground text-muted-foreground px-3 py-2 font-mono text-[10px] transition-colors"
                >
                  <Calendar className="size-3.5 text-amber/85" /> Book 15m Call
                </a>
              </div>
            </div>

          </div>

        </div>
      ) : activeTab === "simulator" ? (
        /* ================== TAB 2: COST & LATENCY SIMULATOR ================== */
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_1fr]">
          
          {/* Left Side: Simulation sliders */}
          <div className="space-y-5">
            
            {/* Model Selection */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-wider text-amber font-semibold block">
                01 // Select Core LLM Foundation
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(modelsConfig) as Array<keyof typeof modelsConfig>).map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedModel(key)}
                    className={`text-left px-3.5 py-2.5 rounded-lg border text-xs transition-all duration-200 ${
                      selectedModel === key
                        ? "border-amber/40 bg-zinc-900/30 text-zinc-100"
                        : "border-border bg-zinc-950/20 text-muted-foreground hover:border-zinc-855 hover:bg-zinc-900/10"
                    }`}
                  >
                    <div className="font-semibold">{modelsConfig[key].name}</div>
                    <div className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">
                      in: ${modelsConfig[key].input}/M // out: ${modelsConfig[key].output}/M
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Requests volume */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber font-semibold">
                  02 // Monthly Request Volume
                </span>
                <span className="font-mono text-zinc-300 font-bold">
                  {(requestsVolume / 1000).toFixed(0)}k calls / mo
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={requestsVolume}
                onChange={(e) => setRequestsVolume(Number(e.target.value))}
                className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber"
              />
            </div>

            {/* Slider 2: Average tokens */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber font-semibold">
                  03 // Average Tokens per Request
                </span>
                <span className="font-mono text-zinc-300 font-bold">
                  {avgTokens.toLocaleString()} tokens
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={avgTokens}
                onChange={(e) => setAvgTokens(Number(e.target.value))}
                className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber"
              />
            </div>

            {/* Slider 3: Caching hit ratio */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber font-semibold">
                  04 // Prompt Cache Hit Ratio (Redis)
                </span>
                <span className="font-mono text-zinc-300 font-bold">
                  {(cacheRatio * 100).toFixed(0)}% hits
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.95"
                step="0.05"
                value={cacheRatio}
                onChange={(e) => setCacheRatio(Number(e.target.value))}
                className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber"
              />
            </div>

            {/* Checkboxes: Optimization features */}
            <div className="space-y-2 pt-2">
              <label className="font-mono text-[10px] uppercase tracking-wider text-amber font-semibold block">
                05 // Choose Optimization Layers
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => setHasHnsw(!hasHnsw)}
                  className={`flex items-center justify-between text-xs px-3.5 py-2.5 rounded-lg border transition-all ${
                    hasHnsw ? "border-amber/40 bg-zinc-900/20 text-zinc-100" : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="font-mono text-[11px]">pgvector HNSW Index</span>
                  <span className="text-[10px] font-mono text-amber">-{hasHnsw ? "25% Latency" : "0%" }</span>
                </button>

                <button
                  onClick={() => setHasGuardrails(!hasGuardrails)}
                  className={`flex items-center justify-between text-xs px-3.5 py-2.5 rounded-lg border transition-all ${
                    hasGuardrails ? "border-amber/40 bg-zinc-900/20 text-zinc-100" : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="font-mono text-[11px]">LangGraph Guardrails</span>
                  <span className="text-[10px] font-mono text-amber">{hasGuardrails ? "+16% Safety" : "+0%" }</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Side: Simulation Results Dashboard */}
          <div className="flex flex-col justify-between border-t border-border/80 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <div className="space-y-6">
              
              <div>
                <span className="font-mono text-[9px] font-bold text-amber uppercase tracking-widest">// MODEL OUTPUT PERFORMANCE MATRIX</span>
                <h3 className="text-sm font-bold text-zinc-200 mt-1">
                  Architecture Efficiency Analysis
                </h3>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-3.5">
                
                <div className="border border-border bg-zinc-900/20 p-3 rounded-lg flex flex-col justify-between">
                  <span className="font-mono text-[8px] text-muted-foreground/60 uppercase tracking-widest">
                    Avg Latency
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold font-mono text-zinc-100">{estimatedLatency}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">ms</span>
                  </div>
                  <span className="font-mono text-[8px] text-amber/80 mt-1">Target: &lt;180ms</span>
                </div>

                <div className="border border-border bg-zinc-900/20 p-3 rounded-lg flex flex-col justify-between">
                  <span className="font-mono text-[8px] text-muted-foreground/60 uppercase tracking-widest">
                    Safety Grounding
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold font-mono text-zinc-100">{estimatedGrounding.toFixed(0)}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">%</span>
                  </div>
                  <span className="font-mono text-[8px] text-amber/80 mt-1">Target: &gt;95%</span>
                </div>

                <div className="border border-border bg-zinc-900/20 p-3 rounded-lg flex flex-col justify-between">
                  <span className="font-mono text-[8px] text-muted-foreground/60 uppercase tracking-widest">
                    Raw API Cost
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">$</span>
                    <span className="text-xl font-bold font-mono text-zinc-400">{rawMonthlyCost.toFixed(0)}</span>
                    <span className="text-[9px] font-mono text-muted-foreground">/mo</span>
                  </div>
                  <span className="font-mono text-[8px] text-zinc-500 mt-1">No optimization</span>
                </div>

                <div className="border border-amber/25 bg-amber/5 p-3 rounded-lg flex flex-col justify-between shadow-[0_0_10px_rgba(245,158,11,0.03)]">
                  <span className="font-mono text-[8px] text-amber/70 uppercase tracking-widest">
                    Optimized Cost
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs text-amber/80">$</span>
                    <span className="text-xl font-bold font-mono text-amber">{optimizedMonthlyCost.toFixed(0)}</span>
                    <span className="text-[9px] font-mono text-amber/80">/mo</span>
                  </div>
                  <span className="font-mono text-[8px] text-emerald-400 mt-1 font-bold">
                    Saves ${monthlySavings.toFixed(0)}/mo ({((monthlySavings/rawMonthlyCost)*100).toFixed(0)}%)
                  </span>
                </div>

              </div>

              {/* Capable Explainer box */}
              <div className="text-[11px] leading-relaxed text-muted-foreground border-l-2 border-amber/35 pl-4">
                This configuration yields a <strong className="text-zinc-200">{((monthlySavings/rawMonthlyCost)*100).toFixed(0)}% cost reduction</strong> and optimized latency. Let&apos;s deploy pgvector indexes, build Redis caching hooks, and secure your workflows.
              </div>

            </div>

            {/* Direct Connect Hub */}
            <div className="mt-8 pt-4 border-t border-border/60 space-y-3">
              <div className="p-3 bg-amber/5 border border-amber/25 rounded-lg">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber uppercase font-semibold">
                  <Sparkle className="size-3 animate-spin-slow" /> Connection Hub
                </div>
                <p className="text-[11px] text-muted-foreground/80 mt-1 leading-relaxed">
                  Submit below to automatically compile this cost analysis and load your local mail composer to email Manoj. Or connect via LinkedIn.
                </p>
                
                {/* Copy LinkedIn template helper */}
                <div className="mt-2.5 flex items-center justify-between border border-zinc-800 bg-zinc-900/60 rounded px-2.5 py-1.5 gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px]">
                    "{linkedInNote}"
                  </span>
                  <button
                    onClick={handleCopyLinkedInNote}
                    className="flex items-center gap-1 shrink-0 font-mono text-[9px] uppercase font-bold text-amber hover:text-amber/80 transition-colors"
                  >
                    {noteCopied ? (
                      <>
                        <Check className="size-3 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" /> Copy Note
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit builds and opens the mail immediately */}
              <a
                href={`mailto:${EMAIL}?subject=${emailSubject2}&body=${emailBody2}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-4 py-3 font-mono text-xs font-semibold text-zinc-950 transition-all duration-300 hover:bg-amber/90 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
              >
                Submit & Open Email Spec
                <ChevronRight className="size-4 shrink-0" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-zinc-900/35 hover:bg-zinc-900/60 hover:text-foreground text-muted-foreground px-3 py-2.5 font-mono text-[10px] transition-colors"
                >
                  <LinkedInIcon className="size-3.5 text-sky-500" /> Connect on LinkedIn
                </a>
                <a
                  href={CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-zinc-900/35 hover:bg-zinc-900/60 hover:text-foreground text-muted-foreground px-3 py-2.5 font-mono text-[10px] transition-colors"
                >
                  <Calendar className="size-3.5 text-amber/85" /> Book 15m Call
                </a>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ================== TAB 3: TELEMETRY SANDBOX ================== */
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.2fr]">
          
          {/* Left Side: Controls & Selector */}
          <div className="space-y-6">
            <div>
              <span className="font-mono text-[9px] font-bold text-amber uppercase tracking-widest">// SYSTEM TELEMETRY CONTROL PANEL</span>
              <h3 className="text-base font-bold text-foreground mt-1">
                Select Runtime Trace Target
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Choose a workflow model to view live trace output and observability matrices. This simulates how Manoj structures log aggregations and database indexes in production environments.
              </p>
            </div>

            {/* Scenario Selection Cards */}
            <div className="space-y-2">
              {(Object.keys(telemetryScenarios) as Array<keyof typeof telemetryScenarios>).map(key => {
                const item = telemetryScenarios[key];
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (!isSimulating) {
                        setSelectedScenario(key);
                        setDisplayedLogs([]);
                        setLogIndex(0);
                      }
                    }}
                    disabled={isSimulating}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 ${
                      selectedScenario === key
                        ? "border-amber/40 bg-zinc-900/30 text-zinc-100"
                        : "border-border bg-zinc-950/20 text-muted-foreground hover:border-zinc-855 hover:bg-zinc-900/10 disabled:opacity-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-mono">{item.name}</span>
                      {selectedScenario === key && (
                        <span className="size-1.5 rounded-full bg-amber animate-ping" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{item.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Simulated Performance Metrics Banner */}
            <div className="border border-zinc-800 bg-zinc-900/30 p-4 rounded-lg space-y-3.5">
              <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest block">
                Target Reference Metrics:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 border border-zinc-800 bg-zinc-950/40 rounded">
                  <div className="font-mono text-[9px] text-muted-foreground/60 uppercase">P95 Latency</div>
                  <div className="font-mono text-xs font-bold text-amber mt-1">{telemetryScenarios[selectedScenario].metrics.latency}</div>
                </div>
                <div className="p-2 border border-zinc-800 bg-zinc-950/40 rounded">
                  <div className="font-mono text-[9px] text-muted-foreground/60 uppercase">Token Load</div>
                  <div className="font-mono text-xs font-bold text-zinc-200 mt-1">{telemetryScenarios[selectedScenario].metrics.tokens}</div>
                </div>
                <div className="p-2 border border-zinc-800 bg-zinc-950/40 rounded">
                  <div className="font-mono text-[9px] text-muted-foreground/60 uppercase">API Cost</div>
                  <div className="font-mono text-xs font-bold text-zinc-200 mt-1">{telemetryScenarios[selectedScenario].metrics.cost}</div>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleStartSimulation}
              disabled={isSimulating}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-4 py-3 font-mono text-xs font-bold text-zinc-950 transition-all duration-300 hover:bg-amber/90 disabled:bg-zinc-800 disabled:text-zinc-500 shadow-[0_0_10px_rgba(245,158,11,0.05)]"
            >
              {isSimulating ? (
                <>
                  <Activity className="size-4 shrink-0 animate-pulse text-amber-500" /> SIMULATING TRACE OUTPUT...
                </>
              ) : (
                <>
                  <Play className="size-4 shrink-0" /> RUN TELEMETRY SIMULATION
                </>
              )}
            </button>

          </div>

          {/* Right Side: Log Console Screen */}
          <div className="flex flex-col justify-between border-t border-border/80 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            
            {/* Terminal Panel */}
            <div className="flex flex-col h-[320px] bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden shadow-inner font-mono text-[10px] leading-relaxed">
              
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/60 border-b border-zinc-950">
                <span className="text-[9px] text-zinc-500 flex items-center gap-1.5">
                  <Terminal className="size-3 text-amber" /> console@manoj-architect:~
                </span>
                <span className="text-[8px] text-amber px-1.5 py-0.5 rounded bg-amber/10 border border-amber/15 animate-pulse uppercase tracking-wider font-semibold">
                  {isSimulating ? "Running" : "Idle"}
                </span>
              </div>

              {/* Terminal Logs Output */}
              <div 
                ref={consoleContainerRef}
                className="flex-1 p-3.5 overflow-y-auto space-y-2 select-text scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
              >
                {displayedLogs.length === 0 ? (
                  <div className="text-zinc-600 italic flex flex-col items-center justify-center h-full gap-2">
                    <Terminal className="size-8 text-zinc-800" />
                    <span>Awaiting signal. Click 'RUN TELEMETRY SIMULATION' to stream trace.</span>
                  </div>
                ) : (
                  displayedLogs.map((log, index) => {
                    let typeColor = "text-zinc-300";
                    if (log.type === "system") typeColor = "text-amber font-semibold";
                    if (log.type === "query") typeColor = "text-sky-400";
                    if (log.type === "tool") typeColor = "text-fuchsia-400";
                    if (log.type === "db") typeColor = "text-indigo-400";
                    if (log.type === "success") typeColor = "text-emerald-400";
                    if (log.type === "warning") typeColor = "text-rose-400";
                    if (log.type === "metric") typeColor = "text-amber bg-amber/5 px-1 py-0.5 border border-amber/10 rounded inline-block";

                    return (
                      <div key={index} className={`whitespace-pre-wrap ${typeColor}`}>
                        {log.text}
                      </div>
                    );
                  })
                )}
                {isSimulating && (
                  <div className="text-amber">
                    &gt; executing trace log stream<span className="inline-block w-1.5 h-3.5 bg-amber ml-1 animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Direct Connect Hub */}
            <div className="mt-8 pt-4 border-t border-border/60 space-y-3">
              <div className="p-3 bg-amber/5 border border-amber/25 rounded-lg">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber uppercase font-semibold">
                  <Sparkle className="size-3 animate-spin-slow" /> Let's Build This Telemetry
                </div>
                <p className="text-[11px] text-muted-foreground/80 mt-1 leading-relaxed">
                  Submit below to automatically compile this telemetry analysis and load your local mail composer to email Manoj. Or connect via LinkedIn.
                </p>

                {/* Copy LinkedIn template helper */}
                <div className="mt-2.5 flex items-center justify-between border border-zinc-800 bg-zinc-900/60 rounded px-2.5 py-1.5 gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px]">
                    "Hi Manoj, I tried your Telemetry Sandbox..."
                  </span>
                  <button
                    onClick={handleCopyLinkedInNote}
                    className="flex items-center gap-1 shrink-0 font-mono text-[9px] uppercase font-bold text-amber hover:text-amber/80 transition-colors"
                  >
                    {noteCopied ? (
                      <>
                        <Check className="size-3 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" /> Copy Note
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit builds and opens the mail immediately */}
              <a
                href={`mailto:${EMAIL}?subject=${emailSubject3}&body=${emailBody3}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-4 py-3 font-mono text-xs font-semibold text-zinc-950 transition-all duration-300 hover:bg-amber/90 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
              >
                Submit & Open Email Spec
                <ChevronRight className="size-4 shrink-0" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-zinc-900/35 hover:bg-zinc-900/60 hover:text-foreground text-muted-foreground px-3 py-2.5 font-mono text-[10px] transition-colors"
                >
                  <LinkedInIcon className="size-3.5 text-sky-500" /> Connect on LinkedIn
                </a>
                <a
                  href={CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-zinc-900/35 hover:bg-zinc-900/60 hover:text-foreground text-muted-foreground px-3 py-2.5 font-mono text-[10px] transition-colors"
                >
                  <Calendar className="size-3.5 text-amber/85" /> Book 15m Call
                </a>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Footer Info strip */}
      <div className="border-t border-border bg-zinc-900/20 px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground/60">
        <span className="flex items-center gap-1.5">
          <Activity className="size-3 text-emerald-500 animate-pulse" /> Telemetry: OK // Trace connection validated
        </span>
        <span className="flex items-center gap-3">
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors flex items-center gap-1">
            LinkedIn <ArrowUpRight className="size-2.5" />
          </a>
          <a href={`mailto:${EMAIL}`} className="hover:text-amber transition-colors flex items-center gap-1">
            Email <ArrowUpRight className="size-2.5" />
          </a>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors flex items-center gap-1">
            Book Meet <ArrowUpRight className="size-2.5" />
          </a>
        </span>
      </div>

    </div>
  );
}
