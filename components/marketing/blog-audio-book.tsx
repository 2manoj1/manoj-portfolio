"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Volume2, Settings, AudioLines } from "lucide-react";

interface BlogAudioBookProps {
  paragraphs: string[];
  title: string;
  onParagraphChange?: (index: number | null) => void;
}

export function BlogAudioBook({ paragraphs, title, onParagraphChange }: BlogAudioBookProps) {
  const [supported, setSupported] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check support and load voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        // Filter english voices by default
        const engVoices = availableVoices.filter(v => v.lang.startsWith("en"));
        setVoices(engVoices.length > 0 ? engVoices : availableVoices);
        
        // Select a default voice
        if (engVoices.length > 0) {
          const defaultVoice = engVoices.find(v => v.name.includes("Google") || v.name.includes("Natural")) || engVoices[0];
          setSelectedVoice(defaultVoice.name);
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeakParagraph = (index: number) => {
    if (!supported) return;

    window.speechSynthesis.cancel();

    if (index >= paragraphs.length) {
      // Finished speaking the entire article
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentIdx(0);
      if (onParagraphChange) onParagraphChange(null);
      return;
    }

    setCurrentIdx(index);
    if (onParagraphChange) onParagraphChange(index);

    // Clean text from markdown syntax
    const rawText = paragraphs[index]
      .replace(/`([^`]+)`/g, "$1") // clean inline code
      .replace(/\*\*([^*]+)\*\*/g, "$1") // clean bold
      .replace(/\*([^*]+)\*/g, "$1"); // clean italics

    const utterance = new SpeechSynthesisUtterance(rawText);
    utteranceRef.current = utterance;

    // Set voice properties
    const voiceObj = voices.find(v => v.name === selectedVoice);
    if (voiceObj) utterance.voice = voiceObj;
    utterance.rate = rate;

    // Handle end of speaking
    utterance.onend = () => {
      if (isPlaying && !isPaused) {
        handleSpeakParagraph(index + 1);
      }
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsPlaying(false);
      setIsPaused(false);
      if (onParagraphChange) onParagraphChange(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (!supported || paragraphs.length === 0) return;

    if (isPaused) {
      // Resume
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      if (onParagraphChange) onParagraphChange(currentIdx);
    } else {
      // Start from current paragraph
      setIsPlaying(true);
      setIsPaused(false);
      handleSpeakParagraph(currentIdx);
    }
  };

  const handlePause = () => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIdx(0);
    if (onParagraphChange) onParagraphChange(null);
  };

  if (!supported) {
    return null;
  }

  // Calculate overall reading progress
  const progressPercent = paragraphs.length > 0 ? (currentIdx / paragraphs.length) * 100 : 0;

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
              Synthesized Audio Spec Deck // Active
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
              Paragraph {currentIdx + 1} of {paragraphs.length} // Rate: {rate}x
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
              >
                <Pause className="size-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={handlePlay}
                className="size-7 rounded bg-amber flex items-center justify-center text-zinc-950 hover:bg-amber/90 transition-colors"
                title="Play Reading Aloud"
              >
                <Play className="size-3.5 fill-current" />
              </button>
            )}

            <button
              onClick={handleStop}
              disabled={!isPlaying && !isPaused}
              className="size-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
              title="Stop Reading"
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
                  setRate(newRate);
                  // Apply new rate immediately if speaking
                  if (isPlaying) {
                    handleSpeakParagraph(currentIdx);
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
                    setSelectedVoice(e.target.value);
                    if (isPlaying) {
                      // Restart current paragraph with new voice
                      setTimeout(() => handleSpeakParagraph(currentIdx), 50);
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

      </div>
    </div>
  );
}
