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
		frontend: "border-sky-400/80 bg-sky-950/50 text-sky-200 shadow-[0_0_25px_rgba(56,189,248,0.2)]",
		gateway: "border-violet-400/80 bg-violet-950/50 text-violet-200 shadow-[0_0_25px_rgba(168,85,247,0.2)]",
		enterprise: "border-zinc-400/80 bg-zinc-900/80 text-zinc-200 shadow-[0_0_25px_rgba(161,161,170,0.15)]",
		blockchain: "border-amber-400/90 bg-amber-950/50 text-amber-200 shadow-[0_0_35px_rgba(251,191,36,0.3)]",
		shared: "border-emerald-400/90 bg-emerald-950/50 text-emerald-200 shadow-[0_0_35px_rgba(52,211,153,0.3)]",
	};

	const icons = {
		frontend: <Globe className="size-4 text-sky-400" />,
		gateway: <Server className="size-4 text-violet-400" />,
		enterprise: <Database className="size-4 text-zinc-400" />,
		blockchain: <Cpu className="size-4 text-amber-400" />,
		shared: <ShieldCheck className="size-4 text-emerald-400" />,
	};

	return (
		<div className={`w-[210px] rounded-2xl border p-4 backdrop-blur-md transition-all duration-300 ${borderStyles[data.type]}`}>
			<Handle type="target" position={Position.Top} className="!bg-amber-400 !size-2" />
			<Handle type="target" position={Position.Left} className="!bg-amber-400 !size-2" />
			<div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
				<span className="flex items-center gap-1.5 text-xs font-bold text-white">
					{icons[data.type]} {data.title}
				</span>
				<span className="rounded bg-black/50 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase text-zinc-400">
					{data.tech}
				</span>
			</div>
			<p className="mt-2 text-xs leading-relaxed text-zinc-300">{data.subtitle}</p>
			<Handle type="source" position={Position.Bottom} className="!bg-amber-400 !size-2" />
			<Handle type="source" position={Position.Right} className="!bg-amber-400 !size-2" />
		</div>
	);
}

const nodeTypes = {
	arch: ArchNode,
};

// Generous spacing to guarantee zero overlap across tablet, 1080p, desktop and projector
const initialNodes: Node<ArchNodeData>[] = [
	{
		id: "n-user",
		type: "arch",
		position: { x: 300, y: 10 },
		data: { title: "User Client", subtitle: "Web / Mobile App", type: "frontend", tech: "Next.js 16 + React" },
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
		position: { x: 60, y: 260 },
		data: { title: "Enterprise Tier (90%)", subtitle: "Customer DB, ERP, Private Logs", type: "enterprise", tech: "PostgreSQL / SAP / Kafka" },
	},
	{
		id: "n-blockchain",
		type: "arch",
		position: { x: 540, y: 260 },
		data: { title: "Blockchain Rail (10%)", subtitle: "Smart Contracts & Verification", type: "blockchain", tech: "EVM / Vishvasya / BFT" },
	},
	{
		id: "n-shared",
		type: "arch",
		position: { x: 300, y: 390 },
		data: { title: "Shared Final State", subtitle: "Multi-Party Cryptographic Consensus", type: "shared", tech: "Tamper-Evident Ledger" },
	},
];

const initialEdges: Edge[] = [
	{ id: "e-user-gw", source: "n-user", target: "n-gateway", animated: true, style: { stroke: "#38bdf8", strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e-gw-erp", source: "n-gateway", target: "n-enterprise", animated: true, style: { stroke: "#a855f7", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e-gw-bc", source: "n-gateway", target: "n-blockchain", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e-erp-shared", source: "n-enterprise", target: "n-shared", animated: true, style: { stroke: "#71717a", strokeWidth: 1.5 } },
	{ id: "e-bc-shared", source: "n-blockchain", target: "n-shared", animated: true, style: { stroke: "#34d399", strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function EnterpriseArchFlowDemo() {
	const [activeStep, setActiveStep] = useState<number>(0);

	const steps = [
		{ label: "Step 1 · User Triggers Action", detail: "A client initiates a medicine dispatch or high-value cross-border payment on Next.js UI." },
		{ label: "Step 2 · API Gateway Validates", detail: "FastAPI checks user permissions and orchestrates internal PostgreSQL and SAP ERP records." },
		{ label: "Step 3 · Smart Contract Execution", detail: "Gateway concurrently submits the cryptographic event payload to the shared Blockchain rail." },
		{ label: "Step 4 · Shared Tamper-Evident State", detail: "Independent external parties (regulators, buyers, banks) verify the transaction on the shared ledger." },
	];

	const advanceStep = () => {
		setActiveStep((prev) => (prev + 1) % steps.length);
	};

	return (
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
			{/* Top Bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
				<div>
					<span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">Enterprise Systems Architecture</span>
					<h3 className="font-display text-lg text-white">Blockchain is a Component — Not The Entire Application</h3>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={advanceStep}
						className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-5 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 shadow-lg shadow-amber-950/40">
						<Layers className="size-4" /> Simulate Request Flow <ArrowRight className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => setActiveStep(0)}
						className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-3 text-xs text-zinc-300 hover:text-white">
						<RefreshCw className="size-3.5" /> Reset
					</button>
				</div>
			</div>

			{/* React Flow Viewport with Zero Overlap */}
			<div className="relative mt-4 h-[440px] w-full overflow-hidden rounded-3xl border border-white/15 bg-black/60 shadow-2xl">
				<ReactFlow
					nodes={initialNodes}
					edges={initialEdges}
					nodeTypes={nodeTypes}
					fitView
					fitViewOptions={{ padding: 0.22 }}
					minZoom={0.5}
					maxZoom={1.5}
					attributionPosition="bottom-left"
					className="h-full w-full">
					<Background color="#52525b" gap={28} size={1} />
					<Controls showInteractive={false} className="!bg-zinc-900 !border-white/10 !text-white" />
				</ReactFlow>

				{/* Active Step Indicator Overlay */}
				<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/15 bg-zinc-950/90 px-4 py-3 backdrop-blur-md">
					<div>
						<p className="font-mono text-xs font-bold text-amber-300">{steps[activeStep].label}</p>
						<p className="mt-0.5 text-xs text-zinc-300">{steps[activeStep].detail}</p>
					</div>
					<span className="hidden rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase font-bold text-emerald-300 sm:inline-block">
						Simulating Live Flow
					</span>
				</div>
			</div>
		</div>
	);
}
