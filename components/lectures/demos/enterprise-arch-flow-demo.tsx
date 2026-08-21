"use client";

import { useState } from "react";
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
import { Layers, Server, Database, ShieldCheck, Globe, Cpu, ArrowRight, RefreshCw } from "lucide-react";

type ArchNodeData = {
	title: string;
	subtitle: string;
	type: "frontend" | "gateway" | "enterprise" | "blockchain" | "shared";
	tech: string;
	active?: boolean;
};

function ArchNode({ data }: NodeProps<Node<ArchNodeData>>) {
	const borderStyles = {
		frontend: "border-sky-400/70 bg-sky-950/40 text-sky-200",
		gateway: "border-violet-400/70 bg-violet-950/40 text-violet-200",
		enterprise: "border-zinc-400/70 bg-zinc-900/60 text-zinc-200",
		blockchain: "border-amber-400/80 bg-amber-950/40 text-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.2)]",
		shared: "border-emerald-400/80 bg-emerald-950/40 text-emerald-200 shadow-[0_0_25px_rgba(52,211,153,0.2)]",
	};

	const icons = {
		frontend: <Globe className="size-4 text-sky-400" />,
		gateway: <Server className="size-4 text-violet-400" />,
		enterprise: <Database className="size-4 text-zinc-400" />,
		blockchain: <Cpu className="size-4 text-amber-400" />,
		shared: <ShieldCheck className="size-4 text-emerald-400" />,
	};

	return (
		<div className={`min-w-[190px] rounded-2xl border p-3.5 backdrop-blur-md transition-all duration-300 ${borderStyles[data.type]}`}>
			<Handle type="target" position={Position.Top} className="!bg-amber-400" />
			<Handle type="target" position={Position.Left} className="!bg-amber-400" />
			<div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
				<span className="flex items-center gap-1.5 text-xs font-semibold text-white">
					{icons[data.type]} {data.title}
				</span>
				<span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[9px] uppercase text-zinc-400">
					{data.tech}
				</span>
			</div>
			<p className="mt-2 text-xs leading-relaxed text-zinc-300">{data.subtitle}</p>
			<Handle type="source" position={Position.Bottom} className="!bg-amber-400" />
			<Handle type="source" position={Position.Right} className="!bg-amber-400" />
		</div>
	);
}

const nodeTypes = {
	arch: ArchNode,
};

const initialNodes: Node<ArchNodeData>[] = [
	{
		id: "n-user",
		type: "arch",
		position: { x: 300, y: 15 },
		data: { title: "User Client", subtitle: "Web / Mobile Application", type: "frontend", tech: "Next.js 16 + React" },
	},
	{
		id: "n-gateway",
		type: "arch",
		position: { x: 300, y: 130 },
		data: { title: "API Gateway / BFF", subtitle: "Auth, Orchestration, Validation", type: "gateway", tech: "FastAPI / Node.js" },
	},
	{
		id: "n-enterprise",
		type: "arch",
		position: { x: 100, y: 260 },
		data: { title: "Enterprise Systems", subtitle: "Private Customer DB, ERP, CRM, Core Banking", type: "enterprise", tech: "PostgreSQL / SAP / Kafka" },
	},
	{
		id: "n-blockchain",
		type: "arch",
		position: { x: 500, y: 260 },
		data: { title: "Blockchain Rail", subtitle: "Smart Contract Execution & Audit Log", type: "blockchain", tech: "EVM / Vishvasya / Hyperledger" },
	},
	{
		id: "n-shared",
		type: "arch",
		position: { x: 300, y: 390 },
		data: { title: "Shared Final State", subtitle: "Multi-Party Cryptographic Consensus Proof", type: "shared", tech: "Tamper-Evident Ledger" },
	},
];

const initialEdges: Edge[] = [
	{ id: "e-user-gw", source: "n-user", target: "n-gateway", animated: true, style: { stroke: "#38bdf8", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e-gw-erp", source: "n-gateway", target: "n-enterprise", animated: true, style: { stroke: "#a855f7", strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e-gw-bc", source: "n-gateway", target: "n-blockchain", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e-erp-shared", source: "n-enterprise", target: "n-shared", animated: true, style: { stroke: "#71717a", strokeWidth: 1 } },
	{ id: "e-bc-shared", source: "n-blockchain", target: "n-shared", animated: true, style: { stroke: "#34d399", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function EnterpriseArchFlowDemo() {
	const [activeStep, setActiveStep] = useState<number>(0);

	const steps = [
		{ label: "1. User Triggers Action", detail: "Client requests a high-value payment or medicine dispatch via Next.js UI." },
		{ label: "2. API Gateway Orchestrates", detail: "API validates identity and updates the company's internal ERP & PostgreSQL database." },
		{ label: "3. Smart Contract Commit", detail: "Gateway simultaneously submits the cryptographic event to the shared Blockchain rail." },
		{ label: "4. Shared Finality", detail: "External parties and auditors verify the transaction against immutable shared state." },
	];

	const advanceStep = () => {
		setActiveStep((prev) => (prev + 1) % steps.length);
	};

	return (
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col">
			{/* Banner */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
				<div>
					<span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">Enterprise Engineering Truth</span>
					<h3 className="font-display text-lg text-white">Blockchain is a Component — Not The Entire Application</h3>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={advanceStep}
						className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-bold text-zinc-950 transition hover:bg-amber-300">
						<Layers className="size-3.5" /> Simulate Request Flow <ArrowRight className="size-3.5" />
					</button>
					<button
						type="button"
						onClick={() => setActiveStep(0)}
						className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-3 text-xs text-zinc-300 hover:text-white">
						<RefreshCw className="size-3.5" /> Reset
					</button>
				</div>
			</div>

			{/* React Flow Viewport */}
			<div className="relative mt-4 h-[440px] w-full overflow-hidden rounded-3xl border border-white/15 bg-black/50">
				<ReactFlow
					nodes={initialNodes}
					edges={initialEdges}
					nodeTypes={nodeTypes}
					fitView
					attributionPosition="bottom-left"
					className="h-full w-full">
					<Background color="#3f3f46" gap={24} size={1} />
					<Controls showInteractive={false} className="!bg-zinc-900 !border-white/10 !text-white" />
				</ReactFlow>

				{/* Active Step Overlay */}
				<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/85 px-4 py-3 backdrop-blur-md">
					<div>
						<p className="font-mono text-xs font-semibold text-amber-300">{steps[activeStep].label}</p>
						<p className="mt-0.5 text-xs text-zinc-300">{steps[activeStep].detail}</p>
					</div>
					<span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase text-emerald-300">
						Active Flow
					</span>
				</div>
			</div>
		</div>
	);
}
