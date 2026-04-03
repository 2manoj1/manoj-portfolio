"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.8,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			lerp: 0.08,
			orientation: "vertical",
			gestureOrientation: "vertical",
			touchMultiplier: 2,
			infinite: false,
			autoRaf: true,
		});

		const frame = (time: number) => {
			lenis.raf(time);
			requestAnimationFrame(frame);
		};

		requestAnimationFrame(frame);

		return () => lenis.destroy();
	}, []);

	return <>{children}</>;
}
