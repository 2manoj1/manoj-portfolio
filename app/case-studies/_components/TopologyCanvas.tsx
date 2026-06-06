"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import {
  Background,
  BackgroundVariant,
  BaseEdge,
  ControlButton,
  Controls,
  EdgeLabelRenderer,
  Handle,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  getSmoothStepPath,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type EdgeProps,
  type EdgeTypes,
  type Node,
  type NodeMouseHandler,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import { Maximize2, Pause, Play, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CaseStudy,
  TopologyConnection,
  TopologyNode,
} from "../_data/case-studies";
import { getLayoutedElements, NODE_WIDTH } from "../_lib/elk-layout";
import type { SimMode } from "./SimulationDeck";
import { useHydratedThemeMode } from "@/hooks/use-hydrated-theme-mode";

const FIT_VIEW_DURATION = 420;
const INLINE_FIT_PADDING = 0.08;
const FULLSCREEN_FIT_PADDING = 0.1;

type ArchitectureNodeData = {
  kind: "architecture";
  label: string;
  description: string;
  detail: string;
  zoneId: string;
  zoneLabel: string;
  icon: TopologyNode["icon"];
  isActive: boolean;
  isTraced: boolean;
  simMode?: SimMode;
};

type ZoneNodeData = {
  kind: "zone";
  label: string;
  summary: string;
};

type TelemetryEdgeData = {
  label: string;
  isActive: boolean;
  isTraced: boolean;
  simMode?: SimMode;
  simLabel?: string;
};

type ArchitectureFlowNode =
  | Node<ArchitectureNodeData, "architecture">
  | Node<ZoneNodeData, "zone">;

type ArchitectureFlowEdge = Edge<TelemetryEdgeData, "telemetry">;

const SIMULATION_CONFIGS = {
  "production-grade-ai-home-lab": {
    latencyNodeId: "fastapi",
    latencyEdgeId: "production-grade-ai-home-lab-cloudflare-fastapi",
    latencyLabel: "3.4s Latency Spike",
    failureNodeId: "ollama",
    failureEdgeId: "production-grade-ai-home-lab-python-graph-ollama",
    failureLabel: "CRITICAL: Ollama Offline",
  },
  "enterprise-agentic-rag-platform": {
    latencyNodeId: "planner",
    latencyEdgeId: "enterprise-agentic-rag-platform-parser-planner",
    latencyLabel: "5.2s Latency Spike",
    failureNodeId: "eval",
    failureEdgeId: "enterprise-agentic-rag-platform-pgvector-eval",
    failureLabel: "CRITICAL: Grounding Rejected",
  },
  "gpu-ai-platform-modernization": {
    latencyNodeId: "runai",
    latencyEdgeId: "gpu-ai-platform-modernization-ingress-runai",
    latencyLabel: "Congested Queue",
    failureNodeId: "vllm",
    failureEdgeId: "gpu-ai-platform-modernization-slices-vllm",
    failureLabel: "CRITICAL: CUDA OOM",
  },
  "ai-architecture-enablement": {
    latencyNodeId: "mcp-host",
    latencyEdgeId: "ai-architecture-enablement-admin-ui-mcp-host",
    latencyLabel: "Negotiation Delay",
    failureNodeId: "api-tool",
    failureEdgeId: "ai-architecture-enablement-mcp-host-api-tool",
    failureLabel: "CRITICAL: Access Denied",
  },
};

type TopologyCanvasProps = {
  study: CaseStudy;
  activeNodeId: string | null;
  onActiveNodeChange: (nodeId: string | null) => void;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
  simMode?: SimMode;
};

const portPositions = [
  { side: "top", position: Position.Top },
  { side: "right", position: Position.Right },
  { side: "bottom", position: Position.Bottom },
  { side: "left", position: Position.Left },
] as const;

