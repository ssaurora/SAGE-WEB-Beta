import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkbenchMapInteractive } from "@/components/pages/workbench-map-interactive";
import { getSceneWorkbenchViewModel } from "@/lib/api/scene";
import { getTaskStateVariant } from "@/lib/status/task-state";

export default async function SceneWorkbenchPage({
  params,
  searchParams,
}: {
  params: Promise<{ sceneId: string }>;
  searchParams: Promise<{ from?: string; taskId?: string }>;
}) {
  const { sceneId } = await params;
  const { from, taskId } = await searchParams;
  const vm = await getSceneWorkbenchViewModel(sceneId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{vm.header.analysisType}</CardTitle>
            <Badge variant="outline">{vm.header.modelName}</Badge>
            <Badge variant={getTaskStateVariant(vm.header.currentState)}>
              {vm.header.currentState}
            </Badge>
          </div>
          <CardDescription>
            {vm.header.sceneName} · Required Inputs Ready:{" "}
            {vm.header.requiredInputsReady}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr_340px]">
        <WorkbenchMapInteractive
          vm={vm}
          sceneId={sceneId}
          contextFrom={from}
          contextTaskId={taskId}
        />
      </div>
    </div>
  );
}
