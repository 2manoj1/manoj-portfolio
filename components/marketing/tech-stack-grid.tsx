"use client";

import React, { useState } from "react";
import {
  KubernetesLogo,
  OpenshiftLogo,
  FastapiLogo,
  PostgresqlLogo,
  NextjsLogo,
  AwsLogo,
  GooglecloudLogo,
  NvidiaLogo,
  OpentelemetryLogo,
  LangchainLogo,
  OllamaLogo,
  PythonLogo,
  NodeLogo,
  ReactLogo,
  DockerLogo,
  GithubactionsLogo,
  JenkinsLogo,
  TailwindcssLogo,
  ReduxLogo,
  GraphqlLogo,
  MongodbLogo,
  AnthropicLogo,
  OpenaiLogo,
  DeepseekLogo,
  TypescriptLogo,
  DenoLogo,
  BunLogo,
  ExpressLogo,
  FastifyLogo,
  MuiLogo,
  AntdesignLogo,
  ShadcnuiLogo,
  RemixLogo,
  ReactqueryLogo,
  PydanticLogo,
  N8nLogo,
  SupabaseLogo,
  QdrantLogo,
  Neo4jLogo,
  Amazons3Logo,
  CloudflareLogo,
  VercelLogo,
  NpmLogo,
  GitlabLogo,
  MlflowLogo,
  TensorflowLogo,
  PodmanLogo,
  GooglechromeLogo,
  IonicLogo,
  WebpackLogo,
  ApachesparkLogo,
  GithubcopilotLogo,
} from "@/components/marketing/tech-logos";

// Custom Minimal SVG Logos for niche tools
function GoogleAdkLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 12h8M12 8v8M8 8l8 8" />
    </svg>
  );
}

function McpLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M9 12h2M13 12h2M8 16h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AgenticRagLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 6v6c0 2 8 2 8 2s8 0 8-2V6" />
      <path d="M4 6c0 2 8 2 8 2s8 0 8-2" />
      <path d="M4 12c0 2 8 2 8 2s8 0 8-2" />
      <circle cx="16" cy="16" r="3" />
      <path d="M18.5 18.5L21 21" />
    </svg>
  );
}

function PineconeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 2L4 9v6l8 7 8-7V9l-8-7z" />
      <path d="M12 2v20M4 9h16M4 15h16" strokeDasharray="2 2" />
    </svg>
  );
}

function ChromaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function JotaiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </svg>
  );
}

function ZustandLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
      <rect x="7" y="9" width="4" height="6" rx="1" fill="currentColor" />
      <rect x="13" y="3" width="4" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

function AutogenLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="16" r="2.5" />
      <path d="M8.5 6h7M7 8.5l3.5 5M17 8.5l-3.5 5" />
    </svg>
  );
}

function LangsmithLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 6h8M3 12h14M3 18h18" strokeLinecap="round" />
      <circle cx="11" cy="6" r="2" fill="currentColor" />
      <circle cx="17" cy="12" r="2" fill="currentColor" />
      <circle cx="21" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}

function ComputeIamLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="8" rx="1" />
      <rect x="3" y="13" width="18" height="8" rx="1" />
      <circle cx="7" cy="7" r="1" fill="currentColor" />
      <circle cx="7" cy="17" r="1" fill="currentColor" />
      <path d="M14 7h4M14 17h4" />
      <path d="M12 11v2" strokeDasharray="1 1" />
    </svg>
  );
}

function WebmcpLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
      <path d="M3 12h18M12 3v18" />
    </svg>
  );
}

function QloraLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="7" height="18" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <path d="M10 6h4M10 17h4" />
    </svg>
  );
}

function MljsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 17v-4M12 17V7M17 17v-7" strokeLinecap="round" />
    </svg>
  );
}

function SlingshotLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 22v-8M12 14L6 5M12 14l6-9M6 5c2 0 4 2 6 2s4-2 6-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FluxLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path d="M12 3a9 9 0 019 9h-4" />
      <path d="M12 21a9 9 0 01-9-9h4" />
    </svg>
  );
}

function MongooseLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="9" ry="5" />
      <path d="M12 7c-4 0-5 2.5-5 5s1 5 5 5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

interface TechItem {
  name: string;
  logo: React.ReactNode;
}

interface TechGroup {
  id: string;
  title: string;
  code: string;
  description: string;
  items: TechItem[];
}

