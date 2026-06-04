"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Gauge,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogAudioBookProps {
  paragraphs: string[];
  title: string;
  onParagraphChange?: (index: number | null) => void;
}

const subscribeToSpeechSupport = () => () => {};

const getSpeechSupportSnapshot = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

const getServerSpeechSupportSnapshot = () => false;

function cleanSpeechText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " code block omitted ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, "$1. ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/[_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function BlogAudioBook({ paragraphs, title, onParagraphChange }: BlogAudioBookProps) {
  const supported = useSyncExternalStore(
    subscribeToSpeechSupport,
    getSpeechSupportSnapshot,
    getServerSpeechSupportSnapshot,
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [speechNotice, setSpeechNotice] = useState<string>("");
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [chatState, setChatState] = useState({ open: false, expanded: false });

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
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeUtteranceIdRef = useRef(0);
  const currentIdxRef = useRef(0);
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const paragraphsRef = useRef(paragraphs);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const selectedVoiceRef = useRef("");
  const rateRef = useRef(1);
  const onParagraphChangeRef = useRef(onParagraphChange);

  useEffect(() => {
    paragraphsRef.current = paragraphs;
  }, [paragraphs]);

  useEffect(() => {
    voicesRef.current = voices;
  }, [voices]);

  useEffect(() => {
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    onParagraphChangeRef.current = onParagraphChange;
  }, [onParagraphChange]);

  // Check support and load voices
  useEffect(() => {
    if (!supported) return;

    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      // Filter english voices by default
      const engVoices = availableVoices.filter(v => v.lang.startsWith("en"));
      setVoices(engVoices.length > 0 ? engVoices : availableVoices);

      // Select a default voice
      if (engVoices.length > 0) {
        const defaultVoice = engVoices.find(v => v.name.includes("Google") || v.name.includes("Natural")) || engVoices[0];
        setSelectedVoice(current => {
          const nextVoice = current || defaultVoice.name;
          selectedVoiceRef.current = nextVoice;
          return nextVoice;
        });
      }
    };

    const timer = window.setTimeout(loadVoices, 0);
    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.clearTimeout(timer);
      synth.removeEventListener("voiceschanged", loadVoices);
    };
  }, [supported]);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        activeUtteranceIdRef.current += 1;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function finishPlayback({
    resetIndex = false,
    completed = !resetIndex,
  }: {
    resetIndex?: boolean;
    completed?: boolean;
  } = {}) {
    isPlayingRef.current = false;
    isPausedRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    setHasCompleted(completed);
    utteranceRef.current = null;

    if (resetIndex) {
      currentIdxRef.current = 0;
      setCurrentIdx(0);
    }

    onParagraphChangeRef.current?.(null);
  }

  function cancelActiveSpeech() {
    activeUtteranceIdRef.current += 1;
    window.speechSynthesis.cancel();
  }

  function speakParagraph(index: number, options: { cancelCurrent?: boolean } = {}) {
    if (!supported) return;

    const shouldCancel = options.cancelCurrent ?? true;
    if (shouldCancel) {
      cancelActiveSpeech();
    }

    const readableParagraphs = paragraphsRef.current;

    if (index >= readableParagraphs.length) {
      finishPlayback({ completed: true });
      return;
    }

    const rawText = cleanSpeechText(readableParagraphs[index]);

    if (!rawText) {
      currentIdxRef.current = index;
      setCurrentIdx(index);
      onParagraphChangeRef.current?.(index);
      if (isPlayingRef.current && !isPausedRef.current) {
        window.setTimeout(() => speakParagraph(index + 1, { cancelCurrent: false }), 0);
      }
      return;
    }

    setSpeechNotice("");
    setHasCompleted(false);
    currentIdxRef.current = index;
    setCurrentIdx(index);
    onParagraphChangeRef.current?.(index);

    const utterance = new SpeechSynthesisUtterance(rawText);
    const utteranceId = activeUtteranceIdRef.current + 1;
    activeUtteranceIdRef.current = utteranceId;
    utteranceRef.current = utterance;

    // Set voice properties
    const voiceObj = voicesRef.current.find(v => v.name === selectedVoiceRef.current);
    if (voiceObj) utterance.voice = voiceObj;
    utterance.rate = rateRef.current;

    // Handle end of speaking
    utterance.onend = () => {
      if (activeUtteranceIdRef.current !== utteranceId) return;
      if (isPlayingRef.current && !isPausedRef.current) {
        speakParagraph(index + 1, { cancelCurrent: false });
      }
    };

    utterance.onerror = (e) => {
      if (activeUtteranceIdRef.current !== utteranceId) return;

      const errorName =
        "error" in e && typeof e.error === "string" ? e.error : "unknown";

      if (errorName === "canceled" || errorName === "interrupted") {
        return;
      }

      setSpeechNotice("Speech engine stopped this segment. Try another voice or a slower rate.");
      finishPlayback({ completed: false });
    };

    window.speechSynthesis.speak(utterance);
  }

  function jumpToParagraph(index: number) {
    if (!supported || paragraphs.length === 0) return;

    const nextIndex = Math.min(Math.max(index, 0), paragraphs.length - 1);
    currentIdxRef.current = nextIndex;
    setCurrentIdx(nextIndex);
    setHasCompleted(false);
    onParagraphChangeRef.current?.(nextIndex);

    if (isPlayingRef.current && !isPausedRef.current) {
      speakParagraph(nextIndex, { cancelCurrent: true });
    }
  }

  const handlePlay = () => {
    if (!supported || paragraphs.length === 0) return;

    if (isPaused) {
      // Resume
      isPlayingRef.current = true;
      isPausedRef.current = false;
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      setSpeechNotice("");
      onParagraphChangeRef.current?.(currentIdxRef.current);
    } else {
      // Start from current paragraph
      const startIndex = hasCompleted ? 0 : currentIdxRef.current;
      isPlayingRef.current = true;
      isPausedRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);
      setSpeechNotice("");
      speakParagraph(startIndex, { cancelCurrent: true });
    }
  };

  const handlePause = () => {
    if (!supported) return;
    isPlayingRef.current = false;
    isPausedRef.current = true;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!supported) return;
    cancelActiveSpeech();
    finishPlayback({ resetIndex: true });
  };

  if (!supported) {
    return null;
  }

  if (isDismissed) {
    return (
      <div className="flex items-center justify-between border border-border bg-zinc-950/25 px-4 py-3 rounded-lg animate-fadeIn text-left">
        <span className="font-mono text-xs text-muted-foreground flex items-center gap-2">
          <Volume2 className="size-4 text-zinc-500" />
          Audio book player dismissed.
        </span>
        <button
          onClick={() => {
            setIsDismissed(false);
            setIsMinimized(false);
          }}
          className="text-xs font-mono font-bold uppercase tracking-wider text-amber hover:text-amber/80 transition-colors"
          type="button"
        >
          Reopen Player
        </button>
      </div>
    );
  }

  // Calculate overall reading progress
  const progressPercent =
    paragraphs.length > 0
      ? hasCompleted
        ? 100
        : ((currentIdx + (isPlaying || isPaused ? 0.35 : 0)) / paragraphs.length) * 100
      : 0;
  const segmentLabel = `${Math.min(currentIdx + 1, paragraphs.length)}/${paragraphs.length}`;
  const playbackStateLabel = isPlaying ? "Playing" : isPaused ? "Paused" : "Ready";
  const playButtonLabel = isPlaying ? "Pause article audio" : "Play article audio";
  const playButtonTitle = isPlaying ? "Pause Reading" : "Play Reading Aloud";
  const PlayStateIcon = isPlaying ? Pause : Play;

  const primaryPlayButton = (
    <button
      aria-label={playButtonLabel}
      onClick={isPlaying ? handlePause : handlePlay}
      className="flex size-11 items-center justify-center rounded-lg bg-amber text-zinc-950 shadow-[0_14px_34px_rgba(245,158,11,0.25)] transition hover:bg-amber/90 active:scale-[0.98] sm:size-10"
      title={playButtonTitle}
      type="button"
    >
      <PlayStateIcon className="size-4 fill-current" />
    </button>
  );

  if (isMinimized) {
    let positionClasses = "bottom-20 left-4 right-4 md:bottom-6 md:w-[420px]";
    if (chatState.open) {
      if (chatState.expanded) {
        positionClasses += " md:left-8 md:right-auto";
      } else {
        positionClasses += " md:left-auto md:right-[480px]";
      }
    } else {
      positionClasses += " md:left-auto md:right-36";
    }

    return (
      <div
        aria-label="Article audio mini player"
        className={cn(
          "fixed z-[80] overflow-hidden rounded-lg border border-amber/25 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl transition-all duration-500 ease-in-out hover:border-amber/40",
          positionClasses
        )}
        role="region"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01)_38%,rgba(245,158,11,0.04))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

        <div className="relative z-10 flex items-center gap-3 px-3 py-2.5">
          {/* Waveform visualizer / Icon */}
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-amber shadow-inner">
            <Volume2 className="size-4" />
            {isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
            )}
          </div>

          {/* Title & Progress stats */}
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-xs font-semibold tracking-tight text-zinc-100">
                {title}
              </p>
              <span
                aria-live="polite"
                className="hidden shrink-0 items-center gap-1 font-mono text-[9px] uppercase tracking-wide text-amber/80 sm:flex"
              >
                <span className={`size-1 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-zinc-650"}`} />
                {playbackStateLabel}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[9px] text-muted-foreground/85">
              Segment {segmentLabel}{" · "}{rate}x speed
            </p>
          </div>

          {/* Mobile specific controls */}
          <div className="flex shrink-0 items-center gap-1 sm:hidden">
            <button
              aria-label={playButtonLabel}
              onClick={isPlaying ? handlePause : handlePlay}
              className="flex size-9 items-center justify-center rounded-lg bg-amber text-zinc-950 shadow-[0_4px_14px_rgba(245,158,11,0.2)] transition hover:bg-amber/90 active:scale-[0.95]"
              title={playButtonTitle}
              type="button"
            >
              <PlayStateIcon className="size-3.5 fill-current" />
            </button>

            <button
              aria-label="Expand audio player"
              onClick={() => setIsMinimized(false)}
              className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-350 transition hover:text-amber"
              title="Expand Player"
              type="button"
            >
              <Maximize2 className="size-3" />
            </button>

            <button
              aria-label="Stop audio player"
              onClick={() => {
                handleStop();
                setIsDismissed(true);
              }}
              className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:text-rose-400"
              title="Stop & Close"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>

          {/* Desktop specific controls */}
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <button
              aria-label="Previous audio segment"
              onClick={() => jumpToParagraph(currentIdxRef.current - 1)}
              disabled={currentIdx <= 0}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-450 transition hover:text-zinc-100 disabled:opacity-30"
              title="Previous Segment"
              type="button"
            >
              <SkipBack className="size-3.5" />
            </button>

            {primaryPlayButton}

            <button
              aria-label="Next audio segment"
              onClick={() => jumpToParagraph(currentIdxRef.current + 1)}
              disabled={currentIdx >= paragraphs.length - 1}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-450 transition hover:text-zinc-100 disabled:opacity-30"
              title="Next Segment"
              type="button"
            >
              <SkipForward className="size-3.5" />
            </button>

            <div className="h-4 w-px bg-zinc-800 mx-1" />

            <button
              aria-label="Expand audio player"
              onClick={() => setIsMinimized(false)}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-350 transition hover:text-amber"
              title="Expand Player"
              type="button"
            >
              <Maximize2 className="size-3.5" />
            </button>

            <button
              aria-label="Stop audio player"
              onClick={() => {
                handleStop();
                setIsDismissed(true);
              }}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.06] hover:text-rose-400"
              title="Stop & Close"
              type="button"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Floating progress bar */}
        <div
          aria-label="Audio reading progress"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(progressPercent)}
          className="relative h-1 w-full bg-white/[0.06]"
          role="progressbar"
        >
          <div
            className="h-full bg-amber transition-all duration-300"
            style={{ width: `${progressPercent || (isPlaying ? 5 : 0)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label="Article audio reader"
      className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-950/70 p-3 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-4"
      role="region"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.025)_42%,rgba(245,158,11,0.08))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/25" />
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

      <div className="flex flex-col gap-3 relative z-10">
        
        {/* Title bar / Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] text-amber shadow-inner sm:size-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_38%)]" />
              <Volume2 className="relative size-5" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-wider text-amber/70">
                Now Listening
              </p>
              <h4 className="mt-1 truncate text-sm font-semibold tracking-tight text-zinc-100 sm:text-base">
                {title}
              </h4>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              aria-live="polite"
              className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide text-amber/70 sm:flex"
            >
              <span className={`size-1.5 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
              {playbackStateLabel}
            </span>
            <button
              aria-label="Minimize audio player"
              onClick={() => {
                setIsSettingsOpen(false);
                setIsMinimized(true);
              }}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:text-amber"
              title="Minimize Player"
              type="button"
            >
              <Minimize2 className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-zinc-300">
              Segment {segmentLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-zinc-300">
              <Gauge className="size-3 text-amber" />
              {rate}x
            </span>
          </div>

          {/* Sound waves graphic */}
          <div className="hidden h-6 shrink-0 items-end gap-0.5 pr-1 sm:flex">
            {[...Array(6)].map((_, i) => {
              const activeHeights = ["h-3", "h-5", "h-2", "h-6", "h-4", "h-3"];
              return (
                <div 
                  key={i} 
                  className={`w-0.5 bg-amber/80 rounded-t transition-all duration-300 ${
                    isPlaying 
                      ? activeHeights[i] + " animate-pulse" 
                      : "h-1 bg-zinc-800"
                  }`} 
                  style={{
                    animationDelay: `${i * 100}ms`
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Audio progress bar */}
        <div
          aria-label="Audio reading progress"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(progressPercent)}
          className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]"
          role="progressbar"
        >
          <div 
            className="h-full rounded-full bg-amber shadow-[0_0_18px_rgba(245,158,11,0.35)] transition-all duration-300"
            style={{ width: `${progressPercent || (isPlaying ? 5 : 0)}%` }}
          />
        </div>

        {/* Controls layer */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            {primaryPlayButton}

            <button
              aria-label="Previous audio segment"
              onClick={() => jumpToParagraph(currentIdxRef.current - 1)}
              disabled={currentIdx <= 0}
              className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.07] hover:text-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-400 sm:size-10"
              title="Previous Segment"
              type="button"
            >
              <SkipBack className="size-3.5" />
            </button>

            <button
              aria-label="Next audio segment"
              onClick={() => jumpToParagraph(currentIdxRef.current + 1)}
              disabled={currentIdx >= paragraphs.length - 1}
              className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.07] hover:text-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-400 sm:size-10"
              title="Next Segment"
              type="button"
            >
              <SkipForward className="size-3.5" />
            </button>

            <button
              aria-label="Stop article audio"
              onClick={handleStop}
              disabled={!isPlaying && !isPaused}
              className="hidden size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.07] hover:text-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-400 sm:flex sm:size-10"
              title="Stop Reading"
              type="button"
            >
              <Square className="size-3 fill-current" />
            </button>
          </div>

          {/* Speed & Settings toggles */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Open voice settings"
              aria-expanded={isSettingsOpen}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex size-9 items-center justify-center rounded-lg border transition sm:size-10 ${
                isSettingsOpen 
                  ? 'border-amber/40 bg-white/[0.08] text-amber'
                  : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-100'
              }`}
              title="Voice Settings"
              type="button"
            >
              <Settings className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic settings expander */}
        {isSettingsOpen && (
          <div className="mt-2 space-y-3 rounded-lg border border-white/10 bg-black/20 p-3 animate-fadeIn">
            {/* Speed slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-mono uppercase text-zinc-400">
                <span>Reading Speed</span>
                <span className="text-amber font-bold">{rate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.1"
                value={rate}
                onChange={(e) => {
                  const newRate = Number(e.target.value);
                  rateRef.current = newRate;
                  setRate(newRate);
                  // Apply new rate immediately if speaking.
                  if (isPlayingRef.current && !isPausedRef.current) {
                    speakParagraph(currentIdxRef.current, { cancelCurrent: true });
                  }
                }}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/[0.08] accent-amber"
              />
            </div>

            {/* Voice selector */}
            {voices.length > 0 && (
              <div className="space-y-1.5">
                <label
                  className="block font-mono text-[9px] uppercase text-zinc-400"
                  htmlFor="blog-audio-voice"
                >
                  Select Speech Synthesizer Voice
                </label>
                <select
                  id="blog-audio-voice"
                  value={selectedVoice}
                  onChange={(e) => {
                    const nextVoice = e.target.value;
                    selectedVoiceRef.current = nextVoice;
                    setSelectedVoice(nextVoice);
                    if (isPlayingRef.current && !isPausedRef.current) {
                      // Restart current paragraph with the new voice.
                      setTimeout(() => speakParagraph(currentIdxRef.current, { cancelCurrent: true }), 50);
                    }
                  }}
                  className="w-full rounded border border-white/10 bg-zinc-950/80 px-2 py-1.5 font-mono text-[10px] text-zinc-300 focus:border-amber/40 focus:outline-none"
                >
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name.replace(/Microsoft|Google|Apple/g, "").trim()} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {speechNotice && (
          <p className="border-t border-zinc-900 pt-2 font-mono text-[9px] leading-relaxed text-amber/75">
            {speechNotice}
          </p>
        )}

      </div>
    </div>
  );
}
