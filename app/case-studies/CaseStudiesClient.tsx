"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
	Activity,
	ArrowRight,
	Boxes,
	CheckCircle2,
	Cpu,
	Database,
	FileCode,
	GitBranch,
	Layers,
	Monitor,
	Network,
	ShieldCheck,
	Terminal,
	Zap,
	ZoomIn,
	ZoomOut,
	Maximize2,
	RotateCcw,
	X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";

// Core Detailed Case Studies Data in Manoj's Authentic Voice (Senior AI Architect)
const commandCenterData = [
	{
		id: "01",
		slug: "production-grade-ai-home-lab",
		title: "AI Home Lab Platform",
		shortTitle: "Private AI Lab",
		status: "DEPLOYED",
		environment: "Apple M1 Pro (16GB)",
		ingress: "Cloudflare Secure WAF",
		kicker: "Python Local Server",
		problem: "I architected and built a local OpenAI-compatible AI gateway in Python 3.14 (uv) running on my macOS server. My Next.js portfolio website (running on Vercel Hobby plan in Serverless mode) calls this gateway through a Cloudflare secure tunnel, orchestrating local Ollama completions via a stateful Python LangGraph service.",
		narration: "By using Python LangGraph (astream with custom mode) and binding the FastAPI uvicorn workers directly, I created a robust orchestration loop. It uses PostgreSQL to persist API key logs and Qdrant/Redis clients for future RAG caching, keeping unified memory footprints warm under 8GB.",
		telemetry: {
			latency: "48ms",
			cacheHit: "64%",
			gpuLoad: "82%",
			throughput: "38 T/s"
		},
		zones: [
			{ id: "z1", label: "Vercel Edge (Next.js Client)", x: 35, y: 110, w: 175, h: 145 },
			{ id: "z2", label: "Local macOS (FastAPI & Python LangGraph)", x: 220, y: 30, w: 360, h: 275 }
		],
		nodes: [
			{ id: "n1", label: "Vercel client", desc: "Astra Next.js API client (JS/TS)", x: 50, y: 160, icon: Monitor },
			{ id: "n2", label: "CF Secure Tunnel", desc: "Cloudflare Ingress Gateway", x: 230, y: 160, icon: ShieldCheck },
			{ id: "n3", label: "FastAPI Gateway", desc: "Python 3.14 API Router (uv)", x: 410, y: 160, icon: Network },
			{ id: "n4", label: "Python LangGraph", desc: "Stateful Graph Orchestration", x: 410, y: 50, icon: GitBranch },
			{ id: "n5", label: "Postgres & Qdrant", desc: "Key Persistence & RAG Cache", x: 410, y: 270, icon: Database }
		],
		connections: [
			{ from: "n1", to: "n2" },
			{ from: "n2", to: "n3" },
			{ from: "n3", to: "n4" },
			{ from: "n3", to: "n5" }
		],
		logs: [
			"MANOJ: Bootstrapping local Apple Silicon inference socket via UDS interface...",
			"MANOJ: Configured cloudflared tunnel client daemon to bypass public TCP ingress...",
			"INFO: Checking unified memory availability: 6.2GB/16GB VRAM pool allocated...",
			"AGENT: LangGraph state loop compiled. Checkpointer bound to SQLite [memory]...",
			"MANOJ: Routing chat stream query to local DeepSeek-R1-8B via MLX Metal backend...",
			"METRICS: Pipeline stabilized. Generation speed: 38 tokens/second on M1 GPU...",
			"GATEWAY: Serialized OpenAI completion payload returned to API client in 48ms."
		],
		adr: {
			filename: "agent_service.py",
			language: "python",
			choice: "I structured our local gateway agent service using Python LangGraph. The StateGraph is compiled with an asynchronous stream writer supporting custom real-time chunk token updates.",
			code: `# apps/model-gateway/src/services/agent_service.py
from typing import Any, TypedDict
from langgraph.graph import END, START, StateGraph
from langgraph.config import get_stream_writer

class DirectMessageAgentState(TypedDict):
    message: str
    model: str | None
    auth_context: AuthContext

class DirectMessageAgentService:
    def __init__(self, settings: Settings, openai_service: OpenAICompatibleService):
        self._settings = settings
        self._openai_service = openai_service
        self._graph = self._build_graph()

    def _build_graph(self):
        graph = StateGraph(DirectMessageAgentState)
        graph.add_node("llm", self._stream_llm)
        graph.add_edge(START, "llm")
        graph.add_edge("llm", END)
        return graph.compile()`
		}
	},
	{
		id: "02",
		slug: "enterprise-agentic-rag-platform",
		title: "Enterprise Agentic RAG",
		shortTitle: "Agentic RAG Flow",
		status: "PRODUCTION",
		environment: "GCP Kubernetes (GKE)",
		ingress: "Istio Ingress Gateway",
		kicker: "BFSI Workloads",
		problem: "At Publicis Sapient, I architected a production-grade multi-agent RAG system for a financial client processing quarterly regulatory filings (up to 1,200 pages per document). We required layout-aware parsing and stateful recursive query expansion, with strict SLA bounds keeping lookups below 200ms.",
		narration: "I standardized on a stateful LangGraph agent using Postgres for checkpointing. I chose a PostgreSQL pgvector indexing setup over a separate vector database because it allowed us to scale hybrid vector lookups alongside transactional metadata in a single relational context, reducing network boundaries.",
		telemetry: {
			latency: "192ms",
			cacheHit: "96%",
			gpuLoad: "45%",
			throughput: "55 T/s"
		},
		zones: [
			{ id: "z1", label: "Client Edge Network", x: 35, y: 110, w: 175, h: 145 },
			{ id: "z2", label: "Istio & GKE Container Subnet", x: 220, y: 30, w: 360, h: 275 }
		],
		nodes: [
			{ id: "n1", label: "Istio Gateway", desc: "Cluster Edge Gatekeeper", x: 50, y: 160, icon: ShieldCheck },
			{ id: "n2", label: "FastAPI Parser", desc: "Layout-Aware XML Chunking", x: 230, y: 160, icon: Terminal },
			{ id: "n3", label: "pgvector Index", desc: "HNSW Vector & Metadata Search", x: 410, y: 50, icon: Database },
			{ id: "n4", label: "LangGraph State", desc: "Stateful Graph Orchestrator", x: 410, y: 270, icon: GitBranch },
			{ id: "n5", label: "LlamaGuard Eval", desc: "Hallucination & Safety Guardrail", x: 410, y: 160, icon: Zap }
		],
		connections: [
			{ from: "n1", to: "n2" },
			{ from: "n2", to: "n3" },
			{ from: "n2", to: "n5" },
			{ from: "n3", to: "n4" },
			{ from: "n5", to: "n4" }
		],
		logs: [
			"MANOJ: Spawning pod deployment in namespace [bfsi-prod] inside GKE cluster...",
			"MANOJ: Executed pgvector hybrid index search plan (IVFFlat index lookup)...",
			"DATABASE: pgvector hybrid vector search executed in 11.2ms. Found 4 candidate vectors...",
			"AGENT: State machine init. Thread: [f-8012]. Restoring state checkpoint from PostgreSQL...",
			"MANOJ: Dispatching LlamaGuard validation node task for user input safety audit...",
			"METRICS: Grounding guard check passed. Answer relevance scored at 0.98...",
			"AGENT: Completed state transition loop safely. Serializing response payload."
		],
		adr: {
			filename: "langgraph_agent.ts",
			language: "typescript",
			choice: "I standardized on a stateful LangGraph agent using Postgres for checkpointing. I chose a PostgreSQL pgvector indexing setup over a separate vector database because it allowed us to scale hybrid vector lookups alongside transactional metadata in a single relational context, reducing network boundaries.",
			code: `// langgraph_agent.ts
import { StateGraph, Annotation } from "@langchain/langgraph";
import { PostgresSaver } from "@langchain/langgraph-postgres";

const AgentState = Annotation.Root({
  messages: Annotation.Simple<BaseMessage[]>,
  retrievedDocs: Annotation.Simple<Document[]>,
  evaluationScore: Annotation.Simple<number>
});

const checkpointer = new PostgresSaver(pool);

export const compileRAGGraph = () => {
  return new StateGraph(AgentState)
    .addNode("retrieve", retrieveNode)
    .addNode("evaluate", evalNode)
    .addEdge("retrieve", "evaluate")
    .compile({ checkpointer });
};`
		}
	},
	{
		id: "03",
		slug: "gpu-ai-platform-modernization",
		title: "GPU Platform Modernization",
		shortTitle: "GPU Infrastructure",
		status: "ACTIVE",
		environment: "OpenShift / Run:AI",
		ingress: "Kube Ingress Controller",
		kicker: "Inference Scaling",
		problem: "I architected containerized high-performance inference platforms using RedHat OpenShift and Run:AI. Static GPU allocation layouts bottlenecked developer workflows, so I implemented dynamic fractional GPU slicing. By containerizing vLLM and deploying PagedAttention, we maximized H100 tensor throughput.",
		narration: "I configured Run:AI allocation templates for elastic, fractional resource sharing and vLLM pod prioritization. This ensures high-priority production inference jobs never experience cold starts, even under peak traffic.",
		telemetry: {
			latency: "12ms",
			cacheHit: "88%",
			gpuLoad: "100%",
			throughput: "140 T/s"
		},
		zones: [
			{ id: "z1", label: "Cluster Edge Ingress", x: 35, y: 110, w: 175, h: 145 },
			{ id: "z2", label: "Run:AI Partition Scheduler", x: 220, y: 30, w: 360, h: 275 }
		],
		nodes: [
			{ id: "n1", label: "Kube Ingress", desc: "OpenShift Route Controller", x: 50, y: 160, icon: ShieldCheck },
			{ id: "n2", label: "Run:AI Core", desc: "Fractional GPU Allocation", x: 230, y: 160, icon: Network },
			{ id: "n3", label: "vGPU Slices", desc: "Dynamic Virtual VRAM Allocator", x: 410, y: 160, icon: Cpu },
			{ id: "n4", label: "vLLM serving", desc: "PagedAttention LLM Runtime", x: 410, y: 50, icon: Zap },
			{ id: "n5", label: "OTel Tracing", desc: "Prometheus Trace Exporter", x: 410, y: 270, icon: Activity }
		],
		connections: [
			{ from: "n1", to: "n2" },
			{ from: "n2", to: "n3" },
			{ from: "n3", to: "n4" },
			{ from: "n3", to: "n5" }
		],
		logs: [
			"MANOJ: Run:AI daemon controller checking in. Synchronizing GPU slicing partitions...",
			"MANOJ: Allocated fractional GPU slice: 0.25 vGPU (10GB VRAM pod ceiling)...",
			"INFO: Model deepseek-ai/DeepSeek-V3 loaded into tensor parallel (TP=2) cache...",
			"SYSTEM: GPU memory pool initialized via NVLink at 900 GB/s bandwidth...",
			"MANOJ: Injecting OpenTelemetry span context for inference pipeline tracing...",
			"METRICS: Generation throughput stabilized at 140 tokens/sec. SLA verified...",
			"SYSTEM: Dynamic autoscaler added 2 vLLM worker replicas to match peak load."
		],
		adr: {
			filename: "gpu-allocation.yaml",
			language: "yaml",
			choice: "I configured Run:AI allocation templates for elastic, fractional resource sharing and vLLM pod prioritization. This ensures high-priority production inference jobs never experience cold starts, even under peak traffic.",
			code: `# gpu-allocation.yaml
apiVersion: scheduling.run.ai/v1
kind: PodGroup
metadata:
  name: vllm-deepseek-serving
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
            values:
            - H100`
		}
	},
	{
		id: "04",
		slug: "ai-architecture-enablement",
		title: "AI Architecture Enablement",
		shortTitle: "Technical Advisory",
		status: "DEPLOYED",
		environment: "Enterprise Hub",
		ingress: "Corporate Gateway",
		kicker: "Upskilling Teams",
		problem: "I spearheaded the design patterns for our Model Context Protocol (MCP) infrastructure, segregating database systems and proprietary calculators from public model logic. This protocol isolates tool access and database read-writes behind micro-agents running inside secure sandbox environments.",
		narration: "I structured our internal tooling using MCP servers. The primary tradeoff was API latency versus security boundary compliance, and standardizing on MCP allowed us to build custom tool integrations that any foundation model can query dynamically.",
		telemetry: {
			latency: "N/A",
			cacheHit: "94%",
			gpuLoad: "0%",
			throughput: "N/A"
		},
		zones: [
			{ id: "z1", label: "Developer Portal", x: 35, y: 110, w: 175, h: 145 },
			{ id: "z2", label: "Secure Tool Sandbox Subnets", x: 220, y: 30, w: 360, h: 275 }
		],
		nodes: [
			{ id: "n1", label: "Admin UI", desc: "Enterprise Developer Hub", x: 50, y: 160, icon: Monitor },
			{ id: "n2", label: "MCP Host Node", desc: "JSON-RPC Protocol Client", x: 230, y: 160, icon: Network },
			{ id: "n3", label: "Database tool", desc: "PostgreSQL Server wrapper", x: 410, y: 50, icon: Database },
			{ id: "n4", label: "External APIs", desc: "Third-party sandbox client", x: 410, y: 160, icon: Boxes },
			{ id: "n5", label: "Agent core", desc: "MCP Schema-Validated Agent", x: 410, y: 270, icon: CheckCircle2 }
		],
		connections: [
			{ from: "n1", to: "n2" },
			{ from: "n2", to: "n3" },
			{ from: "n2", to: "n4" },
			{ from: "n2", to: "n5" }
		],
		logs: [
			"MANOJ: Dynamic MCP server registry initialized on port 8080...",
			"MANOJ: Loaded tool schemas for [read_balance_sheet, query_vector_index]...",
			"HOST: Authorized connection request from agent [agent-core-01]...",
			"MANOJ: Transport protocol handshake completed via JSON-RPC stream...",
			"DATABASE: MCP tool server fetched record from PostgreSQL (3.1ms)...",
			"SYSTEM: Tool execution response returned to model. Token usage: 450...",
			"PORTAL: System audit complete. 50+ enterprise reviews archived safely."
		],
		adr: {
			filename: "ADR-04-MCP.md",
			language: "markdown",
			choice: "I structured our internal tooling using MCP servers. The primary tradeoff was API latency versus security boundary compliance, and standardizing on MCP allowed us to build custom tool integrations that any foundation model can query dynamically.",
			code: `# ADR-04: Model Context Protocol (MCP) Adoption

## Status
Accepted

## Context
Our multi-agent workflows require dynamic tool access. 
Tight coupling between tool implementations and LLM APIs 
results in code duplication and deployment risks.

## Decision
Standardize on the Model Context Protocol (MCP).
We will wrap enterprise database connections, API calls, and 
document parsers in MCP servers running inside separate container spaces.`
		}
	}
] as const;

