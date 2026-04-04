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
          title="Workbench load failed"
          description="工作台暂时不可用，请稍后重试。"
          tone="error"
          actionHref={`/scenes/${sceneId}/workbench`}
          actionLabel="Retry"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
        summary={`${vm.header.analysisType} · Required Inputs Ready: ${vm.header.requiredInputsReady}`}
      />

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{vm.header.analysisType}</CardTitle>
            <Badge variant="outline">{vm.header.modelName}</Badge>
            <Badge variant={getTaskStateVariant(vm.header.currentState)}>
              {vm.header.currentState}
            </Badge>
          </div>
          <CardDescription>
            {vm.header.sceneName} · Required Inputs Ready:{" "}
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
