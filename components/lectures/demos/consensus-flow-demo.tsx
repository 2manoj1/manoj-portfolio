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
import { Zap, RefreshCw, Server, CheckCircle2, ArrowRight } from "lucide-react";

type ValidatorData = {
	label: string;
	location: string;
	status: "idle" | "verifying" | "agreed" | "committed";
	role: string;
	isLeader?: boolean;
};

function ValidatorNode({ data }: NodeProps<Node<ValidatorData>>) {
	const statusColors = {
		idle: "border-white/15 bg-black/60 text-zinc-300",
		verifying: "border-amber-400/80 bg-amber-950/40 text-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.25)]",
		agreed: "border-cyan-400/80 bg-cyan-950/40 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.25)]",
		committed: "border-emerald-400/80 bg-emerald-950/40 text-emerald-200 shadow-[0_0_30px_rgba(52,211,153,0.3)]",
	};

	return (
		<div className={`min-w-[160px] rounded-2xl border p-3 text-center backdrop-blur-md transition-all duration-300 ${statusColors[data.status]}`}>
			<Handle type="target" position={Position.Top} className="!bg-amber-400" />
			<Handle type="target" position={Position.Left} className="!bg-amber-400" />
			<div className="flex items-center justify-between gap-1 border-b border-white/10 pb-1.5">
				<span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">{data.location}</span>
				{data.status === "committed" ? (
					<CheckCircle2 className="size-3 text-emerald-400" />
				) : data.isLeader ? (
					<span className="rounded bg-amber-400/20 px-1 font-mono text-[8px] uppercase text-amber-300">Proposer</span>
				) : (
					<Server className="size-3 text-zinc-500" />
				)}
			</div>
			<p className="mt-2 font-display text-sm font-semibold text-white">{data.label}</p>
			<p className="font-mono text-[10px] uppercase text-zinc-400">{data.role}</p>
			<div className="mt-2 rounded-lg bg-black/50 py-1 font-mono text-[9px] uppercase tracking-widest text-amber-300">
				{data.status}
			</div>
			<Handle type="source" position={Position.Bottom} className="!bg-amber-400" />
			<Handle type="source" position={Position.Right} className="!bg-amber-400" />
		</div>
	);
}

const nodeTypes = {
	validator: ValidatorNode,
};

const initialNodes: Node<ValidatorData>[] = [
	{
		id: "node-1",
		type: "validator",
		position: { x: 280, y: 30 },
		data: { label: "Node Alpha", location: "Bengaluru", status: "idle", role: "Proposer Node", isLeader: true },
	},
	{
		id: "node-2",
		type: "validator",
		position: { x: 80, y: 170 },
		data: { label: "Node Beta", location: "Mumbai", status: "idle", role: "Validator #1" },
	},
	{
		id: "node-3",
		type: "validator",
		position: { x: 480, y: 170 },
		data: { label: "Node Gamma", location: "Delhi", status: "idle", role: "Validator #2" },
	},
	{
		id: "node-4",
		type: "validator",
		position: { x: 150, y: 320 },
		data: { label: "Node Delta", location: "Hyderabad", status: "idle", role: "Validator #3" },
	},
	{
		id: "node-5",
		type: "validator",
		position: { x: 410, y: 320 },
		data: { label: "Node Epsilon", location: "Chennai", status: "idle", role: "Validator #4" },
	},
];

const initialEdges: Edge[] = [
	{ id: "e1-2", source: "node-1", target: "node-2", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e1-3", source: "node-1", target: "node-3", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e2-4", source: "node-2", target: "node-4", animated: true, style: { stroke: "#71717a", strokeWidth: 1 } },
	{ id: "e3-5", source: "node-3", target: "node-5", animated: true, style: { stroke: "#71717a", strokeWidth: 1 } },
	{ id: "e4-5", source: "node-4", target: "node-5", animated: true, style: { stroke: "#71717a", strokeWidth: 1 } },
	{ id: "e2-3", source: "node-2", target: "node-3", animated: true, style: { stroke: "#71717a", strokeWidth: 1 } },
];

