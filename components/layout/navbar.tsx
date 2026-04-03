// components/layout/navbar.tsx
import { Button } from "@/components/ui/button";

export default function Navbar() {
	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
				<a
					href="#hero"
					className="inline-flex items-center gap-3 text-sm font-semibold text-white transition hover:text-cyan-300"
					aria-label="Go to top">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
						M
					</span>
					<span>Manoj Mukherjee</span>
				</a>

				<nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
					<a href="#mcp" className="transition hover:text-white">
						MCP
					</a>
					<a href="#impact" className="transition hover:text-white">
						Impact
					</a>
					<a href="#about" className="transition hover:text-white">
						About
					</a>
				</nav>

				<Button
					asChild
					variant="secondary"
					size="sm"
					className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
					<a href="mailto:hello@manojmukherjee.co.in" aria-label="Email Manoj">
						Let’s Talk
					</a>
				</Button>
			</div>
		</header>
	);
}
