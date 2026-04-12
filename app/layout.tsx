import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
	title: "Manoj Mukherjee · AI Systems Architect & Technology Leader",
	description:
		"AI Systems Architect specializing in GenAI, RAG pipelines, and multi-agent systems. 10+ years building scalable enterprise AI platforms. Open to AI Architect, Lead AI Engineer, and CTO roles.",

	metadataBase: new URL("https://www.manojmukherjee.co.in"),

	keywords: [
		"Manoj Mukherjee",
		"AI Architect India",
		"AI Systems Architect",
		"GenAI Engineer",
		"RAG systems",
		"LangChain",
		"Langgraph",
		"MCPApps",
		"Model Context Protocol",
		"Multi-agent systems",
		"AI leadership",
		"LLM Engineer",
		"2manoj1",
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
		title: "Manoj Mukherjee · AI Systems Architect & Technology Leader",
		description:
			"AI Systems Architect designing agentic platforms, RAG systems, and multi-agent orchestration.",
		type: "website",
		url: "https://www.manojmukherjee.co.in",
		siteName: "Manoj Mukherjee",
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
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="h-full antialiased">
			<head>
				<link rel="preconnect" href="https://rsms.me" />
				<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Mona+Sans:wght@200..900&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="min-h-full flex flex-col isolate">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
