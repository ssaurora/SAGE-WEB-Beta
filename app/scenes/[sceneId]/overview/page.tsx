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
import { TaskContextBar } from "@/components/pages/task-context-bar";
import { getSceneOverviewViewModel } from "@/lib/api/scene";
import { TASK_CONTEXT_FROM } from "@/lib/navigation/task-context";
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

  const taskState = vm.latestTask.state;
  const isInputRecoveryState =
    taskState === "Waiting for Required Input" || taskState === "Failed";
  const isRuntimeState = taskState === "Running";
  const isCompletedState = taskState === "Completed";

  const primaryAction = isCompletedState
    ? {
        href: `/scenes/${sceneId}/results?from=${TASK_CONTEXT_FROM.Overview}&taskId=${vm.latestTask.id}`,
        label: "查看 Results",
      }
    : isRuntimeState
      ? {
          href: `/task-governance/${vm.latestTask.id}?from=${TASK_CONTEXT_FROM.Overview}&taskId=${vm.latestTask.id}`,
          label: "查看 Governance",
        }
      : isInputRecoveryState
        ? {
            href: `/scenes/${sceneId}/workbench?from=${TASK_CONTEXT_FROM.Overview}&taskId=${vm.latestTask.id}`,
            label: "进入 Workbench",
          }
        : {
            href: `/scenes/${sceneId}/workbench?from=${TASK_CONTEXT_FROM.Overview}&taskId=${vm.latestTask.id}`,
            label: "进入 Workbench",
          };

  return (
    <div className="space-y-4">
      <TaskContextBar
        sceneName={vm.sceneName}
        sceneHref={`/scenes/${sceneId}/overview`}
        taskId={vm.latestTask.id}
        taskHref={`/task-governance/${vm.latestTask.id}?from=${TASK_CONTEXT_FROM.Overview}&taskId=${vm.latestTask.id}`}
        stateLabel={vm.latestTask.state}
        stateVariant={getTaskStateVariant(vm.latestTask.state)}
        currentView="Overview"
        summary={primaryAction.label}
      />

      <Card>
        <CardHeader>
            <div className="space-y-1">
              <CardTitle className="text-base">Decision Zone</CardTitle>
              <CardDescription>先判断当前状态，再进入下一步主链路。</CardDescription>
            </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg">{vm.sceneName}</CardTitle>
                <Badge variant="outline">{vm.analysisTheme}</Badge>
              </div>
              <CardDescription>最近更新时间：{vm.updatedAt}</CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href={primaryAction.href}>
                <Button size="sm">{primaryAction.label}</Button>
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
                {primaryAction.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isCompletedState
                  ? "当前任务已完成，优先进入结果消费链路。"
                  : isRuntimeState
                    ? "当前任务处于运行链路，优先进入治理查看执行进展。"
                    : "优先处理输入与阻塞项，再进入运行与结果链路。"}
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
            <CardTitle className="text-base">Auxiliary Links</CardTitle>
            <CardDescription>非主流程入口降级为辅助导航</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Link
              href={`/scenes/${sceneId}/workbench?from=${TASK_CONTEXT_FROM.Overview}&taskId=${vm.latestTask.id}`}
              className="block text-primary underline-offset-4 hover:underline"
            >
              Workbench
            </Link>
            <Link
              href={`/task-governance/${vm.latestTask.id}?from=${TASK_CONTEXT_FROM.Overview}&taskId=${vm.latestTask.id}`}
              className="block text-primary underline-offset-4 hover:underline"
            >
              Task Governance
            </Link>
            <Link
              href={`/scenes/${sceneId}/results?from=${TASK_CONTEXT_FROM.Overview}&taskId=${vm.latestTask.id}`}
              className="block text-primary underline-offset-4 hover:underline"
            >
              Results
            </Link>
            <Link
              href={`/scenes/${sceneId}/task-runs?from=${TASK_CONTEXT_FROM.Overview}`}
              className="block text-primary underline-offset-4 hover:underline"
            >
              Task Runs
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Actions</CardTitle>
          <CardDescription>折叠后的待处理事项，仅作证据参考</CardDescription>
        </CardHeader>
        <CardContent>
          <details className="rounded-md border p-3">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              展开待处理事项
            </summary>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
              {vm.pendingActions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
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
        </CardContent>
      </Card>
    </div>
  );
}
