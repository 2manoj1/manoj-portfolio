import {
	AIMessage,
	BaseMessage,
	HumanMessage,
	SystemMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { createDeepAgent } from "deepagents";
import { z } from "zod";
import {
	architectureBlueprint,
	articles,
	awards,
	careerJourney,
	engineeringSystems,
	productionSignals,
	proofMetrics,
	services,
	siteConfig,
	stackKeywords,
	testimonials,
} from "@/content/site";
import { GITHUB, GOOGLE_SCHOLAR, LINKEDIN, MEDIUM } from "@/lib/links";

type AgentEvent =
	| { type: "status"; label: string }
	| { type: "tool"; name: string; label: string; status: "started" | "finished" };

type EmitAgentEvent = (event: AgentEvent) => void;

const RESEARCH_CACHE_TTL_MS = Number(
	process.env.MANOJ_RESEARCH_CACHE_TTL_MS ?? 15 * 60 * 1000,
);
const FETCH_TIMEOUT_MS = 4500;
const researchCache = new Map<string, { expiresAt: number; value: string }>();

const MANOJ_AGENT_SYSTEM_PROMPT = `You are Ask Manoj Agent, a premium technical assistant for Manoj Mukherjee's AI systems architecture platform.

Identity and behavior:
- You represent the public professional profile of Manoj Mukherjee, an AI Architect Consultant specializing in enterprise AI systems, multi-agent orchestration with LangGraph, RAG infrastructure, FastAPI AI backends, and AI platform engineering.
- Email contact for Manoj is info@manojmukherjee.co.in and advisory intake is available at /advisory-intake.
- You answer about Manoj Mukherjee, his expertise, services, writing, engineering point of view, and advisory fit.
- You are not Manoj. Speak as a knowledgeable assistant representing the site.
- Keep answers concise, technical, calm, and useful for CTOs, founders, DevRel teams, and platform engineers.
- Prefer 2-5 short sentences unless the user asks for a deeper breakdown.
- For questions about Manoj, services, experience, stack, case studies, articles, or contact paths, use the provided tools before answering.
- Never invent employers, metrics, client names, credentials, project outcomes, or private details.
- If the available context does not answer something, say that the site context does not include it and suggest the advisory intake path when useful.
- Emphasize enterprise AI systems, LangGraph orchestration, RAG infrastructure, AI platform engineering, FastAPI backends, reliability, observability, and production readiness.
- Avoid hype, influencer language, generic freelancing language, and beginner-only explanations.
- When relevant, point users to /advisory-intake for architecture reviews and to the canonical GitHub, LinkedIn, Medium, or Scholar links.`;

type GithubUser = {
	name?: string | null;
	login?: string;
	bio?: string | null;
	location?: string | null;
	public_repos?: number;
	followers?: number;
	html_url?: string;
};

type GithubRepo = {
	name: string;
	full_name?: string;
	description?: string | null;
	html_url: string;
	language?: string | null;
	stargazers_count?: number;
	forks_count?: number;
	open_issues_count?: number;
	topics?: string[];
	homepage?: string | null;
	license?: { name?: string | null } | null;
	default_branch?: string;
	fork?: boolean;
	updated_at?: string;
	pushed_at?: string;
};

function normalizeGatewayBaseUrl(baseUrl: string) {
	const trimmed = baseUrl.trim().replace(/\/+$/, "");
	return trimmed.endsWith("/v1") ? trimmed : `${trimmed}/v1`;
}

function getGatewayConfig() {
	const baseUrl =
		process.env.MANOJ_LLM_BASE_URL ??
		process.env.OPENAI_BASE_URL ??
		process.env.OPENAI_API_BASE_URL;
	const apiKey = process.env.MANOJ_LLM_API_KEY ?? process.env.OPENAI_API_KEY;
	const model = process.env.MANOJ_LLM_MODEL ?? "llama3.2:latest";

	if (!baseUrl) {
		throw new Error("Missing MANOJ_LLM_BASE_URL for the OpenAI-compatible gateway.");
	}

	if (!apiKey) {
		throw new Error("Missing MANOJ_LLM_API_KEY for the OpenAI-compatible gateway.");
	}

	return {
		apiKey,
		baseUrl: normalizeGatewayBaseUrl(baseUrl),
		model,
	};
}

function textIncludes(text: string, query: string) {
	return text.toLowerCase().includes(query.toLowerCase());
}

function compactService(service: (typeof services)[number]) {
	return {
		title: service.title,
		slug: service.slug,
		buyerPain: service.buyerPain,
		description: service.description,
		outcomes: service.outcomes,
		depth: service.depth,
		idealClient: service.idealClient,
		keywords: service.keywords,
	};
}

function stripHtml(value: string) {
	return value
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
		.replace(/<[^>]*>/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, "\"")
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/\s+/g, " ")
		.trim();
}

