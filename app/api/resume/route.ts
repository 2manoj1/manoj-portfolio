import { readFile } from "fs/promises";
import path from "path";

const RESUME_FILENAME = "Manoj_Mukherjee_AI_Architect_Resume_10YOE.pdf";

export async function GET(request: Request) {
  const filePath = path.join(process.cwd(), "public", "resume.pdf");
  const pdf = await readFile(filePath);
  const { searchParams } = new URL(request.url);
  const disposition = searchParams.get("download") === "1" ? "attachment" : "inline";

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition":
        `${disposition}; filename="${RESUME_FILENAME}"; filename*=UTF-8''${RESUME_FILENAME}`,
    },
  });
}
