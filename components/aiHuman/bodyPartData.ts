// Canonical data for the AI <-> human anatomy map.
// Positions use the HumanFigureSVG 420 x 760 coordinate space.

export interface BodyPart {
  id: string;
  label: string;
  aiLabel: string;
  systemType: string;
  humanDescription: string;
  aiDescription: string;
  insight: string;
  detailPoints: string[];
  color: string;
  icon: string;
  position: { x: number; y: number };
  connections: string[];
}

export interface SignalFlowStep {
  id: string;
  fromPart: string;
  toPart: string;
  humanText: string;
  aiText: string;
  duration: number;
}

export interface HallucinationStep {
  id: string;
  text: string;
  type: "normal" | "error" | "insight";
}

export const bodyParts: Record<string, BodyPart> = {
  brain: {
    id: "brain",
    label: "Brain",
    aiLabel: "LLM reasoning core",
    systemType: "reasoning",
    humanDescription:
      "The brain integrates perception, memory, goals, and motor plans. The prefrontal cortex handles planning while attention decides what matters right now.",
    aiDescription:
      "The LLM is the reasoning core. It attends to context, chooses the next step, and routes work to retrieval, tools, or response generation.",
    insight:
      "A useful agent is not just a model. It is a model connected to memory, tools, policies, and feedback.",
    detailPoints: [
      "Prefrontal cortex -> planning",
      "Attention -> context weighting",
      "Motor plan -> tool-call plan",
    ],
    color: "cyan",
    icon: "LLM",
    position: { x: 210, y: 76 },
    connections: [
      "eyes",
      "ears",
      "mouth",
      "heart",
      "lungs",
      "memory",
      "nervous-system",
    ],
  },

  memory: {
    id: "memory",
    label: "Hippocampus",
    aiLabel: "GraphRAG memory",
    systemType: "memory",
    humanDescription:
      "The hippocampus binds experience into recallable context. Memory is reconstructed from signals, emotion, and prior knowledge.",
    aiDescription:
      "GraphRAG and vector memory retrieve trusted context from documents, entities, and relationships before the model responds.",
    insight:
      "Recall is not storage alone. Good memory systems need retrieval quality, ranking, and source grounding.",
    detailPoints: [
      "Episodic memory -> traces",
      "Semantic memory -> facts",
      "Graph traversal -> connected context",
    ],
    color: "amber",
    icon: "RAG",
    position: { x: 160, y: 100 },
    connections: ["brain", "nervous-system"],
  },

  eyes: {
    id: "eyes",
    label: "Eyes",
    aiLabel: "Vision encoder",
    systemType: "input",
    humanDescription:
      "The retina turns photons into electrical signals. The visual cortex assembles edges, motion, color, depth, and objects.",
    aiDescription:
      "Vision encoders convert pixels into embeddings that a multimodal model can reason over with language and context.",
    insight:
      "Raw input becomes useful only after it is encoded into a structure the reasoning system can use.",
    detailPoints: [
      "Retina -> signal capture",
      "Visual cortex -> pattern extraction",
      "Embeddings -> machine-readable perception",
    ],
    color: "blue",
    icon: "VIS",
    position: { x: 210, y: 122 },
    connections: ["brain", "skin"],
  },

  ears: {
    id: "ears",
    label: "Ears",
    aiLabel: "Audio encoder",
    systemType: "input",
    humanDescription:
      "The cochlea converts vibration into frequency-specific neural signals. The auditory cortex turns sound into speech, rhythm, and location cues.",
    aiDescription:
      "Speech and audio models transform waveforms into tokens or embeddings for transcription, intent detection, and multimodal reasoning.",
    insight:
      "Both systems recover intent from noisy signals before higher-level reasoning begins.",
    detailPoints: [
      "Cochlea -> frequency map",
      "Auditory cortex -> speech structure",
      "ASR -> text and intent",
    ],
    color: "blue",
    icon: "AUD",
    position: { x: 142, y: 124 },
    connections: ["brain", "skin"],
  },

  mouth: {
    id: "mouth",
    label: "Mouth",
    aiLabel: "Response generator",
    systemType: "output",
    humanDescription:
      "Speech coordinates breath, vocal cords, tongue, and lips to turn thought into words other people can act on.",
    aiDescription:
      "The output layer turns plans and tool results into text, speech, UI state, or structured data returned to the user.",
    insight:
      "Output quality is the final mile of intelligence. The system has to be accurate and understandable.",
    detailPoints: [
      "Breath -> speech energy",
      "Articulation -> format control",
      "Decoder -> user-facing response",
    ],
    color: "violet",
    icon: "OUT",
    position: { x: 210, y: 156 },
    connections: ["brain", "lungs"],
  },

  heart: {
    id: "heart",
    label: "Heart",
    aiLabel: "System intent",
    systemType: "goal",
    humanDescription:
      "The heart sustains the body while emotional systems shape urgency, motivation, and priority.",
    aiDescription:
      "System prompts, product goals, and policy constraints shape what the agent should optimize for and what it must refuse.",
    insight:
      "Purpose constrains intelligence. Without goals and boundaries, reasoning becomes uncontrolled generation.",
    detailPoints: [
      "Motivation -> task priority",
      "Values -> boundaries",
      "System prompt -> agent contract",
    ],
    color: "red",
    icon: "GOAL",
    position: { x: 222, y: 282 },
    connections: ["brain", "lungs", "nervous-system"],
  },

  lungs: {
    id: "lungs",
    label: "Lungs",
    aiLabel: "Context window",
    systemType: "context",
    humanDescription:
      "The lungs regulate oxygen and breath cadence. They keep the system stable while speech and movement consume energy.",
    aiDescription:
      "The context window supplies the working set: instructions, retrieved facts, recent conversation, tool results, and constraints.",
    insight:
      "Context is the agent's oxygen. Too little context starves reasoning; too much unmanaged context creates noise.",
    detailPoints: [
      "Oxygen -> usable energy",
      "Breath cadence -> pacing",
      "Context budget -> working set",
    ],
    color: "cyan",
    icon: "CTX",
    position: { x: 168, y: 266 },
    connections: ["brain", "heart", "mouth", "nervous-system"],
  },

  "nervous-system": {
    id: "nervous-system",
    label: "Spine and Nerves",
    aiLabel: "MCP + event bus",
    systemType: "routing",
    humanDescription:
      "The spinal cord and peripheral nerves move signals between the brain, organs, skin, and muscles with very low latency.",
    aiDescription:
      "MCP, workflow routers, and event buses connect the model to tools, data, memory, user interfaces, and execution systems.",
    insight:
      "An intelligent core still needs reliable routing. Architecture is what lets thought become action.",
    detailPoints: [
      "Spinal cord -> central route",
      "Peripheral nerves -> tool channels",
      "MCP servers -> external capability bus",
    ],
    color: "amber",
    icon: "MCP",
    position: { x: 210, y: 360 },
    connections: [
      "brain",
      "heart",
      "lungs",
      "memory",
      "gut",
      "skin",
      "hands",
      "reflexes",
    ],
  },

  gut: {
    id: "gut",
    label: "Digestive System",
    aiLabel: "Data ingestion",
    systemType: "pipeline",
    humanDescription:
      "The digestive system breaks raw material into nutrients, filters waste, and feeds the body over time.",
    aiDescription:
      "Ingestion pipelines parse documents, clean data, chunk content, extract metadata, and prepare embeddings for retrieval.",
    insight:
      "Bad ingestion becomes bad reasoning. The quality of the pipeline controls the quality of downstream answers.",
    detailPoints: [
      "Digestion -> transformation",
      "Filtering -> quality control",
      "Chunking -> retrievable units",
    ],
    color: "orange",
    icon: "ETL",
    position: { x: 210, y: 430 },
    connections: ["nervous-system", "memory"],
  },

  skin: {
    id: "skin",
    label: "Skin",
    aiLabel: "User interface",
    systemType: "interface",
    humanDescription:
      "Skin is the body's largest interface. It senses pressure, heat, pain, and contact while protecting internal systems.",
    aiDescription:
      "The UI and API surface collect user intent, expose system state, and protect internals with validation and permissions.",
    insight:
      "Interfaces are not decoration. They are the contract between a system and the outside world.",
    detailPoints: [
      "Touch -> interaction signal",
      "Barrier -> access control",
      "UI/API -> system boundary",
    ],
    color: "green",
    icon: "I/O",
    position: { x: 320, y: 238 },
    connections: ["eyes", "ears", "nervous-system", "reflexes"],
  },

  hands: {
    id: "hands",
    label: "Hands",
    aiLabel: "Tools and APIs",
    systemType: "action",
    humanDescription:
      "Hands convert intent into physical change. Fine motor control lets the body write, build, repair, and operate tools.",
    aiDescription:
      "Tool calling lets agents run code, call APIs, query databases, create files, and change external systems safely.",
    insight:
      "Agency begins when reasoning can affect the world through controlled actions.",
    detailPoints: [
      "Motor control -> execution",
      "Dexterity -> tool choice",
      "Function call -> bounded action",
    ],
    color: "green",
    icon: "API",
    position: { x: 330, y: 394 },
    connections: ["nervous-system", "reflexes"],
  },

  reflexes: {
    id: "reflexes",
    label: "Reflexes",
    aiLabel: "Guardrails",
    systemType: "safety",
    humanDescription:
      "Reflexes and immune responses act before conscious reasoning. They protect the body from immediate damage.",
    aiDescription:
      "Guardrails enforce schemas, permissions, policy checks, rate limits, and validation before outputs or tool calls ship.",
    insight:
      "Not every safety decision should wait for the model. Some checks must be deterministic and fast.",
    detailPoints: [
      "Reflex arc -> fast protection",
      "Immune response -> anomaly handling",
      "Policy gate -> deterministic control",
    ],
    color: "orange",
    icon: "SAFE",
    position: { x: 116, y: 454 },
    connections: ["nervous-system", "hands", "skin"],
  },
};

