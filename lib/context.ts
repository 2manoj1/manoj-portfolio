import { searchKnowledge } from "./search";
import { getNode } from "./graph";

export interface CompressedContext {
  contextText: string;
  sourceNodes: { id: string; title: string; type: string }[];
  factsUsedCount: number;
  confidence: "high" | "low";
  tokenEstimate: number;
}

// In-memory cache to handle hot query path instantly
const queryCache = new Map<string, CompressedContext>();
const MAX_CACHE_SIZE = 100;

/**
 * Estimates the token count of a text string (approx. 4 characters per token).
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Executes the search -> graph expansion -> summary & fact retrieval pipeline
 * to construct a token-compressed semantic prompt context.
 */
export function getCompressedContext(query: string, maxTokens = 1200): CompressedContext {
  const normalizedQuery = query.trim().toLowerCase();
  const cacheKey = `${normalizedQuery}_${maxTokens}`;

  // Serve instantly from cache if hit
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey)!;
  }

  const searchResults = searchKnowledge(query, 5);

  if (searchResults.length === 0) {
    const fallbackResult: CompressedContext = {
      contextText: "No relevant matching context found in Manoj's systems architecture portfolio.",
      sourceNodes: [],
      factsUsedCount: 0,
      confidence: "low",
      tokenEstimate: 0,
    };
    queryCache.set(cacheKey, fallbackResult);
    return fallbackResult;
  }

  const primaryMatch = searchResults[0];
  const confidence = primaryMatch.score > 1.2 ? "high" : "low";

  const sourceNodesMap = new Map<string, { id: string; title: string; type: string }>();
  const contextParts: string[] = [];
  const factsList: string[] = [];
  let factsCount = 0;

  contextParts.push(`=== CORE ENTITY FOCUS ===`);

  // 1. Process primary matches (Top 2 search hits)
  const primarySearchHits = searchResults.slice(0, 2);
  primarySearchHits.forEach((hit) => {
    sourceNodesMap.set(hit.id, { id: hit.id, title: hit.title, type: hit.type });

    const nodeContext = getNode(hit.id);
    if (!nodeContext) return;

    // Use 100-word summaries for primary matches if confidence is high, or full content summary if confidence is low
    const summary = confidence === "high" ? nodeContext.summary_100 : nodeContext.summary_250;
    contextParts.push(`Entity [${hit.title}] (Type: ${hit.type}): ${summary}`);

    // Gather facts
    nodeContext.facts.forEach((fact) => {
      factsList.push(`Fact on ${hit.title}: ${fact}`);
      factsCount++;
    });

    // 2. Expand graph: add neighbor nodes (50-word summaries) to populate contextual relationships
    const maxNeighbors = confidence === "high" ? 4 : 2;
    nodeContext.neighbors.slice(0, maxNeighbors).forEach((neighbor) => {
      if (sourceNodesMap.has(neighbor.id)) return; // Avoid duplicate primary nodes

      sourceNodesMap.set(neighbor.id, { id: neighbor.id, title: neighbor.title, type: neighbor.type });

      const neighborContext = getNode(neighbor.id);
      if (neighborContext) {
        contextParts.push(`Related Entity [${neighbor.title}] (Relation: ${neighbor.relation} to ${hit.title}): ${neighborContext.summary_50}`);

        // Grab a couple of neighbor facts too
        neighborContext.facts.slice(0, 2).forEach((f) => {
          factsList.push(`Fact on ${neighbor.title}: ${f}`);
          factsCount++;
        });
      }
    });
  });

  // Assemble facts section
  contextParts.push(`\n=== GATHERED ARCHITECTURAL FACTS ===`);
  const deduplicatedFacts = Array.from(new Set(factsList));
  deduplicatedFacts.forEach((fact) => {
    contextParts.push(`- ${fact}`);
  });

  // Format final string
  let contextText = contextParts.join("\n");

  // Check if token limit exceeded, truncate if necessary
  let currentTokens = estimateTokens(contextText);
  if (currentTokens > maxTokens) {
    // If over limit, slice facts or related summaries
    const lines = contextText.split("\n");
    while (lines.length > 5 && estimateTokens(lines.join("\n")) > maxTokens) {
      lines.pop(); // Remove facts from the bottom to shrink size
    }
    contextText = lines.join("\n");
    currentTokens = estimateTokens(contextText);
  }

  const result: CompressedContext = {
    contextText,
    sourceNodes: Array.from(sourceNodesMap.values()),
    factsUsedCount: factsCount,
    confidence,
    tokenEstimate: currentTokens,
  };

  // Prevent memory leak by enforcing cache size limit (FIFO eviction)
  if (queryCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = queryCache.keys().next().value;
    if (oldestKey !== undefined) {
      queryCache.delete(oldestKey);
    }
  }
  queryCache.set(cacheKey, result);

  return result;
}
