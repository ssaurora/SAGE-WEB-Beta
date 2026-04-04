import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>Scene Results</CardTitle>
                <Badge variant={getTaskStateVariant(vm.latestState)}>
                  {getTaskStateLabel(vm.latestState)}
                </Badge>
              </div>
              <CardDescription>
                {vm.sceneId} · 结论优先的结果判断与消费入口
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Total Results: {vm.items.length}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Decision Zone</CardTitle>
          <CardDescription>先看状态结论，再进入具体结果证据。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Latest State</p>
            <p className="mt-1 font-semibold">
              {getTaskStateLabel(vm.latestState)}
            </p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Latest Result</p>
            <p className="mt-1 font-semibold">{vm.items[0]?.resultId ?? "-"}</p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            当前页面用于判断结果是否可消费，再进入 Result Detail 查看证据。
          </div>
        </CardContent>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evidence Zone</CardTitle>
          <CardDescription>
            结果包、来源任务、解释和图层就绪度。
          </CardDescription>
        </CardHeader>
      </Card>

      <SceneResultsPanel
        sceneId={vm.sceneId}
        items={vm.items}
        initialTaskFilter={taskId ?? ""}
        contextFrom={from}
      />
    </div>
  );
}
