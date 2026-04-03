import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppRoleBanner } from "@/components/pages/app-role-banner";
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

    return (
      <div className="space-y-4">
        <AppRoleBanner />
        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
            <CardDescription>
              全局资产清册、绑定状态与跨场景复用视图
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
          actionLabel="Retry"
        />
      </div>
    );
  }
}
