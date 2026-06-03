"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { routes, services, caseStudies } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";

const navLinks = [
	{ href: "/services", label: "Services", hasDropdown: true, type: "services" },
	{ href: "/engineering", label: "Engineering" },
	{ href: "/architecture-lab", label: "Architecture Lab" },
	{ href: "/case-studies", label: "Case Studies", hasDropdown: true, type: "caseStudies" },
	{ href: "/blog", label: "Writing" },
	{ href: "/about", label: "About" },
];

export function Navbar() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
	const [mobileCaseStudiesOpen, setMobileCaseStudiesOpen] = useState(false);
	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors duration-300">
			<div className="mx-auto max-w-6xl px-6">
				<nav className="flex h-12 items-center justify-between">
					{/* Logo Section */}
					<div className="flex items-center gap-4">
						<Link href="/" aria-label="Homepage" className="inline-flex items-center">
							<Logo size="xs" />
						</Link>
					</div>

					{/* Navigation Links with Hover Flyouts & active pills */}
					<div className="hidden items-center gap-1 lg:flex h-full">
						{navLinks.map((link) => {
							const active =
								pathname === link.href || pathname.startsWith(`${link.href}/`);
							return (
								<div
									key={link.href}
									className="relative flex items-center h-full"
									onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.type)}
									onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
								>
									<Link
										href={link.href}
										className={cn(
											"relative rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors duration-200 hover:text-foreground inline-flex items-center gap-1",
											active ? "text-foreground" : "text-muted-foreground"
										)}
									>
										{active && !link.hasDropdown && (
											<motion.span
												layoutId="navbar-active-pill"
												className="absolute inset-0 -z-10 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50"
												transition={{ type: "spring", stiffness: 380, damping: 30 }}
											/>
										)}
										<span>{link.label}</span>
										{link.hasDropdown && (
											<ChevronDown className={cn(
												"size-3 opacity-60 transition-transform duration-200",
												activeDropdown === link.type && "rotate-180"
											)} />
										)}
									</Link>

									{/* Dropdown Flyout Card */}
									{link.hasDropdown && (
										<AnimatePresence>
											{activeDropdown === link.type && (
												<div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 z-50">
													<motion.div
														initial={{ opacity: 0, y: 4, scale: 0.98 }}
														animate={{ opacity: 1, y: 0, scale: 1 }}
														exit={{ opacity: 0, y: 4, scale: 0.98 }}
														transition={{ duration: 0.12, ease: "easeOut" }}
														className={cn(
															"rounded-lg border border-border/80 bg-background/95 backdrop-blur-md p-3.5 shadow-xl",
															link.type === "services" ? "w-[520px]" : "w-[380px]"
														)}
													>
														{link.type === "services" ? (
															<div className="grid grid-cols-2 gap-2">
																{services.map((s) => (
																	<Link
																		key={s.slug}
																		href={`/services/${s.slug}`}
																		className="group flex flex-col rounded-md p-2 hover:bg-muted/50 dark:hover:bg-muted/30 transition-all duration-200"
																	>
																		<span className="text-[12px] font-semibold text-foreground group-hover:text-amber transition-colors">
																			{s.shortTitle}
																		</span>
																		<span className="text-[10px] text-muted-foreground/80 line-clamp-1 mt-0.5 leading-normal">
																			{s.buyerPain}
																		</span>
																	</Link>
																))}
															</div>
														) : (
															<div className="flex flex-col gap-1">
																{caseStudies.map((c) => (
																	<Link
																		key={c.slug}
																		href={`/case-studies#${c.slug}`}
																		className="group flex flex-col rounded-md p-2 hover:bg-muted/50 dark:hover:bg-muted/30 transition-all duration-200"
																	>
																		<span className="text-[12px] font-semibold text-foreground group-hover:text-amber transition-colors">
																			{c.title.replace(" Platform", "").replace(" Modernization", "").replace(" Enablement", "")}
																		</span>
																		<span className="text-[10px] text-muted-foreground/80 line-clamp-1 mt-0.5 leading-normal">
																			{c.problem}
																		</span>
																	</Link>
																))}
															</div>
														)}
													</motion.div>
												</div>
											)}
										</AnimatePresence>
									)}
								</div>
							);
						})}
					</div>

					{/* Right Actions */}
					<div className="flex items-center gap-2">
						<Button
							asChild
							size="sm"
							variant="outline"
							className="hidden font-medium tracking-tight shadow-sm lg:inline-flex"
						>
							<Link href="/advisory-intake">Work With Me</Link>
						</Button>
						<ModeToggle />
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="rounded-lg text-muted-foreground hover:text-foreground lg:hidden size-8"
							onClick={() => setMobileOpen(!mobileOpen)}
							aria-label={mobileOpen ? "Close menu" : "Open menu"}
						>
							{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
						</Button>
					</div>
				</nav>
			</div>

			{/* Mobile Navigation Dropdown */}
			{mobileOpen && (
				<div className="border-t border-border/60 bg-background/95 backdrop-blur-md lg:hidden max-h-[85vh] overflow-y-auto">
					<div className="mx-auto flex max-w-6xl flex-col px-6 py-4 gap-1">
						{navLinks.map((link) => {
							const active =
								pathname === link.href || pathname.startsWith(`${link.href}/`);
							
							if (link.hasDropdown) {
								const isOpen = link.type === "services" ? mobileServicesOpen : mobileCaseStudiesOpen;
								const toggleOpen = link.type === "services" 
									? () => setMobileServicesOpen(!mobileServicesOpen) 
									: () => setMobileCaseStudiesOpen(!mobileCaseStudiesOpen);
								
								return (
									<div key={link.href} className="border-b border-border/40 last:border-0 py-2">
										<button
											onClick={toggleOpen}
											className={cn(
												"flex w-full items-center justify-between text-sm font-medium py-1.5 transition-colors",
												active ? "text-foreground" : "text-muted-foreground"
											)}
										>
											<span>{link.label}</span>
											<ChevronDown className={cn(
												"size-4 opacity-60 transition-transform duration-200",
												isOpen && "rotate-180"
											)} />
										</button>
										
										{isOpen && (
											<div className="mt-1 flex flex-col gap-2 pl-3 border-l border-border/60">
												{link.type === "services" ? (
													services.map((s) => (
														<Link
															key={s.slug}
															href={`/services/${s.slug}`}
															onClick={() => setMobileOpen(false)}
															className="text-[12px] text-muted-foreground hover:text-foreground py-1 transition-colors"
														>
															{s.title}
														</Link>
													))
												) : (
													caseStudies.map((c) => (
														<Link
															key={c.slug}
															href={`/case-studies#${c.slug}`}
															onClick={() => setMobileOpen(false)}
															className="text-[12px] text-muted-foreground hover:text-foreground py-1 transition-colors"
														>
															{c.title}
														</Link>
													))
												)}
											</div>
										)}
									</div>
								);
							}
							
							return (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setMobileOpen(false)}
									className={cn(
										"border-b border-border/40 py-3 text-sm font-medium transition-colors last:border-0 hover:text-foreground",
										active ? "text-foreground" : "text-muted-foreground"
									)}
								>
									{link.label}
								</Link>
							);
						})}
						
						{/* Advisory Intake button at bottom */}
						<Link
							href="/advisory-intake"
							onClick={() => setMobileOpen(false)}
							className="mt-4 flex h-9 w-full items-center justify-center rounded-lg bg-amber text-sm font-semibold text-amber-foreground hover:bg-amber/90 transition-colors"
						>
							Work With Me
						</Link>
					</div>
				</div>
			)}
		</header>
	);
}
