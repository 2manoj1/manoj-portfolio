/**
 * Signal flow step data for the SignalFlowDemo component.
 * Each step represents a stage of information processing,
 * mapped between human biology and AI system equivalents.
 */

export interface SignalFlowStep {
  id: string;
  /** Human-readable label for this processing stage */
  label: string;
  /** Color used for the node indicator */
  color: string;
  /** What the human body does at this step */
  humanDescription: string;
  /** What an AI system does at this step */
  aiDescription: string;
}

export const signalFlowSteps: SignalFlowStep[] = [
  {
    id: "perception",
    label: "Perception",
    color: "#06b6d4", // cyan-500
    humanDescription:
      "Your retina captures photons, converting light into electrical signals. Your visual cortex begins pattern matching.",
    aiDescription:
      "A vision model ingests pixel data through a convolutional encoder, extracting feature embeddings from raw input.",
  },
  {
    id: "recognition",
    label: "Recognition",
    color: "#3b82f6", // blue-500
    humanDescription:
      'Your fusiform face area activates — you recognize a familiar face. "I know this person."',
    aiDescription:
      "A similarity search runs against a vector database of known embeddings. A match is returned with a confidence score.",
  },
  {
    id: "memory-retrieval",
    label: "Memory Retrieval",
    color: "#f59e0b", // amber-500
    humanDescription:
      'Your hippocampus fires, pulling associated memories — their name, last conversation, shared context.',
    aiDescription:
      "A RAG pipeline queries long-term memory storage, retrieving relevant context chunks ranked by semantic similarity.",
  },
  {
    id: "reasoning",
    label: "Reasoning",
    color: "#8b5cf6", // violet-500
    humanDescription:
      'Your prefrontal cortex weighs options: wave? Cross the street? What\'s the social context? You decide: "I\'ll call out to them."',
    aiDescription:
      "An LLM processes the retrieved context through its attention layers, planning a chain of actions via structured reasoning.",
  },
  {
    id: "action",
    label: "Action",
    color: "#22c55e", // green-500
    humanDescription:
      "Your motor cortex fires, your lungs push air, your vocal cords vibrate. You shout their name and wave.",
    aiDescription:
      "The agent executes tool calls — generating text, triggering APIs, producing a multimodal response delivered to the user.",
  },
];