function buildFlowNodes(study: CaseStudy): ArchitectureFlowNode[] {
  const zoneLabels = new Map(study.zones.map((zone) => [zone.id, zone.label]));

  const zoneNodes: ArchitectureFlowNode[] = study.zones.map((zone) => ({
    id: `zone-${zone.id}`,
    type: "zone",
    position: { x: zone.x, y: zone.y },
    data: {
      kind: "zone",
      label: zone.label,
      summary: zone.summary,
    },
    draggable: true,
    selectable: true,
    connectable: false,
    deletable: false,
    focusable: true,
    style: {
      width: zone.width,
      height: zone.height,
    },
  }));

  const architectureNodes: ArchitectureFlowNode[] = study.nodes.map((node) => ({
    id: node.id,
    type: "architecture",
    parentId: `zone-${node.zoneId}`,
    position: { x: 0, y: 0 },
    data: {
      kind: "architecture",
      label: node.label,
      description: node.description,
      detail: node.detail,
      zoneId: node.zoneId,
      zoneLabel: zoneLabels.get(node.zoneId) ?? node.zoneId,
      icon: node.icon,
      isActive: false,
      isTraced: false,
    },
    draggable: true,
    selectable: true,
    connectable: false,
    deletable: false,
    extent: "parent",
    style: {
      width: NODE_WIDTH,
    },
  }));

  return [...zoneNodes, ...architectureNodes];
}

function buildFlowEdges(study: CaseStudy): ArchitectureFlowEdge[] {
  return study.connections.map((connection) => ({
    id: `${study.slug}-${connection.from}-${connection.to}`,
    type: "telemetry",
    source: connection.from,
    target: connection.to,
    selectable: true,
    deletable: false,
    animated: false,
    data: {
      label: connection.label,
      isActive: false,
      isTraced: false,
    },
  }));
}

function getTraceConnection(
  connections: readonly TopologyConnection[],
  traceIndex: number,
  activeNodeId: string | null,
  isTraceRunning: boolean,
) {
  if (activeNodeId || !isTraceRunning || connections.length === 0) {
    return null;
  }

  return connections[traceIndex % connections.length];
}

function ZoneBoundaryNode({ data }: NodeProps) {
  const zone = data as ZoneNodeData;

  return (
    <section
      role="region"
      aria-label={`${zone.label} network zone`}
      className="h-full w-full rounded-xl border border-dashed border-zinc-300 dark:border-white/[0.24] bg-zinc-100/30 dark:bg-white/[0.04] shadow-[inset_0_0_44px_rgba(255,255,255,0.015)] dark:shadow-[inset_0_0_44px_rgba(255,255,255,0.035)] transition-colors hover:border-amber/40 hover:bg-zinc-100/50 dark:hover:bg-white/[0.05]"
    >
      <div className="border-b border-zinc-200 dark:border-white/[0.13] px-3 py-2">
        <p className="break-words font-mono text-[11px] font-semibold uppercase tracking-wide text-amber">
          {zone.label}
        </p>
        <p className="mt-1 max-w-[28ch] break-words text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          {zone.summary}
        </p>
      </div>
    </section>
  );
}

