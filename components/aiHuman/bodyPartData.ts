// ─────────────────────────────────────────────────────────────
// bodyPartData.ts — Canonical data for the AI ↔ Human body map
// All positions are in a 400×700 SVG coordinate space.
// ─────────────────────────────────────────────────────────────

/** A single body-part node in the constellation figure. */
export interface BodyPart {
  id: string;
  label: string;
  aiLabel: string;
  humanDescription: string;
  aiDescription: string;
  insight: string;
  /** Tailwind color name used for active-state glow */
  color: string;
  icon: string;
  /** Center position in the 400×700 SVG viewBox */
  position: { x: number; y: number };
  /** IDs of other parts this node connects to via filaments */
  connections: string[];
}

/** One step in the perception → action signal cascade. */
export interface SignalFlowStep {
  id: string;
  fromPart: string;
  toPart: string;
  humanText: string;
  aiText: string;
  /** Duration of the animation for this leg (ms) */
  duration: number;
}

/** One beat of the hallucination narrative. */
export interface HallucinationStep {
  id: string;
  text: string;
  type: "normal" | "error" | "insight";
}

// ─────────────────────────────────────────────────────────────
// Body Parts
// ─────────────────────────────────────────────────────────────

export const bodyParts: Record<string, BodyPart> = {
  brain: {
    id: "brain",
    label: "Brain",
    aiLabel: "Large Language Model",
    humanDescription:
      "The brain is the body's central processing unit — a 86-billion-neuron network that interprets sensory input, reasons about abstract concepts, and orchestrates every conscious decision.",
    aiDescription:
      "A Large Language Model is a transformer-based neural network trained on trillions of tokens. It performs next-token prediction, embedding complex world knowledge into billions of learned parameters that enable reasoning, summarization, and generation.",
    insight:
      "Both compress the vast complexity of the world into weighted connections — one biological, one mathematical — yet neither truly 'understands' without grounding in action.",
    color: "cyan",
    icon: "🧠",
    position: { x: 200, y: 80 },
    connections: ["eyes", "ears", "mouth", "heart", "nervous-system"],
  },

  eyes: {
    id: "eyes",
    label: "Eyes",
    aiLabel: "Vision Models",
    humanDescription:
      "Human eyes capture roughly 10 million bits of visual information per second, converting photons into neural signals. The visual cortex then assembles edges, colors, and motion into coherent perception.",
    aiDescription:
      "Vision models like CLIP and GPT-4V process pixel matrices through convolutional and transformer layers, extracting features at increasing abstraction — from edges and textures to objects and scenes — enabling multimodal understanding.",
    insight:
      "Both systems transform raw light into meaning — the eye through retinal chemistry, the model through matrix multiplication — converging on the same goal: seeing what matters.",
    color: "blue",
    icon: "👁️",
    position: { x: 200, y: 120 },
    connections: ["brain"],
  },

  ears: {
    id: "ears",
    label: "Ears",
    aiLabel: "Speech Recognition",
    humanDescription:
      "The cochlea converts sound pressure waves into electrical signals across 15,000 hair cells, each tuned to a specific frequency. The auditory cortex then decodes speech, music, and spatial cues in real time.",
    aiDescription:
      "Speech recognition systems like Whisper use encoder-decoder transformers to convert mel-spectrograms of audio into text tokens, handling accents, noise, and multilingual input with near-human accuracy.",
    insight:
      "From vibrating air to structured language — both systems solve the same inverse problem of recovering intent from waveforms, separated by billions of years of evolution versus billions of gradient steps.",
    color: "blue",
    icon: "👂",
    position: { x: 140, y: 130 },
    connections: ["brain"],
  },

  mouth: {
    id: "mouth",
    label: "Mouth",
    aiLabel: "Text & Speech Generation",
    humanDescription:
      "Human speech production coordinates over 100 muscles in the larynx, tongue, and lips to convert abstract thought into precise acoustic patterns at up to 150 words per minute.",
    aiDescription:
      "Text generation decodes the model's internal representations into token sequences via autoregressive sampling. Speech synthesis (TTS) then converts text into natural-sounding audio using neural vocoders like WaveNet.",
    insight:
      "Generation is the final mile of intelligence — both biological and artificial minds must compress rich internal states into the narrow bandwidth of sequential language.",
    color: "violet",
    icon: "🗣️",
    position: { x: 200, y: 180 },
    connections: ["brain"],
  },

  heart: {
    id: "heart",
    label: "Heart",
    aiLabel: "System Prompt & Intent",
    humanDescription:
      "Beyond pumping blood, the heart is the metaphorical seat of purpose and motivation. Emotions, values, and drives — rooted in the limbic system — shape every decision the brain makes.",
    aiDescription:
      "The system prompt defines an AI agent's goals, constraints, persona, and ethical boundaries. It is the persistent instruction set that shapes every inference, acting as the model's motivational architecture.",
    insight:
      "Purpose precedes intelligence — without a reason to act, neither the human mind nor the AI model can produce meaningful output.",
    color: "red",
    icon: "❤️",
    position: { x: 210, y: 280 },
    connections: ["brain", "nervous-system"],
  },

  "nervous-system": {
    id: "nervous-system",
    label: "Nervous System",
    aiLabel: "MCP Protocol",
    humanDescription:
      "The nervous system is the body's communication backbone — 7 trillion nerves carrying electrical signals at up to 120 m/s, connecting the brain to every organ, muscle, and sensor.",
    aiDescription:
      "The Model Context Protocol (MCP) is the standardized communication layer that connects LLMs to external tools, data sources, and execution environments — the 'nervous system' of an AI agent architecture.",
    insight:
      "Intelligence without infrastructure is paralysis — both systems need a reliable, low-latency communication bus to translate thought into coordinated action.",
    color: "amber",
    icon: "⚡",
    position: { x: 200, y: 350 },
    connections: ["brain", "heart", "memory", "hands", "reflexes"],
  },

  memory: {
    id: "memory",
    label: "Memory",
    aiLabel: "GraphRAG & Knowledge Bases",
    humanDescription:
      "Human memory spans working memory (~7 items), episodic recall of experiences, and semantic knowledge accumulated over a lifetime — all dynamically reconstructed rather than replayed.",
    aiDescription:
      "GraphRAG combines vector similarity search with knowledge-graph traversal to retrieve contextually relevant information from massive document corpora, giving the model access to facts beyond its training cutoff.",
    insight:
      "Neither system stores memories as static files — both reconstruct knowledge on demand, blending retrieval with inference, making every recall a creative act.",
    color: "amber",
    icon: "💾",
    position: { x: 200, y: 380 },
    connections: ["nervous-system", "brain"],
  },

  hands: {
    id: "hands",
    label: "Hands",
    aiLabel: "Tools & APIs",
    humanDescription:
      "The human hand has 27 bones and 34 muscles enabling extraordinary dexterity — from brain surgery to piano performance. Hands are how the brain physically manipulates the world.",
    aiDescription:
      "Tool-use enables AI agents to call APIs, execute code, query databases, and interact with external systems. Function calling transforms the model from a passive oracle into an active agent that changes the world.",
    insight:
      "Agency requires manipulation — both hands and APIs are the interface through which intelligence reaches beyond thought to reshape reality.",
    color: "green",
    icon: "🤲",
    position: { x: 200, y: 420 },
    connections: ["nervous-system"],
  },

  reflexes: {
    id: "reflexes",
    label: "Reflexes",
    aiLabel: "Guardrails & Workflows",
    humanDescription:
      "Reflexes are hardwired neural shortcuts that bypass conscious thought — pulling your hand from a flame in 50ms. They protect the body before the brain even registers danger.",
    aiDescription:
      "Guardrails are deterministic safety layers — content filters, schema validation, rate limiting, and workflow gates — that intercept harmful or malformed outputs before they reach the user, no inference required.",
    insight:
      "Not every decision should require thinking — both biological and artificial systems need fast, reliable safety mechanisms that operate below the level of reasoning.",
    color: "orange",
    icon: "🛡️",
    position: { x: 200, y: 480 },
    connections: ["nervous-system", "hands"],
  },

  team: {
    id: "team",
    label: "Team / Society",
    aiLabel: "Multi-Agent Systems",
    humanDescription:
      "No human operates alone. Teams, organizations, and societies achieve what no individual can — dividing labor, sharing knowledge, debating ideas, and coordinating toward goals no single mind could hold.",
    aiDescription:
      "Multi-agent systems orchestrate specialized AI agents — planners, researchers, coders, critics — that collaborate through structured communication, task decomposition, and consensus to solve problems beyond any single model's capability.",
    insight:
      "Intelligence scales through collaboration — whether in boardrooms or agent swarms, the architecture of coordination determines the ceiling of collective capability.",
    color: "violet",
    icon: "👥",
    position: { x: 200, y: 580 },
    connections: ["reflexes", "nervous-system"],
  },
};

