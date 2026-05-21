"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { routes } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";

const navLinks = routes.filter((route) =>
	["/services", "/engineering", "/case-studies", "/blog", "/about"].includes(
		route.href,
	),
);

export function Navbar() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
			<div className="mx-auto max-w-6xl px-6">
				<nav className="flex h-14 items-center justify-between">
					<Link href="/" aria-label="Homepage" className="inline-flex">
						<Logo size="xs" />
					</Link>

					<div className="hidden items-center gap-6 lg:flex">
						{navLinks.map((link) => {
							const active =
								pathname === link.href || pathname.startsWith(`${link.href}/`);
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										"text-sm text-muted-foreground hover:text-foreground",
										active && "text-foreground",
									)}>
									{link.label}
								</Link>
							);
						})}
					</div>

					<div className="flex items-center gap-2">
						<Button
							asChild
							size="sm"
							className="hidden lg:inline-flex">
							<Link href="/advisory-intake">Work With Me</Link>
						</Button>
						<ModeToggle />
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="rounded-lg text-muted-foreground hover:text-foreground lg:hidden"
							onClick={() => setMobileOpen(!mobileOpen)}
							aria-label={mobileOpen ? "Close menu" : "Open menu"}>
							{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
						</Button>
					</div>
				</nav>
			</div>

			{mobileOpen && (
				<div className="border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
					<div className="mx-auto flex max-w-6xl flex-col px-6 pb-6">
						{[...navLinks, routes.find((route) => route.href === "/advisory-intake")!].map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMobileOpen(false)}
								className="border-b border-border/50 py-3 text-sm text-muted-foreground last:border-0 hover:text-foreground">
								{link.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</header>
	);
}
