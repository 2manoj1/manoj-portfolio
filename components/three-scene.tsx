"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function AnimatedSphere() {
	useFrame((state) => {
		state.scene.rotation.y += 0.003;
	});

	return (
		<mesh>
			<sphereGeometry args={[1, 32, 32]} />
			<meshStandardMaterial color="purple" />
		</mesh>
	);
}

export default function ThreeScene() {
	return (
		<Canvas className="h-[400px]">
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<AnimatedSphere />
			<OrbitControls enableZoom={false} />
		</Canvas>
	);
}
