// components/layout/navbar.tsx
import { Button } from "@/components/ui/button";

export default function Navbar() {
	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-2xl">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
				<a
					href="#hero"
					className="inline-flex items-center gap-4 text-sm font-semibold text-white transition-all duration-300 hover:text-cyan-300 hover:scale-105"
					aria-label="Go to top">
					<div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/20">
						<span className="text-lg font-bold">M</span>
					</div>
					<div className="flex flex-col">
						<span className="text-white">Manoj Mukherjee</span>
						<span className="text-xs text-cyan-400/80 font-normal">
							AI Systems Architect
						</span>
					</div>
				</a>

				<nav className="hidden items-center gap-10 text-sm text-zinc-400 md:flex">
					<a
						href="#mcp"
						className="transition-all duration-300 hover:text-cyan-300 hover:scale-105">
						The MCP
					</a>
					<a
						href="#impact"
						className="transition-all duration-300 hover:text-cyan-300 hover:scale-105">
						Impact
					</a>
					<a
						href="#about"
						className="transition-all duration-300 hover:text-cyan-300 hover:scale-105">
						About
					</a>
				</nav>

				<Button
					asChild
					variant="secondary"
					size="sm"
					className="rounded-2xl border border-white/10 bg-white/5 text-white shadow-lg hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300">
					<a href="mailto:hello@manojmukherjee.co.in" aria-label="Email Manoj">
						Let’s Connect
					</a>
				</Button>
			</div>
		</header>
	);
}
