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
		idle: "border-white/15 bg-black/70 text-zinc-300",
		verifying: "border-amber-400/80 bg-amber-950/50 text-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.3)]",
		agreed: "border-cyan-400/80 bg-cyan-950/50 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.3)]",
		committed: "border-emerald-400/90 bg-emerald-950/50 text-emerald-200 shadow-[0_0_35px_rgba(52,211,153,0.35)]",
	};

	return (
		<div className={`w-[170px] rounded-2xl border p-3.5 text-center backdrop-blur-md transition-all duration-300 ${statusColors[data.status]}`}>
			<Handle type="target" position={Position.Top} className="!bg-amber-400 !size-2" />
			<Handle type="target" position={Position.Left} className="!bg-amber-400 !size-2" />
			<div className="flex items-center justify-between gap-1 border-b border-white/10 pb-1.5">
				<span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">{data.location}</span>
				{data.status === "committed" ? (
					<CheckCircle2 className="size-3.5 text-emerald-400" />
				) : data.isLeader ? (
					<span className="rounded bg-amber-400/20 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase text-amber-300">Proposer</span>
				) : (
					<Server className="size-3 text-zinc-500" />
				)}
			</div>
			<p className="mt-2 font-display text-sm font-bold text-white">{data.label}</p>
			<p className="font-mono text-[10px] uppercase text-zinc-400">{data.role}</p>
			<div className="mt-2 rounded-lg bg-black/60 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-amber-300">
				{data.status}
			</div>
			<Handle type="source" position={Position.Bottom} className="!bg-amber-400 !size-2" />
			<Handle type="source" position={Position.Right} className="!bg-amber-400 !size-2" />
		</div>
	);
}

const nodeTypes = {
	validator: ValidatorNode,
};

// Generously spaced node coordinates to prevent overlaps on tablet & projector resolutions
const initialNodes: Node<ValidatorData>[] = [
	{
		id: "node-1",
		type: "validator",
		position: { x: 300, y: 15 },
		data: { label: "Node Alpha", location: "Bengaluru", status: "idle", role: "Proposer Node", isLeader: true },
	},
	{
		id: "node-2",
		type: "validator",
		position: { x: 40, y: 140 },
		data: { label: "Node Beta", location: "Mumbai", status: "idle", role: "Validator #1" },
	},
	{
		id: "node-3",
		type: "validator",
		position: { x: 560, y: 140 },
		data: { label: "Node Gamma", location: "Delhi", status: "idle", role: "Validator #2" },
	},
	{
		id: "node-4",
		type: "validator",
		position: { x: 130, y: 290 },
		data: { label: "Node Delta", location: "Hyderabad", status: "idle", role: "Validator #3" },
	},
	{
		id: "node-5",
		type: "validator",
		position: { x: 470, y: 290 },
		data: { label: "Node Epsilon", location: "Chennai", status: "idle", role: "Validator #4" },
	},
];

