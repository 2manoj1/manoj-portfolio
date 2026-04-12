"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Toggle theme"
    >
      <SunMedium className="absolute size-4 shrink-0 scale-100 rotate-0 duration-300 dark:scale-0 dark:-rotate-90" />
      <MoonStar className="absolute size-4 shrink-0 scale-0 rotate-90 duration-300 dark:scale-100 dark:rotate-0" />
    </button>
  );
}
