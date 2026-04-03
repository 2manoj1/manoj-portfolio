import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import MCPStory from "@/components/sections/mcp-story";
import Impact from "@/components/sections/impact";
import About from "@/components/sections/about";
import CTA from "@/components/sections/cta";
import SeoSchema from "@/components/seo-schema";

export default function Home() {
	return (
		<main>
			<SeoSchema />
			<Navbar />
			<Hero />
			<MCPStory />
			<Impact />
			<About />
			<CTA />
		</main>
	);
}
