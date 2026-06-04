"use client";

import { useState, ComponentType } from "react";
import { 
  ArrowRight, 
  Settings, 
  Database, 
  Cpu, 
  RefreshCw, 
  Terminal, 
  Activity, 
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

type SystemNode = {
  id: string;
  label: string;
  role: string;
  icon: ComponentType<{ className?: string }>;
  input: string;
  output: string;
  metrics: string;
  description: string;
  failureMode: string;
};

type TabData = {
  title: string;
  subtitle: string;
  nodes: SystemNode[];
  connections: { from: string; to: string }[];
  evaluation: {
    metric: string;
    value: string;
    description: string;
  }[];
};

const labSystems: Record<string, TabData> = {
  langgraph: {
    title: "AI Home Lab (Apple Silicon)",
    subtitle: "Vercel-hosted Astra calls a private Python FastAPI gateway through Cloudflare Tunnel.",
    nodes: [
      {
        id: "astra",
        label: "Astra Website",
        role: "Vercel Surface",
        icon: Terminal,
        input: "Visitor chat request from manojmukherjee.co.in",
        output: "OpenAI-compatible request from the Next.js API route",
        metrics: "JS/TS website-side agent tooling",
        description: "Runs the public chat surface and API route in the Vercel-hosted Next.js site.",
        failureMode: "Gateway unavailable. The UI returns a bounded fallback state.",
      },
      {
        id: "cloudflare",
        label: "Cloudflare Tunnel",
        role: "Secure Edge Layer",
        icon: Activity,
        input: "HTTPS request for the gateway hostname",
        output: "Routed traffic to local daemon without opening inbound ports",
        metrics: "WAF + custom firewall rules enforced",
        description: "Encrypted tunnel ingress from the public API hostname into the private Mac server.",
        failureMode: "Tunnel drop. Auto-restart restores the daemon.",
      },
      {
        id: "fastapi-gate",
        label: "FastAPI Gateway",
        role: "Python API Gateway",
        icon: Terminal,
        input: "OpenAI-compatible payloads with X-API-Key or bearer auth",
        output: "Validated request routed to Python orchestration or Ollama",
        metrics: "Python 3.14, uv, FastAPI",
        description: "Owns auth, OpenAI-compatible /v1 routes, admin keys, usage logs, and service clients.",
        failureMode: "Bad schema or auth. FastAPI and Pydantic reject early.",
      },
      {
        id: "python-langgraph",
        label: "Python LangGraph",
        role: "Stateful Agent Engine",
        icon: Cpu,
        input: "Direct message request and authenticated context",
        output: "Custom SSE chunks from graph.astream",
        metrics: "StateGraph + stream_mode=custom",
        description: "Compiles the private gateway agent graph and streams chunks from the internal LLM service.",
        failureMode: "Provider pressure. Streaming boundaries keep partial progress observable.",
      },
      {
        id: "ollama-mlx",
        label: "Ollama",
        role: "Local Inference Layer",
        icon: Settings,
        input: "Structured prompt tokens",
        output: "JSON response text / output stream",
        metrics: "qwen3.5:9b default model",
        description: "Serves local model traffic through Ollama's OpenAI-compatible API.",
        failureMode: "Context overflow. Sliding memory windows reduce pressure.",
      },
      {
        id: "data-stores",
        label: "PG/Redis/Qdrant",
        role: "Data & Storage Layer",
        icon: Database,
        input: "API key records, usage logs, cache and future RAG clients",
        output: "Authenticated context and local persistence signals",
        metrics: "PostgreSQL 17, Redis 8, Qdrant",
        description: "PostgreSQL is active for keys and usage; Redis and Qdrant are prepared for later cache/RAG paths.",
        failureMode: "Database outage. Auth and usage logging fail closed.",
      }
    ],
    connections: [
      { from: "astra", to: "cloudflare" },
      { from: "cloudflare", to: "fastapi-gate" },
      { from: "fastapi-gate", to: "python-langgraph" },
      { from: "python-langgraph", to: "ollama-mlx" },
      { from: "fastapi-gate", to: "data-stores" }
    ],
    evaluation: [
      { metric: "Runtime Split", value: "TS + Python", description: "Astra stays in Next.js while gateway orchestration runs in Python." },
      { metric: "Gateway Port", value: "8000", description: "Private FastAPI server is reached through the Cloudflare tunnel." },
      { metric: "Security Surface", value: "Zero open ports", description: "Incoming traffic strictly flows through secure, egress-only Cloudflare tunnels." }
    ]
  },
  rag: {
    title: "Agentic RAG Grounding Flow",
    subtitle: "Retrieval, source routing, context assembly, and grounded answers.",
    nodes: [
      {
        id: "query",
        label: "User Question",
        role: "Input Intent",
        icon: Terminal,
        input: "Natural language query",
        output: "Structured intent tokens",
        metrics: "Pre-processing latency: <1ms",
        description: "Parses intent and decides whether retrieval is needed.",
        failureMode: "Vague intent. Query reformulation clarifies scope.",
      },
      {
        id: "agent-router",
        label: "LangGraph Agent",
        role: "Retrieval Planner",
        icon: Cpu,
        input: "Reformulated search prompt",
        output: "Target source coordinates",
        metrics: "State checkpointing enabled",
        description: "Selects vector, web, repository, or profile sources.",
        failureMode: "Missing source. Fallback search broadens retrieval.",
      },
      {
        id: "sources",
        label: "Target Sources",
        role: "Search Execution",
        icon: Database,
        input: "Query text parameters",
        output: "Raw retrieved sections",
        metrics: "Qdrant + GitHub + Web search",
        description: "Fetches source context from local and external indexes.",
        failureMode: "Rate limits. Cache checks and soft timeouts reduce failure.",
      },
      {
        id: "assembly",
        label: "Context Assembly",
        role: "Prompt Optimization",
        icon: Settings,
        input: "Raw context array",
        output: "Layered, token-compressed prompt",
        metrics: "45% token size reduction",
        description: "Dedupes, ranks, and compresses retrieved context.",
        failureMode: "Context saturation. Reranking cuts weak passages.",
      },
      {
        id: "reasoning",
        label: "Reasoning Engine",
        role: "Local Inference Grounder",
        icon: RefreshCw,
        input: "Layered context prompt",
        output: "Grounded answer text",
        metrics: "Local SLM execution",
        description: "Generates an answer with grounding constraints.",
        failureMode: "Hallucination. Evaluators check unsupported claims.",
      }
    ],
    connections: [
      { from: "query", to: "agent-router" },
      { from: "agent-router", to: "sources" },
      { from: "sources", to: "assembly" },
      { from: "assembly", to: "reasoning" }
    ],
    evaluation: [
      { metric: "Grounding Accuracy", value: "98.5%", description: "Evaluation rating of answer validation against source documents." },
      { metric: "Retrieval Latency", value: "< 120ms", description: "Time taken to execute Qdrant search and Web search." },
      { metric: "Model Latency", value: "< 1.5 seconds", description: "Time for local SLM to stream output response." }
    ]
  },
  fastapi: {
    title: "OpenAI-Compatible AI Gateway",
    subtitle: "One API contract for local models, cloud fallbacks, and tools.",
    nodes: [
      {
        id: "clients",
        label: "Clients & Apps",
        role: "Consumption Layer",
        icon: Activity,
        input: "Next.js UI, Chatbot, scripts",
        output: "HTTPS API request",
        metrics: "Client session tracing",
        description: "Exposes one endpoint for apps, agents, and scripts.",
        failureMode: "Connection drop. Pooling and keep-alive reduce churn.",
      },
      {
        id: "api-router",
        label: "FastAPI Gateway",
        role: "API Gateway Proxy",
        icon: Terminal,
        input: "Client requests & authorization",
        output: "Validated JSON schemas",
        metrics: "Auth validation: <1ms",
        description: "Validates schema, auth, limits, and request shape.",
        failureMode: "Bad schema. Pydantic rejects early.",
      },
      {
        id: "model-router",
        label: "Model Router",
        role: "Smart Routing Proxy",
        icon: Settings,
        input: "Target model schema request",
        output: "Routed request / Fallback destination",
        metrics: "Load balancing enabled",
        description: "Routes requests across local and cloud model lanes.",
        failureMode: "Provider timeout. Fallback lane takes over.",
      },
      {
        id: "local-slm",
        label: "Local Models (Ollama)",
        role: "Primary Inference Lane",
        icon: Cpu,
        input: "Routed prompt",
        output: "Streamed tokens",
        metrics: "Ollama/MLX inference",
        description: "Runs low-risk workloads on local inference.",
        failureMode: "Hardware pressure. Cloud fallback absorbs load.",
      },
      {
        id: "cloud-llm",
        label: "Cloud Providers",
        role: "Fallback Inference Lane",
        icon: RefreshCw,
        input: "Prompts / fallback triggers",
        output: "Response JSON payload",
        metrics: "OpenAI, Anthropic, Gemini, OpenRouter",
        description: "Uses cloud models for deeper reasoning paths.",
        failureMode: "API outage. Local models keep a reduced path alive.",
      }
    ],
    connections: [
      { from: "clients", to: "api-router" },
      { from: "api-router", to: "model-router" },
      { from: "model-router", to: "local-slm" },
      { from: "model-router", to: "cloud-llm" }
    ],
    evaluation: [
      { metric: "API Overhead", value: "< 2.5ms", description: "FastAPI request intercept and auth validation latency." },
      { metric: "Rate Limits", value: "100 RPM / IP", description: "Configured rate limiter value to prevent API abuses." },
      { metric: "Fallback Delay", value: "250ms", description: "Time taken to detect failure and initiate fallback request." }
    ]
  }
};

export function LabDashboard() {
  const [activeTab, setActiveTab] = useState<"langgraph" | "rag" | "fastapi">("langgraph");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("astra");

  const system = labSystems[activeTab];
  const selectedNode = system.nodes.find(n => n.id === selectedNodeId) || system.nodes[0];

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.48fr)] lg:gap-8">
      {/* Interactive System Flow Panel */}
      <div className="flex min-w-0 flex-col rounded-lg border border-border bg-card/10 p-4 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-5">
          <div role="tablist" aria-label="Architecture flow presets" className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
            {(Object.keys(labSystems) as Array<"langgraph" | "rag" | "fastapi">).map((tab) => (
              <button
                key={tab}
                role="tab"
                type="button"
                aria-selected={activeTab === tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedNodeId(labSystems[tab].nodes[0].id);
                }}
                className={cn(
                  "min-h-11 rounded-md px-3 py-2 text-left font-mono text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-center",
                  activeTab === tab 
                    ? "bg-amber text-amber-foreground" 
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                {tab === "langgraph" && "AI Home Lab"}
                {tab === "rag" && "Agentic RAG Flow"}
                {tab === "fastapi" && "AI Gateway Proxy"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Trace ready
          </div>
        </div>

        <div className="min-w-0 py-6">
          <h3 className="text-xl font-medium text-foreground">{system.title}</h3>
          <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{system.subtitle}</p>
        </div>

        {/* Visual Flow Diagram */}
        <div className="my-6 flex min-w-0 flex-col items-center justify-center gap-5 rounded-lg border border-dashed border-border/70 bg-secondary/15 px-3 py-8 md:my-8 md:flex-row md:flex-wrap md:gap-4 md:px-4 md:py-12 lg:flex-nowrap">
          {system.nodes.map((node, index) => {
            const NodeIcon = node.icon;
            const isSelected = node.id === selectedNodeId;
            return (
              <div key={node.id} className="flex min-w-0 items-center gap-3 md:gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  aria-label={`Inspect ${node.label}`}
                  className={cn(
                    "flex size-16 flex-col items-center justify-center rounded-lg border p-2 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:size-20",
                    isSelected
                      ? "scale-105 border-amber/80 bg-amber/8 ring-2 ring-amber/20 shadow-md shadow-amber/5"
                      : "border-border bg-card/60 hover:border-muted-foreground/40 hover:bg-card"
                  )}
                >
                  <NodeIcon className={cn("size-5", isSelected ? "text-amber" : "text-muted-foreground")} />
                  <span className={cn("mt-2 w-full truncate text-[11px] font-medium tracking-tight", isSelected ? "text-foreground font-semibold" : "text-muted-foreground")}>
                    {node.label.split(" ")[0]}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
                </button>
                {index < system.nodes.length - 1 && (
                  <ArrowRight className="size-4 shrink-0 rotate-90 text-muted-foreground md:rotate-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Metrics Overview footer */}
        <div className="mt-auto border-t border-border/75 pt-5">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Evaluation Metrics</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {system.evaluation.map((evalItem) => (
              <div key={evalItem.metric} className="min-h-28 min-w-0 rounded-lg border border-border/50 bg-secondary/20 p-3">
                <span className="font-mono text-[11px] text-muted-foreground">{evalItem.metric}</span>
                <p className="mt-1 text-base font-semibold text-foreground">{evalItem.value}</p>
                <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-muted-foreground">{evalItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Node Inspector Panel */}
      <div className="flex min-w-0 flex-col rounded-lg border border-border bg-card/30 p-4 shadow-sm md:p-5">
        <div className="flex items-center gap-2 border-b border-border/80 pb-4">
          <Terminal className="size-4 text-amber" />
          <span className="font-mono text-xs uppercase tracking-wider text-foreground">Node Inspector</span>
        </div>

        <div className="mt-5 flex-1 space-y-6">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-amber">{selectedNode.role}</span>
            <h4 className="mt-1 text-lg font-medium text-foreground">{selectedNode.label}</h4>
            <p className="mt-3 break-words text-sm leading-6 text-muted-foreground">{selectedNode.description}</p>
          </div>

          <div className="min-w-0 space-y-4 rounded-lg border border-border/60 bg-secondary/10 p-4 font-mono text-xs leading-relaxed">
            <div className="min-w-0">
              <span className="text-muted-foreground">&gt; INPUT</span>
              <p className="mt-1 break-words border-l border-border pl-3 text-foreground">{selectedNode.input}</p>
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground">&gt; OUTPUT</span>
              <p className="mt-1 break-words border-l border-border pl-3 text-foreground">{selectedNode.output}</p>
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground">&gt; METRIC</span>
              <p className="mt-1 break-words border-l border-border pl-3 text-amber">{selectedNode.metrics}</p>
            </div>
          </div>

          <div className="border-t border-border/60 pt-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-destructive">
              <AlertTriangle className="size-4 shrink-0" />
              <span>POTENTIAL FAILURE MODE</span>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              {selectedNode.failureMode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
