"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  Eye,
  Play,
  RotateCcw,
  Wrench,
} from "lucide-react";
import {
  aiSignalNodes,
  humanSignalNodes,
  signalFlowSteps,
  type DiagramMode,
  type DiagramNode,
  type SignalEdge,
} from "./signalFlowData";

const STEP_INTERVAL_MS = 2400;
const DIAGRAM_VIEWBOX = "0 0 360 260";

const basePanelClass =
  "relative overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/30 backdrop-blur sm:p-4";

function edgeId(edge: SignalEdge) {
  return `${edge.from}-${edge.to}`;
}

function nodeMap(nodes: readonly DiagramNode[]) {
  return Object.fromEntries(nodes.map((node) => [node.id, node])) as Record<
    string,
    DiagramNode
  >;
}

function pathD(from: DiagramNode, to: DiagramNode) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const curveX = midX + (to.y - from.y) * 0.12;
  const curveY = midY - (to.x - from.x) * 0.12;

  return `M ${from.x} ${from.y} Q ${curveX} ${curveY} ${to.x} ${to.y}`;
}

function collectEdges(
  mode: DiagramMode,
  nodes: readonly DiagramNode[],
): SignalEdge[] {
  const availableNodes = new Set(nodes.map((node) => node.id));
  const seen = new Set<string>();
  const edges: SignalEdge[] = [];

  signalFlowSteps.forEach((step) => {
    const stepEdges = mode === "human" ? step.humanEdges : step.aiEdges;

    stepEdges.forEach((edge) => {
      const key = edgeId(edge);
      if (
        seen.has(key) ||
        !availableNodes.has(edge.from) ||
        !availableNodes.has(edge.to)
      ) {
        return;
      }

      seen.add(key);
      edges.push(edge);
    });
  });

  return edges;
}