function ArchitectureNodeCard({ data, selected }: NodeProps) {
  const node = data as ArchitectureNodeData;
  const Icon = node.icon;

  const simMode = node.simMode;
  const isLatency = simMode === "LATENCY";
  const isFailure = simMode === "FAILURE";
  
  const isActive = selected || node.isActive || node.isTraced || isLatency || isFailure;

  return (
    <div
      className={cn(
        "architecture-node relative w-full h-full rounded-lg border p-3.5 text-left shadow-2xl backdrop-blur transition-all duration-200",
        isFailure
          ? "border-rose-500 bg-rose-500/10 dark:bg-rose-950/15 shadow-[0_0_34px_rgba(244,63,94,0.2)] dark:shadow-[0_0_34px_rgba(244,63,94,0.3)] animate-pulse"
          : isLatency
            ? "border-amber bg-amber-500/10 dark:bg-amber-950/15 shadow-[0_0_34px_rgba(245,158,11,0.2)] dark:shadow-[0_0_34px_rgba(245,158,11,0.3)] animate-pulse"
            : isActive
              ? "border-amber/85 bg-white dark:bg-zinc-900 shadow-[0_0_34px_rgba(245,158,11,0.18)] dark:shadow-[0_0_34px_rgba(245,158,11,0.26)]"
              : "border-zinc-300 bg-white dark:border-white/[0.24] dark:bg-zinc-900/96 shadow-zinc-200/50 dark:shadow-black/45 hover:border-zinc-400 hover:bg-zinc-50 dark:hover:border-white/[0.36] dark:hover:bg-zinc-900",
      )}
    >
      {portPositions.map(({ side, position }) => (
        <span key={side} aria-hidden="true">
          <Handle
            id={`source-${side}`}
            type="source"
            position={position}
            className="architecture-port"
          />
          <Handle
            id={`target-${side}`}
            type="target"
            position={position}
            className="architecture-port"
          />
        </span>
      ))}

      <div className="flex min-w-0 items-start gap-2.5">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors",
            isFailure
              ? "border-rose-500/55 bg-rose-500/12 text-rose-500 dark:text-rose-400"
              : isLatency
                ? "border-amber/55 bg-amber/[0.12] text-amber"
                : isActive
                  ? "border-amber/55 bg-amber/[0.12] text-amber"
                  : "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-white/[0.16] dark:bg-white/[0.06] dark:text-zinc-200",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="break-words text-[13px] font-semibold leading-5 text-zinc-900 dark:text-white">
            {node.label}
          </p>
          <p className="mt-1 break-words text-[12px] leading-relaxed text-zinc-700 dark:text-zinc-200">
            {node.description}
          </p>
        </div>
      </div>

      <p className="mt-2 break-words font-mono text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
        {node.detail}
      </p>
      <p className="mt-2 break-words font-mono text-[10px] uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
        {node.zoneLabel}
      </p>
    </div>
  );
}

function TelemetryEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const edgeData = data as TelemetryEdgeData | undefined;
  const themeMode = useHydratedThemeMode();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 18,
  });

  const simMode = edgeData?.simMode;
  const isLatency = simMode === "LATENCY";
  const isFailure = simMode === "FAILURE";

  const isActive = selected || edgeData?.isActive || edgeData?.isTraced || isLatency || isFailure;
  const isLight = themeMode === "light";

  const strokeColor = isFailure
    ? "rgba(244,63,94,0.95)"
    : isLatency
      ? "rgba(245,158,11,0.95)"
      : isActive
        ? "rgba(245,158,11,0.95)"
        : (isLight ? "rgba(82,82,91,0.55)" : "rgba(228,228,231,0.28)");

  const strokeWidth = isActive ? 2.4 : 1.35;
  const filter = isFailure
    ? "drop-shadow(0 0 10px rgba(244,63,94,0.4))"
    : isLatency
      ? "drop-shadow(0 0 10px rgba(245,158,11,0.4))"
      : isActive
        ? "drop-shadow(0 0 10px rgba(245,158,11,0.3))"
        : undefined;

  const labelText = edgeData?.simLabel || edgeData?.label;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        interactionWidth={24}
        style={{
          stroke: strokeColor,
          strokeWidth,
          filter,
        }}
      />
      {isActive ? (
        <BaseEdge
          id={`${id}-pulse`}
          path={edgePath}
          interactionWidth={0}
          className={cn(
            "architecture-flow__edge-pulse",
            isFailure && "stroke-rose-500",
            isLatency && "stroke-amber"
          )}
          style={{
            stroke: isFailure ? "rgba(244,63,94,0.85)" : "rgba(245,158,11,0.85)",
            strokeWidth: 3,
          }}
        />
      ) : null}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          className={cn(
            "nodrag nopan rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-wide shadow-lg backdrop-blur",
            isFailure
              ? "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:bg-zinc-950/95 dark:text-rose-400"
              : isLatency
                ? "border-amber/55 bg-amber-500/10 text-amber dark:bg-zinc-950/95"
                : isActive
                  ? "border-amber/55 bg-amber-500/10 text-amber dark:bg-zinc-950/95"
                  : "border-zinc-200 bg-white/95 text-zinc-600 dark:border-white/[0.16] dark:bg-zinc-950/92 dark:text-zinc-300",
          )}
        >
          {labelText}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes: NodeTypes = {
  architecture: ArchitectureNodeCard,
  zone: ZoneBoundaryNode,
};

