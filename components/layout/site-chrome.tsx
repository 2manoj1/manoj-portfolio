"use client";

import { usePathname } from "next/navigation";
import { ManojAgentChat } from "@/components/chat/manoj-agent-chat";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AudioPlayerProvider } from "@/context/audio-player-context";
import { GlobalAudioWidget } from "@/components/marketing/global-audio-widget";

export function SiteChrome({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isChatApp = pathname === "/chat";

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange>
			<AudioPlayerProvider>
				{!isChatApp && <Navbar />}
				<main className="flex flex-1 flex-col">{children}</main>
				{!isChatApp && <Footer />}
				{!isChatApp && <ManojAgentChat />}
				{!isChatApp && <GlobalAudioWidget />}
			</AudioPlayerProvider>
		</ThemeProvider>
	);
}
