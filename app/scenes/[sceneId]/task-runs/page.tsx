import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppRoleBanner } from "@/components/pages/app-role-banner";
import { DataStateCard } from "@/components/pages/data-state-card";
import { getSceneTaskRunsViewModel } from "@/lib/api/scene";
import {
  getTaskStateLabel,
  getTaskStateVariant,
} from "@/lib/status/task-state";

export default async function SceneTaskRunsPage({
  params,
  searchParams,
}: {
  params: Promise<{ sceneId: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { sceneId } = await params;
  const { from } = await searchParams;
  let vm;

  try {
    vm = await getSceneTaskRunsViewModel(sceneId);
  } catch {
    return (
      <div className="space-y-4">
        <DataStateCard
          title="Task Runs load failed"
          description="任务运行记录暂时不可用，请稍后重试。"
          tone="error"
          actionHref={`/scenes/${sceneId}/task-runs`}
          actionLabel="Retry"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AppRoleBanner />
      <Card>
        <CardHeader>
          <CardTitle>Scene Task Runs</CardTitle>
          <CardDescription>
            {vm.sceneId} · 场景任务运行记录与状态联动
          </CardDescription>
        </CardHeader>
        {from ? (
          <CardContent className="pt-0">
            <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
              当前页面由 {from} 进入
            </div>
          </CardContent>
        ) : null}
        <CardContent className="space-y-3">
          {vm.items.map((task) => (
            <div key={task.taskId} className="rounded-md border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{task.taskId}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {task.analysisType} · {task.modelName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getTaskStateVariant(task.currentState)}>
                    {getTaskStateLabel(task.currentState)}
                  </Badge>
                  <Badge variant={task.canResume ? "secondary" : "outline"}>
                    {task.canResume ? "可恢复" : "不可恢复"}
                  </Badge>
                  <Badge
                    variant={task.resultAvailable ? "secondary" : "outline"}
                  >
                    {task.resultAvailable ? "结果可用" : "无结果"}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Updated at: {task.updatedAt}
                </p>
                <Link
                  href={`/task-governance/${task.taskId}?from=task-runs&taskId=${task.taskId}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  查看治理详情
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
