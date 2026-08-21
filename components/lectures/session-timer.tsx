"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

function formatTime(totalSeconds: number) {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`;
}

export function SessionTimer({ targetSeconds }: { targetSeconds: number }) {
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [running, setRunning] = useState(true);

	useEffect(() => {
		if (!running) return;
		const interval = window.setInterval(() => {
			setElapsedSeconds((seconds) => seconds + 1);
		}, 1000);
		return () => window.clearInterval(interval);
	}, [running]);

	const delta = elapsedSeconds - targetSeconds;
	const paceClass =
		delta > 180
			? "text-rose-300"
			: delta > 60
				? "text-amber-300"
				: "text-emerald-300";

	return (
		<div className="flex items-center gap-2" role="timer" aria-label="Session timer">
			<span className={`font-mono text-xs tabular-nums ${paceClass}`}>
				{formatTime(elapsedSeconds)}
			</span>
			<button
				type="button"
				onClick={() => setRunning((value) => !value)}
				className="grid size-8 place-items-center rounded-full border border-white/15 text-zinc-300 transition hover:border-amber-300/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
				aria-label={running ? "Pause session timer" : "Resume session timer"}>
				{running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
			</button>
		</div>
	);
}
