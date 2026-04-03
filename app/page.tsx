"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { Github, Linkedin, FileText } from "lucide-react";

function ThreeScene() {
	return (
		<Canvas className="h-[400px]">
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<mesh rotation={[1, 1, 0]}>
				<sphereGeometry args={[1, 32, 32]} />
				<meshStandardMaterial color="purple" />
			</mesh>
			<OrbitControls />
		</Canvas>
	);
}

export default function Home() {
	const [chatOpen, setChatOpen] = useState(false);
	const [messages, setMessages] = useState([
		{ role: "ai", text: "Hi, I am Manoj AI." },
	]);
	const [input, setInput] = useState("");

	const sendMessage = () => {
		if (!input) return;
		setMessages([
			...messages,
			{ role: "user", text: input },
			{ role: "ai", text: "Response based on MCP + RAG systems." },
		]);
		setInput("");
	};

	return (
		<main>
			{/* HERO */}
			<section className="h-screen flex flex-col justify-center items-center text-center">
				<motion.h1
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-7xl font-bold">
					Manoj Mukherjee
				</motion.h1>

				<p className="mt-6 text-gray-400 max-w-xl">
					AI Systems Architect • MCP • Agentic AI • RAG
				</p>

				<button
					onClick={() => setChatOpen(true)}
					className="mt-8 px-6 py-3 border rounded-xl">
					Ask AI
				</button>
			</section>

			{/* THREE.JS VISUAL */}
			<section className="py-20 text-center">
				<h2 className="text-4xl mb-10">System Visualization</h2>
				<ThreeScene />
			</section>

			{/* PROJECT */}
			<section className="py-20 text-center">
				<h2 className="text-4xl">MCP Retail Platform</h2>
				<p className="text-gray-400 mt-4 max-w-xl mx-auto">
					Unified CMS + GraphQL + AI platform powering MCP apps.
				</p>
			</section>

			{/* IMPACT */}
			<section className="py-20 text-center">
				<div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
					<div>70+ Repos</div>
					<div>10+ Years</div>
					<div>AI Systems</div>
				</div>
			</section>

			{/* CHAT */}
			{chatOpen && (
				<div className="fixed bottom-4 right-4 bg-gray-900 p-4 w-80 rounded">
					<button onClick={() => setChatOpen(false)}>Close</button>
					<div className="h-40 overflow-y-auto">
						{messages.map((m, i) => (
							<p key={i}>{m.text}</p>
						))}
					</div>
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="w-full bg-black border mt-2"
					/>
					<button onClick={sendMessage}>Send</button>
				</div>
			)}

			{/* FOOTER */}
			<footer className="py-10 text-center">
				<div className="flex justify-center gap-6">
					<Github />
					<Linkedin />
					<FileText />
				</div>
			</footer>
		</main>
	);
}
