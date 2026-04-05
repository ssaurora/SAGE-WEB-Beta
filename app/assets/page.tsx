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
    const unboundCount = assets.filter(
      (item) => item.bindStatus === "Unbound",
    ).length;
    const missingCount = assets.filter(
      (item) => item.bindStatus === "Missing",
    ).length;
    const statusMessage =
      missingCount > 0
        ? `当前缺失 ${missingCount} 个关键资产，建议优先修复来源或重新上传。`
        : unboundCount > 0
          ? `当前有 ${unboundCount} 个未绑定资产，建议按任务上下文完成绑定。`
          : "当前无阻塞资产，可返回 Workbench 或 Governance 继续任务链路。";

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
            <CardDescription>
              全局资产池：跨场景资产清册与治理入口
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
            <CardTitle className="text-base">Current Asset Status</CardTitle>
            <CardDescription>基于当前资产状态的实时判断</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
              {statusMessage}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Asset Inventory</CardTitle>
            <CardDescription>
              资产明细、筛选与绑定关系（
              {sceneId ? `scene ${sceneId}` : "all scenes"}）。
            </CardDescription>
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
          actionLabel="重试"
        />
      </div>
    );
  }
}