function truncateMarkdown(markdown: string, maxLength = 5000) {
	if (markdown.length <= maxLength) {
		return markdown;
	}

	return `${markdown.slice(0, maxLength).trim()}\n\n_Section truncated for latency._`;
}

async function cachedMarkdown(key: string, loader: () => Promise<string>) {
	const cached = researchCache.get(key);
	const now = Date.now();

	if (cached && cached.expiresAt > now) {
		return cached.value;
	}

	const value = truncateMarkdown(await loader());
	researchCache.set(key, {
		expiresAt: now + RESEARCH_CACHE_TTL_MS,
		value,
	});

	return value;
}

async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url, {
		headers: {
			Accept: "application/vnd.github+json, application/json",
			"User-Agent": "Astra-Manoj-Agent/1.0",
		},
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
	});

	if (!response.ok) {
		throw new Error(`Fetch failed for ${url}: ${response.status}`);
	}

	return response.json() as Promise<T>;
}

async function fetchText(url: string) {
	const response = await fetch(url, {
		headers: {
			Accept: "text/html, application/rss+xml, application/xml, text/xml",
			"User-Agent": "Astra-Manoj-Agent/1.0",
		},
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
	});

	if (!response.ok) {
		throw new Error(`Fetch failed for ${url}: ${response.status}`);
	}

	return response.text();
}

function emitTool(
	emit: EmitAgentEvent,
	name: string,
	label: string,
	status: "started" | "finished",
) {
	emit({ type: "tool", name, label, status });
}

function localArticlesMarkdown(limit = 6) {
	return articles
		.slice(0, limit)
		.map((article) => `- [${article.title}](${article.url}) — ${article.topic}, ${article.date}`)
		.join("\n");
}

