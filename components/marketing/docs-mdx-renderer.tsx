"use client";

import React, { useMemo } from "react";
import { Streamdown } from "streamdown";
import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { BlogArchitectureFlow } from "./blog-architecture-flow";
import { diagramsData } from "@/content/docs/diagrams-data";

interface DocsMdxRendererProps {
  content: string;
}

const streamdownPlugins = { cjk, code, math, mermaid };
const disabledLinkSafety = { enabled: false };

const mdxMarkdownClass =
  "docs-markdown text-muted-foreground text-sm leading-7 " +
  "[&_p]:my-4 [&_p]:leading-7 [&_strong]:font-semibold [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-100 " +
  "[&_em]:text-foreground/80 [&_a]:font-medium [&_a]:text-amber [&_a]:underline-offset-4 [&_a:hover]:underline " +
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-2 [&_li]:pl-1 " +
  "[&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-amber/45 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic " +
  "[&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-zinc-100 dark:[&_th]:bg-zinc-900/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-foreground [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs " +
  "[&_[data-streamdown='inline-code']]:rounded [&_[data-streamdown='inline-code']]:border [&_[data-streamdown='inline-code']]:border-border/40 [&_[data-streamdown='inline-code']]:bg-zinc-100 dark:[&_[data-streamdown='inline-code']]:bg-zinc-900/80 [&_[data-streamdown='inline-code']]:px-1.5 [&_[data-streamdown='inline-code']]:py-0.5 [&_[data-streamdown='inline-code']]:font-mono [&_[data-streamdown='inline-code']]:text-xs [&_[data-streamdown='inline-code']]:text-amber";

const alertClassMap: Record<string, string> = {
  NOTE: "border-sky-500/40 bg-sky-100/50 dark:bg-sky-950/10 text-sky-800 dark:text-sky-100 [&_strong]:text-sky-600 dark:[&_strong]:text-sky-400",
  TIP: "border-emerald-500/40 bg-emerald-100/50 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-100 [&_strong]:text-emerald-600 dark:[&_strong]:text-emerald-400",
  IMPORTANT: "border-amber/45 bg-amber/5 text-amber [&_strong]:text-amber",
  WARNING: "border-orange-500/40 bg-orange-100/50 dark:bg-orange-950/10 text-orange-800 dark:text-orange-100 [&_strong]:text-orange-600 dark:[&_strong]:text-orange-400",
  CAUTION: "border-rose-500/40 bg-rose-100/50 dark:bg-rose-950/10 text-rose-800 dark:text-rose-100 [&_strong]:text-rose-600 dark:[&_strong]:text-rose-400",
};

/**
 * Pre-processes headings and alert callout syntax into HTML block structures.
 */
function preProcessMarkdown(text: string): string {
  let processed = text;

  // 1. Transform markdown headings ## Header into HTML h2/h3 headings with IDs
  processed = processed.replace(/^(#{2,3})\s+(.*)$/gm, (match, hashes, textContent) => {
    const level = hashes.length; // 2 or 3
    const cleanText = textContent.replace(/\[!.*?\]/g, "").trim();
    const id = cleanText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `<h${level} id="${id}" class="font-display text-lg sm:text-xl font-normal text-foreground mt-8 mb-4 border-b border-border pb-2">${cleanText}</h${level}>`;
  });

  // 2. Transform callout blocks [!NOTE] content or blockquotes > [!NOTE] content
  // First, parse blockquote alerts like:
  // > [!NOTE]
  // > Some text
  processed = processed.replace(
    /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:>\s*.*\n?)*)/gm,
    (match, type, bodyLines) => {
      const cleanBody = bodyLines
        .split("\n")
        .map((line: string) => line.replace(/^>\s*/, ""))
        .join("\n")
        .trim();
        
      const classes = alertClassMap[type] || alertClassMap.NOTE;
      return `<div class="my-5 rounded-md border p-4 ${classes}"><strong class="block font-mono text-xs uppercase tracking-wide">${type}</strong><div class="mt-2 text-sm leading-6">${cleanBody}</div></div>\n`;
    }
  );

  // Then parse inline alerts like [!NOTE] content
  processed = processed.replace(
    /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/gm,
    (match, type, content) => {
      const classes = alertClassMap[type] || alertClassMap.NOTE;
      return `<div class="my-5 rounded-md border p-4 ${classes}"><strong class="block font-mono text-xs uppercase tracking-wide">${type}</strong><div class="mt-2 text-sm leading-6">${content}</div></div>\n`;
    }
  );

  return processed;
}

export function DocsMdxRenderer({ content }: DocsMdxRendererProps) {
  // Split content by `<InteractiveDiagram name="xxx" />` tags to interleave MDX blocks and diagrams
  const renderingBlocks = useMemo(() => {
    const regex = /(<InteractiveDiagram\s+name="[^"]+"\s*\/>)/g;
    const parts = content.split(regex);
    
    return parts.map((part, index) => {
      const diagramMatch = part.match(/<InteractiveDiagram\s+name="([^"]+)"\s*\/>/);
      
      if (diagramMatch) {
        const diagramName = diagramMatch[1];
        const diagram = diagramsData[diagramName];
        
        return {
          type: "diagram" as const,
          name: diagramName,
          element: diagram ? (
            <div key={`diagram-wrapper-${index}`} className="my-6">
              <BlogArchitectureFlow diagram={diagram} active={true} />
            </div>
          ) : (
            <div key={`diagram-err-${index}`} className="my-4 rounded border border-rose-500/30 bg-rose-950/10 p-3 text-xs text-rose-400">
              [Diagram configuration &apos;{diagramName}&apos; not found in dataset]
            </div>
          ),
        };
      }
      
      return {
        type: "markdown" as const,
        rawText: part,
        element: (
          <Streamdown
            key={`md-block-${index}`}
            mode="static"
            className={mdxMarkdownClass}
            plugins={streamdownPlugins}
            shikiTheme={["dracula", "dracula"]}
            controls={{ code: { download: false } }}
            linkSafety={disabledLinkSafety}
          >
            {preProcessMarkdown(part)}
          </Streamdown>
        ),
      };
    });
  }, [content]);

  return <div className="space-y-4">{renderingBlocks.map((block) => block.element)}</div>;
}
