export const siteConfig = {
	name: "Manoj Mukherjee",
	url: "https://www.manojmukherjee.co.in",
	title: "Manoj Mukherjee | AI Architect Consultant",
	description:
		"CTO-grade AI Architect Consultant for production RAG infrastructure, LangGraph multi-agent systems, FastAPI AI backends, and AI platform engineering.",
	location: "Bengaluru, India",
	role: "AI Architect Consultant",
	email: "info@manojmukherjee.co.in",
	profileLinks: {
		linkedin: "https://www.linkedin.com/in/manojmukherjee777/",
		github: "https://github.com/2manoj1",
		twitter: "https://twitter.com/2manoj1",
		medium: "https://manojmukherjee777.medium.com/",
		googleScholar: "https://scholar.google.com/citations?user=abcd1234"
	},
};

export const proofMetrics = [
	{ value: "10+", label: "years enterprise engineering" },
	{ value: "AI L2", label: "Publicis Sapient AI Engineer certification" },
	{ value: "69.7K", label: "technical impressions in 12 months" },
	{ value: "2.8K", label: "LinkedIn technical audience" },
];

export const productionSignals = [
	{
		label: "Enterprise AI platforms",
		value:
			"Agentic RAG, multi-agent orchestration, and AI-native workflows for enterprise adoption.",
	},
	{
		label: "Retrieval infrastructure",
		value:
			"Hybrid search, pgvector patterns, contextual retrieval, and long-term memory pipelines.",
	},
	{
		label: "AI backend systems",
		value:
			"FastAPI microservices, async Python, typed APIs, deployment topology, and observability paths.",
	},
	{
		label: "Platform delivery",
		value:
			"Kubernetes, OpenShift, Vertex AI, NVIDIA Run:AI, vLLM, Ollama, and cloud-native execution.",
	},
];

export const architectureBlueprint = [
	{
		category: "Strategy",
		step: "Business workflow",
		detail:
			"Define operational workflows, user journeys, constraints, and measurable success criteria before selecting models or orchestration patterns.",
	},
	{
		category: "RAG",
		step: "Retrieval layer",
		detail:
			"Design corpus strategy, chunking pipelines, hybrid retrieval, pgvector indexing, memory systems, and grounding architecture.",
	},
	{
		category: "Agents",
		step: "Agent runtime",
		detail:
			"Model LangGraph state transitions, tool permissions, retries, checkpoints, memory boundaries, and human approval gates.",
	},
	{
		category: "Backend",
		step: "AI backend",
		detail:
			"Expose FastAPI services, async workers, queues, traces, observability pipelines, and integration contracts for production workloads.",
	},
	{
		category: "Reliability",
		step: "Evaluation loop",
		detail:
			"Continuously track answer quality, retrieval regressions, hallucination patterns, latency, token cost, and operational failure modes.",
	},
	{
		category: "Platform",
		step: "Deployment path",
		detail:
			"Deploy across cloud infrastructure, containers, model runtimes, observability systems, CI/CD pipelines, and operational handoff workflows.",
	},
];

export const stackKeywords = [
	"LangGraph",
	"Google ADK",
	"MCP / ACP / UCP",
	"Agentic RAG",
	"pgvector",
	"FastAPI",
	"Next.js",
	"Vertex AI",
	"AWS / GCP",
	"NVIDIA Run:AI",
	"OpenShift",
	"Kubernetes",
	"vLLM",
	"Ollama",
	"AI observability",
];