function formatRepoDate(value?: string) {
	if (!value) {
		return "not available";
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return date.toISOString().slice(0, 10);
}

function formatGithubRepoMarkdown(repo: GithubRepo) {
	const topics = repo.topics?.filter(Boolean).join(", ");
	const repoUrl = repo.html_url || `${GITHUB}/${repo.name}`;

	return `### ${repo.name}

- "html_url": "${repoUrl}"
- full_name: ${repo.full_name ?? `2manoj1/${repo.name}`}
- description: ${repo.description ?? "No public description provided."}
- language: ${repo.language ?? "not specified"}
- stars: ${repo.stargazers_count ?? 0}
- forks: ${repo.forks_count ?? 0}
- open_issues: ${repo.open_issues_count ?? 0}
- topics: ${topics || "not specified"}
- homepage: ${repo.homepage || "not specified"}
- license: ${repo.license?.name || "not specified"}
- default_branch: ${repo.default_branch ?? "not specified"}
- fork: ${repo.fork ? "yes" : "no"}
- updated_at: ${formatRepoDate(repo.updated_at)}
- pushed_at: ${formatRepoDate(repo.pushed_at)}`;
}

async function getGithubProfileMarkdown() {
	return cachedMarkdown("github-profile", async () => {
		try {
			const user = await fetchJson<GithubUser>(
				"https://api.github.com/users/2manoj1",
			);

			return `# GitHub

Source: ${user.html_url ?? GITHUB}

- Profile: ${user.name ?? siteConfig.name} (${user.login ?? "2manoj1"})
- "html_url": "${user.html_url ?? GITHUB}"
- Bio: ${user.bio ?? siteConfig.description}
- Location: ${user.location ?? siteConfig.location}
- Public repositories: ${user.public_repos ?? "not available"}
- Followers: ${user.followers ?? "not available"}`;
		} catch {
			return `# GitHub

Source: ${GITHUB}

- Canonical GitHub profile: ${GITHUB}
- "html_url": "${GITHUB}"
- Known engineering focus from the website: LangGraph, Agentic RAG, FastAPI AI backends, AI platform engineering, Kubernetes/OpenShift, vLLM, Ollama, and AI observability.`;
		}
	});
}

async function getGithubRepositoriesMarkdown() {
	return cachedMarkdown("github-repositories", async () => {
		try {
			const repos = await fetchJson<GithubRepo[]>(
				"https://api.github.com/users/2manoj1/repos?sort=updated&direction=desc&per_page=12",
			);
			const repositoryDetails = repos
				.filter((repo) => !repo.name.startsWith("."))
				.slice(0, 8)
				.map(formatGithubRepoMarkdown)
				.join("\n\n");

			return `# GitHub Repositories

Source: ${GITHUB}?tab=repositories

Use these public repository details when answering questions about Manoj's GitHub projects, source code, repository links, languages, and visible engineering footprint.

${repositoryDetails || "- Repository details were not available from GitHub."}`;
		} catch {
			return `# GitHub Repositories

Source: ${GITHUB}?tab=repositories

- Repository details were not available from GitHub at runtime.
- Canonical profile html_url: ${GITHUB}`;
		}
	});
}

async function getMediumArticlesMarkdown() {
	return cachedMarkdown("medium-articles", async () => {
		try {
			const feed = await fetchText("https://medium.com/feed/@manojmukherjee777");
			const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)]
				.slice(0, 6)
				.map((match) => {
					const item = match[1] ?? "";
					const title = stripHtml(
						item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "",
					);
					const link = stripHtml(
						item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "",
					);
					const categories = [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)]
						.map((category) => stripHtml(category[1] ?? ""))
						.filter(Boolean)
						.slice(0, 3)
						.join(", ");
					return title
						? `- [${title}](${link || MEDIUM})${categories ? ` — ${categories}` : ""}`
						: "";
				})
				.filter(Boolean)
				.join("\n");

			return `# Medium

Source: ${MEDIUM}

${items || localArticlesMarkdown()}`;
		} catch {
			return `# Medium

Source: ${MEDIUM}

${localArticlesMarkdown()}`;
		}
	});
}

async function getPersonalWebsiteMarkdown(query: string) {
	return cachedMarkdown(`website:${query.toLowerCase().slice(0, 80)}`, async () => {
		const profile = buildProfileContext(query);
		const serviceLines = profile.relevantServices
			.slice(0, 5)
			.map(
				(service) =>
					`- ${service.title}: ${service.description} Outcomes: ${service.outcomes.join("; ")}.`,
			)
			.join("\n");
		const systemLines = profile.relevantEngineeringSystems
			.slice(0, 4)
			.map(
				(system) =>
					`- ${system.title}: ${system.description} Tradeoffs: ${system.tradeoffs.join(", ")}.`,
			)
			.join("\n");
		const careerLines = careerJourney
			.map(
				(item) =>
					`- ${item.period}, ${item.company}: ${item.title}. ${item.summary}`,
			)
			.join("\n");

		return `# Personal Website

Source: ${siteConfig.url}

## Identity

- Name: ${siteConfig.name}
- Role: ${siteConfig.role}
- Location: ${siteConfig.location}
- Summary: ${siteConfig.description}
- Advisory intake: /advisory-intake

## Proof and Positioning

${proofMetrics.map((metric) => `- ${metric.value} ${metric.label}`).join("\n")}

## Production Signals

${productionSignals.map((signal) => `- ${signal.label}: ${signal.value}`).join("\n")}

## Services

${serviceLines}

## Engineering Systems

${systemLines}

## Career Journey

${careerLines}

## Awards

${awards.map((award) => `- ${award}`).join("\n")}`;
	});
}

