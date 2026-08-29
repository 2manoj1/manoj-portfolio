"use client";

import Link from "next/link";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Expand,
	Minimize,
	RotateCcw,
	Timer,
	X,
	Sparkles,
	HelpCircle,
	ArrowRight,
	ShieldCheck,
	Keyboard,
} from "lucide-react";
import { SceneRenderer } from "@/components/lectures/scene-renderer";
import { SessionTimer } from "@/components/lectures/session-timer";
import type { Lecture } from "@/lib/lectures/types";

type RuntimeState = {
	sceneIndex: number;
	notesVisible: boolean;
	timerVisible: boolean;
	timerKey: number;
};

type RuntimeAction =
	| { type: "next"; sceneCount: number }
	| { type: "previous" }
	| { type: "first" }
	| { type: "last"; sceneCount: number }
	| { type: "restart" }
	| { type: "toggle-notes" }
	| { type: "toggle-timer" }
	| { type: "go-to"; sceneIndex: number };

const initialState: RuntimeState = {
	sceneIndex: 0,
	notesVisible: false,
	timerVisible: true,
	timerKey: 0,
};

function runtimeReducer(state: RuntimeState, action: RuntimeAction): RuntimeState {
	switch (action.type) {
		case "next":
			return {
				...state,
				sceneIndex: Math.min(state.sceneIndex + 1, action.sceneCount - 1),
			};
		case "previous":
			return { ...state, sceneIndex: Math.max(state.sceneIndex - 1, 0) };
		case "first":
			return { ...state, sceneIndex: 0 };
		case "last":
			return { ...state, sceneIndex: action.sceneCount - 1 };
		case "restart":
			return { ...initialState, timerKey: state.timerKey + 1 };
		case "toggle-notes":
			return { ...state, notesVisible: !state.notesVisible };
		case "toggle-timer":
			return { ...state, timerVisible: !state.timerVisible };
		case "go-to":
			return { ...state, sceneIndex: action.sceneIndex };
	}
}

function isInteractiveTarget(target: EventTarget | null) {
	if (!(target instanceof Element)) return false;
	return Boolean(
		target.closest(
			'input, textarea, select, button, a, [contenteditable="true"], [role="button"], .react-flow',
		),
	);
}

