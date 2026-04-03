// components/sections/cta.tsx

import { Button } from "@/components/ui/button";

export default function CTA() {
	return (
		<section className="py-32 px-6">
			<div className="max-w-4xl mx-auto text-center">
				<h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
					Let’s build intelligent systems together
				</h2>

				<p className="mt-6 text-zinc-400 max-w-xl mx-auto">
					Whether it's AI systems, MCPApps, or scalable architecture — I’m open
					to meaningful collaborations and opportunities.
				</p>

				<div className="mt-10 flex justify-center gap-4 flex-wrap">
					<Button size="lg" className="rounded-xl">
						Connect on LinkedIn
					</Button>

					<Button variant="outline" size="lg" className="rounded-xl">
						Email Me
					</Button>
				</div>
			</div>
		</section>
	);
}
