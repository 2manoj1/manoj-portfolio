"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
	ArrowLeft,
	ArrowUp,
	Bot,
	BriefcaseBusiness,
	CircuitBoard,
	ExternalLink,
	Loader2,
	MessageSquareText,
	Minimize2,
	Minus,
	PanelRightOpen,
	ShieldCheck,
	StopCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getCleanText(text: string, isStreaming: boolean): string {
	if (isStreaming) {
		const index = text.indexOf("<suggestions>");
		if (index !== -1) {
			return text.substring(0, index).trim();
		}
	} else {
		return text.replace(/<suggestions>[\s\S]*?<\/suggestions>/g, "").trim();
	}
	return text;
}

function getExtractedSuggestions(text: string): string[] {
	const match = text.match(/<suggestions>([\s\S]*?)<\/suggestions>/);
	if (match) {
		try {
			const suggestions = JSON.parse(match[1].trim());
			return Array.isArray(suggestions) ? suggestions.slice(0, 2) : [];
		} catch {
			return [];
		}
	}
	return [];
}

type StatusDataPart = {
	type: "data-status";
	data?: {
		label?: string;
	};
};

const agentName = "Astra";

const starterPrompts = [
	"What does Manoj architect?",
	"Review my LangGraph system",
	"Improve RAG reliability",
	"Explore advisory fit",
] as const;

const introMessage: UIMessage = {
	id: "astra-intro",
	role: "assistant",
	parts: [
		{
			type: "text",
			text: "I can help you explore Manoj's AI systems work, architecture services, LangGraph/RAG depth, writing, and advisory fit using the site's canonical context.",
		},
	],
};

function AgentAvatar({ className }: { className?: string }) {
	return (
		<div className={cn("relative size-10 shrink-0", className)}>
			<Image
				src="/mm.png"
				alt="Manoj Mukherjee"
				fill
				sizes="56px"
				className="rounded-full border border-zinc-350 dark:border-white/15 object-cover object-top"
				priority={false}
			/>
			<span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border border-[#111] bg-amber text-amber-foreground shadow-sm">
				<Bot className="size-3" />
			</span>
		</div>
	);
}

function StatusLine({
	isLoading,
	status,
}: {
	isLoading: boolean;
	status?: string;
}) {
	const label = isLoading
		? status
			? "Astra is composing"
			: "Astra is thinking"
		: "Powered by AI | Grounded by Manoj's context";

	return (
		<div className="flex h-5 items-center gap-2 text-xs text-zinc-500 dark:text-white/42">
			{isLoading ? (
				<span className="relative flex size-3 items-center justify-center">
					<span className="absolute size-3 rounded-full bg-amber/50 animate-ping" />
					<span className="relative size-1.5 rounded-full bg-amber" />
				</span>
			) : (
				<ShieldCheck className="size-3.5" />
			)}
			<span className="truncate">{label}</span>
		</div>
	);
}

function ThinkingInline({
	status,
	className,
}: {
	status?: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-2.5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.045] px-4 py-2.5 text-sm text-zinc-700 dark:text-white/70 shadow-sm animate-pulse",
				className,
			)}>
			<Loader2 className="size-3.5 animate-spin text-amber" />
			<span className="font-mono text-xs tracking-wide">
				{status ?? "Astra is thinking..."}
			</span>
		</div>
	);
}

function MessageParts({
	message,
	isStreaming,
	status,
	mode,
}: {
	message: UIMessage;
	isStreaming: boolean;
	status?: string;
	mode: "widget" | "page";
}) {
	const textParts = message.parts.filter((part) => part.type === "text");
	const isAssistant = message.role === "assistant";

	if (isAssistant) {
		const hasTextContent = textParts.some(
			(part) => part.text && part.text.trim().length > 0,
		);
		return (
			<div
				className={cn(
					"min-w-0 flex-1 text-sm leading-6 text-zinc-800 dark:text-white/82",
					mode === "page" && "text-[0.96rem] leading-7",
				)}>
				<div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-white/38">
					<span>{agentName}</span>
				</div>
				{hasTextContent ? (
					<div className="max-w-full space-y-3">
						{textParts.map((part, index) => {
							const cleanText = getCleanText(part.text, isStreaming);
							return (
								<MessageResponse
									key={`${message.id}-text-${index}`}
									className="break-words text-zinc-800 dark:text-white/82">
									{cleanText}
								</MessageResponse>
							);
						})}
					</div>
				) : isStreaming ? (
					<ThinkingInline status={status} />
				) : null}
			</div>
		);
	}

	return (
		<div
			className={cn(
				"max-w-[86%] rounded-2xl border border-zinc-250 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.075] px-4 py-3 text-sm leading-6 text-zinc-900 dark:text-white shadow-sm shadow-zinc-200/50 dark:shadow-black/10",
				mode === "page" && "max-w-[min(36rem,86%)]",
			)}>
			{textParts.map((part, index) => (
				<p
					key={`${message.id}-text-${index}`}
					className="whitespace-pre-wrap break-words">
					{part.text}
				</p>
			))}
		</div>
	);
}

