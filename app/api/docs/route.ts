import { NextRequest, NextResponse } from "next/server";
import { getDocBySlug } from "@/lib/docs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required." },
        { status: 400 }
      );
    }

    const doc = getDocBySlug(slug);

    if (!doc) {
      return NextResponse.json(
        { error: `Document not found for slug: ${slug}` },
        { status: 404 }
      );
    }

    return NextResponse.json(doc);
  } catch (error) {
    console.error("API docs error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
