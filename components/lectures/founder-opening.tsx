import type { HeroScene } from "@/lib/lectures/types";

const LEDGER_NODES = [
	{ cx: 360, cy: 76, label: "01" },
	{ cx: 556, cy: 156, label: "02" },
	{ cx: 642, cy: 352, label: "03" },
	{ cx: 556, cy: 548, label: "04" },
	{ cx: 360, cy: 628, label: "05" },
	{ cx: 164, cy: 548, label: "06" },
	{ cx: 78, cy: 352, label: "07" },
	{ cx: 164, cy: 156, label: "08" },
] as const;

const NETWORK_LINKS = [
	"M360 76 L556 156",
	"M556 156 L642 352",
	"M642 352 L556 548",
	"M556 548 L360 628",
	"M360 628 L164 548",
	"M164 548 L78 352",
	"M78 352 L164 156",
	"M164 156 L360 76",
	"M164 156 L556 548",
	"M556 156 L164 548",
] as const;

const LEDGER_BLOCKS = [
	{ y: 250, index: "01", hash: "9CBF...3ADD", tone: "#fbbf24" },
	{ y: 342, index: "02", hash: "597D...8584", tone: "#22d3ee" },
	{ y: 434, index: "03", hash: "1812...77F7", tone: "#34d399" },
] as const;

