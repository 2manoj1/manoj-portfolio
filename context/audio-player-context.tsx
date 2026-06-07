"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

export type SpeechSegmentKind = "takeaway" | "heading" | "paragraph" | "callout";

export interface SpeechSegment {
  text: string;
  kind: SpeechSegmentKind;
  sourceIndex: number;
  sectionTitle?: string;
  pauseAfterMs?: number;
}

export type SpeechInputSegment = string | SpeechSegment;

interface AudioPlayerContextType {
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  rate: number;
  isPlaying: boolean;
  isPaused: boolean;
  title: string | null;
  slug: string | null;
  paragraphs: SpeechSegment[];
  currentIdx: number;
  currentSourceIndex: number | null;
  currentSectionTitle: string | null;
  currentSegmentKind: SpeechSegmentKind | null;
  showGlobalPlayer: boolean;
  play: (
    title: string,
    paragraphs: SpeechInputSegment[],
    slug: string,
    startIdx?: number,
  ) => void;
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
const goldenNarrationRate = 0.95;
const goldenNarrationVolume = 1;

const defaultPauseByKind: Record<SpeechSegmentKind, number> = {
  takeaway: 720,
  heading: 950,
  paragraph: 320,
  callout: 680,
};

const voicePreferencePatterns = [
  /natural/i,
  /neural/i,
  /premium/i,
  /enhanced/i,
  /online/i,
  /samantha/i,
  /alex/i,
  /ava/i,
  /nicky/i,
  /jenny/i,
  /aria/i,
  /guy/i,
  /zira/i,
  /david/i,
  /mark/i,
  /daniel/i,
  /karen/i,
  /moira/i,
  /tessa/i,
  /google us english/i,
  /google uk english/i,
  /microsoft .* natural/i,
] as const;

const lowQualityVoicePatterns = [
  /compact/i,
  /novelty/i,
  /whisper/i,
  /robot/i,
  /bells/i,
  /organ/i,
  /trinoids/i,
] as const;

function normalizeSpeechSegments(segments: SpeechInputSegment[]) {
  return segments.map((segment, index): SpeechSegment => {
    if (typeof segment === "string") {
      return {
        text: segment,
        kind: "paragraph",
        sourceIndex: index,
      };
    }

    return segment;
  });
}

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

function applyTechnicalPronunciations(text: string) {
  return text
    .replace(/\bGraphRAG\b/g, "graph rag")
    .replace(/\bFastAPI\b/g, "Fast A P I")
    .replace(/\bOpenAI\b/g, "Open A I")
    .replace(/\bAPIs\b/g, "A P I's")
    .replace(/\bAPI\b/g, "A P I")
    .replace(/\bLLMs\b/g, "L L M's")
    .replace(/\bLLM\b/g, "L L M")
    .replace(/\bRAG\b/g, "rag")
    .replace(/\bMCP\b/g, "M C P")
    .replace(/\bA2A\b/g, "A to A")
    .replace(/\bGPUs\b/g, "G P U's")
    .replace(/\bGPU\b/g, "G P U")
    .replace(/\bCPUs\b/g, "C P U's")
    .replace(/\bCPU\b/g, "C P U")
    .replace(/\bAI\b/g, "A I")
    .replace(/\bNVIDIA\b/g, "N vidia")
    .replace(/\bKubernetes\b/g, "Koo ber net ease")
    .replace(/\bLangChain\b/g, "Lang Chain")
    .replace(/\bPostgreSQL\b/g, "Postgres Q L")
    .replace(/\bqwen(\d+(?:\.\d+)?):(\d+)b\b/gi, "Qwen $1, $2 B");
}

function improveSentencePacing(text: string) {
  return text
    .replace(/\s*;\s*/g, ". ")
    .replace(/\s*:\s+(?=[A-Z])/g, ". ")
    .replace(/\bFor example,\s*/g, "For example, ")
    .replace(/\bIn practice,\s*/g, "In practice, ")
    .replace(/\bThe key idea is\b/gi, "The key idea is")
    .replace(/\s+/g, " ")
    .trim();
}

function buildNarrationText(segment: SpeechSegment, index: number) {
  const cleanText = applyTechnicalPronunciations(
    improveSentencePacing(cleanSpeechText(segment.text)),
  );

  if (!cleanText) {
    return "";
  }

  if (segment.kind === "takeaway") {
    return `Here is the core idea. ${cleanText}`;
  }

  if (segment.kind === "heading") {
    return index <= 1
      ? `First, let's look at ${cleanText}.`
      : `Next, let's look at ${cleanText}.`;
  }

  if (segment.kind === "callout") {
    return `Important note. ${cleanText}`;
  }

  return cleanText;
}

function splitNarrationIntoChunks(text: string, maxLength = 280) {
  const sentences = text.match(/[^.!?]+[.!?]+(?:["')\]]+)?|[^.!?]+$/g) ?? [
    text,
  ];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences.map((item) => item.trim()).filter(Boolean)) {
    if (!current) {
      current = sentence;
      continue;
    }

    if (`${current} ${sentence}`.length <= maxLength) {
      current = `${current} ${sentence}`;
      continue;
    }

    chunks.push(current);
    current = sentence;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.flatMap((chunk) => {
    if (chunk.length <= maxLength * 1.4) {
      return [chunk];
    }

    return chunk
      .split(/,\s+|\s+-\s+/)
      .reduce<string[]>((parts, phrase) => {
        const last = parts.at(-1);
        if (!last || `${last}, ${phrase}`.length > maxLength) {
          parts.push(phrase.trim());
        } else {
          parts[parts.length - 1] = `${last}, ${phrase.trim()}`;
        }
        return parts;
      }, [])
      .filter(Boolean);
  });
}

function getPauseAfter(segment: SpeechSegment) {
  return segment.pauseAfterMs ?? defaultPauseByKind[segment.kind];
}

function getNarrationRate(baseRate: number, kind: SpeechSegmentKind) {
  const multiplier =
    kind === "heading"
      ? 0.92
      : kind === "takeaway"
        ? 0.96
        : kind === "callout"
          ? 0.94
          : 0.98;

  return Math.min(2, Math.max(0.72, baseRate * multiplier));
}

function getNarrationPitch(kind: SpeechSegmentKind) {
  if (kind === "heading") return 1.02;
  if (kind === "takeaway") return 1.01;
  if (kind === "callout") return 0.99;
  return 1;
}

function scoreVoice(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  let score = 0;

  if (voice.lang.startsWith("en-US")) score += 24;
  else if (voice.lang.startsWith("en-GB")) score += 20;
  else if (voice.lang.startsWith("en-AU")) score += 14;
  else if (voice.lang.startsWith("en-CA")) score += 10;
  else if (voice.lang.startsWith("en-IN")) score += 8;
  else if (voice.lang.startsWith("en")) score += 4;

  if (voice.default) score += 4;
  if (voice.localService) score += 2;

  for (const pattern of voicePreferencePatterns) {
    if (pattern.test(name)) score += 14;
  }

  for (const pattern of lowQualityVoicePatterns) {
    if (pattern.test(name)) score -= 24;
  }

  return score;
}

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const supported = useSyncExternalStore(
    subscribeToSpeechSupport,
    getSpeechSupportSnapshot,
    getServerSpeechSupportSnapshot
  );

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState<number>(goldenNarrationRate);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const [title, setTitle] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [paragraphs, setParagraphs] = useState<SpeechSegment[]>([]);
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
      const engVoices = availableVoices.filter((voice) =>
        voice.lang.startsWith("en"),
      );
      const finalVoices = (engVoices.length > 0 ? engVoices : availableVoices)
        .slice()
        .sort((a, b) => scoreVoice(b) - scoreVoice(a));
      setVoices(finalVoices);

      if (finalVoices.length > 0) {
        setSelectedVoice((current) => current || finalVoices[0].name);
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

  function clearPendingSpeechTimer() {
    if (playTimeoutRef.current) {
      window.clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
  }

  function finishPlayback() {
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }

  function speakSegment(index: number, skipCancel = false, chunkIndex = 0) {
    if (!supported || index < 0 || index >= stateRef.current.paragraphs.length) {
      finishPlayback();
      return;
    }

    if (!skipCancel) {
      cancelActiveSpeech();
    }

    const currentUtteranceId = activeUtteranceIdRef.current;
    const segment = stateRef.current.paragraphs[index];
    const narrationText = buildNarrationText(segment, index);
    const chunks = splitNarrationIntoChunks(narrationText);

    if (chunks.length === 0 || chunkIndex >= chunks.length) {
      setCurrentIdx(index);
      if (index + 1 < stateRef.current.paragraphs.length) {
        speakSegment(index + 1, true);
      } else {
        finishPlayback();
      }
      return;
    }

    setCurrentIdx(index);

    const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
    utteranceRef.current = utterance;

    const voiceObj = stateRef.current.voices.find(
      (voice) => voice.name === stateRef.current.selectedVoice,
    );
    if (voiceObj) {
      utterance.voice = voiceObj;
      utterance.lang = voiceObj.lang;
    }
    utterance.rate = getNarrationRate(stateRef.current.rate, segment.kind);
    utterance.pitch = getNarrationPitch(segment.kind);
    utterance.volume = goldenNarrationVolume;

    utterance.onend = () => {
      if (activeUtteranceIdRef.current !== currentUtteranceId) return;

      if (chunkIndex + 1 < chunks.length) {
        playTimeoutRef.current = window.setTimeout(() => {
          speakSegment(index, true, chunkIndex + 1);
        }, 170);
        return;
      }

      if (index + 1 < stateRef.current.paragraphs.length) {
        playTimeoutRef.current = window.setTimeout(() => {
          speakSegment(index + 1, true);
        }, getPauseAfter(segment));
      } else {
        finishPlayback();
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
  const play = (
    newTitle: string,
    newParagraphs: SpeechInputSegment[],
    newSlug: string,
    startIdx = 0,
  ) => {
    if (!supported || newParagraphs.length === 0) return;

    const normalizedParagraphs = normalizeSpeechSegments(newParagraphs);
    clearPendingSpeechTimer();
    cancelActiveSpeech();

    setTitle(newTitle);
    setParagraphs(normalizedParagraphs);
    setSlug(newSlug);
    setCurrentIdx(startIdx);
    setIsPlaying(true);
    setIsPaused(false);
    setShowGlobalPlayer(true);

    stateRef.current.paragraphs = normalizedParagraphs;
    stateRef.current.isPlaying = true;
    stateRef.current.isPaused = false;
    stateRef.current.currentIdx = startIdx;

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
    clearPendingSpeechTimer();
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

    clearPendingSpeechTimer();

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
      clearPendingSpeechTimer();
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
      clearPendingSpeechTimer();
      playTimeoutRef.current = window.setTimeout(() => {
        speakSegment(stateRef.current.currentIdx, true);
      }, 150);
    }
  };

  const currentSegment = paragraphs[currentIdx] ?? null;
  const currentSourceIndex = currentSegment?.sourceIndex ?? null;
  const currentSectionTitle = currentSegment?.sectionTitle ?? null;
  const currentSegmentKind = currentSegment?.kind ?? null;

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
        currentSourceIndex,
        currentSectionTitle,
        currentSegmentKind,
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
