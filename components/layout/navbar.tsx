// components/layout/navbar.tsx
import { Button } from "@/components/ui/button";

export default function Navbar() {
	return (
		<header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
			<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
				<span className="font-semibold tracking-tight">Manoj</span>

				<div className="flex items-center gap-4">
					<a href="#mcp" className="text-sm text-zinc-400 hover:text-white">
						MCP
					</a>
					<a href="#impact" className="text-sm text-zinc-400 hover:text-white">
						Impact
					</a>

					<Button variant="secondary" className="rounded-xl">
						Contact
					</Button>
				</div>
			</div>
		</header>
	);
}
