// components/sections/hero.tsx
import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section id="hero" className="pt-24 min-h-screen flex items-center px-6">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-6xl md:text-7xl font-semibold tracking-tight">
					<span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
						Manoj Mukherjee
					</span>
				</h1>

				<p className="mt-6 text-xl text-indigo-400">
					AI Architect · MCPApps · Multi-Agent Systems
				</p>

				<p className="mt-6 text-zinc-400 max-w-2xl leading-relaxed">
					I design and build AI-native systems that transform enterprises into
					intelligent platforms.
				</p>

				<div className="mt-10 flex gap-4">
					<Button size="lg" className="rounded-xl">
						View Work
					</Button>

					<Button variant="outline" size="lg" className="rounded-xl">
						Contact Me
					</Button>
				</div>
			</div>
		</section>
	);
}
