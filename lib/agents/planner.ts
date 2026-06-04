import manifestData from "../../data/manifest.json";

export interface PlannerResult {
  intent: "factual_lookup" | "architecture_question" | "project_question" | "case_study_question" | "comparison_question";
  entities: string[];
  categories: string[];
}

/**
 * Classifies query intent and extracts key entities/categories from Manoj's manifest index.
 */
export function planQuery(query: string): PlannerResult {
  const normalized = query.toLowerCase().trim();
  let intent: PlannerResult["intent"] = "factual_lookup";

  // Intent Classification Rules
  if (
    normalized.includes("vs") ||
    normalized.includes("versus") ||
    normalized.includes("compare") ||
    normalized.includes("difference") ||
    normalized.includes("alternative")
  ) {
    intent = "comparison_question";
  } else if (
    normalized.includes("case study") ||
    normalized.includes("case-study") ||
    normalized.includes("kotak") ||
    normalized.includes("sapient") ||
    normalized.includes("maersk") ||
    normalized.includes("telemetry") ||
    normalized.includes("narration")
  ) {
    intent = "case_study_question";
  } else if (
    normalized.includes("project") ||
    normalized.includes("repo") ||
    normalized.includes("repository") ||
    normalized.includes("github") ||
    normalized.includes("open source") ||
    normalized.includes("open-source") ||
    normalized.includes("starter kit")
  ) {
    intent = "project_question";
  } else if (
    normalized.includes("architecture") ||
    normalized.includes("design") ||
    normalized.includes("infrastructure") ||
    normalized.includes("pattern") ||
    normalized.includes("system") ||
    normalized.includes("topology") ||
    normalized.includes("flow") ||
    normalized.includes("durable") ||
    normalized.includes("gateway")
  ) {
    intent = "architecture_question";
  }

  // Entity Extraction: Scan query for matches against manifest node IDs, titles, and aliases
  const entities: string[] = [];
  manifestData.nodes.forEach((node) => {
    const nodeId = node.id.toLowerCase();
    const nodeTitle = node.title.toLowerCase();

    // Check direct matches
    if (
      normalized.includes(nodeId) ||
      normalized.includes(nodeTitle) ||
      node.aliases.some((alias) => normalized.includes(alias.toLowerCase()))
    ) {
      entities.push(node.id);
    }
  });

  // Category Extraction: Detect types of nodes requested
  const categories: string[] = [];
  if (normalized.includes("tool") || normalized.includes("framework") || normalized.includes("library") || normalized.includes("database")) {
    categories.push("tool");
  }
  if (normalized.includes("blog") || normalized.includes("article") || normalized.includes("writing") || normalized.includes("post")) {
    categories.push("blog");
  }
  if (normalized.includes("case study") || normalized.includes("experience") || normalized.includes("work")) {
    categories.push("case_study");
  }
  if (normalized.includes("adr") || normalized.includes("decision") || normalized.includes("tradeoff")) {
    categories.push("adr");
  }

  // Default category fallback based on intent
  if (categories.length === 0) {
    if (intent === "case_study_question") categories.push("case_study");
    if (intent === "project_question") categories.push("project");
    if (intent === "architecture_question") categories.push("pattern");
  }

  return {
    intent,
    entities: Array.from(new Set(entities)),
    categories: Array.from(new Set(categories)),
  };
}
