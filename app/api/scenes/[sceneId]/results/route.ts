import { NextResponse } from "next/server";
import { sceneResultsMock } from "@/lib/mock/scene";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sceneId: string }> },
) {
  const { sceneId } = await context.params;

  return NextResponse.json({
    ...sceneResultsMock,
    sceneId,
  });
}