export const services = [
	{
		slug: "ai-architecture-advisory",
		title: "AI Architecture Advisory",
		shortTitle: "Architecture Advisory",
		buyerPain:
			"AI roadmap is moving faster than the architecture decisions behind it.",
		description:
			"Senior architecture guidance for teams moving AI products from vague ambition to production operating model.",
		outcomes: [
			"Clarify system boundaries, platform choices, and delivery risk",
			"Define POC-to-production roadmap for AI-native products",
			"Review reliability, governance, evaluation, and deployment strategy",
		],
		depth:
			"Architecture audits, technical decision records, vendor evaluation, roadmap sequencing, and leadership alignment.",
		idealClient: "CTOs, founders, engineering leaders, and AI platform teams.",
		keywords: [
			"AI Architect Consultant",
			"AI Architecture Advisory",
			"AI Platform Strategy",
		],
	},
	{
		slug: "langgraph-consultant",
		title: "LangGraph Consultant",
		shortTitle: "LangGraph Systems",
		buyerPain:
			"Agent workflows work in demos but become opaque, brittle, or hard to debug in production.",
		description:
			"Design agentic workflows with explicit state, routing, memory, fallbacks, and human-in-the-loop control.",
		outcomes: [
			"Model agent workflows as debuggable state machines",
			"Reduce brittle tool-calling and hidden orchestration behavior",
			"Build evaluation paths for multi-agent reliability",
		],
		depth:
			"LangGraph graphs, planner/executor patterns, tool routing, checkpoints, memory, retries, and observability.",
		idealClient: "AI product teams building agent workflows beyond simple chat.",
		keywords: [
			"LangGraph Consultant",
			"Multi-Agent Systems",
			"Agentic AI Engineer",
		],
	},
	{
		slug: "rag-infrastructure-consulting",
		title: "RAG Infrastructure Consulting",
		shortTitle: "RAG Infrastructure",
		buyerPain:
			"Retrieval quality, grounding, latency, or hallucination risk is blocking trust.",
		description:
			"Improve retrieval quality, grounding, latency, and trust for knowledge-heavy AI systems.",
		outcomes: [
			"Design hybrid retrieval and pgvector indexing strategy",
			"Improve chunking, ranking, grounding, and answer quality",
			"Create evaluation datasets and regression loops for RAG",
		],
		depth:
			"pgvector, hybrid search, metadata filters, contextual retrieval, long-term memory, reranking, and retrieval evaluation.",
		idealClient: "Teams whose AI product depends on domain knowledge and retrieval quality.",
		keywords: [
			"RAG Infrastructure",
			"pgvector Consultant",
			"RAG Reliability",
		],
	},
	{
		slug: "ai-platform-engineering",
		title: "AI Platform Engineering",
		shortTitle: "AI Platform",
		buyerPain:
			"Prototype code needs to become a maintainable AI backend and deployment path.",
		description:
			"Build maintainable backend infrastructure for AI products with clear APIs, async workloads, and deployment discipline.",
		outcomes: [
			"Ship FastAPI AI services with production contracts",
			"Design queues, traces, workers, model gateways, and cost controls",
			"Deploy workloads across cloud, container, and enterprise environments",
		],
		depth:
			"FastAPI, async Python, Next.js, Docker, Kubernetes, OpenShift, Vertex AI, AWS/GCP, vLLM, and Ollama.",
		idealClient: "Startups and enterprise teams scaling AI from demo to platform.",
		keywords: [
			"FastAPI AI Backend",
			"AI Platform Engineering",
			"AI Infrastructure Consulting",
		],
	},
	{
		slug: "devrel-engineering",
		title: "DevRel Engineering Partnerships",
		shortTitle: "DevRel Engineering",
		buyerPain:
			"Technical buyers need implementation-grade proof before they believe the platform story.",
		description:
			"Turn complex AI infrastructure into credible technical content, reference apps, and adoption assets.",
		outcomes: [
			"Build reference architectures and demos that developers trust",
			"Create technical writing that speaks to senior engineers",
			"Translate infra value into implementation-ready education",
		],
		depth:
			"Reference apps, architecture articles, launch narratives, technical ghostwriting, workshops, and developer education.",
		idealClient: "AI infrastructure companies, developer tools, and platform startups.",
		keywords: [
			"DevRel Engineering",
			"Technical Ghostwriting",
			"AI Infrastructure Content",
		],
	},
	{
		slug: "fractional-ai-architect",
		title: "Fractional AI Architect",
		shortTitle: "Fractional Architect",
		buyerPain:
			"The team needs senior architecture judgment before full-time AI leadership is justified.",
		description:
			"Add senior AI architecture judgment to your team without hiring full-time leadership before the need is proven.",
		outcomes: [
			"Review architecture and unblock technical decisions",
			"Mentor engineers on AI-native delivery patterns",
			"Create delivery cadence for production AI initiatives",
		],
		depth:
			"Architecture reviews, system design, technical governance, delivery planning, team mentorship, and executive communication.",
		idealClient: "Seed to growth-stage teams building serious AI products.",
		keywords: [
			"Fractional AI Architect",
			"AI Advisor",
			"Startup AI Consulting",
		],
	},
] as const;

