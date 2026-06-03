export const blogArticles = [
	{
		slug: "langgraph-v1-durable-agent-architecture",
		title:
			"LangGraph v1 and Durable Agent Architecture: Why Enterprise AI Needs Checkpoints",
		date: "May 2026",
		topic: "LangGraph architecture",
		readingTime: "7 min read",
		summary:
			"Production agents crash. When they do, you need checkpoints. This is how real teams build resumable workflows that survive restarts, approval delays, and API failures without replaying unsafe work.",
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
			"The enterprise agent is not a chat loop. It's a stateful workflow system with persistence, recovery semantics, human gates, and failure paths.",
		architectureSignals: [
			"Checkpoint every business-critical state transition",
			"Wrap non-deterministic side effects in replay-safe tasks",
			"Use human approval gates for irreversible tool calls",
			"Treat agent traces as production debugging artifacts",
		],
		sections: [
			{
				heading: "Why this matters",
				body: [
					"LangGraph v1 changes how we think about agent runtime. Teams moving from demo agents to production workflows realize the agent isn't just a prompt loop. It's an execution system that needs to survive timeouts, approval delays, retries, and platform restarts.",
					"The architecture shift is real: state management moves from conversation history to workflow state, tool outputs, approval status, failure context, and retry logic. That state has to be durable enough to resume execution without repeating dangerous work.",
				],
			},
			{
				heading: "The core decision: Where does state live?",
				body: [
					"A simple chat agent stores messages. A production agent stores workflow state, tool outputs, approval status, retries, failure context, and recovery paths. The difference is dramatic when an agent needs to resume after failure.",
					"Strong production architecture separates deterministic graph transitions from non-deterministic operations like LLM calls, database writes, payments, external APIs, or ticket updates. The goal isn't just recovery—it's predictable, auditable recovery.",
				],
			},
			{
				heading: "Production pattern: Graph + Checkpointer + Thread",
				body: [
					"Model the workflow as an explicit graph with nodes for planning, retrieval, tool execution, validation, human review, and response generation. Add a checkpointer before rollout, assign thread identifiers to business workflows, and make every side effect idempotent.",
					"Enterprise buyers don't want magical agents. They want to see exactly where execution paused, why a tool was called, what got approved, and how the workflow resumes. That transparency is what builds trust.",
				],
				codeBlock: {
					language: "python",
					filename: "agent_runtime.py",
					code: `from langgraph.checkpoint.postgres import PostgresSaver\nfrom langgraph.prebuilt import create_react_agent\n\n# Persistent state storage\nmemory = PostgresSaver(conn_string)\n\n# Stateful runtime with checkpoints\nagent_executor = create_react_agent(\n    model=local_ollama_model,\n    tools=[search_retrieval_tool],\n    checkpointer=memory\n)\n\n# Thread-based session continuity\nconfig = {"configurable": {"thread_id": "session-8012"}}\nfor chunk in agent_executor.stream({"messages": [("user", "Run eval")]}, config):\n    print(chunk)`
				}
			},
		],
		references: [
			{
				label: "LangGraph documentation",
				url: "https://docs.langchain.com/oss/python/langgraph",
			},
			{
				label: "Durable execution guide",
				url: "https://docs.langchain.com/oss/python/langgraph/durable-execution",
			},
			{
				label: "LangGraph v1 release",
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
			"MCP is elegant for tool integration, but it concentrates risk. Here's how to architect tool permissions, isolation boundaries, governance policies, and audit logs before you wire enterprise systems into agents.",
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
			"MCP integrates tools beautifully, but enterprise adoption requires explicit permissions, isolation, observability, and governance before you expose production systems.",
		architectureSignals: [
			"Separate trusted tools from experimental tools by isolation tier",
			"Require explicit confirmation for destructive actions",
			"Log tool metadata, inputs, outputs, decisions, and approval chains",
			"Design context boundaries before exposing enterprise systems",
		],
		sections: [
			{
				heading: "The opportunity and the risk",
				body: [
					"MCP is attractive because it standardizes how agents access tools. One protocol, multiple servers, consistent schemas. That standardization is powerful—and concentrated. A tool interface that's easy to expose is also easy to overexpose.",
					"Enterprise MCP adoption depends on getting the trust boundary right. Your MCP server isn't a plugin. It's an access layer into operational systems, data stores, documents, environments, and workflows. Treat it accordingly.",
				],
			},
			{
				heading: "Architecture decision: Risk-based tool classification",
				body: [
					"Not all tools carry the same risk. Read-only lookups, low-risk enrichment, writes, admin actions, and external communication should have different approval paths. A well-designed MCP server classifies tools by risk level and enforces guardrails accordingly.",
					"The strongest approach: start with an allowlisted tool registry, explicit schemas, environment isolation, identity-aware access, structured audit logs, and human confirmation for high-risk operations.",
				],
			},
			{
				heading: "Production pattern: Registry + Policies + Audit",
				body: [
					"Start with an allowlisted tool registry where every tool has explicit schemas, risk classification, and approval requirements. Use environment isolation to prevent bleed between sandbox, staging, and production. Make every tool call auditable.",
					"Add prompt-injection tests that simulate malicious resource content and misleading tool descriptions. The strongest MCP security posture assumes agents will try to misuse tools, and systems catch that before damage happens.",
				],
				codeBlock: {
					language: "json",
					filename: "mcp_security_policy.json",
					code: `{\n  "role": "enterprise-agent-runtime",\n  "tool_permissions": {\n    "read_only_resources": ["allow"],\n    "write_operations": ["require_approval"],\n    "administrative_actions": ["deny"]\n  },\n  "trusted_servers": [\n    "https://api.manojmukherjee.co.in/mcp"\n  ],\n  "audit": {\n    "log_all_calls": true,\n    "retain_days": 90\n  }\n}`
				}
			},
		],
		references: [
			{
				label: "MCP specification",
				url: "https://modelcontextprotocol.io/specification/2025-06-18",
			},
			{
				label: "MCP tools guide",
				url: "https://modelcontextprotocol.io/specification/2025-06-18/server/tools",
			},
			{
				label: "OpenAI Agents guardrails",
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
			"Token counts lie. Agent failures are loud but opaque. This is how production teams use OpenTelemetry semantic conventions to trace multi-agent workflows, isolate failures, and debug without guessing.",
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
				heading: "Why tracing changes everything",
				body: [
					"Agent failures aren't simple. A bad answer might come from retrieval drift, tool permissions, model timeout, bad handoff, or missing memory. Traditional logs don't explain that chain. Traces do.",
					"When you instrument every model call, tool call, retrieval step, and decision point, you stop guessing about failures and start debugging systematically.",
				],
			},
			{
				heading: "Architecture: Observability from the start",
				body: [
					"Make observability part of the system design, not a dashboard bolted on later. Every agent run gets a trace ID. Every graph node reports timing and status. Every tool call logs name, reasoning, sanitized input, output type, and errors.",
					"Retrieval becomes observable: query rewriting, metadata filters, top-k results, rerank scores, grounding coverage, whether the final answer actually used the retrieved evidence. That data is gold for debugging and improvement.",
				],
			},
			{
				heading: "Production pattern: Semantic conventions at every layer",
				body: [
					"Instrument the FastAPI edge, async workers, graph runtime, model gateway, retrieval layer, and evaluation pipeline with consistent trace context. Use OpenTelemetry GenAI semantic conventions so telemetry isn't vendor-locked.",
					"When a production agent underperforms, you want to see exactly which component failed, what decision was made, what context was available, and what the model saw. That visibility is what separates guessing from engineering.",
				],
			},
		],
		references: [
			{
				label: "OpenTelemetry GenAI spec",
				url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
			},
			{
				label: "OpenAI Agents tracing",
				url: "https://openai.github.io/openai-agents-python/tracing/",
			},
			{
				label: "LangSmith documentation",
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
			"Longer context windows changed RAG architectures completely. Here's how production teams layer system instructions, memory, evidence, and governance to build retrieval systems that actually work.",
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
			"Context engineering decides what an AI system knows, remembers, retrieves, compresses, and spends tokens on. It's an operating discipline, not a prompt hack.",
		architectureSignals: [
			"Separate system instructions, session state, retrieved evidence, and memory layers",
			"Measure retrieval quality before scaling context size",
			"Compress long-running context with explicit retention rules",
			"Use evaluation datasets to catch retrieval regressions early",
		],
		sections: [
			{
				heading: "Longer windows didn't eliminate architecture",
				body: [
					"Context windows grew, but the design problem didn't disappear—it got more expensive. Teams still need to choose which policies, documents, memories, tool results, and user facts deserve space. That choice scales with token cost.",
					"Enterprise RAG systems that work treat context as a layered system: static instructions, tenant policy, user permissions, session state, retrieved evidence, tool output, and long-term memory. Each layer enters through explicit rules.",
				],
			},
			{
				heading: "Architecture: Layered context assembly",
				body: [
					"The key decision is how to build context deliberately. Start with intent classification, retrieve with hybrid search, apply metadata filters, rerank, compress evidence, attach citations, only then call the model. Record what context entered so failures replay.",
					"Good RAG doesn't optimize only for recall. It balances grounding quality, latency, token cost, source freshness, privacy, and answer usefulness. That's systems thinking.",
				],
			},
			{
				heading: "Production pattern: Context pipeline with observability",
				body: [
					"Build a deterministic pipeline: retrieve with bm25 + semantic search, filter by metadata and access, rerank by relevance and freshness, compress if needed, attach sources, format for the model. Make every step observable and queryable.",
					"The strategic insight is that context engineering is becoming a platform capability. Teams that master context quality will ship more reliable AI than teams that chase model swaps.",
				],
			},
		],
		references: [
			{
				label: "LangGraph memory",
				url: "https://docs.langchain.com/oss/python/langgraph/memory",
			},
			{
				label: "Google ADK memory patterns",
				url: "https://google.github.io/adk-docs/sessions/memory/",
			},
			{
				label: "OpenAI Responses API",
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
			"Reasoning models need backend architecture. Your API shouldn't hold an HTTP connection hostage while the model thinks. Here's how to do async reasoning right.",
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
			"Reasoning takes time. Your API design has to reflect that. Job IDs, polling, durable state, and background execution are architecture, not optional features.",
		architectureSignals: [
			"Use job IDs and polling instead of long-held HTTP connections",
			"Store request state, trace IDs, and execution status durably",
			"Separate synchronous UX from asynchronous reasoning execution",
			"Design cancellation, retry, timeout, and cost-control paths upfront",
		],
		sections: [
			{
				heading: "Why backend architecture matters for reasoning",
				body: [
					"Reasoning models, agentic workflows, code analysis, and multi-tool research take time. Minutes, not milliseconds. That breaks the synchronous request-response model. You need backend architecture.",
					"This connects directly with enterprise AI platform engineering: FastAPI AI backends, async Python, job queues, polling patterns, observability, and cost governance.",
				],
			},
			{
				heading: "Architecture decision: When to make tasks async",
				body: [
					"Not every request needs async. Chat replies can stream back instantly. But multi-step reasoning, tool chains, document analysis, and complex research should create durable jobs. The frontend polls or subscribes for progress.",
					"The backend owns cancellation, retries, trace propagation, budget checks, and partial result storage. The model provider is one layer in the execution path, not the whole system.",
				],
			},
			{
				heading: "Production pattern: Async reasoning pipeline",
				body: [
					"Use FastAPI for typed contracts, a queue for execution, workers for orchestration, Postgres for state, object storage for artifacts, and OpenTelemetry for traces. Expose: create job, get status, stream events, cancel, fetch result.",
					"The production reality is that teams need backend systems that absorb model latency, provider instability, user impatience, and token budgets without losing state or creating ghost costs.",
				],
			},
		],
		references: [
			{
				label: "OpenAI background tasks",
				url: "https://platform.openai.com/docs/guides/background",
			},
			{
				label: "OpenAI Responses API",
				url: "https://platform.openai.com/docs/api-reference/responses",
			},
			{
				label: "Vercel AI SDK agents",
				url: "https://vercel.com/docs/agents",
			},
		],
	},
] as const;

export function getBlogArticle(slug: string) {
	return blogArticles.find((article) => article.slug === slug);
}

export type BlogArticle = (typeof blogArticles)[number];
