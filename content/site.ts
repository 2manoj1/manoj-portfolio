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
    linkedin: "https://www.linkedin.com/in/manoj-mukherjee/",
    github: "https://github.com/2manoj1",
    twitter: "https://twitter.com/2manoj1",
    medium: "https://medium.com/@manojmukherjee777",
    googleScholar:
      "https://scholar.google.com/citations?user=he1gsYkAAAAJ&hl=en",
  },
};

export const proofMetrics = [
  { value: "10+", label: "years in Systems & AI Engineering" },
  { value: "50+", label: "AI architectures reviewed" },
  { value: "AI L2", label: "Publicis Sapient AI Engineer certification" },
  { value: "2.8K", label: "LinkedIn technical audience" },
];

export const aiCredentials = [
  {
    title: "AWS Certified AI Practitioner",
    issuer: "Amazon Web Services Training and Certification",
    status: "Certified",
    date: "Issued July 12, 2026",
    href: "https://www.credly.com/badges/7ea65b79-ee4d-449f-8d98-f52fd0734b88",
    image: "/credentials/aws-certified-ai-practitioner.png",
    alt: "AWS Certified AI Practitioner Foundational badge",
    description:
      "Verified foundational knowledge of AI, machine learning, generative AI, responsible AI, and AWS AI services and use cases.",
  },
  {
    title: "AWS Partner: Generative AI Essentials",
    issuer: "Amazon Web Services Training and Certification",
    status: "Training badge",
    date: "Verified on Credly",
    href: "https://www.credly.com/badges/d73299c5-9799-40e3-aa36-3154e0e85933",
    image: "/credentials/aws-generative-ai-essentials.png",
    alt: "AWS Partner Generative AI Essentials trained badge",
    description:
      "Demonstrates foundational knowledge of AWS Generative AI Essentials for business and partner contexts.",
  },
] as const;

export const currentLearning = {
  title: "Google AI Leadership",
  provider: "Udemy coursework completed",
  status: "Google certification exam planned",
  description:
    "Continuing structured preparation in AI strategy, responsible adoption, and leadership decision-making.",
} as const;

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
      "I provide senior architecture guidance for teams moving AI products from vague ambition to a production-ready operating model.",
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
      "I help you design agentic workflows with explicit state, deterministic routing, short/long-term memory, robust fallbacks, and human-in-the-loop validation gates.",
    outcomes: [
      "Model agent workflows as debuggable state machines",
      "Reduce brittle tool-calling and hidden orchestration behavior",
      "Build evaluation paths for multi-agent reliability",
    ],
    depth:
      "LangGraph graphs, planner/executor patterns, tool routing, checkpoints, memory, retries, and observability.",
    idealClient:
      "AI product teams building agent workflows beyond simple chat.",
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
      "I optimize retrieval quality, precision grounding, querying latency, and user trust for knowledge-heavy, vector-driven AI systems.",
    outcomes: [
      "Design hybrid retrieval and pgvector indexing strategy",
      "Improve chunking, ranking, grounding, and answer quality",
      "Create evaluation datasets and regression loops for RAG",
    ],
    depth:
      "pgvector, hybrid search, metadata filters, contextual retrieval, long-term memory, reranking, and retrieval evaluation.",
    idealClient:
      "Teams whose AI product depends on domain knowledge and retrieval quality.",
    keywords: ["RAG Infrastructure", "pgvector Consultant", "RAG Reliability"],
  },
  {
    slug: "ai-platform-engineering",
    title: "AI Platform Engineering",
    shortTitle: "AI Platform",
    buyerPain:
      "Prototype code needs to become a maintainable AI backend and deployment path.",
    description:
      "I build maintainable backend systems for AI platforms, leveraging async FastAPI workflows, structured schemas, queue-based workers, and robust cloud/container topologies.",
    outcomes: [
      "Ship FastAPI AI services with production contracts",
      "Design queues, traces, workers, model gateways, and cost controls",
      "Deploy workloads across cloud, container, and enterprise environments",
    ],
    depth:
      "FastAPI, async Python, Next.js, Docker, Kubernetes, OpenShift, Vertex AI, AWS/GCP, vLLM, and Ollama.",
    idealClient:
      "Startups and enterprise teams scaling AI from demo to platform.",
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
      "I turn complex AI infrastructure products into credible reference architectures, production-grade templates, and developer adoption assets.",
    outcomes: [
      "Build reference architectures and demos that developers trust",
      "Create technical writing that speaks to senior engineers",
      "Translate infra value into implementation-ready education",
    ],
    depth:
      "Reference apps, architecture articles, launch narratives, technical ghostwriting, workshops, and developer education.",
    idealClient:
      "AI infrastructure companies, developer tools, and platform startups.",
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
      "I join your team as a fractional architect to bring senior solutions judgment, review infrastructure plans, and mentor builders before a full-time hire is needed.",
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
    tradeoffs: [
      "state visibility",
      "tool safety",
      "retry behavior",
      "human control",
    ],
  },
  {
    slug: "rag-reliability",
    title: "RAG Reliability",
    description:
      "Retrieval pipelines designed for grounding quality, latency budgets, observability, and regression testing.",
    flow: [
      "Corpus",
      "Chunking",
      "pgvector",
      "Hybrid Search",
      "Rerank",
      "Evals",
    ],
    tradeoffs: ["chunking", "ranking", "grounding", "latency"],
  },
  {
    slug: "fastapi-ai-backends",
    title: "FastAPI AI Backends",
    description:
      "Async Python services, model gateways, queues, trace IDs, and deployment paths for AI product teams.",
    flow: [
      "API",
      "Queue",
      "Workers",
      "Model Gateway",
      "Store",
      "Observability",
    ],
    tradeoffs: [
      "async workloads",
      "API contracts",
      "cost controls",
      "deployment",
    ],
  },
] as const;

