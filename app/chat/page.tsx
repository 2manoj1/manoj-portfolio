import type { Metadata } from "next";
import { AstraChatApp } from "@/components/chat/manoj-agent-chat";

export const metadata: Metadata = {
	title: "Astra | Production AI Systems Copilot",
	description:
		"Full-screen AI assistant for exploring Manoj Mukherjee's AI systems architecture work, services, and advisory fit.",
	robots: {
		index: false,
		follow: false,
	},
};

export default function ChatPage() {
	return <AstraChatApp />;
}
