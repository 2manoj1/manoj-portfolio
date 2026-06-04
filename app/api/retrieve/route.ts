import { NextRequest, NextResponse } from "next/server";
import { planQuery } from "@/lib/agents/planner";
import { getCompressedContext } from "@/lib/context";
import { getNode } from "@/lib/graph";
import manifestData from "@/data/manifest.json";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(req);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimit.retryAfter?.toString() || "60",
        },
      }
    );
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query parameter is required and must be a string." },
        { status: 400 }
      );
    }

    // 1. Run Query Planner
    const plan = planQuery(query);

    // 2. Fetch Compressed Context
    const compressed = getCompressedContext(query);

    // 3. Compile sources and related links
    const sources = compressed.sourceNodes.map((s) => {
      let path = "/";
      if (s.type === "blog") {
        path = `/blog/${s.id}`;
      } else if (s.type === "case_study") {
        path = `/case-studies`;
      } else if (s.type === "service") {
        path = `/services`;
      } else if (s.type === "career") {
        path = `/resume`;
      } else if (s.type === "tool" || s.type === "adr" || s.type === "pattern") {
        path = `/architecture-lab`;
      }

      return {
        id: s.id,
        title: s.title,
        type: s.type,
        url: `${manifestData.routes.includes(path) || path.startsWith("/blog/") ? path : "/"}`,
      };
    });

    // 4. Gather facts and neighbor references
    const primaryNodeId = plan.entities[0] || (compressed.sourceNodes[0] ? compressed.sourceNodes[0].id : null);
    const relatedNodes: { id: string; title: string; type: string; relation: string }[] = [];
    const factsList: string[] = [];

    if (primaryNodeId) {
      const nodeContext = getNode(primaryNodeId);
      if (nodeContext) {
        nodeContext.facts.forEach(f => factsList.push(f));
        nodeContext.neighbors.slice(0, 4).forEach((n) => {
          relatedNodes.push({
            id: n.id,
            title: n.title,
            type: n.type,
            relation: n.relation,
          });
        });
      }
    }

    return NextResponse.json({
      query,
      intent: plan.intent,
      confidence: compressed.confidence,
      context: compressed.contextText,
      nodes: compressed.sourceNodes,
      facts: factsList.slice(0, 10),
      related: relatedNodes,
      sources,
      tokenEstimate: compressed.tokenEstimate,
    });
  } catch (error) {
    console.error("Astra Retrieval API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query query parameter is required." },
      { status: 400 }
    );
  }

  // Create a synthetic POST request logic to re-use it
  const dummyReq = new NextRequest(req.url, {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  return POST(dummyReq);
}