export function LectureRuntime({ lecture }: { lecture: Lecture }) {
	const [state, dispatch] = useReducer(runtimeReducer, initialState);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const shellRef = useRef<HTMLElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const pointerStartRef = useRef<number | null>(null);
	const interactivePointerRef = useRef(false);

	const scene = lecture.scenes[state.sceneIndex];
	const nextScene = lecture.scenes[state.sceneIndex + 1];
	const cumulativeTargetSeconds = lecture.scenes
		.slice(0, state.sceneIndex + 1)
		.reduce((total, item) => total + item.durationSeconds, 0);
	const progress = ((state.sceneIndex + 1) / lecture.scenes.length) * 100;
	const sceneSources = lecture.sources.filter((source) =>
		scene.sourceIds?.includes(source.id),
	);

	const next = useCallback(() => {
		dispatch({ type: "next", sceneCount: lecture.scenes.length });
	}, [lecture.scenes.length]);

	const previous = useCallback(() => {
		dispatch({ type: "previous" });
	}, []);

	const jumpToNextDemo = useCallback(() => {
		const nextDemoIndex = lecture.scenes.findIndex(
			(item, index) => index > state.sceneIndex && item.kind === "demo",
		);
		if (nextDemoIndex >= 0) {
			dispatch({ type: "go-to", sceneIndex: nextDemoIndex });
		}
	}, [lecture.scenes, state.sceneIndex]);

	const toggleFullscreen = useCallback(async () => {
		try {
			const ownerDocument = shellRef.current?.ownerDocument;
			if (ownerDocument?.fullscreenElement) {
				await ownerDocument.exitFullscreen();
			} else {
				await shellRef.current?.requestFullscreen();
			}
		} catch {
			// Browser full screen fallback
		}
	}, []);

	useEffect(() => {
		stageRef.current?.focus({ preventScroll: true });
	}, [state.sceneIndex]);

	useEffect(() => {
		const ownerDocument = shellRef.current?.ownerDocument ?? document;
		const updateFullscreen = () => {
			setIsFullscreen(ownerDocument.fullscreenElement === shellRef.current);
		};
		ownerDocument.addEventListener("fullscreenchange", updateFullscreen);
		return () => ownerDocument.removeEventListener("fullscreenchange", updateFullscreen);
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.defaultPrevented ||
				event.repeat ||
				event.metaKey ||
				event.ctrlKey ||
				event.altKey ||
				isInteractiveTarget(event.target)
			) {
				return;
			}

			switch (event.key) {
				case "ArrowRight":
				case " ":
				case "PageDown":
				case "j":
				case "J":
				case "l":
				case "L":
					event.preventDefault();
					next();
					break;
				case "ArrowLeft":
				case "PageUp":
				case "k":
				case "K":
				case "h":
				case "H":
					event.preventDefault();
					previous();
					break;
				case "Home":
					event.preventDefault();
					dispatch({ type: "first" });
					break;
				case "End":
					event.preventDefault();
					dispatch({ type: "last", sceneCount: lecture.scenes.length });
					break;
				case "f":
				case "F":
					event.preventDefault();
					void toggleFullscreen();
					break;
				case "t":
				case "T":
					dispatch({ type: "toggle-timer" });
					break;
				case "p":
				case "P":
					dispatch({ type: "toggle-notes" });
					break;
				case "d":
				case "D":
					jumpToNextDemo();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [jumpToNextDemo, lecture.scenes.length, next, previous, toggleFullscreen]);

	const handlePointerDown = (event: React.PointerEvent) => {
		pointerStartRef.current = event.clientX;
		interactivePointerRef.current = isInteractiveTarget(event.target);
	};

	const handlePointerUp = (event: React.PointerEvent) => {
		const start = pointerStartRef.current;
		pointerStartRef.current = null;
		if (start === null || interactivePointerRef.current) return;
		const delta = event.clientX - start;
		if (Math.abs(delta) < 80) return;
		if (delta < 0) next();
		else previous();
	};

	const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
		if (!shellRef.current) return;
		const rect = shellRef.current.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;
		shellRef.current.style.setProperty("--mouse-x", `${x}%`);
		shellRef.current.style.setProperty("--mouse-y", `${y}%`);
	};

	return (
		<section
			ref={shellRef}
			onMouseMove={handleMouseMove}
			className="dark relative flex h-dvh min-h-0 w-full flex-col overflow-hidden text-white lecture-stage"
			aria-label={lecture.title}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}>
			{/* Ambient glowing radial aura tracking mouse */}
			<div className="lecture-ambient-aura" />
			<div className="pointer-events-none absolute inset-0 opacity-35 lecture-grid" />

			{/* Header Stage Navigation with Glassmorphism */}
			<header className="relative z-10 flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-3 backdrop-blur-xl sm:px-5">
				<div className="flex min-w-0 items-center gap-3">
					<Link
						href="/lectures"
						className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-zinc-400 transition hover:border-amber-400/50 hover:bg-white/5 hover:text-white"
						aria-label="Exit lecture">
						<X className="size-4" />
					</Link>
					<div className="min-w-0">
						<p className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
							{scene.sectionLabel}
						</p>
						<p className="truncate text-xs font-semibold text-zinc-200 sm:text-sm">{lecture.shortTitle}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{state.timerVisible ? (
						<SessionTimer key={state.timerKey} targetSeconds={cumulativeTargetSeconds} />
					) : null}
					<span className="rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-xs font-bold tabular-nums text-amber-200">
						{String(state.sceneIndex + 1).padStart(2, "0")} <span className="text-zinc-500">/</span> {lecture.scenes.length}
					</span>
				</div>
			</header>

			{/* Animated Glowing Progress Line */}
			<div className="relative z-10 h-1 shrink-0 bg-white/[0.05]" aria-hidden="true">
				<div
					className="relative h-full bg-gradient-to-r from-amber-500 via-amber-300 to-emerald-400 transition-[width] duration-300 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
					style={{ width: `${progress}%` }}>
					<span className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
				</div>
			</div>

			{/* Dynamic Stage Body: Centers content gracefully on 1080p, tablet & desktop */}
			<div
				ref={stageRef}
				tabIndex={-1}
				role="region"
				className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3 outline-none sm:px-6 md:py-4"
				aria-label={`${scene.sectionLabel}: ${scene.title}`}>
				<div key={scene.id} className="mx-auto flex h-full min-h-[30rem] w-full max-w-[1550px] flex-1 flex-col justify-center lecture-scene">
					<SceneRenderer scene={scene} sources={lecture.sources} />
				</div>
			</div>

			{/* Footer Presenter Bar with 2030 Keyboard Hotkey Badges */}
			<footer className="relative z-20 flex min-h-15 shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-black/60 px-3 backdrop-blur-xl sm:px-5">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={previous}
						disabled={state.sceneIndex === 0}
						className="grid size-10 place-items-center rounded-full border border-white/15 text-zinc-300 transition hover:border-amber-400/40 hover:bg-white/[0.06] hover:text-white disabled:opacity-30 cursor-pointer"
						aria-label="Previous scene">
						<ChevronLeft className="size-5" />
					</button>
					<button
						type="button"
						onClick={next}
						disabled={state.sceneIndex === lecture.scenes.length - 1}
						className="inline-flex min-h-10 items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 px-6 text-sm font-bold text-zinc-950 transition hover:scale-105 hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] disabled:opacity-30 cursor-pointer">
						Next <ChevronRight className="size-4 stroke-[3]" />
					</button>
				</div>

				<div className="hidden min-w-0 items-center gap-2.5 md:flex">
					{sceneSources.length ? (
						<span className="truncate font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-400/30 bg-emerald-400/10 rounded-full px-2.5 py-0.5">
							{sceneSources.length} verified source{sceneSources.length === 1 ? "" : "s"}
						</span>
					) : null}
					<span className="h-4 w-px bg-white/15" />
					<div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400">
						<Keyboard className="size-3.5 text-zinc-500" />
						<span className="rounded bg-white/10 px-1.5 py-0.5 text-zinc-200">←</span>
						<span className="rounded bg-white/10 px-1.5 py-0.5 text-zinc-200">→</span>
						<span className="rounded bg-white/10 px-1.5 py-0.5 text-zinc-200">Space</span>
						<span className="text-zinc-500">·</span>
						<span className="rounded bg-white/10 px-1.5 py-0.5 text-amber-300 font-bold">P</span> Guide
						<span className="text-zinc-500">·</span>
						<span className="rounded bg-white/10 px-1.5 py-0.5 text-zinc-200">F</span> Fullscreen
					</div>
				</div>

				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={() => dispatch({ type: "toggle-timer" })}
						className="grid size-10 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
						aria-label="Toggle timer">
						<Timer className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => dispatch({ type: "toggle-notes" })}
						className={`grid size-10 place-items-center rounded-full border transition ${
							state.notesVisible
								? "border-amber-400 bg-amber-400/20 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
								: "border-white/10 text-zinc-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
						}`}
						aria-label="Toggle discussion guide">
						<BookOpen className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => void toggleFullscreen()}
						className="grid size-10 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
						aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
						{isFullscreen ? <Minimize className="size-4" /> : <Expand className="size-4" />}
					</button>
					<button
						type="button"
						onClick={() => dispatch({ type: "restart" })}
						className="grid size-10 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
						aria-label="Restart lecture">
						<RotateCcw className="size-4" />
					</button>
				</div>
			</footer>

			{/* Keynote Discussion Guide & Storytelling Companion Drawer */}
			{state.notesVisible ? (
				<aside
					className="absolute inset-y-0 right-0 z-40 w-full max-w-lg overflow-y-auto border-l border-amber-400/30 bg-zinc-950/98 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300"
					aria-label="Keynote Discussion Guide">
					<div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
						<div className="flex items-center gap-2.5">
							<div className="grid size-8 place-items-center rounded-xl bg-amber-400/20 text-amber-300 shadow-md">
								<Sparkles className="size-4" />
							</div>
							<div>
								<p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
									Keynote Discussion Guide
								</p>
								<p className="text-xs font-semibold text-zinc-200">Live Engineering Storyline</p>
							</div>
						</div>
						<button
							type="button"
							onClick={() => dispatch({ type: "toggle-notes" })}
							className="rounded-full border border-white/10 p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
							aria-label="Close discussion guide">
							<X className="size-4" />
						</button>
					</div>

					<div className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-300">
						<div className="rounded-2xl border border-amber-400/40 bg-amber-950/30 p-4 shadow-lg">
							<p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
								<Sparkles className="size-3.5" /> Core Systems Narrative
							</p>
							<p className="mt-2 text-xs leading-relaxed text-zinc-100 font-medium">{scene.notes.say}</p>
						</div>

						{scene.notes.ask ? (
							<div className="rounded-2xl border border-cyan-400/40 bg-cyan-950/30 p-4 shadow-lg">
								<p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300">
									<HelpCircle className="size-3.5" /> Classroom Discussion Prompt
								</p>
								<p className="mt-2 text-xs leading-relaxed text-cyan-100 font-medium">{scene.notes.ask}</p>
							</div>
						) : null}

						{scene.notes.expected ? (
							<div className="rounded-2xl border border-emerald-400/40 bg-emerald-950/30 p-4 shadow-lg">
								<p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300">
									<ShieldCheck className="size-3.5" /> Architecture Insight & Takeaway
								</p>
								<p className="mt-2 text-xs leading-relaxed text-emerald-100 font-medium">{scene.notes.expected}</p>
							</div>
						) : null}

						<div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4">
							<p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
								<ArrowRight className="size-3.5 text-amber-400" /> Conceptual Transition
							</p>
							<p className="mt-2 text-xs leading-relaxed text-zinc-300">{scene.notes.transition}</p>
						</div>

						{nextScene ? (
							<div className="rounded-2xl border border-white/10 bg-black/40 p-4">
								<p className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">Upcoming Scene</p>
								<p className="mt-1 font-display text-sm font-bold text-white">{nextScene.title}</p>
								<p className="text-xs text-zinc-400">{nextScene.sectionLabel}</p>
							</div>
						) : null}
					</div>
				</aside>
			) : null}
		</section>
	);
}
