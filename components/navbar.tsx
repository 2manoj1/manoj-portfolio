"use client";

export default function Navbar() {
	return (
		<div className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-md border-b border-border">
			<div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
				<span className="font-semibold">Manoj</span>

				<div className="flex gap-6 text-sm text-muted-foreground">
					<a href="#projects">Projects</a>
					<a href="#impact">Impact</a>
					<a href="#contact">Contact</a>
				</div>
			</div>
		</div>
	);
}
