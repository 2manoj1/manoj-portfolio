"use client";

import { useState, useMemo, useEffect, memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Code2, 
  Terminal, 
  Network, 
  ShieldCheck, 
  Gauge, 
  Layers, 
  Coins, 
  User, 
  Layout, 
  Server, 
  Database, 
  Cpu, 
  Activity,
  Maximize2,
  Minimize2,
  Calendar
} from "lucide-react";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Position, 
  Handle, 
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
  type Node,
  type Edge
} from "@xyflow/react";
import { cn } from "@/lib/utils";

// Map string keys to Lucide icons for React Flow custom nodes
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  user: User,
  layout: Layout,
  server: Server,
  network: Network,
  layers: Layers,
  database: Database,
  code: Code2,
  cpu: Cpu,
  activity: Activity,
};

// 1. React Flow custom AgentNode component
const AgentNode = memo(({ data }: { data: { label: string; role: string; type: string; icon?: string; active?: boolean } }) => {
  const IconComponent = data.icon ? iconMap[data.icon] : null;
  return (
    <div className={cn(
      "rounded-lg border bg-zinc-50 dark:bg-zinc-950 p-2.5 min-w-[130px] shadow-lg transition-all duration-300 text-left",
      data.active 
        ? "border-amber/80 shadow-[0_0_12px_rgba(245,158,11,0.15)] dark:shadow-[0_0_12px_rgba(245,158,11,0.25)] scale-[1.02]" 
        : "border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
    )}>
      {/* Handles */}
      <Handle type="target" position={Position.Left} id="l-in" className="!bg-zinc-350 dark:!bg-zinc-800 !w-1 !h-1" />
      <Handle type="target" position={Position.Top} id="t-in" className="!bg-zinc-350 dark:!bg-zinc-800 !w-1 !h-1" />
      <Handle type="target" position={Position.Bottom} id="b-in" className="!bg-zinc-350 dark:!bg-zinc-800 !w-1 !h-1" />
      <Handle type="target" position={Position.Right} id="r-in" className="!bg-zinc-350 dark:!bg-zinc-800 !w-1 !h-1" />
 
      <div className="flex gap-2 items-start">
        {IconComponent && (
          <div className={cn(
            "p-1.5 rounded shrink-0 border mt-0.5",
            data.active 
              ? "bg-amber/10 border-amber/30 text-amber"
              : "bg-zinc-150 dark:bg-zinc-900 border-zinc-250 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400"
          )}>
            <IconComponent className="size-3" />
          </div>
        )}
        <div className="min-w-0">
          <div className="font-mono text-[7px] uppercase tracking-wider text-amber-700 dark:text-amber font-bold leading-none">{data.type}</div>
          <div className="font-sans text-[10px] font-semibold text-zinc-800 dark:text-zinc-100 mt-1 leading-snug truncate">{data.label}</div>
          <div className="font-mono text-[8px] text-zinc-500 mt-0.5 leading-none truncate">{data.role}</div>
        </div>
      </div>
 
      <Handle type="source" position={Position.Right} id="r-out" className="!bg-zinc-350 dark:!bg-zinc-800 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} id="b-out" className="!bg-zinc-350 dark:!bg-zinc-800 !w-1 !h-1" />
      <Handle type="source" position={Position.Top} id="t-out" className="!bg-zinc-350 dark:!bg-zinc-800 !w-1 !h-1" />
      <Handle type="source" position={Position.Left} id="l-out" className="!bg-zinc-350 dark:!bg-zinc-800 !w-1 !h-1" />
    </div>
  );
});
AgentNode.displayName = "AgentNode";

const nodeTypes = {
  agent: AgentNode,
};

// Example LangGraph python code to display in the code tab
const LANGGRAPH_HERO_CODE = `\`\`\`python
from langgraph.graph import StateGraph, START, END
from langgraph.config import get_stream_writer

class EnterpriseRAGOrchestrator:
    def __init__(self, vector_store, llm_client):
        self.vector_store = vector_store
        self.llm = llm_client

    def _build_graph(self):
        # Define stateful agentic routing graph
        builder = StateGraph(AgentWorkflowState)
        builder.add_node("retrieve", self._query_rag_index)
        builder.add_node("evaluate", self._grounding_guard)
        builder.add_node("generate", self._call_model)
        
        # Compile execution boundaries
        builder.add_edge(START, "retrieve")
        builder.add_edge("retrieve", "evaluate")
        builder.add_conditional_edges(
            "evaluate",
            self._route_decision,
            {
                "grounded": "generate",
                "hallucination": "retrieve"  # Self-healing loop
            }
        )
        builder.add_edge("generate", END)
        return builder.compile()
\`\`\``;

