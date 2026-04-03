import { NextResponse } from 'next/server';
import { taskGovernanceMockMap } from '@/lib/mock/task';

export async function GET(
  _request: Request,
  context: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await context.params;
  const found = taskGovernanceMockMap[taskId] ?? {
    taskId,
    sceneId: 'scene-unknown',
    currentState: 'Failed',
    stageState: 'UNKNOWN',
    canResume: false,
    canCancel: false,
    resultAvailable: false,
    missingRequiredInputs: [],
    lifecycleEvents: ['No governance record found'],
    artifacts: [],
    auditSummary: '未找到任务治理信息。',
  };

  return NextResponse.json(found);
}