function TerminalConsole({ logs }: { logs: readonly string[] }) {
	const [displayed, setDisplayed] = useState<string[]>(() => [...logs.slice(0, 5)]);
	const logContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let offset = 5;
		const interval = setInterval(() => {
			setDisplayed((prev) => {
				const nextLogIndex = offset % logs.length;
				offset++;
				const updated = [...prev, logs[nextLogIndex]];
				if (updated.length > 8) {
					updated.shift();
				}
				return updated;
			});
		}, 1800);

		return () => clearInterval(interval);
	}, [logs]);

	useEffect(() => {
		if (logContainerRef.current) {
			logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
		}
	}, [displayed]);

	return (
		<div
			ref={logContainerRef}
			role="log"
			aria-live="polite"
			aria-label="Scrolling System Terminal Logs"
			className="font-mono text-[10px] leading-5 text-emerald-400 bg-black/75 border border-border/80 p-3.5 rounded-xl h-[180px] overflow-y-auto scrollbar-thin select-none"
		>
			{displayed.map((log, index) => (
				<p key={`${log}-${index}`} className="break-all whitespace-pre-wrap text-emerald-400">
					<span className="text-emerald-600 select-none">&gt; </span>
					{log}
				</p>
			))}
			<span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-0.5 animate-pulse align-middle" aria-hidden="true" />
		</div>
	);
}

