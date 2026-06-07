"use client";

import { memo, useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import {
  CheckCircle2,
  Database,
  GitBranch,
  RadioTower,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydratedThemeMode } from "@/hooks/use-hydrated-theme-mode";

export type BlogDiagramNode = {
  id?: string;
  label: string;
  role?: string;
  detail?: string;
  layer?: string;
  kind?: "client" | "runtime" | "data" | "approval" | "commit" | "default";
};

export type BlogDiagramEdge = {
  source?: string;
  target?: string;
  label?: string;
};

export type BlogDiagram = {
  title: string;
  summary?: string;
  nodes: readonly (string | BlogDiagramNode)[];
  edges?: readonly (string | BlogDiagramEdge)[];
};

type BlogFlowNodeData = {
  label: string;
  role: string;
  detail: string;
  layer: string;
  index: number;
  kind: NonNullable<BlogDiagramNode["kind"]>;
  active: boolean;
};

type BlogFlowNode = Node<BlogFlowNodeData, "blogArchitecture">;
type BlogFlowEdge = Edge<{ label: string; active: boolean }, "smoothstep">;

const kindIconMap = {
  client: RadioTower,
  runtime: Workflow,
  data: Database,
  approval: ShieldCheck,
  commit: CheckCircle2,
  default: GitBranch,
} as const;

function slugifyId(value: string, index: number) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || `node-${index}`;
}

function normalizeDiagramNode(node: string | BlogDiagramNode, index: number) {
  if (typeof node === "string") {
    return {
      id: slugifyId(node, index),
      label: node,
      role: "Architecture step",
      layer: `Step ${index + 1}`,
      kind: "default" as const,
      detail: "",
    };
  }

  return {
    id: node.id ?? slugifyId(node.label, index),
    label: node.label,
    role: node.role ?? "Architecture step",
    layer: node.layer ?? `Step ${index + 1}`,
    kind: node.kind ?? "default",
    detail: node.detail ?? "",
  };
}

function BlogArchitectureNode({ data, selected }: NodeProps) {
  const node = data as BlogFlowNodeData;
  const Icon = kindIconMap[node.kind] ?? kindIconMap.default;

  return (
    <div
      className={cn(
        "blog-architecture-node relative h-full w-full rounded-lg border p-2.5 text-left shadow-2xl backdrop-blur transition-colors sm:p-3",
        node.active || selected
          ? "border-amber/85 bg-white dark:bg-zinc-950/95 shadow-[0_0_28px_rgba(245,158,11,0.14)] dark:shadow-[0_0_28px_rgba(245,158,11,0.2)]"
          : "border-zinc-200 bg-white dark:border-white/[0.16] dark:bg-zinc-950/95 shadow-zinc-200/40 dark:shadow-black/40",
      )}
    >
      <Handle
        id="target-left"
        type="target"
        position={Position.Left}
        className="blog-architecture-port"
      />
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        className="blog-architecture-port"
      />
      <Handle
        id="target-top"
        type="target"
        position={Position.Top}
        className="blog-architecture-port"
      />
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        className="blog-architecture-port"
      />

      <div className="flex items-start gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-amber/25 bg-amber/10 text-amber">
          <Icon className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[9px] uppercase tracking-wide text-amber/80">
            {node.layer}
          </span>
          <span className="mt-1 block break-words text-[13px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100 sm:text-sm">
            {node.label}
          </span>
          <span className="mt-1 block break-words font-mono text-[9px] uppercase tracking-wide text-zinc-600 dark:text-zinc-400 sm:text-[10px]">
            {node.role}
          </span>
        </span>
      </div>
      <p className="mt-3 hidden text-xs leading-5 text-zinc-700 dark:text-zinc-400 sm:block">
        {node.detail}
      </p>
    </div>
  );
}

const MemoizedBlogArchitectureNode = memo(BlogArchitectureNode);
MemoizedBlogArchitectureNode.displayName = "BlogArchitectureNode";

const nodeTypes = {
  blogArchitecture: MemoizedBlogArchitectureNode,
} satisfies NodeTypes;

function FlowFitView({
  active,
  isMobile,
  nodeCount,
}: {
  active: boolean;
  isMobile: boolean;
  nodeCount: number;
}) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fitView({
        duration: 360,
        padding: isMobile ? 0.16 : 0.12,
      });
    }, 140);

    return () => window.clearTimeout(timer);
  }, [active, fitView, isMobile, nodeCount]);

  return null;
}

function useMobileDiagramLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function buildFlowElements(
  diagram: BlogDiagram,
  isMobile: boolean,
  active: boolean,
  isLight: boolean,
) {
  const normalizedNodes = diagram.nodes.map(normalizeDiagramNode);
  const nodeLookup = new Map(normalizedNodes.map((node) => [node.label, node.id]));
  const nodes: BlogFlowNode[] = normalizedNodes.map((node, index) => ({
    id: node.id,
    type: "blogArchitecture",
    position: isMobile
      ? { x: 18, y: index * 124 }
      : { x: index * 235, y: index % 2 === 0 ? 34 : 168 },
    data: {
      label: node.label,
      role: node.role,
      detail: node.detail,
      layer: node.layer,
      index,
      kind: node.kind,
      active,
    },
    draggable: false,
    selectable: true,
    connectable: false,
    deletable: false,
    focusable: true,
    style: {
      width: isMobile ? 204 : 218,
      height: isMobile ? 94 : 112,
    },
  }));

  const sourceHandle = isMobile ? "source-bottom" : "source-right";
  const targetHandle = isMobile ? "target-top" : "target-left";
  const getEdgeLabel = (label: string) => (isMobile ? undefined : label);

  const edges: BlogFlowEdge[] =
    diagram.edges?.map((edge, index) => {
      if (typeof edge === "string") {
        return {
          id: `edge-${index}`,
          type: "smoothstep",
          source: normalizedNodes[index]?.id ?? normalizedNodes[0]?.id,
          target: normalizedNodes[index + 1]?.id ?? normalizedNodes[index]?.id,
          sourceHandle,
          targetHandle,
          animated: active,
          data: { label: edge, active },
          label: getEdgeLabel(edge),
          labelStyle: { fill: isLight ? "rgb(82 82 91)" : "rgb(209 213 219)", fontSize: 9 },
          style: {
            stroke: active ? "rgb(245 158 11)" : (isLight ? "rgba(82,82,91,0.55)" : "rgba(161,161,170,0.44)"),
            strokeWidth: active ? 1.8 : 1.2,
          },
        };
      }

      const source = edge.source
        ? nodeLookup.get(edge.source) ?? edge.source
        : normalizedNodes[index]?.id;
      const target = edge.target
        ? nodeLookup.get(edge.target) ?? edge.target
        : normalizedNodes[index + 1]?.id;
      const label = edge.label ?? "";

      return {
        id: `edge-${source}-${target}-${index}`,
        type: "smoothstep",
        source,
        target,
        sourceHandle,
        targetHandle,
        animated: active,
        data: { label, active },
        label: getEdgeLabel(label),
        labelStyle: { fill: isLight ? "rgb(82 82 91)" : "rgb(209 213 219)", fontSize: 9 },
        style: {
          stroke: active ? "rgb(245 158 11)" : (isLight ? "rgba(82,82,91,0.55)" : "rgba(161,161,170,0.44)"),
          strokeWidth: active ? 1.8 : 1.2,
        },
      };
    }) ??
    normalizedNodes.slice(0, -1).map((node, index) => ({
      id: `edge-${node.id}-${normalizedNodes[index + 1].id}`,
      type: "smoothstep",
      source: node.id,
      target: normalizedNodes[index + 1].id,
      sourceHandle,
      targetHandle,
      animated: active,
      data: { label: "handoff", active },
      label: getEdgeLabel("handoff"),
      labelStyle: { fill: isLight ? "rgb(82 82 91)" : "rgb(209 213 219)", fontSize: 9 },
      style: {
        stroke: active ? "rgb(245 158 11)" : (isLight ? "rgba(82,82,91,0.55)" : "rgba(161,161,170,0.44)"),
        strokeWidth: active ? 1.8 : 1.2,
      },
    }));

  return { nodes, edges };
}

export function BlogArchitectureFlow({
  diagram,
  active = false,
}: {
  diagram: BlogDiagram;
  active?: boolean;
}) {
  const isMobile = useMobileDiagramLayout();
  const themeMode = useHydratedThemeMode();
  const isLight = themeMode === "light";

  const { nodes, edges } = useMemo(
    () => buildFlowElements(diagram, isMobile, active, isLight),
    [active, diagram, isMobile, isLight],
  );

  return (
    <figure className="mt-7 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-border dark:bg-zinc-950/70 shadow-2xl shadow-zinc-200/25 dark:shadow-black/20">
      <figcaption className="border-b border-zinc-100 dark:border-zinc-900 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-amber">
          {diagram.title}
        </p>
        {diagram.summary && (
          <p className="mt-1.5 text-xs leading-5 text-zinc-500 dark:text-muted-foreground">
            {diagram.summary}
          </p>
        )}
      </figcaption>

      <div className="blog-architecture-flow h-[380px] w-full min-[420px]:h-[430px] sm:h-[380px] lg:h-[350px]">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: isMobile ? 0.16 : 0.12 }}
            minZoom={0.4}
            maxZoom={1.35}
            nodesConnectable={false}
            nodesDraggable={false}
            elementsSelectable
            panOnDrag
            panOnScroll={false}
            preventScrolling={false}
            zoomOnDoubleClick={false}
            zoomOnPinch
            zoomOnScroll={false}
            colorMode={themeMode}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              color={isLight ? "rgba(113,113,122,0.22)" : "rgba(161,161,170,0.34)"}
            />
            <Controls
              showInteractive={false}
              position="bottom-right"
              className="!m-3"
            />
            <FlowFitView
              active={active}
              isMobile={isMobile}
              nodeCount={nodes.length}
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </figure>
  );
}
