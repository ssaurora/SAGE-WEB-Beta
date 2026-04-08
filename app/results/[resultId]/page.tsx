import { Metadata } from "next";
import { ResultDetailClient } from "@/components/pages/result-detail-client";
import { TaskContextBar } from "@/components/pages/task-context-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getResultDetailViewModel as getResultDetailFromApi } from "@/lib/api/result";
import { toResultDetailViewModel } from "@/lib/adapters/result";
import type { ResultDetailViewModel } from "@/lib/contracts/result";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resultId: string }>;
}): Promise<Metadata> {
  const { resultId } = await params;
  return {
    title: `Result ${resultId}`,
    description: "View and download analysis result",
  };
}

async function getResultDetailViewModel(
  resultId: string,
): Promise<ResultDetailViewModel> {
  const detail = await getResultDetailFromApi(resultId);
  return toResultDetailViewModel(detail);
}

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const { resultId } = await params;
  const vm = await getResultDetailViewModel(resultId);

  return (
    <div className="space-y-4">
      <TaskContextBar
        sceneName={vm.sceneId}
        sceneHref={`/scenes/${vm.sceneId}/overview`}
        taskId={vm.taskId}
        taskHref={`/task-governance/${vm.taskId}`}
        currentView="Result Detail"
        summary="先判断结果可消费性，再查看明细、导出与共享动作。"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Decision Zone</CardTitle>
          <CardDescription>先确认当前结果状态，再进入详细证据。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Current State</p>
            <p className="mt-1 font-semibold">{vm.status}</p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Decision Target</p>
            <p className="mt-1 font-semibold">{vm.id}</p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            <p className="text-xs">Primary Action</p>
            <p className="mt-1 text-foreground">查看证据并决定是否导出/共享。</p>
          </div>
        </CardContent>
      </Card>

      <ResultDetailClient vm={vm} />
    </div>
  );
}
