"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
	AlertTriangle,
	ArrowRight,
	Check,
	CheckCircle2,
	Database,
	GitBranch,
	Maximize2,
	Minimize2,
	Play,
	RefreshCcw,
	Route,
	ShieldCheck,
	SquareStack,
	Terminal,
	Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PresetId = "bank-audit" | "sandbox-query";

type GraphNode = {
	id: string;
	title: string;
	role: string;
	description: string;
	stateDelta: string;
	metric: string;
	checkpoint?: string;
	approval?: string;
	retry?: string;
	icon: typeof GitBranch;
};

const graphNodes: GraphNode[] = [
	{
		id: "intake",
		title: "Input",
		role: "Request Contract",
		description:
			"Normalizes the business request into a typed state object before the graph starts planning.",
		stateDelta: "state.intent, state.policy_scope, state.risk_level",
		metric: "Schema validation: <2ms",
		icon: Terminal,
	},
	{
		id: "planner",
		title: "Planner",
		role: "Task Decomposition",
		description:
			"Breaks the request into retrieval, tool, policy, and answer-generation steps.",
		stateDelta: "state.plan[], state.required_sources, state.success_criteria",
		metric: "Plan nodes: 4-7",
		checkpoint: "checkpoint: plan_v1",
		icon: GitBranch,
	},
	{
		id: "router",
		title: "Router",
		role: "Conditional Edge",
		description:
			"Chooses the next node based on risk, source freshness, local availability, and tool confidence.",
		stateDelta: "state.route, state.model_lane, state.tool_policy",
		metric: "Routing decision: 40-120ms",
		icon: Route,
	},
	{
		id: "tools",
		title: "Tools",
		role: "Execution Layer",
		description:
			"Calls retrieval, database, web, repository, or internal API tools through guarded contracts.",
		stateDelta: "state.tool_results[], state.source_map, state.errors[]",
		metric: "Tool fanout: 2-5 calls",
		retry: "retry: exponential backoff on timeout",
		icon: Wrench,
	},
	{
		id: "checkpoint",
		title: "Checkpoint",
		role: "Durable State",
		description:
			"Writes graph state before evaluation so a long-running agent can resume safely after timeout.",
		stateDelta: "state.thread_id, state.version, state.resume_token",
		metric: "State write: 60-90ms",
		checkpoint: "checkpoint: tool_results_v2",
		icon: Database,
	},
	{
		id: "approval",
		title: "Approval",
		role: "Human Gate",
		description:
			"Pauses the run when the request touches regulated, sensitive, or irreversible operations.",
		stateDelta: "state.approval_status, state.review_notes",
		metric: "Pause condition: risk >= high",
		approval: "human-in-the-loop pause",
		icon: ShieldCheck,
	},
	{
		id: "evaluator",
		title: "Evaluator",
		role: "Quality Gate",
		description:
			"Checks grounding, source coverage, policy constraints, and retry requirements before output.",
		stateDelta: "state.eval_score, state.retry_required, state.citations",
		metric: "Grounding check: pass/fail",
		retry: "retry edge if coverage is weak",
		icon: AlertTriangle,
	},
	{
		id: "output",
		title: "Output",
		role: "Final Response",
		description:
			"Returns a grounded answer, audit trail, source map, and next recommended action.",
		stateDelta: "state.final, state.audit_log, state.next_action",
		metric: "Response stream starts",
		icon: CheckCircle2,
	},
];

const presets = {
	"bank-audit": {
		label: "Regulated Bank Audit",
		input:
			"Review this agent workflow for customer-data exposure, missing approvals, and retrieval traceability.",
		risk: "High",
		latency: "Async queue recommended",
		retries: 2,
		approval: "Required before final output",
		checkpointReason: "Audit-grade resume and evidence trail",
	},
	"sandbox-query": {
		label: "Local Sandbox Query",
		input:
			"Use the local lab to compare Qwen routing with cloud fallback for a low-risk architecture question.",
		risk: "Low",
		latency: "Sync path acceptable",
		retries: 1,
		approval: "Skipped unless tool confidence drops",
		checkpointReason: "Developer debugging and trace replay",
	},
} as const satisfies Record<
	PresetId,
	{
		label: string;
		input: string;
		risk: string;
		latency: string;
		retries: number;
		approval: string;
		checkpointReason: string;
	}
>;