export const signalFlowSteps: SignalFlowStep[] = [
  {
    id: "perceive",
    fromPart: "eyes",
    toPart: "brain",
    humanText: "The retina captures light and the visual cortex begins pattern recognition.",
    aiText: "A vision encoder turns pixels into embeddings for the model.",
    duration: 800,
  },
  {
    id: "retrieve",
    fromPart: "brain",
    toPart: "memory",
    humanText: "The hippocampus pulls relevant context from memory.",
    aiText: "GraphRAG retrieves grounded documents, entities, and relationships.",
    duration: 1000,
  },
  {
    id: "decide",
    fromPart: "brain",
    toPart: "heart",
    humanText: "Purpose and priority shape the next action.",
    aiText: "System intent and constraints narrow the action plan.",
    duration: 700,
  },
  {
    id: "act",
    fromPart: "brain",
    toPart: "hands",
    humanText: "Motor signals coordinate the body to act.",
    aiText: "The agent emits a bounded tool call or API request.",
    duration: 900,
  },
  {
    id: "speak",
    fromPart: "hands",
    toPart: "mouth",
    humanText: "The result becomes speech, movement, or feedback.",
    aiText: "The result is summarized into text, speech, or UI state.",
    duration: 800,
  },
];

export const hallucinationSteps: HallucinationStep[] = [
  {
    id: "h1",
    text: "A user asks for a precise fact the system does not actually know.",
    type: "normal",
  },
  {
    id: "h2",
    text: "The model finds nearby patterns and starts completing the answer fluently.",
    type: "normal",
  },
  {
    id: "h3",
    text: "The answer sounds plausible, but the source does not exist.",
    type: "error",
  },
  {
    id: "h4",
    text: "The fix is grounding: retrieval, citations, verification, and guardrails.",
    type: "insight",
  },
];
