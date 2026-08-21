"use client";

import { useState } from "react";
import { Check, X, RotateCcw, Database, ShieldCheck } from "lucide-react";

type QuestionStep = {
	id: number;
	title: string;
	subtitle: string;
	hint: string;
};

const QUESTIONS: QuestionStep[] = [
	{
		id: 1,
		title: "Are there multiple independent organizations involved?",
		subtitle: "e.g., Banks, hospitals, government agencies, logistics vendors with separate legal governance.",
		hint: "If only ONE company owns the data, internal access controls and PostgreSQL are almost always better.",
	},
	{
		id: 2,
		title: "Do these parties need to write to and read from a shared record?",
		subtitle: "e.g., Shared custody of medicine batches, cross-border payment settlement, or academic credentials.",
		hint: "If parties only read static reports, simple web APIs with digital signatures suffice.",
	},
	{
		id: 3,
		title: "Is there limited mutual trust between the participants?",
		subtitle: "No single party can be trusted to run the master database without potential conflict of interest.",
		hint: "If all parties 100% trust a single neutral central authority (e.g. AWS or a single bank), a centralized DB wins.",
	},
	{
		id: 4,
		title: "Is tamper-evident auditability or provenance strictly required?",
		subtitle: "Past records must never be secretly altered or deleted by any administrator without detection.",
		hint: "If regular backups and standard database audit logs are sufficient, blockchain overhead is unnecessary.",
	},
];

export default function DecisionTreeDemo() {
	const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
	const [answers, setAnswers] = useState<boolean[]>([]);
	const [verdict, setVerdict] = useState<"database" | "blockchain" | null>(null);

	const handleAnswer = (answer: boolean) => {
		const nextAnswers = [...answers, answer];
		setAnswers(nextAnswers);

		if (!answer) {
			// Answering NO at any stage directs to USE A DATABASE
			setVerdict("database");
		} else if (currentStepIndex === QUESTIONS.length - 1) {
			// If all 4 answered YES
			setVerdict("blockchain");
		} else {
			setCurrentStepIndex((prev) => prev + 1);
		}
	};

	const reset = () => {
		setCurrentStepIndex(0);
		setAnswers([]);
		setVerdict(null);
	};

	const currentQ = QUESTIONS[currentStepIndex];

	return (
		<div className="mx-auto w-full max-w-5xl">
			{/* Top Bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
				<div>
					<span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">Engineering Judgment Diagnostic</span>
					<h3 className="font-display text-lg text-white">Do You Actually Need a Blockchain?</h3>
				</div>
				<button
					type="button"
					onClick={reset}
					className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/15 px-3 text-xs text-zinc-300 transition hover:border-white/30 hover:text-white">
					<RotateCcw className="size-3.5" /> Restart Diagnostic
				</button>
			</div>

			{/* Diagnostic Steps Grid */}
			<div className="mt-5 grid grid-cols-4 gap-2">
				{QUESTIONS.map((q, idx) => {
					const isAnswered = idx < answers.length;
					const answerValue = answers[idx];
					const isCurrent = idx === currentStepIndex && verdict === null;

					return (
						<div
							key={q.id}
							className={`rounded-xl border p-2.5 text-center transition-all ${
								isCurrent
									? "border-amber-400 bg-amber-400/10"
									: isAnswered
										? answerValue
											? "border-emerald-400/40 bg-emerald-400/5 text-emerald-300"
											: "border-rose-400/40 bg-rose-400/5 text-rose-300"
										: "border-white/10 bg-white/[0.02] text-zinc-600"
							}`}>
							<p className="font-mono text-[9px] uppercase">Step 0{q.id}</p>
							<p className="mt-1 truncate font-sans text-xs font-semibold">
								{isAnswered ? (answerValue ? "YES ✓" : "NO ✗") : `Check #${q.id}`}
							</p>
						</div>
					);
				})}
			</div>

			{/* Main Interactive Stage */}
			<div className="mt-5">
				{verdict === null ? (
					<div className="rounded-3xl border border-amber-300/40 bg-amber-300/[0.04] p-6 text-center shadow-[0_0_60px_rgba(251,191,36,0.06)] md:p-8">
						<span className="inline-block rounded-full bg-amber-400/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300">
							Evaluation Question {currentStepIndex + 1} of {QUESTIONS.length}
						</span>
						<h2 className="mx-auto mt-4 max-w-2xl font-display text-2xl text-white md:text-3xl">
							{currentQ.title}
						</h2>
						<p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-300">
							{currentQ.subtitle}
						</p>

						<div className="mx-auto mt-5 max-w-lg rounded-2xl border border-white/10 bg-black/40 p-3 text-xs text-zinc-400">
							<strong className="text-amber-200">Founder Tip:</strong> {currentQ.hint}
						</div>

						{/* Yes / No Choices */}
						<div className="mt-8 flex justify-center gap-4">
							<button
								type="button"
								onClick={() => handleAnswer(true)}
								className="inline-flex min-h-12 min-w-36 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 font-display text-base font-bold text-zinc-950 transition hover:bg-emerald-400 shadow-lg shadow-emerald-950/50">
								<Check className="size-5" /> YES
							</button>
							<button
								type="button"
								onClick={() => handleAnswer(false)}
								className="inline-flex min-h-12 min-w-36 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 font-display text-base font-bold text-white transition hover:bg-rose-500 shadow-lg shadow-rose-950/50">
								<X className="size-5" /> NO
							</button>
						</div>
					</div>
				) : verdict === "database" ? (
					<div className="rounded-3xl border border-sky-400/50 bg-sky-950/30 p-8 text-center shadow-[0_0_60px_rgba(56,189,248,0.1)]">
						<div className="mx-auto grid size-16 place-items-center rounded-2xl bg-sky-500/20 text-sky-300">
							<Database className="size-8" />
						</div>
						<span className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-sky-300">
							Architectural Recommendation
						</span>
						<h2 className="mt-2 font-display text-4xl text-white md:text-5xl">
							USE A NORMAL DATABASE (PostgreSQL / Redis)
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-300">
							A single organization or fully trusted environment does not need consensus overhead, gas fees, or decentralized synchronization. PostgreSQL with SSL, row-level security, and audit logs delivers 10,000x faster throughput with simpler maintenance.
						</p>
						<div className="mt-6">
							<button
								type="button"
								onClick={reset}
								className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-400 px-6 text-sm font-bold text-zinc-950 hover:bg-sky-300">
								<RotateCcw className="size-4" /> Try Another Architecture Scenario
							</button>
						</div>
					</div>
				) : (
					<div className="rounded-3xl border border-emerald-400/60 bg-emerald-950/30 p-8 text-center shadow-[0_0_60px_rgba(52,211,153,0.15)]">
						<div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-300">
							<ShieldCheck className="size-8" />
						</div>
						<span className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-emerald-300">
							Architectural Recommendation
						</span>
						<h2 className="mt-2 font-display text-4xl text-white md:text-5xl">
							BLOCKCHAIN MAY BE APPROPRIATE ✓
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-300">
							All 4 criteria met: Multiple independently governed parties require a shared, tamper-evident state without trusting a single central master database. Deploy as a permissioned enterprise consortium (e.g. Vishvasya / Hyperledger) or public verifiable smart contract.
						</p>
						<div className="mt-6">
							<button
								type="button"
								onClick={reset}
								className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-400 px-6 text-sm font-bold text-zinc-950 hover:bg-emerald-300">
								<RotateCcw className="size-4" /> Re-test Architecture Rules
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