interface NetworkTopologyProps {
	zones: readonly { id: string; label: string; x: number; y: number; w: number; h: number }[];
	nodes: typeof commandCenterData[number]["nodes"];
	connections: typeof commandCenterData[number]["connections"];
	hoveredNode: string | null;
	setHoveredNode: (id: string | null) => void;
	pan: { x: number; y: number };
	scale: number;
	isDragging: boolean;
	onMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;
	onMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
	onMouseUp: () => void;
}

function NetworkTopology({
	zones,
	nodes,
	connections,
	hoveredNode,
	setHoveredNode,
	pan,
	scale,
	isDragging,
	onMouseDown,
	onMouseMove,
	onMouseUp
}: NetworkTopologyProps) {
	return (
		<svg
			viewBox="0 0 600 320"
			role="application"
			aria-label="System Architecture Blueprint Diagram Map"
			className={`w-full h-full p-4 md:p-6 select-none transition-transform duration-75 ${
				isDragging ? "cursor-grabbing" : "cursor-grab"
			}`}
			xmlns="http://www.w3.org/2000/svg"
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			onMouseLeave={onMouseUp}
		>
			<style>{`
				@keyframes flow {
					to {
						stroke-dashoffset: -20;
					}
				}
				.flow-line {
					stroke-dasharray: 6 4;
					animation: flow 1s linear infinite;
				}
			`}</style>

			<defs>
				<linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="rgba(245, 158, 11, 0.05)" />
					<stop offset="50%" stopColor="rgba(245, 158, 11, 0.95)" />
					<stop offset="100%" stopColor="rgba(245, 158, 11, 0.05)" />
				</linearGradient>
			</defs>

			{/* Apply Zoom and Pan transform group */}
			<g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
				{/* Background Zones */}
				{zones.map((zone) => (
					<g key={zone.id}>
						<rect
							x={zone.x}
							y={zone.y}
							width={zone.w}
							height={zone.h}
							fill="rgba(255, 255, 255, 0.01)"
							stroke="rgba(255, 255, 255, 0.08)"
							strokeWidth="1.2"
							strokeDasharray="4 4"
							rx="8"
						/>
						<text
							x={zone.x + 10}
							y={zone.y + 18}
							fill="rgba(255, 255, 255, 0.35)"
							fontSize="8"
							fontWeight="600"
							className="font-mono uppercase tracking-widest pointer-events-none select-none"
						>
							{zone.label}
						</text>
					</g>
				))}

				{/* Connection paths */}
				{connections.map((conn) => {
					const fromNode = nodes.find((n) => n.id === conn.from);
					const toNode = nodes.find((n) => n.id === conn.to);
					if (!fromNode || !toNode) return null;

					const isGlowing = hoveredNode === fromNode.id || hoveredNode === toNode.id;

					return (
						<g key={`${conn.from}-${conn.to}`}>
							{/* Ambient background line */}
							<path
								d={`M ${fromNode.x + 75} ${fromNode.y + 26} C ${(fromNode.x + toNode.x) / 2 + 75} ${fromNode.y + 26}, ${(fromNode.x + toNode.x) / 2 + 75} ${toNode.y + 26}, ${toNode.x + 75} ${toNode.y + 26}`}
								fill="none"
								stroke={isGlowing ? "rgba(245, 158, 11, 0.55)" : "rgba(255, 255, 255, 0.12)"}
								strokeWidth={isGlowing ? 2.5 : 1.5}
								className="transition-colors duration-300"
							/>
							{/* Flow packets */}
							<path
								d={`M ${fromNode.x + 75} ${fromNode.y + 26} C ${(fromNode.x + toNode.x) / 2 + 75} ${fromNode.y + 26}, ${(fromNode.x + toNode.x) / 2 + 75} ${toNode.y + 26}, ${toNode.x + 75} ${toNode.y + 26}`}
								fill="none"
								stroke="url(#flow-gradient)"
								strokeWidth="1.8"
								className="flow-line"
							/>
						</g>
					);
				})}

				{/* Nodes */}
				{nodes.map((node) => {
					const Icon = node.icon;
					const isHovered = hoveredNode === node.id;

					return (
						<foreignObject
							key={node.id}
							x={node.x}
							y={node.y}
							width="150"
							height="52"
							className="overflow-visible"
						>
							<div
								role="button"
								tabIndex={0}
								aria-label={`System Node: ${node.label}. Description: ${node.desc}`}
								className={`w-[150px] h-[52px] rounded-lg border text-left p-2 flex items-center gap-2 transition-all select-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus:outline-none ${
									isHovered
										? "border-amber/80 bg-zinc-900 shadow-[0_0_12px_rgba(245,158,11,0.2)] text-white"
										: "border-border/60 bg-zinc-950/95 text-zinc-300 hover:border-zinc-700"
								}`}
								onMouseEnter={() => !isDragging && setHoveredNode(node.id)}
								onMouseLeave={() => setHoveredNode(null)}
								onFocus={() => setHoveredNode(node.id)}
								onBlur={() => setHoveredNode(null)}
							>
								<div className="shrink-0 flex items-center justify-center p-1 rounded-md bg-zinc-900/50 border border-border/40" aria-hidden="true">
									<Icon className={`size-4 ${isHovered ? "text-amber" : "text-zinc-400"}`} />
								</div>
								<div className="min-w-0 flex-1 leading-tight">
									<h4 className="text-[10px] font-bold truncate text-zinc-100">{node.label}</h4>
									<p className="text-[8px] font-mono text-zinc-400 mt-0.5 whitespace-normal break-words line-clamp-2 leading-tight">
										{node.desc}
									</p>
								</div>
							</div>
						</foreignObject>
					);
				})}
			</g>
		</svg>
	);
}

