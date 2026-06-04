import { createMetadata } from "@/lib/seo";
import CaseStudiesClient from "./CaseStudiesClient";

export const metadata = createMetadata({
	title: "Case Studies | AI Systems Architecture Lab",
	description: "Deep dive into production system topologies, telemetry HUD data, scrolling logs, and code decision ledgers.",
});

export default function CaseStudiesPage() {
	return <CaseStudiesClient />;
}
