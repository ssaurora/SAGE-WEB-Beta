import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataStateCard } from "@/components/pages/data-state-card";
import { getSceneAssetsViewModel } from "@/lib/api/scene";

function getAssetTypeColor(type: "Vector" | "Raster" | "Table" | "Document") {
  switch (type) {
    case "Vector":
      return "bg-blue-100 text-blue-800";
    case "Raster":
      return "bg-green-100 text-green-800";
    case "Table":
      return "bg-purple-100 text-purple-800";
    case "Document":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getBindStatusVariant(
  status: "Bound" | "Unbound" | "Missing",
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Bound":
      return "secondary";
    case "Unbound":
      return "outline";
    case "Missing":
      return "destructive";
    default:
      return "outline";
  }
}

function getVisibilityBadgeText(visibility: "Public" | "Scene" | "Task") {
  switch (visibility) {
    case "Public":
      return "公开";
    case "Scene":
      return "场景级";
    case "Task":
      return "任务级";
    default:
      return visibility;
  }
}

export default async function SceneAssetsPage({
  params,
}: {
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;
  let vm;

  try {
    vm = await getSceneAssetsViewModel(sceneId);
  } catch {
    return (
      <div className="space-y-4">
        <DataStateCard
          title="Scene assets load failed"
          description="场景资产暂时不可用，请稍后重试。"
          tone="error"
          actionHref={`/scenes/${sceneId}/assets`}
          actionLabel="Retry"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scene Assets</CardTitle>
          <CardDescription>
            {vm.sceneId} · 场景资产管理与绑定状态
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Link
            href={`/assets?sceneId=${vm.sceneId}&from=scene-assets`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Open Global Assets (prefilled by scene)
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assets</CardTitle>
          <CardDescription>资产清册、类型、绑定状态与可见性</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {vm.items.map((item) => (
            <div key={item.assetId} className="rounded-md border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.assetId} · 上传于 {item.uploadedAt}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`${getAssetTypeColor(item.type)}`}
                    variant="outline"
                  >
                    {item.type}
                  </Badge>
                  <Badge variant={getBindStatusVariant(item.bindStatus)}>
                    {item.bindStatus === "Bound" && "已绑定"}
                    {item.bindStatus === "Unbound" && "未绑定"}
                    {item.bindStatus === "Missing" && "缺失"}
                  </Badge>
                  <Badge variant="outline">
                    {getVisibilityBadgeText(item.visibility)}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Asset detail</p>
                <Link
                  href={`/assets/${item.assetId}?from=scene-assets&sceneId=${vm.sceneId}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Open Asset Detail
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
