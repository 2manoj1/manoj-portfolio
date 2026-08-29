export async function sha256Utf8(value: string) {
	if (!globalThis.crypto?.subtle) {
		throw new Error("SHA-256 requires a browser with Web Crypto support.");
	}

	const bytes = new TextEncoder().encode(value);
	const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);

	return Array.from(new Uint8Array(digest), (byte) =>
		byte.toString(16).padStart(2, "0"),
	).join("");
}

export type DemoBlock = {
	index: number;
	timestamp: string;
	transaction: string;
	previousHash: string;
	hash: string;
};

export function serializeBlock(block: Omit<DemoBlock, "hash">) {
	return JSON.stringify([
		block.index,
		block.timestamp,
		block.transaction,
		block.previousHash,
	]);
}

export async function buildBlock(
	block: Omit<DemoBlock, "hash">,
): Promise<DemoBlock> {
	return {
		...block,
		hash: await sha256Utf8(serializeBlock(block)),
	};
}

export type BlockVerification = {
	calculatedHash: string;
	hashMatches: boolean;
	linkMatches: boolean;
	chainValidThroughHere: boolean;
};

export async function verifyChain(blocks: DemoBlock[]) {
	const results: BlockVerification[] = [];

	for (const [index, block] of blocks.entries()) {
		const calculatedHash = await sha256Utf8(
			serializeBlock({
				index: block.index,
				timestamp: block.timestamp,
				transaction: block.transaction,
				previousHash: block.previousHash,
			}),
		);
		const hashMatches = calculatedHash === block.hash;
		const linkMatches =
			index === 0 || block.previousHash === results[index - 1]?.calculatedHash;
		const chainValidThroughHere =
			hashMatches &&
			linkMatches &&
			(index === 0 || results[index - 1]?.chainValidThroughHere === true);

		results.push({
			calculatedHash,
			hashMatches,
			linkMatches,
			chainValidThroughHere,
		});
	}

	return results;
}