export function OrchestrationPlayground() {
	const [presetId, setPresetId] = useState<PresetId>("bank-audit");
	const [activeStep, setActiveStep] = useState(0);
	const [inspectedStep, setInspectedStep] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const dialogRef = useRef<HTMLDivElement>(null);

	const preset = presets[presetId];
	const inspectedNode = graphNodes[inspectedStep];
	const activeNode = graphNodes[activeStep];
	const progress = ((activeStep + 1) / graphNodes.length) * 100;

	useEffect(() => {
		if (!isRunning) return;

		const timer = window.setTimeout(() => {
			setActiveStep((current) => {
				const next = current + 1;
				if (next >= graphNodes.length) {
					setIsRunning(false);
					return current;
				}
				setInspectedStep(next);
				return next;
			});
		}, 950);

		return () => window.clearTimeout(timer);
	}, [activeStep, isRunning]);

	useEffect(() => {
		if (!isExpanded) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		dialogRef.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsExpanded(false);
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [isExpanded]);

	const runtimeMetrics = useMemo(() => {
		const completedNodes = activeStep + 1;
		const checkpointWrites = graphNodes
			.slice(0, completedNodes)
			.filter((node) => node.checkpoint).length;
		const approvalReached = activeStep >= graphNodes.findIndex((node) => node.id === "approval");
		const retryBudget =
			presetId === "bank-audit" && activeStep >= graphNodes.findIndex((node) => node.id === "evaluator")
				? preset.retries
				: presetId === "sandbox-query" && activeStep >= graphNodes.findIndex((node) => node.id === "tools")
					? preset.retries
					: 0;

		return {
			completedNodes,
			checkpointWrites,
			approvalState: approvalReached ? preset.approval : "Not reached",
			retryBudget,
		};
	}, [activeStep, preset, presetId]);

	const traceRows = [
		{
			label: "active",
			value: `${activeNode.title.toLowerCase()} node`,
		},
		{
			label: "state",
			value: activeNode.stateDelta,
		},
		{
			label: "checkpoint",
			value:
				runtimeMetrics.checkpointWrites > 0
					? `${runtimeMetrics.checkpointWrites} durable write${runtimeMetrics.checkpointWrites > 1 ? "s" : ""}`
					: "pending",
		},
		{
			label: "gate",
			value: runtimeMetrics.approvalState,
		},
	];

	const startRun = () => {
		setActiveStep(0);
		setInspectedStep(0);
		setIsRunning(true);
	};

	const resetRun = () => {
		setIsRunning(false);
		setActiveStep(0);
		setInspectedStep(0);
	};

	return (
		<div
			ref={dialogRef}
			role={isExpanded ? "dialog" : undefined}
			aria-modal={isExpanded ? true : undefined}
			aria-label="LangGraph orchestration simulation"
			tabIndex={isExpanded ? -1 : undefined}
			className={cn(
				"min-w-0 overflow-hidden border border-border bg-background",
				isExpanded &&
					"fixed inset-3 z-[80] overflow-y-auto shadow-2xl md:inset-6"
			)}>
			<span className="sr-only" aria-live="polite">
				Active graph node: {activeNode.title}
			</span>
			<div className="min-w-0 border-b border-border bg-card/10 px-4 py-3 md:px-5">
				<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex min-w-0 items-center gap-3">
						<div className="flex size-9 items-center justify-center border border-border bg-background">
							<GitBranch className="size-4 text-amber" />
						</div>
						<div className="min-w-0">
							<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber">
								LangGraph Run
							</p>
							<h3 className="text-lg font-medium text-foreground md:text-xl">
								Orchestration Console
							</h3>
						</div>
					</div>

					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<div className="grid min-w-0 grid-cols-2 gap-1 border border-border bg-background p-1">
							{(Object.keys(presets) as PresetId[]).map((id) => (
								<button
									key={id}
									type="button"
									aria-pressed={presetId === id}
									onClick={() => {
										setPresetId(id);
										resetRun();
									}}
									className={cn(
										"min-h-11 min-w-0 px-3 py-2 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-40",
										presetId === id
											? "bg-foreground text-background"
											: "text-muted-foreground hover:bg-card/30 hover:text-foreground"
									)}>
									{presets[id].label}
								</button>
							))}
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={startRun}
								className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-amber px-3 text-sm font-medium text-amber-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-none">
								<Play className="size-4" />
								Simulate
							</button>
							<button
								type="button"
								onClick={resetRun}
								aria-label="Reset run"
								className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background">
								<RefreshCcw className="size-4" />
							</button>
							<button
								type="button"
								onClick={() => setIsExpanded((current) => !current)}
								aria-label={
									isExpanded
										? "Close full page simulation view"
										: "Open full page simulation view"
								}
								className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background">
								{isExpanded ? (
									<Minimize2 className="size-4" />
								) : (
									<Maximize2 className="size-4" />
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className={cn(
					"grid gap-0",
					isExpanded
						? "2xl:grid-cols-[minmax(0,1fr)_22rem]"
						: "xl:grid-cols-[minmax(0,1fr)_21rem]"
				)}>
				<div className="min-w-0 p-4 md:p-6">
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
						<MetricCard label="Risk" value={preset.risk} />
						<MetricCard label="Mode" value={preset.latency} />
						<MetricCard
							label="Checkpoints"
							value={runtimeMetrics.checkpointWrites.toString()}
						/>
						<MetricCard
							label="Retries"
							value={runtimeMetrics.retryBudget.toString()}
						/>
					</div>

					<div className="mt-5 min-w-0 border border-border bg-card/5 p-4 md:p-5">
						<div className="flex items-center justify-between gap-4">
							<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
								Execution Path
							</p>
							<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber">
								{String(activeStep + 1).padStart(2, "0")} /{" "}
								{String(graphNodes.length).padStart(2, "0")}
							</p>
						</div>

						<div className="mt-4 h-1 overflow-hidden bg-secondary">
							<div
								className="h-full bg-amber transition-all duration-700 ease-out"
								style={{ width: `${progress}%` }}
							/>
						</div>

						<div className="relative mt-8 min-w-0">
							<div className="absolute left-6 top-0 hidden h-px w-[calc(100%-3rem)] bg-border lg:block" />
							<div
								className={cn(
									"grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
									isExpanded && "2xl:grid-cols-8"
								)}>
								{graphNodes.map((node, index) => {
									const Icon = node.icon;
									const isActive = index === activeStep;
									const isComplete = index < activeStep;
									const isInspected = index === inspectedStep;

									return (
										<button
											key={node.id}
											type="button"
											onClick={() => setInspectedStep(index)}
											aria-pressed={isInspected}
											className={cn(
												"group relative grid min-h-20 min-w-0 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border bg-background p-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:min-h-32 lg:grid-cols-1 lg:justify-items-center lg:text-center",
												isActive &&
													"border-amber bg-amber/8 shadow-sm shadow-amber/10",
												isComplete &&
													!isActive &&
													"border-emerald-500/35 bg-emerald-500/5",
												!isActive &&
													!isComplete &&
													"border-border hover:border-muted-foreground/40",
												isInspected && "ring-2 ring-amber/20"
											)}>
											<div
												className={cn(
													"relative z-10 flex size-10 items-center justify-center border bg-background transition-colors",
													isActive && "border-amber text-amber",
													isComplete && !isActive && "border-emerald-500/40 text-emerald-400",
													!isActive && !isComplete && "border-border text-muted-foreground"
												)}>
												{isComplete ? (
													<Check className="size-4" />
												) : (
													<Icon className="size-4" />
												)}
											</div>
											<div className="min-w-0 lg:mt-2">
												<p className="truncate text-sm font-medium text-foreground">
													{node.title}
												</p>
												<p className="mt-1 hidden font-mono text-[11px] uppercase tracking-wide text-muted-foreground lg:block">
													{node.role}
												</p>
											</div>
											{index < graphNodes.length - 1 ? (
												<ArrowRight className="size-4 text-muted-foreground lg:hidden" />
											) : null}
										</button>
									);
								})}
							</div>
						</div>
					</div>

					<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
						{traceRows.map((row) => (
							<div key={row.label} className="min-w-0 border border-border bg-card/10 p-3">
								<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
									{row.label}
								</p>
								<p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-foreground">
									{row.value}
								</p>
							</div>
						))}
					</div>
				</div>

				<aside
					className={cn(
						"min-w-0 border-t border-border bg-card/10 p-4 md:p-6",
						isExpanded ? "2xl:border-l 2xl:border-t-0" : "xl:border-l xl:border-t-0"
					)}>
					<div className="flex items-center justify-between border-b border-border pb-4">
						<div className="flex items-center gap-2">
							<SquareStack className="size-4 text-amber" />
							<p className="font-mono text-xs uppercase tracking-wide text-foreground">
								Inspector
							</p>
						</div>
						<span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
							{inspectedNode.id}
						</span>
					</div>

					<div className="mt-5">
						<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber">
							{inspectedNode.role}
						</p>
						<h4 className="mt-2 text-2xl font-medium text-foreground">
							{inspectedNode.title}
						</h4>
					</div>

					<div className="mt-5 space-y-3">
						<InspectorRow label="State" value={inspectedNode.stateDelta} />
						<InspectorRow label="Metric" value={inspectedNode.metric} />
						{inspectedNode.checkpoint ? (
							<InspectorRow label="Write" value={inspectedNode.checkpoint} />
						) : null}
						{inspectedNode.approval ? (
							<InspectorRow label="Gate" value={inspectedNode.approval} />
						) : null}
						{inspectedNode.retry ? (
							<InspectorRow label="Retry" value={inspectedNode.retry} />
						) : null}
					</div>

					<div className="mt-5 border-t border-border pt-4">
						<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
							Current Input
						</p>
						<p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
							{preset.input}
						</p>
					</div>
				</aside>
			</div>
		</div>
	);
}

function MetricCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="min-h-20 min-w-0 border border-border bg-card/10 p-3">
			<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
				{label}
			</p>
			<p className="mt-2 line-clamp-2 break-words text-sm font-medium leading-5 text-foreground">
				{value}
			</p>
		</div>
	);
}

function InspectorRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="min-w-0 border border-border bg-background/60 p-3">
			<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
				{label}
			</p>
			<p className="mt-2 break-words text-sm leading-6 text-foreground">{value}</p>
		</div>
	);
}
