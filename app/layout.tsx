import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, Mona_Sans } from "next/font/google";
import "./globals.css";

// ✅ Optimized font (replaces external links)
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

const monaSans = Mona_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-mona",
});

// ✅ Viewport (Next.js 16+ way)
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#0a0a0a",
};

// ✅ Metadata (SEO + Social + PWA)
export const metadata: Metadata = {
	title: "Manoj Mukherjee · AI Systems Architect & Technology Leader",

	description:
		"AI Systems Architect specializing in GenAI, RAG pipelines, and multi-agent systems. 10+ years building scalable enterprise AI platforms. Open to AI Architect, Lead AI Engineer, and CTO roles.",

	metadataBase: new URL("https://www.manojmukherjee.co.in"),

	applicationName: "Manoj Mukherjee",
	category: "technology",
	classification: "AI, Software Engineering",
	referrer: "origin-when-cross-origin",

	keywords: [
		"Manoj Mukherjee",
		"AI Systems Architect",
		"AI Architect India",
		"GenAI Engineer",
		"RAG systems",
		"LangChain",
		"Langgraph",
		"MCPApps",
		"Model Context Protocol",
		"Multi-agent systems",
		"AI leadership",
		"LLM Engineer",
		"Github/2manoj1",
		"manojmukherjee777@gmail.com",
		"Manoj Mukherjee LinkedIn",
		"Manoj Mukherjee GitHub",
		"Manoj Mukherjee Medium",
		"Manoj Mukherjee Google Scholar",
		"AI Architect Bangalore",
		"Manoj Mukherjee AI Consultant",
		"Manoj Mukherjee AI Speaker",
		"Manoj Mukherjee Publicis Sapient",
		"Manoj Mukherjee GenAI",
	],

	authors: [{ name: "Manoj Mukherjee" }],
	creator: "Manoj Mukherjee",

	alternates: {
		canonical: "https://www.manojmukherjee.co.in",
	},

	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

	openGraph: {
		title: "Manoj Mukherjee · AI Systems Architect",
		description:
			"AI Systems Architect designing agentic platforms, RAG systems, and multi-agent orchestration.",
		type: "website",
		url: "https://www.manojmukherjee.co.in",
		siteName: "Manoj Mukherjee",
		locale: "en_IN",
		images: [
			{
				url: "/opengraph.webp",
				width: 1200,
				height: 600,
				alt: "Manoj Mukherjee · AI Systems Architect",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		images: ["/opengraph.webp"],
	},

	manifest: "/site.webmanifest",

	icons: {
		icon: [
			{ url: "/favicon.ico" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
		other: [
			{
				rel: "icon",
				url: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning className="h-full antialiased">
			<body
				className={`${inter.className} ${monaSans.variable} min-h-full flex flex-col isolate`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange>
					{children}
				</ThemeProvider>
				{/* ✅ Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Person",
							name: "Manoj Mukherjee",
							url: "https://www.manojmukherjee.co.in",
							jobTitle: "AI Systems Architect",
							description:
								"AI Systems Architect specializing in GenAI, RAG, and multi-agent systems",
							image: "https://www.manojmukherjee.co.in/opengraph.webp",
							address: {
								"@type": "Place",
								addressLocality: "Bangalore",
								addressCountry: "India",
							},
							worksFor: {
								"@type": "Organization",
								name: "Publicis Sapient",
							},
							sameAs: [
								"https://www.linkedin.com/in/manoj-mukherjee",
								"https://github.com/2manoj1",
							],
							knowsAbout: [
								"Artificial Intelligence",
								"GenAI",
								"RAG Systems",
								"Multi-Agent Systems",
								"LangChain",
								"LLM Engineering",
							],
						}),
					}}
				/>
			</body>
		</html>
	);
}
