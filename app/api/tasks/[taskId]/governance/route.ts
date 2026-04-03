import { NextResponse } from "next/server";
import { taskGovernanceMockMap } from "@/lib/mock/task";

export async function GET(
  _request: Request,
  context: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await context.params;
  const found = taskGovernanceMockMap[taskId] ?? {
    taskId,
    sceneId: "scene-unknown",
    currentState: "Failed",
    stageState: "UNKNOWN",
    canResume: false,
    canCancel: false,
    resultAvailable: false,
    missingRequiredInputs: [],
    requiredActions: ["请重新发起分析任务或联系管理员排查任务记录。"],
    suggestedFixes: ["确认 sceneId 和 taskId 是否匹配。"],
    lifecycleEvents: ["No governance record found"],
    manifestSummary: {
      analysisType: "Unknown",
      modelName: "Unknown",
      requiredInputsReady: "0/0",
      runtimeProfile: "unknown",
    },
    artifacts: [],
    auditSummary: "未找到任务治理信息。",
    failureSummary: "治理记录缺失，无法判断可恢复性。",
  };

  return NextResponse.json(found);
}
