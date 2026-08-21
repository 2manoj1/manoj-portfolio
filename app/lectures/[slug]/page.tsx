import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LectureRuntime } from "@/components/lectures/lecture-runtime";
import { getLecture, lectures } from "@/content/lectures/catalog";
import { createMetadata } from "@/lib/seo";

type LecturePageProps = {
	params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
	return lectures.map((lecture) => ({ slug: lecture.slug }));
}

export async function generateMetadata({
	params,
}: LecturePageProps): Promise<Metadata> {
	const { slug } = await params;
	const lecture = getLecture(slug);
	if (!lecture) return {};

	return createMetadata({
		title: lecture.title,
		description: lecture.description,
		path: `/lectures/${lecture.slug}`,
		keywords: [
			"Blockchain Applications Lecture",
			"Blockchain Finance",
			"Blockchain Supply Chain",
			"Interactive Blockchain Demo",
			"Blockchain Education India",
		],
	});
}

export default async function LecturePage({ params }: LecturePageProps) {
	const { slug } = await params;
	const lecture = getLecture(slug);
	if (!lecture) notFound();

	return <LectureRuntime lecture={lecture} />;
}
