"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Streamdown } from "streamdown";
import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import {
  BlogArchitectureFlow,
  type BlogDiagram,
} from "./blog-architecture-flow";
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
import { cn } from "@/lib/utils";

interface BlogSection {
  heading: string;
  body: readonly string[];
  diagram?: BlogDiagram;
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

const streamdownPlugins = { cjk, code, math, mermaid };

const markdownClassName =
  "blog-reader-markdown text-base leading-8 text-muted-foreground " +
  "[&_p]:my-0 [&_p]:leading-8 [&_strong]:font-semibold [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-100 " +
  "[&_em]:text-zinc-800 dark:[&_em]:text-zinc-300 [&_a]:font-medium [&_a]:text-amber [&_a]:underline-offset-4 [&_a:hover]:underline " +
  "[&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1.5 [&_li]:pl-1 " +
  "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-amber/45 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic " +
  "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-zinc-100 dark:[&_th]:bg-zinc-900/45 [&_th]:px-3 [&_th]:py-2 [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 " +
  "[&_[data-streamdown='inline-code']]:rounded [&_[data-streamdown='inline-code']]:border [&_[data-streamdown='inline-code']]:border-border/50 [&_[data-streamdown='inline-code']]:bg-zinc-100 dark:[&_[data-streamdown='inline-code']]:bg-zinc-900/70 [&_[data-streamdown='inline-code']]:px-1.5 [&_[data-streamdown='inline-code']]:py-0.5 [&_[data-streamdown='inline-code']]:font-mono [&_[data-streamdown='inline-code']]:text-xs [&_[data-streamdown='inline-code']]:text-amber";

const alertClassMap: Record<string, string> = {
  NOTE: "border-sky-500/45 bg-sky-100/50 dark:bg-sky-950/20 text-sky-800 dark:text-sky-100",
  TIP: "border-emerald-500/45 bg-emerald-100/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-100",
  IMPORTANT: "border-amber/55 bg-amber/10 text-amber",
  WARNING: "border-orange-500/45 bg-orange-100/50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-100",
  CAUTION: "border-rose-500/45 bg-rose-100/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-100",
};

function MarkdownBlock({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <Streamdown
      mode="static"
      className={cn(markdownClassName, className)}
      plugins={streamdownPlugins}
      shikiTheme={["dracula", "dracula"]}
      controls={{ code: { download: false } }}
    >
      {children}
    </Streamdown>
  );
}

export function BlogArticleReader({ article }: BlogArticleReaderProps) {
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(42);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  const paragraphRefs = useRef<Record<number, HTMLElement | null>>({});

  const {
    flatParagraphs,
    sectionHeadingIndices,
    sectionIndices,
    takeawayIdx,
  } = useMemo(() => {
    let count = 0;
    const blocks: string[] = [article.heroTakeaway];
    const currentTakeawayIdx = count++;
    const headingIndices: number[] = [];
    const bodyIndices: number[][] = [];

    article.sections.forEach((section) => {
      headingIndices.push(count);
      blocks.push(section.heading);
      count += 1;

      const sectionBodyIndices: number[] = [];
      section.body.forEach((paragraph) => {
        sectionBodyIndices.push(count);
        blocks.push(paragraph);
        count += 1;
      });
      bodyIndices.push(sectionBodyIndices);
    });

    return {
      flatParagraphs: blocks,
      sectionHeadingIndices: headingIndices,
      sectionIndices: bodyIndices,
      takeawayIdx: currentTakeawayIdx,
    };
  }, [article]);

  const estimatedWordCount = useMemo(
    () => flatParagraphs.join(" ").split(/\s+/).filter(Boolean).length,
    [flatParagraphs],
  );

  // Helper to render markdown, callouts, blockquotes, lists, tables, inline code, and links.
  const renderParagraph = (paragraph: string, isActive: boolean, globalIdx: number) => {
    // Alert syntax: [!NOTE] content
    const alertMatch = paragraph.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/);
    const wrapperClassName = cn(
      "relative rounded-md border-l transition-all duration-300",
      isActive
        ? "border-amber bg-amber/5 pl-4 shadow-[0_0_15px_rgba(245,158,11,0.03)]"
        : "border-transparent"
    );

    if (alertMatch) {
      const type = alertMatch[1];
      const content = alertMatch[2];
      return (
        <aside
          key={`paragraph-${globalIdx}`}
          ref={el => { paragraphRefs.current[globalIdx] = el; }}
          className={cn(
            "my-2 rounded-md border p-4",
            alertClassMap[type] ?? alertClassMap.NOTE,
            isActive && "ring-1 ring-amber/45",
          )}
        >
          <strong className="block font-mono text-xs uppercase tracking-wide">{type}</strong>
          <MarkdownBlock className="mt-2 text-sm leading-6">{content}</MarkdownBlock>
        </aside>
      );
    }

    return (
      <div
        key={`paragraph-${globalIdx}`}
        className={wrapperClassName}
        ref={el => { paragraphRefs.current[globalIdx] = el; }}
      >
        {isActive && (
          <span className="absolute -left-1 top-4 inline-block size-1.5 rounded-full bg-amber animate-ping" />
        )}
        <MarkdownBlock>{paragraph}</MarkdownBlock>
      </div>
    );
  };

