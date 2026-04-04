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
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg">{vm.sceneName}</CardTitle>
                <Badge variant="outline">{vm.analysisTheme}</Badge>
              </div>
              <CardDescription>最近更新时间：{vm.updatedAt}</CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
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
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Current State</p>
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
              <p className="text-xs text-muted-foreground">Next Action</p>
              <p className="mt-1 text-sm font-semibold">
                {vm.pendingActions[0] ?? "进入 Workbench 继续分析"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                优先处理当前阻塞项，再进入运行与结果链路。
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
          </div>

          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            首屏目标：先判断当前状态与下一步动作，再进入 Workbench / Governance
            / Results。
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evidence Zone</CardTitle>
          <CardDescription>
            地图预览与活动记录作为辅助证据，不与主动作竞争首屏焦点。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Map Preview</CardTitle>
            <CardDescription>Scene extent preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border bg-background p-2">
              <SceneOverviewMiniMap extent={vm.extent} />
              <p className="mt-2 text-xs text-muted-foreground">
                可进入 Workbench 查看完整图层控制与对象交互。
              </p>
            </div>
          </CardContent>
        </Card>

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
      </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
