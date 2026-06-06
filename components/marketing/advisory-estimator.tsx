"use client";

import { useMemo, useState } from "react";
import {
	ArrowRight,
	BarChart3,
	Calculator,
	Clock,
	Database,
	Layers,
	PiggyBank,
	Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EMAIL } from "@/lib/links";

type ModelId = "gpt-4o" | "claude-sonnet" | "llama-70b";

const modelOptions = {
	"gpt-4o": {
		label: "GPT-4o",
		inputRate: 2.5,
		outputRate: 10,
		latencyBase: 1.4,
		description: "Strong general-purpose cloud reasoning lane.",
	},
	"claude-sonnet": {
		label: "Claude Sonnet",
		inputRate: 3,
		outputRate: 15,
		latencyBase: 1.7,
		description: "Deep analysis lane for architecture and policy-heavy work.",
	},
	"llama-70b": {
		label: "LLaMA 70B",
		inputRate: 0.8,
		outputRate: 0.8,
		latencyBase: 2.3,
		description: "Hosted or private open-model lane for cost-sensitive paths.",
	},
} as const satisfies Record<
	ModelId,
	{
		label: string;
		inputRate: number;
		outputRate: number;
		latencyBase: number;
		description: string;
	}
>;

const formatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

export function AdvisoryEstimator() {
	const [dailyQueries, setDailyQueries] = useState(2500);
	const [retrievalTokens, setRetrievalTokens] = useState(6000);
	const [outputTokens, setOutputTokens] = useState(900);
	const [modelId, setModelId] = useState<ModelId>("gpt-4o");
	const [cacheHitRate, setCacheHitRate] = useState(35);
	const [compactionRate, setCompactionRate] = useState(45);

	const projection = useMemo(() => {
		const model = modelOptions[modelId];
		const monthlyQueries = dailyQueries * 30;
		const basePromptTokens = 800;
		const monthlyInputTokens = monthlyQueries * (basePromptTokens + retrievalTokens);
		const monthlyOutputTokens = monthlyQueries * outputTokens;
		const monthlyTokenBudget = monthlyInputTokens + monthlyOutputTokens;

		const baselineCost =
			(monthlyInputTokens / 1_000_000) * model.inputRate +
			(monthlyOutputTokens / 1_000_000) * model.outputRate;

		const optimizedInputTokens =
			monthlyInputTokens * (1 - cacheHitRate / 100) * (1 - compactionRate / 100);
		const optimizedCost =
			(optimizedInputTokens / 1_000_000) * model.inputRate +
			(monthlyOutputTokens / 1_000_000) * model.outputRate;
		const savings = Math.max(0, baselineCost - optimizedCost);

		const syncLatency = model.latencyBase + retrievalTokens / 4500 + outputTokens / 1800;
		const asyncLatency = syncLatency + 2.2;

		return {
			model,
			monthlyQueries,
			monthlyInputTokens,
			monthlyOutputTokens,
			monthlyTokenBudget,
			baselineCost,
			optimizedCost,
			savings,
			syncLatency,
			asyncLatency,
		};
	}, [cacheHitRate, compactionRate, dailyQueries, modelId, outputTokens, retrievalTokens]);

	const emailSubject = encodeURIComponent("AI Audit Estimator Review Request");
	const emailBody = encodeURIComponent(`Hi Manoj,

I ran your AI Audit Estimator with the following system configuration:
- Daily Active Agent Queries: ${dailyQueries.toLocaleString()} queries
- Retrieved Context Size: ${retrievalTokens.toLocaleString()} tokens/query
- Average Output Length: ${outputTokens.toLocaleString()} tokens
- Primary Model: ${modelOptions[modelId].label}
- Semantic Cache Hit Rate: ${cacheHitRate}%
- Context Compaction: ${compactionRate}%

Calculated Metrics:
- Monthly Token Budget: ${(projection.monthlyTokenBudget / 1_000_000).toFixed(1)}M tokens
- Estimated Baseline Cost: ${currencyFormatter.format(projection.baselineCost)}/mo
- Estimated Optimized Cost: ${currencyFormatter.format(projection.optimizedCost)}/mo
- Projected Monthly Savings: ${currencyFormatter.format(projection.savings)}/mo

I would like to request an architecture review to discuss implementing these cache and context compaction policies.`);

	const maxCost = Math.max(projection.baselineCost, projection.optimizedCost, 1);
	const baselineWidth = Math.max(8, (projection.baselineCost / maxCost) * 100);
	const optimizedWidth = Math.max(8, (projection.optimizedCost / maxCost) * 100);

	return (
		<div className="min-w-0 overflow-hidden border border-border bg-card/10">
			<div className="grid min-w-0 gap-0 lg:grid-cols-[1.05fr_0.95fr]">
				<div className="min-w-0 border-b border-border p-5 md:p-6 lg:border-b-0 lg:border-r">
					<div className="flex items-center gap-2">
						<Calculator className="size-4 text-amber" />
						<h3 className="text-xl font-medium text-foreground">
							AI Audit Estimator
						</h3>
					</div>
					<p className="mt-3 break-words text-sm leading-6 text-muted-foreground">
						Model cost, latency, cache savings, and review signal in one pass.
					</p>

					<div className="mt-6 space-y-5">
						<RangeControl
							label="Daily Active Agent Queries"
							value={dailyQueries}
							min={100}
							max={50000}
							step={100}
							suffix="queries"
							onChange={setDailyQueries}
						/>
						<RangeControl
							label="Retrieved Context Size"
							value={retrievalTokens}
							min={500}
							max={32000}
							step={500}
							suffix="tokens/query"
							onChange={setRetrievalTokens}
						/>
						<RangeControl
							label="Average Output Length"
							value={outputTokens}
							min={100}
							max={5000}
							step={100}
							suffix="tokens"
							onChange={setOutputTokens}
						/>
					</div>

					<div className="mt-6">
						<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
							Primary Model
						</p>
						<div className="mt-3 grid gap-2 md:grid-cols-3">
							{(Object.keys(modelOptions) as ModelId[]).map((id) => (
								<button
									key={id}
									type="button"
									aria-pressed={modelId === id}
									onClick={() => setModelId(id)}
									className={cn(
										"min-h-28 min-w-0 border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background",
										modelId === id
											? "border-amber/70 bg-amber/8"
											: "border-border bg-background/35 hover:bg-card/30"
									)}>
									<p className="text-sm font-medium text-foreground">
										{modelOptions[id].label}
									</p>
									<p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
										{modelOptions[id].description}
									</p>
								</button>
							))}
						</div>
					</div>

					<div className="mt-6 grid gap-5 md:grid-cols-2">
						<RangeControl
							label="Semantic Cache Hit Rate"
							value={cacheHitRate}
							min={0}
							max={80}
							step={5}
							suffix="%"
							onChange={setCacheHitRate}
						/>
						<RangeControl
							label="Context Compaction"
							value={compactionRate}
							min={0}
							max={75}
							step={5}
							suffix="%"
							onChange={setCompactionRate}
						/>
					</div>
				</div>

				<div className="min-w-0 p-5 md:p-6">
					<div className="grid gap-3 sm:grid-cols-2">
						<ResultTile
							icon={Layers}
							label="Monthly Token Budget"
							value={`${(projection.monthlyTokenBudget / 1_000_000).toFixed(1)}M`}
							detail={`${formatter.format(projection.monthlyQueries)} monthly queries`}
						/>
						<ResultTile
							icon={PiggyBank}
							label="Estimated Savings"
							value={currencyFormatter.format(projection.savings)}
							detail="Semantic cache + context compaction"
						/>
						<ResultTile
							icon={Clock}
							label="Sync P95"
							value={`${projection.syncLatency.toFixed(1)}s`}
							detail="Direct request-response path"
						/>
						<ResultTile
							icon={Zap}
							label="Async Queue"
							value={`${projection.asyncLatency.toFixed(1)}s`}
							detail="Queued worker path with retry control"
						/>
					</div>

					<div className="mt-5 min-w-0 border border-border bg-background/45 p-4">
						<div className="flex items-center gap-2">
							<BarChart3 className="size-4 text-amber" />
							<p className="font-mono text-xs uppercase tracking-wide text-foreground">
								Monthly Model API Budget
							</p>
						</div>
						<div className="mt-5 space-y-4">
							<CostBar
								label="Baseline"
								value={currencyFormatter.format(projection.baselineCost)}
								width={baselineWidth}
							/>
							<CostBar
								label="Optimized"
								value={currencyFormatter.format(projection.optimizedCost)}
								width={optimizedWidth}
							/>
						</div>
					</div>

					<div className="mt-5 min-w-0 border border-border bg-background/45 p-4">
						<div className="flex items-center gap-2">
							<Database className="size-4 text-amber" />
							<p className="font-mono text-xs uppercase tracking-wide text-foreground">
								Architecture Readout
							</p>
						</div>
						<p className="mt-3 break-words text-sm leading-7 text-muted-foreground">
							Review focus: cache, compaction, queues, reranking, and fallback
							routing.
						</p>
					</div>

					<a
						href={`mailto:${EMAIL}?subject=${emailSubject}&body=${emailBody}`}
						className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-zinc-200 dark:border-transparent bg-white dark:bg-amber px-4 text-sm font-medium text-zinc-900 dark:text-zinc-950 transition-all hover:bg-zinc-50 dark:hover:bg-amber/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-sm dark:shadow-none">
						Request Architecture Review via Email
						<ArrowRight className="size-4" />
					</a>
				</div>
			</div>
		</div>
	);
}

