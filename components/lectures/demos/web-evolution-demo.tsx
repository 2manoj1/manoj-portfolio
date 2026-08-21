"use client";

import { useState } from "react";
import { Globe, Users, ShieldCheck, Sparkles, Server, KeyRound } from "lucide-react";

const ERAS = [
	{
		id: "web1",
		era: "1990s – early 2000s",
		label: "Web 1.0",
		tagline: "The Static Information Web",
		verb: "READ",
		icon: Globe,
		color: "border-sky-400/50 bg-sky-950/30 text-sky-200",
		glow: "shadow-[0_0_35px_rgba(56,189,248,0.2)]",
		example: "You open an early university page or personal homepage and read what its publisher posted.",
		mechanic: "Client sends HTTP GET → Server returns static HTML file.",
		control: "The site operator controls the server and published content.",
		genZAnalogy: "Like reading a physical newspaper or printed book through a screen.",
		avatarEmoji: "🖥️ 📄",
	},
	{
		id: "web2",
		era: "2000s – today",
		label: "Web 2.0",
		tagline: "The Platform & Social Web",
		verb: "READ + WRITE",
		icon: Users,
		color: "border-violet-400/50 bg-violet-950/30 text-violet-200",
		glow: "shadow-[0_0_35px_rgba(168,85,247,0.2)]",
		example: "You post videos on YouTube, share stories on Instagram, and stream music on Spotify.",
		mechanic: "Users create content while a platform operates the application, policies, and databases.",
		control: "The platform operator controls the account database and access policy; users contribute the content.",
		genZAnalogy: "An account suspension can remove access to an audience built inside that platform.",
		avatarEmoji: "📱 ☁️",
	},
	{
		id: "web3",
		era: "Emerging pattern",
		label: "Web3 Patterns",
		tagline: "User-Held Keys & Verifiable State",
		verb: "READ + WRITE + OWN / PROVE",
		icon: ShieldCheck,
		color: "border-amber-400/60 bg-amber-950/40 text-amber-200",
		glow: "shadow-[0_0_40px_rgba(251,191,36,0.25)]",
		example: "A user can present a portable signed credential or control a self-custodied digital asset across compatible services.",
		mechanic: "Some state is verified through signatures, credentials, or shared ledgers; applications still use servers and databases.",
		control: "Control depends on custody and governance. User-held keys increase agency but make recovery and key loss serious design problems.",
		genZAnalogy: "A credential can travel between compatible apps without every verifier calling one platform database.",
		avatarEmoji: "🤖 🔐",
	},
] as const;

export default function WebEvolutionDemo() {
	const [selectedId, setSelectedId] = useState<(typeof ERAS)[number]["id"]>("web2");
	const selected = ERAS.find((era) => era.id === selectedId) ?? ERAS[1];

	return (
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
			{/* Top Era Navigation Bar */}
			<div className="grid gap-3 sm:grid-cols-3" role="tablist" aria-label="Web evolution">
				{ERAS.map((era) => {
					const Icon = era.icon;
					const isSelected = selectedId === era.id;

					return (
						<button
							key={era.id}
							type="button"
							role="tab"
							aria-selected={isSelected}
							onClick={() => setSelectedId(era.id)}
							className={`relative flex items-center justify-between overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
								isSelected
									? `${era.color} ${era.glow} scale-[1.03] ring-1 ring-white/30`
									: "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white"
							}`}>
							<div>
								<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">{era.era}</span>
								<h3 className="mt-1 font-display text-xl font-bold text-white">{era.label}</h3>
								<p className="font-mono text-xs font-semibold text-amber-300">{era.verb}</p>
							</div>
							<div className="flex flex-col items-center gap-1">
								<span className="text-2xl" aria-hidden="true">{era.avatarEmoji}</span>
								<Icon className="size-4 text-zinc-400" />
							</div>
						</button>
					);
				})}
			</div>

			{/* Active Era Visual Infographic Card */}
			<section className={`mt-5 rounded-3xl border p-6 md:p-8 transition-all duration-300 ${selected.color} ${selected.glow}`} aria-live="polite">
				<div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
					<div className="flex items-center gap-3">
						<span className="text-4xl" aria-hidden="true">{selected.avatarEmoji}</span>
						<div>
							<h2 className="font-display text-2xl font-bold text-white md:text-3xl">{selected.label}: {selected.tagline}</h2>
							<p className="font-mono text-xs font-semibold text-amber-200">Core Paradigm: {selected.verb}</p>
						</div>
					</div>
					<span className="rounded-full border border-white/20 bg-black/60 px-4 py-1 font-mono text-xs text-zinc-300">
						Era: {selected.era}
					</span>
				</div>

				<div className="mt-6 grid gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-white/10 bg-black/40 p-4">
						<div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
							<Globe className="size-3.5 text-sky-300" /> How It Works
						</div>
						<p className="mt-2 text-sm leading-relaxed text-zinc-200">{selected.example}</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-black/40 p-4">
						<div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
							<Server className="size-3.5 text-violet-300" /> Data Ownership & Control
						</div>
						<p className="mt-2 text-sm leading-relaxed text-zinc-200">{selected.control}</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-black/40 p-4">
						<div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-amber-300">
							<Sparkles className="size-3.5" /> Gen Z Everyday Analogy
						</div>
						<p className="mt-2 text-sm leading-relaxed text-amber-100 font-medium">{selected.genZAnalogy}</p>
					</div>
				</div>

				<div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3.5 text-xs text-zinc-300">
					<KeyRound className="size-4 shrink-0 text-amber-300" />
					<p><strong className="text-white">Engineering Insight:</strong> Web3 is an umbrella term, not one standard. Evaluate the actual credential, ledger, custody, privacy, and governance protocols separately.</p>
				</div>
			</section>
		</div>
	);
}