export const careerJourney = [
  {
    period: "2023-Present",
    title: "Technical Lead / AI Architect",
    company: "Publicis Sapient",
    logos: ["/logos/publicis_sapient.webp"],
    summary:
      "I lead the architecture of enterprise-grade generative AI platforms using Agentic RAG, stateful LangGraph-style orchestration, hybrid retrieval, FastAPI microservices, and containerized deployment paths. I design and scale containerized AI platforms on OpenShift and NVIDIA Run:AI while mentoring engineers and driving enterprise AI adoption.",
    productionSignal:
      "I design production AI systems optimized for retrieval precision, structured agent state, observability, low latency, token costs, and engineering team adoption.",
    stack: [
      "LangGraph",
      "Agentic RAG",
      "pgvector",
      "FastAPI",
      "Kubernetes",
      "NVIDIA Run:AI",
    ],
  },
  {
    period: "2022-2023",
    title: "Chief Manager (SDE III)",
    company: "Kotak Mahindra Bank",
    logos: ["/logos/kotak_mahindra_bank_logo.webp"],
    summary:
      "I operated closer to core architecture and solution design, directing research and development, vendor evaluations, and high-stakes banking platform reviews for the Kotak811 digital banking platform. I led mobile application development and secured mobile integrations including UPI 2.0.",
    productionSignal:
      "I developed a strong judgment around regulated banking constraints, secure API design, multi-stakeholder alignment, and critical CTO-level architecture tradeoffs.",
    stack: [
      "React Native",
      "TypeScript",
      "UPI 2.0",
      "Security",
      "Architecture",
    ],
  },
  {
    period: "2021-2022",
    title: "Software Engineer III",
    company: "A.P. Moller - Maersk",
    logos: ["/logos/maersk_group_logo.webp"],
    summary:
      "I built scalable microfrontend systems using Module Federation and React/Next.js. I spearheaded early adoption of Next.js Module Federation (next-mf) and SSR, improving page load speeds by 25–30% and evolving the Anchor Design System.",
    productionSignal:
      "I established modular, independently deployable microfrontend strategies across distributed enterprise teams, improving code reusability.",
    stack: ["Next.js", "Module Federation", "React", "SSR", "Design Systems"],
  },
  {
    period: "2020-2021",
    title: "Senior Software Engineer / Founding Engineer",
    company: "Krista Software",
    logos: ["/logos/antbrains_logo.webp"],
    summary:
      "I contributed as a founding member of the core engineering team for an AI-driven process automation platform. I built cross-platform mobile and web applications using the Ionic Framework and participated in core scalability reviews.",
    productionSignal:
      "I designed and scaled workflow automation interfaces, enabling rapid user adoption and earning the Krista Excellence GA Award.",
    stack: ["Ionic", "Angular", "AI Automation", "Mobile", "Web Systems"],
  },
  {
    period: "2019-2020",
    title: "Software Engineer",
    company: "Optiv Inc",
    logos: ["/logos/optiv_inc_logo.webp"],
    summary:
      "I developed enterprise cybersecurity platforms and analytics dashboards using React, Redux, GraphQL, and Node.js. I optimized frontend builds, reducing bundle sizes, and managed Express.js backend services with MongoDB.",
    productionSignal:
      "I delivered secure analytics panels with strict SLA adherence for production issue diagnostics, CI/CD integrations, and GraphQL API design.",
    stack: ["React", "GraphQL", "Node.js", "Express", "MongoDB", "Redux"],
  },
  {
    period: "2018-2019",
    title: "Software Engineer I",
    company: "Hewlett Packard Enterprise",
    logos: ["/logos/hewlett_packard_enterprise_logo.webp"],
    summary:
      "I built hybrid cloud service management interfaces for enterprise products including HPE OpenSphere and HPE GreenLake using React and Redux, collaborating closely with Golang-based distributed backend teams.",
    productionSignal:
      "I contributed to the open-source Grommet design system, improving usability, accessibility, and UI consistency across hybrid cloud services.",
    stack: ["React", "Redux", "Grommet", "Hybrid Cloud", "Distributed Systems"],
  },
  {
    period: "2016-2018",
    title: "Software Engineer",
    company: "William O'Neil India",
    logos: ["/logos/william_oneil.webp"],
    summary:
      "I joined as a founding member of the India engineering team, building Panaray, a flagship financial research and stock market analytics web platform. I designed state management patterns with Redux Saga and built Node.js BFF services.",
    productionSignal:
      "I established the frontend codebase and CI/CD pipelines from scratch, rendering real-time market data charts and mentoring junior engineers.",
    stack: ["React", "Redux Saga", "Node.js", "Express", "Financial Charts"],
  },
] as const;