// Stable traces for the AI Observability tab
const STABLE_TRACES = [
  { time: "17:50:01.012", trace: "tr_sys", component: "User Client", event: "User session query submitted in UI dashboard", status: "OK" },
  { time: "17:50:01.120", trace: "tr_sys", component: "Next.js App", event: "Proxied request as SSE connection stream to FastAPI", status: "OK" },
  { time: "17:50:01.280", trace: "tr_sys", component: "FastAPI API", event: "Validated JWT session token & initialized context state", status: "OK" },
  { time: "17:50:01.780", trace: "tr_sys", component: "LangGraph Sup.", event: "Triggered multi-agent planning, pgvector RAG, & sandbox runner", status: "OK" },
  { time: "17:50:02.110", trace: "tr_sys", component: "LLM Gateway", event: "Parsed models router: claude-3-5-sonnet selected | cached: true", status: "OK" },
  { time: "17:50:02.390", trace: "tr_sys", component: "FastAPI SSE", event: "Streamed response chunks back to Next.js client UI", status: "OK" },
  { time: "17:50:02.580", trace: "tr_sys", component: "OTEL Exporter", event: "Pushed transaction execution spans to OpenTelemetry", status: "OK" },
];

// Helper component inside ReactFlowProvider to auto-center nodes on dimension updates
function FlowResizer({ isFullscreen, isMobile, activeTab }: { isFullscreen: boolean; isMobile: boolean; activeTab: string }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    // Run fitView after a short timeout to let CSS layout size changes settle
    const timer = setTimeout(() => {
      fitView({ duration: 400, padding: 0.08 });
    }, 250);
    return () => clearTimeout(timer);
  }, [isFullscreen, isMobile, activeTab, fitView]);

  return null;
}

