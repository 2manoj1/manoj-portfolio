import fs from "fs";
import path from "path";

export interface DocMetadata {
  title: string;
  description: string;
  order: number;
  category: string;
  slug: string;
  readingTime: string;
}

export interface DocHeading {
  id: string;
  text: string;
  depth: number;
}

export interface DocContent extends DocMetadata {
  content: string;
  headings: DocHeading[];
}

const DOCS_DIRECTORY = path.join(process.cwd(), "content/docs/ai-gateway");

/**
 * Normalizes title text to a URL-friendly slug ID.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Parses frontmatter metadata, headings, and reads MDX file content.
 */
export function getDocBySlug(slug: string): DocContent | null {
  try {
    const filePath = path.join(DOCS_DIRECTORY, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parts = fileContent.split("---");
    
    if (parts.length < 3) {
      return null;
    }

    const frontmatterRaw = parts[1];
    const content = parts.slice(2).join("---").trim();

    // Parse Frontmatter
    const metadata: Partial<Pick<DocMetadata, "title" | "description" | "category" | "order">> = {};
    frontmatterRaw.split("\n").forEach((line) => {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.slice(1, -1);
        }

        if (key === "order") {
          metadata.order = Number.parseInt(val, 10);
        } else if (key === "title" || key === "description" || key === "category") {
          metadata[key] = val;
        }
      }
    });

    // Parse Headings for Table of Contents
    const headings: DocHeading[] = [];
    const lines = content.split("\n");
    lines.forEach((line) => {
      // Look for H2 and H3 headings
      const headingMatch = line.match(/^(#{2,3})\s+(.*)$/);
      if (headingMatch) {
        const depth = headingMatch[1].length;
        const text = headingMatch[2]
          .replace(/\[!.*?\]/g, "") // remove callout markers if present
          .trim();
        headings.push({
          id: slugify(text),
          text,
          depth,
        });
      }
    });

    // Estimate Reading Time
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    return {
      title: metadata.title || slug,
      description: metadata.description || "",
      order: metadata.order || 99,
      category: metadata.category || "General",
      slug,
      readingTime,
      content,
      headings,
    };
  } catch (error) {
    console.error(`Error reading doc slug: ${slug}`, error);
    return null;
  }
}

/**
 * Retrieves lists of all available documentation pages sorted by order.
 */
export function getDocsList(): DocMetadata[] {
  try {
    if (!fs.existsSync(DOCS_DIRECTORY)) {
      return [];
    }

    const files = fs.readdirSync(DOCS_DIRECTORY);
    const docs = files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => {
        const slug = file.replace(/\.mdx$/, "");
        const doc = getDocBySlug(slug);
        return doc;
      })
      .filter((doc): doc is DocContent => doc !== null)
      .map((doc) => ({
        title: doc.title,
        description: doc.description,
        order: doc.order,
        category: doc.category,
        slug: doc.slug,
        readingTime: doc.readingTime,
      }))
      .sort((a, b) => a.order - b.order);

    return docs;
  } catch (error) {
    console.error("Error fetching docs list", error);
    return [];
  }
}
