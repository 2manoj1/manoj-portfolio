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
	const [fullscreenMessage, setFullscreenMessage] = useState("");
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
			setFullscreenMessage("");
		} catch {
			setFullscreenMessage(
				"Fullscreen was blocked. The lecture remains in immersive browser mode.",
			);
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
					event.preventDefault();
					next();
					break;
				case "ArrowLeft":
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

	return (
		<section
			ref={shellRef}
			className="dark relative flex h-dvh min-h-0 w-full flex-col overflow-hidden text-white lecture-stage"
			aria-label={lecture.title}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}>
			<div className="pointer-events-none absolute inset-0 opacity-40 lecture-grid" />

			{/* Header Stage Navigation */}
			<header className="relative z-10 flex min-h-14 items-center justify-between gap-3 border-b border-white/10 px-3 sm:px-5">
				<div className="flex min-w-0 items-center gap-3">
					<Link
						href="/lectures"
						className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-zinc-400 transition hover:border-white/30 hover:text-white"
						aria-label="Exit lecture">
						<X className="size-4" />
					</Link>
					<div className="min-w-0">
						<p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">
							{scene.sectionLabel}
						</p>
						<p className="truncate text-xs text-zinc-400 sm:text-sm font-semibold">{lecture.shortTitle}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{state.timerVisible ? (
						<SessionTimer key={state.timerKey} targetSeconds={cumulativeTargetSeconds} />
					) : null}
					<span className="font-mono text-xs tabular-nums text-zinc-400">
						{String(state.sceneIndex + 1).padStart(2, "0")} / {lecture.scenes.length}
					</span>
				</div>
			</header>

			{/* Progress Indicator */}
			<div className="relative z-10 h-1 bg-white/[0.05]" aria-hidden="true">
				<div
					className="h-full bg-amber-400 transition-[width] duration-300"
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* Dynamic Stage Body */}
			<div
				ref={stageRef}
				tabIndex={-1}
				role="region"
				className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-5 outline-none sm:px-7 md:py-6"
				aria-label={`${scene.sectionLabel}: ${scene.title}`}>
				<div key={scene.id} className="mx-auto h-full min-h-[32rem] w-full max-w-[1600px] lecture-scene">
					<SceneRenderer scene={scene} sources={lecture.sources} />
				</div>
			</div>

			{/* Footer Presenter Bar */}
			<footer className="relative z-20 flex min-h-16 items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-3 backdrop-blur-md sm:px-5">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={previous}
						disabled={state.sceneIndex === 0}
						className="grid size-10 place-items-center rounded-full border border-white/15 text-zinc-300 transition hover:border-white/30 hover:text-white disabled:opacity-30"
						aria-label="Previous scene">
						<ChevronLeft className="size-5" />
					</button>
					<button
						type="button"
						onClick={next}
						disabled={state.sceneIndex === lecture.scenes.length - 1}
						className="inline-flex min-h-10 items-center gap-2 rounded-full bg-amber-400 px-5 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 disabled:opacity-30 shadow-lg shadow-amber-950/30">
						Next scene <ChevronRight className="size-4" />
					</button>
				</div>
				<div className="hidden min-w-0 items-center gap-2 md:flex">
					{sceneSources.length ? (
						<span className="truncate font-mono text-[10px] uppercase tracking-wider text-zinc-500">
							{sceneSources.length} verified source{sceneSources.length === 1 ? "" : "s"}
						</span>
					) : null}
					<span className="h-4 w-px bg-white/10" />
					<span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
						← → · Space · F · T · P · D
					</span>
				</div>
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => dispatch({ type: "toggle-timer" })}
						className="grid size-10 place-items-center rounded-full text-zinc-400 hover:bg-white/[0.06] hover:text-white"
						aria-label="Toggle timer">
						<Timer className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => dispatch({ type: "toggle-notes" })}
						className={`grid size-10 place-items-center rounded-full hover:bg-white/[0.06] hover:text-white ${
							state.notesVisible ? "text-amber-300 bg-white/10" : "text-zinc-400"
						}`}
						aria-label="Toggle presenter notes">
						<BookOpen className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => void toggleFullscreen()}
						className="grid size-10 place-items-center rounded-full text-zinc-400 hover:bg-white/[0.06] hover:text-white"
						aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
						{isFullscreen ? <Minimize className="size-4" /> : <Expand className="size-4" />}
					</button>
					<button
						type="button"
						onClick={() => dispatch({ type: "restart" })}
						className="grid size-10 place-items-center rounded-full text-zinc-400 hover:bg-white/[0.06] hover:text-white"
						aria-label="Restart lecture">
						<RotateCcw className="size-4" />
					</button>
				</div>
			</footer>

			{/* Presenter Notes Drawer */}
			{state.notesVisible ? (
				<aside
					className="absolute inset-y-0 right-0 z-40 w-full max-w-md overflow-y-auto border-l border-white/15 bg-zinc-950/98 p-6 shadow-2xl backdrop-blur-xl"
					aria-label="Presenter notes">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">
								Presenter Mode
							</p>
							<p className="mt-0.5 text-xs text-amber-200/80">Speaker Guidance for Manoj</p>
						</div>
						<button
							type="button"
							onClick={() => dispatch({ type: "toggle-notes" })}
							className="grid size-9 place-items-center rounded-full border border-white/15 text-zinc-400 hover:text-white"
							aria-label="Close presenter notes">
							<X className="size-4" />
						</button>
					</div>

					<p className="mt-6 font-mono text-xs uppercase text-zinc-500">
						Scene {state.sceneIndex + 1} of {lecture.scenes.length}
					</p>
					<h2 className="mt-1 font-display text-2xl font-semibold text-white">{scene.title}</h2>

					<div className="mt-6 space-y-5 text-sm leading-relaxed text-zinc-300">
						<div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
							<p className="font-mono text-[10px] uppercase tracking-wider text-amber-300">What to Say</p>
							<p className="mt-1.5 text-zinc-200">{scene.notes.say}</p>
						</div>

						{scene.notes.ask ? (
							<div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
								<p className="font-mono text-[10px] uppercase tracking-wider text-amber-300">
									Interactive Question to Class
								</p>
								<p className="mt-1.5 text-amber-100 font-semibold">{scene.notes.ask}</p>
							</div>
						) : null}

						{scene.notes.expected ? (
							<div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
								<p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
									Expected Response & Discovery
								</p>
								<p className="mt-1.5 text-zinc-300">{scene.notes.expected}</p>
							</div>
						) : null}

						<div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
							<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
								Transition to Next Concept
							</p>
							<p className="mt-1.5 text-zinc-300">{scene.notes.transition}</p>
						</div>
					</div>

					{sceneSources.length ? (
						<div className="mt-6 border-t border-white/10 pt-5">
							<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
								Verified Academic & Industry Citations
							</p>
							<div className="mt-3 space-y-2">
								{sceneSources.map((source) => (
									<a
										key={source.id}
										href={source.url}
										target="_blank"
										rel="noreferrer"
										className="block rounded-xl border border-white/10 p-3 text-xs leading-5 text-zinc-400 hover:border-amber-300/40 hover:text-white">
										<span className={`mr-2 uppercase font-mono text-[9px] ${statusClassForNotes(source.status)}`}>
											[{source.status}]
										</span>
										{source.publisher} · {source.label}
									</a>
								))}
							</div>
						</div>
					) : null}

					{nextScene ? (
						<div className="mt-6 border-t border-white/10 pt-5">
							<p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
								Next Up: Scene {state.sceneIndex + 2}
							</p>
							<p className="mt-1 text-base font-semibold text-zinc-200">{nextScene.title}</p>
						</div>
					) : null}
				</aside>
			) : null}

			<div className="sr-only" aria-live="polite">
				Scene {state.sceneIndex + 1}: {scene.title}
			</div>
			{fullscreenMessage ? (
				<div
					className="absolute bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-amber-300/30 bg-zinc-950 px-4 py-2 text-sm text-amber-100"
					role="status">
					{fullscreenMessage}
				</div>
			) : null}
		</section>
	);
}

function statusClassForNotes(status: Lecture["sources"][number]["status"]) {
	return status === "production" || status === "deployment"
		? "text-emerald-300"
		: status === "closed"
			? "text-rose-300"
			: "text-amber-300";
}
