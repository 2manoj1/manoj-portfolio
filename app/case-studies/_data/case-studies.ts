import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Boxes,
  CheckCircle2,
  Cpu,
  Database,
  GitBranch,
  Monitor,
  Network,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";

export type TopologyZone = {
  id: string;
  label: string;
  summary: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TopologyNode = {
  id: string;
  zoneId: string;
  label: string;
  description: string;
  detail: string;
  icon: LucideIcon;
};

export type TopologyConnection = {
  from: string;
  to: string;
  label: string;
};

export type TelemetryMetric = {
  label: string;
  value: string;
  description: string;
};

export type CaseStudyDoc = {
  slug: string;
  title: string;
};

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  status: "DEPLOYED" | "PRODUCTION" | "ACTIVE";
  environment: string;
  ingress: string;
  kicker: string;
  problem: string;
  narration: string;
  telemetry: readonly TelemetryMetric[];
  zones: readonly TopologyZone[];
  nodes: readonly TopologyNode[];
  connections: readonly TopologyConnection[];
  logs: readonly string[];
  adr: {
    filename: string;
    language: string;
    choice: string;
    code: string;
  };
  docs?: readonly CaseStudyDoc[];
};

export const caseStudies = [
  {
    id: "01",
    slug: "production-grade-ai-home-lab",
    title: "AI Home Lab API Gateway",
    shortTitle: "Local AI Gateway",
    status: "PRODUCTION",
    environment: "macOS Apple Silicon + Podman Compose",
    ingress: "Cloudflare Tunnel",
    kicker: "Python FastAPI gateway",
    problem:
      "I built a local OpenAI-compatible gateway so my site, agents, and scripts could call one stable /v1 contract. Ollama, PostgreSQL, Redis, and Qdrant stay private on the Mac. The hard parts were auth, backpressure, model warmup, and zero public inbound ports.",
    narration:
      "The pattern is simple: Cloudflare handles ingress, FastAPI owns auth and request shape, and Ollama stays local. I keep qwen3.5 warm, limit context, and return 429 when the Mac is full.",
    docs: [
      { slug: "architecture", title: "Architecture" },
      { slug: "diagrams", title: "Diagrams" },
      { slug: "runbook", title: "Runbook" },
      { slug: "development", title: "Dev Guide" }
    ] as const,
    telemetry: [
      {
        label: "Ingress",
        value: "Cloudflare",
        description:
          "Tunnel targets only the localhost production gateway on port 8000.",
      },
      {
        label: "Gateway limit",
        value: "10 chats",
        description:
          "Bounded async semaphore returns 429 when slots are saturated.",
      },
      {
        label: "Model runtime",
        value: "Ollama 0.30.6",
        description:
          "Official Darwin release serving qwen3.5:9b through /v1.",
      },
      {
        label: "Memory profile",
        value: "q8 KV",
        description:
          "One loaded model, 4096 context, flash attention, keep_alive forever.",
      },
    ],
    zones: [
      {
        id: "vercel",
        label: "Vercel Hobby Serverless",
        summary: "Public website, Astra UI, and OpenAI-compatible client calls.",
        x: 40,
        y: 90,
        width: 330,
        height: 520,
      },
      {
        id: "edge",
        label: "Cloudflare Secure Edge",
        summary: "DNS, tunnel ingress, WAF rules, and zero-open-port routing.",
        x: 430,
        y: 180,
        width: 320,
        height: 250,
      },
      {
        id: "mac",
        label: "Personal macOS Server",
        summary: "FastAPI gateway on 127.0.0.1:8000 with auth, logs, and chat backpressure.",
        x: 820,
        y: 70,
        width: 430,
        height: 560,
      },
      {
        id: "private-data",
        label: "Private Local Services",
        summary:
          "Ollama 0.30.6, PostgreSQL, Redis, and Qdrant stay off the public internet.",
        x: 1320,
        y: 70,
        width: 380,
        height: 560,
      },
    ],
    nodes: [
      {
        id: "astra-ui",
        zoneId: "vercel",
        label: "Astra chat surface",
        description: "Next.js UI and /api/chat route in JS/TS",
        detail:
          "Website-side agent experience can call the gateway with a standard OpenAI baseURL and client API key.",
        icon: Monitor,
      },
      {
        id: "next-agent",
        zoneId: "vercel",
        label: "TS agent layer",
        description: "LangChain/deepagents tooling with gateway baseURL",
        detail:
          "Uses a tunnel hostname and /v1 contract, so model traffic can move between local and future provider lanes.",
        icon: GitBranch,
      },
      {
        id: "cloudflare",
        zoneId: "edge",
        label: "Cloudflare Tunnel",
        description: "api.manojmukherjee.co.in to local gateway",
        detail:
          "Public HTTPS traffic reaches the private gateway without opening inbound macOS ports.",
        icon: ShieldCheck,
      },
      {
        id: "fastapi",
        zoneId: "mac",
        label: "FastAPI gateway",
        description: "Python 3.14, uv, OpenAI-compatible routes",
        detail:
          "Exposes /v1 chat, completions, embeddings, responses, images, models, agent routes, and admin key routes.",
        icon: Network,
      },
      {
        id: "auth-usage",
        zoneId: "mac",
        label: "Auth and usage",
        description: "SHA-256 API keys with PostgreSQL usage logs",
        detail:
          "Validates X-API-Key or bearer tokens, protects admin routes, marks last-used timestamps, and records endpoint/model usage.",
        icon: CheckCircle2,
      },
      {
        id: "python-graph",
        zoneId: "mac",
        label: "Chat backpressure",
        description: "10-slot async limiter with clean 429 overflow",
        detail:
          "The gateway bounds concurrent chat calls before forwarding to Ollama, protecting unified memory and model queues.",
        icon: GitBranch,
      },
      {
        id: "ollama",
        zoneId: "private-data",
        label: "Ollama client",
        description: "Official 0.30.6 runtime with qwen3.5:9b",
        detail:
          "The gateway forwards compatible payloads through AsyncOpenAI, adds keep_alive, and warms the model at startup.",
        icon: Cpu,
      },
      {
        id: "stores",
        zoneId: "private-data",
        label: "Private data plane",
        description: "PostgreSQL 17, Redis 8, Qdrant clients",
        detail:
          "PostgreSQL stores keys and usage logs; Redis and Qdrant are wired for rate limiting, cache, and RAG expansion.",
        icon: Database,
      },
    ],
    connections: [
      { from: "astra-ui", to: "next-agent", label: "chat intent" },
      { from: "next-agent", to: "cloudflare", label: "HTTPS /v1" },
      { from: "cloudflare", to: "fastapi", label: "tunnel ingress" },
      { from: "fastapi", to: "auth-usage", label: "verify key" },
      { from: "fastapi", to: "python-graph", label: "agent stream" },
      { from: "python-graph", to: "ollama", label: "LLM chunks" },
      { from: "auth-usage", to: "stores", label: "usage log" },
      { from: "fastapi", to: "stores", label: "service clients" },
    ],
    logs: [
      "WEBSITE: Astra request enters Next.js /api/chat on Vercel.",
      "AGENT_TS: Gateway baseURL normalized to the OpenAI-compatible /v1 contract.",
      "EDGE: Cloudflare Tunnel forwards HTTPS traffic to the private macOS gateway.",
      "FASTAPI: X-API-Key or bearer token validated against PostgreSQL key hash.",
      "LIMITER: Chat request acquired one of 10 bounded gateway slots.",
      "OLLAMA: AsyncOpenAI client forwards keep_alive=-1 to official Ollama 0.30.6.",
      "MODEL: qwen3.5:9b remains warm with 4096 context and q8 KV cache.",
      "USAGE: endpoint and model usage recorded in PostgreSQL usage_logs.",
    ],
    adr: {
      filename: "apps/model-gateway/src/clients/ollama.py",
      language: "python",
      choice:
        "I kept concurrency in the gateway. When the Mac is full, callers get a clear 429 instead of hidden queue buildup inside Ollama.",
      code: `class OllamaClient:
    def __init__(self, settings):
        self._chat_limiter = asyncio.BoundedSemaphore(
            settings.ollama_chat_concurrency_limit
        )

    async def _acquire_chat_slot(self):
        try:
            await asyncio.wait_for(
                self._chat_limiter.acquire(),
                timeout=self._settings.ollama_chat_acquire_timeout_seconds,
            )
        except TimeoutError as exc:
            raise OllamaClientError(
                message="Ollama chat concurrency limit reached.",
                status_code=429,
                code="chat_concurrency_limit",
            ) from exc`,
    },
  },
  {
    id: "02",
    slug: "enterprise-agentic-rag-platform",
    title: "Enterprise Agentic RAG",
    shortTitle: "Agentic RAG Flow",
    status: "PRODUCTION",
    environment: "GCP Kubernetes (GKE)",
    ingress: "Istio Ingress Gateway",
    kicker: "BFSI workloads",
    problem:
      "I designed an agentic RAG pattern for long financial filings. The system needed layout-aware parsing, hybrid retrieval, clear state transitions, and a grounding check before any answer could ship.",
    narration:
      "I kept metadata and vectors together in PostgreSQL/pgvector. LangGraph handles planning, retrieval, evaluation, and answer synthesis so the flow stays auditable.",
    telemetry: [
      {
        label: "Retrieval",
        value: "pgvector",
        description:
          "Hybrid metadata and vector lookup in the relational boundary.",
      },
      {
        label: "Orchestration",
        value: "LangGraph",
        description: "Stateful retrieve, evaluate, and synthesize nodes.",
      },
      {
        label: "Runtime",
        value: "GKE/Istio",
        description: "Containerized service boundary with cluster ingress.",
      },
      {
        label: "Reliability",
        value: "Eval gate",
        description:
          "Grounding and safety checks before response finalization.",
      },
    ],
    zones: [
      {
        id: "ingress",
        label: "Client Edge Network",
        summary: "Governed entry point for filing questions.",
        x: 40,
        y: 220,
        width: 300,
        height: 360,
      },
      {
        id: "services",
        label: "GKE Service Boundary",
        summary: "Parser and LangGraph workflow run inside the cluster.",
        x: 420,
        y: 70,
        width: 430,
        height: 640,
      },
      {
        id: "retrieval",
        label: "Retrieval Data Plane",
        summary: "Postgres keeps metadata and vectors together.",
        x: 920,
        y: 170,
        width: 320,
        height: 420,
      },
      {
        id: "governance",
        label: "Reliability Controls",
        summary: "Eval and trace nodes decide if an answer can ship.",
        x: 1320,
        y: 90,
        width: 370,
        height: 620,
      }
    ],
    nodes: [
      {
        id: "istio",
        zoneId: "ingress",
        label: "Istio gateway",
        description: "Cluster ingress and policy boundary",
        detail:
          "Terminates governed traffic before requests enter the RAG service mesh.",
        icon: ShieldCheck,
      },
      {
        id: "parser",
        zoneId: "services",
        label: "FastAPI parser",
        description: "Layout-aware filing extraction",
        detail:
          "Normalizes long filings into structured chunks with section metadata and document provenance.",
        icon: Terminal,
      },
      {
        id: "planner",
        zoneId: "services",
        label: "Query planner",
        description: "LangGraph retrieval routing",
        detail:
          "Expands and routes user intent across metadata filters, semantic search, and grounded answer paths.",
        icon: GitBranch,
      },
      {
        id: "pgvector",
        zoneId: "retrieval",
        label: "Postgres pgvector",
        description: "HNSW vectors plus transactional metadata",
        detail:
          "Keeps candidate retrieval and business metadata in one database boundary for simpler governance.",
        icon: Database,
      },
      {
        id: "eval",
        zoneId: "governance",
        label: "Grounding eval",
        description: "Safety and relevance gate",
        detail:
          "Checks answer support against retrieved evidence before the workflow releases a response.",
        icon: Zap,
      },
      {
        id: "trace",
        zoneId: "governance",
        label: "Trace ledger",
        description: "Run IDs, decision logs, and audit hooks",
        detail:
          "Captures the path from query to retrieved evidence to final response for auditability.",
        icon: Activity,
      },
    ],
    connections: [
      { from: "istio", to: "parser", label: "request" },
      { from: "parser", to: "planner", label: "structured query" },
      { from: "planner", to: "pgvector", label: "hybrid retrieval" },
      { from: "pgvector", to: "eval", label: "evidence set" },
      { from: "planner", to: "trace", label: "state events" },
      { from: "eval", to: "trace", label: "decision record" },
    ],
    logs: [
      "GKE: RAG service received governed request through Istio ingress.",
      "PARSER: Filing sections normalized with source coordinates and metadata filters.",
      "PLANNER: LangGraph state advanced from classify_query to retrieve_context.",
      "PGVECTOR: HNSW candidate set merged with relational metadata constraints.",
      "EVAL: Grounding check compares answer claims with retrieved evidence.",
      "TRACE: Run ID, retrieved chunk IDs, and evaluation decision persisted.",
      "RESPONSE: Answer released only after support and safety checks pass.",
    ],
    adr: {
      filename: "rag_graph.py",
      language: "python",
      choice:
        "I used LangGraph with PostgreSQL/pgvector because the RAG flow needed auditable states and retrieval metadata near the vector index.",
      code: `from langgraph.graph import END, START, StateGraph
from langgraph.checkpoint.postgres import PostgresSaver

class RAGState(TypedDict):
    query: str
    filters: dict[str, str]
    retrieved_docs: list[Document]
    grounding_score: float

def compile_rag_graph(pool):
    graph = StateGraph(RAGState)
    graph.add_node("plan", plan_query)
    graph.add_node("retrieve", retrieve_from_pgvector)
    graph.add_node("evaluate", evaluate_grounding)
    graph.add_edge(START, "plan")
    graph.add_edge("plan", "retrieve")
    graph.add_edge("retrieve", "evaluate")
    graph.add_edge("evaluate", END)
    return graph.compile(checkpointer=PostgresSaver(pool))`,
    },
  },
  {
    id: "03",
    slug: "gpu-ai-platform-modernization",
    title: "GPU Platform Modernization",
    shortTitle: "GPU Infrastructure",
    status: "ACTIVE",
    environment: "OpenShift / Run:AI",
    ingress: "Kube Ingress Controller",
    kicker: "Inference scaling",
    problem:
      "I worked on inference platform patterns where static GPU allocation slowed teams down. Production serving needed quota, priority, and predictable capacity.",
    narration:
      "The design separates ingress, scheduling, GPU slices, serving, and observability. Run:AI owns allocation policy. vLLM serves traffic. OTel shows saturation.",
    telemetry: [
      {
        label: "Scheduler",
        value: "Run:AI",
        description: "Policy-based fractional GPU allocation and priorities.",
      },
      {
        label: "Serving",
        value: "vLLM",
        description: "PagedAttention-style inference serving boundary.",
      },
      {
        label: "Cluster",
        value: "OpenShift",
        description: "Enterprise Kubernetes runtime for AI workloads.",
      },
      {
        label: "Signals",
        value: "OTel",
        description: "Tracing and metrics exported for platform visibility.",
      },
    ],
    zones: [
      {
        id: "edge",
        label: "Cluster Edge",
        summary: "Ingress keeps model traffic behind platform policy.",
        x: 60,
        y: 220,
        width: 300,
        height: 340,
      },
      {
        id: "scheduler",
        label: "Run:AI Scheduler",
        summary: "Quota, priority, and GPU slices are decided here.",
        x: 430,
        y: 80,
        width: 420,
        height: 620,
      },
      {
        id: "serving",
        label: "Model Serving Pool",
        summary: "vLLM pods serve model traffic from GPU capacity.",
        x: 930,
        y: 180,
        width: 330,
        height: 360,
      },
      {
        id: "observability",
        label: "Platform Observability",
        summary: "Metrics and traces show saturation early.",
        x: 1320,
        y: 120,
        width: 360,
        height: 500,
      }
    ],
    nodes: [
      {
        id: "ingress",
        zoneId: "edge",
        label: "Kube ingress",
        description: "OpenShift route controller",
        detail: "Keeps API access and routing policy outside the serving pool.",
        icon: ShieldCheck,
      },
      {
        id: "runai",
        zoneId: "scheduler",
        label: "Run:AI policy",
        description: "Fractional GPU and priority scheduling",
        detail:
          "Allocates GPU slices to workloads based on team quota, priority, and serving class.",
        icon: Network,
      },
      {
        id: "slices",
        zoneId: "scheduler",
        label: "GPU slices",
        description: "Elastic VRAM allocation boundaries",
        detail:
          "Separates experimentation capacity from high-priority production inference.",
        icon: Cpu,
      },
      {
        id: "vllm",
        zoneId: "serving",
        label: "vLLM serving",
        description: "PagedAttention runtime pods",
        detail:
          "Serves model traffic through a scalable deployment with cache-aware scheduling.",
        icon: Zap,
      },
      {
        id: "metrics",
        zoneId: "observability",
        label: "OTel pipeline",
        description: "Prometheus metrics and trace spans",
        detail:
          "Provides saturation, queue, latency, and GPU utilization signals to platform teams.",
        icon: Activity,
      },
    ],
    connections: [
      { from: "ingress", to: "runai", label: "workload class" },
      { from: "runai", to: "slices", label: "allocation" },
      { from: "slices", to: "vllm", label: "GPU lease" },
      { from: "vllm", to: "metrics", label: "trace spans" },
      { from: "metrics", to: "runai", label: "capacity signal" },
    ],
    logs: [
      "INGRESS: Production inference route accepted at OpenShift edge.",
      "SCHEDULER: Run:AI evaluated workload priority and team quota.",
      "GPU: Fractional allocation template selected for serving class.",
      "VLLM: Runtime pod attached to model cache and started serving traffic.",
      "OTEL: Trace context propagated through inference request path.",
      "METRICS: Saturation signal returned to allocation policy loop.",
    ],
    adr: {
      filename: "gpu-allocation.yaml",
      language: "yaml",
      choice:
        "I kept GPU allocation policy separate from model serving. Platform teams can change quota and priority without rewriting the runtime.",
      code: `apiVersion: scheduling.run.ai/v1
kind: PodGroup
metadata:
  name: vllm-serving
spec:
  gpuAllocation: 0.5
  gpuMemory: 12Gi
  priority: HighPriority
  schedulingStrategy: BinPacking
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: nvidia.com/gpu.family
                operator: In
                values: ["H100"]`,
    },
  },
  {
    id: "04",
    slug: "ai-architecture-enablement",
    title: "AI Architecture Enablement",
    shortTitle: "Technical Advisory",
    status: "DEPLOYED",
    environment: "Enterprise Hub",
    ingress: "Corporate Gateway",
    kicker: "Upskilling teams",
    problem:
      "I designed patterns for teams adopting MCP-style tools. The goal was to let agents call databases and APIs without exposing raw credentials or ownership boundaries.",
    narration:
      "The tool boundary is explicit: MCP hosts broker calls, tool servers own access, and schema validation keeps unsafe data away from the agent core.",
    telemetry: [
      {
        label: "Protocol",
        value: "MCP",
        description: "Tool contracts exposed through a model-context boundary.",
      },
      {
        label: "Security",
        value: "Sandbox",
        description: "Tool execution separated from the agent reasoning core.",
      },
      {
        label: "Governance",
        value: "Schemas",
        description: "Inputs and outputs validated before model use.",
      },
      {
        label: "Adoption",
        value: "Playbooks",
        description: "Reusable patterns for enterprise engineering teams.",
      },
    ],
    zones: [
      {
        id: "portal",
        label: "Developer Portal",
        summary: "Teams see approved tools and examples.",
        x: 50,
        y: 210,
        width: 330,
        height: 350,
      },
      {
        id: "host",
        label: "MCP Host Boundary",
        summary: "Protocol work stays outside the agent prompt.",
        x: 470,
        y: 180,
        width: 420,
        height: 420,
      },
      {
        id: "tools",
        label: "Secure Tool Subnets",
        summary: "Databases and APIs sit behind typed tools.",
        x: 980,
        y: 130,
        width: 420,
        height: 520,
      },
      {
        id: "agent",
        label: "Agent Runtime",
        summary: "The agent receives safe, schema-checked results.",
        x: 1480,
        y: 210,
        width: 330,
        height: 360,
      }
    ],
    nodes: [
      {
        id: "admin-ui",
        zoneId: "portal",
        label: "Admin UI",
        description: "Enterprise developer hub",
        detail:
          "Surfaces approved tools, access docs, and examples for engineering teams.",
        icon: Monitor,
      },
      {
        id: "mcp-host",
        zoneId: "host",
        label: "MCP host",
        description: "JSON-RPC protocol client",
        detail:
          "Loads tool schemas, brokers calls, and keeps protocol details outside the agent prompt.",
        icon: Network,
      },
      {
        id: "db-tool",
        zoneId: "tools",
        label: "Database tool",
        description: "PostgreSQL server wrapper",
        detail:
          "Encapsulates database access behind typed operations instead of direct model access.",
        icon: Database,
      },
      {
        id: "api-tool",
        zoneId: "tools",
        label: "External APIs",
        description: "Third-party sandbox client",
        detail:
          "Limits outbound API calls to approved capabilities with explicit request schemas.",
        icon: Boxes,
      },
      {
        id: "agent-core",
        zoneId: "agent",
        label: "Agent core",
        description: "Schema-validated tool reasoning",
        detail:
          "Receives controlled tool outputs and composes responses without owning raw credentials.",
        icon: CheckCircle2,
      },
    ],
    connections: [
      { from: "admin-ui", to: "mcp-host", label: "tool catalog" },
      { from: "mcp-host", to: "db-tool", label: "query tool" },
      { from: "mcp-host", to: "api-tool", label: "api tool" },
      { from: "db-tool", to: "agent-core", label: "result" },
      { from: "api-tool", to: "agent-core", label: "result" },
    ],
    logs: [
      "PORTAL: Tool catalog loaded for enterprise engineering teams.",
      "MCP: Host initialized JSON-RPC transport and schema registry.",
      "TOOL: Database wrapper exposed approved read operations.",
      "TOOL: External API sandbox validated outbound request shape.",
      "AGENT: Tool result returned through a schema-checked contract.",
      "AUDIT: Capability boundary documented for architecture review.",
    ],
    adr: {
      filename: "ADR-04-MCP.md",
      language: "markdown",
      choice:
        "I used MCP-style tool boundaries so teams can reuse agent capabilities without copying secrets or proprietary logic into every app.",
      code: `# ADR-04: Model Context Protocol Adoption

## Status
Accepted

## Context
Multi-agent workflows need dynamic tool access, but direct
model-to-system integration creates duplicated security logic.

## Decision
Wrap database connections, internal APIs, and calculators in
separate MCP-style tool servers. The agent runtime receives
schema-validated tool results, not raw system access.

## Consequence
Latency may increase at the protocol boundary, but ownership,
auditability, and reuse improve across teams.`,
    },
  },
  {
    id: "05",
    slug: "astra-knowledge-graph-engine",
    title: "Astra Knowledge Graph Engine",
    shortTitle: "Astra Graph RAG",
    status: "PRODUCTION",
    environment: "Git-controlled static JSON + in-memory MiniSearch",
    ingress: "Next.js API Routes",
    kicker: "Static Git Graph RAG",
    problem:
      "I wanted fast site retrieval without a managed vector database. The system needed low token use, fast lookup, and a Git-friendly build path.",
    narration:
      "I built a file-based Graph RAG layer inside the repo. The build writes graph and MiniSearch indexes. Runtime loads them into memory and serves cached results quickly.",
    telemetry: [
      {
        label: "Public Surface",
        value: "Next.js /api/retrieve",
        description: "Exposes retrieved context payload structure.",
      },
      {
        label: "Trie Search",
        value: "MiniSearch",
        description: "Pre-compiled static trie loads at boot time.",
      },
      {
        label: "Retrieval Speed",
        value: "< 0.5ms",
        description: "Served directly from warm container RAM.",
      },
      {
        label: "Token Savings",
        value: "80-90%",
        description: "Smaller prompts for the same site context.",
      },
    ],
    zones: [
      {
        id: "build",
        label: "Static Build Phase",
        summary: "Crawler extracts nodes/edges and serializes the search trie index.",
        x: 40,
        y: 90,
        width: 330,
        height: 520,
      },
      {
        id: "serverless",
        label: "Serverless Node Memory",
        summary: "Eager MiniSearch & Graphology instantiations with warm query cache map.",
        x: 430,
        y: 180,
        width: 320,
        height: 350,
      },
      {
        id: "client",
        label: "Astra Chat UI",
        summary: "Retrieves context via gatherResearchMarkdown to ground LLM completions.",
        x: 820,
        y: 90,
        width: 330,
        height: 520,
      },
    ],
    nodes: [
      {
        id: "manifest-index",
        zoneId: "build",
        label: "Manifest Index",
        description: "data/manifest.json static ledger",
        detail: "Stores pre-compiled entity nodes, relationship links, and word weights.",
        icon: Database,
      },
      {
        id: "minisearch-deser",
        zoneId: "serverless",
        label: "MiniSearch trie",
        description: "Eager index deserializer",
        detail: "Loads the serialized search index trie at module import time, bypassing runtime compilation.",
        icon: Network,
      },
      {
        id: "graphology-node",
        zoneId: "serverless",
        label: "Graph topology",
        description: "Eager undirected graphology instance",
        detail: "Instantiated at spin-up to traverse documentation relationships with zero cold-start lags.",
        icon: GitBranch,
      },
      {
        id: "fifo-cache",
        zoneId: "serverless",
        label: "FIFO Cache",
        description: "Warm Map memory cache",
        detail: "Caches up to 100 queries in container memory to serve duplicate questions in 0.1ms.",
        icon: Database,
      },
      {
        id: "grounded-prompt",
        zoneId: "client",
        label: "Grounded prompt",
        description: "Token-compressed context prompt",
        detail: "Combines compressed graph traversal content to reduce prompt tokens by 85%.",
        icon: Monitor,
      },
    ],
    connections: [
      { from: "manifest-index", to: "minisearch-deser", label: "deserialization" },
      { from: "minisearch-deser", to: "graphology-node", label: "lookup" },
      { from: "graphology-node", to: "fifo-cache", label: "cache check" },
      { from: "fifo-cache", to: "grounded-prompt", label: "context stream" },
    ],
    logs: [
      "BUILD: Crawler extracted blog, service, and resume nodes.",
      "BUILD: Pre-serialized search trie written to search-index.json.",
      "BOOT: Eagerly deserializing MiniSearch trie in warm node memory.",
      "BOOT: Graphology undirected entity network successfully loaded.",
      "CACHE: Checking query cache Map for normalized query string match.",
      "SEARCH: MiniSearch + Graphology retrieved matching context in 0.4ms.",
      "COMPRESS: Context compressed successfully, saving 85% prompt tokens.",
    ],
    adr: {
      filename: "lib/context.ts",
      language: "typescript",
      choice:
        "I chose build-time indexing because the site content already lives in Git. It keeps retrieval cheap, fast, and easy to deploy.",
      code: `import { getCompressedContext } from "@/lib/context";
import { runManojFastAgent } from "@/lib/manoj-agent";

// Eager index deserialization eliminates runtime overhead
// Warm memory cache resolves identical queries in ~0.1ms
const cache = new Map<string, CompressedContext>();

export function getContext(query: string) {
  const key = query.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key);

  const context = getCompressedContext(query);
  cache.set(key, context);
  return context;
}`,
    },
  },
] satisfies readonly CaseStudy[];
