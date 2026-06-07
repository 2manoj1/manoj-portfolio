import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const spectrumBars = [
  { delay: "0ms", duration: "980ms", scale: 0.26 },
  { delay: "120ms", duration: "820ms", scale: 0.42 },
  { delay: "240ms", duration: "1160ms", scale: 0.18 },
  { delay: "60ms", duration: "920ms", scale: 0.58 },
  { delay: "180ms", duration: "1040ms", scale: 0.28 },
  { delay: "300ms", duration: "760ms", scale: 0.38 },
  { delay: "90ms", duration: "1080ms", scale: 0.22 },
  { delay: "220ms", duration: "880ms", scale: 0.5 },
  { delay: "30ms", duration: "1240ms", scale: 0.32 },
  { delay: "270ms", duration: "940ms", scale: 0.2 },
] as const;

function clampProgress(progress: number) {
  return Math.min(100, Math.max(0, progress));
}

export function AudioSpectrum({
  active,
  compact = false,
  className,
}: {
  active: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-end justify-center",
        compact ? "h-4 gap-1" : "h-6 gap-1 max-[420px]:gap-0.5 sm:gap-1.5",
        className,
      )}
    >
      {spectrumBars.map((bar, index) => (
        <span
          key={`${bar.delay}-${index}`}
          className={cn(
            "audio-spectrum-bar block w-[2px] rounded-full bg-amber shadow-[0_0_10px_rgba(245,158,11,0.28)]",
            compact ? "h-4" : "h-6",
            active && "is-active",
          )}
          style={
            {
              "--audio-delay": bar.delay,
              "--audio-duration": bar.duration,
              "--audio-scale": bar.scale,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function AudioProgressOrb({
  progress,
  active,
  paused,
  size = "md",
  className,
  children,
}: {
  progress: number;
  active: boolean;
  paused: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}) {
  const clampedProgress = clampProgress(progress);

  return (
    <span
      className={cn(
        "audio-progress-orb relative grid shrink-0 place-items-center rounded-full",
        size === "sm" && "size-8",
        size === "md" && "size-12",
        size === "lg" && "size-16",
        active && "is-active",
        paused && "is-paused",
        className,
      )}
      style={
        {
          "--audio-progress-angle": `${clampedProgress * 3.6}deg`,
        } as CSSProperties
      }
    >
      <span className="relative z-10 grid size-[calc(100%-8px)] place-items-center rounded-full border border-zinc-200/80 bg-white/90 text-amber shadow-inner dark:border-white/10 dark:bg-zinc-950/95">
        {children}
      </span>
    </span>
  );
}

export function AudioProgressRail({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  const clampedProgress = clampProgress(progress);

  return (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(clampedProgress)}
      aria-label="Playback timeline progress"
      className={cn(
        "audio-progress-rail relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/80 shadow-inner dark:bg-white/[0.08]",
        className,
      )}
      role="progressbar"
    >
      <span
        className="audio-progress-fill absolute inset-y-0 left-0 rounded-full bg-amber"
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}

export function AudioIconButton({
  label,
  active,
  prominent,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
  prominent?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      type="button"
      className={cn(
        "group relative grid size-9 shrink-0 place-items-center rounded-full border transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/55 active:scale-95 disabled:pointer-events-none disabled:opacity-35 max-[360px]:size-8",
        prominent
          ? "border-amber/40 bg-amber text-zinc-950 shadow-[0_12px_28px_rgba(245,158,11,0.26)] hover:bg-amber/90"
          : "border-zinc-200/80 bg-white/60 text-zinc-650 shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-amber/35 hover:bg-white hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-350 dark:shadow-black/25 dark:hover:bg-white/[0.08] dark:hover:text-white",
        active && !prominent && "border-amber/45 bg-amber/10 text-amber",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AudioMetric({
  label,
  value,
  className,
  children,
}: {
  label: string;
  value: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-full border border-zinc-200/75 bg-white/55 px-2.5 py-1.5 font-mono text-[9.5px] uppercase text-zinc-650 shadow-[0_6px_18px_rgba(0,0,0,0.035)] dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-350 sm:gap-2 sm:px-3 sm:text-[10px]",
        className,
      )}
    >
      {children}
      <span className="shrink-0 text-zinc-500 dark:text-zinc-500">{label}</span>
      <span className="min-w-0 truncate font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
    </span>
  );
}
