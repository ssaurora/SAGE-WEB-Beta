import { NextResponse } from "next/server";
import { sceneResultDetailsMock } from "@/lib/mock/scene";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sceneId: string; resultId: string }> },
) {
  const { sceneId, resultId } = await context.params;
  const detail = sceneResultDetailsMock[resultId];

  if (!detail) {
    return NextResponse.json({ message: "Result not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...detail,
    sceneId,
    resultId,
  });
}