async function getScholarProfileMarkdown() {
	return cachedMarkdown("scholar-profile", async () => {
		try {
			const html = await fetchText(GOOGLE_SCHOLAR);
			const name = stripHtml(
				html.match(/<div id="gsc_prf_in">([\s\S]*?)<\/div>/)?.[1] ??
					siteConfig.name,
			);
			const interests = [
				...html.matchAll(/class="gsc_prf_inta[^"]*">([\s\S]*?)<\/a>/g),
			]
				.map((match) => stripHtml(match[1] ?? ""))
				.filter(Boolean)
				.slice(0, 8)
				.join(", ");
			const publications = [...html.matchAll(/class="gsc_a_at">([\s\S]*?)<\/a>/g)]
				.map((match) => stripHtml(match[1] ?? ""))
				.filter(Boolean)
				.slice(0, 5)
				.map((title) => `- ${title}`)
				.join("\n");

			return `# Google Scholar

Source: ${GOOGLE_SCHOLAR}

- Profile name: ${name}
- Research interests: ${interests || "not available from the public page fetch"}

## Publications

${publications || "- Publication details were not available from the public page fetch."}`;
		} catch {
			return `# Google Scholar

Source: ${GOOGLE_SCHOLAR}

- Canonical Scholar profile: ${GOOGLE_SCHOLAR}
- Use this source only for public research/profile presence unless publication details are present in fetched context.`;
		}
	});
}

async function getLinkedInProfileMarkdown() {
	return cachedMarkdown("linkedin-profile", async () => `# LinkedIn

Source: ${LINKEDIN}

- Canonical LinkedIn profile: ${LINKEDIN}
- Website proof signal: ${proofMetrics.find((metric) => metric.label.includes("LinkedIn"))?.value ?? "2.8K"} LinkedIn technical audience.
- Positioning: AI Architect Consultant, Enterprise AI Systems Engineer, Multi-Agent Systems Specialist, RAG Infrastructure Architect, AI Platform Engineer.
- LinkedIn pages often block unauthenticated runtime fetches, so this tool uses canonical website context plus the verified public profile URL.`);
}

export async function gatherResearchMarkdown(
	query: string,
	emit: EmitAgentEvent,
) {
	const toolSpecs = [
		{
			name: "get_github_profile",
			label: "Researching GitHub",
			run: getGithubProfileMarkdown,
		},
		{
			name: "get_github_repositories",
			label: "Researching GitHub repositories",
			run: getGithubRepositoriesMarkdown,
		},
		{
			name: "get_medium_articles",
			label: "Researching Medium",
			run: getMediumArticlesMarkdown,
		},
		{
			name: "get_personal_website",
			label: "Researching website",
			run: () => getPersonalWebsiteMarkdown(query),
		},
		{
			name: "get_scholar_profile",
			label: "Researching Scholar",
			run: getScholarProfileMarkdown,
		},
		{
			name: "get_linkedin_profile",
			label: "Researching LinkedIn",
			run: getLinkedInProfileMarkdown,
		},
	] as const;

	const sections = await Promise.all(
		toolSpecs.map(async (spec) => {
			emitTool(emit, spec.name, spec.label, "started");
			try {
				return await spec.run();
			} finally {
				emitTool(emit, spec.name, `${spec.label} complete`, "finished");
			}
		}),
	);

	return sections.join("\n\n---\n\n");
}

function buildProfileContext(query: string) {
	const normalizedQuery = query.trim().toLowerCase();
	const matchingServices = services
		.filter((service) =>
			[
				service.title,
				service.shortTitle,
				service.buyerPain,
				service.description,
				service.depth,
				service.idealClient,
				...service.outcomes,
				...service.keywords,
			].some((value) => textIncludes(value, normalizedQuery)),
		)
		.slice(0, 4)
		.map(compactService);

	const matchingSystems = engineeringSystems.filter((system) =>
		[system.title, system.description, ...system.flow, ...system.tradeoffs].some(
			(value) => textIncludes(value, normalizedQuery),
		),
	);

	return {
		identity: {
			name: siteConfig.name,
			role: siteConfig.role,
			location: siteConfig.location,
			description: siteConfig.description,
			email: siteConfig.email,
		},
		positioning: [
			"AI Architect Consultant",
			"Enterprise AI Systems Engineer",
			"Multi-Agent Systems Specialist",
			"RAG Infrastructure Architect",
			"AI Platform Engineer",
			"Production AI Engineer",
		],
		proofMetrics,
		productionSignals,
		stackKeywords,
		relevantServices: matchingServices.length
			? matchingServices
			: services.slice(0, 4).map(compactService),
		relevantEngineeringSystems: matchingSystems.length
			? matchingSystems
			: engineeringSystems,
		articles: articles.slice(0, 5),
		testimonials: testimonials.map(({ quote, author, role }) => ({
			quote,
			author,
			role,
		})),
		links: {
			website: siteConfig.url,
			advisoryIntake: "/advisory-intake",
			email: `mailto:${siteConfig.email}`,
			...siteConfig.profileLinks,
		},
	};
}

