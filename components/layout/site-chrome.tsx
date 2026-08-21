"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ManojAgentChat } from "@/components/chat/manoj-agent-chat";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AudioPlayerProvider } from "@/context/audio-player-context";
import { GlobalAudioWidget } from "@/components/marketing/global-audio-widget";
import { isImmersiveLecturePath } from "@/lib/lectures/route-mode";

export function SiteChrome({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isChatApp = pathname === "/chat";
	const isImmersiveLecture = isImmersiveLecturePath(pathname);
	const hideSiteChrome = isChatApp || isImmersiveLecture;

	useEffect(() => {
		if (!isImmersiveLecture) return;
		window.speechSynthesis?.cancel();
	}, [isImmersiveLecture]);

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange>
			<AudioPlayerProvider>
				{!hideSiteChrome && <Navbar />}
				<main
					className={
						isImmersiveLecture
							? "flex h-dvh flex-1 flex-col overflow-hidden"
							: "flex flex-1 flex-col"
					}>
					{children}
				</main>
				{!hideSiteChrome && <Footer />}
				{!hideSiteChrome && <ManojAgentChat />}
				{!hideSiteChrome && <GlobalAudioWidget />}
			</AudioPlayerProvider>
		</ThemeProvider>
	);
}