export const engineeringSystems = [
	{
		slug: "multi-agent-systems",
		title: "Multi-Agent Systems",
		description:
			"LangGraph-based workflows with explicit state, tool routing, memory, fallbacks, and evaluation.",
		flow: ["Intent", "Planner", "Agent State", "Tools", "Human Gate", "Trace"],
		tradeoffs: ["state visibility", "tool safety", "retry behavior", "human control"],
	},
	{
		slug: "rag-reliability",
		title: "RAG Reliability",
		description:
			"Retrieval pipelines designed for grounding quality, latency budgets, observability, and regression testing.",
		flow: ["Corpus", "Chunking", "pgvector", "Hybrid Search", "Rerank", "Evals"],
		tradeoffs: ["chunking", "ranking", "grounding", "latency"],
	},
	{
		slug: "fastapi-ai-backends",
		title: "FastAPI AI Backends",
		description:
			"Async Python services, model gateways, queues, trace IDs, and deployment paths for AI product teams.",
		flow: ["API", "Queue", "Workers", "Model Gateway", "Store", "Observability"],
		tradeoffs: ["async workloads", "API contracts", "cost controls", "deployment"],
	},
] as const;

export const careerJourney = [
	{
		period: "2016-2018",
		title: "Product Engineering Foundations",
		company: "William O'Neil India",
		logos: ["/logos/william_oneil.webp"],
		summary:
			"Built production web features for Panaray, a stock market research and analytics platform, while learning frontend architecture, BFF services, state management, and performance from the ground up.",
		productionSignal:
			"Shipped customer-facing analytics software where reliability, market data workflows, and UI performance mattered.",
		stack: ["React", "Redux Saga", "Node.js", "Express", "Analytics"],
	},
	{
		period: "2018-2022",
		title: "Enterprise Platform Engineering",
		company: "HPE, Optiv, Krista, Maersk",
		logos: [
			"/logos/hewlett_packard_enterprise_logo.webp",
			"/logos/optiv_inc_logo.webp",
			"/logos/antbrains_logo.webp",
			"/logos/maersk_group_logo.webp",
		],
		summary:
			"Moved from application delivery into platform thinking: hybrid cloud UIs, cybersecurity dashboards, automation products, microfrontends, SSR, and design-system contribution.",
		productionSignal:
			"Worked across enterprise environments where architecture decisions affected teams, release models, maintainability, and operational confidence.",
		stack: ["Next.js", "Module Federation", "GraphQL", "Microfrontends", "Cloud"],
	},
	{
		period: "2022-2023",
		title: "Architecture & Leadership Track",
		company: "Kotak Mahindra Bank",
		logos: ["/logos/kotak_mahindra_bank_logo.webp"],
		summary:
			"Operated closer to architecture, R&D, vendor guidance, and high-stakes banking platform discussions while contributing to secure digital product delivery.",
		productionSignal:
			"Built judgment around regulated product constraints, stakeholder alignment, security expectations, and CTO-level tradeoffs.",
		stack: ["React Native", "TypeScript", "UPI", "Security", "Architecture"],
	},
	{
		period: "2023-Present",
		title: "AI Systems Architecture",
		company: "Publicis Sapient",
		logos: ["/logos/publicis_sapient.webp"],
		summary:
			"Now architecting enterprise-grade GenAI platforms using Agentic RAG, LangGraph-style orchestration, hybrid retrieval, FastAPI microservices, and cloud-native deployment paths.",
		productionSignal:
			"Designs AI systems around retrieval quality, agent state, evaluation, observability, latency, deployment topology, and engineering adoption.",
		stack: ["LangGraph", "Agentic RAG", "pgvector", "FastAPI", "Kubernetes"],
	},
] as const;