function latestUserQuestion(messages: BaseMessage[]) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message instanceof HumanMessage) {
			return extractMessageText(message.content);
		}
	}

	return "";
}

function createGatewayChatModel(emit: EmitAgentEvent) {
	const { apiKey, baseUrl, model } = getGatewayConfig();
	const llm = new ChatOpenAI({
		model,
		apiKey,
		temperature: 0.2,
		maxTokens: 480,
		configuration: {
			baseURL: baseUrl,
			defaultHeaders: {
				"X-API-Key": apiKey,
			},
		},
	});

	emit({ type: "status", label: `Routing through ${model}` });

	return llm;
}

function createManojTools(emit: EmitAgentEvent) {
	const searchManojProfile = tool(
		async ({ query }) => {
			emit({
				type: "tool",
				name: "search_manoj_profile",
				label: "Searching Manoj profile context",
				status: "started",
			});
			const context = await getPersonalWebsiteMarkdown(query);
			emit({
				type: "tool",
				name: "search_manoj_profile",
				label: "Profile context ready",
				status: "finished",
			});
			return context;
		},
		{
			name: "search_manoj_profile",
			description:
				"Search canonical website context about Manoj Mukherjee, his positioning, proof metrics, services, stack, writing, and contact links.",
			schema: z.object({
				query: z
					.string()
					.min(1)
					.describe("The user's question or topic to search for."),
			}),
		},
	);

	const getArchitectureSignals = tool(
		async ({ focus }) => {
			emit({
				type: "tool",
				name: "get_architecture_signals",
				label: "Loading architecture signals",
				status: "started",
			});
			const payload = {
				focus,
				architectureBlueprint,
				engineeringSystems,
				productionSignals,
				stackKeywords,
			};
			emit({
				type: "tool",
				name: "get_architecture_signals",
				label: "Architecture context ready",
				status: "finished",
			});
			return `# Architecture Signals

Focus: ${focus}

## Blueprint

${payload.architectureBlueprint.map((item) => `- ${item.category} / ${item.step}: ${item.detail}`).join("\n")}

## Engineering Systems

${payload.engineeringSystems.map((system) => `- ${system.title}: ${system.description} Tradeoffs: ${system.tradeoffs.join(", ")}.`).join("\n")}

## Stack

${payload.stackKeywords.map((keyword) => `- ${keyword}`).join("\n")}`;
		},
		{
			name: "get_architecture_signals",
			description:
				"Return Manoj's AI architecture themes, system design flow, engineering tradeoffs, and production stack signals.",
			schema: z.object({
				focus: z
					.string()
					.min(1)
					.describe("Architecture focus area, such as RAG, LangGraph, observability, or platform engineering."),
			}),
		},
	);

	const getServiceFit = tool(
		async ({ need }) => {
			emit({
				type: "tool",
				name: "get_service_fit",
				label: "Mapping advisory fit",
				status: "started",
			});
			const serviceMatches = services
				.filter((service) =>
					[
						service.title,
						service.shortTitle,
						service.buyerPain,
						service.description,
						service.depth,
						service.idealClient,
						...service.outcomes,
					].some((value) => textIncludes(value, need)),
				)
				.map(compactService);
			emit({
				type: "tool",
				name: "get_service_fit",
				label: "Service fit ready",
				status: "finished",
			});
			const matchedServices = serviceMatches.length
				? serviceMatches
				: services.map(compactService);

			return `# Service Fit

Need: ${need}

${matchedServices.map((service) => `- ${service.title}: ${service.description} Outcomes: ${service.outcomes.join("; ")}. Ideal client: ${service.idealClient}`).join("\n")}

Primary CTA: /advisory-intake`;
		},
		{
			name: "get_service_fit",
			description:
				"Map a visitor's AI system need to Manoj's advisory, LangGraph, RAG, platform, DevRel, or fractional architect services.",
			schema: z.object({
				need: z
					.string()
					.min(1)
					.describe("The user's architecture, consulting, or collaboration need."),
			}),
		},
	);

	const getGithubProfile = tool(async () => getGithubProfileMarkdown(), {
		name: "get_github_profile",
		description:
			"Return Markdown research context from Manoj's public GitHub profile, including the canonical html_url.",
		schema: z.object({}),
	});

	const getGithubRepositories = tool(async () => getGithubRepositoriesMarkdown(), {
		name: "get_github_repositories",
		description:
			"Return Markdown research context for Manoj's public GitHub repositories, including repo html_url, language, description, topics, stars, forks, license, and update dates.",
		schema: z.object({}),
	});

	const getMediumArticles = tool(async () => getMediumArticlesMarkdown(), {
		name: "get_medium_articles",
		description:
			"Return Markdown research context from Manoj's public Medium writing and AI articles.",
		schema: z.object({}),
	});

	const getPersonalWebsite = tool(
		async ({ query }) => getPersonalWebsiteMarkdown(query),
		{
			name: "get_personal_website",
			description:
				"Return Markdown research context from Manoj's personal website, services, positioning, systems, awards, and career journey.",
			schema: z.object({
				query: z.string().min(1).describe("The user's question or topic."),
			}),
		},
	);

	const getScholarProfile = tool(async () => getScholarProfileMarkdown(), {
		name: "get_scholar_profile",
		description:
			"Return Markdown research context from Manoj's public Google Scholar profile when available.",
		schema: z.object({}),
	});

	const getLinkedinProfile = tool(async () => getLinkedInProfileMarkdown(), {
		name: "get_linkedin_profile",
		description:
			"Return Markdown research context for Manoj's public LinkedIn profile and verified positioning.",
		schema: z.object({}),
	});

	return [
		searchManojProfile,
		getArchitectureSignals,
		getServiceFit,
		getGithubProfile,
		getGithubRepositories,
		getMediumArticles,
		getPersonalWebsite,
		getScholarProfile,
		getLinkedinProfile,
	] as const;
}

