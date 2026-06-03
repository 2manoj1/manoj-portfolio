export type SandboxMetric = {
	label: string;
	value: string;
	detail: string;
};

export type LocalModelMetric = {
	name: string;
	runtime: string;
	tokensPerSecond: string;
	memory: string;
	status: "online" | "standby" | "testing";
};

export type TunnelLog = {
	time: string;
	event: string;
	status: "ok" | "warn";
};

export type SandboxSnapshot = {
	source: "live" | "snapshot";
	updatedAt: string;
	health: string;
	models: LocalModelMetric[];
	metrics: SandboxMetric[];
	tunnelLogs: TunnelLog[];
};

const snapshotMetrics: SandboxSnapshot = {
	source: "snapshot",
	updatedAt: "Lab snapshot",
	health: "Local lab telemetry hook ready",
	models: [
		{
			name: "Qwen 14B",
			runtime: "Ollama / Apple Silicon",
			tokensPerSecond: "18-28 tok/s",
			memory: "9-12GB unified memory",
			status: "online",
		},
		{
			name: "DeepSeek-R1 Distill",
			runtime: "Ollama local reasoning lane",
			tokensPerSecond: "10-18 tok/s",
			memory: "12-16GB unified memory",
			status: "testing",
		},
		{
			name: "Llama 3.2 SLM",
			runtime: "MLX / local router",
			tokensPerSecond: "35-55 tok/s",
			memory: "3-5GB unified memory",
			status: "standby",
		},
	],
	metrics: [
		{
			label: "Host",
			value: "MacBook M1 Pro",
			detail: "32GB unified memory, local inference and data stores.",
		},
		{
			label: "Gateway",
			value: "FastAPI",
			detail: "OpenAI-compatible routing, auth, logging, and fallback policy.",
		},
		{
			label: "Vector Store",
			value: "Qdrant",
			detail: "Local semantic retrieval with cache-aware query paths.",
		},
		{
			label: "Ingress",
			value: "Cloudflare Tunnel",
			detail: "Egress-only tunnel path with zero open local ports.",
		},
	],
	tunnelLogs: [
		{
			time: "T-00:04",
			event: "Tunnel route healthy; gateway reachable through private ingress.",
			status: "ok",
		},
		{
			time: "T-00:11",
			event: "Local model lane selected for low-risk router classification.",
			status: "ok",
		},
		{
			time: "T-00:18",
			event: "Cloud fallback reserved for high-context reasoning requests.",
			status: "warn",
		},
	],
};

function isSandboxSnapshot(value: unknown): value is SandboxSnapshot {
	if (!value || typeof value !== "object") return false;

	const maybeSnapshot = value as Partial<SandboxSnapshot>;
	return (
		Array.isArray(maybeSnapshot.models) &&
		Array.isArray(maybeSnapshot.metrics) &&
		Array.isArray(maybeSnapshot.tunnelLogs)
	);
}

export async function getSandboxMetrics(): Promise<SandboxSnapshot> {
	const endpoint = process.env.HOME_LAB_METRICS_URL;

	if (!endpoint) {
		return snapshotMetrics;
	}

	try {
		const response = await fetch(endpoint, {
			headers: process.env.HOME_LAB_METRICS_TOKEN
				? {
						Authorization: `Bearer ${process.env.HOME_LAB_METRICS_TOKEN}`,
					}
				: undefined,
			next: { revalidate: 30 },
		});

		if (!response.ok) {
			return snapshotMetrics;
		}

		const payload = (await response.json()) as unknown;

		if (!isSandboxSnapshot(payload)) {
			return snapshotMetrics;
		}

		return {
			...payload,
			source: "live",
		};
	} catch {
		return snapshotMetrics;
	}
}