// ─────────────────────────────────────────────────────────────
// Signal Flow — the perception → action cascade
// eyes → brain → memory → brain → heart → brain → hands → mouth
// ─────────────────────────────────────────────────────────────

export const signalFlowSteps: SignalFlowStep[] = [
  {
    id: "perceive",
    fromPart: "eyes",
    toPart: "brain",
    humanText: "Light hits the retina and the visual cortex begins pattern recognition.",
    aiText: "Image tokens are encoded by the vision model and passed to the transformer.",
    duration: 800,
  },
  {
    id: "retrieve",
    fromPart: "brain",
    toPart: "memory",
    humanText: "The brain searches episodic and semantic memory for relevant context.",
    aiText: "The model generates a retrieval query; GraphRAG fetches relevant documents and entities.",
    duration: 1000,
  },
  {
    id: "recall",
    fromPart: "memory",
    toPart: "brain",
    humanText: "Memories surface — past experiences and learned knowledge reshape perception.",
    aiText: "Retrieved context is injected into the prompt, grounding the model's next inference.",
    duration: 800,
  },
  {
    id: "motivate",
    fromPart: "brain",
    toPart: "heart",
    humanText: "The limbic system weighs emotional significance and assigns priority to the stimulus.",
    aiText: "The system prompt's goals and constraints are evaluated against the current context.",
    duration: 700,
  },
  {
    id: "decide",
    fromPart: "heart",
    toPart: "brain",
    humanText: "Purpose and values guide the brain toward a decision — fight, flee, or engage.",
    aiText: "Intent alignment narrows the generation space; the model commits to a plan of action.",
    duration: 700,
  },
  {
    id: "act",
    fromPart: "brain",
    toPart: "hands",
    humanText: "Motor cortex fires — the brain sends precise signals to muscles for coordinated action.",
    aiText: "The model emits a function call — an API request, code execution, or database write.",
    duration: 900,
  },
  {
    id: "speak",
    fromPart: "hands",
    toPart: "mouth",
    humanText: "Action complete, the brain formulates a verbal response — words shaped by breath and tongue.",
    aiText: "Results are synthesized into a coherent response; tokens are decoded into natural language.",
    duration: 800,
  },
];

