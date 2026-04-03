import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SceneResultsPanel } from "@/components/pages/scene-results-panel";
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

      <SceneResultsPanel sceneId={vm.sceneId} items={vm.items} />
    </div>
  );
}
