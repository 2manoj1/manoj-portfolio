import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LectureNotFound() {
	return (
		<section className="dark grid h-dvh place-items-center bg-zinc-950 px-6 text-center text-white">
			<div>
				<p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">Lecture Studio</p>
				<h1 className="mt-5 font-display text-5xl">Lecture not found.</h1>
				<p className="mt-4 text-zinc-400">The requested interactive lecture is not published.</p>
				<Link href="/lectures" className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-zinc-200 hover:border-white/30 hover:text-white"><ArrowLeft className="size-4" /> Back to Lecture Studio</Link>
			</div>
		</section>
	);
}
