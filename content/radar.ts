export type RadarItem = {
	id: string;
	name: string;
	quadrant: "Orchestration" | "Models" | "Data" | "Platform";
	ring: "Adopt" | "Trial" | "Assess" | "Hold";
	radius: number; // Polar distance from center (0 to 180)
	angle: number;  // Polar angle in degrees (0 to 360)
	verdict: string;
	insight: string;
	adr?: {
		problem: string;
		decision: string;
		tradeoff: string;
	};
};

export const radarQuadrants = {
	Orchestration: { name: "AI Orchestration", angleStart: 0, angleEnd: 90 },
	Models: { name: "Inference & Models", angleStart: 90, angleEnd: 180 },
	Data: { name: "Data & Ingress", angleStart: 180, angleEnd: 270 },
	Platform: { name: "Platform & Frontend", angleStart: 270, angleEnd: 360 }
} as const;

export const radarRings = {
	Adopt: { name: "Adopt (Production)", radius: 45, description: "Core technologies shipped in enterprise projects with high confidence." },
	Trial: { name: "Trial (Active POCs)", radius: 95, description: "Actively tested in local labs, verified in proof-of-concept builds." },
	Assess: { name: "Assess (Researching)", radius: 145, description: "Emerging tech, research papers read, currently exploring architecture fit." },
	Hold: { name: "Hold (De-prioritized)", radius: 175, description: "Outdated patterns or tools bypassed in favor of robust solutions." }
} as const;

