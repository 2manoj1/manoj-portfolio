export type DiagramMode = "ai" | "human";

export interface SignalEdge {
  from: string;
  to: string;
}

export interface SignalFlowStep {
  id: string;
  label: string;
  color: string;
  bridge: string;
  human: {
    node: string;
    title: string;
    description: string;
    metric: string;
  };
  ai: {
    node: string;
    title: string;
    description: string;
    metric: string;
  };
  humanEdges: SignalEdge[];
  aiEdges: SignalEdge[];
}

export interface DiagramNode {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
}

export const humanSignalNodes: DiagramNode[] = [
  { id: "scene", label: "Scene", detail: "object / motion", x: 34, y: 86 },
  { id: "eyes", label: "Eyes", detail: "retina scan", x: 98, y: 86 },
  { id: "brain", label: "Brain", detail: "reasoning", x: 178, y: 70 },
  { id: "senses", label: "Senses", detail: "audio / touch", x: 280, y: 80 },
  { id: "memory", label: "Memory", detail: "recall", x: 280, y: 154 },
  { id: "intent", label: "Intent", detail: "priority", x: 178, y: 178 },
  { id: "action", label: "Act", detail: "voice + hands", x: 98, y: 204 },
] as const;

export const aiSignalNodes: DiagramNode[] = [
  { id: "input", label: "Input", detail: "user / sensor", x: 34, y: 86 },
  { id: "encoder", label: "Encoder", detail: "tokens", x: 98, y: 86 },
  { id: "llm", label: "LLM", detail: "planner", x: 178, y: 70 },
  { id: "context", label: "Context", detail: "state bus", x: 280, y: 80 },
  { id: "rag", label: "GraphRAG", detail: "grounding", x: 280, y: 154 },
  { id: "policy", label: "Policy", detail: "guardrails", x: 178, y: 178 },
  { id: "tools", label: "Tools", detail: "API / code", x: 98, y: 204 },
] as const;

export const signalFlowSteps: SignalFlowStep[] = [
  {
    id: "scan",
    label: "Scan",
    color: "#22d3ee",
    bridge: "Both systems begin with a noisy outside signal.",
    human: {
      node: "eyes",
      title: "The eyes scan the scene.",
      description:
        "Light hits the retina. Edges, motion, contrast, and distance become electrical signals.",
      metric: "retina -> optic nerve",
    },
    ai: {
      node: "encoder",
      title: "The agent encodes the input.",
      description:
        "Text, image, audio, or UI events become tokens and embeddings the model can reason over.",
      metric: "input -> embeddings",
    },
    humanEdges: [{ from: "scene", to: "eyes" }],
    aiEdges: [{ from: "input", to: "encoder" }],
  },
  {
    id: "route",
    label: "Route",
    color: "#38bdf8",
    bridge: "The raw signal moves into the reasoning core.",
    human: {
      node: "brain",
      title: "The signal reaches the brain.",
      description:
        "The visual cortex and attention systems decide what deserves deeper processing.",
      metric: "optic nerve -> cortex",
    },
    ai: {
      node: "llm",
      title: "The signal reaches the LLM.",
      description:
        "The model receives the encoded context and begins planning the next internal operation.",
      metric: "tokens -> planner",
    },
    humanEdges: [{ from: "eyes", to: "brain" }],
    aiEdges: [{ from: "encoder", to: "llm" }],
  },
  {
    id: "correlate",
    label: "Correlate",
    color: "#f59e0b",
    bridge: "Good reasoning asks other systems for context.",
    human: {
      node: "senses",
      title: "The brain checks other senses.",
      description:
        "Hearing, touch, body state, and memory help confirm what the eyes are seeing.",
      metric: "multi-sensory check",
    },
    ai: {
      node: "context",
      title: "The agent checks runtime context.",
      description:
        "Conversation state, tool results, policy hints, and environment signals enter the loop.",
      metric: "state + traces",
    },
    humanEdges: [
      { from: "brain", to: "senses" },
      { from: "brain", to: "memory" },
    ],
    aiEdges: [
      { from: "llm", to: "context" },
      { from: "llm", to: "rag" },
    ],
  },
  {
    id: "ground",
    label: "Ground",
    color: "#a78bfa",
    bridge: "The system brings evidence back before deciding.",
    human: {
      node: "memory",
      title: "Memory grounds the interpretation.",
      description:
        "The hippocampus brings prior experience into the current perception loop.",
      metric: "recall -> meaning",
    },
    ai: {
      node: "rag",
      title: "Retrieval grounds the model.",
      description:
        "GraphRAG and vector retrieval return facts, entities, and relationships for the next step.",
      metric: "retrieval -> context",
    },
    humanEdges: [{ from: "memory", to: "brain" }],
    aiEdges: [{ from: "rag", to: "llm" }],
  },
  {
    id: "decide",
    label: "Decide",
    color: "#ef4444",
    bridge: "Intent and safety shape the action.",
    human: {
      node: "intent",
      title: "The body chooses a response.",
      description:
        "Emotion, urgency, goals, and social context shape whether you speak, move, or wait.",
      metric: "priority -> plan",
    },
    ai: {
      node: "policy",
      title: "The agent validates the plan.",
      description:
        "System prompt, schemas, permissions, and safety gates constrain the next action.",
      metric: "policy -> bounded plan",
    },
    humanEdges: [
      { from: "brain", to: "intent" },
      { from: "intent", to: "brain" },
    ],
    aiEdges: [
      { from: "llm", to: "policy" },
      { from: "policy", to: "llm" },
    ],
  },
  {
    id: "act",
    label: "Act",
    color: "#22c55e",
    bridge: "Reasoning becomes useful only when it can act and observe.",
    human: {
      node: "action",
      title: "Signals reach voice and hands.",
      description:
        "Motor commands coordinate speech, gesture, and movement, then feedback returns to the brain.",
      metric: "motor command -> feedback",
    },
    ai: {
      node: "tools",
      title: "The agent calls tools.",
      description:
        "The model executes an API call, code path, database query, or UI update and reads the result.",
      metric: "tool call -> observation",
    },
    humanEdges: [
      { from: "brain", to: "action" },
      { from: "action", to: "brain" },
    ],
    aiEdges: [
      { from: "llm", to: "tools" },
      { from: "tools", to: "llm" },
    ],
  },
] as const;
