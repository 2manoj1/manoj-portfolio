"use client";

import { useState } from "react";
import { Check, X, RotateCcw, Database, ShieldCheck } from "lucide-react";

type QuestionStep = {
	id: number;
	title: string;
	subtitle: string;
	avatar: string;
	hint: string;
};

const QUESTIONS: QuestionStep[] = [
	{
		id: 1,
		title: "Are there multiple independent organizations involved?",
		subtitle: "e.g., Banks, hospitals, government agencies, logistics vendors with separate legal governance.",
		avatar: "🏢 🏛️",
		hint: "If only ONE company owns the data, internal access controls and PostgreSQL are 10,000x faster and cheaper.",
	},
	{
		id: 2,
		title: "Do these parties need to write to and read from a shared record?",
		subtitle: "e.g., Shared custody of medicine batches, cross-border payment settlement, or academic credentials.",
		avatar: "🔄 ✍️",
		hint: "If parties only read static reports, standard REST APIs with digital signatures are completely sufficient.",
	},
	{
		id: 3,
		title: "Is there limited mutual trust between the participants?",
		subtitle: "No single party can be trusted to run the master database without potential conflict of interest.",
		avatar: "🤝 ⚖️",
		hint: "If all parties 100% trust a single neutral central authority (e.g. AWS or a single bank), a centralized DB wins.",
	},
	{
		id: 4,
		title: "Is tamper-evident auditability or provenance strictly required?",
		subtitle: "Past records must never be secretly altered or deleted by any administrator without detection.",
		avatar: "🔒 🛡️",
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
			setVerdict("database");
		} else if (currentStepIndex === QUESTIONS.length - 1) {
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
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
			{/* Top Bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/50 p-4 backdrop-blur-md">
				<div>
					<span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
						Lead Architect Diagnostic Simulator
					</span>
					<h3 className="font-display text-lg font-bold text-white">
						Should Your Application Use a Blockchain or a Database?
					</h3>
				</div>
				<button
					type="button"
					onClick={reset}
					className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-3.5 text-xs text-zinc-300 transition hover:border-white/30 hover:text-white">
					<RotateCcw className="size-3.5" /> Restart Diagnostic
				</button>
			</div>

			{/* 4 Diagnostic Steps Grid */}
			<div className="mt-4 grid grid-cols-4 gap-3">
				{QUESTIONS.map((q, idx) => {
					const isAnswered = idx < answers.length;
					const answerValue = answers[idx];
					const isCurrent = idx === currentStepIndex && verdict === null;

					return (
						<div
							key={q.id}
							className={`rounded-2xl border p-3.5 text-center transition-all duration-300 ${
								isCurrent
									? "border-amber-400 bg-amber-400/15 shadow-[0_0_25px_rgba(251,191,36,0.2)] scale-[1.02]"
									: isAnswered
										? answerValue
											? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
											: "border-rose-400/50 bg-rose-400/10 text-rose-200"
										: "border-white/10 bg-white/[0.02] text-zinc-600"
							}`}>
							<div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-400">
								<span>Check 0{q.id}</span>
								<span>{q.avatar}</span>
							</div>
							<p className="mt-1.5 truncate font-sans text-xs font-bold">
								{isAnswered ? (answerValue ? "YES ✓" : "NO ✗") : `Criteria #${q.id}`}
							</p>
						</div>
					);
				})}
			</div>

			{/* Main Interactive Stage with Full Space */}
			<div className="mt-4">
				{verdict === null ? (
					<div className="rounded-3xl border border-amber-300/40 bg-amber-300/[0.04] p-8 text-center shadow-[0_0_70px_rgba(251,191,36,0.08)] backdrop-blur-md md:p-10">
						<div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-400/20 text-3xl shadow-lg">
							{currentQ.avatar}
						</div>
						<span className="mt-4 inline-block rounded-full bg-amber-400/20 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
							Evaluation Question {currentStepIndex + 1} of {QUESTIONS.length}
						</span>
						<h2 className="mx-auto mt-4 max-w-3xl font-display text-2xl font-bold text-white md:text-4xl leading-snug">
							{currentQ.title}
						</h2>
						<p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
							{currentQ.subtitle}
						</p>

						<div className="mx-auto mt-6 max-w-xl rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-zinc-300 shadow-md">
							<strong className="text-amber-300 font-bold">💡 Chief Architect Insight:</strong> {currentQ.hint}
						</div>

						{/* Yes / No Choices with High Contrast */}
						<div className="mt-8 flex justify-center gap-5">
							<button
								type="button"
								onClick={() => handleAnswer(true)}
								className="inline-flex min-h-13 min-w-40 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 font-display text-lg font-bold text-zinc-950 transition hover:bg-emerald-400 hover:scale-105 shadow-xl shadow-emerald-950/60 cursor-pointer">
								<Check className="size-6 stroke-[3]" /> YES
							</button>
							<button
								type="button"
								onClick={() => handleAnswer(false)}
								className="inline-flex min-h-13 min-w-40 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-8 font-display text-lg font-bold text-white transition hover:bg-rose-500 hover:scale-105 shadow-xl shadow-rose-950/60 cursor-pointer">
								<X className="size-6 stroke-[3]" /> NO
							</button>
						</div>
					</div>
				) : verdict === "database" ? (
					<div className="rounded-3xl border border-sky-400/60 bg-sky-950/40 p-8 text-center shadow-[0_0_80px_rgba(56,189,248,0.15)] backdrop-blur-md md:p-10">
						<div className="mx-auto grid size-20 place-items-center rounded-3xl bg-sky-500/20 text-sky-300 shadow-xl">
							<Database className="size-10" />
						</div>
						<span className="mt-5 inline-block font-mono text-xs font-bold uppercase tracking-widest text-sky-300">
							Architectural Decision Verdict
						</span>
						<h2 className="mt-2 font-display text-3xl font-extrabold text-white md:text-5xl">
							USE A NORMAL DATABASE (PostgreSQL / Redis)
						</h2>
						<p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-zinc-200">
							A single organization or fully trusted environment does not require consensus overhead, gas fees, or decentralized synchronization. PostgreSQL with SSL, row-level security, and audit logs delivers 10,000x faster throughput with simpler operational maintenance.
						</p>
						<div className="mt-8">
							<button
								type="button"
								onClick={reset}
								className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-sky-400 px-8 font-display text-sm font-bold text-zinc-950 hover:bg-sky-300 shadow-lg shadow-sky-950/50">
								<RotateCcw className="size-4" /> Try Another Architecture Scenario
							</button>
						</div>
					</div>
				) : (
					<div className="rounded-3xl border border-emerald-400/70 bg-emerald-950/40 p-8 text-center shadow-[0_0_80px_rgba(52,211,153,0.2)] backdrop-blur-md md:p-10">
						<div className="mx-auto grid size-20 place-items-center rounded-3xl bg-emerald-500/20 text-emerald-300 shadow-xl">
							<ShieldCheck className="size-10" />
						</div>
						<span className="mt-5 inline-block font-mono text-xs font-bold uppercase tracking-widest text-emerald-300">
							Architectural Decision Verdict
						</span>
						<h2 className="mt-2 font-display text-3xl font-extrabold text-white md:text-5xl">
							BLOCKCHAIN MAY BE APPROPRIATE ✓
						</h2>
						<p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-zinc-200">
							All 4 criteria met: Multiple independently governed parties require a shared, tamper-evident state without trusting a single central master database. Deploy as a permissioned enterprise consortium (e.g. Vishvasya / Hyperledger) or public verifiable smart contract.
						</p>
						<div className="mt-8">
							<button
								type="button"
								onClick={reset}
								className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-emerald-400 px-8 font-display text-sm font-bold text-zinc-950 hover:bg-emerald-300 shadow-lg shadow-emerald-950/50">
								<RotateCcw className="size-4" /> Re-test Architecture Rules
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