const initialEdges: Edge[] = [
	{ id: "e1-2", source: "node-1", target: "node-2", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e1-3", source: "node-1", target: "node-3", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed } },
	{ id: "e2-4", source: "node-2", target: "node-4", animated: true, style: { stroke: "#71717a", strokeWidth: 1.5 } },
	{ id: "e3-5", source: "node-3", target: "node-5", animated: true, style: { stroke: "#71717a", strokeWidth: 1.5 } },
	{ id: "e4-5", source: "node-4", target: "node-5", animated: true, style: { stroke: "#71717a", strokeWidth: 1.5 } },
	{ id: "e2-3", source: "node-2", target: "node-3", animated: true, style: { stroke: "#71717a", strokeWidth: 1.5 } },
];

const CONSENSUS_STAGE_LABELS = {
	permissioned: [
		"Step 1: Propose — an authorized node broadcasts a candidate block",
		"Step 2: Validate — known participants independently check signatures and policy",
		"Step 3: Accept — the configured quorum rule is satisfied",
		"Step 4: Commit — authorized replicas converge on the accepted state",
	],
	pos: [
		"Step 1: Propose — the protocol selects a validator to propose a candidate",
		"Step 2: Validate — other validators check the candidate against protocol rules",
		"Step 3: Attest — protocol-specific stake thresholds build agreement",
		"Step 4: Finalize — finality follows the selected network's rules",
	],
	pow: [
		"Step 1: Build — miners assemble candidate blocks from valid transactions",
		"Step 2: Compete — miners search for a proof satisfying the difficulty target",
		"Step 3: Propagate — nodes validate the winning candidate and its proof",
		"Step 4: Confirm — accumulated work increases confidence over later blocks",
	],
} as const;

export default function ConsensusFlowDemo() {
	const [nodes, setNodes] = useState<Node<ValidatorData>[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);
	const [consensusModel, setConsensusModel] = useState<"permissioned" | "pos" | "pow">("permissioned");
	const [stage, setStage] = useState<number>(0);

	const runStep = useCallback(() => {
		setStage((prev) => {
			const nextStage = (prev + 1) % 4;
			const statusMap: Array<ValidatorData["status"]> = ["idle", "verifying", "agreed", "committed"];
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
						strokeWidth: nextStage === 2 ? 3 : 2,
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

	const selectModel = (model: "permissioned" | "pos" | "pow") => {
		setConsensusModel(model);
		reset();
	};

	return (
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
			{/* Viewer Control Bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-mono text-xs uppercase text-zinc-400">Consensus Engine:</span>
					<button
						type="button"
						onClick={() => selectModel("permissioned")}
						className={`rounded-xl px-3 py-1.5 font-mono text-xs transition ${
							consensusModel === "permissioned"
								? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/30"
								: "border border-white/10 text-zinc-300 hover:border-white/30"
						}`}>
						Enterprise Permissioned (BFT)
					</button>
					<button
						type="button"
						onClick={() => selectModel("pos")}
						className={`rounded-xl px-3 py-1.5 font-mono text-xs transition ${
							consensusModel === "pos"
								? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/30"
								: "border border-white/10 text-zinc-300 hover:border-white/30"
						}`}>
						Proof of Stake (PoS)
					</button>
					<button
						type="button"
						onClick={() => selectModel("pow")}
						className={`rounded-xl px-3 py-1.5 font-mono text-xs transition ${
							consensusModel === "pow"
								? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/30"
								: "border border-white/10 text-zinc-300 hover:border-white/30"
						}`}>
						Proof of Work (PoW)
					</button>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={runStep}
						className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-5 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 shadow-lg shadow-amber-950/40">
						<Zap className="size-4 stroke-[2.5]" /> Run Consensus Step <ArrowRight className="size-4" />
					</button>
					<button
						type="button"
						onClick={reset}
						className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-3 text-xs text-zinc-300 transition hover:border-white/30 hover:text-white">
						<RefreshCw className="size-3.5" /> Reset
					</button>
				</div>
			</div>

			{/* Flow Visualizer Stage with Zero Overlap */}
			<div className="relative mt-4 h-[420px] w-full overflow-hidden rounded-3xl border border-white/15 bg-black/60 shadow-2xl">
				<ReactFlow
					nodes={nodes}
					edges={edges}
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

				{/* Active Step Status Banner */}
				<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/15 bg-zinc-950/90 px-4 py-3 backdrop-blur-md">
					<div className="flex items-center gap-2.5">
						<span className="flex size-2.5 rounded-full bg-amber-400 animate-pulse" />
						<p className="font-mono text-xs font-semibold text-amber-300">{CONSENSUS_STAGE_LABELS[consensusModel][stage]}</p>
					</div>
					<span className="hidden font-mono text-[10px] uppercase tracking-wider text-zinc-400 sm:inline-block">
						{consensusModel.toUpperCase()} · 5 Regional Nodes
					</span>
				</div>
			</div>

			{/* Educational Explainer */}
			<div className="mt-3.5 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 text-xs leading-relaxed text-zinc-300">
				{consensusModel === "permissioned" && (
					<p>
						<strong className="text-white">Permissioned consensus:</strong> Known organizations authenticate nodes and follow configured validation and quorum rules. It avoids proof-of-work mining, but latency and finality still depend on the implementation and network conditions.
					</p>
				)}
				{consensusModel === "pos" && (
					<p>
						<strong className="text-white">Proof of stake:</strong> Validators commit stake and participate in protocol-specific proposing and attestation rules. Some protocols use slashing; thresholds and finality are not universal.
					</p>
				)}
				{consensusModel === "pow" && (
					<p>
						<strong className="text-white">Proof of work:</strong> Miners compete to produce valid computational proof; nodes prefer the history with the most accumulated work. Confirmations are probabilistic, and security and energy trade-offs depend on network conditions.
					</p>
				)}
				<p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-zinc-500">Simplified classroom comparison · exact algorithms differ by network</p>
			</div>
		</div>
	);
}
