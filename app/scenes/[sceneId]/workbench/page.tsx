import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { workbenchMock } from "@/lib/mock/scene";

export default function SceneWorkbenchPage() {
  const vm = workbenchMock;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{vm.header.analysisType}</CardTitle>
            <Badge variant="outline">{vm.header.modelName}</Badge>
            <Badge variant="secondary">{vm.header.currentState}</Badge>
          </div>
          <CardDescription>
            {vm.header.sceneName} · Required Inputs Ready:{" "}
            {vm.header.requiredInputsReady}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inputs / Layers</CardTitle>
            <CardDescription>输入绑定与图层状态</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Required Inputs
              </p>
              <div className="space-y-2">
                {vm.inputsPanel.required.map((item) => (
                  <div key={item.name} className="rounded-md border p-3">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.expectedType}
                    </p>
                    <Badge
                      className="mt-2"
                      variant={
                        item.status === "Bound" ? "secondary" : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Layers
              </p>
              <div className="space-y-2">
                {vm.layersPanel.map((layer) => (
                  <div
                    key={layer.name}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span>{layer.name}</span>
                    <Badge variant={layer.visible ? "secondary" : "outline"}>
                      {layer.visible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Map Canvas</CardTitle>
            <CardDescription>GIS-first 主画布占位</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[420px] items-center justify-center rounded-md border border-dashed bg-muted/30">
              <div className="text-center">
                <p className="text-sm font-medium">Map Placeholder</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  后续接入真实地图组件、图层控制与坐标状态栏
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Analysis / Task / Context
            </CardTitle>
            <CardDescription>结构化事实优先于聊天流</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Suggested Next Steps
              </p>
              <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                {vm.analysisPanel.suggestedNextSteps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
              {vm.analysisPanel.contextSummary}
            </div>
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
              {vm.taskPanel.lifecycleSummary}
            </div>
            <Button className="w-full" disabled={!vm.taskPanel.canRun}>
              {vm.taskPanel.canRun
                ? "Run Analysis"
                : "Waiting for Required Input"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
