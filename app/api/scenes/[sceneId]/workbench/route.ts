import { NextResponse } from 'next/server';
import { workbenchMock } from '@/lib/mock/scene';

export async function GET(
  _request: Request,
  context: { params: Promise<{ sceneId: string }> },
) {
  const { sceneId } = await context.params;

  return NextResponse.json({
    ...workbenchMock,
    header: {
      ...workbenchMock.header,
      sceneName: `${sceneId} · Watershed analysis`,
    },
  });
}
