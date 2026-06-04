import * as fs from "fs";
import * as path from "path";
import MiniSearch from "minisearch";

// Import source data directly from TS source files
import { blogArticles } from "../content/blog";
import { services, engineeringSystems, careerJourney } from "../content/site";
import { radarItems } from "../content/radar";
import { caseStudies as detailedCaseStudies } from "../app/case-studies/_data/case-studies";

// Interface Definitions to match user requirements
interface KnowledgeNode {
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

interface Relationship {
  source: string;
  target: string;
  relation: string;
}

interface SummaryData {
  id: string;
  summary_50: string;
  summary_100: string;
  summary_250: string;
  facts: string[];
}

interface Manifest {
  nodes: KnowledgeNode[];
  categories: string[];
  tags: string[];
  routes: string[];
  summaries: Record<string, SummaryData>;
}

// Helper to sanitize text and normalize IDs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Heuristic to slice text to approximate word count
function truncateToWords(text: string, count: number): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= count) return text;
  return words.slice(0, count).join(" ") + "...";
}

function run() {
  console.log("Initializing Astra Knowledge Graph Generation...");

  const nodes: KnowledgeNode[] = [];
  const edges: Relationship[] = [];
  const summaries: Record<string, SummaryData> = {};

  const allTags = new Set<string>();
  const categories = new Set<string>();

  // 1. Process Blog Articles
  blogArticles.forEach((article) => {
    const id = article.slug;
    categories.add("blog");
    article.keywords.forEach(k => allTags.add(k.toLowerCase()));

    const node: KnowledgeNode = {
      id,
      type: "blog",
      title: article.title,
      summary: article.summary,
      tags: article.keywords.map(k => k.toLowerCase()),
      keywords: [...article.keywords],
      aliases: [article.title, article.topic],
      importance: 9,
      related: []
    };
    nodes.push(node);

    // Extract facts (explicitly typed as string[])
    const facts: string[] = [...article.architectureSignals];
    article.sections.forEach(s => {
      s.body.forEach(p => {
        if (p.startsWith(">")) {
          facts.push(p.replace(/^>\s*\"?|\"?\s*$/g, ""));
        }
      });
    });

    const s50 = truncateToWords(article.summary, 50);
    const s100 = truncateToWords(`${article.summary} Key takeaway: ${article.heroTakeaway}`, 100);
    const fullBody = article.sections.map(s => `${s.heading}: ${s.body.join(" ")}`).join(" ");
    const s250 = truncateToWords(`${article.summary} Takeaway: ${article.heroTakeaway} Context: ${fullBody}`, 250);

    summaries[id] = {
      id,
      summary_50: s50,
      summary_100: s100,
      summary_250: s250,
      facts: facts.slice(0, 10)
    };
  });

  // 2. Process Tools (Radar Items)
  radarItems.forEach((item) => {
    const id = item.id;
    categories.add("tool");
    allTags.add(item.quadrant.toLowerCase());
    allTags.add(item.ring.toLowerCase());

    const node: KnowledgeNode = {
      id,
      type: "tool",
      title: item.name,
      summary: item.insight,
      tags: [item.quadrant.toLowerCase(), item.ring.toLowerCase()],
      keywords: [item.name, item.quadrant, item.ring],
      aliases: [item.name],
      importance: 8,
      related: []
    };
    nodes.push(node);

    const facts = [
      `${item.name} is classified in the ${item.ring} ring for ${item.quadrant}.`,
      item.insight
    ];
    if (item.adr) {
      facts.push(`ADR Problem: ${item.adr.problem}`);
      facts.push(`ADR Decision: ${item.adr.decision}`);
      facts.push(`ADR Tradeoff: ${item.adr.tradeoff}`);
    }

    summaries[id] = {
      id,
      summary_50: truncateToWords(item.insight, 50),
      summary_100: truncateToWords(`${item.name} (${item.quadrant} - ${item.verdict}): ${item.insight}`, 100),
      summary_250: truncateToWords(`${item.name} is in the ${item.ring} ring under the ${item.quadrant} quadrant. Manoj's verdict: ${item.verdict}. Insight: ${item.insight}. ${item.adr ? `ADR Context - Problem: ${item.adr.problem}. Decision: ${item.adr.decision}. Tradeoff: ${item.adr.tradeoff}` : ""}`, 250),
      facts
    };

    // If it has an ADR, let's also create an ADR node
    if (item.adr) {
      const adrId = `adr-${item.id}`;
      categories.add("adr");
      const adrNode: KnowledgeNode = {
        id: adrId,
        type: "adr",
        title: `ADR: ${item.name} Integration`,
        summary: item.adr.decision,
        tags: ["adr", item.id],
        keywords: ["adr", item.name, "decision", "tradeoff"],
        aliases: [`adr-${item.id}`, `decision-${item.id}`],
        importance: 7,
        related: [item.id]
      };
      nodes.push(adrNode);

      summaries[adrId] = {
        id: adrId,
        summary_50: truncateToWords(item.adr.decision, 50),
        summary_100: truncateToWords(`ADR for ${item.name}. Problem: ${item.adr.problem} Decision: ${item.adr.decision}`, 100),
        summary_250: truncateToWords(`ADR for ${item.name}. Problem: ${item.adr.problem} Decision: ${item.adr.decision} Tradeoff: ${item.adr.tradeoff}`, 250),
        facts: [item.adr.problem, item.adr.decision, item.adr.tradeoff]
      };

      // Connect ADR to Tool
      edges.push({
        source: adrId,
        target: item.id,
        relation: "references"
      });
    }
  });

  // 3. Process Detailed Case Studies (detailedCaseStudies)
  detailedCaseStudies.forEach((cs) => {
    const id = cs.slug;
    categories.add("case_study");
    allTags.add("case study");
    allTags.add(cs.environment.toLowerCase());

    const node: KnowledgeNode = {
      id,
      type: "case_study",
      title: cs.title,
      summary: cs.problem,
      tags: ["case study", cs.environment.toLowerCase(), cs.status.toLowerCase()],
      keywords: [cs.title, cs.shortTitle, cs.ingress],
      aliases: [cs.title, cs.shortTitle],
      importance: 10,
      related: []
    };
    nodes.push(node);

    const facts = [
      `Status: ${cs.status} in environment ${cs.environment}`,
      `Ingress pathway: ${cs.ingress}`,
      ...cs.telemetry.map(t => `${t.label}: ${t.value} (${t.description})`),
      ...cs.zones.map(z => `Zone ${z.label}: ${z.summary}`),
      ...cs.nodes.map(n => `Component ${n.label}: ${n.description} (${n.detail})`)
    ];

    const s50 = truncateToWords(cs.problem, 50);
    const s100 = truncateToWords(`${cs.title} in ${cs.environment}: ${cs.problem} Narration: ${cs.narration}`, 100);
    const fullSpecs = cs.nodes.map(n => `${n.label}: ${n.description}`).join("; ");
    const s250 = truncateToWords(`${cs.title} (Status: ${cs.status}, Ingress: ${cs.ingress}). Problem: ${cs.problem}. Narration: ${cs.narration}. Key systems: ${fullSpecs}`, 250);

    summaries[id] = {
      id,
      summary_50: s50,
      summary_100: s100,
      summary_250: s250,
      facts: facts.slice(0, 30)
    };

    // Add edges for detailed connections
    cs.connections?.forEach((conn) => {
      // Connect nodes inside the topology if relevant, or simplify.
      // Let's connect components to tools if the component ID matches a tool ID
      const fromTool = conn.from.toLowerCase();
      const toTool = conn.to.toLowerCase();
      
      const fromNodeExists = nodes.some(n => n.id === fromTool);
      const toNodeExists = nodes.some(n => n.id === toTool);
      
      if (fromNodeExists && toNodeExists) {
        edges.push({
          source: fromTool,
          target: toTool,
          relation: "integrates_with"
        });
      }
    });

    // Connect case study to tools it mentions in its node list
    cs.nodes.forEach((n) => {
      const potentialToolId = n.id.toLowerCase();
      if (nodes.some(node => node.id === potentialToolId)) {
        edges.push({
          source: id,
          target: potentialToolId,
          relation: "uses"
        });
      }
    });
  });

  // 4. Process Services (siteConfig services)
  services.forEach((service) => {
    const id = `service-${service.slug}`;
    categories.add("service");
    service.keywords.forEach(k => allTags.add(k.toLowerCase()));

    const node: KnowledgeNode = {
      id,
      type: "service",
      title: service.title,
      summary: service.description,
      tags: service.keywords.map(k => k.toLowerCase()),
      keywords: [...service.keywords],
      aliases: [service.title, service.shortTitle],
      importance: 8,
      related: []
    };
    nodes.push(node);

    const facts = [
      `Buyer Pain: ${service.buyerPain}`,
      `Ideal Client: ${service.idealClient}`,
      `Consulting Depth: ${service.depth}`,
      ...service.outcomes.map(o => `Service Outcome: ${o}`)
    ];

    summaries[id] = {
      id,
      summary_50: truncateToWords(service.description, 50),
      summary_100: truncateToWords(`Service: ${service.title} addressing "${service.buyerPain}". ${service.description}`, 100),
      summary_250: truncateToWords(`Service: ${service.title}. Buyer Pain: ${service.buyerPain}. Description: ${service.description}. Target Audience: ${service.idealClient}. Depth of engagement: ${service.depth}. Key outcomes: ${service.outcomes.join("; ")}`, 250),
      facts
    };
  });

  // 5. Process Career Journey
  careerJourney.forEach((job) => {
    const id = `career-${slugify(job.company)}`;
    categories.add("career");
    allTags.add("career");
    allTags.add(job.company.toLowerCase());

    const node: KnowledgeNode = {
      id,
      type: "career",
      title: `${job.title} at ${job.company}`,
      summary: job.summary,
      tags: ["career", job.company.toLowerCase(), ...job.stack.map(s => s.toLowerCase())],
      keywords: [job.title, job.company, ...job.stack],
      aliases: [job.company, `${job.title} - ${job.company}`],
      importance: 8,
      related: []
    };
    nodes.push(node);

    const facts = [
      `Company: ${job.company} (${job.period})`,
      `Role: ${job.title}`,
      `Production Signal: ${job.productionSignal}`,
      ...job.stack.map(s => `Technology stack component: ${s}`),
      job.summary
    ];

    summaries[id] = {
      id,
      summary_50: truncateToWords(job.summary, 50),
      summary_100: truncateToWords(`${job.title} at ${job.company} (${job.period}): ${job.summary} Stack: ${job.stack.join(", ")}`, 100),
      summary_250: truncateToWords(`${job.title} at ${job.company} during ${job.period}. Summary of experience: ${job.summary}. Key production signal: ${job.productionSignal}. Stack keywords: ${job.stack.join(", ")}`, 250),
      facts
    };

    // Connect career to tools used
    job.stack.forEach((toolName) => {
      const toolId = slugify(toolName);
      if (nodes.some(n => n.id === toolId)) {
        edges.push({
          source: id,
          target: toolId,
          relation: "uses"
        });
      }
    });
  });

  // 6. Process Engineering Systems (patterns)
  engineeringSystems.forEach((pattern) => {
    const id = `pattern-${pattern.slug}`;
    categories.add("pattern");
    allTags.add("architecture pattern");

    const node: KnowledgeNode = {
      id,
      type: "pattern",
      title: `${pattern.title} Pattern`,
      summary: pattern.description,
      tags: ["architecture pattern", ...pattern.tradeoffs],
      keywords: [pattern.title, ...pattern.flow],
      aliases: [pattern.title, `${pattern.title} Architecture`],
      importance: 9,
      related: []
    };
    nodes.push(node);

    const facts = [
      `Description: ${pattern.description}`,
      `Pipeline stages: ${pattern.flow.join(" -> ")}`,
      ...pattern.tradeoffs.map(t => `Tradeoff focus constraint: ${t}`)
    ];

    summaries[id] = {
      id,
      summary_50: truncateToWords(pattern.description, 50),
      summary_100: truncateToWords(`System Pattern: ${pattern.title}. Flow path: ${pattern.flow.join(" -> ")}. Tradeoffs: ${pattern.tradeoffs.join(", ")}`, 100),
      summary_250: truncateToWords(`System Pattern: ${pattern.title}. Description: ${pattern.description}. Pipeline flow structure: ${pattern.flow.join(" -> ")}. Tradeoffs involved: ${pattern.tradeoffs.join(", ")}`, 250),
      facts
    };

    // Connect pattern elements to tools
    pattern.flow.forEach((f) => {
      const toolId = slugify(f);
      if (nodes.some(n => n.id === toolId)) {
        edges.push({
          source: id,
          target: toolId,
          relation: "uses"
        });
      }
    });
  });

  // 7. Add Open Source Projects (extracted from open-source page)
  const openSourceProjects = [
    {
      id: "fastapi-openai-gateway-proxy",
      title: "FastAPI OpenAI Gateway Proxy",
      description: "An OpenAI-compatible high-performance API router proxy offering request validation, rate limiting, and smart load-balanced routing to local SLMs and cloud endpoints.",
      status: "Active",
      tools: ["fastapi", "ollama-vllm"]
    },
    {
      id: "langgraphjs-orchestrator-template",
      title: "LangGraphJS Orchestrator Template",
      description: "Stateful multi-agent workflows modeling planner/executor patterns, intent routing, memory nodes, and SQLite-backed thread checkpointing.",
      status: "Active",
      tools: ["langgraph", "sqlite"]
    },
    {
      id: "macbook-silicon-ai-home-lab-deployment",
      title: "MacBook Silicon AI Home Lab Deployment",
      description: "A 100% self-hosted, containerized deployment template utilizing Cloudflare tunnels, Podman, Redis, and Qdrant vector databases for local execution.",
      status: "Active",
      tools: ["cloudflare", "redis", "qdrant", "podman"]
    }
  ];

  openSourceProjects.forEach((proj) => {
    categories.add("project");
    allTags.add("open source");

    const node: KnowledgeNode = {
      id: proj.id,
      type: "project",
      title: proj.title,
      summary: proj.description,
      tags: ["open source", proj.status.toLowerCase()],
      keywords: [proj.title, proj.status],
      aliases: [proj.title],
      importance: 8,
      related: []
    };
    nodes.push(node);

    const facts = [
      `Project name: ${proj.title}`,
      `Description: ${proj.description}`,
      `Status: ${proj.status}`,
      `Associated tools: ${proj.tools.join(", ")}`
    ];

    summaries[proj.id] = {
      id: proj.id,
      summary_50: truncateToWords(proj.description, 50),
      summary_100: truncateToWords(`Open Source Project: ${proj.title} (Status: ${proj.status}). ${proj.description}`, 100),
      summary_250: truncateToWords(`Open Source Project: ${proj.title}. Description: ${proj.description}. Status: ${proj.status}. Key technologies incorporated: ${proj.tools.join(", ")}`, 250),
      facts
    };

    // Connect to tools
    proj.tools.forEach((t) => {
      const toolId = slugify(t);
      if (nodes.some(n => n.id === toolId)) {
        edges.push({
          source: proj.id,
          target: toolId,
          relation: "built_with"
        });
      }
    });
  });

  // 8. Process Markdown documents in docs/ directory
  const docsDir = path.join(__dirname, "../docs");
  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir).filter(f => f.endsWith(".md"));
    files.forEach((file) => {
      const docName = file.replace(/\.md$/, "");
      const id = `doc-${slugify(docName)}`;
      categories.add("doc");
      allTags.add("documentation");

      const filePath = path.join(docsDir, file);
      const rawContent = fs.readFileSync(filePath, "utf-8");

      // Simple markdown parser
      const lines = rawContent.split("\n");
      const titleLine = lines.find(l => l.startsWith("# "));
      const docTitle = titleLine ? titleLine.replace(/^#\s+/, "") : docName.replace(/_/g, " ");

      // Extract bullet points as facts
      const facts: string[] = [];
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const bullet = trimmed.replace(/^[-*]\s+/, "");
          if (bullet.length > 10 && bullet.length < 150) {
            facts.push(bullet);
          }
        }
      });

      const bodyText = rawContent.replace(/#.*$/gm, "").replace(/[-*`#|]/g, " ").replace(/\s+/g, " ").trim();
      const summaryText = truncateToWords(bodyText, 60);

      const node: KnowledgeNode = {
        id,
        type: "doc",
        title: docTitle,
        summary: summaryText,
        tags: ["documentation", "reference"],
        keywords: [docTitle, docName],
        aliases: [docTitle, docName.replace(/_/g, " ")],
        importance: 6,
        related: []
      };
      nodes.push(node);

      summaries[id] = {
        id,
        summary_50: truncateToWords(bodyText, 50),
        summary_100: truncateToWords(bodyText, 100),
        summary_250: truncateToWords(bodyText, 250),
        facts: facts.slice(0, 10)
      };
    });
  }

  // 9. Generate Heuristic Relational Edges
  // For each node, scan its text representations (aliases, keywords, summaries, and facts)
  // and connect to any other node whose id/alias matches a word or phrase in its content
  nodes.forEach((sourceNode) => {
    const sourceSummary = summaries[sourceNode.id];
    if (!sourceSummary) return;

    const sourceText = (
      sourceNode.title + " " +
      sourceNode.summary + " " +
      sourceNode.aliases.join(" ") + " " +
      sourceNode.keywords.join(" ") + " " +
      sourceSummary.facts.join(" ") + " " +
      sourceSummary.summary_250
    ).toLowerCase();

    nodes.forEach((targetNode) => {
      // Don't connect node to itself
      if (sourceNode.id === targetNode.id) return;

      // Check if target title/id/alias is mentioned in source content
      const targetId = targetNode.id.toLowerCase();
      const targetTitle = targetNode.title.toLowerCase();

      let isMatch = false;

      // Match target ID as full word
      const idRegex = new RegExp(`\\b${targetId.replace(/-/g, "\\-")}\\b`, "i");
      if (idRegex.test(sourceText)) {
        isMatch = true;
      }

      // Match target title
      if (targetTitle.length > 3 && sourceText.includes(targetTitle)) {
        isMatch = true;
      }

      // Match aliases
      targetNode.aliases.forEach((alias) => {
        const normalizedAlias = alias.toLowerCase();
        if (normalizedAlias.length > 3 && sourceText.includes(normalizedAlias)) {
          isMatch = true;
        }
      });

      if (isMatch) {
        // Avoid duplicate edges
        const edgeExists = edges.some(
          (e) =>
            (e.source === sourceNode.id && e.target === targetNode.id) ||
            (e.source === targetNode.id && e.target === sourceNode.id)
        );

        if (!edgeExists) {
          // Heuristic relationship label
          let relation = "related_to";
          if (sourceNode.type === "blog" && targetNode.type === "tool") {
            relation = "references";
          } else if (sourceNode.type === "case_study" && targetNode.type === "tool") {
            relation = "uses";
          } else if (sourceNode.type === "career" && targetNode.type === "tool") {
            relation = "uses";
          } else if (sourceNode.type === "pattern" && targetNode.type === "tool") {
            relation = "implements";
          } else if (sourceNode.type === "adr" && targetNode.type === "tool") {
            relation = "depends_on";
          } else if (sourceNode.type === "project" && targetNode.type === "tool") {
            relation = "built_with";
          }

          edges.push({
            source: sourceNode.id,
            target: targetNode.id,
            relation
          });

          // Mutually add to related field of the node object to satisfy format
          sourceNode.related.push(targetNode.id);
          targetNode.related.push(sourceNode.id);
        }
      }
    });
  });

  // Deduplicate node relations arrays
  nodes.forEach(n => {
    n.related = Array.from(new Set(n.related));
  });

  // Ensure output directories exist
  const graphDir = path.join(__dirname, "../data/graph");
  const summariesDir = path.join(__dirname, "../data/summaries");
  const dataDir = path.join(__dirname, "../data");

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(graphDir)) fs.mkdirSync(graphDir, { recursive: true });
  if (!fs.existsSync(summariesDir)) fs.mkdirSync(summariesDir, { recursive: true });

  // 10. Write Nodes and Edges output
  fs.writeFileSync(path.join(graphDir, "nodes.json"), JSON.stringify(nodes, null, 2), "utf-8");
  fs.writeFileSync(path.join(graphDir, "edges.json"), JSON.stringify(edges, null, 2), "utf-8");

  // 11. Write individual summaries
  Object.keys(summaries).forEach((nodeId) => {
    const safeFilename = `${nodeId}.json`;
    fs.writeFileSync(
      path.join(summariesDir, safeFilename),
      JSON.stringify(summaries[nodeId], null, 2),
      "utf-8"
    );
  });

  // 12. Compile Knowledge Manifest file
  const routes = [
    "/",
    "/about",
    "/services",
    "/advisory-intake",
    "/blog",
    "/open-source",
    "/architecture-lab",
    "/engineering",
    "/resume"
  ];
  // Add dynamic blog article routes
  blogArticles.forEach(a => routes.push(`/blog/${a.slug}`));

  const manifest: Manifest = {
    nodes,
    categories: Array.from(categories),
    tags: Array.from(allTags),
    routes,
    summaries
  };

  fs.writeFileSync(path.join(dataDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8");

  // 13. Pre-compile and serialize MiniSearch index to eliminate runtime indexing overhead
  const miniSearch = new MiniSearch({
    fields: ["title", "aliases", "keywords", "tags", "summary", "facts"],
    storeFields: ["id", "type", "title", "summary", "tags", "keywords", "aliases", "importance"],
  });

  const docs = nodes.map((node) => {
    const summaryData = summaries[node.id];
    return {
      id: node.id,
      type: node.type,
      title: node.title,
      aliases: node.aliases.join(" "),
      keywords: node.keywords.join(" "),
      tags: node.tags.join(" "),
      summary: node.summary,
      facts: summaryData ? summaryData.facts.join(" ") : "",
      importance: node.importance,
    };
  });

  miniSearch.addAll(docs);
  fs.writeFileSync(path.join(dataDir, "search-index.json"), JSON.stringify(miniSearch.toJSON()), "utf-8");

  console.log(`Knowledge Graph generated successfully!`);
  console.log(`Total Nodes: ${nodes.length}`);
  console.log(`Total Edges: ${edges.length}`);
  console.log(`Total Summaries written: ${Object.keys(summaries).length}`);
  console.log(`Pre-serialized search index size: ${fs.statSync(path.join(dataDir, "search-index.json")).size} bytes`);
}

run();
