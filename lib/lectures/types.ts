export type LectureSectionId =
	| "hook"
	| "foundations"
	| "demo"
	| "finance"
	| "supply-chain"
	| "beyond"
	| "career"
	| "closing";

export type LectureSource = {
	id: string;
	label: string;
	publisher: string;
	url: string;
	status:
		| "reference"
		| "poc"
		| "pilot"
		| "prototype"
		| "prelaunch"
		| "deployment"
		| "production"
		| "closed";
	verifiedAt: string;
};

export type SpeakerNotes = {
	say: string;
	ask?: string;
	expected?: string;
	transition: string;
};

type SceneBase = {
	id: string;
	section: LectureSectionId;
	sectionLabel: string;
	durationSeconds: number;
	eyebrow?: string;
	title: string;
	subtitle?: string;
	notes: SpeakerNotes;
	sourceIds?: string[];
	image?: {
		src: string;
		alt: string;
		preload?: boolean;
	};
};

export type HeroScene = SceneBase & {
	kind: "hero";
	variant?: "default" | "founder";
	headlineLines?: string[];
	speaker?: {
		name: string;
		role: string;
		summary: string;
	};
	lines?: string[];
	callout?: string;
};

export type StatementScene = SceneBase & {
	kind: "statement";
	statement: string;
	fragments?: string[];
	callout?: string;
};

export type FlowScene = SceneBase & {
	kind: "flow";
	steps: string[];
	problemSteps?: number[];
	callout?: string;
};

export type CardsScene = SceneBase & {
	kind: "cards";
	items: Array<{ title: string; detail: string; status?: string; tag?: string }>;
	callout?: string;
};

export type ComparisonScene = SceneBase & {
	kind: "comparison";
	left: { label: string; steps: string[]; caption: string };
	right: { label: string; steps: string[]; caption: string };
};

export type QuestionScene = SceneBase & {
	kind: "question";
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
};

export type DiagramScene = SceneBase & {
	kind: "diagram";
	diagramId:
		| "block-anatomy"
		| "chain-links"
		| "consensus-network"
		| "branching-tree"
		| "settlement-flow";
	callout?: string;
};

export type DemoScene = SceneBase & {
	kind: "demo";
	demoId:
		| "trust-problem"
		| "shared-ledger"
		| "hash"
		| "integrity"
		| "consensus-flow"
		| "smart-contract"
		| "supply-chain"
		| "enterprise-arch-flow"
		| "decision-tree"
		| "ecosystem-radial"
		| "web-evolution"
		| "signature"
		| "ai-convergence"
		| "industry-reality"
		| "qr-takeaway";
	callout?: string;
};

export type SourcesScene = SceneBase & {
	kind: "sources";
	items: Array<{
		title: string;
		detail: string;
		status: LectureSource["status"];
		sourceId?: string;
	}>;
};

export type LectureScene =
	| HeroScene
	| StatementScene
	| FlowScene
	| CardsScene
	| ComparisonScene
	| QuestionScene
	| DiagramScene
	| DemoScene
	| SourcesScene;

export type Lecture = {
	slug: string;
	title: string;
	shortTitle: string;
	subtitle?: string;
	description: string;
	audience: string;
	presenter?: string;
	university?: string;
	totalMinutes: number;
	scenes: LectureScene[];
	sources: LectureSource[];
};
