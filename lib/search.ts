import MiniSearch from "minisearch";
import manifestData from "../data/manifest.json";
import serializedIndex from "../data/search-index.json";

export interface SearchResultNode {
  id: string;
  type: string;
  title: string;
  summary: string;
  tags: string[];
  keywords: string[];
  aliases: string[];
  importance: number;
  score: number;
}

// Eagerly instantiate and deserialize search index at import time to eliminate runtime lag
const miniSearch = MiniSearch.loadJSON(JSON.stringify(serializedIndex), {
  fields: ["title", "aliases", "keywords", "tags", "summary", "facts"],
  storeFields: ["id", "type", "title", "summary", "tags", "keywords", "aliases", "importance"],
  searchOptions: {
    boost: {
      title: 2.0,
      aliases: 1.8,
      keywords: 1.5,
      tags: 1.2,
      summary: 1.0,
      facts: 1.0,
    },
    prefix: true,
    fuzzy: 0.2,
  },
});

/**
 * Searches the compiled Knowledge Graph nodes using MiniSearch.
 * Returns ranked nodes matching the query.
 */
export function searchKnowledge(query: string, limit = 10): SearchResultNode[] {
  if (!query || !query.trim()) return [];

  const results = miniSearch.search(query);

  // Map and sort results combining MiniSearch scores and node importance weights
  const mapped = results.map((res) => {
    // Retrieve node from manifest to get complete structure
    const originalNode = manifestData.nodes.find((n) => n.id === res.id);
    const importance = originalNode ? originalNode.importance : 5;

    // Combined score: MiniSearch score * normalized importance boost
    const score = res.score * (1 + (importance - 5) * 0.1);

    return {
      id: res.id as string,
      type: res.type as string,
      title: res.title as string,
      summary: res.summary as string,
      tags: (res.tags as string || "").split(" ").filter(Boolean),
      keywords: originalNode ? originalNode.keywords : [],
      aliases: originalNode ? originalNode.aliases : [],
      importance,
      score,
    };
  });

  // Sort descending by combined score
  return mapped.sort((a, b) => b.score - a.score).slice(0, limit);
}
