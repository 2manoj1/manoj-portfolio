// scripts/sync-medium-ids.js

import fs from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";

const RSS_URL = "https://medium.com/feed/@manojmukherjee777";
const SITE_FILE = "content/site.ts";

function getArticleId(url) {
  const clean = url.split("?")[0];
  const match = clean.match(/-([a-f0-9]+)$/i);
  return match?.[1];
}

function getSlug(url) {
  const clean = url.split("?")[0];
  const last = clean.split("/").pop();

  return last.replace(/-[a-f0-9]+$/i, "");
}

async function main() {
  const response = await fetch(RSS_URL);
  const xml = await response.text();

  const parser = new XMLParser();
  const rss = parser.parse(xml);

  const rssArticles = rss.rss.channel.item.map((item) => ({
    url: item.link.split("?")[0],
    slug: getSlug(item.link),
    articleId: getArticleId(item.link),
  }));

  let siteTs = await fs.readFile(
    SITE_FILE,
    "utf8"
  );

  let updates = 0;

  for (const rssArticle of rssArticles) {
    const escapedSlug = rssArticle.slug.replace(
      /[-/\\^$*+?.()|[\]{}]/g,
      "\\$&"
    );

    const regex = new RegExp(
      `(https://medium\\.com/@manojmukherjee777/${escapedSlug}-)([a-f0-9]+)`,
      "gi"
    );

    siteTs = siteTs.replace(
      regex,
      (_, prefix, oldId) => {
        if (oldId === rssArticle.articleId) {
          return `${prefix}${oldId}`;
        }

        updates++;

        console.log(
          `✅ Updated ${rssArticle.slug}`
        );
        console.log(
          `   ${oldId} -> ${rssArticle.articleId}`
        );

        return `${prefix}${rssArticle.articleId}`;
      }
    );
  }

  await fs.writeFile(
    SITE_FILE,
    siteTs,
    "utf8"
  );

  console.log(
    `\n🎉 Updated ${updates} article IDs`
  );
}

main().catch(console.error);