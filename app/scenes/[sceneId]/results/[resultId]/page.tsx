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
import { getSceneResultDetailViewModel } from "@/lib/api/scene";
import { TaskContextBar } from "@/components/pages/task-context-bar";
import {
  formatTaskContextFrom,
  TASK_CONTEXT_FROM,
} from "@/lib/navigation/task-context";

function trendLabel(trend: "up" | "down" | "flat") {
  if (trend === "up") return "↑ 上升";
  if (trend === "down") return "↓ 下降";
  return "→ 持平";
}

function trendVariant(trend: "up" | "down" | "flat") {
  if (trend === "up") return "secondary" as const;
  if (trend === "down") return "destructive" as const;
  return "outline" as const;
}

export default async function SceneResultDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ sceneId: string; resultId: string }>;
  searchParams: Promise<{ from?: string; taskId?: string; resultId?: string }>;
}) {
  const { sceneId, resultId } = await params;
  const { from, taskId, resultId: linkedResultId } = await searchParams;
  const vm = await getSceneResultDetailViewModel(sceneId, resultId);
  const contextFromLabel = formatTaskContextFrom(from);

  return (
    <div className="space-y-4">
      <TaskContextBar
        sceneName={vm.sceneId}
        sceneHref={`/scenes/${vm.sceneId}/overview`}
        taskId={taskId ?? vm.fromTaskId}
        taskHref={`/task-governance/${vm.fromTaskId}?from=${TASK_CONTEXT_FROM.ResultDetail}&taskId=${vm.fromTaskId}`}
        currentView="Result Detail"
        fromLabel={from}
        summary={`From task ${vm.fromTaskId}`}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Decision Zone</CardTitle>
          <CardDescription>
            先看结论，再进入指标、映射与下载证据。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Decision Summary</p>
            <p className="mt-1 font-medium">{vm.summary}</p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            {vm.explanation}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>{vm.resultId}</CardTitle>
              <CardDescription>
                from {vm.fromTaskId} · {vm.generatedAt}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/task-governance/${vm.fromTaskId}?from=${TASK_CONTEXT_FROM.ResultDetail}&taskId=${vm.fromTaskId}`}
              >
                <Button size="sm" variant="outline">
                  查看任务治理
                </Button>
              </Link>
              <Link
                href={`/results/${linkedResultId ?? vm.resultId}?from=${TASK_CONTEXT_FROM.ResultDetail}&taskId=${vm.fromTaskId}&resultId=${vm.resultId}`}
              >
                <Button size="sm" variant="outline">
                  查看结果详情
                </Button>
              </Link>
              <Link
                href={`/scenes/${vm.sceneId}/results${taskId ? `?taskId=${taskId}&from=${from ?? TASK_CONTEXT_FROM.ResultDetail}` : ""}`}
              >
                <Button size="sm" variant="secondary">
                  返回结果列表
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      {from ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Context Notes</CardTitle>
            <CardDescription>
              当前详情页由 {contextFromLabel ?? from} 进入
              {taskId ? ` · task ${taskId}` : ""}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Indicators</CardTitle>
            <CardDescription>指标摘要与趋势</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {vm.indicators.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </div>
                <Badge variant={trendVariant(item.trend)}>
                  {trendLabel(item.trend)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input / Output Mapping</CardTitle>
            <CardDescription>输入与输出映射关系</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {vm.inputOutputMapping.map((item) => (
              <div
                key={`${item.input}-${item.output}`}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <p className="font-medium">{item.input}</p>
                <p className="text-xs text-muted-foreground">→ {item.output}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Downloadable Artifacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {vm.downloadableArtifacts.map((artifact) => (
            <div key={artifact} className="rounded-md border px-3 py-2 text-sm">
              {artifact}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