// ─────────────────────────────────────────────────────────────
// Hallucination Narrative
// ─────────────────────────────────────────────────────────────

export const hallucinationSteps: HallucinationStep[] = [
  {
    id: "h1",
    text: "A user asks: 'What paper did Dr. Elena Vasquez publish on quantum error correction in 2019?'",
    type: "normal",
  },
  {
    id: "h2",
    text: "The model searches its parameters — no exact match exists, but the statistical neighborhood is rich with plausible patterns.",
    type: "normal",
  },
  {
    id: "h3",
    text: "Neurons fire confidently. The model generates: 'Dr. Vasquez published \"Topological Codes for Scalable Quantum Memory\" in Physical Review Letters, 2019.'",
    type: "error",
  },
  {
    id: "h4",
    text: "The title sounds real. The journal is real. The year matches. But the paper does not exist — the model has hallucinated a plausible fiction.",
    type: "error",
  },
  {
    id: "h5",
    text: "This is the gap between pattern-matching and knowledge. Human memory fabricates too — we call them false memories. Both systems confuse fluency with truth.",
    type: "insight",
  },
  {
    id: "h6",
    text: "The solution is the same for both: external verification. Humans check sources. AI systems use RAG, citations, and guardrails to anchor generation in retrievable fact.",
    type: "insight",
  },
];
