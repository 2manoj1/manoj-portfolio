"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";

interface AudioPlayerContextType {
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  rate: number;
  isPlaying: boolean;
  isPaused: boolean;
  title: string | null;
  slug: string | null;
  paragraphs: string[];
  currentIdx: number;
  showGlobalPlayer: boolean;
  play: (title: string, paragraphs: string[], slug: string, startIdx?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  jumpToParagraph: (idx: number) => void;
  setRate: (rate: number) => void;
  setSelectedVoice: (voiceName: string) => void;
  setShowGlobalPlayer: (show: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

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

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const supported = useSyncExternalStore(
    subscribeToSpeechSupport,
    getSpeechSupportSnapshot,
    getServerSpeechSupportSnapshot
  );

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState<number>(1.0); // Default to 1.0x speed as requested
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const [title, setTitle] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showGlobalPlayer, setShowGlobalPlayer] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeUtteranceIdRef = useRef(0);
  const playTimeoutRef = useRef<number | null>(null);

  // Synchronized refs for speech callbacks
  const stateRef = useRef({
    isPlaying,
    isPaused,
    currentIdx,
    paragraphs,
    rate,
    selectedVoice,
    voices,
  });

  useEffect(() => {
    stateRef.current = {
      isPlaying,
      isPaused,
      currentIdx,
      paragraphs,
      rate,
      selectedVoice,
      voices,
    };
  }, [isPlaying, isPaused, currentIdx, paragraphs, rate, selectedVoice, voices]);

  // Load voices
  useEffect(() => {
    if (!supported) return;

    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      const engVoices = availableVoices.filter(v => v.lang.startsWith("en"));
      const finalVoices = engVoices.length > 0 ? engVoices : availableVoices;
      setVoices(finalVoices);

      if (finalVoices.length > 0) {
        // Try to pick a natural/high-quality voice first
        const defaultVoice = finalVoices.find(v => 
          v.name.includes("Google") || 
          v.name.includes("Natural") || 
          v.name.includes("Premium")
        ) || finalVoices[0];
        setSelectedVoice(current => current || defaultVoice.name);
      }
    };

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);
    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
    };
  }, [supported]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (playTimeoutRef.current) {
        window.clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  function cancelActiveSpeech() {
    activeUtteranceIdRef.current += 1;
    if (supported) {
      window.speechSynthesis.cancel();
    }
  }

  function speakSegment(index: number, skipCancel = false) {
    if (!supported || index < 0 || index >= stateRef.current.paragraphs.length) {
      // Completed or out of bounds
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
      return;
    }

    if (!skipCancel) {
      cancelActiveSpeech();
    }

    const currentUtteranceId = activeUtteranceIdRef.current;
    const rawText = cleanSpeechText(stateRef.current.paragraphs[index]);

    // If it's an empty segment, move to next immediately
    if (!rawText) {
      setCurrentIdx(index);
      if (index + 1 < stateRef.current.paragraphs.length) {
        speakSegment(index + 1, true);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
      }
      return;
    }

    setCurrentIdx(index);

    const utterance = new SpeechSynthesisUtterance(rawText);
    utteranceRef.current = utterance;

    // Apply voice settings
    const voiceObj = stateRef.current.voices.find(v => v.name === stateRef.current.selectedVoice);
    if (voiceObj) utterance.voice = voiceObj;
    utterance.rate = stateRef.current.rate;

    utterance.onend = () => {
      if (activeUtteranceIdRef.current !== currentUtteranceId) return;
      if (index + 1 < stateRef.current.paragraphs.length) {
        speakSegment(index + 1, false);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      }
    };

    utterance.onerror = (e) => {
      if (activeUtteranceIdRef.current !== currentUtteranceId) return;
      if (e.error !== "interrupted" && e.error !== "canceled") {
        console.warn("Speech synthesis error:", e.error);
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    // Chrome/Safari fix: pause and resume if it gets stuck
    window.speechSynthesis.speak(utterance);
  }

  // Plays a new set of paragraphs (e.g. from an article)
  const play = (newTitle: string, newParagraphs: string[], newSlug: string, startIdx = 0) => {
    if (!supported || newParagraphs.length === 0) return;

    // Clean up timers
    if (playTimeoutRef.current) {
      window.clearTimeout(playTimeoutRef.current);
    }

    cancelActiveSpeech();

    setTitle(newTitle);
    setParagraphs(newParagraphs);
    setSlug(newSlug);
    setCurrentIdx(startIdx);
    setIsPlaying(true);
    setIsPaused(false);
    setShowGlobalPlayer(true);

    // Update internal ref so it has the new data immediately
    stateRef.current.paragraphs = newParagraphs;
    stateRef.current.isPlaying = true;
    stateRef.current.isPaused = false;
    stateRef.current.currentIdx = startIdx;

    // Use a small timeout to let the cancel settle before starting new speech
    playTimeoutRef.current = window.setTimeout(() => {
      speakSegment(startIdx, true);
    }, 50);
  };

  const pause = () => {
    if (!supported || !isPlaying) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const resume = () => {
    if (!supported || !isPaused) return;
    
    // In some browsers, resume() doesn't work after a page navigation.
    // If it fails, we restart speaking the current segment.
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      
      // Safety check: if the speech engine doesn't start speaking in a short window, restart it
      setTimeout(() => {
        if (stateRef.current.isPaused && !window.speechSynthesis.speaking) {
          speakSegment(currentIdx, false);
        }
      }, 150);
    } else {
      speakSegment(currentIdx, false);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (!supported) return;
    cancelActiveSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIdx(0);
    setTitle(null);
    setSlug(null);
    setParagraphs([]);
    setShowGlobalPlayer(false);
  };

  const next = () => {
    if (currentIdx + 1 < paragraphs.length) {
      jumpToParagraph(currentIdx + 1);
    }
  };

  const prev = () => {
    if (currentIdx - 1 >= 0) {
      jumpToParagraph(currentIdx - 1);
    }
  };

  const jumpToParagraph = (idx: number) => {
    if (!supported || paragraphs.length === 0) return;
    const targetIdx = Math.min(Math.max(idx, 0), paragraphs.length - 1);
    
    cancelActiveSpeech();
    setCurrentIdx(targetIdx);
    setIsPlaying(true);
    setIsPaused(false);

    stateRef.current.isPlaying = true;
    stateRef.current.isPaused = false;
    stateRef.current.currentIdx = targetIdx;

    if (playTimeoutRef.current) {
      window.clearTimeout(playTimeoutRef.current);
    }

    playTimeoutRef.current = window.setTimeout(() => {
      speakSegment(targetIdx, true);
    }, 50);
  };

  const changeRate = (newRate: number) => {
    const rateVal = Math.min(Math.max(newRate, 0.8), 2.0);
    setRate(rateVal);
    stateRef.current.rate = rateVal;

    if (stateRef.current.isPlaying && !stateRef.current.isPaused) {
      cancelActiveSpeech();
      if (playTimeoutRef.current) {
        window.clearTimeout(playTimeoutRef.current);
      }
      playTimeoutRef.current = window.setTimeout(() => {
        speakSegment(stateRef.current.currentIdx, true);
      }, 150);
    }
  };

  const changeVoice = (voiceName: string) => {
    setSelectedVoice(voiceName);
    stateRef.current.selectedVoice = voiceName;

    if (stateRef.current.isPlaying && !stateRef.current.isPaused) {
      cancelActiveSpeech();
      if (playTimeoutRef.current) {
        window.clearTimeout(playTimeoutRef.current);
      }
      playTimeoutRef.current = window.setTimeout(() => {
        speakSegment(stateRef.current.currentIdx, true);
      }, 150);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
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
        play,
        pause,
        resume,
        stop,
        next,
        prev,
        jumpToParagraph,
        setRate: changeRate,
        setSelectedVoice: changeVoice,
        setShowGlobalPlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
