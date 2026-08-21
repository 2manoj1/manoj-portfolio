import { blockchainLecture } from "@/content/lectures/blockchain-finance-supply-chain";

export const lectures = [blockchainLecture] as const;

export function getLecture(slug: string) {
	return lectures.find((lecture) => lecture.slug === slug);
}
