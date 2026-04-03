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
	description: "AI Architect specializing in MCP, Agentic AI, and RAG systems.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}>
			<body className="min-h-screen bg-background text-foreground font-sans antialiased">
				{/* Global Glow */}
				<div className="fixed inset-0 -z-10">
					<div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-600/30 blur-[180px] rounded-full" />
					<div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/20 blur-[160px] rounded-full" />
				</div>

				{children}
			</body>
		</html>
	);
}
