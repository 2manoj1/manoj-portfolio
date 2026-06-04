import Graph from "graphology";
import manifestData from "../data/manifest.json";
import edgesDataRaw from "../data/graph/edges.json";

// Types
export interface GraphNode {
  id: string;
  type: string;
  title: string;
  summary: string;
  tags: string[];
  keywords: string[];
  aliases: string[];
  importance: number;
  related: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

export interface NodeContext {
  node: GraphNode;
  summary_50: string;
  summary_100: string;
  summary_250: string;
  facts: string[];
  neighbors: { id: string; title: string; type: string; relation: string }[];
}

// Eagerly instantiate and populate the Graphology graph structure at import time
const graph = new Graph({ type: "undirected" });

// Add nodes
manifestData.nodes.forEach((node) => {
  graph.addNode(node.id, { ...node });
});

const edgesData = edgesDataRaw as GraphEdge[];

edgesData.forEach((edge) => {
  if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
    if (!graph.hasEdge(edge.source, edge.target)) {
      graph.addEdge(edge.source, edge.target, { relation: edge.relation });
    }
  }
});

/**
 * Fetches a single node's attributes and summary/fact files.
 */
export function getNode(id: string): NodeContext | null {
  if (!graph.hasNode(id)) return null;

  const nodeAttributes = graph.getNodeAttributes(id) as GraphNode;
  const summaryInfo = manifestData.summaries[id as keyof typeof manifestData.summaries] as {
    id: string;
    summary_50: string;
    summary_100: string;
    summary_250: string;
    facts: string[];
  } | undefined;

  // Get neighbors
  const neighbors: { id: string; title: string; type: string; relation: string }[] = [];
  graph.forEachNeighbor(id, (neighbor: string, attributes: unknown) => {
    const edge = graph.edge(id, neighbor);
    const edgeAttributes = graph.getEdgeAttributes(edge);
    const typedAttributes = attributes as GraphNode;
    neighbors.push({
      id: neighbor,
      title: typedAttributes.title,
      type: typedAttributes.type,
      relation: edgeAttributes.relation || "related_to",
    });
  });

  return {
    node: nodeAttributes,
    summary_50: summaryInfo ? summaryInfo.summary_50 : nodeAttributes.summary,
    summary_100: summaryInfo ? summaryInfo.summary_100 : nodeAttributes.summary,
    summary_250: summaryInfo ? summaryInfo.summary_250 : nodeAttributes.summary,
    facts: summaryInfo ? summaryInfo.facts : [],
    neighbors,
  };
}

/**
 * Gets direct neighbors of a node.
 */
export function getNeighbors(id: string) {
  if (!graph.hasNode(id)) return [];

  const list: GraphNode[] = [];
  graph.forEachNeighbor(id, (neighbor: string, attributes: unknown) => {
    list.push(attributes as GraphNode);
  });
  return list;
}

/**
 * Finds top related nodes of an entity.
 */
export function findRelated(id: string, limit = 5): GraphNode[] {
  const nodeContext = getNode(id);
  if (!nodeContext) return [];

  const relatedList = nodeContext.neighbors.map((n) => {
    return graph.getNodeAttributes(n.id) as GraphNode;
  });

  return relatedList.sort((a, b) => b.importance - a.importance).slice(0, limit);
}

/**
 * BFS Implementation of shortest path between two nodes.
 */
export function findShortestPath(a: string, b: string): string[] | null {
  if (!graph.hasNode(a) || !graph.hasNode(b)) return null;
  if (a === b) return [a];

  const queue: string[][] = [[a]];
  const visited = new Set<string>([a]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    if (node === b) {
      return path;
    }

    graph.forEachNeighbor(node, (neighbor: string) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    });
  }

  return null;
}

/**
 * Expands sub-graph context up to N hops.
 */
export function expandContext(id: string, maxDepth = 2): Set<string> {
  const visited = new Set<string>();
  if (!graph.hasNode(id)) return visited;

  const traverse = (currentNode: string, currentDepth: number) => {
    visited.add(currentNode);
    if (currentDepth >= maxDepth) return;

    graph.forEachNeighbor(currentNode, (neighbor: string) => {
      traverse(neighbor, currentDepth + 1);
    });
  };

  traverse(id, 0);
  return visited;
}

/**
 * Multi-hop semantic search:
 * 1. Find the direct match node for the query from search index (top hit).
 * 2. Get the neighbor nodes and their summaries.
 * 3. Return aggregated sub-graph contexts.
 */
export function multiHopSearch(startNodeId: string, limit = 5): { node: GraphNode; relation: string }[] {
  if (!graph.hasNode(startNodeId)) return [];

  const results: { node: GraphNode; relation: string }[] = [];
  graph.forEachNeighbor(startNodeId, (neighbor: string, attributes: unknown) => {
    const edge = graph.edge(startNodeId, neighbor);
    const edgeAttributes = graph.getEdgeAttributes(edge);
    results.push({
      node: attributes as GraphNode,
      relation: edgeAttributes.relation || "related_to",
    });
  });

  return results.sort((a, b) => b.node.importance - a.node.importance).slice(0, limit);
}
