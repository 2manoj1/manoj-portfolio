"use client";

import React, { useEffect, useState } from "react";
import {
  Gauge,
  Maximize2,
  Minimize2,
  Music,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/context/audio-player-context";

interface BlogAudioBookProps {
  paragraphs: string[];
  title: string;
  slug: string;
  onParagraphChange?: (index: number | null) => void;
}

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
    play,
    pause,
    resume,
    stop,
    jumpToParagraph,
    setRate,
    setSelectedVoice,
  } = useAudioPlayer();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatState, setChatState] = useState({ open: false, expanded: false });

  const isActiveTrack = activeSlug === slug;
  const isPlaying = isActiveTrack && globalIsPlaying;
  const isPaused = isActiveTrack && globalIsPaused;
  const activeIdx = isActiveTrack ? currentIdx : 0;

  // Listen for chatbot status changes to position the minimized floating pill correctly
  useEffect(() => {
    const handleChatState = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean; expanded: boolean }>;
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

  // Sync index change to parent reader
  useEffect(() => {
    if (isActiveTrack) {
      onParagraphChange?.(currentIdx);
    } else {
      onParagraphChange?.(null);
    }
  }, [isActiveTrack, currentIdx, onParagraphChange]);

  if (!supported) return null;

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
    if (isActiveTrack) {
      if (currentIdx + 1 < paragraphs.length) {
        jumpToParagraph(currentIdx + 1);
      }
    } else {
      play(title, paragraphs, slug, 1);
    }
  };

  const handlePrev = () => {
    if (isActiveTrack) {
      if (currentIdx - 1 >= 0) {
        jumpToParagraph(currentIdx - 1);
      }
    } else {
      play(title, paragraphs, slug, 0);
    }
  };

  const progressPercent =
    paragraphs.length > 0
      ? ((activeIdx + (isPlaying || isPaused ? 0.35 : 0)) / paragraphs.length) * 100
      : 0;

  const segmentLabel = `${Math.min(activeIdx + 1, paragraphs.length)} / ${paragraphs.length}`;
  const PlayStateIcon = isPlaying ? Pause : Play;

  // 12-bar equalizer properties for organic bounce
  const visualizerBars = [
    { delay: "0ms", duration: "1.0s", inactiveScale: 0.2 },
    { delay: "150ms", duration: "0.8s", inactiveScale: 0.3 },
    { delay: "300ms", duration: "1.2s", inactiveScale: 0.15 },
    { delay: "50ms", duration: "0.9s", inactiveScale: 0.4 },
    { delay: "200ms", duration: "1.1s", inactiveScale: 0.25 },
    { delay: "100ms", duration: "0.7s", inactiveScale: 0.3 },
    { delay: "250ms", duration: "1.0s", inactiveScale: 0.2 },
    { delay: "0ms", duration: "0.8s", inactiveScale: 0.45 },
    { delay: "350ms", duration: "1.3s", inactiveScale: 0.15 },
    { delay: "150ms", duration: "0.9s", inactiveScale: 0.3 },
    { delay: "200ms", duration: "1.1s", inactiveScale: 0.25 },
    { delay: "100ms", duration: "0.7s", inactiveScale: 0.2 },
  ];

  // Dynamic positioning for the floating minimized pill based on chatbot state
  let floatingPositionClasses = "bottom-22 left-4 right-4 md:bottom-6";
  if (chatState.open) {
    if (chatState.expanded) {
      floatingPositionClasses += " md:left-6 md:right-auto";
    } else {
      floatingPositionClasses += " md:left-auto md:right-[480px]";
    }
  } else {
    floatingPositionClasses += " md:left-auto md:right-36";
  }

  return (
    <>
      {/* Hardware-accelerated keyframe animations for the equalizer visualizer */}
      <style>{`
        @keyframes soundWave {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1.0); }
        }
        .sound-bar-animate {
          transform-origin: bottom;
          animation: soundWave 1.0s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Minimized View: Floating Glass Pill (rendered conditionally with smooth CSS transitions) */}
      <div
        aria-label="Floating audio mini player"
        className={cn(
          "fixed z-[60] flex items-center gap-3 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 p-2 shadow-[0_12px_36px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 ease-out transform text-zinc-850 dark:text-zinc-200",
          floatingPositionClasses,
          isMinimized
            ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
            : "opacity-0 scale-95 pointer-events-none translate-y-4"
        )}
        role="region"
      >
        {/* Reflection border */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 dark:via-zinc-700/20 to-transparent" />

        {/* Small visualizer button */}
        <button
          onClick={() => setIsMinimized(false)}
          className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 dark:border-white/15 bg-zinc-100/50 dark:bg-white/[0.04] text-amber shadow-inner transition hover:scale-105"
          title="Restore Player"
          type="button"
        >
          <Music className={cn("size-4", isPlaying && "animate-[bounce_2s_infinite]")} />
          {isPlaying && (
            <span className="absolute inset-0.5 rounded-full border border-dashed border-amber/30 animate-[spin_12s_linear_infinite]" />
          )}
        </button>

        {/* Title details */}
        <div 
          onClick={() => setIsMinimized(false)}
          className="min-w-0 max-w-[100px] md:max-w-[160px] cursor-pointer"
        >
          <p className="truncate text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </p>
          <p className="mt-0.5 font-mono text-[9px] text-zinc-500 dark:text-zinc-400">
            Seg {segmentLabel} · {rate}x
          </p>
        </div>

        {/* Mini controls with Previous and Next Skip buttons */}
        <div className="flex items-center gap-1 pr-1.5">
          {/* Skip Back */}
          <button
            aria-label="Previous segment"
            onClick={handlePrev}
            disabled={isActiveTrack && currentIdx <= 0}
            className="flex size-7 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-150 disabled:opacity-35 transition"
            title="Previous Segment"
            type="button"
          >
            <SkipBack className="size-3" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayToggle}
            className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-amber to-amber-600 text-zinc-950 shadow-[0_2px_8px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 transition"
            type="button"
          >
            <PlayStateIcon className="size-3.5 fill-current" />
          </button>

          {/* Skip Next */}
          <button
            aria-label="Next segment"
            onClick={handleNext}
            disabled={isActiveTrack && currentIdx >= paragraphs.length - 1}
            className="flex size-7 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-150 disabled:opacity-35 transition"
            title="Next Segment"
            type="button"
          >
            <SkipForward className="size-3" />
          </button>

          <div className="h-4 w-px bg-zinc-250 dark:bg-white/10 mx-1" />

          {/* Expand */}
          <button
            onClick={() => setIsMinimized(false)}
            className="flex size-7 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-150 transition"
            title="Expand Controls"
            type="button"
          >
            <Maximize2 className="size-3" />
          </button>

          {/* Stop / Close */}
          <button
            onClick={stop}
            className="flex size-7 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 hover:text-rose-500 transition"
            title="Stop Reading"
            type="button"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>

      {/* 2. Maximized View: Full Docked Card (rendered inline with layout-preserving height collapses) */}
      <div
        aria-label="Article audio player"
        className={cn(
          "relative w-full rounded-2xl border border-zinc-200/80 dark:border-white/5 bg-gradient-to-b from-white/60 to-white/30 dark:from-zinc-900/50 dark:to-zinc-950/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl text-zinc-850 dark:text-zinc-200 transition-all duration-300 ease-out transform",
          isMinimized
            ? "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden p-0 mt-0 border-0"
            : "opacity-100 scale-100 pointer-events-auto mt-5"
        )}
        role="region"
      >
        {/* Glossy top edge highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 dark:via-zinc-700/25 to-transparent" />
        
        {/* Background glowing energy node */}
        <div className="pointer-events-none absolute -left-24 -top-24 size-48 bg-[radial-gradient(circle,rgba(245,158,11,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.08)_0%,transparent_70%)] blur-2xl rounded-full" />
        
        {/* Tech grid background overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Header Console */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3.5">
              {/* Spinning Fusion Core / CD Artwork */}
              <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-250 dark:border-white/10 bg-zinc-100/60 dark:bg-white/[0.04] text-amber shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-transparent" />
                <Volume2 className={cn("relative z-10 size-5.5 transition-transform duration-300", isPlaying && "scale-110")} />
                
                {/* Rotating radar graphic */}
                <div className={cn(
                  "absolute inset-1 rounded-full border border-dashed border-amber/25 transition-transform",
                  isPlaying ? "animate-[spin_8s_linear_infinite]" : "rotate-45"
                )} />
                <div className={cn(
                  "absolute inset-3 rounded-full border border-amber/10 transition-transform",
                  isPlaying ? "animate-[spin_4s_linear_infinite_reverse]" : ""
                )} />
              </div>
              
              <div className="min-w-0">
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber dark:text-amber/90 font-bold flex items-center gap-1.5">
                  <span className={cn("size-1.5 rounded-full bg-amber", isPlaying && "animate-ping")} />
                  {isActiveTrack && isPlaying ? "SYS AUDIOSTREAM ACTIVE" : "SYS AUDIO GATEWAY"}
                </span>
                <h4 className="mt-1.5 truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-base">
                  {title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Holographic Status Badge */}
              <span
                aria-live="polite"
                className={cn(
                  "hidden items-center gap-2 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-wider transition-all duration-300 sm:inline-flex",
                  isPlaying
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                    : isPaused
                    ? "border-amber/30 bg-amber/10 text-amber shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                    : "border-zinc-250 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400"
                )}
              >
                <span className={cn("size-1.5 rounded-full", isPlaying ? "bg-emerald-500 animate-pulse" : isPaused ? "bg-amber" : "bg-zinc-400 dark:bg-zinc-650")} />
                {isPlaying ? "STREAMING" : isPaused ? "PAUSED" : "STANDBY"}
              </span>

              {/* Minimize trigger */}
              <button
                onClick={() => setIsMinimized(true)}
                className="flex size-8 items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 bg-white/30 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 hover:text-amber dark:hover:text-amber hover:scale-105 transition"
                title="Minimize to Floating Pill"
                type="button"
              >
                <Minimize2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Dashboard parameters */}
          <div className="flex items-center justify-between gap-4 border-y border-zinc-200/50 dark:border-white/5 py-3">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/30 dark:bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] font-medium text-zinc-700 dark:text-zinc-300 font-semibold">
                SEGMENT: {segmentLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/30 dark:bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] font-medium text-zinc-700 dark:text-zinc-300 font-semibold">
                <Gauge className="size-3.5 text-amber" />
                {rate}X RATE
              </span>
            </div>

            {/* Bouncing visualizer bars with scaleY transformation */}
            <div className="flex h-5 shrink-0 items-end gap-0.75 pr-1">
              {visualizerBars.map((bar, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-[2px] h-5 rounded-t bg-gradient-to-t from-amber to-amber/90 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
                    isPlaying ? "sound-bar-animate" : ""
                  )}
                  style={{
                    animationDelay: bar.delay,
                    animationDuration: bar.duration,
                    transform: isPlaying ? undefined : `scaleY(${bar.inactiveScale})`,
                    transformOrigin: "bottom",
                    transition: "transform 0.3s ease-out",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Glossy seek timeline */}
          <div className="space-y-1">
            <div
              aria-label="Playback timeline progress"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={Math.round(progressPercent)}
              className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.07] shadow-inner"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber via-amber-500/90 to-amber/80 shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-all duration-300"
                style={{ width: `${progressPercent || (isPlaying ? 3 : 0)}%` }}
              />
            </div>
          </div>

          {/* Polished Glass Deck Controller */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              {/* Prev Segment button */}
              <button
                aria-label="Previous segment"
                onClick={handlePrev}
                disabled={isActiveTrack && currentIdx <= 0}
                className="flex size-9 items-center justify-center rounded-xl border border-zinc-250 dark:border-white/10 bg-white/30 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-455 transition hover:bg-white/50 dark:hover:bg-white/[0.07] hover:text-zinc-900 dark:hover:text-zinc-100 hover:scale-105 active:scale-95 disabled:opacity-35 disabled:hover:scale-100 disabled:hover:bg-white/30 disabled:hover:text-zinc-600 sm:size-10"
                title="Previous Segment"
                type="button"
              >
                <SkipBack className="size-4.5" />
              </button>

              {/* Glowing Core Play/Pause Trigger */}
              <button
                aria-label={PlayStateIcon === Play ? "Play reading" : "Pause reading"}
                onClick={handlePlayToggle}
                className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-amber to-amber-600 text-zinc-950 shadow-[0_6px_20px_rgba(245,158,11,0.35)] hover:scale-105 hover:shadow-[0_6px_24_rgba(245,158,11,0.45)] active:scale-95 transition-all sm:size-10.5"
                type="button"
              >
                <PlayStateIcon className="size-4.5 fill-current" />
              </button>

              {/* Next Segment button */}
              <button
                aria-label="Next segment"
                onClick={handleNext}
                disabled={isActiveTrack && currentIdx >= paragraphs.length - 1}
                className="flex size-9 items-center justify-center rounded-xl border border-zinc-250 dark:border-white/10 bg-white/30 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-455 transition hover:bg-white/50 dark:hover:bg-white/[0.07] hover:text-zinc-900 dark:hover:text-zinc-100 hover:scale-105 active:scale-95 disabled:opacity-35 disabled:hover:scale-100 disabled:hover:bg-white/30 disabled:hover:text-zinc-600 sm:size-10"
                title="Next Segment"
                type="button"
              >
                <SkipForward className="size-4.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Technical settings toggle */}
              <button
                aria-label="Voice options console"
                aria-expanded={isSettingsOpen}
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl border transition-all sm:size-10",
                  isSettingsOpen
                    ? "border-amber/50 bg-white/50 dark:bg-white/[0.09] text-amber shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
                    : "border-zinc-250 dark:border-white/10 bg-white/30 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-455 hover:bg-white/50 dark:hover:bg-white/[0.07] hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
                title="Console Options"
                type="button"
              >
                <Settings className="size-4.5" />
              </button>
            </div>
          </div>

          {/* Dropdown settings console */}
          {isSettingsOpen && (
            <div className="mt-2 space-y-3.5 rounded-xl border border-zinc-200/50 dark:border-white/5 bg-zinc-100/60 dark:bg-[#09090b]/40 p-4 shadow-inner backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Speed slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-bold">
                  <span>SPEED READOUT</span>
                  <span className="text-amber">{rate}X</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-white/[0.08] accent-amber"
                />
              </div>

              {/* Voice select */}
              {voices.length > 0 && (
                <div className="space-y-2">
                  <label
                    className="block font-mono text-[9px] uppercase tracking-wider text-zinc-650 dark:text-zinc-400 font-bold"
                    htmlFor="docked-audio-voice"
                  >
                    SPEECH ENGINE VOICE
                  </label>
                  <select
                    id="docked-audio-voice"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200/60 dark:border-white/10 bg-white/70 dark:bg-[#09090b]/80 px-3 py-2 font-mono text-[10px] text-zinc-800 dark:text-zinc-250 focus:border-amber/40 focus:ring-1 focus:ring-amber/25 outline-none transition-all"
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name} className="dark:bg-[#111] text-zinc-800 dark:text-zinc-250">
                        {v.name.replace(/Microsoft|Google|Apple/g, "").trim()} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
