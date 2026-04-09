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
import { SceneResultsPanel } from "@/components/pages/scene-results-panel";
import { TaskContextBar } from "@/components/pages/task-context-bar";
import { ViewportWorkspace } from "@/components/layout/viewport-workspace";
import { getSceneResultsViewModel } from "@/lib/api/scene";
import {
  formatTaskContextFrom,
  TASK_CONTEXT_FROM,
} from "@/lib/navigation/task-context";
import {
  getTaskStateLabel,
  getTaskStateVariant,
} from "@/lib/status/task-state";

function readinessLabel(
  mapLayerReady: boolean | undefined,
  explanationReady: boolean | undefined,
) {
  if (!mapLayerReady) return "Map Layer Pending";
  if (!explanationReady) return "Explanation Pending";
  return "Ready for Consumption";
}

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

  const latestResult = [...vm.items].sort((left, right) => {
    const leftTime = new Date(left.generatedAt).getTime();
    const rightTime = new Date(right.generatedAt).getTime();
    return rightTime - leftTime;
  })[0];

  const recommendedResult =
    latestResult && latestResult.explanationReady && latestResult.mapLayerReady
      ? latestResult
      : undefined;
  const contextFromLabel = formatTaskContextFrom(from);

  const primaryDecisionAction = (() => {
    if (!latestResult) {
      return {
        label: "返回 Workbench",
        href: `/scenes/${sceneId}/workbench?from=${TASK_CONTEXT_FROM.Results}`,
        hint: "当前暂无结果包，先回到 Workbench 或 Governance 完成运行链路。",
      };
    }

    if (recommendedResult) {
      return {
        label: "打开推荐结果",
        href: `/scenes/${sceneId}/results/${recommendedResult.resultId}?from=${TASK_CONTEXT_FROM.Results}&taskId=${recommendedResult.fromTaskId}`,
        hint: "最新结果的解释与地图图层都已就绪，优先进入该结果包。",
      };
    }

    if (!latestResult.mapLayerReady) {
      const goGovernance = vm.latestState === "Processing Results";
      return {
        label: goGovernance ? "返回 Governance" : "返回 Workbench",
        href: goGovernance
          ? `/task-governance/${latestResult.fromTaskId}?from=${TASK_CONTEXT_FROM.Results}&taskId=${latestResult.fromTaskId}`
          : `/scenes/${sceneId}/workbench?from=${TASK_CONTEXT_FROM.Results}&taskId=${latestResult.fromTaskId}`,
        hint: "结果图层尚未就绪，先返回运行/治理链路处理阻塞后再查看结果。",
      };
    }

    return {
      label: "查看原始结果明细",
      href: `/scenes/${sceneId}/results/${latestResult.resultId}?from=${TASK_CONTEXT_FROM.Results}&taskId=${latestResult.fromTaskId}`,
      hint: latestResult.explanationReady
        ? "先进入最新结果明细进行人工判断。"
        : "解释尚未就绪，先进入结果明细查看原始指标与映射证据。",
    };
  })();

  return (
    <ViewportWorkspace>
      <TaskContextBar
        sceneName={sceneId}
        sceneHref={`/scenes/${sceneId}/overview`}
        taskId={taskId}
        taskHref={
          taskId
            ? `/task-governance/${taskId}?from=${TASK_CONTEXT_FROM.Results}&taskId=${taskId}`
            : undefined
        }
        stateLabel={getTaskStateLabel(vm.latestState)}
        stateVariant={getTaskStateVariant(vm.latestState)}
        currentView="Results"
        fromLabel={from}
        summary={primaryDecisionAction.label}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Decision Zone</CardTitle>
          <CardDescription>先判断去向，再进入具体结果证据。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Decision Status</p>
            <p className="mt-1 font-semibold">
              {getTaskStateLabel(vm.latestState)}
            </p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Decision Target</p>
            <p className="mt-1 font-semibold">
              {latestResult?.resultId ?? "-"}
            </p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Recommended Target</p>
            <p className="mt-1 font-semibold">
              {recommendedResult?.resultId ?? "None"}
            </p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            <p className="text-xs">Decision Rationale</p>
            <p className="mt-1 text-foreground">{primaryDecisionAction.hint}</p>
          </div>
        </CardContent>
        <CardContent className="pt-0">
          <Link href={primaryDecisionAction.href}>
            <Button size="sm">{primaryDecisionAction.label}</Button>
          </Link>
        </CardContent>
      </Card>

      {taskId ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Context Notes</CardTitle>
            <CardDescription>
              已按任务 {taskId} 预筛选
              {contextFromLabel ? ` · from ${contextFromLabel}` : ""}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="hidden min-h-0 flex-1 xl:grid xl:grid-cols-[320px_minmax(0,1fr)_360px] xl:gap-4">
        <div className="min-h-0 overflow-auto pr-1">
          <SceneResultsPanel
            sceneId={vm.sceneId}
            items={vm.items}
            initialTaskFilter={taskId ?? ""}
            contextFrom={from}
          />
        </div>

        <div className="min-h-0 overflow-auto pr-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Result Main View</CardTitle>
              <CardDescription>当前优先消费目标与主结论。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border bg-muted/20 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Primary Target</p>
                <p className="mt-1 font-semibold">
                  {latestResult?.resultId ?? "-"}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Current Readiness</p>
                <p className="mt-1 font-semibold">
                  {readinessLabel(
                    latestResult?.mapLayerReady,
                    latestResult?.explanationReady,
                  )}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                <p className="text-xs">Summary</p>
                <p className="mt-1 text-foreground">
                  {latestResult?.summary ?? "暂无结果摘要"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="min-h-0 overflow-auto pr-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Result Inspector</CardTitle>
              <CardDescription>解释、映射与关联任务。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border p-3 text-sm">
                <p className="text-xs text-muted-foreground">Explanation</p>
                <p className="mt-1 font-medium">
                  {latestResult?.explanationReady ? "Ready" : "Pending"}
                </p>
              </div>
              <div className="rounded-md border p-3 text-sm">
                <p className="text-xs text-muted-foreground">Map Layer</p>
                <p className="mt-1 font-medium">
                  {latestResult?.mapLayerReady ? "Ready" : "Pending"}
                </p>
              </div>
              <div className="rounded-md border p-3 text-sm">
                <p className="text-xs text-muted-foreground">Related Task</p>
                <p className="mt-1 font-medium">
                  {latestResult?.fromTaskId ?? taskId ?? "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4 xl:hidden">
        <SceneResultsPanel
          sceneId={vm.sceneId}
          items={vm.items}
          initialTaskFilter={taskId ?? ""}
          contextFrom={from}
        />
      </div>
    </ViewportWorkspace>
  );
}
