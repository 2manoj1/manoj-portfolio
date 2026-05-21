"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative rounded-lg text-muted-foreground hover:text-foreground"
      aria-label="Toggle theme"
    >
      <SunMedium className="absolute size-4 shrink-0 scale-100 rotate-0 duration-300 dark:scale-0 dark:-rotate-90" />
      <MoonStar className="absolute size-4 shrink-0 scale-0 rotate-90 duration-300 dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
