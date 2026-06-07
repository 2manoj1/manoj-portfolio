import type { MetadataRoute } from "next";
import { blogArticles } from "@/content/blog";
import { caseStudies, routes, services, siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const serviceRoutes = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const blogRoutes = blogArticles.map((article) => ({
    url: `${siteConfig.url}/blog/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 1.0,
  }));
  const caseStudyRoutes = caseStudies.map((study) => ({
    url: `${siteConfig.url}/case-studies/${study.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 1.0,
  }));


  return [
    ...routes.map((route) => ({
      url: `${siteConfig.url}${route.href === "/" ? "" : route.href}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route.priority,
    })),
    ...serviceRoutes,
    ...blogRoutes,
    ...caseStudyRoutes,
  ];
}
