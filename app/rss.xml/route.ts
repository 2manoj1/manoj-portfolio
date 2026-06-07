import { blogArticles } from "@/content/blog";

export async function GET() {
  const siteUrl = "https://www.manojmukherjee.co.in";

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Manoj Mukherjee</title>
    <description>
      AI Architecture, Agentic AI, LangGraph, MCP, GraphRAG, RAG Systems, AI Infrastructure and Engineering.
    </description>
    <link>${siteUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

    ${blogArticles
      .map(
        (article) => `
      <item>
        <title><![CDATA[${article.title}]]></title>
        <link>${siteUrl}/blog/${article.slug}</link>
        <guid>${siteUrl}/blog/${article.slug}</guid>
        <pubDate>${new Date(
          article.date ?? Date.now()
        ).toUTCString()}</pubDate>
        <description><![CDATA[${
          article.summary ?? ""
        }]]></description>
      </item>
    `
      )
      .join("")}

  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}