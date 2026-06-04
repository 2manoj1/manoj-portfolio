export const blogArticles = [
	{
		slug: "langgraph-v1-durable-agent-architecture",
		title: "Durable Agent Architecture with LangGraph v1",
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
					"> \"State management is the single hardest problem in distributed agent systems. If you do not checkpoint, you do not have an architecture; you have a hope.\" — Manoj Mukherjee",
					"The architecture shift is real: state management moves from conversation history to workflow state, tool outputs, approval status, failure context, and retry logic. That state has to be durable enough to resume execution without repeating dangerous work.",
					"[!IMPORTANT] Checkpointing introduces database IO overhead. Optimize connection pools and serialize only state deltas rather than the full context history.",
				],
			},
			{
				heading: "The core decision: Where does state live?",
				body: [
					"A simple chat agent stores messages. A production agent stores workflow state, tool outputs, approval status, retries, failure context, and recovery paths. The difference is dramatic when an agent needs to resume after failure.",
					"| State surface | Production concern |\n| --- | --- |\n| Conversation messages | Replay safety and memory boundaries |\n| Tool outputs | Idempotency and auditability |\n| Approval status | Human gate recovery after delays |\n| Failure context | Retry policy and incident triage |",
					"Strong production architecture separates deterministic graph transitions from non-deterministic operations like LLM calls, database writes, payments, external APIs, or ticket updates. The goal isn't just recovery—it's predictable, auditable recovery.",
				],
			},
			{
				heading: "Production pattern: Graph + Checkpointer + Thread",
				body: [
					"Model the workflow as an explicit graph with nodes for planning, retrieval, tool execution, validation, human review, and response generation. Add a checkpointer before rollout, assign thread identifiers to business workflows, and make every side effect idempotent.",
					"Enterprise buyers don't want magical agents. They want to see exactly where execution paused, why a tool was called, what got approved, and how the workflow resumes. That transparency is what builds trust.",
				],
				diagram: {
					title: "Durable Lifecycle State Flow",
					summary:
						"A replay-safe agent runtime keeps deterministic graph state separate from external side effects, then resumes from checkpoints instead of repeating unsafe work.",
					nodes: [
						{
							id: "ingress",
							label: "Client Ingress",
							role: "Request boundary",
							detail: "Normalizes user intent, identity, tenant policy, and trace context before graph execution.",
							layer: "Ingress",
							kind: "client",
						},
						{
							id: "supervisor",
							label: "LangGraph Supervisor",
							role: "State machine",
							detail: "Routes graph nodes, persists checkpoints, and owns recovery semantics for the workflow.",
							layer: "Runtime",
							kind: "runtime",
						},
						{
							id: "tool-exec",
							label: "Tool Execution",
							role: "Side-effect boundary",
							detail: "Runs retrieval, API calls, and writes through idempotent adapters with trace metadata.",
							layer: "Tools",
							kind: "data",
						},
						{
							id: "approval",
							label: "Human Approval Gate",
							role: "Control point",
							detail: "Pauses irreversible actions until a reviewer approves, rejects, or amends execution.",
							layer: "Governance",
							kind: "approval",
						},
						{
							id: "commit",
							label: "State Commit",
							role: "Durable checkpoint",
							detail: "Stores final state deltas, audit logs, and resume pointers for the next run.",
							layer: "Persistence",
							kind: "commit",
						},
					],
					edges: [
						{ source: "ingress", target: "supervisor", label: "start thread" },
						{ source: "supervisor", target: "tool-exec", label: "execute node" },
						{ source: "tool-exec", target: "approval", label: "pause if risky" },
						{ source: "approval", target: "commit", label: "approved delta" },
					],
				},
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
		title: "MCP Security Architecture & Enterprise Guardrails",
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
					"> \"Exposing a local terminal tool to an agent without a strict virtualization sandbox is equivalent to handing a root shell to a random caller.\" — Enterprise Security Audit Guideline",
					"Enterprise MCP adoption depends on getting the trust boundary right. Your MCP server isn't a plugin. It's an access layer into operational systems, data stores, documents, environments, and workflows. Treat it accordingly.",
					"[!WARNING] Do not allow administrative tools to auto-execute. Always require explicit human authorization gates for operations involving deletions, payments, or cloud infrastructure alterations.",
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
				diagram: {
					title: "MCP Guardrail Runtime",
					summary:
						"Every tool call moves through classification, policy enforcement, approval, and audit logging before touching enterprise systems.",
					nodes: [
						{
							id: "agent",
							label: "Agent Runtime",
							role: "Tool caller",
							detail: "Requests MCP tools with user intent, session identity, and trace context.",
							layer: "Agent",
							kind: "runtime",
						},
						{
							id: "registry",
							label: "Tool Registry",
							role: "Allowlist",
							detail: "Stores schemas, owners, environments, and risk tiers for every exposed tool.",
							layer: "Catalog",
							kind: "data",
						},
						{
							id: "policy",
							label: "Policy Engine",
							role: "Decision point",
							detail: "Checks role, tenant, operation class, and approval requirements before execution.",
							layer: "Governance",
							kind: "approval",
						},
						{
							id: "audit",
							label: "Audit Trail",
							role: "Evidence store",
							detail: "Captures sanitized inputs, outputs, approvals, failures, and tool metadata.",
							layer: "Observability",
							kind: "commit",
						},
					],
					edges: [
						{ source: "agent", target: "registry", label: "schema lookup" },
						{ source: "registry", target: "policy", label: "risk tier" },
						{ source: "policy", target: "audit", label: "decision log" },
					],
				},
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
		title: "GenAI Observability with OpenTelemetry Traces",
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
					"> \"If you can't trace it, you can't improve it. Traditional application logging is blind to multi-agent reasoning chains.\" — Observability Whitepaper",
					"When you instrument every model call, tool call, retrieval step, and decision point, you stop guessing about failures and start debugging systematically.",
					"[!TIP] Propagate a single global trace ID from your Next.js client request down to FastAPI gateway, LangGraph supervisor nodes, and vector search operations to construct a unified view of latency budget.",
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
				diagram: {
					title: "Trace Context Propagation",
					summary:
						"GenAI observability works when every runtime boundary forwards the same trace context and emits typed spans.",
					nodes: [
						{
							id: "client",
							label: "Next.js Client",
							role: "Trace origin",
							detail: "Creates user-visible request context and displays streamed status.",
							layer: "Client",
							kind: "client",
						},
						{
							id: "api",
							label: "FastAPI Gateway",
							role: "Span boundary",
							detail: "Validates identity, starts server spans, and forwards trace headers.",
							layer: "Gateway",
							kind: "runtime",
						},
						{
							id: "graph",
							label: "Agent Graph",
							role: "Workflow spans",
							detail: "Emits spans for planning, retrieval, tools, model calls, and routing decisions.",
							layer: "Runtime",
							kind: "runtime",
						},
						{
							id: "collector",
							label: "OTel Collector",
							role: "Telemetry sink",
							detail: "Receives normalized GenAI semantic spans for debugging and regression analysis.",
							layer: "Observability",
							kind: "commit",
						},
					],
					edges: [
						{ source: "client", target: "api", label: "traceparent" },
						{ source: "api", target: "graph", label: "run context" },
						{ source: "graph", target: "collector", label: "semantic spans" },
					],
				},
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
		title: "Context Engineering for Enterprise RAG",
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
					"[!NOTE] Grounding validation should be executed locally using lightweight models (e.g. LLaVA or fine-tuned local models) before query rollout to save API token costs.",
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
				diagram: {
					title: "Layered Context Assembly",
					summary:
						"Reliable RAG treats context as a governed pipeline, not a single prompt string.",
					nodes: [
						{
							id: "intent",
							label: "Intent Router",
							role: "Query planning",
							detail: "Classifies task type, permissions, freshness needs, and retrieval strategy.",
							layer: "Plan",
							kind: "runtime",
						},
						{
							id: "retrieval",
							label: "Hybrid Retrieval",
							role: "Evidence search",
							detail: "Combines BM25, vectors, metadata filters, and access control.",
							layer: "Retrieve",
							kind: "data",
						},
						{
							id: "rerank",
							label: "Rerank + Compress",
							role: "Context budget",
							detail: "Keeps grounded evidence while reducing token cost and noise.",
							layer: "Optimize",
							kind: "runtime",
						},
						{
							id: "answer",
							label: "Grounded Response",
							role: "Cited output",
							detail: "Assembles policy, memory, evidence, and answer format into the final call.",
							layer: "Generate",
							kind: "commit",
						},
					],
					edges: [
						{ source: "intent", target: "retrieval", label: "strategy" },
						{ source: "retrieval", target: "rerank", label: "candidates" },
						{ source: "rerank", target: "answer", label: "grounded context" },
					],
				},
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
		title: "FastAPI AI Backends for Background Reasoning",
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
					"[!CAUTION] Long-running HTTP connections are prone to timeout drops due to edge proxy limits (like Cloudflare or AWS ALB). Always use job queues, status checking endpoints, or WebSockets.",
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
				diagram: {
					title: "Async Reasoning Backend",
					summary:
						"Long-running AI work should move through durable jobs, workers, and status APIs instead of held HTTP requests.",
					nodes: [
						{
							id: "api",
							label: "FastAPI Edge",
							role: "Typed contract",
							detail: "Accepts requests, returns job IDs, and exposes status/cancel/result endpoints.",
							layer: "API",
							kind: "client",
						},
						{
							id: "queue",
							label: "Durable Queue",
							role: "Backpressure",
							detail: "Buffers reasoning work, controls concurrency, and supports retries.",
							layer: "Queue",
							kind: "data",
						},
						{
							id: "worker",
							label: "Agent Worker",
							role: "Execution",
							detail: "Runs model calls, tool chains, evaluation, and artifact generation.",
							layer: "Runtime",
							kind: "runtime",
						},
						{
							id: "state",
							label: "Job State Store",
							role: "Recovery",
							detail: "Stores progress, partial outputs, trace IDs, errors, and final artifacts.",
							layer: "Persistence",
							kind: "commit",
						},
					],
					edges: [
						{ source: "api", target: "queue", label: "enqueue" },
						{ source: "queue", target: "worker", label: "dispatch" },
						{ source: "worker", target: "state", label: "status + result" },
					],
				},
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