export const careerJourneyCompact = [
  {
    period: "2023-Present",
    title: "Technical Lead / AI Architect",
    company: "Publicis Sapient",
    logos: ["/logos/publicis_sapient.webp"],
    summary:
      "I lead the architecture of enterprise-grade generative AI platforms using Agentic RAG, stateful LangGraph-style orchestration, hybrid retrieval, FastAPI microservices, and containerized deployment paths.",
    productionSignal:
      "I design production AI systems optimized for retrieval precision, structured agent state, observability, low latency, token costs, and engineering team adoption.",
    stack: ["LangGraph", "Agentic RAG", "pgvector", "FastAPI", "Kubernetes"],
  },
  {
    period: "2022-2023",
    title: "Chief Manager (SDE III)",
    company: "Kotak Mahindra Bank",
    logos: ["/logos/kotak_mahindra_bank_logo.webp"],
    summary:
      "I operated closer to core architecture and solution design, directing research and development, vendor evaluations, and high-stakes banking platform reviews for the Kotak811 digital banking platform.",
    productionSignal:
      "I developed a strong judgment around regulated banking constraints, secure API design, multi-stakeholder alignment, and critical CTO-level architecture tradeoffs.",
    stack: ["React Native", "TypeScript", "UPI", "Security", "Architecture"],
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
      "I moved from standard application delivery to platform engineering. I built hybrid cloud UIs, cybersecurity dashboards, and automation tooling while designing microfrontends, server-side rendering patterns, and sharing components across enterprise design systems.",
    productionSignal:
      "I worked across scale enterprise environments where architecture decisions directly impacted developer onboarding, release cadences, system maintainability, and operational confidence.",
    stack: [
      "Next.js",
      "Module Federation",
      "GraphQL",
      "Microfrontends",
      "Cloud",
    ],
  },
  {
    period: "2016-2018",
    title: "Software Engineer",
    company: "William O'Neil India",
    logos: ["/logos/william_oneil.webp"],
    summary:
      "I joined as a founding member of the India engineering team, building Panaray, a flagship financial research and stock market analytics web platform. I designed state management patterns with Redux Saga and built Node.js BFF services from scratch.",
    productionSignal:
      "I shipped customer-facing financial analytics software where reliability, high-frequency market data workflows, and rendering performance were critical.",
    stack: ["React", "Redux Saga", "Node.js", "Express", "Analytics"],
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
    slug: "production-grade-ai-home-lab",
    title: "Production-Grade AI Home Lab Platform",
    problem:
      "Designed and built an end-to-end, 100% self-hosted local AI platform running on Apple Silicon (MacBook M1 Pro) to serve low-latency inference with zero external cloud dependencies.",
    decisions: [
      "Integrated LangGraphJS for stateful multi-agent orchestration and tool control loops",
      "Configured Cloudflare Tunnels (WAF + Tunnel) for secure, zero-open-port ingress",
      "Engineered an OpenAI-compatible FastAPI gateway proxy routing queries to local Ollama and MLX model runtimes",
    ],
    metrics: [
      "LangGraphJS",
      "FastAPI Gateway",
      "Ollama/MLX",
      "Qdrant",
      "Cloudflare",
    ],
  },
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
  {
    slug: "astra-knowledge-graph-engine",
    title: "Astra Knowledge Graph Engine",
    problem:
      "Enterprise RAG applications require heavy external database infrastructure (Pinecone/pgvector) and high token budgets, introducing complexity and cost for serverless portfolios.",
    decisions: [
      "Compiled document relationships and entity summaries into a Git-versioned knowledge graph at build time",
      "Pre-serialized the MiniSearch search index to eliminate runtime parsing and indexing latency",
      "Built a warm-memory FIFO query cache and eager Graphology instantiation that answers queries in under 1ms",
    ],
    metrics: [
      "MiniSearch",
      "Graphology",
      "RAG",
      "In-Memory Cache",
      "Serverless",
    ],
  },
] as const;

