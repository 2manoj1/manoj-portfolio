import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { caseStudies } from "../_data/case-studies";
import { CaseStudyDetailClient } from "../_components/CaseStudyDetailClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    return createMetadata({
      title: "Case Study Not Found | AI Systems Architecture Lab",
      description: "The requested case study could not be found.",
    });
  }

  return createMetadata({
    title: `${study.title} Case Study | AI Systems Architecture Lab`,
    description: `${study.kicker}: ${study.problem.slice(0, 145)}...`,
  });
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  return <CaseStudyDetailClient slug={slug} />;
}
