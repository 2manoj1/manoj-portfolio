"use client";

import { useRef, useState } from "react";
import { Plus, RotateCcw, ShieldCheck, Zap, AlertOctagon } from "lucide-react";
import {
	buildBlock,
	type BlockVerification,
	type DemoBlock,
	verifyChain,
} from "@/lib/lectures/hash";

const INITIAL_BLOCKS: DemoBlock[] = [
	{
		index: 1,
		timestamp: "2026-08-21T09:00:00.000Z",
		transaction: "Example manufacturer created classroom Batch PCM-001",
		previousHash: "0".repeat(64),
		hash: "97a906d5db43a9d69fc97f5dd9fc1f6b288db5c0ed41d3f64bf84808e032bd89",
	},
	{
		index: 2,
		timestamp: "2026-08-21T09:05:00.000Z",
		transaction: "Example distributor recorded Batch PCM-001 · Quantity: 100 boxes",
		previousHash: "97a906d5db43a9d69fc97f5dd9fc1f6b288db5c0ed41d3f64bf84808e032bd89",
		hash: "597d0622d465293564b8047fe725230190e8c086036d7ca76d12dc49bc4f8584",
	},
	{
		index: 3,
		timestamp: "2026-08-21T09:15:00.000Z",
		transaction: "Example clinic recorded receipt of Batch PCM-001",
		previousHash: "597d0622d465293564b8047fe725230190e8c086036d7ca76d12dc49bc4f8584",
		hash: "181248746d188aff38d7e3b9f792dfe9620285e42d477a82eb80a72419fb77f7",
	},
];

const VALID_CHECKS: BlockVerification[] = INITIAL_BLOCKS.map((block) => ({
	calculatedHash: block.hash,
	hashMatches: true,
	linkMatches: true,
	chainValidThroughHere: true,
}));