export const architectureDecisionMap = [
	{
		stage: "Retrieval",
		problem: "Weak grounding creates confident but incorrect responses.",
		decision: "Hybrid retrieval + contextual memory + evaluation datasets.",
		tradeoff: "Higher infra complexity for better answer trust.",
	},
	{
		stage: "Orchestration",
		problem: "Single-agent flows fail on multi-step business operations.",
		decision: "LangGraph-style stateful agent routing with tool gating.",
		tradeoff: "More state modeling in exchange for reliability.",
	},
	{
		stage: "Backend",
		problem: "Prototype notebooks cannot support production workloads.",
		decision: "FastAPI services, async workers, queue-backed execution.",
		tradeoff: "More platform discipline for delivery velocity.",
	},
	{
		stage: "Observability",
		problem: "Teams cannot explain failures or regression causes.",
		decision: "Trace IDs, eval loops, latency/cost/error instrumentation.",
		tradeoff: "Instrumentation overhead for operational confidence.",
	},
] as const;

export const caseStudies = [
	{
		slug: "enterprise-agentic-rag-platform",
		title: "Enterprise Agentic RAG Platform",
		problem:
			"Enterprise teams needed AI workflows that could retrieve domain context, call tools, and remain auditable.",
		decisions: [
			"Designed Agentic RAG architecture with LangGraph-style orchestration",
			"Used hybrid retrieval with vector search and contextual memory patterns",
			"Separated orchestration, retrieval, service, and deployment concerns",
		],
		metrics: ["RAG", "multi-agent", "FastAPI", "Kubernetes"],
	},
	{
		slug: "gpu-ai-platform-modernization",
		title: "GPU AI Platform Modernization",
		problem:
			"AI workloads needed a clearer operating layer for GPU utilization, platform governance, and engineering adoption.",
		decisions: [
			"Evaluated NVIDIA Run:AI and OpenShift AI deployment patterns",
			"Documented platform usage paths for engineering teams",
			"Connected infrastructure decisions to AI product delivery constraints",
		],
		metrics: ["NVIDIA Run:AI", "OpenShift", "AI platform", "DevRel"],
	},
	{
		slug: "ai-architecture-enablement",
		title: "AI Architecture Enablement",
		problem:
			"Engineering teams needed reusable patterns for GenAI adoption, architecture reviews, and technical upskilling.",
		decisions: [
			"Created reusable architecture patterns and accelerator thinking",
			"Led workshops, internal learning, and technical writing",
			"Converted emerging AI tools into practical engineering workflows",
		],
		metrics: ["AI Engineer L2", "Top Gun Academy", "GenAI", "mentorship"],
	},
] as const;

export const articles = [
	{
		title:
			"Desktop AI Supercomputing is Here: A Practical Look at NVIDIA DGX Spark for Startups",
		date: "April 2026",
		topic: "AI infrastructure",
		url: "https://medium.com/@manojmukherjee777/desktop-ai-supercomputing-is-here-a-practical-look-at-nvidia-dgx-spark-for-startups-84526c573f40",
	},
	{
		title: "The Future of AI: Building Agent-to-Agent Communication Systems",
		date: "May 2025",
		topic: "Multi-agent systems",
		url: "https://medium.com/@manojmukherjee777/the-future-of-ai-building-agent-to-agent-communication-systems-b502bbd954e7",
	},
	{
		title:
			"Building an AI-Powered Stock Analysis Pipeline with LangGraph, DeepSeek, and Ollama",
		date: "January 2025",
		topic: "LangGraph",
		url: "https://medium.com/@manojmukherjee777/building-an-ai-powered-stock-analysis-pipeline-with-langgraph-deepseek-and-ollama-11b0c00d0e72",
	},
	{
		title:
			"Building a Real-Time AI Agent with LangChain, LangGraph, and Open Source LLMs using Ollama",
		date: "September 2024",
		topic: "AI agents",
		url: "https://medium.com/@manojmukherjee777/building-a-real-time-ai-agent-with-langchain-langgraph-and-open-source-llms-using-ollama-3602fc77c7c3",
	},
] as const;

