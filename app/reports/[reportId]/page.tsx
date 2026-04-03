import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReportDetailViewModel } from "@/lib/api/report";

export default async function ReportDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ from?: string; taskId?: string; resultId?: string }>;
}) {
  const { reportId } = await params;
  const { from, taskId, resultId } = await searchParams;
  const vm = await getReportDetailViewModel(reportId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>{vm.reportId}</CardTitle>
              <CardDescription>
                {vm.sceneId} · {vm.analysisType} · {vm.modelName} · {vm.time}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href="/reports">
                <Button size="sm" variant="outline">
                  Back to Reports
                </Button>
              </Link>
              <Link
                href={`/scenes/${vm.sceneId}/results/${resultId ?? vm.resultId}?from=report-detail&taskId=${taskId ?? vm.taskId}&reportId=${vm.reportId}`}
              >
                <Button size="sm" variant="outline">
                  Open Result Detail
                </Button>
              </Link>
              <Link href={`/task-governance/${vm.taskId}`}>
                <Button size="sm" variant="secondary">
                  Open Task Governance
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
              当前报告由 {from} 进入
              {taskId ? ` · task ${taskId}` : ""}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Result Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{vm.resultSummary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Map</CardTitle>
            <CardDescription>报告地图预览区</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-center justify-center rounded-md border border-dashed bg-muted/30 text-sm text-muted-foreground">
              Map Preview (Report)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {vm.metrics.map((metric) => (
              <div
                key={metric.name}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span>{metric.name}</span>
                <span className="font-medium">{metric.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            {vm.explanation}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {vm.exports.map((item) => (
            <div key={item} className="rounded-md border px-3 py-2 text-sm">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">关联上下文</CardTitle>
          <CardDescription>Task / Scene / Manifest 摘要</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Scene</p>
            <p className="mt-1 font-medium text-foreground">{vm.sceneId}</p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Task</p>
            <p className="mt-1 font-medium text-foreground">{vm.taskId}</p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Result</p>
            <p className="mt-1 font-medium text-foreground">{vm.resultId}</p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground sm:col-span-3">
            <p className="text-xs">Manifest Summary</p>
            <p className="mt-1">{vm.manifestSummary}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
