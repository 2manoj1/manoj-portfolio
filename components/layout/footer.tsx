import Link from "next/link";
import { LINKEDIN, GITHUB, MEDIUM, GOOGLE_SCHOLAR } from "@/lib/links";
import { Logo } from "@/components/logo";
import { routes } from "@/content/site";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ScholarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.242 13.769L0 9.5 12 2l12 7.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
    </svg>
  );
}

export function Footer() {
  const footerRoutes = routes.filter((route) => route.href !== "/");

  return (
    <footer className="border-t border-border/50 py-10 bg-zinc-50/10 dark:bg-zinc-950/10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_auto]">
          <div>
            <Link href="/" aria-label="Homepage">
              <Logo size="sm" />
            </Link>
            <p className="mt-2.5 max-w-[40ch] font-normal text-xs text-muted-foreground leading-relaxed">
              AI Systems Architect. Designing high-throughput production RAG infrastructure, 
              orchestrating multi-agent graph workflows, and scaling AI platforms.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-1.5 sm:gap-2" aria-label="Footer Navigation">
            {footerRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5 sm:col-span-2 lg:col-span-1 lg:justify-end">
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <LinkedInIcon className="size-[16px]" />
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <GitHubIcon className="size-[16px]" />
            </a>
            <a
              href={GOOGLE_SCHOLAR}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Scholar"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <ScholarIcon className="size-[16px]" />
            </a>
            <a
              href={MEDIUM}
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Medium
            </a>
          </div>
        </div>

        {/* Lower Row: Copyright and Stack details */}
        <div className="mt-8 border-t border-border/50 pt-6">
          <div className="space-y-1">
            <p className="font-normal text-[11px] text-muted-foreground">
              &copy; {new Date().getFullYear()} Manoj Mukherjee. All rights reserved.
            </p>
            <p className="font-normal text-[9px] text-muted-foreground/60 leading-normal max-w-[60ch]">
              Engineered with extreme precision. Optimizing token efficiency, retrieval quality, and system latency budgets.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
