import Image from "next/image";
import { ArrowUpRight, BookOpenCheck, BadgeCheck } from "lucide-react";
import { aiCredentials, currentLearning } from "@/content/site";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Section, SectionHeader } from "@/components/marketing/section";

export function AiCredentialsSection({ compact = false }: { compact?: boolean }) {
  return (
    <Section className="border-y border-border bg-secondary/20">
      <MotionReveal>
        <SectionHeader
          kicker="Verified Credentials"
          title="Cloud AI knowledge, independently verifiable."
          description="AWS certification and partner training complement hands-on enterprise AI architecture work. Each issued credential links directly to its public verification record."
        />
      </MotionReveal>
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {aiCredentials.map((credential, index) => (
          <MotionReveal key={credential.title} delay={index * 0.04}>
            <a
              href={credential.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid h-full gap-5 rounded-lg border border-border/85 bg-background p-5 transition-colors hover:border-amber/45 sm:grid-cols-[7rem_1fr] sm:items-center"
              aria-label={`Verify ${credential.title} on Credly`}
            >
              <div className="flex min-h-28 items-center justify-center rounded-md border border-border bg-white p-3">
                <Image
                  src={credential.image}
                  alt={credential.alt}
                  width={112}
                  height={112}
                  className="h-24 w-24 object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-amber">
                  <BadgeCheck className="size-3.5" />
                  {credential.status} · {credential.date}
                </div>
                <h3 className="mt-2 flex items-start justify-between gap-3 text-base font-medium text-foreground">
                  {credential.title}
                  <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-amber" />
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {credential.issuer}
                </p>
                {!compact && (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {credential.description}
                  </p>
                )}
              </div>
            </a>
          </MotionReveal>
        ))}
      </div>
      <MotionReveal delay={0.08}>
        <div className="mt-4 flex gap-4 rounded-lg border border-dashed border-border bg-background/60 p-5">
          <BookOpenCheck className="mt-0.5 size-5 shrink-0 text-amber" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Continuing education · {currentLearning.status}
            </p>
            <h3 className="mt-1 text-sm font-medium text-foreground">
              {currentLearning.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {currentLearning.provider}. {currentLearning.description}
            </p>
          </div>
        </div>
      </MotionReveal>
    </Section>
  );
}