interface InteractiveDiagramProps {
	zones: typeof commandCenterData[number]["zones"];
	nodes: typeof commandCenterData[number]["nodes"];
	connections: typeof commandCenterData[number]["connections"];
	hoveredNode: string | null;
	setHoveredNode: (id: string | null) => void;
	isFullscreen: boolean;
	setIsFullscreen: (val: boolean) => void;
}

function InteractiveDiagram({
	zones,
	nodes,
	connections,
	hoveredNode,
	setHoveredNode,
	isFullscreen,
	setIsFullscreen
}: InteractiveDiagramProps) {
	const [scale, setScale] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	const containerRef = useRef<HTMLDivElement>(null);

	const zoomIn = () => setScale((s) => Math.min(s + 0.15, 3.0));
	const zoomOut = () => setScale((s) => Math.max(s - 0.15, 0.5));
	const resetZoom = () => {
		setScale(1);
		setPan({ x: 0, y: 0 });
	};

	// Mouse Event Handlers for Panning SVG
	const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
		e.preventDefault();
		setIsDragging(true);
		setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
	};

	const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
		if (!isDragging) return;
		setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	// Touch Event Handlers for Mobile Panning
	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		if (e.touches.length === 1) {
			setIsDragging(true);
			const touch = e.touches[0];
			setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
		}
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
		if (!isDragging) return;
		if (e.touches.length === 1) {
			const touch = e.touches[0];
			setPan({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
		}
	};

	const handleTouchEnd = () => {
		setIsDragging(false);
	};

	// Keyboard Listeners for Panning and Zooming (A11Y)
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const step = 25 / scale;
		if (e.key === "ArrowUp") {
			e.preventDefault();
			setPan((p) => ({ ...p, y: p.y - step }));
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			setPan((p) => ({ ...p, y: p.y + step }));
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			setPan((p) => ({ ...p, x: p.x - step }));
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			setPan((p) => ({ ...p, x: p.x + step }));
		} else if (e.key === "+" || e.key === "=") {
			e.preventDefault();
			zoomIn();
		} else if (e.key === "-" || e.key === "_") {
			e.preventDefault();
			zoomOut();
		} else if (e.key === "r" || e.key === "R") {
			e.preventDefault();
			resetZoom();
		}
	};

	return (
		<div
			ref={containerRef}
			tabIndex={0}
			role="region"
			aria-label="Interactive architecture topology. Use arrow keys to pan, plus/minus keys to zoom, and R to reset."
			onKeyDown={handleKeyDown}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			className="relative w-full h-full focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus:outline-none rounded-xl"
		>
			{/* Floating Tool Controls */}
			<div className="absolute top-4 right-4 flex items-center gap-1 bg-black/85 border border-border/80 p-1.5 rounded-lg backdrop-blur-md z-10 select-none">
				<button
					onClick={zoomIn}
					aria-label="Zoom In"
					className="p-1.5 rounded hover:bg-white/[0.1] hover:text-white transition-colors text-zinc-300 focus-visible:ring-2 focus-visible:ring-amber-500 focus:outline-none"
					title="Zoom In"
				>
					<ZoomIn className="size-4" />
				</button>
				<button
					onClick={zoomOut}
					aria-label="Zoom Out"
					className="p-1.5 rounded hover:bg-white/[0.1] hover:text-white transition-colors text-zinc-300 focus-visible:ring-2 focus-visible:ring-amber-500 focus:outline-none"
					title="Zoom Out"
				>
					<ZoomOut className="size-4" />
				</button>
				<button
					onClick={resetZoom}
					aria-label="Reset Zoom and Offset"
					className="p-1.5 rounded hover:bg-white/[0.1] hover:text-white transition-colors text-zinc-300 focus-visible:ring-2 focus-visible:ring-amber-500 focus:outline-none"
					title="Reset View"
				>
					<RotateCcw className="size-4" />
				</button>
				{!isFullscreen && (
					<>
						<span className="w-px h-4 bg-border/80 mx-1" aria-hidden="true" />
						<button
							onClick={() => setIsFullscreen(true)}
							aria-label="Toggle Fullscreen Mode"
							className="p-1.5 rounded hover:bg-white/[0.1] hover:text-white transition-colors text-zinc-300 focus-visible:ring-2 focus-visible:ring-amber-500 focus:outline-none"
							title="Enter Fullscreen"
						>
							<Maximize2 className="size-4" />
						</button>
					</>
				)}
			</div>

			<NetworkTopology
				zones={zones}
				nodes={nodes}
				connections={connections}
				hoveredNode={hoveredNode}
				setHoveredNode={setHoveredNode}
				pan={pan}
				scale={scale}
				isDragging={isDragging}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			/>
		</div>
	);
}

