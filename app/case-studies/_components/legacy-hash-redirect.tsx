"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { caseStudies } from "../_data/case-studies";

export function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      return;
    }

    const [slug, queryStr] = hash.split("?");
    const match = caseStudies.find((caseStudy) => caseStudy.slug === slug);
    if (!match) {
      return;
    }

    router.replace(`/case-studies/${slug}${queryStr ? `?${queryStr}` : ""}`);
  }, [router]);

  return null;
}