  // Determine which section is currently active based on active paragraph index
  const activeSectionIdx = useMemo(() => {
    if (activeParagraphIndex === null) return null;
    if (activeParagraphIndex === takeawayIdx) return -1; // -1 represents the hero takeaway
    
    let activeSec = 0;
    for (let i = 0; i < sectionIndices.length; i++) {
      if (
        sectionHeadingIndices[i] === activeParagraphIndex ||
        sectionIndices[i].includes(activeParagraphIndex)
      ) {
        activeSec = i;
        break;
      }
    }
    return activeSec;
  }, [activeParagraphIndex, sectionHeadingIndices, sectionIndices, takeawayIdx]);

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
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(260px,0.28fr)] lg:gap-12">
      
      {/* Left Column: Article Body & Interactive Player */}
      <div className="min-w-0 space-y-8">
        
        {/* Audiobook controller section */}
        <div className="sticky top-14 z-[70] lg:top-20">
          <div className="pointer-events-none absolute -inset-0.5 rounded-lg bg-gradient-to-r from-amber/25 to-zinc-500/10 opacity-50 blur-sm" />
          <BlogAudioBook 
            paragraphs={flatParagraphs} 
            title={article.title}
            onParagraphChange={(idx) => setActiveParagraphIndex(idx)}
          />
        </div>

        <nav
          aria-label="Mobile article outline"
          className="lg:hidden"
        >
          <div className="flex gap-2 overflow-x-auto border-y border-border py-3">
            <button
              onClick={() => {
                const el = document.querySelector("article");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={cn(
                "shrink-0 rounded-md border px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wide",
                activeSectionIdx === -1
                  ? "border-amber/50 bg-amber/10 text-amber"
                  : "border-zinc-200 dark:border-border bg-zinc-100/50 dark:bg-zinc-950/25 text-muted-foreground",
              )}
              type="button"
            >
              00 Takeaway
            </button>
            {article.sections.map((section, idx) => (
              <button
                key={section.heading}
                onClick={() => scrollToSection(idx)}
                className={cn(
                  "max-w-[220px] shrink-0 truncate rounded-md border px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wide",
                  activeSectionIdx === idx
                    ? "border-amber/50 bg-amber/10 text-amber"
                    : "border-zinc-200 dark:border-border bg-zinc-100/50 dark:bg-zinc-950/25 text-muted-foreground",
                )}
                type="button"
              >
                0{idx + 1} {section.heading}
              </button>
            ))}
          </div>
        </nav>

        {/* Content Article */}
        <article className="min-w-0 space-y-12">

          {/* Why this matters / Hero takeaway */}
          <div
            ref={el => { paragraphRefs.current[0] = el; }}
            className={`border-y border-border py-8 transition-all duration-300 relative ${
              activeParagraphIndex === takeawayIdx
                ? "border-amber bg-amber/5 px-4 shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                : ""
            }`}
          >
            {activeParagraphIndex === takeawayIdx && (
              <span className="absolute top-2 right-4 font-mono text-[8px] text-amber uppercase tracking-wider animate-pulse">
                [AUDIO EMISSION ACTIVE]
              </span>
            )}
            <p className="font-mono text-xs uppercase tracking-wide text-amber">
              Why this matters
            </p>
            <p className="mt-4 text-xl leading-8 text-foreground sm:text-2xl sm:leading-10">
              {article.heroTakeaway}
            </p>
          </div>

          {/* Render Sections */}
          <div className="space-y-14">
            {article.sections.map((section, sIdx) => (
              <section key={section.heading} className="scroll-mt-20">
                <h2
                  id={`section-heading-${sIdx}`}
                  ref={el => { paragraphRefs.current[sectionHeadingIndices[sIdx]] = el; }}
                  className={`font-display text-2xl md:text-3xl font-normal text-foreground border-b border-border pb-3 transition-colors duration-300 ${
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

                {section.diagram && (
                  <BlogArchitectureFlow
                    diagram={section.diagram}
                    active={activeSectionIdx === sIdx}
                  />
                )}

                {/* Code Block */}
                {section.codeBlock && (
                  <div className="mt-7 overflow-hidden rounded-lg border border-border bg-[#0d0d0d] shadow-lg">
                    <div className="bg-zinc-100 dark:bg-zinc-950 px-4 py-2 border-b border-zinc-250 dark:border-border/80 text-[10px] text-zinc-700 dark:text-muted-foreground tracking-wide flex justify-between select-none">
                      <span>{section.codeBlock.filename}</span>
                      <span className="uppercase text-[9px] text-amber">{section.codeBlock.language}</span>
                    </div>
                    <div className="streamdown-code-clean p-4 text-zinc-300">
                      <MarkdownBlock>
                        {`\`\`\`${section.codeBlock.language}\n${section.codeBlock.code}\n\`\`\``}
                      </MarkdownBlock>
                    </div>
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
              type="button"
            >
              <Heart className={`size-4 ${hasLiked ? "fill-current" : ""}`} /> {likes} claps
            </button>
            <span className="text-zinc-200 dark:text-zinc-800">|</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-4" /> {article.readingTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-200 dark:border-border bg-zinc-100 dark:bg-zinc-900/30 hover:bg-zinc-200 dark:hover:bg-zinc-900/60 text-zinc-700 dark:text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground transition-colors"
              type="button"
            >
              <Share2 className="size-3.5" /> 
              {copiedLink ? "Link Copied!" : "Share Spec"}
            </button>
          </div>
        </div>



      </div>

      {/* Right Column: Sticky HUD outline & Observatory */}
      <aside className="hidden space-y-8 lg:sticky lg:top-24 lg:block lg:self-start">
        
        {/* Interactive SVG TOC Node Graph */}
        <div className="border border-zinc-200 dark:border-border bg-zinc-100/20 dark:bg-zinc-950/20 p-5 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
          <p className="font-mono text-xs uppercase tracking-wide text-amber border-b border-zinc-200 dark:border-zinc-900 pb-2">
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
                  aria-label="Scroll to article takeaway"
                  className={`size-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                    activeSectionIdx === -1 
                      ? "border-amber bg-amber/25 shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-[1.2]" 
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-amber/50"
                  }`}
                  title="Why this matters"
                  type="button"
                >
                  <div className={`size-1.5 rounded-full ${activeSectionIdx === -1 ? 'bg-amber' : 'bg-zinc-350 dark:bg-zinc-700'}`} />
                </button>

                {article.sections.map((section, idx) => {
                  const isActive = activeSectionIdx === idx;
                  const isPassed =
                    activeSectionIdx !== null &&
                    activeParagraphIndex !== null &&
                    activeParagraphIndex >= sectionHeadingIndices[idx];
                  
                  return (
                    <React.Fragment key={section.heading}>
                      {/* Connecting Edge Line */}
                      <div className={`w-0.5 flex-1 h-8 my-0.5 transition-colors duration-300 ${
                        isPassed ? "bg-amber/40" : "bg-zinc-200 dark:bg-zinc-900"
                      }`} />
                      
                      {/* Section Node */}
                      <button
                        onClick={() => scrollToSection(idx)}
                        aria-label={`Scroll to ${section.heading}`}
                        className={`size-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                          isActive 
                            ? "border-amber bg-amber/25 shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-[1.2]" 
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-amber/50"
                        }`}
                        title={section.heading}
                        type="button"
                      >
                        <div className={`size-1.5 rounded-full ${isActive ? 'bg-amber' : 'bg-zinc-350 dark:bg-zinc-700'}`} />
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
                  aria-label="Scroll to article takeaway"
                  className={`text-left text-[10px] font-mono uppercase tracking-wide transition-colors ${
                    activeSectionIdx === -1 ? "text-amber font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                  type="button"
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
                      type="button"
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
        <div className="border border-zinc-200 dark:border-border bg-zinc-100/20 dark:bg-zinc-950/20 p-5 rounded-lg relative overflow-hidden">
          <p className="font-mono text-xs uppercase tracking-wide text-amber border-b border-zinc-200 dark:border-zinc-900 pb-2 flex items-center gap-1.5">
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

        {/* Reader signal panel */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg font-mono text-[9px] leading-relaxed relative">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-2 mb-3">
            <span className="text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <Terminal className="size-3 text-amber" /> reader_pipeline.sys
            </span>
            <span className="text-emerald-500 uppercase tracking-wider font-semibold">SECURE // OK</span>
          </div>
          <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
            <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-900 pb-1">
              <span className="text-zinc-500">ARTICLE STATE</span>
              <span className="text-zinc-800 dark:text-zinc-200">CLIENT READY</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-900 pb-1">
              <span className="text-zinc-500">MARKDOWN PIPELINE</span>
              <span className="text-zinc-800 dark:text-zinc-200">STREAMDOWN</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-900 pb-1">
              <span className="text-zinc-500">DIAGRAM ENGINE</span>
              <span className="text-amber">REACT FLOW</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-900 pb-1">
              <span className="text-zinc-500">AUDIO SEGMENTS</span>
              <span className="text-zinc-800 dark:text-zinc-200">{flatParagraphs.length}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-900 pb-1">
              <span className="text-zinc-500">EST. WORDS</span>
              <span className="text-emerald-600 dark:text-emerald-400">{estimatedWordCount}</span>
            </div>
          </div>
          <div className="mt-3.5 text-[8px] text-zinc-500 dark:text-zinc-600 leading-normal flex items-center gap-1 bg-zinc-100/50 dark:bg-zinc-900/30 p-2 border border-zinc-200 dark:border-zinc-900/60 rounded">
            <ShieldCheck className="size-3 text-emerald-500 shrink-0" />
            <span>OpenTelemetry convention signals streaming active.</span>
          </div>
        </div>

        {/* References widget */}
        {article.references && article.references.length > 0 && (
          <div className="border border-zinc-200 dark:border-border bg-zinc-100/20 dark:bg-zinc-950/20 p-5 rounded-lg">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/75 border-b border-zinc-200 dark:border-zinc-900 pb-2">
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
