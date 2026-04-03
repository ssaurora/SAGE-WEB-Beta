import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSceneResultsViewModel } from "@/lib/api/scene";
import {
  getTaskStateLabel,
  getTaskStateVariant,
} from "@/lib/status/task-state";

export default async function SceneResultsPage({
  params,
}: {
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;
  const vm = await getSceneResultsViewModel(sceneId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Scene Results</CardTitle>
            <Badge variant={getTaskStateVariant(vm.latestState)}>
              {getTaskStateLabel(vm.latestState)}
            </Badge>
          </div>
          <CardDescription>
            {vm.sceneId} · 地图化、指标化与解释化结果消费
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Result Packages</CardTitle>
          <CardDescription>结果包、来源任务与解释可用性</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {vm.items.map((item) => (
            <div key={item.resultId} className="rounded-md border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{item.resultId}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    from {item.fromTaskId} · {item.generatedAt}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={item.mapLayerReady ? "secondary" : "outline"}>
                    {item.mapLayerReady ? "地图图层可用" : "地图图层未就绪"}
                  </Badge>
                  <Badge
                    variant={item.explanationReady ? "secondary" : "outline"}
                  >
                    {item.explanationReady ? "解释可用" : "解释待生成"}
                  </Badge>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.summary}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
