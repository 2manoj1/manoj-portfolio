import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
	createUIMessageStream,
	createUIMessageStreamResponse,
	type UIMessage,
	type UIMessageStreamWriter,
} from "ai";
import {
	createManojAgent,
	extractMessageText,
	streamManojFastAgent,
} from "@/lib/manoj-agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClientChatMessage = {
	role: "user" | "assistant";
	content: string;
};

type AgentToolEvent = {
	type: "tool";
	name: string;
	label: string;
	status: "started" | "finished";
};

type AgentStatusEvent = {
	type: "status";
	label: string;
};

type AgentEvent = AgentToolEvent | AgentStatusEvent;

const MAX_HISTORY_MESSAGES = 6;
const MAX_MESSAGE_CHARS = 2000;
const AGENT_RUNTIME = process.env.MANOJ_AGENT_RUNTIME ?? "fast";

function getMessageText(message: UIMessage) {
	return message.parts
		.map((part) => {
			if (part.type === "text") {
				return part.text;
			}

			return "";
		})
		.filter(Boolean)
		.join("\n")
		.trim();
}

function toClientMessages(messages: unknown): ClientChatMessage[] {
	if (!Array.isArray(messages)) {
		return [];
	}

	return messages
		.filter((message): message is UIMessage => {
			if (!message || typeof message !== "object") {
				return false;
			}

			const candidate = message as Partial<UIMessage>;
			return (
				(candidate.role === "user" || candidate.role === "assistant") &&
				Array.isArray(candidate.parts)
			);
		})
		.map((message) => ({
			role: message.role as "user" | "assistant",
			content: getMessageText(message).slice(0, MAX_MESSAGE_CHARS),
		}))
		.filter((message) => message.content.length > 0)
		.slice(-MAX_HISTORY_MESSAGES);
}

function toAgentMessages(messages: ClientChatMessage[]) {
	return messages.map((message) =>
		message.role === "user"
			? new HumanMessage(message.content)
			: new AIMessage(message.content),
	);
}

function getLastAssistantText(result: unknown) {
	if (!result || typeof result !== "object" || !("messages" in result)) {
		return "";
	}

	const messages = (result as { messages?: unknown }).messages;
	if (!Array.isArray(messages)) {
		return "";
	}

	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (
			message &&
			typeof message === "object" &&
			"_getType" in message &&
			typeof message._getType === "function" &&
			message._getType() === "ai"
		) {
			return extractMessageText((message as { content?: unknown }).content);
		}
	}

	return "";
}

function createToolEventWriter(writer: UIMessageStreamWriter<UIMessage>) {
	const toolCallIds = new Map<string, string>();

	return (event: AgentEvent) => {
		if (event.type === "status") {
			writer.write({
				type: "data-status",
				data: { label: event.label },
				transient: true,
			});
			return;
		}

		const existingId = toolCallIds.get(event.name);
		const toolCallId =
			existingId ?? `${event.name}-${Date.now()}-${toolCallIds.size}`;
		toolCallIds.set(event.name, toolCallId);

		if (event.status === "started") {
			writer.write({
				type: "data-status",
				data: { label: event.label },
				transient: true,
			});

			writer.write({
				type: "tool-input-available",
				toolCallId,
				toolName: event.name,
				input: { label: event.label },
				title: event.label,
			});
			return;
		}

		writer.write({
			type: "tool-output-available",
			toolCallId,
			output: { label: event.label, status: event.status },
		});
	};
}

export async function POST(req: Request) {
	let body: unknown;

	try {
		body = await req.json();
	} catch {
		return Response.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const messagesInput =
		body && typeof body === "object" && "messages" in body
			? (body as { messages?: unknown }).messages
			: undefined;

	const messages = toClientMessages(messagesInput);

	if (!messages.length || messages[messages.length - 1]?.role !== "user") {
		return Response.json(
			{ error: "Send at least one user message." },
			{ status: 400 },
		);
	}

	const stream = createUIMessageStream<UIMessage>({
		async execute({ writer }) {
			const writeAgentEvent = createToolEventWriter(writer);
			const textId = `answer-${Date.now()}`;

			try {
				writeAgentEvent({
					type: "status",
					label: "Initializing Ask Manoj Agent",
				});
				writeAgentEvent({
					type: "status",
					label: "Inspecting canonical Manoj context",
				});

				const agentMessages = toAgentMessages(messages);
				writer.write({ type: "text-start", id: textId });

				if (AGENT_RUNTIME === "deep") {
					const answer =
						getLastAssistantText(
							await createManojAgent(writeAgentEvent).invoke({
								messages: agentMessages,
							}),
						) ||
						"I could not generate a reliable answer from the current Manoj context.";

					writer.write({ type: "text-delta", id: textId, delta: answer });
				} else {
					let streamed = false;

					for await (const delta of streamManojFastAgent(
						agentMessages,
						writeAgentEvent,
					)) {
						streamed = true;
						writer.write({ type: "text-delta", id: textId, delta });
					}

					if (!streamed) {
						writer.write({
							type: "text-delta",
							id: textId,
							delta:
								"I could not generate a reliable answer from the current Manoj context.",
						});
					}
				}

				writer.write({ type: "text-end", id: textId });
			} catch (error) {
				console.error("Manoj agent chat route failed", error);
				writer.write({
					type: "error",
					errorText:
						"Astra could not complete the grounded response. Please try again in a moment.",
				});
			}
		},
	});

	return createUIMessageStreamResponse({ stream });
}