function SystemDiagram({
  mode,
  activeIndex,
  reducedMotion,
}: {
  mode: DiagramMode;
  activeIndex: number;
  reducedMotion: boolean;
}) {
  const nodes = mode === "human" ? humanSignalNodes : aiSignalNodes;
  const nodesById = useMemo(() => nodeMap(nodes), [nodes]);
  const edges = useMemo(() => collectEdges(mode, nodes), [mode, nodes]);
  const activeStep = signalFlowSteps[activeIndex];
  const activeEdges = mode === "human" ? activeStep.humanEdges : activeStep.aiEdges;
  const activeEdgeIds = new Set(activeEdges.map(edgeId));
  const activeNode = mode === "human" ? activeStep.human.node : activeStep.ai.node;
  const Icon = mode === "human" ? Eye : BrainCircuit;
  const title = mode === "human" ? "Human perception loop" : "AI agent loop";
  const subtitle =
    mode === "human"
      ? "Eyes, brain, senses, memory, intent, action"
      : "Input, encoder, LLM, context, retrieval, policy, tools";
  const current =
    mode === "human"
      ? activeStep.human
      : activeStep.ai;

  return (
    <div className={basePanelClass}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-cyan-300" aria-hidden="true" />
            <h3 className="text-sm font-semibold tracking-tight text-white">
              {title}
            </h3>
          </div>
          <p className="mt-1 text-xs leading-5 text-zinc-500">{subtitle}</p>
        </div>
        <span className="rounded-[6px] border border-white/10 bg-black/24 px-2 py-1 font-mono text-[10px] uppercase text-zinc-500">
          {mode}
        </span>
      </div>

      <svg
        viewBox={DIAGRAM_VIEWBOX}
        className="aspect-[360/260] w-full"
        role="img"
        aria-label={`${title}: ${current.title}`}
      >
        <defs>
          <filter id={`${mode}-glow`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="360" height="260" rx="8" fill="rgba(0,0,0,0.14)" />

        {mode === "human" ? (
          <motion.path
            d="M 29 46 C 61 36 78 48 91 84"
            fill="none"
            stroke={activeStep.id === "scan" ? activeStep.color : "rgba(255,255,255,0.12)"}
            strokeLinecap="round"
            strokeWidth="1.2"
            strokeDasharray="4 5"
            animate={
              reducedMotion
                ? { opacity: 0.34 }
                : { opacity: activeStep.id === "scan" ? [0.28, 0.88, 0.28] : 0.2 }
            }
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <g aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <motion.rect
                key={index}
                x={18 + index * 10}
                y={48}
                width="5"
                height="14"
                rx="2"
                fill={activeStep.id === "scan" ? activeStep.color : "rgba(255,255,255,0.1)"}
                animate={
                  reducedMotion
                    ? { opacity: 0.38 }
                    : { opacity: activeStep.id === "scan" ? [0.25, 0.86, 0.25] : 0.18 }
                }
                transition={{
                  duration: 1.1,
                  delay: index * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </g>
        )}

        {edges.map((edge) => {
          const from = nodesById[edge.from];
          const to = nodesById[edge.to];
          const isActive = activeEdgeIds.has(edgeId(edge));

          return (
            <motion.path
              key={edgeId(edge)}
              d={pathD(from, to)}
              fill="none"
              stroke={isActive ? activeStep.color : "rgba(255,255,255,0.16)"}
              strokeLinecap="round"
              strokeWidth={isActive ? 1.8 : 0.9}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.28,
                pathLength: 1,
              }}
              transition={{ duration: 0.42, ease: "easeOut" }}
            />
          );
        })}

        {!reducedMotion
          ? activeEdges.map((edge, index) => {
              const from = nodesById[edge.from];
              const to = nodesById[edge.to];

              return (
                <motion.circle
                  key={`${activeStep.id}-${mode}-${edgeId(edge)}`}
                  r="4.5"
                  fill={activeStep.color}
                  filter={`url(#${mode}-glow)`}
                  initial={{ cx: from.x, cy: from.y, opacity: 0, scale: 0.7 }}
                  animate={{
                    cx: to.x,
                    cy: to.y,
                    opacity: [0, 1, 1, 0],
                    scale: [0.7, 1.15, 1.15, 0.7],
                  }}
                  transition={{
                    duration: 1,
                    delay: index * 0.14,
                    repeat: Infinity,
                    repeatDelay: 0.35,
                    ease: "easeInOut",
                  }}
                />
              );
            })
          : null}

        {nodes.map((node) => {
          const isPrimary = node.id === activeNode;
          const isConnected = activeEdges.some(
            (edge) => edge.from === node.id || edge.to === node.id,
          );
          const isHighlighted = isPrimary || isConnected;
          const labelFontSize =
            node.label.length > 10 ? 6.8 : node.label.length > 7 ? 7.6 : 8.6;

          return (
            <g key={node.id}>
              <title>{`${node.label}: ${node.detail}`}</title>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isPrimary ? 19 : 16}
                fill={isHighlighted ? `${activeStep.color}22` : "rgba(10,10,12,0.9)"}
                stroke={isHighlighted ? activeStep.color : "rgba(255,255,255,0.18)"}
                strokeWidth={isPrimary ? 1.5 : 1}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                animate={
                  reducedMotion
                    ? { scale: isPrimary ? 1.06 : 1 }
                    : { scale: isPrimary ? [1, 1.08, 1] : 1 }
                }
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <text
                x={node.x}
                y={node.y + 3}
                textAnchor="middle"
                fill={isHighlighted ? "#ffffff" : "rgba(255,255,255,0.6)"}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontSize={labelFontSize}
                fontWeight="700"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 border-t border-white/10 pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          {current.metric}
        </p>
        <h4 className="mt-1 text-sm font-semibold text-white">{current.title}</h4>
        <p className="mt-2 text-xs leading-5 text-zinc-400 sm:text-sm sm:leading-6">
          {current.description}
        </p>
      </div>
    </div>
  );
}

export default function SignalFlowDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.28 });
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const activeStep = signalFlowSteps[activeIndex];

  useEffect(() => {
    if (!isInView || reducedMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % signalFlowSteps.length);
    }, STEP_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [cycleKey, isInView, reducedMotion]);

  const handleReplay = () => {
    setActiveIndex(0);
    setCycleKey((current) => current + 1);
  };

  const handleStepSelect = (index: number) => {
    setActiveIndex(index);
    setCycleKey((current) => current + 1);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-4 pt-16 pb-28 sm:px-6 sm:py-24 lg:px-8"
      aria-label="Human perception and AI agent signal flow"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/75">
            perception to action
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Watch a signal become a decision.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            A human scans the world, routes signals through the brain, checks
            senses and memory, then acts. A production AI agent follows the same
            architecture pattern with encoders, an LLM, retrieval, policy, and tools.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-3 rounded-[8px] border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}
        >
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {signalFlowSteps.map((step, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={step.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleStepSelect(index)}
                  className="group rounded-[8px] border border-white/10 bg-black/28 p-2 text-left transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45 data-[active=true]:border-cyan-300/45 data-[active=true]:bg-cyan-300/[0.08]"
                  data-active={isActive}
                >
                  <span
                    className="block h-1 rounded-full"
                    style={{ backgroundColor: isActive ? step.color : "rgba(255,255,255,0.12)" }}
                  />
                  <span className="mt-2 block font-mono text-[10px] uppercase tracking-wide text-zinc-500 group-data-[active=true]:text-cyan-200">
                    0{index + 1}
                  </span>
                  <span className="block truncate text-xs font-medium text-white">
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 bg-black/28 px-4 text-sm font-medium text-zinc-300 transition hover:border-cyan-300/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45"
          >
            {reducedMotion ? (
              <Play className="size-4" aria-hidden="true" />
            ) : (
              <RotateCcw className="size-4" aria-hidden="true" />
            )}
            Replay
          </button>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SystemDiagram
            mode="human"
            activeIndex={activeIndex}
            reducedMotion={Boolean(reducedMotion)}
          />
          <SystemDiagram
            mode="ai"
            activeIndex={activeIndex}
            reducedMotion={Boolean(reducedMotion)}
          />
        </div>

        <motion.div
          className="grid gap-4 rounded-[8px] border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[auto_1fr] sm:p-5"
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.55, ease: "easeOut" }}
        >
          <div className="flex size-11 items-center justify-center rounded-[8px] border border-white/10 bg-black/28 text-cyan-200">
            {activeStep.id === "act" ? (
              <Wrench className="size-5" aria-hidden="true" />
            ) : (
              <Activity className="size-5" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Shared architecture lesson
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-white">
              {activeStep.bridge}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              This is the study pattern: perception enters, context is retrieved,
              policy shapes the plan, then action happens through bounded tools
              with feedback into the next loop.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
