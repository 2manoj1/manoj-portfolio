"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ExternalLink, 
  Search, 
  Terminal, 
  Filter, 
  Activity, 
  Rss,
  ChevronRight
} from "lucide-react";
import { LINKEDIN } from "@/lib/links";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface BlogArticle {
  slug: string;
  title: string;
  date: string;
  topic: string;
  readingTime: string;
  summary: string;
}

interface MediumArticle {
  title: string;
  date: string;
  topic: string;
  url: string;
}

interface BlogHubDashboardProps {
  blogArticles: readonly BlogArticle[];
  mediumArticles: readonly MediumArticle[];
}

const categories = [
  { id: "all", label: "All Spec Lanes" },
  { id: "agents", label: "Multi-Agent Graph" },
  { id: "rag", label: "pgvector & RAG" },
  { id: "backend", label: "FastAPI Backend" },
  { id: "observability", label: "observability" }
] as const;

export function BlogHubDashboard({ blogArticles, mediumArticles }: BlogHubDashboardProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [consoleMsg, setConsoleMsg] = useState<string>("system ready // awaiting execution query");

  // Filter local blog posts
  const filteredLocalArticles = useMemo(() => {
    return blogArticles.filter(art => {
      const matchSearch = 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.topic.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchSearch) return false;
      if (selectedCategory === "all") return true;
      
      const topicLower = art.topic.toLowerCase();
      if (selectedCategory === "agents") return topicLower.includes("graph") || topicLower.includes("agent");
      if (selectedCategory === "rag") return topicLower.includes("rag") || topicLower.includes("vector");
      if (selectedCategory === "backend") return topicLower.includes("fastapi") || topicLower.includes("backend");
      if (selectedCategory === "observability") return topicLower.includes("observability") || topicLower.includes("otel");
      return true;
    });
  }, [searchQuery, selectedCategory, blogArticles]);

  // Filter external Medium posts
  const filteredMediumArticles = useMemo(() => {
    return mediumArticles.filter(art => {
      const matchSearch = 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.topic.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchSearch) return false;
      if (selectedCategory === "all") return true;
      
      const topicLower = art.topic.toLowerCase();
      if (selectedCategory === "agents") return topicLower.includes("agent") || topicLower.includes("graph") || topicLower.includes("multi-agent");
      if (selectedCategory === "rag") return topicLower.includes("rag") || topicLower.includes("vector") || topicLower.includes("langgraph");
      if (selectedCategory === "backend") return topicLower.includes("fastapi") || topicLower.includes("backend") || topicLower.includes("infra");
      if (selectedCategory === "observability") return topicLower.includes("observability") || topicLower.includes("telemetry");
      return true;
    });
  }, [searchQuery, selectedCategory, mediumArticles]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim() === "") {
      setConsoleMsg("system ready // idle channel");
    } else {
      setConsoleMsg(`query matched: ${filteredLocalArticles.length + filteredMediumArticles.length} entries`);
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Search & Filter Terminal Widget */}
      <div className="overflow-hidden rounded-xl border border-border bg-secondary/15 dark:bg-zinc-950/40 shadow-lg relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
        
        {/* Terminal Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-border bg-secondary/35 dark:bg-zinc-900/30 px-6 py-4.5 gap-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-800" />
              <span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-800" />
              <span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-800" />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest pl-2 border-l border-border flex items-center gap-1.5 text-muted-foreground">
              <Terminal className="size-3 text-amber" /> journal_search_query.dll
            </span>
          </div>

          <div className="font-mono text-[8px] text-amber/60 flex items-center gap-2">
            <Activity className="size-3 text-emerald-500 animate-pulse" /> Channel Sync: ACTIVE
          </div>
        </div>

        {/* Console Search Input Box */}
        <div className="p-6 border-b border-border/60 grid gap-6 md:grid-cols-[1.5fr_1fr] items-center">
          
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-wider text-amber font-semibold block">
              &gt;_ Search AI Systems Index
            </label>
            <div className="relative border border-border bg-card rounded px-4 py-2.5 flex items-center gap-2 group focus-within:border-amber/40 transition-colors">
              <span className="font-mono text-zinc-500 text-xs select-none">console@manoj:~$</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Enter query (e.g. LangGraph, RAG, Otel)..."
                className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder-muted-foreground/55 focus:outline-none"
              />
              <Search className="size-4 text-muted-foreground/60 shrink-0 group-focus-within:text-amber transition-colors" />
            </div>
          </div>

          {/* HUD Trace Readout */}
          <div className="bg-card dark:bg-zinc-950/80 border border-border rounded p-4 font-mono text-[9px] leading-relaxed text-zinc-400 space-y-1.5">
            <div>
              <span className="text-zinc-500">{"// TRACE SUMMARY"}</span>
            </div>
            <div className="flex justify-between">
              <span>ACTIVE SCHEMA:</span>
              <span className="text-foreground/90">SYSTEM_INDEX</span>
            </div>
            <div className="flex justify-between">
              <span>LOCAL ARTICLES:</span>
              <span className="text-foreground/90">{filteredLocalArticles.length} matching</span>
            </div>
            <div className="flex justify-between">
              <span>MEDIUM ARTICLES:</span>
              <span className="text-foreground/90">{filteredMediumArticles.length} matching</span>
            </div>
            <div className="flex justify-between">
              <span>CONSOLE STATE:</span>
              <span className="text-amber animate-pulse uppercase">{consoleMsg}</span>
            </div>
          </div>

        </div>

        {/* Category filters */}
        <div className="px-6 py-4 bg-secondary/40 dark:bg-zinc-900/10 flex flex-wrap gap-1.5 items-center">
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mr-2 flex items-center gap-1">
            <Filter className="size-3" /> Filters:
          </span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded font-mono text-[9px] uppercase transition-all duration-200 border ${
                selectedCategory === cat.id
                  ? "bg-background dark:bg-zinc-950 text-amber border-amber/40 font-bold"
                  : "bg-transparent text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Main Listing Layout */}
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] items-start">
        
        {/* Left Column: Local blog featured posts */}
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-[10px] font-bold text-amber uppercase tracking-widest">{"// DEEP ARCHITECTURE JOURNAL"}</h3>
            <h2 className="text-xl font-bold text-foreground mt-1">Featured Systems Breakthroughs</h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Durable specification sheets detailing Manoj&apos;s actual production pipelines. Built with real telemetry metrics, code files, and verification evaluations.
            </p>
          </div>

          {filteredLocalArticles.length === 0 ? (
            <div className="border border-border bg-secondary/10 p-8 rounded-lg text-center font-mono text-xs text-muted-foreground/60 italic">
              No matching blog articles found in system registry.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredLocalArticles.map(article => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group relative border border-border bg-secondary/10 dark:bg-zinc-950/20 p-5 rounded-lg flex flex-col justify-between hover:border-amber/35 hover:bg-secondary/30 dark:hover:bg-zinc-900/10 transition-all duration-300"
                >
                  {/* Neon border hover effect */}
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/60 group-hover:text-amber/40 transition-colors">
                      <span>{article.topic}</span>
                      <span>{article.readingTime}</span>
                    </div>

                    <h4 className="mt-4 text-sm font-bold text-foreground leading-snug group-hover:text-amber transition-colors">
                      {article.title}
                    </h4>
                    <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/80">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber">
                    Load System Spec
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Medium feed & LinkedIn Embeds */}
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-[10px] font-bold text-amber uppercase tracking-widest">{"// DISTRIBUTION CHANNELS"}</h3>
            <h2 className="text-xl font-bold text-foreground mt-1">Medium & LinkedIn Synthesis</h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Manoj publishes general architecture guidelines and supercomputing reports to Medium, and aggregates stateful agent breakdowns to LinkedIn.
            </p>
          </div>

          {/* Medium distribution feed list */}
          <div className="border border-border bg-secondary/15 dark:bg-zinc-950/20 p-5 rounded-lg space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-2">
              <Rss className="size-3 text-amber animate-pulse" /> {"Medium Feed Distribution // Live Syndication"}
            </span>

            {filteredMediumArticles.length === 0 ? (
              <div className="font-mono text-[10px] text-muted-foreground/60 italic text-center py-4">
                No matching Medium publications found.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {filteredMediumArticles.map(article => (
                  <a
                    key={article.title}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-3 py-3.5 first:pt-0 hover:text-foreground transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground/50">
                        <span>{article.topic}</span>
                        <span>·</span>
                        <span>{article.date}</span>
                      </div>
                      <h5 className="mt-1 text-[11.5px] text-foreground font-bold leading-snug group-hover:text-amber transition-colors truncate max-w-[280px]">
                        {article.title}
                      </h5>
                    </div>
                    <ExternalLink className="size-3.5 text-zinc-600 group-hover:text-amber shrink-0 mt-2 transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Sticky LinkedIn CTA console card */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-5 rounded-lg space-y-4 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />
            
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-2.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <LinkedInIcon className="size-3.5 text-sky-500" /> linkedin_channel.exe
              </span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h4 className="text-[11px] font-mono font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
              Manoj&apos;s LinkedIn Engineering Thread Hub
            </h4>
            
            <p className="text-[10px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              Manoj shares technical solutions diagrams, RAG pipeline evaluation traces, and platform deployment topographies directly with a 2.8K+ strong developer audience.
            </p>

            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded bg-amber/10 border border-amber-300 dark:border-amber/25 hover:bg-amber hover:text-zinc-950 dark:hover:text-zinc-950 text-amber-800 dark:text-amber px-3 py-2 font-mono text-[10px] font-bold transition-all"
            >
              Connect & Review LinkedIn Feed <ExternalLink className="size-3" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
