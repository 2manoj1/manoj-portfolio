"use client";

import { usePathname } from "next/navigation";
import { ManojAgentChat } from "@/components/chat/manoj-agent-chat";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";

export function SiteChrome({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isChatApp = pathname === "/chat";

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange>
			{!isChatApp && <Navbar />}
			<main className="flex flex-1 flex-col">{children}</main>
			{!isChatApp && <Footer />}
			{!isChatApp && <ManojAgentChat />}
		</ThemeProvider>
	);
}
