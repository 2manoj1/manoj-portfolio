"use client";

import { useRef, useState } from "react";
import { Plus, RotateCcw, ShieldAlert, ShieldCheck, Wrench } from "lucide-react";
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
		transaction: "Manufacturer created medicine batch PCM-001",
		previousHash: "0".repeat(64),
		hash: "9cbf6e03cddd058882ee5897fa6949986bb90ed06a3b33671d97c34ef16e3add",
	},
	{
		index: 2,
		timestamp: "2026-08-21T09:05:00.000Z",
		transaction: "Distributor received PCM-001 · Quantity: 100",
		previousHash: "9cbf6e03cddd058882ee5897fa6949986bb90ed06a3b33671d97c34ef16e3add",
		hash: "ed604c9b2dacc7145cebc2c7d27b15325609f4eafe25195ff2127bf5e6d32fc5",
	},
	{
		index: 3,
		timestamp: "2026-08-21T09:15:00.000Z",
		transaction: "Hospital received PCM-001",
		previousHash: "ed604c9b2dacc7145cebc2c7d27b15325609f4eafe25195ff2127bf5e6d32fc5",
		hash: "d97bc83061f67d64ee4308121a35358fcec617375ed71c04d9ca1d44d47c9aee",
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

	const tamper = () => {
		const tampered = blocks.map((block) =>
			block.index === 2
				? { ...block, transaction: block.transaction.replace("100", "1000") }
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
		if (!draft.trim() || blocks.length >= 6) return;
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
		<div className="mx-auto w-full max-w-7xl">
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/30 p-3">
				<div className="flex items-center gap-2 px-2" role={chainValid ? "status" : "alert"}>
					{chainValid ? <ShieldCheck className="size-5 text-emerald-300" /> : <ShieldAlert className="size-5 text-rose-300" />}
					<span className={`font-mono text-sm font-semibold ${chainValid ? "text-emerald-200" : "text-rose-200"}`}>
						INTEGRITY {chainValid ? "VERIFIED" : "FAILED"}
					</span>
				</div>
				<div className="flex flex-wrap gap-2">
					<button type="button" onClick={tamper} disabled={status === "working" || !chainValid} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-700 px-4 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-40">
						<Wrench className="size-4" /> Tamper with block
					</button>
					<button type="button" onClick={reset} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-zinc-200 hover:border-white/30">
						<RotateCcw className="size-4" /> Restore / reset
					</button>
				</div>
			</div>

			<ol className="mt-4 grid gap-3 lg:grid-cols-3">
				{blocks.map((block, index) => {
					const check = checks[index];
					const valid = check?.chainValidThroughHere ?? false;
					return (
						<li key={`${block.index}-${block.hash}`} className={`relative min-w-0 rounded-2xl border p-4 ${valid ? "border-emerald-400/30 bg-emerald-400/[0.04]" : "border-rose-400/50 bg-rose-400/[0.07]"}`}>
							<div className="flex items-center justify-between gap-3">
								<span className="font-mono text-xs uppercase text-zinc-500">Block #{block.index}</span>
								<span className={`size-2.5 rounded-full ${valid ? "bg-emerald-300" : "bg-rose-300"}`} />
							</div>
							<p className="mt-4 min-h-14 text-sm leading-6 text-zinc-100">{block.transaction}</p>
							<dl className="mt-4 space-y-2 font-mono text-[10px] leading-5 text-zinc-500">
								<div><dt className="inline text-zinc-600">PREV </dt><dd className="inline break-all">{shortHash(block.previousHash)}</dd></div>
								<div><dt className="inline text-zinc-600">STORED </dt><dd className="inline break-all">{shortHash(block.hash)}</dd></div>
								{check && !check.hashMatches ? <div className="text-rose-300"><dt className="inline">CALCULATED </dt><dd className="inline">{shortHash(check.calculatedHash)}</dd></div> : null}
							</dl>
							{check && !check.hashMatches ? <p className="mt-3 text-xs font-semibold text-rose-300">Stored hash no longer matches data.</p> : null}
							{check && check.hashMatches && !check.linkMatches ? <p className="mt-3 text-xs font-semibold text-rose-300">Previous link is broken.</p> : null}
							{check && check.hashMatches && check.linkMatches && !check.chainValidThroughHere ? <p className="mt-3 text-xs font-semibold text-amber-300">Downstream trust is invalid.</p> : null}
						</li>
					);
				})}
			</ol>

			<div className="mt-4 flex flex-col gap-2 sm:flex-row">
				<input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={100} placeholder="Add a new transaction" className="min-h-11 flex-1 rounded-xl border border-white/15 bg-black/30 px-4 text-sm text-white outline-none focus:border-amber-300/60" />
				<button type="button" onClick={() => void addBlock()} disabled={status === "working" || !draft.trim() || blocks.length >= 6 || !chainValid} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 text-sm font-semibold text-zinc-950 disabled:opacity-40">
					<Plus className="size-4" /> Add linked block
				</button>
			</div>
			{status === "error" ? <p className="mt-3 text-sm text-rose-300">Web Crypto failed. Reset and retry in a modern secure browser.</p> : null}
		</div>
	);
}