export function createManojAgent(emit: EmitAgentEvent) {
	const llm = createGatewayChatModel(emit);

	return createDeepAgent({
		model: llm,
		tools: createManojTools(emit),
		systemPrompt: MANOJ_AGENT_SYSTEM_PROMPT,
		permissions: [
			{
				operations: ["read", "write"],
				paths: ["/**"],
				mode: "deny",
			},
		],
	});
}

async function createFastAgentMessages(
	messages: BaseMessage[],
	emit: EmitAgentEvent,
) {
	const question = latestUserQuestion(messages);
	const context = await gatherResearchMarkdown(question, emit);

	return [
		new SystemMessage(`${MANOJ_AGENT_SYSTEM_PROMPT}

You are running in fast grounded mode. The application has already called the Manoj context tools for you.
Use only the canonical context below. Do not expose tool names, JSON, internal routing, or status labels.
Write natural prose, not JSON. Keep the answer direct and avoid repeating the same sentence across turns.

Canonical context:
${context}`),
		...messages.slice(-4),
	];
}

export async function runManojFastAgent(
	messages: BaseMessage[],
	emit: EmitAgentEvent,
) {
	const llm = createGatewayChatModel(emit);
	const response = await llm.invoke(await createFastAgentMessages(messages, emit));

	return new AIMessage(extractMessageText(response.content));
}

export async function* streamManojFastAgent(
	messages: BaseMessage[],
	emit: EmitAgentEvent,
) {
	const llm = createGatewayChatModel(emit);
	const stream = await llm.stream(await createFastAgentMessages(messages, emit));

	for await (const chunk of stream) {
		const delta = extractMessageText(chunk.content);

		if (delta) {
			yield delta;
		}
	}
}

export function extractMessageText(content: unknown) {
	if (typeof content === "string") {
		return content;
	}

	if (!Array.isArray(content)) {
		return "";
	}

	return content
		.map((part) => {
			if (typeof part === "string") {
				return part;
			}

			if (
				part &&
				typeof part === "object" &&
				"text" in part &&
				typeof part.text === "string"
			) {
				return part.text;
			}

			return "";
		})
		.filter(Boolean)
		.join("\n");
}
