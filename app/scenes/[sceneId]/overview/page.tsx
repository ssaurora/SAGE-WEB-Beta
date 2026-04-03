import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataStateCard } from "@/components/pages/data-state-card";
import { SceneOverviewMiniMap } from "@/components/pages/scene-overview-mini-map";
import { getSceneOverviewViewModel } from "@/lib/api/scene";
import { getTaskStateVariant } from "@/lib/status/task-state";

export default async function SceneOverviewPage({
  params,
}: {
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;
  let vm;

  try {
    vm = await getSceneOverviewViewModel(sceneId);
  } catch {
    return (
      <div className="space-y-4">
        <DataStateCard
          title="Overview load failed"
          description="场景概览暂时不可用，请稍后重试。"
          tone="error"
          actionHref={`/scenes/${sceneId}/overview`}
          actionLabel="Retry"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{vm.sceneName}</CardTitle>
            <Badge variant="outline">{vm.analysisTheme}</Badge>
          </div>
          <CardDescription>最近更新时间：{vm.updatedAt}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Latest Task</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-sm font-semibold">{vm.latestTask.id}</p>
              <Badge variant={getTaskStateVariant(vm.latestTask.state)}>
                {vm.latestTask.state}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {vm.latestTask.progressText}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Latest Result</p>
            <p className="mt-1 text-sm font-semibold">
              {vm.latestResult.reportId}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {vm.latestResult.summary}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Map Preview</p>
            <div className="mt-2 rounded-md border bg-background p-2">
              <SceneOverviewMiniMap extent={vm.extent} />
              <p className="mt-2 text-xs text-muted-foreground">
                Scene extent preview · 可进入 Workbench 查看完整地图
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Actions</CardTitle>
            <CardDescription>场景当前待处理事项</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
              {vm.pendingActions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activities</CardTitle>
            <CardDescription>最近场景活动</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {vm.recentActivities.map((item) => (
              <p
                key={item}
                className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
              >
                {item}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href={`/scenes/${sceneId}/workbench?from=overview&taskId=${vm.latestTask.id}`}
              >
                <Button size="sm">进入 Workbench</Button>
              </Link>
              <Link href={`/scenes/${sceneId}/task-runs?from=overview`}>
                <Button size="sm" variant="outline">
                  查看 Task Runs
                </Button>
              </Link>
              <Link
                href={`/scenes/${sceneId}/results?from=overview&taskId=${vm.latestTask.id}`}
              >
                <Button size="sm" variant="secondary">
                  查看 Results
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
