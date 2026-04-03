import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import Transition from "@/components/sections/transition";
import MCPStory from "@/components/sections/mcp-story";
import Impact from "@/components/sections/impact";
import About from "@/components/sections/about";
import CTA from "@/components/sections/cta";
import SeoSchema from "@/components/seo-schema";
import LenisProvider from "@/components/layout/lenis-provider";

export default function Home() {
	return (
		<LenisProvider>
			<main className="relative overflow-hidden">
				<SeoSchema />
				<Navbar />
				<Hero />
				<Transition />
				<MCPStory />
				<Impact />
				<About />
				<CTA />
			</main>
		</LenisProvider>
	);
}
