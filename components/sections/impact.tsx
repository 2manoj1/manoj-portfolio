// components/sections/impact.tsx
import { Card, CardContent } from "@/components/ui/card";

export default function Impact() {
	return (
		<section id="impact" className="py-24 px-6">
			<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
				<Card className="bg-white/5 border-white/10 backdrop-blur-xl">
					<CardContent className="p-6">
						<h3 className="text-2xl text-indigo-400">AI Systems</h3>
						<p className="text-zinc-400 mt-2">
							RAG + Multi-agent architectures
						</p>
					</CardContent>
				</Card>

				<Card className="bg-white/5 border-white/10">
					<CardContent className="p-6">
						<h3 className="text-2xl text-indigo-400">Automation</h3>
						<p className="text-zinc-400 mt-2">GPU infra + pipelines</p>
					</CardContent>
				</Card>

				<Card className="bg-white/5 border-white/10">
					<CardContent className="p-6">
						<h3 className="text-2xl text-indigo-400">Leadership</h3>
						<p className="text-zinc-400 mt-2">Mentoring engineers</p>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
