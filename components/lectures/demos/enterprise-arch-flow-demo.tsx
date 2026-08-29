"use client";

import { useState, useCallback } from "react";
import {
	ReactFlow,
	Background,
	Controls,
	Handle,
	Position,
	MarkerType,
	type Node,
	type Edge,
	type NodeProps,
} from "@xyflow/react";
import {
	Layers,
	ShieldCheck,
	ArrowRight,
	RefreshCw,
} from "lucide-react";

type ArchNodeData = {
	title: string;
	subtitle: string;
	avatar: string;
	type: "frontend" | "gateway" | "enterprise" | "blockchain" | "shared";
	tech: string;
	percentage: string;
	highlight?: boolean;
	roleExplanation: string;
};

function ArchNode({ data }: NodeProps<Node<ArchNodeData>>) {
	const borderStyles = {
		frontend: "border-sky-400/80 bg-sky-950/60 text-sky-200 shadow-[0_0_30px_rgba(56,189,248,0.25)]",
		gateway: "border-violet-400/80 bg-violet-950/60 text-violet-200 shadow-[0_0_30px_rgba(168,85,247,0.25)]",
		enterprise: "border-zinc-400/80 bg-zinc-900/85 text-zinc-200 shadow-[0_0_30px_rgba(161,161,170,0.2)]",
		blockchain: "border-amber-400/90 bg-amber-950/60 text-amber-200 shadow-[0_0_40px_rgba(251,191,36,0.35)]",
		shared: "border-emerald-400/90 bg-emerald-950/60 text-emerald-200 shadow-[0_0_40px_rgba(52,211,153,0.35)]",
	};

	const badgeStyles = {
		frontend: "bg-sky-500/20 text-sky-300 border-sky-400/30",
		gateway: "bg-violet-500/20 text-violet-300 border-violet-400/30",
		enterprise: "bg-zinc-500/20 text-zinc-300 border-zinc-400/30",
		blockchain: "bg-amber-500/20 text-amber-300 border-amber-400/40",
		shared: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
	};

	return (
		<div
			className={`w-[230px] rounded-3xl border p-4.5 backdrop-blur-xl transition-all duration-300 ${
				borderStyles[data.type]
			} ${data.highlight ? "ring-2 ring-amber-300 scale-105" : "hover:scale-[1.02]"}`}>
			<Handle type="target" position={Position.Top} className="!bg-amber-400 !size-2.5" />
			<Handle type="target" position={Position.Left} className="!bg-amber-400 !size-2.5" />

			<div className="flex items-center justify-between gap-2 border-b border-white/15 pb-2.5">
				<div className="flex items-center gap-2">
					<span className="text-xl" aria-hidden="true">{data.avatar}</span>
					<span className="text-xs font-bold text-white tracking-wide">{data.title}</span>
				</div>
				<span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${badgeStyles[data.type]}`}>
					{data.percentage}
				</span>
			</div>

			<p className="mt-2 text-xs leading-relaxed text-zinc-300 font-medium">{data.subtitle}</p>

			<div className="mt-3 flex items-center justify-between rounded-xl bg-black/60 px-2.5 py-1 font-mono text-[9px] text-zinc-400 border border-white/5">
				<span className="text-zinc-500 uppercase">Stack:</span>
				<span className="font-semibold text-zinc-200">{data.tech}</span>
			</div>

			<Handle type="source" position={Position.Bottom} className="!bg-amber-400 !size-2.5" />
			<Handle type="source" position={Position.Right} className="!bg-amber-400 !size-2.5" />
		</div>
	);
}

const nodeTypes = {
	arch: ArchNode,
};

// Generous, wide architecture topology layout preventing any node overlap
const initialNodes: Node<ArchNodeData>[] = [
	{
		id: "n-user",
		type: "arch",
		position: { x: 340, y: 10 },
		data: {
			title: "User Web & Mobile",
			subtitle: "High-speed UI, Responsive Views, Client Auth",
			avatar: "📱",
			type: "frontend",
			tech: "Next.js 16 + React 19",
			percentage: "Frontend UI",
			roleExplanation: "Users interact with a conventional web or mobile interface; the application mediates identity, policy, and any ledger calls.",
		},
	},
	{
		id: "n-gateway",
		type: "arch",
		position: { x: 340, y: 140 },
		data: {
			title: "API Gateway & BFF",
			subtitle: "Token Validation, Route Orchestration, Rate Limits",
			avatar: "⚡",
			type: "gateway",
			tech: "FastAPI / Node.js",
			percentage: "Orchestration",
			roleExplanation: "The application gateway validates identity and business authorization, then routes private data and shared events to the appropriate systems.",
		},
	},
	{
		id: "n-enterprise",
		type: "arch",
		position: { x: 70, y: 280 },
		data: {
			title: "Enterprise Core",
			subtitle: "Customer PII, ERP, Inventory, Private Records",
			avatar: "🗄️",
			type: "enterprise",
			tech: "PostgreSQL / SAP / Kafka",
			percentage: "Private Data",
			roleExplanation: "User profiles, private records, search indexes, logs, and operational data normally remain in conventional enterprise systems.",
		},
	},
	{
		id: "n-blockchain",
		type: "arch",
		position: { x: 610, y: 280 },
		data: {
			title: "Shared Ledger Rail",
			subtitle: "Selected Cross-Organization Events & Rules",
			avatar: "📜",
			type: "blockchain",
			tech: "Permissioned ledger / contract",
			percentage: "Shared Events",
			roleExplanation: "Only events that earn cross-organization validation—such as a custody handoff or settlement instruction—should be considered for the ledger.",
		},
	},
	{
		id: "n-shared",
		type: "arch",
		position: { x: 340, y: 420 },
		data: {
			title: "Accepted Shared State",
			subtitle: "Multi-Organization Tamper-Evident Record",
			avatar: "🛡️",
			type: "shared",
			tech: "Tamper-Evident Chain",
			percentage: "Governed Validation",
			roleExplanation: "Authorized participants can verify the accepted record according to the network's permissions, protocol, and governance rules.",
		},
	},
];

const initialEdges: Edge[] = [
	{ id: "e-user-gw", source: "n-user", target: "n-gateway", animated: true, style: { stroke: "#38bdf8", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e-gw-erp", source: "n-gateway", target: "n-enterprise", animated: true, style: { stroke: "#a855f7", strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e-gw-bc", source: "n-gateway", target: "n-blockchain", animated: true, style: { stroke: "#f59e0b", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e-erp-shared", source: "n-enterprise", target: "n-shared", animated: true, style: { stroke: "#71717a", strokeWidth: 1.5 } },
	{ id: "e-bc-shared", source: "n-blockchain", target: "n-shared", animated: true, style: { stroke: "#34d399", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function EnterpriseArchFlowDemo() {
	const [activeStep, setActiveStep] = useState<number>(0);
	const [selectedNodeId, setSelectedNodeId] = useState<string>("n-blockchain");

	const steps = [
		{ label: "Step 1 · User Submits Request", detail: "The client sends a secured custody-transfer request to the application gateway." },
		{ label: "Step 2 · Application Validates", detail: "The gateway checks identity and policy; private operational data remains in the ERP and database." },
		{ label: "Step 3 · Shared Event Considered", detail: "If the event requires multi-party verification, the application submits the minimum approved data, hash, or pointer to the ledger rail." },
		{ label: "Step 4 · Authorized Verification", detail: "The network applies its rules, records accepted state, and lets authorized participants independently verify it." },
	];

	const advanceStep = useCallback(() => {
		setActiveStep((prev) => (prev + 1) % steps.length);
	}, [steps.length]);

	const reset = useCallback(() => {
		setActiveStep(0);
		setSelectedNodeId("n-blockchain");
	}, []);

	const activeNode = initialNodes.find((n) => n.id === selectedNodeId) ?? initialNodes[3];

	return (
		<div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center">
			{/* Top Control Bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/50 p-4 backdrop-blur-md">
				<div>
					<span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
						Enterprise Architecture Blueprint
					</span>
					<h3 className="font-display text-lg font-bold text-white">
						Use a shared ledger only for the small set of events that earns it
					</h3>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={advanceStep}
						className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-amber-400 px-5 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 shadow-lg shadow-amber-950/40">
						<Layers className="size-4" /> Simulate Request Flow <ArrowRight className="size-4" />
					</button>
					<button
						type="button"
						onClick={reset}
						className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl border border-white/15 px-3.5 text-xs text-zinc-300 transition hover:border-white/30 hover:text-white">
						<RefreshCw className="size-3.5" /> Reset
					</button>
				</div>
			</div>

			{/* Main Split Grid: ReactFlow Canvas on Left (70%) + Deep Inspector Card on Right (30%) */}
			<div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_0.85fr]">
				{/* React Flow Full Visualizer */}
				<div className="relative h-[460px] sm:h-[480px] md:h-[500px] w-full overflow-hidden rounded-3xl border border-white/15 bg-black/70 shadow-2xl">
					<ReactFlow
						nodes={initialNodes.map((n) => ({
							...n,
							data: {
								...n.data,
								highlight: n.id === selectedNodeId,
							},
						}))}
						edges={initialEdges}
						nodeTypes={nodeTypes}
						onNodeClick={(_, node) => setSelectedNodeId(node.id)}
						fitView
						fitViewOptions={{ padding: 0.2 }}
						minZoom={0.5}
						maxZoom={1.5}
						attributionPosition="bottom-left"
						className="h-full w-full cursor-grab active:cursor-grabbing">
						<Background color="#52525b" gap={30} size={1} />
						<Controls showInteractive={false} className="!bg-zinc-900 !border-white/15 !text-white" />
					</ReactFlow>

					{/* Live Flow Step Banner */}
					<div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl border border-white/15 bg-zinc-950/95 px-4 py-2.5 backdrop-blur-md">
						<div className="flex items-center gap-2.5">
							<span className="flex size-2.5 rounded-full bg-amber-400 animate-pulse" />
							<p className="font-mono text-xs font-bold text-amber-300">{steps[activeStep].label}</p>
						</div>
						<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
							Step {activeStep + 1} of 4
						</span>
					</div>
				</div>

				{/* Component Deep-Dive Inspector */}
				<div className="flex flex-col justify-between rounded-3xl border border-amber-300/40 bg-amber-300/[0.04] p-5 shadow-xl backdrop-blur-md">
					<div>
						<div className="flex items-center justify-between border-b border-white/10 pb-3">
							<div className="flex items-center gap-2">
								<span className="text-2xl" aria-hidden="true">{activeNode.data.avatar}</span>
								<div>
									<h4 className="font-display text-base font-bold text-white">{activeNode.data.title}</h4>
									<p className="font-mono text-[10px] text-amber-200">{activeNode.data.tech}</p>
								</div>
							</div>
							<span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
								{activeNode.data.percentage}
							</span>
						</div>

						<div className="mt-4 space-y-3">
							<div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
								<p className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">Architectural Role</p>
								<p className="mt-1 text-xs leading-relaxed text-zinc-200 font-medium">{activeNode.data.roleExplanation}</p>
							</div>

							<div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
								<p className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">Current Flow Action</p>
								<p className="mt-1 text-xs leading-relaxed text-amber-100">{steps[activeStep].detail}</p>
							</div>
						</div>
					</div>

					<div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-950/40 p-2.5 text-xs text-emerald-200">
						<ShieldCheck className="size-4 shrink-0 text-emerald-400" />
						<p className="text-[11px] leading-tight">
							<strong>Founder rule:</strong> Minimize sensitive on-ledger data. Use hashes, pointers, permissions, and retention controls only after privacy, legal, and threat-model review.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