export const radarItems: RadarItem[] = [
	// Quadrant 1: AI Orchestration (0 - 90 degrees)
	{
		id: "langgraph",
		name: "LangGraph",
		quadrant: "Orchestration",
		ring: "Adopt",
		radius: 32,
		angle: 20,
		verdict: "Adopt (Production-Ready)",
		insight: "Manoj's primary choice for building stateful multi-agent systems. The checkpointer persistence pattern is vital for banking and business workflows.",
		adr: {
			problem: "Single-prompt loops fail on multi-step reasoning, resulting in brittle tool executions.",
			decision: "Deploy LangGraph to model agent transitions as deterministic state machines with persistence layers.",
			tradeoff: "Requires explicit state modeling in exchange for predictable, resumable execution paths."
		}
	},
	{
		id: "langchain",
		name: "LangChain",
		quadrant: "Orchestration",
		ring: "Adopt",
		radius: 43,
		angle: 45,
		verdict: "Adopt (Utility Standard)",
		insight: "Strong integration tooling for prompt routing, document loading, and embedding extraction utility functions.",
		adr: {
			problem: "Building custom document parsers, chunking runners, and API wrappers slows development velocity.",
			decision: "Standardize on LangChain's integration ecosystem to orchestrate basic retrieval scaffolding.",
			tradeoff: "Adds package dependency weight for faster initial POC velocity."
		}
	},
	{
		id: "google-adk",
		name: "Google ADK",
		quadrant: "Orchestration",
		ring: "Adopt",
		radius: 40,
		angle: 65,
		verdict: "Adopt (Enterprise Agentic)",
		insight: "Google Antigravity SDK. Manoj utilizes its agentic state boundaries and collaborative memory pipelines for multi-agent setups.",
		adr: {
			problem: "Scaling agent collaboration across independent runtime blocks creates communication boundaries.",
			decision: "Standardize on Google Antigravity SDK to manage state-sharing nodes and agent execution boundaries.",
			tradeoff: "Ties agent logic to the Google AGY SDK ecosystem guidelines."
		}
	},
	{
		id: "mcp",
		name: "MCP Schemas",
		quadrant: "Orchestration",
		ring: "Adopt",
		radius: 35,
		angle: 15,
		verdict: "Adopt (Tool Protocol)",
		insight: "Model Context Protocol. Standardizes server-client tool execution. Deployed inside secure gateways to manage allowlisted system utilities.",
		adr: {
			problem: "Custom-coding API tool specs for each new model runner creates integration boundaries.",
			decision: "Utilize Anthropic's Model Context Protocol (MCP) to standardize tool inputs and outputs.",
			tradeoff: "Requires running distinct MCP server runtimes next to vector layers."
		}
	},
	{
		id: "n8n",
		name: "n8n Workflows",
		quadrant: "Orchestration",
		ring: "Adopt",
		radius: 42,
		angle: 30,
		verdict: "Adopt (Low-Code Automation)",
		insight: "Workflow automation tool. Manoj deploys n8n to choreograph simple webhook-based node automations, saving LangGraph for complex state logic.",
		adr: {
			problem: "Writing raw Python script loops for simple API notification webhooks burns valuable developer cycles.",
			decision: "Orchestrate basic event-driven pipelines using n8n container clusters.",
			tradeoff: "Limits state inspection depth compared to pure-code LangGraph nodes."
		}
	},
	{
		id: "langsmith",
		name: "LangSmith",
		quadrant: "Orchestration",
		ring: "Adopt",
		radius: 38,
		angle: 80,
		verdict: "Adopt (Tracing & Eval)",
		insight: "Manoj standardizes on LangSmith for agent trace visualization and regression test suites. Critical for debugging complex multi-agent LangGraph loops.",
		adr: {
			problem: "Observing multi-agent tool execution paths and prompt latency bottlenecks in production is impossible without central trace logging.",
			decision: "Standardize on LangSmith for structured agent trace aggregation and execution graph logging.",
			tradeoff: "Increases operational costs due to trace ingestion fees, but reduces debug time by 80%."
		}
	},
	{
		id: "pydantic-ai",
		name: "Pydantic AI (POC)",
		quadrant: "Orchestration",
		ring: "Trial",
		radius: 85,
		angle: 55,
		verdict: "Trial (Active POC)",
		insight: "Agent framework from Pydantic. Manoj runs active lab tests on typed prompt construction and dependency injection configurations.",
		adr: {
			problem: "Managing unstructured, non-typed prompts inside LLM tool calling loops leads to runtime validation failures.",
			decision: "Evaluate Pydantic AI for strict runtime typing and dependency injection across python agents.",
			tradeoff: "Early stage framework featuring possible API design updates."
		}
	},
	{
		id: "mcp-app",
		name: "MCPApp (POC)",
		quadrant: "Orchestration",
		ring: "Trial",
		radius: 92,
		angle: 75,
		verdict: "Trial (Active POC)",
		insight: "Model Context Protocol application runner. Manoj designs POCs to orchestrate multiple MCP servers from a single config file.",
		adr: {
			problem: "Scaling independent MCP server instances requires complex custom routing configuration.",
			decision: "Run MCPApp to package, spin up, and route local MCP daemons through one unified config layer.",
			tradeoff: "Binds execution paths to a specialized community runner."
		}
	},
	{
		id: "webmcp",
		name: "WebMCP (Beta)",
		quadrant: "Orchestration",
		ring: "Trial",
		radius: 70,
		angle: 40,
		verdict: "Trial (Beta Extension)",
		insight: "Browser-native MCP model integrations. Tested for routing client context schemas natively from Chrome scripts.",
		adr: {
			problem: "Client browser applications cannot fetch local workspace resources directly due to security sandboxes.",
			decision: "Integrate WebMCP protocol nodes to bridge client context arrays via allowlisted browser tunnels.",
			tradeoff: "Ties extension logic to early-stage experimental browser specifications."
		}
	},
	{
		id: "acp-ucp",
		name: "ACP / UCP Patterns",
		quadrant: "Orchestration",
		ring: "Trial",
		radius: 88,
		angle: 25,
		verdict: "Trial (Context Standard)",
		insight: "Agent/Unified Context Protocol patterns. Manoj tests these standard metadata schemas for passing context securely between model layers.",
		adr: {
			problem: "Custom-coding context parsing formats across disjoint multi-agent frameworks causes translation bottlenecks.",
			decision: "Deploy ACP/UCP payload mappings to unify long-term memory parameters.",
			tradeoff: "Adds serialization overhead to agent network communication steps."
		}
	},
	{
		id: "mlflow",
		name: "MLflow",
		quadrant: "Orchestration",
		ring: "Trial",
		radius: 75,
		angle: 35,
		verdict: "Trial (LLM Ops Registry)",
		insight: "Evaluating MLflow's tracking server and prompt registry pipelines for offline model metric evaluations and regression tracking.",
		adr: {
			problem: "Tracking custom model runs and prompt iteration metrics offline lacks version-controlled registries.",
			decision: "Deploy MLflow container instances to record experiment metrics and track prompting versions.",
			tradeoff: "Requires hosting dedicated MLflow tracking servers and SQL database backends."
		}
	},
	{
		id: "autogen",
		name: "Microsoft AutoGen",
		quadrant: "Orchestration",
		ring: "Assess",
		radius: 135,
		angle: 70,
		verdict: "Assess",
		insight: "Analyzing AutoGen's conversational multi-agent loops to compare its event-driven dispatching with LangGraph's state charts."
	},
	{
		id: "sync-rest-agents",
		name: "Sync REST Agents",
		quadrant: "Orchestration",
		ring: "Hold",
		radius: 170,
		angle: 80,
		verdict: "Hold",
		insight: "Synchronous HTTP timeouts occur under multi-step LLM reasoning. Replaced with async worker queues (Celery/Redis) and polling endpoints."
	},

	// Quadrant 2: Inference & Models (90 - 180 degrees)
	{
		id: "claude-sonnet",
		name: "Claude 3.5 Sonnet",
		quadrant: "Models",
		ring: "Adopt",
		radius: 30,
		angle: 110,
		verdict: "Adopt (Production-Ready)",
		insight: "Manoj's primary enterprise model for complex logic, code generation, and strict JSON output compliance in production workflows.",
		adr: {
			problem: "Standard LLMs output malformed JSON responses that break parsing steps.",
			decision: "Deploy Claude 3.5 Sonnet as the primary backend agent model for structured tool selection.",
			tradeoff: "Higher API token expense compared to lightweight models."
		}
	},
	{
		id: "gpt-4o",
		name: "GPT-4o",
		quadrant: "Models",
		ring: "Adopt",
		radius: 40,
		angle: 135,
		verdict: "Adopt (Multimodal Prod)",
		insight: "Excellent multimodal capabilities. Manoj serves it as a redundant smart-routing backup provider for structured API loops.",
		adr: {
			problem: "Commercial API single-point-of-failure risk (outages or throttling limits).",
			decision: "Integrate GPT-4o as a redundant smart-routing backup provider for Claude.",
			tradeoff: "Requires maintaining dual system instructions and prompt templates."
		}
	},
	{
		id: "llama3-2",
		name: "Llama 3.2",
		quadrant: "Models",
		ring: "Adopt",
		radius: 43,
		angle: 155,
		verdict: "Adopt (Local classify)",
		insight: "High-performance small language model (SLM). Manoj hosts Llama-3.2 edge runtimes for secure low-complexity classification checks.",
		adr: {
			problem: "Routing minor token checks (e.g. spam check, routing) to paid cloud LLMs generates high operational costs.",
			decision: "Host local Llama 3.2 instances on edge hardware to resolve small classification passes.",
			tradeoff: "Requires maintaining local hardware availability and model configurations."
		}
	},
	{
		id: "gemini-models",
		name: "Google Gemini 2.0",
		quadrant: "Models",
		ring: "Adopt",
		radius: 35,
		angle: 120,
		verdict: "Adopt (Context Scale)",
		insight: "Gemini models are Manoj's standard for ultra-low latency structured reasoning, long-context ingestion (up to 2M tokens), and multi-modal audio inputs.",
		adr: {
			problem: "Analyzing huge documents (e.g. 500-page corporate files) exceeds traditional 128k context limits, forcing complex chunking steps.",
			decision: "Deploy Gemini Pro APIs to ingest massive context windows natively without layout chunking loss.",
			tradeoff: "Ties long-context parsing pipelines to Google Vertex AI API availability."
		}
	},
	{
		id: "qwen-models",
		name: "Qwen 2.5 Coder",
		quadrant: "Models",
		ring: "Adopt",
		radius: 44,
		angle: 100,
		verdict: "Adopt (Local Code LLM)",
		insight: "Manoj's primary choice for local coding assistance and offline tool calling. Performs on-par with proprietary code models on edge hardware.",
		adr: {
			problem: "Sending sensitive corporate source code to external public APIs violates data compliance rules.",
			decision: "Orchestrate local Qwen 2.5 Coder models on unified memory hardware for secure, offline code checking.",
			tradeoff: "Binds performance to local GPU cluster availability and VRAM memory limits."
		}
	},
	{
		id: "vertex-ai-models",
		name: "GCP Vertex AI",
		quadrant: "Models",
		ring: "Adopt",
		radius: 32,
		angle: 145,
		verdict: "Adopt (Enterprise Hub)",
		insight: "Manoj hosts secure Gemini API pipelines, fine-tuned models, and enterprise routing hubs inside Google Cloud security boundaries.",
		adr: {
			problem: "Managing raw public API endpoints for corporate applications violates enterprise compliance policies.",
			decision: "Deploy foundation models inside GCP Vertex AI to enforce IAM permissions and VPC firewalls.",
			tradeoff: "Locks system orchestration to Google Cloud API endpoints and compute limits."
		}
	},
	{
		id: "aws-bedrock-models",
		name: "AWS Bedrock",
		quadrant: "Models",
		ring: "Adopt",
		radius: 38,
		angle: 175,
		verdict: "Adopt (AWS Ecosystem)",
		insight: "Manoj deploys Bedrock agent endpoints for secure, client-isolated model runs within AWS enterprise networking zones.",
		adr: {
			problem: "Clients running core infrastructure inside AWS VPCs reject external routing of prompt vectors.",
			decision: "Provision LLMs natively through AWS Bedrock to preserve data residency within client accounts.",
			tradeoff: "Subject to region availability of specific model weights (e.g. Claude)."
		}
	},
	{
		id: "ollama-vllm",
		name: "Ollama / vLLM",
		quadrant: "Models",
		ring: "Adopt",
		radius: 42,
		angle: 165,
		verdict: "Adopt (Local Serving)",
		insight: "Serving engines in production. Manoj routes queries to edge hardware and self-hosted GPU nodes without public API fees.",
		adr: {
			problem: "Deploying raw GGUF or SafeTensors files requires writing custom concurrency and queuing scripts.",
			decision: "Standardize on Ollama for local local checks, and vLLM for high-throughput model serving nodes.",
			tradeoff: "Requires active monitoring of GPU server node parameters and concurrency loads."
		}
	},
	{
		id: "deepseek-r1",
		name: "DeepSeek-R1",
		quadrant: "Models",
		ring: "Adopt",
		radius: 36,
		angle: 130,
		verdict: "Adopt (Reasoner)",
		insight: "Manoj integrates DeepSeek-R1 in production to output reasoning tokens, validating steps before final tool selections.",
		adr: {
			problem: "Complex algorithmic validations and code synthesis queries fail on standard semantic models.",
			decision: "Deploy DeepSeek-R1 API nodes to enforce mathematical code validations in agent logic pipelines.",
			tradeoff: "High reasoning token latency counts require asynchronous queue handling."
		}
	},
	{
		id: "deepseek-v3",
		name: "DeepSeek-V3",
		quadrant: "Models",
		ring: "Adopt",
		radius: 41,
		angle: 150,
		verdict: "Adopt (Low-Cost MoE)",
		insight: "Used in production. Manoj routes secondary classifier routing operations to DeepSeek MoE nodes to reduce operational costs.",
		adr: {
			problem: "High-throughput classification runs balloon operational API costs on premium models.",
			decision: "Route high-frequency parsing calls to DeepSeek-V3 endpoints due to highly competitive MoE pricing.",
			tradeoff: "Requires managing custom API routers and handling occasional server load-shedding."
		}
	},
	{
		id: "gemini-nano",
		name: "Gemini Nano",
		quadrant: "Models",
		ring: "Trial",
		radius: 80,
		angle: 115,
		verdict: "Trial (Chrome AI)",
		insight: "Chrome Built-in AI. Manoj tests Gemini Nano edge nodes inside extensions to summarize client text natively without network costs.",
		adr: {
			problem: "Running light NLP checks (summarizing, grammar checks) over the network causes latency lags and security audits.",
			decision: "Route basic text manipulation requests directly to Chrome's built-in window.ai API.",
			tradeoff: "API specs remain experimental and subject to Google Chrome browser updates."
		}
	},
	{
		id: "kimi-models",
		name: "Moonshot Kimi v2",
		quadrant: "Models",
		ring: "Assess",
		radius: 130,
		angle: 140,
		verdict: "Assess (Extended Context)",
		insight: "Moonshot AI's latest model. Reviewing its 2M+ context window retrieval needle-in-a-heap benchmark metrics for comparison with Gemini."
	},

	// Quadrant 3: Data & Ingress (180 - 270 degrees)
	{
		id: "pgvector",
		name: "pgvector",
		quadrant: "Data",
		ring: "Adopt",
		radius: 35,
		angle: 200,
		verdict: "Adopt (Relational Vector)",
		insight: "Vector index inside PostgreSQL. Manoj standardizes on pgvector to avoid double-writing data across isolated document and vector stores.",
		adr: {
			problem: "Synchronizing state modifications between separate relational DBs and vector databases creates consistency lags.",
			decision: "Standardize on pgvector inside the existing PostgreSQL container schema.",
			tradeoff: "Higher database server memory footprint (RAM) requirements."
		}
	},
	{
		id: "fastapi",
		name: "FastAPI",
		quadrant: "Data",
		ring: "Adopt",
		radius: 30,
		angle: 245,
		verdict: "Adopt (Async Gateway)",
		insight: "Async Python web server. The backbone of Manoj's gateway services, enforcing input/output schemas in milliseconds via Pydantic.",
		adr: {
			problem: "Unvalidated request payloads trigger runtime script failures deep inside agent orchestration nodes.",
			decision: "Expose all backend interfaces using FastAPI with strict Pydantic model contracts.",
			tradeoff: "Requires documenting typed schemas for all incoming client data."
		}
	},
	{
		id: "mongodb",
		name: "MongoDB",
		quadrant: "Data",
		ring: "Adopt",
		radius: 42,
		angle: 210,
		verdict: "Adopt (Document Store)",
		insight: "Enterprise document storage. Stores structured JSON data and document metadata for large-scale retrieval applications.",
		adr: {
			problem: "Polymorphic document models require frequent schema migrations and alterations in relational structures.",
			decision: "Utilize MongoDB to serve unstructured document inputs and maintain trace log metadata sheets.",
			tradeoff: "Does not support native ACID multi-table joins as cleanly as PostgreSQL."
		}
	},
	{
		id: "qdrant",
		name: "Qdrant",
		quadrant: "Data",
		ring: "Trial",
		radius: 80,
		angle: 190,
		verdict: "Trial (Dedicated Vector)",
		insight: "High-performance vector search engine. Selected when vector dimensions exceed 1536 and require sub-10ms search metrics."
	},

	// Quadrant 4: Platform & Frontend (270 - 360 degrees)
	{
		id: "nextjs",
		name: "Next.js",
		quadrant: "Platform",
		ring: "Adopt",
		radius: 30,
		angle: 285,
		verdict: "Adopt (App Router)",
		insight: "Manoj's primary frontend framework. Next.js App Router, SSR, and dynamic streaming modules drive technical credibility.",
		adr: {
			problem: "Legacy client-rendered SPAs display slow Initial Page Loads and weak SEO indexing.",
			decision: "Standardize all technical authority pages on the Next.js App Router with Server Components.",
			tradeoff: "Requires managing server/client rendering boundaries."
		}
	},
	{
		id: "module-federation",
		name: "Module Federation",
		quadrant: "Platform",
		ring: "Adopt",
		radius: 43,
		angle: 345,
		verdict: "Adopt (Microfrontends)",
		insight: "Distributed frontend standard. Manoj routes microfrontends independently to decrease initial page weight and load times by 30%.",
		adr: {
			problem: "Monolithic frontend builds slow down CI/CD testing runs and block independent team deployments.",
			decision: "Orchestrate federated frontend runtimes using Webpack Module Federation specs.",
			tradeoff: "Requires establishing strict API contract boundaries between independent shells."
		}
	},
	{
		id: "kubernetes",
		name: "Kubernetes",
		quadrant: "Platform",
		ring: "Adopt",
		radius: 41,
		angle: 295,
		verdict: "Adopt (Container Ops)",
		insight: "Robust container management. Deployed to manage FastAPI services, queue workers, and databases in enterprise clouds.",
		adr: {
			problem: "Scaling isolated FastAPI agent containers manually under load spikes triggers downtime risks.",
			decision: "Standardize container orchestration on Kubernetes with Horizontal Pod Autoscaling (HPA).",
			tradeoff: "High configuration complexity (YAML layers) and container networking overhead."
		}
	},
	{
		id: "openshift",
		name: "OpenShift",
		quadrant: "Platform",
		ring: "Adopt",
		radius: 44,
		angle: 315,
		verdict: "Adopt (Enterprise K8s)",
		insight: "Red Hat enterprise platform. Manoj hosts secure AI workloads with strict network firewall isolation.",
		adr: {
			problem: "Standard Kubernetes builds lack built-in security auditing and secure out-of-the-box registry pipelines.",
			decision: "Deploy critical workloads inside Red Hat OpenShift Container Platform.",
			tradeoff: "Higher license costs and locked dependencies to Red Hat ecosystem tools."
		}
	},
	{
		id: "nvidia-runai",
		name: "NVIDIA Run:AI",
		quadrant: "Platform",
		ring: "Adopt",
		radius: 42,
		angle: 335,
		verdict: "Adopt (GPU Orchestration)",
		insight: "GPU resource orchestrator. Manages GPU virtualization slices to maximize training/inference compute speeds across teams.",
		adr: {
			problem: "Static GPU assignment causes hardware idle time across distributed AI engineering teams.",
			decision: "Orchestrate GPU partitions dynamically using NVIDIA Run:AI schedules.",
			tradeoff: "Requires hosting specialized cluster controller nodes."
		}
	}
];
