// components/three/mcp-insane.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, PerspectiveCamera } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type NodeDefinition = {
	id: string;
	position: [number, number, number];
	color: string;
};

type ConnectionDefinition = {
	start: number;
	end: number;
	revealAt: number;
};

type RouteDefinition = {
	from: number;
	to: number;
};

type ParticleConfig = {
	path: RouteDefinition;
	offset: number;
	speed: number;
	color: string;
};

const nodeDefinitions: NodeDefinition[] = [
	{ id: "api", position: [-2.2, 1.2, 0], color: "#38bdf8" },
	{ id: "db", position: [2.2, 1.2, 0], color: "#818cf8" },
	{ id: "agent", position: [-1.2, -1.3, 0], color: "#a855f7" },
	{ id: "rag", position: [1.4, -1.15, 0], color: "#22d3ee" },
];

const connectionDefinitions: ConnectionDefinition[] = [
	{ start: 0, end: 1, revealAt: 0.0 },
	{ start: 0, end: 2, revealAt: 0.25 },
	{ start: 1, end: 3, revealAt: 0.35 },
	{ start: 2, end: 3, revealAt: 0.5 },
];

const particleRoutes: RouteDefinition[] = [
	{ from: 0, to: 1 },
	{ from: 1, to: 3 },
	{ from: 2, to: 3 },
	{ from: 0, to: 2 },
];

function NodeSphere({ position, color, scroll, visible }: {
	position: [number, number, number];
	color: string;
	scroll: { get: () => number };
	visible: boolean;
}) {
	const ref = useRef<THREE.Mesh>(null);

	useFrame(({ clock }) => {
		if (!ref.current) return;
		const progress = scroll.get();
		const pulse = 1 + Math.sin(clock.elapsedTime * 2.2) * (0.08 + progress * 0.08);
		ref.current.scale.setScalar(pulse);
		(ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.75 + progress * 0.8;
		ref.current.visible = visible;
	});

	return (
		<mesh ref={ref} position={position}>
			<sphereGeometry args={[0.26, 32, 32]} />
			<meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} metalness={0.25} roughness={0.15} />
		</mesh>
	);
}

function ParticleSwarm({ scroll }: { scroll: { get: () => number } }) {
	const refs = useRef<Array<THREE.Mesh | null>>([]);
	const particles = useMemo<ParticleConfig[]>(
		() =>
			Array.from({ length: 14 }, (_, index) => ({
				path: particleRoutes[index % particleRoutes.length],
				offset: index * 0.07,
				speed: 0.22 + ((index % 4) * 0.05),
				color: index % 2 === 0 ? "#22d3ee" : "#8b5cf6",
			})),
		[]
	);

	useFrame(({ clock }) => {
		const progress = scroll.get();
		const speedFactor = 0.35 + progress * 1.7;
		particles.forEach((particle, index) => {
			const mesh = refs.current[index];
			if (!mesh) return;

			const from = new THREE.Vector3(...nodeDefinitions[particle.path.from].position);
			const to = new THREE.Vector3(...nodeDefinitions[particle.path.to].position);
			const t = (particle.offset + clock.elapsedTime * particle.speed * speedFactor) % 1;
			const eased = 0.5 - Math.cos(t * Math.PI) / 2;
			mesh.position.copy(from.lerp(to, eased));
			(mesh.material as THREE.MeshStandardMaterial).opacity = 0.55 + progress * 0.3;
		});
	});

	return (
		<>
			{particles.map((particle, index) => (
				<mesh
					key={index}
					ref={(el) => (refs.current[index] = el)}
					position={nodeDefinitions[particle.path.from].position}>
					<sphereGeometry args={[0.05, 12, 12]} />
					<meshStandardMaterial transparent opacity={0.6} color={particle.color} emissive={particle.color} emissiveIntensity={1.1} />
				</mesh>
			))}
		</>
	);
}

function MCPScene({ scroll }: { scroll: { get: () => number } }) {
	const positions = useMemo(
		() => nodeDefinitions.map((node) => new THREE.Vector3(...node.position)),
		[]
	);

	useFrame(({ camera }) => {
		const progress = scroll.get();
		const zoom = THREE.MathUtils.lerp(8.5, 5.2, progress);
		const y = THREE.MathUtils.lerp(0.2, -0.16, progress);
		camera.position.lerp(new THREE.Vector3(0, y, zoom), 0.08);
		camera.lookAt(0, 0, 0);
	});

	return (
		<>
			<PerspectiveCamera makeDefault position={[0, 0, 8.5]} fov={32} />
			<ambientLight intensity={0.45} color="#c7d2fe" />
			<pointLight position={[4, 4, 5]} intensity={1.6} color="#7c3aed" />
			<pointLight position={[-4, -3, -2]} intensity={0.8} color="#22d3ee" />

			{nodeDefinitions.map((node) => {
				const visible = node.id !== "rag" || scroll.get() > 0.24;
				return <NodeSphere key={node.id} position={node.position} color={node.color} scroll={scroll} visible={visible} />;
			})}

			{connectionDefinitions.map((connection, index) => {
				const start = positions[connection.start];
				const end = positions[connection.end];
				const visibility = Math.max(0, Math.min(1, (scroll.get() - connection.revealAt) / 0.18));
				return (
					<Line
						key={index}
						points={[start, end]}
						color="#38bdf8"
						lineWidth={1.5}
						transparent
						opacity={visibility}
					/>
				);
			})}

			<ParticleSwarm scroll={scroll} />
		</>
	);
}

export default function MCPInsane({ scroll }: { scroll: { get: () => number } }) {
	return (
		<Canvas className="h-full w-full" gl={{ antialias: true }}>
			<MCPScene scroll={scroll} />
		</Canvas>
	);
}
