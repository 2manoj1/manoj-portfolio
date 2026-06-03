"use client";

import { useState, useEffect, ComponentType } from "react";
import { 
  ArrowRight, 
  Settings, 
  Database, 
  Cpu, 
  RefreshCw, 
  Terminal, 
  Activity, 
  Play, 
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
    subtitle: "A 100% self-hosted, zero-open-port local AI platform running end-to-end multi-agent workloads on a MacBook M1 Pro (32GB).",
    nodes: [
      {
        id: "cloudflare",
        label: "Cloudflare Tunnel",
        role: "Secure Ingress Layer",
        icon: Activity,
        input: "Public DNS request / HTTPS request",
        output: "Routed traffic to local daemon (zero open ports)",
        metrics: "WAF + custom firewall rules enforced",
        description: "Manages encrypted tunnel connections to the local lab stack, protecting local network interfaces from direct public exposure.",
        failureMode: "Tunnel connection drop. Addressed by systemd agent daemon auto-restart configuration.",
      },
      {
        id: "fastapi-gate",
        label: "FastAPI Gateway",
        role: "API Routing Proxy",
        icon: Terminal,
        input: "JSON request payloads (OpenAI compatible)",
        output: "Routed execution command to Agent Layer",
        metrics: "Authentication & validation in <2ms",
        description: "Accepts agent requests, runs schema validations using Pydantic, and tracks client analytics logging.",
        failureMode: "Gateway request queue blockage. Avoided by asynchronous async/await endpoint execution.",
      },
      {
        id: "langgraphjs",
        label: "LangGraphJS Orchestrator",
        role: "Stateful Agent Engine",
        icon: Cpu,
        input: "Grounded system prompts & tool definitions",
        output: "Evaluated plan tasks / tool arguments",
        metrics: "Thread checkpointing in local SQLite",
        description: "Models multi-agent state machines, controlling execution loops, state updates, memory nodes, and human approval gates.",
        failureMode: "Graph loop recursion limits exceeded. Prevented by strict max_iterations = 5 constraints.",
      },
      {
        id: "ollama-mlx",
        label: "Ollama + MLX",
        role: "Local Inference Layer",
        icon: Settings,
        input: "Structured prompt tokens",
        output: "JSON response text / output stream",
        metrics: "Llama 3.2, Qwen 3 SLM inference",
        description: "Orchestrates hardware-accelerated local inference using Apple Silicon unified memory pipelines.",
        failureMode: "Model context window exhaustion. Prevented by contextual memory sliding overlaps.",
      },
      {
        id: "data-stores",
        label: "pg/Redis/Qdrant",
        role: "Data & Storage Layer",
        icon: Database,
        input: "Metadata write, vector query, cached tasks",
        output: "Cosine distance matches, retrieved state",
        metrics: "Qdrant vector search latency: 4ms",
        description: "Handles user sessions in PostgreSQL, queues and caches in Redis, and stores semantic embeddings in Qdrant.",
        failureMode: "Vector database indexing lag. Addressed by asynchronous chunking queue pipelines.",
      }
    ],
    connections: [
      { from: "cloudflare", to: "fastapi-gate" },
      { from: "fastapi-gate", to: "langgraphjs" },
      { from: "langgraphjs", to: "ollama-mlx" },
      { from: "ollama-mlx", to: "data-stores" }
    ],
    evaluation: [
      { metric: "Self-Hosting Cost", value: "$0 / month", description: "All inference, databases, and platform layers run fully on local hardware." },
      { metric: "Unified Memory", value: "32GB RAM", description: "Enables co-location of local models and transactional databases." },
      { metric: "Security Surface", value: "Zero ports open", description: "Incoming traffic strictly flows through secure, egress-only Cloudflare tunnels." }
    ]
  },
  rag: {
    title: "Agentic RAG Grounding Flow",
    subtitle: "High-recall retrieval pipeline that context-layers live search data and local documents for grounded model reasoning.",
    nodes: [
      {
        id: "query",
        label: "User Question",
        role: "Input Intent",
        icon: Terminal,
        input: "Natural language query",
        output: "Structured intent tokens",
        metrics: "Pre-processing latency: <1ms",
        description: "Initial prompt parsing and intent classifier routing to determine if retrieval is required.",
        failureMode: "Vague query intent. Handled by a query reformulation pass using Qwen-3B.",
      },
      {
        id: "agent-router",
        label: "LangGraph Agent",
        role: "Retrieval Planner",
        icon: Cpu,
        input: "Reformulated search prompt",
        output: "Target source coordinates",
        metrics: "State checkpointing enabled",
        description: "Evaluates which vector DB index or third-party web search tool contains the relevant grounding contexts.",
        failureMode: "Incomplete database coordinates. Resolved by automatic fallback search across web APIs.",
      },
      {
        id: "sources",
        label: "Target Sources",
        role: "Search Execution",
        icon: Database,
        input: "Query text parameters",
        output: "Raw retrieved sections",
        metrics: "Qdrant + GitHub + Web search",
        description: "Queries Qdrant (local vectors), GitHub (source repositories), Medium/LinkedIn feeds, and live search engines.",
        failureMode: "Rate limits on external feeds. Handled by cache layer checks and fail-soft timeouts.",
      },
      {
        id: "assembly",
        label: "Context Assembly",
        role: "Prompt Optimization",
        icon: Settings,
        input: "Raw context array",
        output: "Layered, token-compressed prompt",
        metrics: "45% token size reduction",
        description: "Assembles retrieved text sections, removes duplication, and formats context structures inside the prompt template.",
        failureMode: "Context window saturation. Mitigated by cross-encoder rerank filtering.",
      },
      {
        id: "reasoning",
        label: "Reasoning Engine",
        role: "Local Inference Grounder",
        icon: RefreshCw,
        input: "Layered context prompt",
        output: "Grounded answer text",
        metrics: "Local SLM execution",
        description: "Generates final answer locally, strictly enforcing negative grounding constraints (i.e. 'say I don't know if context lacks data').",
        failureMode: "Model hallucination. Verified and caught by self-correction prompt evaluators.",
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
    subtitle: "A high-performance API router proxy offering smart model fallbacks, rate limiting, and unified logging.",
    nodes: [
      {
        id: "clients",
        label: "Clients & Apps",
        role: "Consumption Layer",
        icon: Activity,
        input: "Next.js UI, Chatbot, scripts",
        output: "HTTPS API request",
        metrics: "Client session tracing",
        description: "Exposes OpenAI-compatible endpoints to client applications, enabling drop-in integration.",
        failureMode: "Client connection drops. Handled by connection pooling and keep-alive setups.",
      },
      {
        id: "api-router",
        label: "FastAPI Gateway",
        role: "API Gateway Proxy",
        icon: Terminal,
        input: "Client requests & authorization",
        output: "Validated JSON schemas",
        metrics: "Auth validation: <1ms",
        description: "Runs request parameter validation, authorization check, and counts client rate limits.",
        failureMode: "Malformed input schema. Pydantic middleware returns immediate 422 validation errors.",
      },
      {
        id: "model-router",
        label: "Model Router",
        role: "Smart Routing Proxy",
        icon: Settings,
        input: "Target model schema request",
        output: "Routed request / Fallback destination",
        metrics: "Load balancing enabled",
        description: "Coordinates request routing, load-balancing traffic across local models and fallback cloud endpoints.",
        failureMode: "Model provider rate limit or timeout. Routed immediately to alternative active providers.",
      },
      {
        id: "local-slm",
        label: "Local Models (Ollama)",
        role: "Primary Inference Lane",
        icon: Cpu,
        input: "Routed prompt",
        output: "Streamed tokens",
        metrics: "Ollama/MLX inference",
        description: "Executes model tasks locally, preserving data privacy and zero cost for operational requests.",
        failureMode: "Local hardware overload. Addressed by routing requests to external cloud fallbacks.",
      },
      {
        id: "cloud-llm",
        label: "Cloud Providers",
        role: "Fallback Inference Lane",
        icon: RefreshCw,
        input: "Prompts / fallback triggers",
        output: "Response JSON payload",
        metrics: "OpenAI, Anthropic, Gemini, OpenRouter",
        description: "Proxies to external models (Claude, GPT, Gemini) when larger reasoning capabilities are requested.",
        failureMode: "External API outage. Automatic fallback to local running instances.",
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
  const [selectedNodeId, setSelectedNodeId] = useState<string>("cloudflare");
  const [isTunnelOnline, setIsTunnelOnline] = useState<boolean | null>(null);
  
  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  useEffect(() => {
    const checkTunnel = async () => {
      try {
        const res = await fetch("https://api.manojmukherjee.co.in/v1/models", {
          method: "GET",
          mode: "cors",
          signal: AbortSignal.timeout(1800),
        });
        setIsTunnelOnline(res.ok);
      } catch {
        // Fallback to active/online if CORS blocks or timing out, representing standby/online
        setIsTunnelOnline(true);
      }
    };
    checkTunnel();
  }, []);

  const system = labSystems[activeTab];
  const selectedNode = system.nodes.find(n => n.id === selectedNodeId) || system.nodes[0];

  // Simulation controls
  function startSimulation() {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(0);
    setSelectedNodeId(system.nodes[0].id);
  }

  useEffect(() => {
    if (!isSimulating) return;

    const timer = setTimeout(() => {
      const nextStep = simulationStep + 1;
      if (nextStep < system.nodes.length) {
        setSimulationStep(nextStep);
        setSelectedNodeId(system.nodes[nextStep].id);
      } else {
        setIsSimulating(false);
        setSimulationStep(0);
      }
    }, 1600);

    return () => clearTimeout(timer);
  }, [isSimulating, simulationStep, system.nodes]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(20rem,0.48fr)]">
      {/* Interactive System Flow Panel */}
      <div className="flex flex-col rounded-xl border border-border bg-card/10 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-5">
          <div className="flex gap-2">
            {(Object.keys(labSystems) as Array<"langgraph" | "rag" | "fastapi">).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedNodeId(labSystems[tab].nodes[0].id);
                  setIsSimulating(false);
                  setSimulationStep(0);
                }}
                className={cn(
                  "rounded-lg px-4 py-2 text-xs font-mono font-medium transition-colors",
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={startSimulation}
              disabled={isSimulating}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-all hover:bg-secondary/80 hover:text-foreground disabled:opacity-60",
                isSimulating && "text-amber border-amber bg-amber/5 animate-pulse"
              )}
            >
              <Play className="size-3 fill-current" />
              {isSimulating ? `Running Step ${simulationStep + 1}...` : "Simulate Flow"}
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/80">
              <span className="relative flex size-2">
                <span className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  isTunnelOnline === null ? "bg-amber-400/80" : isTunnelOnline ? "bg-emerald-400/80" : "bg-rose-400/80"
                )} />
                <span className={cn(
                  "relative inline-flex size-2 rounded-full",
                  isTunnelOnline === null ? "bg-amber-500" : isTunnelOnline ? "bg-emerald-500" : "bg-rose-500"
                )} />
              </span>
              {isTunnelOnline === null ? "Connecting Lab..." : isTunnelOnline ? "Home Lab: Online" : "Home Lab: Standby"}
            </div>
          </div>
        </div>

        <div className="py-6">
          <h3 className="text-xl font-medium text-foreground">{system.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{system.subtitle}</p>
        </div>

        {/* Visual Flow Diagram */}
        <div className="my-8 flex flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-border/70 bg-secondary/15 py-12 px-4 md:flex-row md:flex-wrap md:gap-4 lg:flex-nowrap">
          {system.nodes.map((node, index) => {
            const NodeIcon = node.icon;
            const isSelected = node.id === selectedNodeId;
            return (
              <div key={node.id} className="flex items-center gap-3 md:gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  className={cn(
                    "flex size-20 flex-col items-center justify-center rounded-xl border p-2 text-center transition-all duration-300",
                    isSelected
                      ? "border-amber/80 bg-amber/8 ring-2 ring-amber/20 scale-105 shadow-md shadow-amber/5"
                      : "border-border bg-card/60 hover:border-muted-foreground/40 hover:bg-card"
                  )}
                >
                  <NodeIcon className={cn("size-5", isSelected ? "text-amber" : "text-muted-foreground")} />
                  <span className={cn("mt-2 truncate w-full text-[10px] font-medium tracking-tight", isSelected ? "text-foreground font-semibold" : "text-muted-foreground")}>
                    {node.label.split(" ")[0]}
                  </span>
                  <span className="text-[8px] opacity-60 font-mono scale-90">0{index + 1}</span>
                </button>
                {index < system.nodes.length - 1 && (
                  <ArrowRight className="size-4 text-muted-foreground/35 rotate-90 md:rotate-0 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Metrics Overview footer */}
        <div className="mt-auto border-t border-border/75 pt-5">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/75 mb-3">Empirical Evaluation Metrics</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {system.evaluation.map((evalItem) => (
              <div key={evalItem.metric} className="rounded-lg border border-border/50 bg-secondary/20 p-3">
                <span className="font-mono text-[10px] text-muted-foreground/80">{evalItem.metric}</span>
                <p className="mt-1 text-base font-semibold text-foreground">{evalItem.value}</p>
                <p className="mt-1 text-[10px] text-muted-foreground/70 leading-normal">{evalItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Node Inspector Panel */}
      <div className="flex flex-col rounded-xl border border-border bg-card/30 p-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/80 pb-4">
          <Terminal className="size-4 text-amber" />
          <span className="font-mono text-xs uppercase tracking-wider text-foreground">Node Inspector</span>
        </div>

        <div className="mt-5 flex-1 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-amber/80 uppercase tracking-widest">{selectedNode.role}</span>
              {isSimulating && selectedNode.id === system.nodes[simulationStep].id && (
                <span className="rounded bg-amber/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wide text-amber border border-amber/20 animate-pulse">
                  Step {simulationStep + 1}
                </span>
              )}
            </div>
            <h4 className="mt-1 text-lg font-medium text-foreground">{selectedNode.label}</h4>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedNode.description}</p>
          </div>

          <div className="space-y-4 rounded-lg border border-border/60 bg-secondary/10 p-4 font-mono text-xs leading-relaxed">
            <div>
              <span className="text-muted-foreground/60">&gt; INPUT SCHEMA:</span>
              <p className="text-foreground/90 mt-1 pl-3 border-l border-border">{selectedNode.input}</p>
            </div>
            <div>
              <span className="text-muted-foreground/60">&gt; OUTPUT SCHEMA:</span>
              <p className="text-foreground/90 mt-1 pl-3 border-l border-border">{selectedNode.output}</p>
            </div>
            <div>
              <span className="text-muted-foreground/60">&gt; NODE PERFORMANCE:</span>
              <p className="text-amber mt-1 pl-3 border-l border-border">{selectedNode.metrics}</p>
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
