"use client";

import { useScrollReveal } from "@/components/ui/scroll-reveal";
import { Calendar, PenLine } from "lucide-react";
import { CALENDLY, LINKEDIN, MEDIUM, EMAIL } from "@/lib/links";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Connect() {
  const ref = useScrollReveal();

  return (
    <section id="connect" className="py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="reveal">
            <span className="font-mono text-xs uppercase tracking-wide text-amber sm:text-sm">
              Let&apos;s Connect
            </span>
          </div>
          <h2 className="mx-auto mt-4 max-w-[20ch] font-display text-balance text-4xl font-normal leading-[1.1] tracking-tight text-foreground reveal md:text-5xl">
            Ready to architect the next generation of operational intelligence.
          </h2>
          <p className="mx-auto mt-6 max-w-[48ch] text-pretty text-base leading-relaxed text-muted-foreground reveal">
            If you&apos;re building platforms where AI is the
            foundation, not an afterthought. Let&apos;s connect. I
            help CTOs and engineering leaders design systems that scale minds,
            not just code.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 reveal sm:flex-row sm:justify-center">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-5 py-2.5 text-sm font-medium text-amber-foreground hover:brightness-110 active:scale-[0.97] sm:w-auto"
            >
              <Calendar className="size-4 shrink-0" />
              Schedule a Conversation
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary active:scale-[0.97] sm:w-auto"
            >
              <LinkedInIcon className="size-4 shrink-0" />
              Connect on LinkedIn
            </a>
            <a
              href={MEDIUM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary active:scale-[0.97] sm:w-auto"
            >
              <PenLine className="size-4 shrink-0" />
              Read My Writing
            </a>
          </div>

          <div className="mt-8 reveal">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(EMAIL);
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {EMAIL}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
