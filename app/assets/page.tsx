import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataStateCard } from "@/components/pages/data-state-card";
import { AssetsPanel } from "@/components/pages/assets-panel";
import { getAssetListViewModel } from "@/lib/api/asset";

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ sceneId?: string; from?: string }>;
}) {
  const { sceneId, from } = await searchParams;
  try {
    const assets = await getAssetListViewModel();
    const boundCount = assets.filter(
      (item) => item.bindStatus === "Bound",
    ).length;
    const missingCount = assets.filter(
      (item) => item.bindStatus === "Missing",
    ).length;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
            <CardDescription>
              全局资产清册、绑定状态与跨场景复用视图
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-0 sm:grid-cols-3">
            <div className="rounded-md border bg-muted/20 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Total Assets</p>
              <p className="mt-1 font-semibold">{assets.length}</p>
            </div>
            <div className="rounded-md border bg-muted/20 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Bound</p>
              <p className="mt-1 font-semibold">{boundCount}</p>
            </div>
            <div className="rounded-md border bg-muted/20 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Missing</p>
              <p className="mt-1 font-semibold">{missingCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Decision Zone</CardTitle>
            <CardDescription>
              优先处理缺失资产，再处理未绑定资产。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
              当前建议：先定位 Missing
              资产并修复来源，再根据任务上下文完成绑定。
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evidence Zone</CardTitle>
            <CardDescription>资产明细、筛选与绑定关系证据。</CardDescription>
          </CardHeader>
          <CardContent>
            <AssetsPanel
              items={assets}
              initialSceneFilter={sceneId}
              contextFrom={from}
            />
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    return (
      <div className="space-y-4">
        <DataStateCard
          title="Assets load failed"
          description="资产列表暂时不可用，请稍后重试。"
          tone="error"
          actionHref="/assets"
          actionLabel="Retry"
        />
      </div>
    );
  }
}