export function FounderOpening({ scene }: { scene: HeroScene }) {
	const headlineLines = scene.headlineLines ?? [scene.title];
	const speaker = scene.speaker;

	return (
		<section className="relative isolate flex min-h-full overflow-hidden rounded-3xl border border-white/10 bg-[#050608] shadow-[0_32px_120px_rgba(0,0,0,0.5)]">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_50%,rgba(34,211,238,0.11),transparent_31%),radial-gradient(circle_at_18%_22%,rgba(245,158,11,0.12),transparent_27%)]" />
			<div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(90deg,black,transparent_80%)]" />

			<div className="pointer-events-none absolute left-5 top-5 h-16 w-16 border-l border-t border-amber-300/50" />
			<div className="pointer-events-none absolute bottom-5 right-5 h-16 w-16 border-b border-r border-cyan-300/40" />

			<div className="relative z-10 grid min-h-full w-full items-center gap-4 px-6 py-7 md:px-10 lg:grid-cols-[1.06fr_0.94fr] lg:px-14">
				<div className="flex min-w-0 flex-col justify-center">
					<div className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300 sm:text-xs">
						<span className="size-2 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(252,211,77,0.8)] motion-safe:animate-pulse" />
						{scene.eyebrow}
					</div>

					<h1 className="mt-5 max-w-3xl text-balance font-display text-[clamp(2.4rem,4.3vw,5.2rem)] font-bold leading-[0.9] tracking-[-0.055em] text-white">
						{headlineLines.map((line, index) => (
							<span
								key={line}
								className={`block ${index === headlineLines.length - 1 ? "bg-gradient-to-r from-amber-200 via-amber-300 to-cyan-300 bg-clip-text text-transparent" : ""}`}>
								{line}
							</span>
						))}
					</h1>

					{speaker ? (
						<div className="mt-7 max-w-2xl border-l-2 border-amber-300/80 pl-5">
							<p className="font-display text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
								{speaker.name}
							</p>
							<p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:text-sm">
								{speaker.role}
							</p>
							<p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
								{speaker.summary}
							</p>
						</div>
					) : null}

					{scene.lines?.length ? (
						<div className="mt-6 flex max-w-2xl flex-wrap gap-2">
							{scene.lines.map((line, index) => (
								<span
									key={line}
									className="rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-300 backdrop-blur-sm sm:text-[10px]">
									<span className="mr-2 text-amber-300">0{index + 1}</span>
									{line}
								</span>
							))}
						</div>
					) : null}

					{scene.callout ? (
						<p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 sm:text-xs">
							<span className="text-amber-300">TODAY //</span> {scene.callout}
						</p>
					) : null}
				</div>

				<figure className="relative mx-auto hidden aspect-square w-full max-w-[39rem] items-center justify-center lg:flex" aria-label="Animated blockchain verification network">
					<div className="absolute inset-[9%] rounded-full border border-cyan-300/10 shadow-[inset_0_0_70px_rgba(34,211,238,0.06)]" />
					<svg viewBox="0 0 720 720" className="h-full w-full overflow-visible" role="img" aria-labelledby="founder-network-title founder-network-description">
						<title id="founder-network-title">Blockchain verification network</title>
						<desc id="founder-network-description">Eight participant nodes exchange records around three cryptographically linked blocks.</desc>

						<circle cx="360" cy="352" r="278" fill="none" stroke="rgba(34,211,238,0.15)" strokeWidth="1" strokeDasharray="4 12" />
						<circle cx="360" cy="352" r="224" fill="none" stroke="rgba(251,191,36,0.17)" strokeWidth="1.5" strokeDasharray="28 16 3 16" />

						<g className="origin-center motion-safe:animate-[spin_24s_linear_infinite] motion-reduce:animate-none [transform-box:fill-box]">
							<path d="M360 54 A298 298 0 0 1 641 253" fill="none" stroke="rgba(251,191,36,0.7)" strokeWidth="3" strokeLinecap="round" />
							<path d="M360 650 A298 298 0 0 1 79 451" fill="none" stroke="rgba(34,211,238,0.55)" strokeWidth="3" strokeLinecap="round" />
						</g>

						<g className="origin-center motion-safe:animate-[spin_34s_linear_infinite] motion-reduce:animate-none [animation-direction:reverse] [transform-box:fill-box]">
							<circle cx="360" cy="352" r="250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 30" />
						</g>

						<g stroke="rgba(34,211,238,0.2)" strokeWidth="1.5">
							{NETWORK_LINKS.map((path) => <path key={path} d={path} />)}
						</g>

						<g>
							{LEDGER_NODES.map((node, index) => (
								<g key={node.label}>
									<circle cx={node.cx} cy={node.cy} r="22" fill="#080b0d" stroke={index % 2 === 0 ? "#fbbf24" : "#22d3ee"} strokeWidth="1.5" />
									<circle cx={node.cx} cy={node.cy} r="6" fill={index % 2 === 0 ? "#fbbf24" : "#22d3ee"} className="motion-safe:animate-pulse motion-reduce:animate-none" />
									<text x={node.cx} y={node.cy + 41} textAnchor="middle" fill="rgba(212,212,216,0.72)" fontSize="12" fontFamily="monospace">NODE {node.label}</text>
								</g>
							))}
						</g>

						<g>
							<path d="M360 164 L514 253 L514 451 L360 540 L206 451 L206 253 Z" fill="rgba(5,8,10,0.92)" stroke="rgba(251,191,36,0.55)" strokeWidth="2" />
							<path d="M360 190 L490 265 L490 439 L360 514 L230 439 L230 265 Z" fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="1" strokeDasharray="5 9" />

							{LEDGER_BLOCKS.map((block, index) => (
								<g key={block.index}>
									<rect x="274" y={block.y} width="172" height="62" rx="12" fill="rgba(9,12,15,0.96)" stroke={block.tone} strokeWidth="1.5" />
									<text x="293" y={block.y + 25} fill="white" fontSize="14" fontWeight="700" fontFamily="monospace">BLOCK {block.index}</text>
									<text x="293" y={block.y + 46} fill={block.tone} fontSize="11" fontFamily="monospace">{block.hash}</text>
									{index < 2 ? <path d={`M360 ${block.y + 62} L360 ${block.y + 92}`} stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeDasharray="4 4" /> : null}
								</g>
							))}
						</g>
					</svg>

					<div className="absolute left-[7%] top-[16%] rounded-lg border border-white/10 bg-black/65 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-400 backdrop-blur-md">
						<span className="text-cyan-300">SIGNATURE</span> · VALID
					</div>
					<div className="absolute bottom-[16%] right-[5%] rounded-lg border border-white/10 bg-black/65 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-400 backdrop-blur-md">
						<span className="text-emerald-300">CONSENSUS</span> · AGREED
					</div>
					<figcaption className="absolute bottom-[5%] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
						Concept model · distributed verification
					</figcaption>
				</figure>
			</div>
		</section>
	);
}