export const awards = [
	"Publicis Sapient AI Engineer Level 2",
	"Top Gun Academy - Solution Architecture",
	"ASPIRE Speed Hackathon 2024 GenAI Semifinalist",
	"FS West Supernova",
	"Maersk Star Award",
	"William O'Neil Certificate of Excellence",
	"University 3rd Rank in BCA(H)",
];

export const testimonials = [
	{
		quote:
			"Manoj consistently demonstrates exceptional dedication, intellectual rigor, and the ability to translate complex problems into practical, implementable solutions.",
		author: "Soumya Ghatak",
		role: "Senior Program & Product Manager",
		relationship: "Mentor",
		signal: "Architecture clarity",
	},
	{
		quote:
			"Manoj made a strong impact through his ability to quickly learn and apply emerging technologies like Run:AI and GenAI tools. His technical contributions earned recognition from internal teams and client leadership.",
		author: "Prabhat Yadav",
		role: "DevOps Engineer | Kubernetes & OpenShift | GenAI Ops",
		relationship: "Direct report",
		signal: "GenAI platform execution",
	},
	{
		quote:
			"Working with Manoj, I witnessed his way of identifying, analyzing, and resolving issues across requirements, solution design, implementation, testing, and debugging.",
		author: "Amit Saha",
		role: "DevOps Engineer | Linux, Kubernetes, Nvidia GPU",
		relationship: "Client",
		signal: "Problem solving",
	},
	{
		quote:
			"Manoj shines in micro frontends and enterprise-level architecture. He consistently brought fresh, impactful ideas and tackled complex challenges with creative, scalable solutions.",
		author: "Chidanandan P",
		role: "Software Engineer III | Frontend Development",
		relationship: "Same team",
		signal: "Enterprise architecture",
	},
	{
		quote:
			"Manoj took the lead in evaluating GPU platform products and use cases, made documentation spot on, and found ways to automate tasks that were previously manual.",
		author: "Ardavan Moinzadeh",
		role: "Lead Platform Solutions Engineer | AI/ML Infrastructure",
		relationship: "Same team",
		signal: "AI/ML infrastructure",
	},
	{
		quote:
			"Manoj consistently delivered high-quality work, meeting tight deadlines without compromising attention to detail or functionality. He is one of the most talented and dedicated professionals I have collaborated with.",
		author: "Kanmani Raja",
		role: "Domain Architect | Enterprise Digital Engineering",
		relationship: "Same team",
		signal: "Delivery discipline",
	},
	{
		quote:
			"Manoj can coordinate with senior and junior colleagues, handle tough project work effortlessly, and bring quick learning with excellent development judgment.",
		author: "Sourabh Patrikar",
		role: "Sr. Software Engineer",
		relationship: "Same team",
		signal: "Engineering collaboration",
	},
	{
		quote:
			"Manoj is one of the most dedicated professionals I have worked with. His expertise as a developer is remarkable and he can adapt easily to a given situation.",
		author: "Akash Bhanderi",
		role: "Staff Software Engineer",
		relationship: "Direct manager",
		signal: "Adaptability",
	},
];

export const routes = [
	{ href: "/", label: "Home", priority: 1 },
	{ href: "/services", label: "Services", priority: 0.9 },
	{ href: "/engineering", label: "Engineering", priority: 0.9 },
	{ href: "/case-studies", label: "Case Studies", priority: 0.8 },
	{ href: "/blog", label: "Writing", priority: 0.7 },
	{ href: "/open-source", label: "Open Source", priority: 0.7 },
	{ href: "/about", label: "About", priority: 0.7 },
	{ href: "/contact", label: "Contact", priority: 0.6 },
	{ href: "/advisory-intake", label: "Work With Me", priority: 0.8 },
] as const;
