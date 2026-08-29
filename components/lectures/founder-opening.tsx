import type { HeroScene } from "@/lib/lectures/types";

const PARTICIPANT_NODES = [
	{ cx: 94, cy: 350 },
	{ cx: 164, cy: 152 },
	{ cx: 380, cy: 76 },
	{ cx: 596, cy: 152 },
	{ cx: 666, cy: 350 },
	{ cx: 596, cy: 548 },
	{ cx: 380, cy: 624 },
	{ cx: 164, cy: 548 },
] as const;

const NETWORK_LINKS = [
	"M94 350 L164 152 L380 76 L596 152 L666 350 L596 548 L380 624 L164 548 Z",
	"M164 152 L596 548",
	"M596 152 L164 548",
] as const;

const LEDGER_BLOCKS = [
	{ x: 148, y: 242, index: "01", hash: "9CBF…3ADD", tone: "#a1a1aa" },
	{ x: 324, y: 294, index: "02", hash: "597D…8584", tone: "#fbbf24" },
	{ x: 500, y: 346, index: "03", hash: "1812…77F7", tone: "#67e8f9" },
] as const;

function BlockchainCore() {
	return (
		<figure
			className="pointer-events-none absolute -right-[5%] top-1/2 hidden aspect-square w-[57%] max-w-[52rem] -translate-y-1/2 lg:block"
			aria-label="Animated blockchain network">
			<div className="absolute inset-[16%] rounded-full bg-cyan-300/[0.055] blur-3xl" />

			<svg
				viewBox="0 0 760 700"
				className="relative h-full w-full overflow-visible"
				role="img"
				aria-labelledby="founder-chain-title founder-chain-description">
				<title id="founder-chain-title">A cryptographically linked blockchain</title>
				<desc id="founder-chain-description">
					Three blocks form a verified chain inside a distributed network of participants.
				</desc>

				<defs>
					<radialGradient id="founder-core-glow">
						<stop offset="0" stopColor="#22d3ee" stopOpacity="0.12" />
						<stop offset="0.58" stopColor="#fbbf24" stopOpacity="0.035" />
						<stop offset="1" stopColor="#050506" stopOpacity="0" />
					</radialGradient>
					<linearGradient id="founder-chain-line" x1="0" y1="0" x2="1" y2="1">
						<stop stopColor="#fbbf24" />
						<stop offset="1" stopColor="#67e8f9" />
					</linearGradient>
					<filter id="founder-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
						<feGaussianBlur stdDeviation="5" result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				<circle cx="380" cy="350" r="318" fill="url(#founder-core-glow)" />
				<circle cx="380" cy="350" r="286" fill="none" stroke="rgba(255,255,255,0.08)" />
				<circle cx="380" cy="350" r="244" fill="none" stroke="rgba(103,232,249,0.1)" strokeDasharray="2 12" />

				<g className="origin-center motion-safe:animate-[spin_28s_linear_infinite] motion-reduce:animate-none [transform-box:fill-box]">
					<path d="M380 64 A286 286 0 0 1 647 248" fill="none" stroke="#fbbf24" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
					<path d="M380 636 A286 286 0 0 1 113 452" fill="none" stroke="#67e8f9" strokeOpacity="0.56" strokeWidth="3" strokeLinecap="round" />
				</g>

				<g className="origin-center motion-safe:animate-[spin_42s_linear_infinite] motion-reduce:animate-none [animation-direction:reverse] [transform-box:fill-box]">
					<circle cx="380" cy="350" r="264" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="1 23" strokeWidth="2" />
				</g>

				<g fill="none" stroke="rgba(103,232,249,0.11)" strokeWidth="1">
					{NETWORK_LINKS.map((path) => (
						<path key={path} d={path} />
					))}
				</g>

				<g>
					{PARTICIPANT_NODES.map((node, index) => (
						<g key={`${node.cx}-${node.cy}`}>
							<circle cx={node.cx} cy={node.cy} r="12" fill="#07080a" stroke={index % 2 === 0 ? "#fbbf24" : "#67e8f9"} strokeOpacity="0.8" />
							<circle
								cx={node.cx}
								cy={node.cy}
								r="3"
								fill={index % 2 === 0 ? "#fbbf24" : "#67e8f9"}
								className="motion-safe:animate-pulse motion-reduce:animate-none"
								style={{ animationDelay: `${index * 180}ms` }}
							/>
						</g>
					))}
				</g>

				<path d="M258 306 C286 306 300 326 324 330" fill="none" stroke="url(#founder-chain-line)" strokeWidth="4" strokeLinecap="round" filter="url(#founder-soft-glow)" />
				<path d="M434 358 C462 358 476 378 500 382" fill="none" stroke="url(#founder-chain-line)" strokeWidth="4" strokeLinecap="round" filter="url(#founder-soft-glow)" />

				<circle r="5" fill="#fef3c7" filter="url(#founder-soft-glow)" className="hidden motion-safe:block">
					<animateMotion dur="3.2s" repeatCount="indefinite" path="M258 306 C286 306 300 326 324 330" />
				</circle>
				<circle r="5" fill="#cffafe" filter="url(#founder-soft-glow)" className="hidden motion-safe:block">
					<animateMotion dur="3.2s" begin="1.6s" repeatCount="indefinite" path="M434 358 C462 358 476 378 500 382" />
				</circle>

				{LEDGER_BLOCKS.map((block, index) => (
					<g key={block.index} transform={`translate(${block.x} ${block.y})`}>
						<path d="M0 28 L55 0 L110 28 L55 56 Z" fill="rgba(255,255,255,0.045)" stroke={block.tone} strokeOpacity={index === 1 ? 0.95 : 0.58} strokeWidth={index === 1 ? 2 : 1.25} />
						<path d="M0 28 L55 56 L55 116 L0 88 Z" fill="rgba(255,255,255,0.02)" stroke={block.tone} strokeOpacity="0.5" strokeWidth="1.25" />
						<path d="M110 28 L55 56 L55 116 L110 88 Z" fill={index === 1 ? "rgba(251,191,36,0.1)" : "rgba(103,232,249,0.035)"} stroke={block.tone} strokeOpacity="0.68" strokeWidth="1.25" />
						<text x="55" y="79" textAnchor="middle" fill="white" fontSize="21" fontWeight="700" fontFamily="monospace">{block.index}</text>
						<text x="55" y="100" textAnchor="middle" fill={block.tone} fillOpacity="0.9" fontSize="8" letterSpacing="1" fontFamily="monospace">{block.hash}</text>
					</g>
				))}
			</svg>

			<figcaption className="sr-only">Linked history, shared verification.</figcaption>
		</figure>
	);
}