export const articles = [
  {
    title:
      "Desktop AI Supercomputing is Here: A Practical Look at NVIDIA DGX Spark™ for Startups",
    date: "April 2026",
    topic: "AI infrastructure",
    description:
      "A practical deep dive into NVIDIA DGX Spark, exploring how startups can build offline-first, agentic AI systems using local compute, container-native architecture, and the NVIDIA ecosystem.",
    url: "https://medium.com/@manojmukherjee777/desktop-ai-supercomputing-is-here-a-practical-look-at-nvidia-dgx-spark-for-startups-84526c573f40",
  },
  {
    title: "The Future of AI: Building Agent-to-Agent Communication Systems",
    date: "May 2025",
    topic: "Multi-agent systems",
    description:
      "Exploring the shift from isolated AI models to interconnected agent-to-agent communication systems in the rapidly evolving world of artificial intelligence.",
    url: "https://medium.com/@manojmukherjee777/the-future-of-ai-building-agent-to-agent-communication-systems-b502bbd954e7",
  },
  {
    title:
      "Building an AI-Powered Stock Analysis Pipeline with LangGraph, DeepSeek, and Ollama",
    date: "January 2025",
    topic: "LangGraph",
    description:
      "A guide to building cost-effective, sophisticated stock analysis solutions using open-source AI tools and local LLMs.",
    url: "https://medium.com/@manojmukherjee777/building-an-ai-powered-stock-analysis-pipeline-with-langgraph-deepseek-and-ollama-11b0c00d0e72",
  },
  {
    title:
      "Building a Real-Time AI Agent with LangChain, LangGraph, and Open Source LLMs using Ollama",
    date: "September 2024",
    topic: "AI agents",
    description:
      "Combining real-time reasoning with local model deployment to build intelligent applications powered by open source LLMs.",
    url: "https://medium.com/@manojmukherjee777/building-a-real-time-ai-agent-with-langchain-langgraph-and-open-source-llms-using-ollama-3602fc77c7c3",
  },
  {
    title:
      "Advanced Retrieval-Augmented Generation (RAG) with LangChain, LangGraph, and AI Agents",
    date: "October 2024",
    topic: "RAG & Agents",
    description:
      "An in-depth systems analysis of hybrid retrieval execution. Focuses on combining dense vector search (pgvector/Qdrant) and sparse document keyword indexes (MongoDB), optimized through cross-encoder reranking.",
    url: "https://medium.com/@manojmukherjee777/advanced-retrieval-augmented-generation-rag-with-langchain-langgraph-and-ai-agents-588aab108abf",
  },
  {
    title: "Advanced Agent Functionality with Ollama and LLAMA 3 in LangChain",
    date: "July 2024",
    topic: "AI agents",
    description:
      "Exploring tool invocation dynamics, parameter schemas, and error boundaries using LLaMA 3 models locally.",
    url: "https://medium.com/@manojmukherjee777/advanced-agent-functionality-with-ollama-and-llama-3-in-langchain-95a80ded5489",
  },
  {
    title:
      "Extracting Information from Images with OCR, Vision AI, and Language Models",
    date: "February 2024",
    topic: "OCR & Vision AI",
    description:
      "Extracting valuable information from images for applications ranging from document analysis to intelligent data processing using OCR, Vision AI, and Language Models.",
    url: "https://medium.com/@manojmukherjee777/extracting-information-from-images-with-ocr-vision-ai-and-language-models-7ab8dd271bae",
  },
  {
    title: "Local Image Understanding with OpenSource LLaVA and Ollama",
    date: "February 2024",
    topic: "Multimodal AI",
    description:
      "Setting up local multimodal workloads using LLaVA and Ollama to parse visual diagrams and document charts locally.",
    url: "https://medium.com/@manojmukherjee777/local-image-understanding-with-opensource-llava-and-ollama-dbb76a79b393",
  },
  {
    title: "React Testing Library: Portal Modal",
    date: "April 2023",
    topic: "React testing",
    description:
      "A unit testing blueprint for verification of React portals, overlay elements, and modal dialogue boxes.",
    url: "https://medium.com/@manojmukherjee777/react-testing-library-portal-modal-b05aaeb5dda7",
  },
  {
    title: "Replay.io: A Game-Changing Tool for Web Developers",
    date: "April 2023",
    topic: "Developer tools",
    description:
      "Time-travel debugging analysis using Replay.io to track asynchronous race conditions and state changes in application workflows.",
    url: "https://medium.com/@manojmukherjee777/replay-io-a-game-changing-tool-for-web-developers-514ea82f2919",
  },
  {
    title: "Cypress 10 — As Frontend or JavaScript Engineer",
    date: "July 2022",
    topic: "Frontend testing",
    description:
      "Testing strategy guides for end-to-end browser regression checks and component level testing under Cypress 10.",
    url: "https://medium.com/@manojmukherjee777/cypress-10-as-frontend-or-javascript-engineer-333198bba587",
  },
] as const;

