import { Metadata } from "next";
import { ResultsListClient } from "@/components/pages/results-list-client";
import { TaskContextBar } from "@/components/pages/task-context-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ViewportWorkspace } from "@/components/layout/viewport-workspace";
import { TriPaneWorkspace } from "@/components/layout/pane-workspace";
import { getResultListViewModel } from "@/lib/api/result";
import { toResultsListViewModel } from "@/lib/adapters/result";
import type { ResultListViewModel } from "@/lib/contracts/result";

export const metadata: Metadata = {
  title: "结果",
  description: "浏览与下载分析结果",
};

async function getResultsViewModel(): Promise<ResultListViewModel> {
  const results = await getResultListViewModel();
  return toResultsListViewModel(results);
}

export default async function ResultsPage() {
  const vm = await getResultsViewModel();
  const publishedCount = vm.reports.filter(
    (item) => item.status === "Published",
  ).length;
  const latestResult = [...vm.reports].sort(
    (a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
  )[0];

  return (
    <ViewportWorkspace>
      <TaskContextBar
        sceneName="Global Results"
        currentView="Results"
        summary="先确认结果消费优先级，再进入列表筛选与明细。"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Decision Zone</CardTitle>
          <CardDescription>先判断当前消费焦点，再进入结果列表。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Current State</p>
            <p className="mt-1 font-semibold">{vm.reports.length} Results</p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Published</p>
            <p className="mt-1 font-semibold">{publishedCount}</p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            <p className="text-xs">Decision Target</p>
            <p className="mt-1 text-foreground">
              {latestResult
                ? `优先查看最新结果 ${latestResult.id}`
                : "当前无结果，先返回场景执行链路"}
            </p>
          </div>
        </CardContent>
      </Card>

      <TriPaneWorkspace
        leftPane={<ResultsListClient vm={vm} />}
        centerPane={
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Result Main View</CardTitle>
              <CardDescription>当前全局结果消费主目标。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border bg-muted/20 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Latest Result</p>
                <p className="mt-1 font-semibold">{latestResult?.id ?? "-"}</p>
              </div>
              <div className="rounded-md border bg-muted/20 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Task</p>
                <p className="mt-1 font-semibold">
                  {latestResult?.taskId ?? "-"}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Scene</p>
                <p className="mt-1 font-semibold">
                  {latestResult?.sceneId ?? "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        }
        rightPane={
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Result Inspector</CardTitle>
              <CardDescription>格式、状态与消费提示。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border p-3 text-sm">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="mt-1 font-medium">{latestResult?.status ?? "-"}</p>
              </div>
              <div className="rounded-md border p-3 text-sm">
                <p className="text-xs text-muted-foreground">Format</p>
                <p className="mt-1 font-medium">{latestResult?.format ?? "-"}</p>
              </div>
              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                <p className="text-xs">Primary Action</p>
                <p className="mt-1 text-foreground">
                  先在左侧筛选结果，再进入详情完成解释与导出。
                </p>
              </div>
            </CardContent>
          </Card>
        }
      />

      <div className="space-y-4 xl:hidden">
        <ResultsListClient vm={vm} />
      </div>
    </ViewportWorkspace>
  );
}
