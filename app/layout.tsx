import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Manoj Mukherjee | AI Systems Architect",
	description:
		"AI Architect and systems designer building MCP, RAG, and agentic platforms that unify enterprise intelligence.",
	openGraph: {
		title: "Manoj Mukherjee | AI Systems Architect",
		description:
			"AI Architect and systems designer building MCP, RAG, and agentic platforms that unify enterprise intelligence.",
		type: "website",
		url: "https://www.manojmukherjee.co.in",
		images: [
			{
				url: "https://www.manojmukherjee.co.in/og-image.png",
				width: 1200,
				height: 630,
				alt: "Manoj Mukherjee | AI Systems Architect",
			},
		],
	},
	metadataBase: new URL("https://www.manojmukherjee.co.in"),
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} dark`}>
			<body className="min-h-screen bg-background text-foreground font-sans antialiased">
				<div className="fixed inset-0 -z-10">
					<div className="absolute left-1/2 top-[20%] h-[780px] w-[780px] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-[180px]" />
					<div className="absolute right-0 top-1/3 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[140px]" />
				</div>
				{children}
			</body>
		</html>
	);
}