export default function CaseStudiesClient() {
	const [activeIdx, setActiveIdx] = useState(0);
	const [hoveredNode, setHoveredNode] = useState<string | null>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const activeStudy = commandCenterData[activeIdx];

	return (
		<>
			<PageHero
				kicker="AI Systems Command Console"
				title="System architectures under telemetry."
				description="Welcome to my architecture telemetry dashboard. Select a design blueprint on the left to inspect system topologies, review real-time logs, view latency data, and analyze code-level decision logs."
			/>

			{/* Main Layout Grid - Mobile first stacked, scaling up to side panels on large viewports */}
			<Section className="py-8 md:py-12 bg-zinc-950/40">
				<div className="grid gap-6 grid-cols-1 lg:grid-cols-[280px_1fr_320px] lg:items-stretch min-h-[660px]">

					{/* Sidebar Panel (Figma Layer Tree style) */}
					<aside className="border border-border/80 bg-black/45 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between">
						<div>
							<div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
								<Layers className="size-4 text-amber" aria-hidden="true" />
								<span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Blueprints</span>
							</div>
							<div role="tablist" aria-label="Systems Case Study Blueprints" className="space-y-2">
								{commandCenterData.map((study, idx) => {
									const isActive = activeIdx === idx;
									return (
										<button
											key={study.slug}
											role="tab"
											aria-selected={isActive}
											aria-controls={`blueprint-tabpanel-${idx}`}
											id={`blueprint-tab-${idx}`}
											onClick={() => setActiveIdx(idx)}
											className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 group flex items-start justify-between focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus:outline-none ${
												isActive
													? "border-amber/60 bg-amber/[0.05] text-white shadow-sm"
													: "border-border/60 bg-transparent text-zinc-400 hover:border-border hover:bg-white/[0.02]"
											}`}
										>
											<div className="min-w-0">
												<p className="font-mono text-[10px] uppercase text-amber">0{idx + 1}</p>
												<h3 className={`text-sm font-semibold mt-1 truncate ${isActive ? "text-white" : "group-hover:text-zinc-100"}`}>
													{study.shortTitle}
												</h3>
												<p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
													{study.kicker}
												</p>
											</div>
											<span className={`inline-flex size-2.5 rounded-full mt-1 shrink-0 ${
												study.status === "PRODUCTION"
													? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
													: "bg-amber shadow-[0_0_8px_#f59e0b]"
											}`} aria-label={`Status: ${study.status}`} />
										</button>
									);
								})}
							</div>
						</div>

						<div className="mt-8 border-t border-border/60 pt-4 text-center">
							<p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">SYSTEM CONTEXT</p>
							<p className="text-[10px] text-zinc-400 mt-1 leading-normal">
								Grounded inside Manoj Mukherjee&apos;s AI Platform stack.
							</p>
						</div>
					</aside>

					{/* Center Panel (Interactive SVG blueprint visualizer) */}
					<main
						id={`blueprint-tabpanel-${activeIdx}`}
						role="tabpanel"
						aria-labelledby={`blueprint-tab-${activeIdx}`}
						className="border border-border/80 bg-black/45 backdrop-blur-md rounded-2xl p-4 md:p-5 flex flex-col justify-between min-w-0 relative"
					>
						<div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] rounded-2xl [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)]" aria-hidden="true" />

						<div>
							<header className="flex flex-wrap items-center justify-between border-b border-border/60 pb-3 mb-4 gap-4">
								<div className="flex items-center gap-2">
									<Monitor className="size-4 text-amber" aria-hidden="true" />
									<h2 className="font-mono text-xs uppercase tracking-wider text-zinc-200">{activeStudy.title}</h2>
								</div>
								<div className="flex items-center gap-3">
									<span className="font-mono text-[10px] text-zinc-400 uppercase">Env: {activeStudy.environment}</span>
									<span className="h-3 w-px bg-border/60" aria-hidden="true" />
									<span className="font-mono text-[10px] text-zinc-400 uppercase">Ingress: {activeStudy.ingress}</span>
								</div>
							</header>

							<p className="text-sm leading-relaxed text-zinc-300 max-w-[65ch]">
								<strong className="text-zinc-100 font-medium">Problem Constraint:</strong> {activeStudy.problem}
							</p>

							{/* Manoj's Direct Voice Engineering Note */}
							<div className="mt-4 border-l-2 border-amber/50 pl-4 py-2.5 bg-amber/[0.02] rounded-r-xl">
								<p className="text-xs italic text-zinc-300 leading-relaxed">
									<span className="font-mono font-bold text-amber not-italic uppercase tracking-wider text-[10.5px] block mb-1">Manoj&apos;s Engineering Note</span>
									&ldquo;{activeStudy.narration}&rdquo;
								</p>
							</div>
						</div>

						{/* Interactive Blueprint Canvas - Height calibated for mobile-first views */}
						<div className="my-6 relative border border-border/60 bg-zinc-950/70 rounded-xl h-[360px] md:h-[420px] overflow-hidden flex items-center justify-center">
							<InteractiveDiagram
								key={activeStudy.slug}
								zones={activeStudy.zones}
								nodes={activeStudy.nodes}
								connections={activeStudy.connections}
								hoveredNode={hoveredNode}
								setHoveredNode={setHoveredNode}
								isFullscreen={false}
								setIsFullscreen={setIsFullscreen}
							/>
						</div>

						{/* Telemetry Status Footer */}
						<footer className="flex flex-wrap items-center justify-between border-t border-border/40 pt-4 gap-4">
							<span className="font-mono text-[10px] text-zinc-400 uppercase flex items-center gap-1.5">
								<span className="size-1.5 rounded-full bg-amber animate-ping" aria-hidden="true" />
								Active Topology Map
							</span>
							<p className="text-[10px] text-zinc-400 leading-normal max-w-[42ch]">
								Drag/touch to pan. Hover nodes to trace pathways and inspect telemetry loads.
							</p>
						</footer>
					</main>

					{/* Right Panel (JARVIS Telemetry HUD + scrolling logs) */}
					<aside className="border border-border/80 bg-black/45 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between">
						<div>
							<div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
								<Activity className="size-4 text-amber" aria-hidden="true" />
								<span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Telemetry HUD</span>
							</div>

							{/* Telemetry Grid */}
							<div className="grid grid-cols-2 gap-2">
								<div className="border border-border/60 bg-zinc-950/40 p-3.5 rounded-xl">
									<p className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">LATENCY</p>
									<p className="text-xl font-display font-semibold text-white mt-1">{activeStudy.telemetry.latency}</p>
								</div>
								<div className="border border-border/60 bg-zinc-950/40 p-3.5 rounded-xl">
									<p className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">CACHE HIT</p>
									<p className="text-xl font-display font-semibold text-white mt-1">{activeStudy.telemetry.cacheHit}</p>
								</div>
								<div className="border border-border/60 bg-zinc-950/40 p-3.5 rounded-xl">
									<p className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">GPU ALLOC</p>
									<p className="text-xl font-display font-semibold text-white mt-1">{activeStudy.telemetry.gpuLoad}</p>
								</div>
								<div className="border border-border/60 bg-zinc-950/40 p-3.5 rounded-xl">
									<p className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">SPEED</p>
									<p className="text-xl font-display font-semibold text-white mt-1">{activeStudy.telemetry.throughput}</p>
								</div>
							</div>
						</div>

						{/* Real-time scrolling console */}
						<div className="mt-6 flex-1 flex flex-col justify-end min-h-[220px]">
							<div className="flex items-center gap-2 border-b border-border/60 pb-2 mb-3">
								<Terminal className="size-3.5 text-amber" aria-hidden="true" />
								<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">Terminal Logs</span>
							</div>

							<TerminalConsole key={activeStudy.slug} logs={activeStudy.logs} />
						</div>
					</aside>

				</div>
			</Section>

			{/* Bottom Drawer (ADR & Code Inspector) */}
			<Section className="border-t border-border">
				<SectionHeader
					kicker="Decision Ledger"
					title="Inspect the core codebase decision logs."
					description="Review the actual code choices, framework configs, and deployment records supporting this topology."
				/>

				<div className="mt-12 grid gap-6 lg:grid-cols-[0.42fr_0.58fr] lg:items-stretch">

					{/* Choices Description Card */}
					<Card className="border border-border/80 bg-black/20 backdrop-blur-md rounded-2xl flex flex-col justify-between">
						<CardContent className="p-6 flex flex-col justify-between h-full">
							<div>
								<div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
									<GitBranch className="size-4 text-amber" aria-hidden="true" />
									<span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Decision Context</span>
								</div>
								<h3 className="text-base font-semibold text-zinc-100 mt-2">
									Architectural Choice Detail
								</h3>
								<p className="text-sm leading-7 text-zinc-300 mt-4">
									{activeStudy.adr.choice}
								</p>
							</div>

							<div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between">
								<span className="font-mono text-[10px] text-zinc-400 uppercase flex items-center gap-1.5">
									<FileCode className="size-3.5 text-amber" aria-hidden="true" />
									ADR Reference
								</span>
								<Button asChild variant="ghost" size="sm" className="h-8 hover:text-amber text-xs focus-visible:ring-2 focus-visible:ring-amber-500 focus:outline-none">
									<Link href="/engineering">
										Explore full Decision Map
										<ArrowRight className="size-3.5 ml-1.5" aria-hidden="true" />
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* IDE Code Editor Mockup */}
					<div className="rounded-2xl border border-border/80 bg-zinc-950 font-mono text-[11px] leading-relaxed shadow-2xl overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-amber-500">
						{/* Window Header */}
						<div className="bg-zinc-900 px-4 py-3 border-b border-border/80 flex items-center justify-between select-none">
							<div className="flex items-center gap-1.5">
								<span className="size-2.5 rounded-full bg-rose-500/90" />
								<span className="size-2.5 rounded-full bg-amber/90" />
								<span className="size-2.5 rounded-full bg-emerald-500/90" />
							</div>
							<span className="text-[10px] text-zinc-400 tracking-wide font-mono">
								{activeStudy.adr.filename}
							</span>
							<span className="uppercase text-[9px] text-amber font-mono">
								{activeStudy.adr.language}
							</span>
						</div>

						{/* IDE Content */}
						<pre className="p-5 overflow-x-auto text-zinc-200 flex-1 max-h-[380px] bg-black/50">
							<code>{activeStudy.adr.code}</code>
						</pre>
					</div>

				</div>
			</Section>

			<CtaBand title="Have a system that needs this level of architecture?" />

			{/* Fullscreen Overlay Canvas Mode */}
			{isFullscreen && (
				<div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/98 backdrop-blur-md p-4 md:p-6 select-none animate-in fade-in duration-200">
					{/* Fullscreen Header */}
					<header className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
						<div className="flex items-center gap-3">
							<Monitor className="size-5 text-amber" aria-hidden="true" />
							<div>
								<span className="font-mono text-[9px] uppercase tracking-widest text-amber">Active Command Topology</span>
								<h2 className="font-display text-lg font-bold text-white mt-0.5">{activeStudy.title}</h2>
							</div>
						</div>
						<div className="flex items-center gap-6">
							<div className="hidden md:flex items-center gap-3 text-xs">
								<span className="font-mono text-[10px] text-zinc-400 uppercase">Env: {activeStudy.environment}</span>
								<span className="h-3 w-px bg-border/60" aria-hidden="true" />
								<span className="font-mono text-[10px] text-zinc-400 uppercase">Ingress: {activeStudy.ingress}</span>
							</div>
							<button
								onClick={() => setIsFullscreen(false)}
								aria-label="Exit Fullscreen Mode"
								className="flex items-center gap-1.5 bg-zinc-900 border border-border/80 text-zinc-300 hover:text-white transition-all px-3 py-1.5 rounded-lg text-xs focus-visible:ring-2 focus-visible:ring-amber-500 focus:outline-none"
							>
								<X className="size-4" aria-hidden="true" />
								Close View
							</button>
						</div>
					</header>

					{/* Fullscreen Canvas Container - Responsively fits any sizing height */}
					<div className="flex-1 relative border border-border/80 bg-black/60 rounded-2xl overflow-hidden flex items-center justify-center">
						<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" aria-hidden="true" />

						<div className="w-full max-w-4xl h-[70vh]">
							<InteractiveDiagram
								key={`fs-${activeStudy.slug}`}
								zones={activeStudy.zones}
								nodes={activeStudy.nodes}
								connections={activeStudy.connections}
								hoveredNode={hoveredNode}
								setHoveredNode={setHoveredNode}
								isFullscreen={true}
								setIsFullscreen={setIsFullscreen}
							/>
						</div>
					</div>

					{/* Bottom Telemetry HUD in Fullscreen */}
					<footer className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border/40 pt-4">
						<div className="p-3 bg-zinc-950/40 border border-border/40 rounded-xl">
							<p className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">LATENCY</p>
							<p className="text-xl font-display text-white mt-1">{activeStudy.telemetry.latency}</p>
						</div>
						<div className="p-3 bg-zinc-950/40 border border-border/40 rounded-xl">
							<p className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">CACHE HIT</p>
							<p className="text-xl font-display text-white mt-1">{activeStudy.telemetry.cacheHit}</p>
						</div>
						<div className="p-3 bg-zinc-950/40 border border-border/40 rounded-xl">
							<p className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">GPU ALLOC</p>
							<p className="text-xl font-display text-white mt-1">{activeStudy.telemetry.gpuLoad}</p>
						</div>
						<div className="p-3 bg-zinc-950/40 border border-border/40 rounded-xl">
							<p className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">THROUGHPUT</p>
							<p className="text-xl font-display text-white mt-1">{activeStudy.telemetry.throughput}</p>
						</div>
					</footer>
				</div>
			)}
		</>
	);
}
