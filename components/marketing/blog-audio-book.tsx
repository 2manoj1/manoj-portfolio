"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
} from "lucide-react";

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
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [speechNotice, setSpeechNotice] = useState<string>("");
  
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

  // Calculate overall reading progress
  const progressPercent =
    paragraphs.length > 0
      ? hasCompleted
        ? 100
        : ((currentIdx + (isPlaying || isPaused ? 0.35 : 0)) / paragraphs.length) * 100
      : 0;

  return (
    <div className="border border-border bg-zinc-950/70 p-4 rounded-lg shadow-lg relative overflow-hidden backdrop-blur-md">
      
      {/* Decorative scanning line grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />

      <div className="flex flex-col gap-3 relative z-10">
        
        {/* Title bar / Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
          <div className="flex items-center gap-2">
            <Volume2 className="size-4 text-amber animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              {"Synthesized Audio Spec Deck // Active"}
            </span>
          </div>
          <span className="font-mono text-[9px] text-amber/60 flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-zinc-700'}`} />
            {isPlaying ? "TRANSMITTING" : isPaused ? "PAUSED" : "STANDBY"}
          </span>
        </div>

        {/* Info panel */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h4 className="text-[11px] font-mono font-bold text-zinc-200 truncate max-w-[280px]">
              {title}
            </h4>
            <p className="font-mono text-[9px] text-muted-foreground/60 mt-0.5">
              Segment {Math.min(currentIdx + 1, paragraphs.length)} of {paragraphs.length}{" // "}Rate: {rate}x
            </p>
          </div>

          {/* Sound waves graphic */}
          <div className="flex items-end gap-0.5 h-6 shrink-0 pr-1">
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
        <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden relative">
          <div 
            className="h-full bg-amber transition-all duration-300"
            style={{ width: `${progressPercent || (isPlaying ? 5 : 0)}%` }}
          />
        </div>

        {/* Controls layer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <button
                onClick={handlePause}
                className="size-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-amber hover:border-amber/30 transition-colors"
                title="Pause Reading"
                type="button"
              >
                <Pause className="size-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={handlePlay}
                className="size-7 rounded bg-amber flex items-center justify-center text-zinc-950 hover:bg-amber/90 transition-colors"
                title="Play Reading Aloud"
                type="button"
              >
                <Play className="size-3.5 fill-current" />
              </button>
            )}

            <button
              onClick={() => jumpToParagraph(currentIdxRef.current - 1)}
              disabled={currentIdx <= 0}
              className="size-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
              title="Previous Segment"
              type="button"
            >
              <SkipBack className="size-3.5" />
            </button>

            <button
              onClick={() => jumpToParagraph(currentIdxRef.current + 1)}
              disabled={currentIdx >= paragraphs.length - 1}
              className="size-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
              title="Next Segment"
              type="button"
            >
              <SkipForward className="size-3.5" />
            </button>

            <button
              onClick={handleStop}
              disabled={!isPlaying && !isPaused}
              className="size-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
              title="Stop Reading"
              type="button"
            >
              <Square className="size-3 fill-current" />
            </button>
          </div>

          {/* Speed & Settings toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`size-7 rounded border flex items-center justify-center transition-colors ${
                isSettingsOpen 
                  ? 'border-amber/40 bg-zinc-900 text-amber' 
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
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
          <div className="mt-2 border-t border-zinc-900 pt-3.5 space-y-3 animate-fadeIn">
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
                className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber"
              />
            </div>

            {/* Voice selector */}
            {voices.length > 0 && (
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase text-zinc-400 block">
                  Select Speech Synthesizer Voice
                </label>
                <select
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
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 font-mono text-[9px] text-zinc-300 focus:outline-none focus:border-amber/40"
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
