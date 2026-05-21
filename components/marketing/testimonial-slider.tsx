"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Testimonial = {
	quote: string;
	author: string;
	role: string;
	relationship?: string;
	signal?: string;
};

export function TestimonialSlider({
	testimonials,
	className,
}: {
	testimonials: readonly Testimonial[];
	className?: string;
}) {
	const [activeIndex, setActiveIndex] = useState(0);
	const shouldReduceMotion = useReducedMotion();
	const active = testimonials[activeIndex];
	const total = testimonials.length;

	const proofSignals = useMemo(
		() =>
			Array.from(
				new Set(
					testimonials
						.map((testimonial) => testimonial.signal)
						.filter((signal): signal is string => Boolean(signal)),
				),
			),
		[testimonials],
	);

	function goTo(index: number) {
		setActiveIndex((index + total) % total);
	}

	function goPrevious() {
		goTo(activeIndex - 1);
	}

	function goNext() {
		goTo(activeIndex + 1);
	}

	return (
		<div className={cn("mt-14", className)}>
			<div className="grid border-y border-border lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="relative min-h-[30rem] overflow-hidden border-border py-8 lg:border-r lg:px-8">
					<div className="mb-8 flex items-center justify-between gap-4 px-6 lg:px-0">
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center border border-border bg-secondary/30">
								<Quote className="size-4 text-amber" aria-hidden="true" />
							</div>
							<div>
								<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
									LinkedIn recommendations
								</p>
								<p className="mt-1 text-sm text-foreground">
									{String(activeIndex + 1).padStart(2, "0")} /{" "}
									{String(total).padStart(2, "0")}
								</p>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								type="button"
								variant="secondary"
								size="icon-lg"
								aria-label="Show previous recommendation"
								onClick={goPrevious}
								className="rounded-lg border border-border text-muted-foreground hover:border-foreground hover:text-foreground">
								<ChevronLeft className="size-4" aria-hidden="true" />
							</Button>
							<Button
								type="button"
								size="icon-lg"
								aria-label="Show next recommendation"
								onClick={goNext}
								className="rounded-lg">
								<ChevronRight className="size-4" aria-hidden="true" />
							</Button>
						</div>
					</div>

					<div className="px-6 lg:px-0" aria-live="polite">
						<AnimatePresence mode="wait">
							<motion.blockquote
								key={active.author}
								initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
								transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
								className="flex min-h-[21rem] flex-col justify-between">
								<p className="max-w-[27ch] font-display text-3xl font-normal leading-[1.12] text-foreground md:text-4xl">
									&ldquo;{active.quote}&rdquo;
								</p>
								<footer className="mt-10 border-t border-border pt-6">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
										<div>
											<p className="text-lg font-medium text-foreground">
												{active.author}
											</p>
											<p className="mt-2 max-w-[42rem] text-sm leading-6 text-muted-foreground">
												{active.role}
											</p>
										</div>
										<div className="flex flex-wrap gap-2">
											{active.relationship ? (
												<span className="border border-border px-3 py-1.5 text-xs text-muted-foreground">
													{active.relationship}
												</span>
											) : null}
											{active.signal ? (
												<span className="border border-amber/30 bg-amber/10 px-3 py-1.5 text-xs text-foreground">
													{active.signal}
												</span>
											) : null}
										</div>
									</div>
								</footer>
							</motion.blockquote>
						</AnimatePresence>
					</div>
				</div>

				<aside className="border-t border-border bg-secondary/20 p-6 lg:border-t-0">
					<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
						Trust pattern
					</p>
					<div className="mt-5 space-y-2">
						{proofSignals.slice(0, 7).map((signal) => (
							<div
								key={signal}
								className="flex items-center justify-between gap-4 border border-border bg-background px-3 py-2 text-sm">
								<span className="text-foreground">{signal}</span>
								<span className="size-1.5 bg-amber" aria-hidden="true" />
							</div>
						))}
					</div>

					<div className="mt-8">
						<p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
							People close to the work
						</p>
						<div className="mt-4 grid grid-cols-4 gap-2 lg:grid-cols-2">
							{testimonials.map((testimonial, index) => (
								<Button
									key={testimonial.author}
									type="button"
									variant="secondary"
									size="icon-lg"
									aria-label={`Show recommendation from ${testimonial.author}`}
									aria-current={activeIndex === index}
									onClick={() => goTo(index)}
									className={cn(
										"aspect-square h-auto w-full rounded-lg border text-xs font-medium transition",
										activeIndex === index
											? "border-amber bg-amber text-amber-foreground hover:bg-amber/90"
											: "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground",
									)}>
									{getInitials(testimonial.author)}
								</Button>
							))}
						</div>
					</div>
				</aside>
			</div>

			<div className="mt-4 grid gap-2 sm:grid-cols-4">
				{testimonials.map((testimonial, index) => (
					<Button
						key={`${testimonial.author}-progress`}
						type="button"
						variant="ghost"
						aria-label={`Jump to recommendation ${index + 1}`}
						onClick={() => goTo(index)}
						className="group h-2 overflow-hidden rounded-lg bg-border p-0 hover:bg-border">
						<span
							className={cn(
								"block h-full bg-amber transition-all duration-300",
								activeIndex === index ? "w-full" : "w-0 group-hover:w-1/2",
							)}
						/>
					</Button>
				))}
			</div>
		</div>
	);
}

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}
