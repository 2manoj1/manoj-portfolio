"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Minimize2,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import {
  AudioIconButton,
  AudioMetric,
  AudioProgressOrb,
  AudioProgressRail,
  AudioSpectrum,
} from "@/components/marketing/audio-player-visuals";
import { useAudioPlayer } from "@/context/audio-player-context";
import { cn } from "@/lib/utils";

const springTransition = {
  type: "spring",
  stiffness: 280,
  damping: 30,
  mass: 0.8,
} as const;

export function GlobalAudioWidget() {
  const pathname = usePathname();
  const {
    supported,
    voices,
    selectedVoice,
    rate,
    isPlaying,
    isPaused,
    title,
    slug,
    paragraphs,
    currentIdx,
    currentSectionTitle,
    currentSegmentKind,
    showGlobalPlayer,
    pause,
    resume,
    stop,
    next,
    prev,
    setRate,
    setSelectedVoice,
  } = useAudioPlayer();

  const prefersReducedMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatState, setChatState] = useState({ open: false, expanded: false });

  useEffect(() => {
    const handleChatState = (event: Event) => {
      const customEvent = event as CustomEvent<{
        open: boolean;
        expanded: boolean;
      }>;

      if (customEvent.detail) {
        setChatState(customEvent.detail);
      }
    };

    window.addEventListener("astra-chat-state", handleChatState);
    window.dispatchEvent(new CustomEvent("astra-chat-request"));

    return () => {
      window.removeEventListener("astra-chat-state", handleChatState);
    };
  }, []);

  if (!supported || !showGlobalPlayer || !title || paragraphs.length === 0) {
    return null;
  }

  const isOnActiveArticlePage = slug ? pathname.endsWith(slug) : false;
  if (isOnActiveArticlePage) {
    return null;
  }

  const progressPercent =
    ((currentIdx + (isPlaying || isPaused ? 0.35 : 0)) / paragraphs.length) *
    100;
  const segmentLabel = `${currentIdx + 1} / ${paragraphs.length}`;
  const currentSectionLabel =
    currentSectionTitle ??
    (currentSegmentKind === "takeaway" ? "Why this matters" : "Article");
  const rateLabel = `${rate.toFixed(2)}x`;
  const PlayStateIcon = isPlaying ? Pause : Play;
  const canGoPrev = currentIdx > 0;
  const canGoNext = currentIdx < paragraphs.length - 1;

  const handlePlayToggle = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  let positionClasses =
    "bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] left-3 right-3 max-[360px]:left-2 max-[360px]:right-2 md:bottom-6";
  if (chatState.open) {
    positionClasses += chatState.expanded
      ? " md:left-6 md:right-auto"
      : " md:left-auto md:right-[480px]";
  } else {
    positionClasses += " md:left-auto md:right-36";
  }

  const motionInitial = prefersReducedMotion
    ? false
    : { opacity: 0, y: 14, scale: 0.98 };
  const motionExit = prefersReducedMotion
    ? undefined
    : { opacity: 0, y: 12, scale: 0.98 };

  return (
    <>
      <AnimatePresence initial={false}>
        {!isExpanded ? (
          <motion.div
            key="global-audio-mini"
            aria-label="Floating audio mini player"
            className={cn(
              "fixed z-[60] flex min-h-14 items-center gap-2 overflow-hidden rounded-[8px] border border-zinc-200/80 bg-white/78 p-2 text-zinc-900 shadow-[0_20px_55px_rgba(0,0,0,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/70 dark:text-zinc-100 dark:shadow-[0_22px_65px_rgba(0,0,0,0.48)] sm:min-h-16 sm:gap-3 sm:p-2.5 md:w-[min(calc(100vw-2rem),430px)]",
              positionClasses,
            )}
            initial={motionInitial}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={motionExit}
            transition={springTransition}
            role="region"
          >
            <button
              aria-label="Expand background audio player"
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/55"
              onClick={() => setIsExpanded(true)}
              title="Expand player"
              type="button"
            >
              <AudioProgressOrb
                active={isPlaying}
                paused={isPaused}
                progress={progressPercent}
                size="sm"
                className="max-[360px]:size-9"
              >
                <Volume2 className="size-4" aria-hidden="true" />
              </AudioProgressOrb>
            </button>

            <button
              aria-label="Expand background audio player panel"
              className="min-w-0 flex-1 cursor-pointer rounded-[6px] border-0 bg-transparent p-0 text-left text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/55"
              onClick={() => setIsExpanded(true)}
              title="Expand player"
              type="button"
            >
              <p className="truncate text-xs font-semibold tracking-tight sm:text-sm">
                {title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <AudioProgressRail progress={progressPercent} />
                <span className="shrink-0 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                  {segmentLabel}
                </span>
              </div>
            </button>

            <div className="flex items-center gap-1.5">
              <AudioIconButton
                className="max-[390px]:hidden"
                disabled={!canGoPrev}
                label="Previous segment"
                onClick={prev}
              >
                <SkipBack className="size-3.5" aria-hidden="true" />
              </AudioIconButton>
              <AudioIconButton
                className="max-[360px]:size-9"
                label={isPlaying ? "Pause reading" : "Resume reading"}
                onClick={handlePlayToggle}
                prominent
              >
                <PlayStateIcon className="size-4 fill-current" aria-hidden="true" />
              </AudioIconButton>
              <AudioIconButton
                className="max-[390px]:hidden"
                disabled={!canGoNext}
                label="Next segment"
                onClick={next}
              >
                <SkipForward className="size-3.5" aria-hidden="true" />
              </AudioIconButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="global-audio-expanded"
            aria-label="Floating audio full player"
            className={cn(
              "fixed z-[60] w-auto overflow-hidden rounded-[8px] border border-zinc-200/80 bg-white/78 p-3 text-zinc-900 shadow-[0_24px_70px_rgba(0,0,0,0.13)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/72 dark:text-zinc-100 dark:shadow-[0_24px_75px_rgba(0,0,0,0.52)] sm:p-4 md:w-[min(calc(100vw-2rem),390px)]",
              positionClasses,
            )}
            initial={motionInitial}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={motionExit}
            transition={springTransition}
            role="region"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(9,9,11,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.025)_1px,transparent_1px)] bg-[size:22px_22px] opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_92%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent" />

            <div className="relative z-10 grid gap-4">
              <header className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <AudioProgressOrb
                    active={isPlaying}
                    paused={isPaused}
                    progress={progressPercent}
                    size="md"
                    className="max-[360px]:size-12"
                  >
                    <Volume2 className="size-4.5" aria-hidden="true" />
                  </AudioProgressOrb>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase text-amber">
                      background stream
                    </p>
                    <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 tracking-tight text-zinc-950 dark:text-white">
                      {title}
                    </h4>
                    <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-zinc-500 dark:text-zinc-400 sm:hidden">
                      {currentSectionLabel}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <AudioIconButton
                    label="Minimize player"
                    onClick={() => {
                      setIsExpanded(false);
                      setIsSettingsOpen(false);
                    }}
                  >
                    <Minimize2 className="size-4" aria-hidden="true" />
                  </AudioIconButton>
                  <AudioIconButton label="Stop reading" onClick={stop}>
                    <X className="size-4" aria-hidden="true" />
                  </AudioIconButton>
                </div>
              </header>

              <div className="grid gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <AudioProgressRail progress={progressPercent} />
                  <span className="shrink-0 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                    {segmentLabel}
                  </span>
                </div>
                <div className="hidden border-y border-zinc-200/70 py-3 dark:border-white/10 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <AudioMetric
                      className="max-w-full"
                      label="section"
                      value={currentSectionLabel}
                    />
                  </div>
                  <AudioSpectrum
                    active={isPlaying}
                    compact
                    className="justify-start max-[420px]:hidden sm:justify-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AudioIconButton
                    disabled={!canGoPrev}
                    label="Previous segment"
                    onClick={prev}
                  >
                    <SkipBack className="size-4" aria-hidden="true" />
                  </AudioIconButton>
                  <AudioIconButton
                    className="size-12"
                    label={isPlaying ? "Pause reading" : "Resume reading"}
                    onClick={handlePlayToggle}
                    prominent
                  >
                    <PlayStateIcon className="size-5 fill-current" aria-hidden="true" />
                  </AudioIconButton>
                  <AudioIconButton
                    disabled={!canGoNext}
                    label="Next segment"
                    onClick={next}
                  >
                    <SkipForward className="size-4" aria-hidden="true" />
                  </AudioIconButton>
                </div>

                <AudioIconButton
                  active={isSettingsOpen}
                  aria-expanded={isSettingsOpen}
                  label="Voice and speed options"
                  onClick={() => setIsSettingsOpen((current) => !current)}
                >
                  <Settings className="size-4" aria-hidden="true" />
                </AudioIconButton>
              </div>

              <AnimatePresence initial={false}>
                {isSettingsOpen ? (
                  <motion.div
                    key="global-audio-settings"
                    className="grid gap-4 rounded-[8px] border border-zinc-200/80 bg-white/68 p-3.5 shadow-inner dark:border-white/10 dark:bg-black/22"
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, height: 0, y: -8 }
                    }
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: 0, height: 0, y: -8 }
                    }
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <label className="grid gap-2">
                      <span className="font-mono text-[10px] uppercase text-zinc-500 dark:text-zinc-400">
                        speed
                      </span>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0.8"
                          max="2.0"
                          step="0.05"
                          value={rate}
                          onChange={(event) => setRate(Number(event.target.value))}
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-amber dark:bg-white/[0.1]"
                        />
                        <span className="w-11 text-right font-mono text-xs text-amber">
                          {rateLabel}
                        </span>
                      </div>
                    </label>

                    {voices.length > 0 ? (
                      <label className="grid gap-2">
                        <span className="font-mono text-[10px] uppercase text-zinc-500 dark:text-zinc-400">
                          voice
                        </span>
                        <select
                          value={selectedVoice}
                          onChange={(event) => setSelectedVoice(event.target.value)}
                          className="h-10 w-full rounded-[8px] border border-zinc-200 bg-white/85 px-3 font-mono text-xs text-zinc-800 outline-none transition focus:border-amber/55 focus:ring-2 focus:ring-amber/15 dark:border-white/10 dark:bg-zinc-950/90 dark:text-zinc-200"
                        >
                          {voices.map((voice) => (
                            <option
                              key={voice.name}
                              value={voice.name}
                              className="text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                            >
                              {voice.name.replace(/Microsoft|Google|Apple/g, "").trim()} ({voice.lang.split("-")[0]})
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
