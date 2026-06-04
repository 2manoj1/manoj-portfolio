"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { BlogAudioBook } from "./blog-audio-book";
import { 
  ArrowRight, 
  ExternalLink, 
  Terminal, 
  Activity, 
  BookOpen, 
  Share2, 
  ShieldCheck, 
  Heart
} from "lucide-react";

interface BlogSection {
  heading: string;
  body: readonly string[];
  codeBlock?: {
    language: string;
    filename: string;
    code: string;
  };
}

interface BlogArticle {
  slug: string;
  title: string;
  date: string;
  topic: string;
  readingTime: string;
  summary: string;
  seoDescription: string;
  keywords: readonly string[];
  heroTakeaway: string;
  architectureSignals: readonly string[];
  sections: readonly BlogSection[];
  references: readonly { label: string; url: string }[];
}

interface BlogArticleReaderProps {
  article: BlogArticle;
}

export function BlogArticleReader({ article }: BlogArticleReaderProps) {
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(42);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  const paragraphRefs = useRef<Record<number, HTMLParagraphElement | null>>({});

  // Flatten all paragraphs for speech synthesis (takeaway + all section bodies)
  const flatParagraphs = useMemo(() => {
    const list: string[] = [];
    list.push(article.heroTakeaway);
    article.sections.forEach(sec => {
      sec.body.forEach(para => {
        list.push(para);
      });
    });
    return list;
  }, [article]);

  // Map section/paragraph index to flat global index
  // Helper to render paragraphs with alerts, blockquotes, and inline code
  const renderParagraph = (paragraph: string, isActive: boolean, globalIdx: number) => {
    // Alert syntax: [!NOTE] content
    const alertMatch = paragraph.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/);
    if (alertMatch) {
      const type = alertMatch[1];
      const content = alertMatch[2];
      const typeClassMap: Record<string, string> = {
        NOTE: 'bg-blue-900/30 border-l-4 border-blue-500 text-blue-200',
        TIP: 'bg-green-900/30 border-l-4 border-green-500 text-green-200',
        IMPORTANT: 'bg-amber-900/30 border-l-4 border-amber-500 text-amber-200',
        WARNING: 'bg-orange-900/30 border-l-4 border-orange-500 text-orange-200',
        CAUTION: 'bg-red-900/30 border-l-4 border-red-500 text-red-200',
      };
      const className = typeClassMap[type] || '';
      return (
        <div key={`paragraph-${globalIdx}`} className={`p-4 rounded-md my-2 ${className}`}>
          <strong className="block uppercase text-xs mb-1">{type}</strong>
          <p className="text-sm leading-6">{content}</p>
        </div>
      );
    }

    // Blockquote syntax: lines starting with >
    if (paragraph.startsWith('>')) {
      const quote = paragraph.replace(/^>\s?/, '');
      return (
        <blockquote
          key={`paragraph-${globalIdx}`}
          className="border-l-4 border-amber-500 pl-4 italic text-muted-foreground my-4"
        >
          {quote}
        </blockquote>
      );
    }

    // Default paragraph rendering with inline code handling
    const parts = paragraph.split(/(`[^`]+`)/g);
    return (
      <p
        key={`paragraph-${globalIdx}`}
        className={`text-base leading-8 text-muted-foreground transition-all duration-300 p-2 rounded ${
          isActive
            ? 'border-l-2 border-amber bg-amber/5 pl-4 text-zinc-100 shadow-[0_0_15px_rgba(245,158,11,0.03)]'
            : 'border-l border-transparent'
        }`}
        ref={el => { paragraphRefs.current[globalIdx] = el; }}
      >
        {isActive && (
          <span className="inline-block size-1.5 rounded-full bg-amber mr-2 animate-ping" />
        )}
        {parts.map((part, partIdx) => {
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code
                key={`${globalIdx}-code-${partIdx}`}
                className="rounded bg-secondary/50 px-1.5 py-0.5 font-mono text-xs text-amber font-semibold border border-border/40"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          return <React.Fragment key={`${globalIdx}-text-${partIdx}`}>{part}</React.Fragment>;
        })}
      </p>
    );
  };

  const { sectionIndices } = useMemo(() => {
    let count = 0;
    const takeawayIdx = count++;
    
    const indices: number[][] = [];
    const sectionStarts: number[] = [];

    article.sections.forEach((section) => {
      sectionStarts.push(count);
      const sectionIndicesList: number[] = [];
      section.body.forEach(() => {
        sectionIndicesList.push(count++);
      });
      indices.push(sectionIndicesList);
    });

    return {
      takeawayIdx,
      sectionIndices: indices,
      sectionStarts
    };
  }, [article]);

  // Determine which section is currently active based on active paragraph index
  const activeSectionIdx = useMemo(() => {
    if (activeParagraphIndex === null) return null;
    if (activeParagraphIndex === 0) return -1; // -1 represents the hero takeaway
    
    let activeSec = 0;
    for (let i = 0; i < sectionIndices.length; i++) {
      if (sectionIndices[i].includes(activeParagraphIndex)) {
        activeSec = i;
        break;
      }
    }
    return activeSec;
  }, [activeParagraphIndex, sectionIndices]);

  // Scroll active paragraph smoothly into view
  useEffect(() => {
    if (activeParagraphIndex !== null && paragraphRefs.current[activeParagraphIndex]) {
      paragraphRefs.current[activeParagraphIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeParagraphIndex]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    } else {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    }
  };

  const scrollToSection = (index: number) => {
    const headingElement = document.getElementById(`section-heading-${index}`);
    if (headingElement) {
      headingElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };



  return (
    <div className="grid gap-12 lg:grid-cols-[0.72fr_0.28fr] items-start">
      
      {/* Left Column: Article Body & Interactive Player */}
      <div className="space-y-8 min-w-0">
        
        {/* Audiobook controller section */}
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-amber/30 to-fuchsia-500/10 opacity-30 blur-sm pointer-events-none" />
          <BlogAudioBook 
            paragraphs={flatParagraphs} 
            title={article.title}
            onParagraphChange={(idx) => setActiveParagraphIndex(idx)}
          />
        </div>

        {/* Content Article */}
        <article className="min-w-0 space-y-12">
          
          {/* Why this matters / Hero takeaway */}
          <div 
            ref={el => { paragraphRefs.current[0] = el; }}
            className={`border-y border-border py-8 transition-all duration-300 relative ${
              activeParagraphIndex === 0 
                ? "border-amber bg-amber/5 px-4 shadow-[0_0_20px_rgba(245,158,11,0.08)]" 
                : ""
            }`}
          >
            {activeParagraphIndex === 0 && (
              <span className="absolute top-2 right-4 font-mono text-[8px] text-amber uppercase tracking-wider animate-pulse">
                [AUDIO EMISSION ACTIVE]
              </span>
            )}
            <p className="font-mono text-xs uppercase tracking-wide text-amber">
              Why this matters
            </p>
            <p className="mt-4 text-2xl leading-10 text-foreground">
              {article.heroTakeaway}
            </p>
          </div>

          {/* Render Sections */}
          <div className="space-y-14">
            {article.sections.map((section, sIdx) => (
              <section key={section.heading} className="scroll-mt-20">
                <h2 
                  id={`section-heading-${sIdx}`}
                  className={`font-display text-2xl md:text-3xl font-normal text-foreground border-b border-zinc-900 pb-3 transition-colors duration-300 ${
                    activeSectionIdx === sIdx ? "text-amber" : ""
                  }`}
                >
                  {section.heading}
                </h2>
                
                <div className="mt-6 space-y-6">
                  {section.body.map((paragraph, pIdx) => {
                    const globalIdx = sectionIndices[sIdx][pIdx];
                    const isActive = activeParagraphIndex === globalIdx;
                    return (
                      <React.Fragment key={`section-${sIdx}-paragraph-${globalIdx}`}>
                        {renderParagraph(paragraph, isActive, globalIdx)}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Code Block */}
                {section.codeBlock && (
                  <div className="mt-6 overflow-hidden rounded-lg border border-border bg-[#0d0d0d] font-mono text-[11px] leading-relaxed shadow-lg">
                    {section.codeBlock.filename && (
                      <div className="bg-zinc-950 px-4 py-2 border-b border-border/80 text-[10px] text-muted-foreground tracking-wide flex justify-between select-none">
                        <span>{section.codeBlock.filename}</span>
                        <span className="uppercase text-[9px] text-amber">{section.codeBlock.language}</span>
                      </div>
                    )}
                    <pre className="p-4 overflow-x-auto text-zinc-300">
                      <code>{section.codeBlock.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}
          </div>

        </article>

        {/* Futuristic Interaction Footer Stats */}
        <div className="border-t border-border pt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${hasLiked ? "text-rose-500" : "hover:text-foreground"}`}
            >
              <Heart className={`size-4 ${hasLiked ? "fill-current" : ""}`} /> {likes} claps
            </button>
            <span className="text-zinc-800">|</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-4" /> {article.readingTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-zinc-900/30 hover:bg-zinc-900/60 hover:text-foreground transition-colors"
            >
              <Share2 className="size-3.5" /> 
              {copiedLink ? "Link Copied!" : "Share Spec"}
            </button>
          </div>
        </div>



      </div>

      {/* Right Column: Sticky HUD HUD outline & Observatory */}
      <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
        
        {/* Interactive SVG TOC Node Graph */}
        <div className="border border-border bg-zinc-950/20 p-5 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
          <p className="font-mono text-xs uppercase tracking-wide text-amber border-b border-zinc-900 pb-2">
            System Graph Outline
          </p>
          
          <div className="mt-5 relative">
            {/* Outline list with SVG Graph indicators */}
            <div className="flex gap-4">
              
              {/* Vertical connecting line indicator */}
              <div className="relative flex flex-col items-center shrink-0 w-4">
                {/* Takeaway Node indicator */}
                <button 
                  onClick={() => {
                    const el = document.querySelector("article");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`size-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                    activeSectionIdx === -1 
                      ? "border-amber bg-amber/25 shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-[1.2]" 
                      : "border-zinc-800 bg-zinc-950 hover:border-amber/50"
                  }`}
                  title="Why this matters"
                >
                  <div className={`size-1.5 rounded-full ${activeSectionIdx === -1 ? 'bg-amber' : 'bg-zinc-700'}`} />
                </button>

                {article.sections.map((_, idx) => {
                  const isActive = activeSectionIdx === idx;
                  const isPassed = activeSectionIdx !== null && activeParagraphIndex !== null && activeParagraphIndex >= sectionIndices[idx][0];
                  
                  return (
                    <React.Fragment key={idx}>
                      {/* Connecting Edge Line */}
                      <div className={`w-0.5 flex-1 h-8 my-0.5 transition-colors duration-300 ${
                        isPassed ? "bg-amber/40" : "bg-zinc-900"
                      }`} />
                      
                      {/* Section Node */}
                      <button
                        onClick={() => scrollToSection(idx)}
                        className={`size-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                          isActive 
                            ? "border-amber bg-amber/25 shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-[1.2]" 
                            : "border-zinc-800 bg-zinc-950 hover:border-amber/50"
                        }`}
                        title={article.sections[idx].heading}
                      >
                        <div className={`size-1.5 rounded-full ${isActive ? 'bg-amber' : 'bg-zinc-700'}`} />
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Text list matching nodes */}
              <div className="flex-1 flex flex-col justify-between py-0.5 gap-7.5">
                <button 
                  onClick={() => {
                    const el = document.querySelector("article");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`text-left text-[10px] font-mono uppercase tracking-wide transition-colors ${
                    activeSectionIdx === -1 ? "text-amber font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  00 // Why this matters
                </button>

                {article.sections.map((section, idx) => {
                  const isActive = activeSectionIdx === idx;
                  return (
                    <button
                      key={section.heading}
                      onClick={() => scrollToSection(idx)}
                      className={`text-left text-[10px] font-mono uppercase tracking-wide truncate max-w-[200px] transition-colors ${
                        isActive ? "text-amber font-bold" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      0{idx + 1}{" // "}{section.heading}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* Technical Signals console */}
        <div className="border border-border bg-zinc-950/20 p-5 rounded-lg relative overflow-hidden">
          <p className="font-mono text-xs uppercase tracking-wide text-amber border-b border-zinc-900 pb-2 flex items-center gap-1.5">
            <Activity className="size-3.5 text-amber animate-pulse" /> Architecture Signals
          </p>
          <ul className="mt-5 space-y-4">
            {article.architectureSignals.map((signal) => (
              <li
                key={signal}
                className="flex gap-3 text-xs leading-5 text-muted-foreground"
              >
                <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-amber" />
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dev Debugger Panel (Iron Man style) */}
        <div className="border border-zinc-800 bg-zinc-950 p-4 rounded-lg font-mono text-[9px] leading-relaxed relative">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
            <span className="text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <Terminal className="size-3 text-amber" /> sys_observability.dll
            </span>
            <span className="text-emerald-500 uppercase tracking-wider font-semibold">SECURE // OK</span>
          </div>
          <div className="space-y-2 text-zinc-400">
            <div className="flex justify-between border-b border-zinc-900 pb-1">
              <span className="text-zinc-500">SEO INDEX STATUS</span>
              <span className="text-zinc-200">GOOGLE-INDEXED</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1">
              <span className="text-zinc-500">SCHEMA VERIFICATION</span>
              <span className="text-zinc-200">SCHEMA.ORG: OK</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1">
              <span className="text-zinc-500">P95 LATENCY ESTIMATION</span>
              <span className="text-amber">184ms</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1">
              <span className="text-zinc-500">TOKEN WEIGHT</span>
              <span className="text-zinc-200">{flatParagraphs.join(" ").split(" ").length * 1.3} tk</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1">
              <span className="text-zinc-500">OPTIMIZED INF COST</span>
              <span className="text-emerald-400">$0.0034</span>
            </div>
          </div>
          <div className="mt-3.5 text-[8px] text-zinc-600 leading-normal flex items-center gap-1 bg-zinc-900/30 p-2 border border-zinc-900/60 rounded">
            <ShieldCheck className="size-3 text-emerald-500 shrink-0" />
            <span>OpenTelemetry convention signals streaming active.</span>
          </div>
        </div>

        {/* References widget */}
        {article.references && article.references.length > 0 && (
          <div className="border border-border bg-zinc-950/20 p-5 rounded-lg">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/75 border-b border-zinc-900 pb-2">
              Resource Indexes
            </p>
            <div className="mt-5 space-y-3.5">
              {article.references.map((reference) => (
                <a
                  key={reference.url}
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-3 text-xs leading-5 text-muted-foreground transition-colors hover:text-amber"
                >
                  <span>{reference.label}</span>
                  <ExternalLink className="mt-0.5 size-3.5 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

      </aside>

    </div>
  );
}
