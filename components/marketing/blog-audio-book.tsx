"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Gauge,
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
import {
  useAudioPlayer,
  type SpeechInputSegment,
} from "@/context/audio-player-context";
import { cn } from "@/lib/utils";

interface BlogAudioBookProps {
  paragraphs: SpeechInputSegment[];
  title: string;
  slug: string;
  onParagraphChange?: (index: number | null) => void;
}

const springTransition = {
  type: "spring",
  stiffness: 280,
  damping: 30,
  mass: 0.8,
} as const;

export function BlogAudioBook({
  paragraphs,
  title,
  slug,
  onParagraphChange,
}: BlogAudioBookProps) {
  const {
    supported,
    voices,
    selectedVoice,
    rate,
    isPlaying: globalIsPlaying,
    isPaused: globalIsPaused,
    slug: activeSlug,
    currentIdx,
    currentSourceIndex,
    currentSectionTitle,
    currentSegmentKind,
    play,
    pause,
    resume,
    stop,
    jumpToParagraph,
    setRate,
    setSelectedVoice,
  } = useAudioPlayer();

  const prefersReducedMotion = useReducedMotion();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatState, setChatState] = useState({ open: false, expanded: false });

  const isActiveTrack = activeSlug === slug;
  const isPlaying = isActiveTrack && globalIsPlaying;
  const isPaused = isActiveTrack && globalIsPaused;
  const activeIdx = isActiveTrack ? currentIdx : 0;
  const totalSegments = Math.max(paragraphs.length, 1);
  const currentSegment = paragraphs.length
    ? Math.min(activeIdx + 1, paragraphs.length)
    : 0;
  const progressPercent = paragraphs.length
    ? ((activeIdx + (isPlaying || isPaused ? 0.35 : 0)) / paragraphs.length) *
      100
    : 0;
  const segmentLabel = `${currentSegment} / ${paragraphs.length}`;
  const currentSectionLabel =
    isActiveTrack && currentSectionTitle
      ? currentSectionTitle
      : isActiveTrack && currentSegmentKind === "takeaway"
        ? "Why this matters"
        : "Ready";
  const PlayStateIcon = isPlaying ? Pause : Play;
  const canGoPrev = isActiveTrack && currentIdx > 0;
  const canGoNext = isActiveTrack && currentIdx < paragraphs.length - 1;

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

  useEffect(() => {
    onParagraphChange?.(isActiveTrack ? currentSourceIndex : null);
  }, [isActiveTrack, currentSourceIndex, onParagraphChange]);

  if (!supported) {
    return null;
  }

  const handlePlayToggle = () => {
    if (isActiveTrack) {
      if (isPaused) {
        resume();
      } else if (isPlaying) {
        pause();
      } else {
        play(title, paragraphs, slug, activeIdx);
      }
    } else {
      play(title, paragraphs, slug, 0);
    }
  };

  const handleNext = () => {
    if (isActiveTrack && currentIdx + 1 < paragraphs.length) {
      jumpToParagraph(currentIdx + 1);
      return;
    }

    if (!isActiveTrack && paragraphs.length > 1) {
      play(title, paragraphs, slug, 1);
    }
  };

  const handlePrev = () => {
    if (isActiveTrack && currentIdx > 0) {
      jumpToParagraph(currentIdx - 1);
      return;
    }

    if (!isActiveTrack) {
      play(title, paragraphs, slug, 0);
    }
  };

  let floatingPositionClasses = "bottom-[5.5rem] left-4 right-4 md:bottom-6";
  if (chatState.open) {
    floatingPositionClasses += chatState.expanded
      ? " md:left-6 md:right-auto"
      : " md:left-auto md:right-[480px]";
  } else {
    floatingPositionClasses += " md:left-auto md:right-36";
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
        {isMinimized ? (
          <motion.div
            key="article-audio-mini"
            aria-label="Floating audio mini player"
            className={cn(
              "fixed z-[60] flex min-h-16 items-center gap-3 overflow-hidden rounded-[8px] border border-zinc-200/80 bg-white/78 p-2.5 text-zinc-900 shadow-[0_20px_55px_rgba(0,0,0,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/70 dark:text-zinc-100 dark:shadow-[0_22px_65px_rgba(0,0,0,0.48)] md:w-[min(calc(100vw-2rem),430px)]",
              floatingPositionClasses,
            )}
            initial={motionInitial}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={motionExit}
            transition={springTransition}
            role="region"
          >
            <button
              aria-label="Restore article audio player"
              className="group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/55"
              onClick={() => setIsMinimized(false)}
              title="Restore player"
              type="button"
            >
              <AudioProgressOrb
                active={isPlaying}
                paused={isPaused}
                progress={progressPercent}
                size="sm"
              >
                <Volume2 className="size-4" aria-hidden="true" />
              </AudioProgressOrb>
            </button>

            <button
              aria-label="Restore article audio player panel"
              className="min-w-0 flex-1 cursor-pointer rounded-[6px] border-0 bg-transparent p-0 text-left text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/55"
              onClick={() => setIsMinimized(false)}
              title="Restore player"
              type="button"
            >
              <p className="truncate text-sm font-semibold tracking-tight">
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
                disabled={isActiveTrack && currentIdx <= 0}
                label="Previous segment"
                onClick={handlePrev}
              >
                <SkipBack className="size-3.5" aria-hidden="true" />
              </AudioIconButton>
              <AudioIconButton
                label={isPlaying ? "Pause reading" : "Play reading"}
                onClick={handlePlayToggle}
                prominent
              >
                <PlayStateIcon className="size-4 fill-current" aria-hidden="true" />
              </AudioIconButton>
              <AudioIconButton
                disabled={isActiveTrack && currentIdx >= paragraphs.length - 1}
                label="Next segment"
                onClick={handleNext}
              >
                <SkipForward className="size-3.5" aria-hidden="true" />
              </AudioIconButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!isMinimized ? (
          <motion.section
            key="article-audio-docked"
            aria-label="Article audio player"
            className="relative mt-5 overflow-hidden rounded-[8px] border border-zinc-200/80 bg-white/72 p-4 text-zinc-900 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/62 dark:text-zinc-100 dark:shadow-[0_24px_75px_rgba(0,0,0,0.46)] sm:p-5"
            initial={motionInitial}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={motionExit}
            transition={springTransition}
            role="region"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(9,9,11,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.025)_1px,transparent_1px)] bg-[size:24px_24px] opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_92%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent" />

            <div className="relative z-10 grid gap-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <AudioProgressOrb
                    active={isPlaying}
                    paused={isPaused}
                    progress={progressPercent}
                    size="lg"
                  >
                    <Volume2 className="size-5" aria-hidden="true" />
                  </AudioProgressOrb>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase text-amber">
                      {isPlaying
                        ? "stream active"
                        : isPaused
                          ? "stream held"
                          : "audio gateway"}
                    </p>
                    <h4 className="mt-1 truncate text-base font-semibold leading-6 tracking-tight text-zinc-950 dark:text-white">
                      {title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <AudioSpectrum active={isPlaying} />
                  <AudioIconButton
                    label="Minimize player"
                    onClick={() => {
                      setIsMinimized(true);
                      setIsSettingsOpen(false);
                    }}
                  >
                    <Minimize2 className="size-4" aria-hidden="true" />
                  </AudioIconButton>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <AudioMetric
                    className="max-w-full sm:max-w-[280px]"
                    label="section"
                    value={currentSectionLabel}
                  />
                  <AudioMetric label="segment" value={segmentLabel} />
                  <AudioMetric label="rate" value={`${rate.toFixed(1)}x`}>
                    <Gauge className="size-3.5 text-amber" aria-hidden="true" />
                  </AudioMetric>
                  <AudioMetric
                    label="queue"
                    value={`${Math.max(totalSegments - currentSegment, 0)} left`}
                  />
                </div>
                <AudioProgressRail progress={progressPercent} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AudioIconButton
                    disabled={!canGoPrev}
                    label="Previous segment"
                    onClick={handlePrev}
                  >
                    <SkipBack className="size-4" aria-hidden="true" />
                  </AudioIconButton>
                  <AudioIconButton
                    className="size-12"
                    label={isPlaying ? "Pause reading" : "Play reading"}
                    onClick={handlePlayToggle}
                    prominent
                  >
                    <PlayStateIcon className="size-5 fill-current" aria-hidden="true" />
                  </AudioIconButton>
                  <AudioIconButton
                    disabled={!canGoNext}
                    label="Next segment"
                    onClick={handleNext}
                  >
                    <SkipForward className="size-4" aria-hidden="true" />
                  </AudioIconButton>
                </div>

                <div className="flex items-center gap-2">
                  <AudioIconButton
                    active={isSettingsOpen}
                    aria-expanded={isSettingsOpen}
                    label="Voice and speed options"
                    onClick={() => setIsSettingsOpen((current) => !current)}
                  >
                    <Settings className="size-4" aria-hidden="true" />
                  </AudioIconButton>
                  {isActiveTrack ? (
                    <AudioIconButton label="Stop reading" onClick={stop}>
                      <X className="size-4" aria-hidden="true" />
                    </AudioIconButton>
                  ) : null}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isSettingsOpen ? (
                  <motion.div
                    key="article-audio-settings"
                    className="grid gap-4 rounded-[8px] border border-zinc-200/80 bg-white/68 p-4 shadow-inner dark:border-white/10 dark:bg-black/22 sm:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]"
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
                          step="0.1"
                          value={rate}
                          onChange={(event) => setRate(Number(event.target.value))}
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-amber dark:bg-white/[0.1]"
                        />
                        <span className="w-11 text-right font-mono text-xs text-amber">
                          {rate.toFixed(1)}x
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
                              {voice.name.replace(/Microsoft|Google|Apple/g, "").trim()} ({voice.lang})
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
