import type { MetadataRoute } from "next";
import { routes, services, siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const serviceRoutes = services.map((service) => ({
		url: `${siteConfig.url}/services/${service.slug}`,
		lastModified: now,
		changeFrequency: "monthly" as const,
		priority: 0.8,
	}));

	return [
		...routes.map((route) => ({
			url: `${siteConfig.url}${route.href === "/" ? "" : route.href}`,
			lastModified: now,
			changeFrequency: "weekly" as const,
			priority: route.priority,
		})),
		...serviceRoutes,
	];
}
