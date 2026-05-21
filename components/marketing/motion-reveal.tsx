"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function MotionReveal({
	children,
	className,
	delay = 0,
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
}) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.div
			initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-80px" }}
			transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
			className={className}>
			{children}
		</motion.div>
	);
}
