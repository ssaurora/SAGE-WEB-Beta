import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssetsPanel } from "@/components/pages/assets-panel";
import { getAssetListViewModel } from "@/lib/api/asset";

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ sceneId?: string; from?: string }>;
}) {
  const { sceneId, from } = await searchParams;
  const assets = await getAssetListViewModel();

  return (
    <div className="space-y-4">
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
}
