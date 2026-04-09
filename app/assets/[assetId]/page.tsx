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
import { getAssetDetailViewModel } from "@/lib/api/asset";
import {
  formatTaskContextFrom,
  TASK_CONTEXT_FROM,
} from "@/lib/navigation/task-context";

function bindStatusLabel(status: "Bound" | "Unbound" | "Missing") {
  if (status === "Bound") return "已绑定";
  if (status === "Unbound") return "未绑定";
  return "缺失";
}

function bindStatusVariant(status: "Bound" | "Unbound" | "Missing") {
  if (status === "Bound") return "secondary" as const;
  if (status === "Missing") return "destructive" as const;
  return "outline" as const;
}

export default async function AssetDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ assetId: string }>;
  searchParams: Promise<{ from?: string; sceneId?: string }>;
}) {
  const { assetId } = await params;
  const { from, sceneId } = await searchParams;
  const contextFromLabel = formatTaskContextFrom(from);
  let vm;

  try {
    vm = await getAssetDetailViewModel(assetId);
  } catch {
    return (
      <div className="space-y-4">
        <DataStateCard
          title="Asset detail unavailable"
          description="当前资产详情不可用，可能不存在或加载失败。"
          tone="error"
          actionHref="/assets"
          actionLabel="Back to Assets"
        />
      </div>
    );
  }

  const currentIssueMessage =
    vm.bindStatus === "Missing"
      ? "当前资产缺失，建议立即替换来源或重新上传。"
      : vm.bindStatus === "Unbound"
        ? "当前资产可用但未绑定，建议按最近任务上下文完成绑定。"
        : "当前资产已绑定且可用，可继续查看关系链路或返回任务执行。";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>{vm.name}</CardTitle>
              <CardDescription>
                {vm.assetId} · {vm.sceneId} · 资产元数据与关系详情 · 上传于{" "}
                {vm.uploadedAt}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/assets${sceneId ? `?sceneId=${sceneId}&from=${TASK_CONTEXT_FROM.AssetDetail}` : ""}`}
              >
                <Button size="sm" variant="outline">
                  返回资产列表
                </Button>
              </Link>
              <Link
                href={`/scenes/${vm.sceneId}/assets?from=${TASK_CONTEXT_FROM.AssetDetail}`}
              >
                <Button size="sm" variant="outline">
                  查看场景资产
                </Button>
              </Link>
              {vm.lastTaskId ? (
                <Link
                  href={`/task-governance/${vm.lastTaskId}?from=${TASK_CONTEXT_FROM.AssetDetail}&taskId=${vm.lastTaskId}`}
                >
                  <Button size="sm" variant="secondary">
                    查看任务治理
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </CardHeader>
      </Card>

      {from ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Context Notes</CardTitle>
            <CardDescription>
              当前资产详情由 {contextFromLabel ?? from} 进入
              {sceneId ? ` · scene ${sceneId}` : ""}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Asset Status</CardTitle>
          <CardDescription>
            先判断当前问题，再进入元数据与关系详情
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Current Decision
            </p>
            <p className="mt-1">{currentIssueMessage}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border p-3 text-sm">
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="mt-1 font-medium">{vm.type}</p>
            </div>
            <div className="rounded-md border p-3 text-sm">
              <p className="text-xs text-muted-foreground">Bind Status</p>
              <Badge
                className="mt-2"
                variant={bindStatusVariant(vm.bindStatus)}
              >
                {bindStatusLabel(vm.bindStatus)}
              </Badge>
            </div>
            <div className="rounded-md border p-3 text-sm">
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="mt-1 font-medium">{vm.visibility}</p>
            </div>
            <div className="rounded-md border p-3 text-sm">
              <p className="text-xs text-muted-foreground">Last Task</p>
              <p className="mt-1 font-medium">{vm.lastTaskId ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Asset Evidence</CardTitle>
          <CardDescription>元数据、关联关系、标签与审计摘要</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Source</p>
            <p className="mt-1 font-medium text-foreground">{vm.source}</p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Format</p>
            <p className="mt-1 font-medium text-foreground">{vm.format}</p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Size</p>
            <p className="mt-1 font-medium text-foreground">{vm.size}</p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Checksum</p>
            <p className="mt-1 break-all font-medium text-foreground">
              {vm.checksum}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Used By</CardTitle>
          <CardDescription>场景 / 任务 / 结果关联</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Scene</p>
            <p className="mt-1 font-medium text-foreground">
              {vm.usedBy.sceneId}
            </p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Task</p>
            <p className="mt-1 font-medium text-foreground">
              {vm.usedBy.taskId ?? "-"}
            </p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Result</p>
            <p className="mt-1 font-medium text-foreground">
              {vm.usedBy.resultId ?? "-"}
            </p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Result Artifact</p>
            <p className="mt-1 font-medium text-foreground">
              {vm.usedBy.reportId ?? "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {vm.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audit Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{vm.auditSummary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
