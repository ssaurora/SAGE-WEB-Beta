import { NextResponse } from 'next/server';
import { sceneOverviewMock } from '@/lib/mock/scene';

export async function GET(
  _request: Request,
  context: { params: Promise<{ sceneId: string }> },
) {
  const { sceneId } = await context.params;

  return NextResponse.json({
    ...sceneOverviewMock,
    sceneName: `${sceneId} · Watershed analysis`,
  });
}