const techGroups: TechGroup[] = [
  {
    id: "genai",
    title: "Generative AI & Agentic Orchestration",
    code: "GEN AI",
    description: "Multi-agent platforms, context coordination protocols, tracing suites, and visual workflows.",
    items: [
      { name: "LangGraph", logo: <LangchainLogo className="size-5" /> },
      { name: "LangChain", logo: <LangchainLogo className="size-5" /> },
      { name: "LangSmith Cloud Base", logo: <LangsmithLogo className="size-5" /> },
      { name: "Google ADK", logo: <GoogleAdkLogo className="size-5" /> },
      { name: "Pydantic AI", logo: <PydanticLogo className="size-5" /> },
      { name: "AutoGen", logo: <AutogenLogo className="size-5" /> },
      { name: "n8n Automation", logo: <N8nLogo className="size-5" /> },
      { name: "Built-in AI Chrome", logo: <GooglechromeLogo className="size-5" /> },
      { name: "WebMCP Edge", logo: <WebmcpLogo className="size-5" /> },
      { name: "MCP (Model Context)", logo: <McpLogo className="size-5" /> },
      { name: "ACP (Agent Context)", logo: <McpLogo className="size-5" /> },
      { name: "UCP (Unified Context)", logo: <McpLogo className="size-5" /> },
      { name: "MCP Apps ecosystem", logo: <McpLogo className="size-5" /> },
      { name: "ChatGPT SDK", logo: <OpenaiLogo className="size-5" /> },
    ],
  },
  {
    id: "be",
    title: "Backend Services & Client ML",
    code: "BACKEND (BE)",
    description: "Enterprise backend engines, asynchronous API runtimes, and local browser/Node ML execution.",
    items: [
      { name: "Python FastAPI", logo: <FastapiLogo className="size-5" /> },
      { name: "Node.js (JS/TS)", logo: <NodeLogo className="size-5" /> },
      { name: "Deno runtime", logo: <DenoLogo className="size-5" /> },
      { name: "Bun runtime", logo: <BunLogo className="size-5" /> },
      { name: "Express.js", logo: <ExpressLogo className="size-5" /> },
      { name: "Fastify", logo: <FastifyLogo className="size-5" /> },
      { name: "Next.js Backend API", logo: <NextjsLogo className="size-5" /> },
      { name: "TensorFlow.js", logo: <TensorflowLogo className="size-5" /> },
      { name: "ML.js library", logo: <MljsLogo className="size-5" /> },
      { name: "Mongoose ORM", logo: <MongooseLogo className="size-5" /> },
      { name: "Apache PySpark", logo: <ApachesparkLogo className="size-5" /> },
    ],
  },
  {
    id: "fe",
    title: "Frontend UI & Full Stack Frameworks",
    code: "FRONTEND (FE)",
    description: "Component layout matrices, lightweight reactive state nodes, and design system libraries.",
    items: [
      { name: "Next.js Fullstack", logo: <NextjsLogo className="size-5" /> },
      { name: "React.js 19.2+", logo: <ReactLogo className="size-5" /> },
      { name: "TailwindCSS", logo: <TailwindcssLogo className="size-5" /> },
      { name: "Redux & RTK", logo: <ReduxLogo className="size-5" /> },
      { name: "Redux-Saga", logo: <ReduxLogo className="size-5" /> },
      { name: "Flux Architecture", logo: <FluxLogo className="size-5" /> },
      { name: "Jotai State", logo: <JotaiLogo className="size-5" /> },
      { name: "Zustand State", logo: <ZustandLogo className="size-5" /> },
      { name: "MUI (Material UI)", logo: <MuiLogo className="size-5" /> },
      { name: "Ant Design", logo: <AntdesignLogo className="size-5" /> },
      { name: "Shadcn UI", logo: <ShadcnuiLogo className="size-5" /> },
      { name: "Remix Framework", logo: <RemixLogo className="size-5" /> },
      { name: "TanStack Ecosystem", logo: <ReactqueryLogo className="size-5" /> },
      { name: "React Native Mobile", logo: <ReactLogo className="size-5" /> },
      { name: "Ionic Framework", logo: <IonicLogo className="size-5" /> },
      { name: "Webpack Module Federation", logo: <WebpackLogo className="size-5" /> },
    ],
  },
  {
    id: "databases",
    title: "Databases, Vector Indexes & Graph Stores",
    code: "DATA STORE",
    description: "Relational cloud SQL, vector embedding stores, key-value databases, and semantic Graph DBs.",
    items: [
      { name: "PostgreSQL", logo: <PostgresqlLogo className="size-5" /> },
      { name: "MongoDB", logo: <MongodbLogo className="size-5" /> },
      { name: "AWS RDS", logo: <AwsLogo className="size-5" /> },
      { name: "Google Postgres SQL", logo: <GooglecloudLogo className="size-5" /> },
      { name: "Supabase DB", logo: <SupabaseLogo className="size-5" /> },
      { name: "pgvector index", logo: <PostgresqlLogo className="size-5" /> },
      { name: "ChromaDB", logo: <ChromaLogo className="size-5" /> },
      { name: "Pinecone Vector", logo: <PineconeLogo className="size-5" /> },
      { name: "Qdrant Vector", logo: <QdrantLogo className="size-5" /> },
      { name: "Neo4j Graph DB", logo: <Neo4jLogo className="size-5" /> },
    ],
  },
  {
    id: "cloud",
    title: "Cloud MLOps & Infrastructure",
    code: "CLOUD PLATFORM",
    description: "Cloud-native compute engines, enterprise GenAI bedrock services, storage clusters, and access control.",
    items: [
      { name: "OpenShift AI", logo: <OpenshiftLogo className="size-5" /> },
      { name: "NVIDIA Run:AI & MLOps", logo: <NvidiaLogo className="size-5" /> },
      { name: "MLflow Tracking", logo: <MlflowLogo className="size-5" /> },
      { name: "Vertex AI AutoML", logo: <GooglecloudLogo className="size-5" /> },
      { name: "AWS Bedrock", logo: <AwsLogo className="size-5" /> },
      { name: "QLoRA Fine-Tuning", logo: <QloraLogo className="size-5" /> },
      { name: "AWS S3 Storage", logo: <Amazons3Logo className="size-5" /> },
      { name: "Google Storage GCS", logo: <GooglecloudLogo className="size-5" /> },
      { name: "Compute, Firewall & IAM", logo: <ComputeIamLogo className="size-5" /> },
      { name: "AWS EKS (Kubernetes)", logo: <KubernetesLogo className="size-5" /> },
      { name: "AWS ECS (Containers)", logo: <DockerLogo className="size-5" /> },
    ],
  },
  {
    id: "devops",
    title: "Deployment, MLOps Tools & CI/CD",
    code: "DEVOPS & CI/CD",
    description: "Edge networks, hosting providers, AI developer assistants, package/container registries, and runner pipelines.",
    items: [
      { name: "Cloudflare Edge", logo: <CloudflareLogo className="size-5" /> },
      { name: "Vercel Hosting", logo: <VercelLogo className="size-5" /> },
      { name: "GitHub Actions", logo: <GithubactionsLogo className="size-5" /> },
      { name: "Docker Registry", logo: <DockerLogo className="size-5" /> },
      { name: "Podman Containers", logo: <PodmanLogo className="size-5" /> },
      { name: "npm Registry", logo: <NpmLogo className="size-5" /> },
      { name: "GHCR Containers", logo: <DockerLogo className="size-5" /> },
      { name: "GitLab CI/CD", logo: <GitlabLogo className="size-5" /> },
      { name: "GitHub Copilot", logo: <GithubcopilotLogo className="size-5" /> },
      { name: "Claude Code", logo: <AnthropicLogo className="size-5" /> },
      { name: "Slingshot", logo: <SlingshotLogo className="size-5" /> },
    ],
  },
];