export function FounderOpening({ scene }: { scene: HeroScene }) {
	const headlineLines = scene.headlineLines ?? [scene.title];
	const speaker = scene.speaker;

	return (
		<section className="relative isolate flex min-h-full overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#050506] shadow-[0_28px_100px_rgba(0,0,0,0.45)]">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,rgba(34,211,238,0.08),transparent_34%),radial-gradient(circle_at_10%_0%,rgba(245,158,11,0.09),transparent_27%)]" />
			<div className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-[#050506] via-[#050506]/95 to-transparent" />
			<div className="pointer-events-none absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-amber-300/70 to-transparent" />

			<BlockchainCore />

			<div className="relative z-10 flex min-h-full w-full items-center px-7 py-10 sm:px-10 lg:px-[clamp(3.5rem,5vw,6rem)]">
				<div className="w-full max-w-4xl lg:max-w-[58%]">
					<div className="flex items-center gap-4 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-200/90 sm:text-xs">
						<span className="h-px w-10 bg-amber-300" />
						{scene.eyebrow}
					</div>

					<h1 className="mt-7 text-balance font-display text-[clamp(2.6rem,3.8vw,4.75rem)] font-semibold leading-[0.96] tracking-[-0.052em] text-zinc-50">
						{headlineLines.map((line, index) => (
							<span
								key={line}
								className={`block lg:whitespace-nowrap ${index === headlineLines.length - 1 ? "mt-1 text-amber-200" : index === 1 ? "text-zinc-300" : ""}`}>
								{line}
							</span>
						))}
					</h1>

					{speaker ? (
						<div className="mt-9 flex max-w-2xl items-start gap-4 border-t border-white/10 pt-5 sm:gap-5">
							<div className="mt-1 h-11 w-1 shrink-0 rounded-full bg-gradient-to-b from-amber-300 to-cyan-300" />
							<div>
								<p className="font-display text-xl font-semibold tracking-[-0.025em] text-white sm:text-2xl">{speaker.name}</p>
								<p className="mt-1 text-sm font-medium tracking-wide text-cyan-200 sm:text-base">{speaker.role}</p>
								<p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-[15px]">{speaker.summary}</p>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
