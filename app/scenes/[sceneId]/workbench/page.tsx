import { TaskContextBar } from "@/components/pages/task-context-bar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataStateCard } from "@/components/pages/data-state-card";
import { WorkbenchMapInteractive } from "@/components/pages/workbench-map-interactive";
import { getSceneWorkbenchViewModel } from "@/lib/api/scene";
import { TASK_CONTEXT_FROM } from "@/lib/navigation/task-context";
import { getTaskStateVariant } from "@/lib/status/task-state";

export default async function SceneWorkbenchPage({
  params,
  searchParams,
}: {
  params: Promise<{ sceneId: string }>;
  searchParams: Promise<{ from?: string; taskId?: string }>;
}) {
  const { sceneId } = await params;
  const { from, taskId } = await searchParams;
  let vm;
  try {
    vm = await getSceneWorkbenchViewModel(sceneId);
  } catch {
    return (
      <div className="space-y-4">
        <DataStateCard
          title="工作台加载失败"
          description="工作台暂时不可用，请稍后重试。"
          tone="error"
          actionHref={`/scenes/${sceneId}/workbench`}
          actionLabel="重试"
        />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-11rem)] min-h-[680px] flex-col gap-4 overflow-hidden">
      <TaskContextBar
        sceneName={vm.header.sceneName}
        sceneHref={`/scenes/${sceneId}/overview`}
        taskId={taskId}
        taskHref={
          taskId
            ? `/task-governance/${taskId}?from=${TASK_CONTEXT_FROM.Workbench}&taskId=${taskId}`
            : undefined
        }
        stateLabel={vm.header.currentState}
        stateVariant={getTaskStateVariant(vm.header.currentState)}
        currentView="Workbench"
        fromLabel={from}
        summary={`${vm.header.analysisType} · 必需输入就绪：${vm.header.requiredInputsReady}`}
      />

      <Card>
        <CardHeader className="pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base">Decision Zone</CardTitle>
            <CardDescription>
              先确认当前运行状态，再进入工作台交互与证据区。
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold">{vm.header.analysisType}</p>
            <Badge variant="outline">{vm.header.modelName}</Badge>
            <Badge variant={getTaskStateVariant(vm.header.currentState)}>
              {vm.header.currentState}
            </Badge>
          </div>
          <CardDescription>
            {vm.header.sceneName} · 必需输入就绪：
            {vm.header.requiredInputsReady}
          </CardDescription>
        </CardHeader>
      </Card>

      <WorkbenchMapInteractive
        vm={vm}
        sceneId={sceneId}
        contextFrom={from}
        contextTaskId={taskId}
      />
    </div>
  );
}
