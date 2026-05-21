import type { Metadata, Viewport } from "next";
import { Inter, Mona_Sans } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/content/site";
import { personSchema, professionalServiceSchema } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const monaSans = Mona_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-mona",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.title,
		template: "%s | Manoj Mukherjee",
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	category: "technology",
	classification: "AI, Software Engineering, AI Infrastructure",
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
	authors: [{ name: siteConfig.name }],
	creator: siteConfig.name,
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
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
				className={`${inter.className} ${monaSans.className} flex min-h-full flex-col isolate`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange>
					<Navbar />
					<main className="flex flex-1 flex-col">{children}</main>
					<Footer />
				</ThemeProvider>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify([
							personSchema(),
							professionalServiceSchema(),
						]),
					}}
				/>
			</body>
		</html>
	);
}
