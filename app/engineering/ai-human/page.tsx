import type { Metadata } from "next";
import AiHumanClient from "@/app/engineering/ai-human/AiHumanClient";

export const metadata: Metadata = {
  title: "Humans Are Agentic Systems Too — Interactive AI Guide",
  description:
    "Explore how AI agents mirror the human body. Brain = LLM, Nervous System = MCP, Memory = GraphRAG. An interactive experience by Manoj Mukherjee.",
  openGraph: {
    title: "Humans Are Agentic Systems Too",
    description:
      "Interactive guide mapping AI agent architecture to the human body — LLMs, MCP, GraphRAG, Tools, and Multi-Agent Systems explained through biology.",
    url: "https://www.manojmukherjee.co.in/engineering/ai-human",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/ai-human.png" }],
  },
  keywords: [
    "AI agents explained",
    "LLM human body analogy",
    "MCP protocol",
    "GraphRAG",
    "multi-agent systems",
    "agentic AI",
    "AI education",
    "interactive AI guide",
  ],
};

export default function AiHumanPage() {
  return <AiHumanClient />;
}