export function SystemsConsole() {
  const [activeTab, setActiveTab] = useState<"topology" | "code" | "telemetry">("topology");
  const [step, setStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Auto-simulation step loop
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 7);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Screen size check for mobile layout responsiveness
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Escape key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // React Flow options to lock canvas controls to focus strictly on rendering the diagram
  // preventScrolling: false allows the user's browser page scrolling to work even when hovering over this console.
  const flowProps = useMemo(() => ({
    nodesConnectable: false,
    nodesDraggable: false,
    elementsSelectable: false,
    zoomOnScroll: false,
    zoomOnPinch: true,
    zoomOnDoubleClick: true,
    panOnDrag: true,
    panOnScroll: false,
    preventScrolling: false,
    fitView: true,
    fitViewOptions: { padding: 0.08 },
  }), []);

  // Generate nodes representing a production-grade multi-agent system based on active step
  const nodes: Node[] = useMemo(() => {
    if (isMobile) {
      // Mobile vertical 2-column layout
      return [
        {
          id: "user",
          type: "agent",
          position: { x: 15, y: 20 },
          data: { 
            type: "Client", 
            label: "End User Client", 
            role: "Web / API Session",
            icon: "user", 
            active: step === 0 || step === 5
          },
        },
        {
          id: "frontend",
          type: "agent",
          position: { x: 15, y: 105 },
          data: { 
            type: "Presentation", 
            label: "Next.js Frontend", 
            role: "React Streaming UI",
            icon: "layout", 
            active: step === 0 || step === 1 || step === 5
          },
        },
        {
          id: "backend",
          type: "agent",
          position: { x: 15, y: 190 },
          data: { 
            type: "Gateway", 
            label: "FastAPI Backend", 
            role: "Auth, Router & State",
            icon: "server", 
            active: step === 1 || step === 2 || step === 5
          },
        },
        {
          id: "supervisor",
          type: "agent",
          position: { x: 15, y: 275 },
          data: { 
            type: "Coordinator", 
            label: "LangGraph Router", 
            role: "Supervisor Orchestrator",
            icon: "network", 
            active: step > 1 && step < 7
          },
        },
        {
          id: "gateway",
          type: "agent",
          position: { x: 15, y: 360 },
          data: { 
            type: "Inference", 
            label: "LLM Provider Router", 
            role: "Prompt Cache Router",
            icon: "cpu", 
            active: step === 4
          },
        },
        {
          id: "planner",
          type: "agent",
          position: { x: 175, y: 20 },
          data: { 
            type: "Reasoner", 
            label: "Task Planner", 
            role: "Step Decomposition",
            icon: "layers", 
            active: step === 3
          },
        },
        {
          id: "rag",
          type: "agent",
          position: { x: 175, y: 105 },
          data: { 
            type: "Knowledge", 
            label: "pgvector Index", 
            role: "RAG Context Search",
            icon: "database", 
            active: step === 3
          },
        },
        {
          id: "coder",
          type: "agent",
          position: { x: 175, y: 190 },
          data: { 
            type: "Executor", 
            label: "Sandbox Runner", 
            role: "Coder Agent Sandbox",
            icon: "code", 
            active: step === 3
          },
        },
        {
          id: "otel",
          type: "agent",
          position: { x: 175, y: 275 },
          data: { 
            type: "Metrics", 
            label: "OTEL Exporter", 
            role: "Span Trace Exporter",
            icon: "activity", 
            active: step === 6
          },
        },
      ];
    }

    // Desktop horizontal layout
    return [
      {
        id: "user",
        type: "agent",
        position: { x: 10, y: 110 },
        data: { 
          type: "Client", 
          label: "End User Client", 
          role: "Web / API Session",
          icon: "user", 
          active: step === 0 || step === 5
        },
      },
      {
        id: "frontend",
        type: "agent",
        position: { x: 150, y: 110 },
        data: { 
          type: "Presentation", 
          label: "Next.js Frontend", 
          role: "React Streaming UI",
          icon: "layout", 
          active: step === 0 || step === 1 || step === 5
        },
      },
      {
        id: "backend",
        type: "agent",
        position: { x: 290, y: 110 },
        data: { 
          type: "Gateway", 
          label: "FastAPI Backend", 
          role: "Auth, Router & State",
          icon: "server", 
          active: step === 1 || step === 2 || step === 5
        },
      },
      {
        id: "supervisor",
        type: "agent",
        position: { x: 430, y: 110 },
        data: { 
          type: "Coordinator", 
          label: "LangGraph Router", 
          role: "Supervisor Orchestrator",
          icon: "network", 
          active: step > 1 && step < 7
        },
      },
      {
        id: "planner",
        type: "agent",
        position: { x: 570, y: 25 },
        data: { 
          type: "Reasoner", 
          label: "Task Planner", 
          role: "Step Decomposition",
          icon: "layers", 
          active: step === 3
        },
      },
      {
        id: "rag",
        type: "agent",
        position: { x: 570, y: 110 },
        data: { 
          type: "Knowledge", 
          label: "pgvector Index", 
          role: "RAG Context Search",
          icon: "database", 
          active: step === 3
        },
      },
      {
        id: "coder",
        type: "agent",
        position: { x: 570, y: 195 },
        data: { 
          type: "Executor", 
          label: "Sandbox Runner", 
          role: "Coder Agent Sandbox",
          icon: "code", 
          active: step === 3
        },
      },
      {
        id: "gateway",
        type: "agent",
        position: { x: 710, y: 55 },
        data: { 
          type: "Inference", 
          label: "LLM Provider Router", 
          role: "Prompt Cache Router",
          icon: "cpu", 
          active: step === 4
        },
      },
      {
        id: "otel",
        type: "agent",
        position: { x: 710, y: 165 },
        data: { 
          type: "Metrics", 
          label: "OTEL Exporter", 
          role: "Span Trace Exporter",
          icon: "activity", 
          active: step === 6
        },
      },
    ];
  }, [isMobile, step]);

  // Connect system topology lanes dynamically animating active execution paths
  const edges: Edge[] = useMemo(() => {
    const isStep0 = step === 0;
    const isStep1 = step === 1;
    const isStep2 = step === 2;
    const isStep3 = step === 3;
    const isStep4 = step === 4;
    const isStep5 = step === 5;
    const isStep6 = step === 6;

    if (isMobile) {
      // Mobile routing handles (connecting vertically in Column 1 and horizontally to Column 2)
      return [
        {
          id: "e-user-frontend",
          source: "user",
          target: "frontend",
          sourceHandle: "b-out",
          targetHandle: "t-in",
          animated: isStep0,
          style: { 
            stroke: isStep0 ? "var(--amber)" : "var(--flow-edge-inactive)", 
            strokeWidth: isStep0 ? 2 : 1 
          },
        },
        {
          id: "e-frontend-backend",
          source: "frontend",
          target: "backend",
          sourceHandle: "b-out",
          targetHandle: "t-in",
          animated: isStep1,
          style: { 
            stroke: isStep1 ? "var(--amber)" : "var(--flow-edge-inactive)", 
            strokeWidth: isStep1 ? 2 : 1 
          },
        },
        {
          id: "e-backend-supervisor",
          source: "backend",
          target: "supervisor",
          sourceHandle: "b-out",
          targetHandle: "t-in",
          animated: isStep2,
          style: { 
            stroke: isStep2 ? "var(--amber)" : "var(--flow-edge-inactive)", 
            strokeWidth: isStep2 ? 2 : 1 
          },
        },
        {
          id: "e-supervisor-planner",
          source: "supervisor",
          target: "planner",
          sourceHandle: "r-out",
          targetHandle: "l-in",
          animated: isStep3,
          style: { 
            stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep3 ? 2 : 1 
          },
        },
        {
          id: "e-planner-supervisor",
          source: "planner",
          target: "supervisor",
          sourceHandle: "l-out",
          targetHandle: "t-in",
          animated: isStep3,
          style: { 
            stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep3 ? 2 : 1 
          },
        },
        {
          id: "e-supervisor-rag",
          source: "supervisor",
          target: "rag",
          sourceHandle: "r-out",
          targetHandle: "l-in",
          animated: isStep3,
          style: { 
            stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep3 ? 2 : 1 
          },
        },
        {
          id: "e-rag-supervisor",
          source: "rag",
          target: "supervisor",
          sourceHandle: "l-out",
          targetHandle: "r-in",
          animated: isStep3,
          style: { 
            stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep3 ? 2 : 1 
          },
        },
        {
          id: "e-supervisor-coder",
          source: "supervisor",
          target: "coder",
          sourceHandle: "r-out",
          targetHandle: "l-in",
          animated: isStep3,
          style: { 
            stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep3 ? 2 : 1 
          },
        },
        {
          id: "e-coder-supervisor",
          source: "coder",
          target: "supervisor",
          sourceHandle: "l-out",
          targetHandle: "b-in",
          animated: isStep3,
          style: { 
            stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep3 ? 2 : 1 
          },
        },
        {
          id: "e-supervisor-gateway",
          source: "supervisor",
          target: "gateway",
          sourceHandle: "b-out",
          targetHandle: "t-in",
          animated: isStep4,
          style: { 
            stroke: isStep4 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep4 ? 2 : 1 
          },
        },
        {
          id: "e-gateway-backend",
          source: "gateway",
          target: "backend",
          sourceHandle: "t-out",
          targetHandle: "b-in",
          animated: isStep5,
          style: { 
            stroke: isStep5 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep5 ? 2 : 1 
          },
        },
        {
          id: "e-backend-frontend",
          source: "backend",
          target: "frontend",
          sourceHandle: "t-out",
          targetHandle: "b-in",
          animated: isStep5,
          style: { 
            stroke: isStep5 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep5 ? 2 : 1 
          },
        },
        {
          id: "e-frontend-user",
          source: "frontend",
          target: "user",
          sourceHandle: "t-out",
          targetHandle: "b-in",
          animated: isStep5,
          style: { 
            stroke: isStep5 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep5 ? 2 : 1 
          },
        },
        {
          id: "e-supervisor-otel",
          source: "supervisor",
          target: "otel",
          sourceHandle: "r-out",
          targetHandle: "l-in",
          animated: isStep6,
          style: { 
            stroke: isStep6 ? "var(--amber)" : "var(--flow-edge-inactive)",
            strokeWidth: isStep6 ? 2 : 1 
          },
        },
      ];
    }

    // Desktop horizontal routing handles
    return [
      {
        id: "e-user-frontend",
        source: "user",
        target: "frontend",
        sourceHandle: "r-out",
        targetHandle: "l-in",
        animated: isStep0,
        style: { 
          stroke: isStep0 ? "var(--amber)" : "var(--flow-edge-inactive)", 
          strokeWidth: isStep0 ? 2 : 1 
        },
      },
      {
        id: "e-frontend-backend",
        source: "frontend",
        target: "backend",
        sourceHandle: "r-out",
        targetHandle: "l-in",
        animated: isStep1,
        style: { 
          stroke: isStep1 ? "var(--amber)" : "var(--flow-edge-inactive)", 
          strokeWidth: isStep1 ? 2 : 1 
        },
      },
      {
        id: "e-backend-supervisor",
        source: "backend",
        target: "supervisor",
        sourceHandle: "r-out",
        targetHandle: "l-in",
        animated: isStep2,
        style: { 
          stroke: isStep2 ? "var(--amber)" : "var(--flow-edge-inactive)", 
          strokeWidth: isStep2 ? 2 : 1 
        },
      },
      {
        id: "e-supervisor-planner",
        source: "supervisor",
        target: "planner",
        sourceHandle: "r-out",
        targetHandle: "l-in",
        animated: isStep3,
        style: { 
          stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep3 ? 2 : 1 
        },
      },
      {
        id: "e-planner-supervisor",
        source: "planner",
        target: "supervisor",
        sourceHandle: "l-out",
        targetHandle: "t-in",
        animated: isStep3,
        style: { 
          stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep3 ? 2 : 1 
        },
      },
      {
        id: "e-supervisor-rag",
        source: "supervisor",
        target: "rag",
        sourceHandle: "r-out",
        targetHandle: "l-in",
        animated: isStep3,
        style: { 
          stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep3 ? 2 : 1 
        },
      },
      {
        id: "e-rag-supervisor",
        source: "rag",
        target: "supervisor",
        sourceHandle: "l-out",
        targetHandle: "r-in",
        animated: isStep3,
        style: { 
          stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep3 ? 2 : 1 
        },
      },
      {
        id: "e-supervisor-coder",
        source: "supervisor",
        target: "coder",
        sourceHandle: "r-out",
        targetHandle: "l-in",
        animated: isStep3,
        style: { 
          stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep3 ? 2 : 1 
        },
      },
      {
        id: "e-coder-supervisor",
        source: "coder",
        target: "supervisor",
        sourceHandle: "l-out",
        targetHandle: "b-in",
        animated: isStep3,
        style: { 
          stroke: isStep3 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep3 ? 2 : 1 
        },
      },
      {
        id: "e-supervisor-gateway",
        source: "supervisor",
        target: "gateway",
        sourceHandle: "r-out",
        targetHandle: "l-in",
        animated: isStep4,
        style: { 
          stroke: isStep4 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep4 ? 2 : 1 
        },
      },
      {
        id: "e-gateway-backend",
        source: "gateway",
        target: "backend",
        sourceHandle: "l-out",
        targetHandle: "t-in",
        animated: isStep5,
        style: { 
          stroke: isStep5 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep5 ? 2 : 1 
        },
      },
      {
        id: "e-backend-frontend",
        source: "backend",
        target: "frontend",
        sourceHandle: "l-out",
        targetHandle: "r-in",
        animated: isStep5,
        style: { 
          stroke: isStep5 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep5 ? 2 : 1 
        },
      },
      {
        id: "e-frontend-user",
        source: "frontend",
        target: "user",
        sourceHandle: "l-out",
        targetHandle: "r-in",
        animated: isStep5,
        style: { 
          stroke: isStep5 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep5 ? 2 : 1 
        },
      },
      {
        id: "e-supervisor-otel",
        source: "supervisor",
        target: "otel",
        sourceHandle: "r-out",
        targetHandle: "l-in",
        animated: isStep6,
        style: { 
          stroke: isStep6 ? "var(--amber)" : "var(--flow-edge-inactive)",
          strokeWidth: isStep6 ? 2 : 1 
        },
      },
    ];
  }, [isMobile, step]);

  return (
    <div 
      className={cn(
        "flex min-w-0 flex-col overflow-hidden bg-zinc-50/90 dark:bg-zinc-950/80 text-zinc-800 dark:text-zinc-300 font-mono text-[11px] leading-relaxed backdrop-blur-md transition-all duration-300",
        isFullscreen 
          ? "fixed inset-0 z-[100] h-screen w-screen rounded-none border-0" 
          : "relative rounded-lg border border-zinc-200 dark:border-zinc-800/80 shadow-2xl"
      )}
      role="region"
      aria-label="Interactive AI Systems Console"
    >
      {/* Desktop Mode (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col flex-1 min-h-0">
        {/* OS Chrome Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-900/60 px-4 py-2.5">
          {/* Traffic Lights & Filename */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 group/lights" role="group" aria-label="Window controls">
              <button
                onClick={() => isFullscreen && setIsFullscreen(false)}
                className={cn(
                  "size-2.5 rounded-full bg-rose-500/90 transition-all focus:outline-none flex items-center justify-center text-[7px] text-rose-955 font-bold select-none",
                  isFullscreen ? "cursor-pointer hover:bg-rose-600" : "cursor-default opacity-50"
                )}
                aria-label="Close window (exit fullscreen)"
                disabled={!isFullscreen}
              >
                <span className="opacity-0 group-hover/lights:opacity-100 transition-opacity leading-none mt-[-1px]">×</span>
              </button>
              <button
                onClick={() => isFullscreen && setIsFullscreen(false)}
                className={cn(
                  "size-2.5 rounded-full bg-amber/90 transition-all focus:outline-none flex items-center justify-center text-[7px] text-amber-955 font-bold select-none",
                  isFullscreen ? "cursor-pointer hover:bg-amber-600" : "cursor-default opacity-50"
                )}
                aria-label="Minimize window (exit fullscreen)"
                disabled={!isFullscreen}
              >
                <span className="opacity-0 group-hover/lights:opacity-100 transition-opacity leading-none mt-[-2px]">−</span>
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="size-2.5 rounded-full bg-emerald-500/90 hover:bg-emerald-600 transition-all cursor-pointer focus:outline-none flex items-center justify-center text-[5px] text-emerald-955 font-extrabold select-none"
                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <span className="opacity-0 group-hover/lights:opacity-100 transition-opacity leading-none mt-[-1px]">+</span>
              </button>
            </div>
            <span className="text-[10px] tracking-wide text-zinc-500 dark:text-zinc-500 font-bold">
              {activeTab === "topology" && "system_design_topology.canvas"}
              {activeTab === "code" && "enterprise_orchestrator.py"}
              {activeTab === "telemetry" && "opentelemetry_observability.dashboard"}
            </span>
          </div>

          {/* Tab Selectors & Actions */}
          <div className="flex items-center gap-2">
            {/* Tab buttons */}
            <div className="flex items-center gap-1 bg-zinc-200/50 dark:bg-zinc-950/60 p-0.5 rounded-md border border-zinc-200 dark:border-zinc-800/40" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === "topology"}
                onClick={() => setActiveTab("topology")}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase transition-all rounded-sm cursor-pointer",
                  activeTab === "topology"
                    ? "bg-white dark:bg-zinc-800 text-amber font-semibold shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                <Network className="size-3" />
                Topology
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "code"}
                onClick={() => setActiveTab("code")}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase transition-all rounded-sm cursor-pointer",
                  activeTab === "code"
                    ? "bg-white dark:bg-zinc-800 text-amber font-semibold shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                <Code2 className="size-3" />
                Code
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "telemetry"}
                onClick={() => setActiveTab("telemetry")}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase transition-all rounded-sm cursor-pointer",
                  activeTab === "telemetry"
                    ? "bg-white dark:bg-zinc-800 text-amber font-semibold shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                <Terminal className="size-3" />
                Observability
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium tracking-wide uppercase text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-800/40 transition-colors cursor-pointer"
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
              {isFullscreen ? "Exit" : "Fullscreen"}
            </button>
          </div>
        </div>

        {/* Console Display Screen */}
        <div className={cn(
          "relative overflow-hidden p-5 text-zinc-800 dark:text-zinc-300 flex flex-col",
          isFullscreen ? "flex-1 min-h-0 h-[calc(100vh-80px)]" : "h-[430px]"
        )}>
          
          {/* TAB 1: Live Interactive Topology Diagram with React Flow */}
          {activeTab === "topology" && (
            <div className="h-full flex flex-col justify-between flex-1 min-h-0">
              {/* React Flow Container */}
              <div className="flex-1 w-full min-h-0 border border-zinc-200 dark:border-zinc-800/40 rounded bg-zinc-100/10 dark:bg-zinc-950/30 overflow-hidden relative">
                <ReactFlowProvider>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    className="systems-console-flow"
                    proOptions={{ hideAttribution: true }}
                    {...flowProps}
                  >
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="var(--flow-dots)" />
                    <Controls showInteractive={false} position="bottom-right" className="!bg-white dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-800/60 !m-2" />
                  </ReactFlow>
                  <FlowResizer isFullscreen={isFullscreen} isMobile={isMobile} activeTab={activeTab} />
                </ReactFlowProvider>
              </div>

              {/* Description note */}
              <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800/40 mt-3 pt-3 text-[10px] text-zinc-500 dark:text-zinc-500 font-sans shrink-0">
                <span className="flex items-center gap-1">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/70 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-amber" />
                  </span>
                  Active loop simulation step: {step}/6 {isMobile && "(mobile stack)"}
                </span>
                <span className="font-mono text-[9px] uppercase text-amber-700 dark:text-amber">System Topology</span>
              </div>
            </div>
          )}

          {/* TAB 2: Dynamic Highlight Code block */}
          {activeTab === "code" && (
            <div className="h-full flex flex-col justify-between flex-1 min-h-0">
              {/* Streamdown syntax highlighted code block */}
              <div className={cn(
                "overflow-auto streamdown-code-clean [&_[data-streamdown='code-block']]:border-0 [&_[data-streamdown='code-block']]:bg-transparent [&_[data-streamdown='code-block']]:p-0 [&_[data-streamdown='code-block']]:m-0 [&_[data-streamdown='code-block-body']]:border-0 [&_[data-streamdown='code-block-body']]:bg-transparent [&_[data-streamdown='code-block-body']]:p-0 [&_[data-streamdown='code-block-header']]:hidden",
                isFullscreen ? "max-h-[calc(100vh-180px)] flex-1" : "max-h-[350px] flex-1"
              )}>
                <Streamdown 
                  plugins={{ code }} 
                  shikiTheme={["github-light", "dracula"]}
                  controls={false}
                >
                  {LANGGRAPH_HERO_CODE}
                </Streamdown>
              </div>

              {/* Description note */}
              <div className="border-t border-zinc-200 dark:border-zinc-800/40 pt-3 text-[10px] text-zinc-500 font-sans flex justify-between items-center shrink-0">
                <span>Stateful cyclic routing logic using Python StateGraph nodes.</span>
                <span className="font-mono text-[9px] uppercase text-amber-700 dark:text-amber">Shiki Highlighting</span>
              </div>
            </div>
          )}

          {/* TAB 3: AI Observability (Grafana / OpenTelemetry style Dashboard) */}
          {activeTab === "telemetry" && (
            <div className="h-full flex flex-col justify-between flex-1 min-h-0">
              <div className="flex-1 flex flex-col gap-4 overflow-auto min-h-0">
                
                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 shrink-0">
                  
                  {/* Metric 1 */}
                  <div className="border border-zinc-200 dark:border-zinc-800/50 bg-zinc-100/40 dark:bg-zinc-950/40 p-3 rounded text-left">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Gauge className="size-3 text-amber-700 dark:text-amber" />
                      <span className="text-[9px] uppercase tracking-wide">Avg Latency</span>
                    </div>
                    <div className="mt-1.5 text-base font-bold text-zinc-900 dark:text-zinc-100">184ms</div>
                    <div className="mt-1 w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded overflow-hidden">
                      <div className="bg-amber h-full w-[65%]" />
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="border border-zinc-200 dark:border-zinc-800/50 bg-zinc-100/40 dark:bg-zinc-950/40 p-3 rounded text-left">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Layers className="size-3 text-amber-700 dark:text-amber" />
                      <span className="text-[9px] uppercase tracking-wide">Cache Ratio</span>
                    </div>
                    <div className="mt-1.5 text-base font-bold text-zinc-900 dark:text-zinc-100">94.2%</div>
                    <div className="mt-1 w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[94.2%]" />
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="border border-zinc-200 dark:border-zinc-800/50 bg-zinc-100/40 dark:bg-zinc-950/40 p-3 rounded text-left">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Coins className="size-3 text-amber-700 dark:text-amber" />
                      <span className="text-[9px] uppercase tracking-wide">Optimizations</span>
                    </div>
                    <div className="mt-1.5 text-base font-bold text-zinc-900 dark:text-zinc-100">4.2x Cost Red</div>
                    <div className="mt-1 w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded overflow-hidden">
                      <div className="bg-cyan-500 h-full w-[80%]" />
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="border border-zinc-200 dark:border-zinc-800/50 bg-zinc-100/40 dark:bg-zinc-950/40 p-3 rounded text-left">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <ShieldCheck className="size-3 text-amber-700 dark:text-amber" />
                      <span className="text-[9px] uppercase tracking-wide">Guardrails</span>
                    </div>
                    <div className="mt-1.5 text-base font-bold text-zinc-900 dark:text-zinc-100">0.98 Ground</div>
                    <div className="mt-1 w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[98%]" />
                    </div>
                  </div>

                </div>

                {/* System Trace Table */}
                <div className="flex-1 border border-zinc-200 dark:border-zinc-800/40 rounded bg-zinc-100/10 dark:bg-zinc-950/30 overflow-auto min-h-0">
                  <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800/50 bg-zinc-100/50 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-500 font-mono text-[9px]">
                        <th className="p-2">Timestamp</th>
                        <th className="p-2">Trace ID</th>
                        <th className="p-2">Component</th>
                        <th className="p-2">Execution Trace Details</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STABLE_TRACES.map((item, index) => {
                        const isCurrent = step === index;
                        return (
                          <tr 
                            key={index} 
                            className={cn(
                              "border-b border-zinc-200/60 dark:border-zinc-800/30 transition-all duration-300 text-[9px]",
                              isCurrent ? "bg-amber/5 text-zinc-900 dark:text-zinc-100 font-medium" : "hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20 text-zinc-600 dark:text-zinc-400"
                            )}
                          >
                            <td className="p-2 flex items-center gap-1.5 font-mono text-zinc-500 dark:text-zinc-400">
                              {isCurrent ? (
                                <span className="relative flex size-1.5">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/70 opacity-75" />
                                  <span className="relative inline-flex size-1.5 rounded-full bg-amber" />
                                </span>
                              ) : (
                                <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                              )}
                              {item.time}
                            </td>
                            <td className={cn("p-2 font-mono", isCurrent ? "text-amber-700 dark:text-amber font-semibold" : "text-zinc-500 dark:text-zinc-500")}>
                              {item.trace}
                            </td>
                            <td className={cn("p-2 font-mono", isCurrent ? "text-zinc-900 dark:text-zinc-100 font-semibold" : "text-zinc-600 dark:text-zinc-400")}>
                              {item.component}
                            </td>
                            <td className="p-2">{item.event}</td>
                            <td className="p-2">
                              <span className={cn(
                                "px-1 py-0.5 rounded border font-bold text-[8px]",
                                isCurrent 
                                  ? "bg-amber-50 dark:bg-amber/10 border-amber-200 dark:border-amber/30 text-amber-700 dark:text-amber"
                                  : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-250 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                              )}>
                                {isCurrent ? "ACTIVE" : item.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Simulated Live telemetry marker */}
              <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800/40 pt-3 text-[10px] text-zinc-500 dark:text-zinc-500 font-sans shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Active telemetry session synced via OpenTelemetry backend.
                </span>
                <span className="font-mono text-[9px] uppercase text-amber-700 dark:text-amber">OTEL Trace API</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Mode (Hidden on Desktop) */}
      <div className="flex md:hidden flex-col">
        {/* OS Chrome Header */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-900/60 px-4 py-2.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" role="group" aria-label="Window controls">
              <span className="size-2 rounded-full bg-rose-500/50" />
              <span className="size-2 rounded-full bg-amber/50" />
              <span className="size-2 rounded-full bg-emerald-500/50" />
            </div>
            <span className="text-[10px] tracking-wide text-zinc-500 dark:text-zinc-500 font-bold">
              systems_console.sh
            </span>
          </div>
          <span className="text-[9px] uppercase text-amber-700 dark:text-amber tracking-widest font-bold">LOCKED</span>
        </div>

        {/* Console display message */}
        <div className="flex flex-col justify-between p-5 h-[320px] text-zinc-650 dark:text-zinc-400 font-mono text-[10px] sm:text-[11px] leading-relaxed bg-zinc-100/90 dark:bg-zinc-950/90 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-zinc-500">
              <span className="size-1.5 rounded-full bg-amber-600 dark:bg-amber animate-pulse" />
              <span>terminal_session_01</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-zinc-500">$ ./init_systems_console.sh</p>
              <p className="text-amber-700 dark:text-amber font-semibold">[WARN] Screen width limits exceeded.</p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-normal text-[10px] sm:text-[11px]">
                The interactive LangGraph orchestrator map and telemetry trace dashboard require a minimum viewport of 768px for readable diagram rendering.
              </p>
              <p className="text-zinc-500 font-light text-[9px] sm:text-[10px]">
                [!] Please visit this platform on a desktop device for the full interactive experience.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800/30">
            <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Quick links:</p>
            <div className="flex flex-col gap-2">
              <Button asChild size="sm" className="h-8 w-full bg-amber text-amber-foreground hover:bg-amber/90 text-xs font-semibold">
                <Link href="/advisory-intake">
                  <Calendar className="size-3 mr-1" />
                  Start Advisory Intake
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-8 w-full text-xs text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold">
                <Link href="/engineering">
                  View Decision Map
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