function shortHash(hash: string) {
	return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

export default function IntegrityLab() {
	const [blocks, setBlocks] = useState<DemoBlock[]>(INITIAL_BLOCKS);
	const [checks, setChecks] = useState<BlockVerification[]>(VALID_CHECKS);
	const [draft, setDraft] = useState("Pharmacy received PCM-001");
	const [status, setStatus] = useState<"ready" | "working" | "error">("ready");
	const operationRef = useRef(0);

	const verify = async (nextBlocks: DemoBlock[]) => {
		const operation = ++operationRef.current;
		setStatus("working");
		try {
			const nextChecks = await verifyChain(nextBlocks);
			if (operation !== operationRef.current) return;
			setBlocks(nextBlocks);
			setChecks(nextChecks);
			setStatus("ready");
		} catch {
			if (operation !== operationRef.current) return;
			setStatus("error");
		}
	};

	const tamperBlock2 = () => {
		const tampered = blocks.map((block) =>
			block.index === 2
				? { ...block, transaction: block.transaction.replace("100", "1000") }
				: block,
		);
		void verify(tampered);
	};

	const tamperBlock1 = () => {
		const tampered = blocks.map((block) =>
			block.index === 1
				? { ...block, transaction: block.transaction + " [edited after commit]" }
				: block,
		);
		void verify(tampered);
	};

	const reset = () => {
		operationRef.current += 1;
		setBlocks(INITIAL_BLOCKS);
		setChecks(VALID_CHECKS);
		setDraft("Pharmacy received PCM-001");
		setStatus("ready");
	};

	const addBlock = async () => {
		if (!draft.trim() || blocks.length >= 5) return;
		const operation = ++operationRef.current;
		setStatus("working");
		try {
			const previous = blocks.at(-1);
			const block = await buildBlock({
				index: blocks.length + 1,
				timestamp: `2026-08-21T09:${String(15 + blocks.length * 5).padStart(2, "0")}:00.000Z`,
				transaction: draft.trim(),
				previousHash: previous?.hash ?? "0".repeat(64),
			});
			const nextBlocks = [...blocks, block];
			const nextChecks = await verifyChain(nextBlocks);
			if (operation !== operationRef.current) return;
			setBlocks(nextBlocks);
			setChecks(nextChecks);
			setDraft("");
			setStatus("ready");
		} catch {
			if (operation !== operationRef.current) return;
			setStatus("error");
		}
	};

	const chainValid = checks.every((check) => check.chainValidThroughHere);

	return (
		<div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center">
			{/* Top Control Header */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
				<div className="flex items-center gap-3 px-2">
					<div className={`grid size-11 place-items-center rounded-2xl ${chainValid ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
						{chainValid ? <ShieldCheck className="size-6" /> : <AlertOctagon className="size-6" />}
					</div>
					<div>
						<span className={`font-mono text-sm font-bold ${chainValid ? "text-emerald-300" : "text-rose-300"}`}>
							{chainValid ? "CLASSROOM CHAIN: CONSISTENT ✓" : "RECORD MISMATCH: HISTORY UNTRUSTED ✗"}
						</span>
						<p className="text-xs text-zinc-400">
							{chainValid
								? "Every block's stored hash matches its transaction payload and links to its predecessor."
								: "A stored payload no longer matches its accepted fingerprint; downstream trust is invalid from that point."}
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={tamperBlock2}
						disabled={status === "working" || !chainValid}
						className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-rose-600 px-4 font-display text-xs font-bold text-white transition hover:bg-rose-500 disabled:opacity-40 shadow-lg shadow-rose-950/50">
						<Zap className="size-4" /> ⚡ Tamper Block #2 (100 → 1,000)
					</button>
					<button
						type="button"
						onClick={tamperBlock1}
						disabled={status === "working" || !chainValid}
						className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-rose-800/80 px-4 font-display text-xs font-bold text-rose-200 transition hover:bg-rose-700 disabled:opacity-40">
						<Zap className="size-4" /> ⚡ Tamper Block #1
					</button>
					<button
						type="button"
						onClick={reset}
						className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 font-display text-xs font-bold text-zinc-200 transition hover:border-emerald-400 hover:text-emerald-300">
						<RotateCcw className="size-4" /> RESTORE ORIGINAL
					</button>
				</div>
			</div>

			{/* Interactive Blocks Pipeline with Zero Overlap */}
			<div className="mt-4 grid gap-4 lg:grid-cols-3">
				{blocks.map((block, index) => {
					const check = checks[index];
					const valid = check?.chainValidThroughHere ?? false;
					const isTamperedBlock = check && !check.hashMatches;
					const isLinkBroken = check && check.hashMatches && !check.linkMatches;
					const isDownstreamUntrusted = check && check.hashMatches && check.linkMatches && !check.chainValidThroughHere;

					return (
						<div
							key={`${block.index}-${block.hash}`}
							className={`relative flex flex-col justify-between rounded-3xl border p-5 transition-all duration-300 ${
								valid
									? "border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_40px_rgba(52,211,153,0.1)]"
									: isTamperedBlock
										? "border-rose-500 bg-rose-950/35 shadow-[0_0_50px_rgba(244,63,94,0.25)] ring-2 ring-rose-500/60"
										: "border-rose-500/60 bg-rose-950/20 shadow-[0_0_40px_rgba(244,63,94,0.15)]"
							}`}>
							{/* Header */}
							<div>
								<div className="flex items-center justify-between border-b border-white/10 pb-3">
									<div className="flex items-center gap-2">
										<span className={`grid size-6 place-items-center rounded-lg font-mono text-xs font-bold ${
											valid ? "bg-emerald-400/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
										}`}>
											#{block.index}
										</span>
										<span className="font-display text-sm font-bold text-white">BLOCK #{block.index}</span>
									</div>
									<span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
										valid ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
									}`}>
										{valid ? "VALID" : "INVALID"}
									</span>
								</div>

								{/* Transaction Payload */}
								<div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-3.5">
									<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">Transaction Payload</p>
									<p className={`mt-1.5 text-sm font-medium leading-relaxed ${
										isTamperedBlock ? "text-rose-200 font-bold" : "text-zinc-100"
									}`}>
										{block.transaction}
									</p>
								</div>

								{/* Hashes */}
								<dl className="mt-4 space-y-2 rounded-2xl border border-white/5 bg-black/30 p-3.5 font-mono text-[11px]">
									<div>
										<dt className="text-[10px] uppercase tracking-wider text-zinc-500">PREV HASH:</dt>
										<dd className="mt-0.5 break-all text-zinc-400">{shortHash(block.previousHash)}</dd>
									</div>
									<div className="border-t border-white/5 pt-2">
										<dt className="text-[10px] uppercase tracking-wider text-zinc-500">STORED HASH:</dt>
										<dd className={`mt-0.5 break-all ${isTamperedBlock ? "text-rose-400 line-through" : "text-emerald-300"}`}>
											{shortHash(block.hash)}
										</dd>
									</div>
									{check && !check.hashMatches && (
										<div className="border-t border-rose-500/20 pt-2 text-rose-300">
											<dt className="text-[10px] uppercase tracking-wider font-bold text-rose-400">CALCULATED HASH:</dt>
											<dd className="mt-0.5 break-all font-bold">{shortHash(check.calculatedHash)}</dd>
										</div>
									)}
								</dl>
							</div>

							{/* Failure explanation banner inside block */}
							{isTamperedBlock ? (
								<div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/40 p-2.5 text-center font-mono text-[10px] font-bold text-rose-300">
									❌ TAMPER DETECTED: Stored Hash ≠ Calculated Hash
								</div>
							) : isLinkBroken ? (
								<div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/30 p-2.5 text-center font-mono text-[10px] text-rose-300">
									⚠️ LINK BROKEN: Previous Hash pointer mismatch
								</div>
							) : isDownstreamUntrusted ? (
								<div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/30 p-2.5 text-center font-mono text-[10px] text-amber-300">
									⚠️ DOWNSTREAM TRUST INVALID: upstream verification failed
								</div>
							) : (
								<div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2 text-center font-mono text-[10px] text-emerald-300">
									✓ Cryptographic Link Verified
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Add Block Form */}
			<div className="mt-4 flex flex-col gap-2 sm:flex-row">
				<input
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					maxLength={100}
					placeholder="Type a classroom transaction event to append..."
					className="min-h-12 flex-1 rounded-2xl border border-white/15 bg-black/40 px-5 text-sm text-white outline-none focus:border-amber-400"
				/>
				<button
					type="button"
					onClick={() => void addBlock()}
					disabled={status === "working" || !draft.trim() || blocks.length >= 5 || !chainValid}
					className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 font-display text-sm font-bold text-zinc-950 transition hover:bg-amber-300 disabled:opacity-40 shadow-lg shadow-amber-950/40">
					<Plus className="size-4 stroke-[3]" /> Add Block #{blocks.length + 1}
				</button>
			</div>
		</div>
	);
}