export const publications = [
  {
    title: "FastAPI OpenAI Gateway Specs & Runbook",
    description:
      "Production-grade documentation mapping loopback API routing, concurrency semaphore limits, LaunchAgent service managers, and unified memory allocations on macOS hardware.",
    topic: "AI Infrastructure Specs",
    year: "2026",
    platform: "Internal System Specs / Docs",
    contribution:
      "Designed and tested the loopback backpressure thresholds, caching conventions, and open-source release validation scripts.",
    tags: ["FastAPI", "Ollama", "LaunchAgents", "React Flow", "ELK Layout"],
    url: "/case-studies/production-grade-ai-home-lab",
  },
  {
    title: "Agent-to-Agent Communication Systems",
    description:
      "Architectural guidelines on multi-agent messaging protocols, state serialization, message schemas, and execution synchronization within LangGraph and Model Context Protocol architectures.",
    topic: "Multi-Agent Systems",
    year: "2026",
    platform: "Medium / Research Brief",
    contribution:
      "Modeled inter-agent execution loops and structured communication gateways to secure workspace routing.",
    tags: ["LangGraph", "MCP", "State Synchronization", "JSON-RPC"],
    url:
      articles.find(
        (a) =>
          a.title ===
          "The Future of AI: Building Agent-to-Agent Communication Systems",
      )?.url || "#",
  },
  {
    title: "Advanced Retrieval-Augmented Generation (RAG)",
    description:
      "An in-depth systems analysis of hybrid retrieval execution. Focuses on combining dense vector search (pgvector/Qdrant) and sparse document keyword indexes (MongoDB), optimized through cross-encoder reranking.",
    topic: "RAG Infrastructure",
    year: "2026",
    platform: "Medium / Systems Journal",
    contribution:
      "Designed token-compaction formulas and hybrid search scoring formulas that reduced context payload sizes by 45%.",
    tags: ["pgvector", "Qdrant", "Cross-Encoder", "Hybrid Search"],
    url:
      articles.find(
        (a) =>
          a.title ===
          "Advanced Retrieval-Augmented Generation (RAG) with LangChain, LangGraph, and AI Agents",
      )?.url || "#",
  },
  {
    title: "Real-Time AI Agents with LangChain & LangGraph",
    description:
      "Research on low-latency local agent runtimes. Analyzes hardware-accelerated local execution constraints on Apple Silicon environments using Ollama, MLX, and vLLM gateways.",
    topic: "Local Inference Platform",
    year: "2026",
    platform: "Research Hub / Blog",
    contribution:
      "Built open-source benchmarks comparing time-to-first-token (TTFT) performance across unified memory lanes.",
    tags: ["Ollama", "MLX", "vLLM", "Local Hardware"],
    url:
      articles.find(
        (a) =>
          a.title ===
          "Building a Real-Time AI Agent with LangChain, LangGraph, and Open Source LLMs using Ollama",
      )?.url || "#",
  },
  {
    title: "AI-Powered Stock Analysis using LangGraph & DeepSeek",
    description:
      "Systems research analyzing automated financial market research. Features multi-agent routers executing complex technical audits, sentiment parsing, and algorithmic risk evaluations.",
    topic: "Financial Systems Research",
    year: "2026",
    platform: "Google Scholar / Publications",
    contribution:
      "Modeled the financial risk checking rules node as a human-in-the-loop validation interrupt.",
    tags: ["DeepSeek", "Redux Saga", "Financial Charts", "Risk Gating"],
    url:
      articles.find(
        (a) =>
          a.title ===
          "Building an AI-Powered Stock Analysis Pipeline with LangGraph, DeepSeek, and Ollama",
      )?.url || "#",
  },
] as const;