function WelcomePanel({
	isLoading,
	onPrompt,
	mode,
}: {
	isLoading: boolean;
	onPrompt: (prompt: string) => void;
	mode: "widget" | "page";
}) {
	if (mode === "page") {
		return (
			<div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-1 py-8 text-center sm:py-12">
				<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.04] shadow-2xl shadow-zinc-200/20 dark:shadow-black/20">
					<AgentAvatar className="size-16" />
				</div>
				<p className="mx-auto mb-3 w-fit rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-white/45">
					Production AI Systems Copilot
				</p>
				<h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
					Ask Astra about Manoj&apos;s AI architecture work.
				</h1>
				<p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-7 text-zinc-650 dark:text-white/56 sm:text-base">
					Explore LangGraph systems, RAG reliability, platform engineering,
					technical writing, and advisory fit through a grounded assistant.
				</p>

				<div className="mt-8 grid gap-2 sm:grid-cols-2">
					{starterPrompts.map((prompt) => (
						<PromptButton
							key={prompt}
							prompt={prompt}
							isLoading={isLoading}
							onPrompt={onPrompt}
							variant="page"
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-1 py-5">
			<div className="rounded-3xl border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.035] p-5">
				<div className="flex items-center gap-4">
					<span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber/10 dark:bg-amber/12 text-amber">
						<CircuitBoard className="size-5" />
					</span>
					<div className="min-w-0">
						<h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
							Welcome to {agentName}
						</h3>
						<p className="mt-1 text-sm text-zinc-500 dark:text-white/50">
							Production AI systems intelligence
						</p>
					</div>
				</div>

				<p className="mt-6 text-sm leading-7 text-zinc-650 dark:text-white/68">
					Ask about Manoj&apos;s architecture work, LangGraph orchestration,
					RAG reliability, platform engineering, writing, or advisory fit.
				</p>

				<div className="mt-6 flex flex-col gap-2">
					{starterPrompts.map((prompt) => (
						<PromptButton
							key={prompt}
							prompt={prompt}
							isLoading={isLoading}
							onPrompt={onPrompt}
							variant="widget"
						/>
					))}
				</div>

				<div className="mt-6 flex flex-wrap gap-2">
					<span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-white/58">
						<BriefcaseBusiness className="size-3.5" />
						<a href="/advisory-intake" className="hover:underline">
							Advisory
						</a>
					</span>
					<span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-white/58">
						<ShieldCheck className="size-3.5" />
						<a href="mailto:info@manojmukherjee.co.in" className="hover:underline">
							Email inquiry
						</a>
					</span>
				</div>
			</div>
		</div>
	);
}

function PromptButton({
	prompt,
	isLoading,
	onPrompt,
	variant,
}: {
	prompt: string;
	isLoading: boolean;
	onPrompt: (prompt: string) => void;
	variant: "widget" | "page";
}) {
	return (
		<button
			type="button"
			disabled={isLoading}
			onClick={() => onPrompt(prompt)}
			className={cn(
				"group min-h-11 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.045] px-4 py-3 text-left text-sm text-zinc-700 dark:text-white/68 transition hover:border-amber/25 hover:bg-zinc-200 dark:hover:bg-white/[0.075] hover:text-zinc-900 dark:hover:text-white disabled:pointer-events-none disabled:opacity-50",
				variant === "page" && "min-h-16 px-5 py-4",
			)}>
			<span className="block break-words">{prompt}</span>
			<span className="mt-2 block h-px w-7 bg-amber/55 transition-all group-hover:w-14" />
		</button>
	);
}

function HeaderControls({
	isPage,
	isLoading,
	expanded,
	stop,
	onExpandedChange,
	onClose,
}: {
	isPage: boolean;
	isLoading: boolean;
	expanded: boolean;
	stop: () => void;
	onExpandedChange?: (expanded: boolean) => void;
	onClose?: () => void;
}) {
	return (
		<div className="flex shrink-0 items-center gap-1.5">
			{isLoading && (
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="size-9 rounded-full bg-zinc-100 dark:bg-white/[0.055] text-zinc-600 dark:text-white/62 hover:bg-zinc-200 dark:hover:bg-white/[0.1] hover:text-zinc-900 dark:hover:text-white"
					aria-label="Stop response"
					onClick={stop}>
					<StopCircle className="size-4" />
				</Button>
			)}
			{isPage ? (
				<Button
					asChild
					type="button"
					variant="ghost"
					size="lg"
					className="h-9 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.055] px-3 text-zinc-700 dark:text-white/68 hover:bg-zinc-200 dark:hover:bg-white/[0.1] hover:text-zinc-900 dark:hover:text-white"
					aria-label="Return to Manoj site">
					<Link href="/">
						<ArrowLeft className="size-4" />
						<span className="hidden sm:inline">Home</span>
					</Link>
				</Button>
			) : (
				<>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="hidden size-9 rounded-full bg-zinc-100 dark:bg-white/[0.055] text-zinc-600 dark:text-white/62 hover:bg-zinc-200 dark:hover:bg-white/[0.1] hover:text-zinc-900 dark:hover:text-white sm:inline-flex"
						aria-label={
							expanded ? "Return to compact chat" : "Open half-screen chat"
						}
						onClick={() => onExpandedChange?.(!expanded)}>
						{expanded ? (
							<Minimize2 className="size-4" />
						) : (
							<PanelRightOpen className="size-4" />
						)}
					</Button>
					<Button
						asChild
						type="button"
						variant="ghost"
						size="icon-sm"
						className="size-9 rounded-full bg-zinc-100 dark:bg-white/[0.055] text-zinc-600 dark:text-white/62 hover:bg-zinc-200 dark:hover:bg-white/[0.1] hover:text-zinc-900 dark:hover:text-white"
						aria-label="Open full-screen chat">
						<Link href="/chat">
							<ExternalLink className="size-4" />
						</Link>
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="size-9 rounded-full bg-zinc-100 dark:bg-white/[0.055] text-zinc-600 dark:text-white/62 hover:bg-zinc-200 dark:hover:bg-white/[0.1] hover:text-zinc-900 dark:hover:text-white"
						aria-label="Minimize chat"
						onClick={onClose}>
						<Minus className="size-4" />
					</Button>
				</>
			)}
		</div>
	);
}

export function AstraChatSurface({
	mode = "widget",
	expanded = false,
	onExpandedChange,
	onClose,
}: {
	mode?: "widget" | "page";
	expanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	onClose?: () => void;
}) {
	const [input, setInput] = useState("");
	const [currentStatus, setCurrentStatus] = useState<string>();
	const scrollRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const isAtBottom = useRef(true);

	const transport = useMemo(
		() =>
			new DefaultChatTransport<UIMessage>({
				api: "/api/chat",
			}),
		[],
	);

	const { messages, sendMessage, status, stop, error } = useChat({
		transport,
		messages: [introMessage],
		onData(dataPart) {
			const statusPart = dataPart as StatusDataPart;

			if (statusPart.type === "data-status" && statusPart.data?.label) {
				setCurrentStatus(statusPart.data.label);
			}
		},
		onFinish() {
			setCurrentStatus(undefined);
		},
		onError(errorValue) {
			setCurrentStatus(errorValue.message);
		},
	});

	const isPage = mode === "page";
	const isLoading = status === "submitted" || status === "streaming";
	const visibleMessages =
		messages.length > 1
			? messages.filter((message) => message.id !== introMessage.id)
			: messages;
	const showWelcome =
		visibleMessages.length === 1 && visibleMessages[0]?.id === introMessage.id;

	const lastAssistantMessage = useMemo(() => {
		const assistantMsgs = messages.filter((m) => m.role === "assistant");
		return assistantMsgs.length > 0 ? assistantMsgs[assistantMsgs.length - 1] : null;
	}, [messages]);

	const suggestions = useMemo(() => {
		if (showWelcome || isLoading) return [];
		if (!lastAssistantMessage) return [];
		const textParts = lastAssistantMessage.parts.filter((part) => part.type === "text");
		const fullText = textParts.map((p) => p.text).join("");
		return getExtractedSuggestions(fullText);
	}, [lastAssistantMessage, showWelcome, isLoading]);

	const handleScroll = () => {
		const container = scrollRef.current;
		if (!container) return;
		const threshold = 120;
		const distanceFromBottom =
			container.scrollHeight - container.clientHeight - container.scrollTop;
		isAtBottom.current = distanceFromBottom <= threshold;
	};

	useEffect(() => {
		const container = scrollRef.current;
		if (!container) return;

		if (isAtBottom.current) {
			container.scrollTop = container.scrollHeight;
		}
	}, [messages, status]);

	async function sendPrompt(value: string) {
		const trimmed = value.trim();

		if (!trimmed || isLoading) {
			return;
		}

		setInput("");
		setCurrentStatus("Connecting to Astra");
		isAtBottom.current = true;
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
		await sendMessage({ text: trimmed });
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		void sendPrompt(input);
	}

	return (
		<section
			aria-label="Astra production AI chatbot"
			className={cn(
				"relative isolate grid grid-rows-[auto_1fr_auto] overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#0b0b0b] text-zinc-900 dark:text-white shadow-2xl shadow-zinc-200/50 dark:shadow-black/35",
				isPage
					? "h-dvh min-h-dvh w-full rounded-none border-0"
					: "h-dvh w-dvw rounded-none border-0 sm:h-[min(44rem,calc(100dvh-3rem))] sm:w-[27rem] sm:rounded-[1.5rem] sm:border sm:bg-white/96 dark:sm:bg-[#111]/96",
				!isPage &&
					expanded &&
					"sm:w-[calc(100vw-3rem)] md:w-[min(50vw,58rem)] md:min-w-[40rem]",
			)}>
			<div
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(9,9,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(9,9,11,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:42px_42px] opacity-70 [mask-image:linear-gradient(to_bottom,black,rgba(0,0,0,0.72),transparent)]",
					!isPage && "hidden sm:block",
				)}
			/>

			<header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/28 px-4 sm:px-5">
				<div className="flex min-w-0 items-center gap-3">
					<AgentAvatar className="size-10" />
					<div className="min-w-0">
						<div className="flex min-w-0 items-center gap-2">
							<h2 className="truncate text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
								{agentName}
							</h2>
						</div>
						<p className="truncate text-xs text-zinc-500 dark:text-white/45">
							AI Agent - Manoj
						</p>
					</div>
				</div>
				<HeaderControls
					isPage={isPage}
					isLoading={isLoading}
					expanded={expanded}
					stop={stop}
					onExpandedChange={onExpandedChange}
					onClose={onClose}
				/>
			</header>

			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className="min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
				{showWelcome ? (
					<WelcomePanel
						isLoading={isLoading}
						onPrompt={sendPrompt}
						mode={mode}
					/>
				) : (
					<div
						className={cn(
							"mx-auto flex w-full flex-col gap-5",
							isPage ? "max-w-3xl" : "max-w-full",
						)}>
						{visibleMessages.map((message) => (
							<div
								key={message.id}
								className={cn(
									"flex min-w-0 items-start gap-3",
									message.role === "user" && "justify-end",
								)}>
								{message.role === "assistant" && (
									<AgentAvatar className="mt-0.5 size-8" />
								)}
								<MessageParts
									message={message}
									isStreaming={isLoading && message === messages.at(-1)}
									status={currentStatus}
									mode={mode}
								/>
							</div>
						))}
						{isLoading && visibleMessages.at(-1)?.role === "user" ? (
							<div className="flex min-w-0 items-start gap-3">
								<AgentAvatar className="mt-0.5 size-8" />
								<div className="min-w-0 flex-1 text-sm leading-6 text-white/82">
									<div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-white/38">
										<span>{agentName}</span>
									</div>
									<ThinkingInline status={currentStatus} />
								</div>
							</div>
						) : null}
						{error && !isLoading ? (
							<div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
								{error.message}
							</div>
						) : null}
						<div ref={bottomRef} className="h-px" />
					</div>
				)}
			</div>

			<footer className="shrink-0 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/32 px-3 py-3 sm:px-4">
				<div className={cn("mx-auto w-full", isPage ? "max-w-3xl" : "max-w-full")}>
					{!showWelcome && suggestions.length > 0 && !isLoading && (
						<div className="mb-3 flex max-w-full flex-col gap-2 overflow-hidden pb-1 animate-in fade-in slide-in-from-bottom-2 duration-300 sm:flex-row sm:flex-wrap sm:items-start sm:overflow-visible">
							{suggestions.map((suggestion) => (
								<button
									key={suggestion}
									type="button"
									title={suggestion}
									onClick={() => void sendPrompt(suggestion)}
									className="min-w-0 max-w-full overflow-hidden whitespace-normal break-words rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.045] px-3.5 py-2 text-left font-mono text-[11px] leading-5 tracking-wide text-zinc-700 dark:text-white/68 transition hover:border-amber/30 hover:bg-zinc-200 dark:hover:bg-white/[0.08] hover:text-white sm:w-auto sm:max-w-[240px] sm:shrink-0 sm:truncate sm:rounded-full sm:px-3 sm:py-1.5 sm:text-center sm:text-[10px] sm:leading-4"
								>
									{suggestion}
								</button>
							))}
						</div>
					)}
					<form onSubmit={handleSubmit} className="flex h-12 items-center gap-2">
						<label htmlFor="ask-manoj-agent-input" className="sr-only">
							Ask Astra
						</label>
						<textarea
							id="ask-manoj-agent-input"
							value={input}
							onChange={(event) => setInput(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Enter" && !event.shiftKey) {
									event.preventDefault();
									void sendPrompt(input);
								}
							}}
							placeholder="Ask Astra anything..."
							rows={1}
							className="min-h-12 min-w-0 flex-1 resize-none overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.045] px-4 py-3 text-sm leading-normal text-zinc-900 dark:text-white caret-zinc-900 dark:caret-white outline-none transition placeholder:text-zinc-500 dark:placeholder:text-white/32 focus:border-amber/40 focus:ring-2 focus:ring-amber/10"
						/>
						<Button
							type="submit"
							size="icon-lg"
							className="size-12 rounded-2xl shadow-xl shadow-black/25"
							disabled={isLoading || !input.trim()}
							aria-label="Send message">
							{isLoading ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								<ArrowUp className="size-5" />
							)}
						</Button>
					</form>
					<div className="mt-2">
						<StatusLine isLoading={isLoading} status={currentStatus} />
					</div>
				</div>
			</footer>
		</section>
	);
}