const edgeTypes: EdgeTypes = {
  telemetry: TelemetryEdge,
};

function TopologyCanvasInner({
  study,
  activeNodeId,
  onActiveNodeChange,
  onFullscreen,
  isFullscreen = false,
  simMode = "HEALTHY",
}: TopologyCanvasProps) {
  const prefersReducedMotion = useReducedMotion();
  const themeMode = useHydratedThemeMode();
  const reactFlow = useReactFlow<ArchitectureFlowNode, ArchitectureFlowEdge>();
  const [nodes, setNodes, onNodesChange] = useNodesState<ArchitectureFlowNode>(
    buildFlowNodes(study),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<ArchitectureFlowEdge>(
    buildFlowEdges(study),
  );
  const [traceIndex, setTraceIndex] = useState(0);
  const [isTraceRunning, setIsTraceRunning] = useState(true);
  const isMobile = useMediaQuery("(max-width: 767px)", {
    initializeWithValue: false,
  });

  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1279px)", {
    initializeWithValue: false,
  });

  const nodeLabelById = useMemo(
    () => new Map(study.nodes.map((node) => [node.id, node.label])),
    [study.nodes],
  );
  const traceConnection = getTraceConnection(
    study.connections,
    traceIndex,
    activeNodeId,
    isTraceRunning,
  );
  const liveTraceLabel = traceConnection
    ? `${traceConnection.label}: ${nodeLabelById.get(traceConnection.from) ?? traceConnection.from} -> ${nodeLabelById.get(traceConnection.to) ?? traceConnection.to}`
    : activeNodeId
      ? `Inspecting ${nodeLabelById.get(activeNodeId) ?? activeNodeId}`
      : "Trace ready";

  useEffect(() => {
    const trace = getTraceConnection(
      study.connections,
      traceIndex,
      activeNodeId,
      isTraceRunning,
    );
    const tracedNodeIds = trace
      ? new Set([trace.from, trace.to])
      : new Set<string>();

    const simConfig = SIMULATION_CONFIGS[study.slug as keyof typeof SIMULATION_CONFIGS];

    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.type !== "architecture") {
          return node;
        }

        const isSimActiveNode =
          (simMode === "LATENCY" && node.id === simConfig?.latencyNodeId) ||
          (simMode === "FAILURE" && node.id === simConfig?.failureNodeId);

        return {
          ...node,
          data: {
            ...(node.data as ArchitectureNodeData),
            isActive: node.id === activeNodeId,
            isTraced: tracedNodeIds.has(node.id),
            simMode: isSimActiveNode ? simMode : undefined,
          },
        };
      }),
    );

    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        const isSimActiveEdge =
          (simMode === "LATENCY" && edge.id === simConfig?.latencyEdgeId) ||
          (simMode === "FAILURE" && edge.id === simConfig?.failureEdgeId);

        const isActive =
          isSimActiveEdge ||
          (activeNodeId
            ? edge.source === activeNodeId || edge.target === activeNodeId
            : Boolean(
                trace && edge.source === trace.from && edge.target === trace.to,
              ));

        return {
          ...edge,
          animated: isActive && !prefersReducedMotion,
          data: {
            ...(edge.data as TelemetryEdgeData),
            isActive,
            isTraced:
              !activeNodeId &&
              Boolean(
                trace && edge.source === trace.from && edge.target === trace.to,
              ),
            simMode: isSimActiveEdge ? simMode : undefined,
            simLabel: isSimActiveEdge
              ? (simMode === "LATENCY" ? simConfig?.latencyLabel : simConfig?.failureLabel)
              : undefined,
          },
        };
      }),
    );
  }, [
    activeNodeId,
    isTraceRunning,
    prefersReducedMotion,
    setEdges,
    setNodes,
    study.connections,
    study.slug,
    traceIndex,
    simMode,
  ]);

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !isTraceRunning ||
      activeNodeId ||
      study.connections.length <= 1
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setTraceIndex((current) => (current + 1) % study.connections.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [
    activeNodeId,
    isTraceRunning,
    prefersReducedMotion,
    study.connections.length,
  ]);

  useEffect(() => {
    async function applyLayout() {
      const baseNodes = buildFlowNodes(study);
      const baseEdges = buildFlowEdges(study);

      const isDown = isMobile || isTablet;
      const layoutedNodes = await getLayoutedElements(
        baseNodes,
        isDown ? "DOWN" : "RIGHT",
      );

      // Compute optimal connection ports dynamically based on relative positions
      const layoutedEdges = baseEdges.map((edge) => {
        const sourceNode = layoutedNodes.find((n) => n.id === edge.source);
        const targetNode = layoutedNodes.find((n) => n.id === edge.target);

        if (!sourceNode || !targetNode) return edge;

        const sourceParent = layoutedNodes.find((n) => n.id === sourceNode.parentId);
        const targetParent = layoutedNodes.find((n) => n.id === targetNode.parentId);

        const sX = (sourceParent?.position?.x ?? 0) + sourceNode.position.x;
        const sY = (sourceParent?.position?.y ?? 0) + sourceNode.position.y;
        const tX = (targetParent?.position?.x ?? 0) + targetNode.position.x;
        const tY = (targetParent?.position?.y ?? 0) + targetNode.position.y;

        const dx = tX - sX;
        const dy = tY - sY;

        let sourceHandle = "source-bottom";
        let targetHandle = "target-top";

        if (!isDown) {
          // Horizontal flow
          if (Math.abs(dx) > 120) {
            if (dx > 0) {
              sourceHandle = "source-right";
              targetHandle = "target-left";
            } else {
              sourceHandle = "source-left";
              targetHandle = "target-right";
            }
          } else {
            if (dy > 0) {
              sourceHandle = "source-bottom";
              targetHandle = "target-top";
            } else {
              sourceHandle = "source-top";
              targetHandle = "target-bottom";
            }
          }
        } else {
          // Vertical flow
          if (Math.abs(dy) > 120) {
            if (dy > 0) {
              sourceHandle = "source-bottom";
              targetHandle = "target-top";
            } else {
              sourceHandle = "source-top";
              targetHandle = "target-bottom";
            }
          } else {
            if (dx > 0) {
              sourceHandle = "source-right";
              targetHandle = "target-left";
            } else {
              sourceHandle = "source-left";
              targetHandle = "target-right";
            }
          }
        }

        return {
          ...edge,
          sourceHandle,
          targetHandle,
        };
      });

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);

      requestAnimationFrame(() => {
        reactFlow.fitView({
          padding: isMobile ? 0.35 : 0.15,
          duration: 500,
        });
      });
    }

    applyLayout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [study.slug, isMobile, isTablet]);

  const handleNodeClick: NodeMouseHandler<ArchitectureFlowNode> = useCallback(
    (_event, node) => {
      if (node.type === "architecture") {
        onActiveNodeChange(activeNodeId === node.id ? null : node.id);
      }
    },
    [activeNodeId, onActiveNodeChange],
  );

  const handleNodeMouseEnter: NodeMouseHandler<ArchitectureFlowNode> =
    useCallback(
      (_event, node) => {
        if (node.type === "architecture") {
          onActiveNodeChange(node.id);
        }
      },
      [onActiveNodeChange],
    );

  const handleNodeMouseLeave: NodeMouseHandler<ArchitectureFlowNode> =
    useCallback(
      (_event, node) => {
        if (node.type === "architecture") {
          onActiveNodeChange(null);
        }
      },
      [onActiveNodeChange],
    );

  return (
    <motion.div
      role="region"
      aria-label={`${study.title} architecture topology`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "architecture-flow relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-white/[0.1] dark:bg-zinc-950/92 focus-within:ring-2 focus-within:ring-amber/70",
        isFullscreen
          ? "h-full min-h-[520px]"
          : "h-[520px] sm:h-[680px] xl:h-[760px]",
      )}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onPaneClick={() => onActiveNodeChange(null)}
        fitView
        fitViewOptions={{
          padding: isFullscreen ? FULLSCREEN_FIT_PADDING : INLINE_FIT_PADDING,
          duration: prefersReducedMotion ? 0 : FIT_VIEW_DURATION,
        }}
        minZoom={0.15}
        maxZoom={2}
        snapToGrid
        snapGrid={[16, 16]}
        colorMode={themeMode}
        nodesConnectable={false}
        edgesReconnectable={false}
        deleteKeyCode={null}
        multiSelectionKeyCode={null}
        selectionKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={28}
          color={themeMode === "light" ? "rgba(0,0,0,0.022)" : "rgba(255,255,255,0.055)"}
        />
        <Background
          id="architecture-flow-cross"
          variant={BackgroundVariant.Cross}
          gap={112}
          size={2}
          color={themeMode === "light" ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.16)"}
        />

        <Panel
          position="top-left"
          className="max-w-[44ch] rounded-lg border border-zinc-200 bg-white/95 dark:border-white/[0.12] dark:bg-black/78 px-3 py-2 shadow-2xl backdrop-blur"
        >
          <div className="flex items-center gap-2">
            <ScanLine className="size-3.5 text-amber" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
              Live Trace
            </p>
          </div>
          <p className="mt-1 break-words text-xs leading-5 text-zinc-600 dark:text-zinc-400">
            {liveTraceLabel}
          </p>
        </Panel>

        <Panel
          position="bottom-left"
          className="rounded-md border border-zinc-200 bg-white/95 dark:border-white/[0.1] dark:bg-black/72 px-2.5 py-1.5 shadow-xl backdrop-blur"
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-1.5 rounded-full",
                isTraceRunning ? "bg-emerald-400" : "bg-zinc-400 dark:bg-zinc-600",
              )}
              aria-hidden="true"
            />
            <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
              {isTraceRunning ? "Telemetry streaming" : "Trace paused"}
            </p>
          </div>
        </Panel>

        {!isMobile && (
          <Controls
            position="top-right"
            showInteractive={false}
            fitViewOptions={{
              padding: isFullscreen
                ? FULLSCREEN_FIT_PADDING
                : INLINE_FIT_PADDING,
              duration: prefersReducedMotion ? 0 : FIT_VIEW_DURATION,
            }}
          >
            <ControlButton
              type="button"
              onClick={() => setIsTraceRunning((current) => !current)}
              aria-label={
                isTraceRunning
                  ? "Pause telemetry trace"
                  : "Play telemetry trace"
              }
              title={
                isTraceRunning
                  ? "Pause telemetry trace"
                  : "Play telemetry trace"
              }
            >
              {isTraceRunning ? (
                <Pause className="size-4" aria-hidden="true" />
              ) : (
                <Play className="size-4" aria-hidden="true" />
              )}
            </ControlButton>
            {onFullscreen && !isFullscreen ? (
              <ControlButton
                type="button"
                onClick={onFullscreen}
                aria-label="Open topology fullscreen"
                title="Open fullscreen"
              >
                <Maximize2 className="size-4" aria-hidden="true" />
              </ControlButton>
            ) : null}
          </Controls>
        )}

        {!isMobile && (
          <MiniMap
            position="bottom-right"
            pannable
            zoomable
            nodeBorderRadius={8}
            nodeStrokeWidth={2}
            maskColor="rgba(0,0,0,0.58)"
            nodeColor={(node) =>
              node.type === "zone"
                ? (themeMode === "light" ? "rgba(244,244,245,0.8)" : "rgba(63,63,70,0.45)")
                : "rgba(245,158,11,0.72)"
            }
            nodeStrokeColor={(node) =>
              node.type === "zone"
                ? (themeMode === "light" ? "rgba(9,9,11,0.15)" : "rgba(255,255,255,0.16)")
                : "rgba(245,158,11,0.9)"
            }
          />
        )}
      </ReactFlow>
    </motion.div>
  );
}

export function TopologyCanvas(props: TopologyCanvasProps) {
  return (
    <ReactFlowProvider>
      <TopologyCanvasInner key={props.study.slug} {...props} />
    </ReactFlowProvider>
  );
}
