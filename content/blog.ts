export const blogArticles = [
	{
		slug: "langgraph-v1-durable-agent-architecture",
		title:
			"LangGraph v1 and Durable Agent Architecture: Why Enterprise AI Needs Checkpoints",
		date: "May 2026",
		topic: "LangGraph architecture",
		readingTime: "7 min read",
		summary:
			"An architecture brief on durable execution, checkpoints, human approval, and replay-safe agent workflows for production LangGraph systems.",
		seoDescription:
			"Learn how LangGraph v1 durable execution, checkpointing, memory, and human-in-the-loop patterns shape enterprise multi-agent architecture.",
		keywords: [
			"LangGraph v1",
			"LangGraph architecture",
			"durable agents",
			"multi-agent systems",
			"AI reliability engineering",
		],
		heroTakeaway:
			"The enterprise agent runtime is no longer just a prompt loop. It is a stateful workflow system with persistence, replay semantics, interrupts, and recovery paths.",
		architectureSignals: [
			"Checkpoint every business-critical state transition",
			"Wrap non-deterministic side effects in replay-safe tasks",
			"Use human approval gates for irreversible tool calls",
			"Treat agent traces as production debugging artifacts",
		],
		sections: [
			{
				heading: "Why this is trending",
				body: [
					"LangGraph v1 matters because teams are moving from demo agents to workflows that need to survive timeouts, approval delays, model retries, and platform restarts. The important shift is architectural: the agent is no longer a single request-response loop. It becomes a resumable execution graph.",
					"For Manoj Mukherjee's SEO lane, this topic aligns directly with LangGraph consultant, multi-agent systems, production AI systems, and AI reliability engineering. These are high-intent search terms from teams that are already beyond beginner experimentation.",
				],
			},
			{
				heading: "Architecture decision",
				body: [
					"The core decision is where to place state. A simple chat agent stores conversation history, but a production agent stores workflow state, tool outputs, approval status, retries, and failure context. That state must be durable enough to resume after interruptions without repeating unsafe work.",
					"A strong LangGraph architecture separates deterministic graph transitions from non-deterministic operations such as LLM calls, writes, payments, ticket updates, or external API actions. The goal is not only to recover. The goal is to recover predictably.",
				],
			},
			{
				heading: "Production pattern",
				body: [
					"Model the workflow as a graph with explicit nodes for planning, retrieval, tool execution, validation, human review, and final response generation. Add a checkpointer before production rollout, define thread identifiers for business workflows, and make every side effect idempotent.",
					"The credibility angle is simple: enterprise buyers do not want magical agents. They want systems that can explain where execution paused, why a tool was called, what state was approved, and how the workflow resumes after failure.",
				],
				codeBlock: {
					language: "python",
					filename: "agent_runtime.py",
					code: `from langgraph.checkpoint.postgres import PostgresSaver\nfrom langgraph.prebuilt import create_react_agent\n\n# Configure persistent state checkpointer\nmemory = PostgresSaver(conn_string)\n\n# Instantiate stateful runtime with memory checkpoints\nagent_executor = create_react_agent(\n    model=local_ollama_model,\n    tools=[search_retrieval_tool],\n    checkpointer=memory\n)\n\n# Invoke thread runtime sessions dynamically\nconfig = {"configurable": {"thread_id": "session-8012"}}\nfor chunk in agent_executor.stream({"messages": [("user", "Run eval")]}, config):\n    print(chunk)`
				}
			},
		],
		references: [
			{
				label: "LangGraph overview",
				url: "https://docs.langchain.com/oss/python/langgraph",
			},
			{
				label: "LangGraph durable execution",
				url: "https://docs.langchain.com/oss/python/langgraph/durable-execution",
			},
			{
				label: "LangGraph v1 release notes",
				url: "https://docs.langchain.com/oss/python/releases/langgraph-v1",
			},
		],
	},
	{
		slug: "mcp-security-architecture-enterprise-ai",
		title:
			"MCP Security Architecture: Tool Permissions, Context Boundaries, and Enterprise Guardrails",
		date: "May 2026",
		topic: "MCP security",
		readingTime: "8 min read",
		summary:
			"A systems view of Model Context Protocol adoption, focused on tool trust, data boundaries, auditability, and production governance.",
		seoDescription:
			"Explore MCP security architecture for enterprise AI systems, including tool permissions, prompt injection risk, context boundaries, and audit controls.",
		keywords: [
			"Model Context Protocol",
			"MCP security",
			"enterprise AI architecture",
			"AI tool governance",
			"agent security",
		],
		heroTakeaway:
			"MCP is becoming an integration layer for AI agents, but enterprise adoption depends on permissions, isolation, observability, and tool governance.",
		architectureSignals: [
			"Separate trusted tools from experimental tools",
			"Require confirmation for destructive actions",
			"Log tool metadata, inputs, outputs, and approval paths",
			"Design context boundaries before exposing enterprise systems",
		],
		sections: [
			{
				heading: "Why this is trending",
				body: [
					"MCP is attractive because it gives agents a common way to access tools, resources, and prompts. That standardization is powerful, but it also concentrates risk. A tool interface that is easy to expose is also easy to overexpose.",
					"For SEO, this lets Manoj own a more senior lane than generic MCP tutorials: MCP security architecture, AI tool governance, enterprise AI integration, and production agent safety.",
				],
			},
			{
				heading: "Architecture decision",
				body: [
					"The main decision is not whether to use MCP. It is how to design the trust boundary. An enterprise MCP server should not be treated as a simple plugin. It is an access layer into operational systems, data stores, documents, developer environments, and customer workflows.",
					"Good architecture classifies tools by risk level. Read-only resource lookup, low-risk enrichment, write operations, administrative actions, and external communication should not share the same approval path.",
				],
			},
			{
				heading: "Production pattern",
				body: [
					"Start with an allowlisted tool registry, explicit schemas, environment isolation, identity-aware access, structured audit logs, and human confirmation for high-risk operations. Add prompt-injection tests that simulate malicious resource content and misleading tool descriptions.",
					"The strongest positioning is practical: MCP can accelerate agent integration, but only when tool discovery, permissions, context movement, and audit trails are engineered deliberately.",
				],
				codeBlock: {
					language: "json",
					filename: "mcp_security_policy.json",
					code: `{\n  "role": "enterprise-agent-runtime",\n  "tool_permissions": {\n    "read_only_resources": ["allow"],\n    "write_operations": ["require_approval"],\n    "administrative_actions": ["deny"]\n  },\n  "trusted_servers": [\n    "https://api.manojmukherjee.co.in/mcp"\n  ]\n}`
				}
			},
		],
		references: [
			{
				label: "Model Context Protocol specification",
				url: "https://modelcontextprotocol.io/specification/2025-06-18",
			},
			{
				label: "MCP tools specification",
				url: "https://modelcontextprotocol.io/specification/2025-06-18/server/tools",
			},
			{
				label: "OpenAI Agents SDK guardrails",
				url: "https://openai.github.io/openai-agents-python/guardrails/",
			},
		],
	},
	{
		slug: "opentelemetry-genai-observability-agent-workflows",
		title:
			"OpenTelemetry GenAI Observability: Tracing Agent Workflows Beyond Token Counts",
		date: "May 2026",
		topic: "AI observability",
		readingTime: "7 min read",
		summary:
			"How GenAI semantic conventions, traces, spans, tool calls, and retrieval metadata turn agent failures into diagnosable engineering signals.",
		seoDescription:
			"Design AI observability for multi-agent workflows using OpenTelemetry GenAI semantic conventions, traces, tool call spans, and retrieval metrics.",
		keywords: [
			"AI observability",
			"OpenTelemetry GenAI",
			"LLM tracing",
			"agent observability",
			"AI reliability",
		],
		heroTakeaway:
			"Production AI observability is not a dashboard of token counts. It is the ability to reconstruct reasoning, retrieval, tool execution, latency, cost, and failure paths.",
		architectureSignals: [
			"Trace model calls, tool calls, retrieval, and reranking as separate spans",
			"Propagate request IDs across FastAPI, workers, and graph nodes",
			"Track latency, token usage, retrieval quality, and failure class",
			"Connect traces to evaluation datasets and regression reports",
		],
		sections: [
			{
				heading: "Why this is trending",
				body: [
					"As AI systems become agentic, failures become multi-step. A bad answer might come from retrieval drift, a tool permission issue, a model timeout, a bad handoff, or a missing memory update. Traditional API logs do not explain that chain.",
					"This is a strong SEO lane because serious teams are now searching for AI observability, LLM tracing, agent observability, LangGraph monitoring, and production AI reliability.",
				],
			},
			{
				heading: "Architecture decision",
				body: [
					"The decision is to make observability part of the architecture, not a later dashboard. Every agent run should have a trace ID. Every graph node should expose timing and status. Every tool call should record tool name, decision reason, sanitized input, output class, and error state.",
					"Retrieval should be observable too. Track query rewriting, filters, top-k results, rerank scores, grounding coverage, and whether the final answer actually used the retrieved evidence.",
				],
			},
			{
				heading: "Production pattern",
				body: [
					"Instrument the FastAPI edge, async workers, graph runtime, model gateway, retrieval layer, and evaluation pipeline with consistent trace context. Use OpenTelemetry GenAI semantic conventions where possible so telemetry can move across vendors.",
					"Manoj's authority angle is reliability: observability is how AI teams stop arguing about hallucinations abstractly and start debugging answer quality like an engineering system.",
				],
			},
		],
		references: [
			{
				label: "OpenTelemetry GenAI semantic conventions",
				url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
			},
			{
				label: "OpenAI Agents SDK tracing",
				url: "https://openai.github.io/openai-agents-python/tracing/",
			},
			{
				label: "LangSmith observability",
				url: "https://docs.langchain.com/langsmith/observability-studio",
			},
		],
	},
	{
		slug: "context-engineering-enterprise-rag-systems",
		title:
			"Context Engineering for Enterprise RAG: From Prompt Windows to Retrieval Operating Systems",
		date: "May 2026",
		topic: "Context engineering",
		readingTime: "8 min read",
		summary:
			"A production-oriented article on context layering, memory, retrieval quality, token budgets, and governance for enterprise RAG systems.",
		seoDescription:
			"Learn context engineering patterns for enterprise RAG systems, including memory, retrieval quality, token optimization, and production governance.",
		keywords: [
			"context engineering",
			"enterprise RAG",
			"RAG infrastructure",
			"hybrid retrieval",
			"AI platform engineering",
		],
		heroTakeaway:
			"Context engineering is the operating discipline that decides what an AI system is allowed to know, remember, retrieve, compress, and spend tokens on.",
		architectureSignals: [
			"Separate system instructions, session state, retrieved evidence, and memory",
			"Measure retrieval quality before increasing context size",
			"Compress long-running context with explicit retention rules",
			"Use evaluation datasets to catch retrieval regressions",
		],
		sections: [
			{
				heading: "Why this is trending",
				body: [
					"Longer context windows did not remove the need for architecture. They made context decisions more expensive. Enterprise systems still need to choose which policies, documents, memories, tool results, and user facts deserve space in the prompt.",
					"This topic supports Manoj's strongest SEO cluster: enterprise RAG, context engineering, hybrid retrieval, RAG infrastructure, and AI platform engineering.",
				],
			},
			{
				heading: "Architecture decision",
				body: [
					"The key decision is to treat context as a layered system. Static instructions, tenant policy, user permissions, session state, retrieved evidence, tool output, and long-term memory should be assembled through explicit rules rather than dumped into one prompt.",
					"Good RAG architecture does not optimize only for recall. It balances grounding quality, latency, token cost, source freshness, privacy, and answer usefulness.",
				],
			},
			{
				heading: "Production pattern",
				body: [
					"Build a context assembly pipeline. Start with intent classification, retrieve with hybrid search, apply metadata filters, rerank, compress evidence, attach citations, and only then call the model. Record what context entered the model so failures can be replayed.",
					"The strategic message is that context engineering is becoming a platform capability. Teams that control context quality will ship more reliable AI than teams that only swap models.",
				],
			},
		],
		references: [
			{
				label: "LangGraph memory overview",
				url: "https://docs.langchain.com/oss/python/langgraph/memory",
			},
			{
				label: "Google ADK memory",
				url: "https://google.github.io/adk-docs/sessions/memory/",
			},
			{
				label: "OpenAI Responses API migration guide",
				url: "https://platform.openai.com/docs/guides/responses-vs-chat-completions",
			},
		],
	},
	{
		slug: "fastapi-ai-backends-background-reasoning-workflows",
		title:
			"FastAPI AI Backends for Background Reasoning: Queues, Polling, and Resumable Workflows",
		date: "May 2026",
		topic: "FastAPI AI backends",
		readingTime: "7 min read",
		summary:
			"An AI backend architecture brief for long-running reasoning tasks, background execution, polling APIs, queues, and production reliability.",
		seoDescription:
			"Design FastAPI AI backends for long-running reasoning workflows using queues, polling, background responses, trace IDs, and resumable execution.",
		keywords: [
			"FastAPI AI backend",
			"background AI workflows",
			"AI platform engineering",
			"long-running agents",
			"production AI systems",
		],
		heroTakeaway:
			"Long-running reasoning needs backend architecture. The user request should create a durable job, not hold a fragile HTTP connection hostage.",
		architectureSignals: [
			"Use job IDs and polling for long-running reasoning tasks",
			"Store request state, trace IDs, and model response status",
			"Separate synchronous UX from asynchronous execution",
			"Design cancellation, retry, timeout, and cost-control paths",
		],
		sections: [
			{
				heading: "Why this is trending",
				body: [
					"Reasoning models and agentic workflows often need more time than a normal web request should own. Research, planning, code analysis, document reasoning, and multi-tool workflows can run for minutes. That changes backend design.",
					"This is a high-conversion SEO topic for Manoj because it connects AI architecture with hands-on backend engineering: FastAPI AI backend, async Python, AI platform engineering, queues, observability, and deployment.",
				],
			},
			{
				heading: "Architecture decision",
				body: [
					"The decision is whether a task should be synchronous, streamed, queued, or resumable. A chat reply can stream. A multi-step agent workflow should usually create a job, persist state, emit progress, and let the frontend poll or subscribe.",
					"The backend should own cancellation, retries, trace propagation, budget checks, and partial result storage. The model provider is only one layer of that execution path.",
				],
			},
			{
				heading: "Production pattern",
				body: [
					"Use FastAPI for typed request contracts, a queue for execution, workers for model/tool orchestration, Postgres for job state, object storage for artifacts, and OpenTelemetry for trace context. Expose endpoints for create job, get status, stream events, cancel job, and fetch result.",
					"The authority angle is practical architecture: production AI teams need backend systems that absorb model latency, provider instability, and user impatience without losing state or burning unnecessary tokens.",
				],
			},
		],
		references: [
			{
				label: "OpenAI background mode",
				url: "https://platform.openai.com/docs/guides/background",
			},
			{
				label: "OpenAI Responses API reference",
				url: "https://platform.openai.com/docs/api-reference/responses",
			},
			{
				label: "Vercel AI SDK agents guide",
				url: "https://vercel.com/docs/agents",
			},
		],
	},
] as const;

export function getBlogArticle(slug: string) {
	return blogArticles.find((article) => article.slug === slug);
}

export type BlogArticle = (typeof blogArticles)[number];