function RangeControl({
	label,
	value,
	min,
	max,
	step,
	suffix,
	onChange,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	suffix: string;
	onChange: (value: number) => void;
}) {
	return (
		<label className="block min-w-0">
			<span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-wide">
				<span className="min-w-0 break-words text-muted-foreground">{label}</span>
				<span className="shrink-0 text-foreground">
					{formatter.format(value)} {suffix}
				</span>
			</span>
			<input
				aria-label={label}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(event) => onChange(Number(event.target.value))}
				className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			/>
		</label>
	);
}

function ResultTile({
	icon: Icon,
	label,
	value,
	detail,
}: {
	icon: typeof Calculator;
	label: string;
	value: string;
	detail: string;
}) {
	return (
		<div className="min-w-0 border border-border bg-background/45 p-4">
			<Icon className="size-4 text-amber" />
			<p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
				{label}
			</p>
			<p className="mt-1 break-words text-xl font-semibold text-foreground">{value}</p>
			<p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p>
		</div>
	);
}

function CostBar({
	label,
	value,
	width,
}: {
	label: string;
	value: string;
	width: number;
}) {
	return (
		<div className="min-w-0">
			<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs">
				<p className="min-w-0 break-words font-mono uppercase tracking-wide text-muted-foreground">
					{label}
				</p>
				<p className="shrink-0 font-mono text-foreground">{value}</p>
			</div>
			<div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
				<div
					className="h-full rounded-full bg-amber"
					style={{ width: `${width}%` }}
				/>
			</div>
		</div>
	);
}