export function AstraChatApp() {
	return <AstraChatSurface mode="page" />;
}

export function ManojAgentChat() {
	const [open, setOpen] = useState(false);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		const event = new CustomEvent("astra-chat-state", { detail: { open, expanded } });
		window.dispatchEvent(event);
	}, [open, expanded]);

	useEffect(() => {
		const handleRequest = () => {
			const event = new CustomEvent("astra-chat-state", { detail: { open, expanded } });
			window.dispatchEvent(event);
		};
		window.addEventListener("astra-chat-request", handleRequest);
		return () => {
			window.removeEventListener("astra-chat-request", handleRequest);
		};
	}, [open, expanded]);

	return (
		<div
			className={cn(
				"fixed z-[70]",
				open
					? "inset-0 sm:inset-auto sm:right-6 sm:bottom-6"
					: "right-4 bottom-4 sm:right-6 sm:bottom-6",
			)}>
			{open ? (
				<AstraChatSurface
					expanded={expanded}
					onExpandedChange={setExpanded}
					onClose={() => setOpen(false)}
				/>
			) : (
				<Button
					type="button"
					size="lg"
					className="h-12 rounded-2xl px-3 shadow-2xl shadow-black/20"
					onClick={() => setOpen(true)}
					aria-label="Open Astra">
					<span className="relative size-6 overflow-hidden rounded-lg border border-amber-foreground/20">
						<Image
							src="/mm.png"
							alt=""
							fill
							sizes="24px"
							className="object-cover object-top"
						/>
					</span>
					Astra
					<MessageSquareText className="size-4" />
				</Button>
			)}
		</div>
	);
}