export function TechStackGrid() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredGroups =
    activeTab === "all"
      ? techGroups
      : techGroups.filter((group) => group.id === activeTab);

  return (
    <div className="mt-12 space-y-10">
      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/60 pb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`rounded-md px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider transition-all duration-200 ${
            activeTab === "all"
              ? "bg-zinc-900 border border-amber/40 text-amber shadow-[0_0_8px_rgba(245,158,11,0.05)]"
              : "border border-transparent text-muted-foreground hover:bg-zinc-950/40 hover:text-foreground"
          }`}
        >
          All Matrix
        </button>
        {techGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveTab(group.id)}
            className={`rounded-md px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider transition-all duration-200 ${
              activeTab === group.id
                ? "bg-zinc-900 border border-amber/40 text-amber shadow-[0_0_8px_rgba(245,158,11,0.05)]"
                : "border border-transparent text-muted-foreground hover:bg-zinc-950/40 hover:text-foreground"
            }`}
          >
            {group.code}
          </button>
        ))}
      </div>

      {/* Render groups */}
      <div className="space-y-12">
        {filteredGroups.map((group) => (
          <div key={group.id} className="space-y-4 animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col gap-1 border-l-2 border-amber/20 pl-4">
              <span className="font-mono text-[9px] font-semibold tracking-widest text-amber uppercase">
                {group.code} SYSTEM
              </span>
              <h3 className="text-sm font-bold text-foreground">
                {group.title}
              </h3>
              <p className="max-w-3xl text-xs text-muted-foreground/80 leading-relaxed">
                {group.description}
              </p>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-zinc-950/15 px-3.5 py-3 shadow-sm transition-all duration-300 hover:border-amber/35 hover:bg-zinc-900/35 hover:shadow-[0_0_12px_rgba(245,158,11,0.05)]"
                >
                  {/* Logo frame */}
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-zinc-900 text-zinc-400 transition-all duration-300 group-hover:bg-zinc-900/50 group-hover:text-amber group-hover:border-amber/30">
                    {item.logo}
                  </div>
                  {/* Name block */}
                  <div className="min-w-0 text-left">
                    <h4 className="text-xs font-semibold text-foreground transition-colors group-hover:text-zinc-100 truncate">
                      {item.name}
                    </h4>
                    <span className="block font-mono text-[9px] text-muted-foreground/50 tracking-tight uppercase mt-0.5 truncate">
                      {group.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
