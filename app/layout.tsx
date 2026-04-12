import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
	title: "Manoj Mukherjee · AI Systems Architect & Technology Leader",
	description:
		"AI Systems Architect designing agentic platforms, RAG systems, and multi-agent orchestration. ~10 years building enterprise intelligence platforms. Available for CTO and leadership roles.",

	metadataBase: new URL("https://www.manojmukherjee.co.in"),

	openGraph: {
		title: "Manoj Mukherjee · AI Systems Architect & Technology Leader",
		description:
			"AI Systems Architect designing agentic platforms, RAG systems, and multi-agent orchestration.",
		type: "website",
		url: "https://www.manojmukherjee.co.in",
		images: [
			{
				url: "/opengraph.webp",
				width: 1200,
				height: 600,
				alt: "Manoj Mukherjee · AI Systems Architect & Technology Leader",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		images: ["/opengraph.webp"],
	},

	icons: {
		icon: [
			{ url: "/favicon.ico" }, // fallback
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
