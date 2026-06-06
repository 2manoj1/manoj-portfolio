"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/context/audio-player-context";

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
    showGlobalPlayer,
    pause,
    resume,
    stop,
    next,
    prev,
    setRate,
    setSelectedVoice,
  } = useAudioPlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatState, setChatState] = useState({ open: false, expanded: false });

  // Listen for chatbot status changes to position the widget correctly
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

  // If player isn't supported, has no content, or is disabled, hide it
  if (!supported || !showGlobalPlayer || !title || paragraphs.length === 0) {
    return null;
  }

  // Hide the floating player if the user is on the article page where the docked player exists
  const isOnActiveArticlePage = slug ? pathname.endsWith(slug) : false;
  if (isOnActiveArticlePage) {
    return null;
  }

  const progressPercent =
    paragraphs.length > 0
      ? ((currentIdx + (isPlaying || isPaused ? 0.35 : 0)) / paragraphs.length) * 100
      : 0;

  const segmentLabel = `${currentIdx + 1} / ${paragraphs.length}`;
  const PlayStateIcon = isPlaying ? Pause : Play;

  const handlePlayToggle = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < paragraphs.length) {
      next();
    }
  };

  const handlePrev = () => {
    if (currentIdx - 1 >= 0) {
      prev();
    }
  };

  // Dynamic positioning for the floating pill and expanded card based on chatbot state
  let positionClasses = "bottom-22 left-4 right-4 md:bottom-6";
  if (chatState.open) {
    if (chatState.expanded) {
      positionClasses += " md:left-6 md:right-auto";
    } else {
      positionClasses += " md:left-auto md:right-[480px]";
    }
  } else {
    positionClasses += " md:left-auto md:right-36";
  }

  const visualizerBars = [
    { delay: "0ms", duration: "1.0s", inactiveScale: 0.25 },
    { delay: "150ms", duration: "0.8s", inactiveScale: 0.35 },
    { delay: "300ms", duration: "1.2s", inactiveScale: 0.15 },
    { delay: "50ms", duration: "0.9s", inactiveScale: 0.4 },
    { delay: "200ms", duration: "1.1s", inactiveScale: 0.2 },
    { delay: "100ms", duration: "0.7s", inactiveScale: 0.3 },
  ];

  return (
    <>
      {/* Hardware-accelerated equalizer keyframe animations */}
      <style>{`
        @keyframesSoundWaveGlobal {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1.0); }
        }
        .global-sound-bar-animate {
          transform-origin: bottom;
          animation: @keyframesSoundWaveGlobal 1.0s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Minimized State: Floating Capsule Pill */}
      <div
        aria-label="Floating audio mini player"
        className={cn(
          "fixed z-[60] flex items-center gap-3 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 p-2 shadow-[0_12px_36px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 ease-out transform text-zinc-850 dark:text-zinc-200",
          positionClasses,
          isExpanded
            ? "opacity-0 scale-95 pointer-events-none translate-y-4"
            : "opacity-100 scale-100 pointer-events-auto translate-y-0"
        )}
        role="region"
      >
        {/* Reflection border */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 dark:via-zinc-700/20 to-transparent" />

        {/* Small visualizer logo */}
        <button
          onClick={() => setIsExpanded(true)}
          className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 dark:border-white/15 bg-zinc-100/50 dark:bg-white/[0.04] text-amber shadow-inner transition hover:scale-105"
          title="Expand Player"
          type="button"
        >
          <Music className={cn("size-4", isPlaying && "animate-[bounce_2s_infinite]")} />
          {isPlaying && (
            <span className="absolute inset-0.5 rounded-full border border-dashed border-amber/30 animate-[spin_12s_linear_infinite]" />
          )}
        </button>

        {/* Title details */}
        <div 
          onClick={() => setIsExpanded(true)}
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
            disabled={currentIdx <= 0}
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
            disabled={currentIdx >= paragraphs.length - 1}
            className="flex size-7 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-150 disabled:opacity-35 transition"
            title="Next Segment"
            type="button"
          >
            <SkipForward className="size-3" />
          </button>

          <div className="h-4 w-px bg-zinc-250 dark:bg-white/10 mx-1" />

          {/* Expand */}
          <button
            onClick={() => setIsExpanded(true)}
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
            title="Stop & Close"
            type="button"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>

      {/* 2. Maximized State: Floating Glass Card */}
      <div
        aria-label="Floating audio full player"
        className={cn(
          "fixed z-[60] w-[340px] overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/5 bg-gradient-to-b from-white/70 to-white/40 dark:from-zinc-900/50 dark:to-zinc-950/30 p-4 shadow-[0_16px_44px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_44px_rgba(0,0,0,0.5)] backdrop-blur-xl text-zinc-850 dark:text-zinc-200 transition-all duration-300 ease-out transform",
          positionClasses,
          isExpanded
            ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
            : "opacity-0 scale-95 pointer-events-none translate-y-4"
        )}
        role="region"
      >
        {/* Reflection highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 dark:via-zinc-700/20 to-transparent" />
        
        {/* Glow effect */}
        <div className="pointer-events-none absolute -left-20 -top-20 size-36 bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.05)_0%,transparent_70%)] blur-2xl rounded-full" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber dark:text-amber/90 font-bold">
                STREAMING IN BACKGROUND
              </span>
              <h4 className="mt-1 text-sm font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100">
                {title}
              </h4>
            </div>
            <div className="flex items-center gap-1">
              {/* Collapse */}
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setIsSettingsOpen(false);
                }}
                className="flex size-7 items-center justify-center rounded-lg border border-zinc-250 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-150 transition"
                title="Minimize"
                type="button"
              >
                <Minimize2 className="size-3.5" />
              </button>
              {/* Stop */}
              <button
                onClick={stop}
                className="flex size-7 items-center justify-center rounded-lg border border-zinc-250 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-650 dark:text-zinc-450 hover:text-rose-500 transition"
                title="Close Player"
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Param meters */}
          <div className="flex items-center justify-between gap-4 border-y border-zinc-200/50 dark:border-white/5 py-2 font-mono text-[9px] text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold uppercase">
              SEGMENT: {segmentLabel}
            </span>
            
            {/* Animated scaleY equalizer bars */}
            <div className="flex h-3.5 shrink-0 items-end gap-0.75 pr-1">
              {visualizerBars.map((bar, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-[2px] h-3.5 rounded-t bg-gradient-to-t from-amber to-amber/90 shadow-[0_0_4px_rgba(245,158,11,0.3)]",
                    isPlaying ? "global-sound-bar-animate" : ""
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

          {/* Seek Progress */}
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-amber transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Control deck */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Prev */}
              <button
                aria-label="Previous"
                onClick={handlePrev}
                disabled={currentIdx <= 0}
                className="flex size-9 items-center justify-center rounded-xl border border-zinc-250 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-35 transition hover:scale-105 active:scale-95"
                type="button"
              >
                <SkipBack className="size-4" />
              </button>

              {/* Play/Pause */}
              <button
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={handlePlayToggle}
                className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-amber to-amber-600 text-zinc-950 shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 transition"
                type="button"
              >
                <PlayStateIcon className="size-4 fill-current" />
              </button>

              {/* Next */}
              <button
                aria-label="Next"
                onClick={handleNext}
                disabled={currentIdx >= paragraphs.length - 1}
                className="flex size-9 items-center justify-center rounded-xl border border-zinc-250 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-655 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-35 transition hover:scale-105 active:scale-95"
                type="button"
              >
                <SkipForward className="size-4" />
              </button>
            </div>

            {/* Settings button */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={cn(
                "flex size-9 items-center justify-center rounded-xl border transition",
                isSettingsOpen
                  ? "border-amber/40 bg-white/50 dark:bg-white/[0.08] text-amber shadow-inner"
                  : "border-zinc-250 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
              type="button"
            >
              <Settings className="size-4.5" />
            </button>
          </div>

          {/* Expandable settings */}
          {isSettingsOpen && (
            <div className="space-y-3 rounded-xl border border-zinc-200/50 dark:border-white/5 bg-zinc-100/60 dark:bg-[#09090b]/40 p-3.5 shadow-inner backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Speed slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-wider text-zinc-650 dark:text-zinc-400 font-bold">
                  <span>SPEED</span>
                  <span className="text-amber">{rate}X</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200/60 dark:bg-white/[0.08] accent-amber"
                />
              </div>

              {/* Voice dropdown */}
              {voices.length > 0 && (
                <div className="space-y-1.5">
                  <label
                    className="block font-mono text-[9px] uppercase tracking-wider text-zinc-650 dark:text-zinc-400 font-bold"
                    htmlFor="widget-audio-voice"
                  >
                    VOICE GEAR
                  </label>
                  <select
                    id="widget-audio-voice"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200/60 dark:border-white/10 bg-white/70 dark:bg-[#09090b]/80 px-2 py-1.5 font-mono text-[9px] text-zinc-800 dark:text-zinc-200 focus:border-amber/40 focus:outline-none outline-none transition-all"
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name} className="dark:bg-[#111] text-zinc-800 dark:text-zinc-200">
                        {v.name.replace(/Microsoft|Google|Apple/g, "").trim()} ({v.lang.split("-")[0]})
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
