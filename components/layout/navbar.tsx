"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/engineering", label: "Engineering" },
  { href: "/architecture-lab", label: "Architecture Lab" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-dvw max-w-dvw overflow-x-clip border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-6xl min-w-0 px-4 sm:px-6">
        <nav className="flex h-12 min-w-0 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Homepage" className="inline-flex items-center">
              <Logo size="xs" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center gap-1 lg:flex h-full">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <div key={link.href} className="relative flex items-center h-full">
                  <Link
                    href={link.href}
                    className={cn(
                      "relative rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors duration-200 hover:text-foreground inline-flex items-center gap-1",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 -z-10 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>{link.label}</span>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex min-w-0 items-center gap-2">
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
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-md lg:hidden max-h-[85vh] overflow-y-auto animate-fadeIn">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
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