export const awards = [
  {
    title: "AI Engineer Level 2 Certification",
    issuer: "Publicis Sapient",
    logo: "/logos/publicis_sapient.webp",
  },
  {
    title: "Top Gun Academy — Solution Architecture",
    issuer: "Publicis Sapient",
    logo: "/logos/publicis_sapient.webp",
  },
  {
    title: "ASPIRE Speed Hackathon 2024 GenAI Semifinalist",
    issuer: "Publicis Sapient",
    logo: "/logos/publicis_sapient.webp",
  },
  {
    title: "FS West Supernova Award",
    issuer: "Publicis Sapient",
    logo: "/logos/publicis_sapient.webp",
  },
  {
    title: "Maersk Star Award",
    issuer: "A.P. Moller - Maersk",
    logo: "/logos/maersk_group_logo.webp",
  },
  {
    title: "Krista Excellence Award",
    issuer: "Krista Software",
    logo: "/logos/antbrains_logo.webp",
  },
  {
    title: "William O'Neil Certificate of Excellence",
    issuer: "William O'Neil India",
    logo: "/logos/william_oneil.webp",
  },
  {
    title: "University 3rd Rank in BCA (Honours)",
    issuer: "University of Burdwan",
    icon: "GraduationCap",
  },
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
  { href: "/engineering", label: "Engineering", priority: 1 },
  { href: "/engineering/ai-human", label: "AI & Human", priority: 1 },
  { href: "/architecture-lab", label: "Architecture Lab", priority: 1 },
  { href: "/case-studies", label: "Case Studies", priority: 0.8 },
  { href: "/blog", label: "Blog", priority: 1 },
  { href: "/open-source", label: "Open Source", priority: 0.7 },
  { href: "/about", label: "About", priority: 1 },
  { href: "/resume", label: "Resume", priority: 1 },
  { href: "/contact", label: "Contact", priority: 0.6 },
  { href: "/advisory-intake", label: "Work With Me", priority: 0.8 },
  {
    href: "/chat",
    label: "Chat",
    priority: 0.8,
  },
] as const;
