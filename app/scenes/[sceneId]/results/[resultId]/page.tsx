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
  searchParams: Promise<{ from?: string; taskId?: string; reportId?: string }>;
}) {
  const { sceneId, resultId } = await params;
  const { from, taskId, reportId } = await searchParams;
  const vm = await getSceneResultDetailViewModel(sceneId, resultId);

  return (
    <div className="space-y-4">
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
                href={`/task-governance/${vm.fromTaskId}?from=result-detail&taskId=${vm.fromTaskId}`}
              >
                <Button size="sm" variant="outline">
                  Open Task Governance
                </Button>
              </Link>
              <Link
                href={`/reports/${reportId ?? "report-2026-001"}?from=result-detail&taskId=${vm.fromTaskId}&resultId=${vm.resultId}`}
              >
                <Button size="sm" variant="outline">
                  Open Report Detail
                </Button>
              </Link>
              <Link
                href={`/scenes/${vm.sceneId}/results${taskId ? `?taskId=${taskId}&from=${from ?? "result-detail"}` : ""}`}
              >
                <Button size="sm" variant="secondary">
                  Back to Results
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      {from ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Navigation Context</CardTitle>
            <CardDescription>
              当前详情页由 {from} 进入
              {taskId ? ` · task ${taskId}` : ""}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Result Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{vm.summary}</p>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            {vm.explanation}
          </div>
        </CardContent>
      </Card>

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
