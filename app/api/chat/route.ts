import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();
	const message = body.message;

	// TEMP AI LOGIC (replace later with OpenAI / RAG)
	const response = `Based on Manoj's expertise in MCP, Agentic AI, and RAG systems: ${message}`;

	return NextResponse.json({ response });
}
