// components/three/mcp-insane.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Node({ position, scroll }: any) {
	const ref = useRef<any>(null);

	useFrame(({ clock }) => {
		const progress = scroll.get();
		const s = 1 + Math.sin(clock.elapsedTime * 2) * (0.2 + progress);
		ref.current.scale.set(s, s, s);
	});

	return (
		<mesh ref={ref} position={position}>
			<sphereGeometry args={[0.2, 32, 32]} />
			<meshStandardMaterial emissive="#6366F1" color="#6366F1" />
		</mesh>
	);
}

export default function MCPInsane({ scroll }: any) {
	return (
		<Canvas camera={{ position: [0, 0, 6] }}>
			<ambientLight intensity={0.5} />

			<Node position={[-2, 0, 0]} scroll={scroll} />
			<Node position={[2, 0, 0]} scroll={scroll} />
			<Node position={[0, -1.5, 0]} scroll={scroll} />
		</Canvas>
	);
}
