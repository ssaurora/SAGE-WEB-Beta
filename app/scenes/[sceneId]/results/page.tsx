import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataStateCard } from "@/components/pages/data-state-card";
import { SceneResultsPanel } from "@/components/pages/scene-results-panel";
import { getSceneResultsViewModel } from "@/lib/api/scene";
import {
  getTaskStateLabel,
  getTaskStateVariant,
} from "@/lib/status/task-state";

export default async function SceneResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ sceneId: string }>;
  searchParams: Promise<{ taskId?: string; from?: string }>;
}) {
  const { sceneId } = await params;
  const { taskId, from } = await searchParams;
  let vm;

  try {
    vm = await getSceneResultsViewModel(sceneId);
  } catch {
    return (
      <div className="space-y-4">
        <DataStateCard
          title="Results load failed"
          description="结果列表暂时不可用，请稍后重试。"
          tone="error"
          actionHref={`/scenes/${sceneId}/results`}
          actionLabel="Retry"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Scene Results</CardTitle>
            <Badge variant={getTaskStateVariant(vm.latestState)}>
              {getTaskStateLabel(vm.latestState)}
            </Badge>
          </div>
          <CardDescription>
            {vm.sceneId} · 地图化、指标化与解释化结果消费
          </CardDescription>
        </CardHeader>
      </Card>

      {taskId ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Context Filter Applied</CardTitle>
            <CardDescription>
              已按任务 {taskId} 预筛选
              {from ? ` · from ${from}` : ""}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <SceneResultsPanel
        sceneId={vm.sceneId}
        items={vm.items}
        initialTaskFilter={taskId ?? ""}
        contextFrom={from}
      />
    </div>
  );
}