export default function ConsensusFlowDemo() {
	const [nodes, setNodes] = useState<Node<ValidatorData>[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);
	const [consensusModel, setConsensusModel] = useState<"permissioned" | "pos" | "pow">("permissioned");
	const [stage, setStage] = useState<number>(0);

	const runStep = useCallback(() => {
		setStage((prev) => {
			const nextStage = (prev + 1) % 4;
			const statusMap: Array<ValidatorData["status"]> = ["verifying", "agreed", "committed", "idle"];
			const currentStatus = statusMap[nextStage];

			setNodes((nds) =>
				nds.map((node) => ({
					...node,
					data: {
						...node.data,
						status: currentStatus,
					},
				}))
			);

			setEdges((eds) =>
				eds.map((edge) => ({
					...edge,
					style: {
						...edge.style,
						stroke: nextStage === 0 ? "#f59e0b" : nextStage === 1 ? "#22d3ee" : nextStage === 2 ? "#34d399" : "#71717a",
						strokeWidth: nextStage === 2 ? 2.5 : 1.5,
					},
				}))
			);

			return nextStage;
		});
	}, []);

	const reset = useCallback(() => {
		setStage(0);
		setNodes(initialNodes);
		setEdges(initialEdges);
	}, []);

	const stageLabels = [
		"1. Broadcast: Proposer sends new block candidate to network",
		"2. Validate: Independent nodes verify signatures & rules",
		"3. Agree: Supermajority threshold (>66%) reached",
		"4. Committed: Block appended to all distributed ledgers",
	];

	return (
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col">
			{/* Controls bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-mono text-xs uppercase text-zinc-400">Consensus Mode:</span>
					<button
						type="button"
						onClick={() => setConsensusModel("permissioned")}
						className={`rounded-xl px-3 py-1.5 font-mono text-xs transition ${
							consensusModel === "permissioned"
								? "bg-amber-400 text-zinc-950 font-bold"
								: "border border-white/10 text-zinc-300 hover:border-white/30"
						}`}>
						Enterprise Permissioned (BFT)
					</button>
					<button
						type="button"
						onClick={() => setConsensusModel("pos")}
						className={`rounded-xl px-3 py-1.5 font-mono text-xs transition ${
							consensusModel === "pos"
								? "bg-amber-400 text-zinc-950 font-bold"
								: "border border-white/10 text-zinc-300 hover:border-white/30"
						}`}>
						Proof of Stake (PoS)
					</button>
					<button
						type="button"
						onClick={() => setConsensusModel("pow")}
						className={`rounded-xl px-3 py-1.5 font-mono text-xs transition ${
							consensusModel === "pow"
								? "bg-amber-400 text-zinc-950 font-bold"
								: "border border-white/10 text-zinc-300 hover:border-white/30"
						}`}>
						Proof of Work (PoW)
					</button>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={runStep}
						className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 shadow-lg shadow-amber-950/40">
						<Zap className="size-3.5" /> Advance Consensus Step <ArrowRight className="size-3.5" />
					</button>
					<button
						type="button"
						onClick={reset}
						className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-3 text-xs text-zinc-300 transition hover:border-white/30 hover:text-white">
						<RefreshCw className="size-3.5" /> Reset
					</button>
				</div>
			</div>

			{/* Flow Container */}
			<div className="relative mt-4 h-[380px] w-full overflow-hidden rounded-3xl border border-white/15 bg-black/50">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					fitView
					attributionPosition="bottom-left"
					className="h-full w-full">
					<Background color="#3f3f46" gap={24} size={1} />
					<Controls showInteractive={false} className="!bg-zinc-900 !border-white/10 !text-white" />
				</ReactFlow>

				{/* Bottom Live Step Label */}
				<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-2.5 backdrop-blur-md">
					<span className="font-mono text-xs text-amber-300">{stageLabels[stage]}</span>
					<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
						Model: {consensusModel.toUpperCase()} · 5 Active Nodes
					</span>
				</div>
			</div>

			{/* Educational Explainer */}
			<div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-zinc-300">
				{consensusModel === "permissioned" && (
					<p>
						<strong className="text-white">Enterprise Permissioned Consensus:</strong> Known institutional nodes (e.g. RBI, banks, hospitals) validate transactions without energy-intensive mining. Supermajority voting achieves finality in sub-seconds.
					</p>
				)}
				{consensusModel === "pos" && (
					<p>
						<strong className="text-white">Proof of Stake (PoS):</strong> Validators lock collateral (stake) to propose and attest to blocks. Malicious actors face slashing (loss of stake).
					</p>
				)}
				{consensusModel === "pow" && (
					<p>
						<strong className="text-white">Proof of Work (PoW):</strong> Nodes compete computationally to solve a mathematical puzzle (finding a nonce). Provides open censorship resistance at the cost of high energy.
					</p>
				)}
			</div>
		</div>
	);
}
