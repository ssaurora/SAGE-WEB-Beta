import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sceneOverviewMock } from "@/lib/mock/scene";

export default function SceneOverviewPage() {
  const vm = sceneOverviewMock;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{vm.sceneName}</CardTitle>
            <Badge variant="outline">{vm.analysisTheme}</Badge>
          </div>
          <CardDescription>最近更新时间：{vm.updatedAt}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Latest Task</p>
            <p className="mt-1 text-sm font-semibold">{vm.latestTask.id}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {vm.latestTask.state} · {vm.latestTask.progressText}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Latest Result</p>
            <p className="mt-1 text-sm font-semibold">
              {vm.latestResult.reportId}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {vm.latestResult.summary}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Map Preview</p>
            <p className="mt-1 text-sm font-semibold">Scene extent ready</p>
            <p className="mt-1 text-xs text-muted-foreground">
              后续接入真实地图预览组件
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Actions</CardTitle>
            <CardDescription>场景当前待处理事项</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
              {vm.pendingActions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activities</CardTitle>
            <CardDescription>最近场景活动</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {vm.recentActivities.map((item) => (
              <p
                key={item}
                className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
              >
                {item}
              </p>
            ))}
            <div className="pt-1">
              <Button size="sm">进入 Workbench</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
