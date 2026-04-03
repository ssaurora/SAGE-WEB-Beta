import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTaskGovernanceViewModel } from "@/lib/api/task";
import {
  getTaskStateLabel,
  getTaskStateVariant,
} from "@/lib/status/task-state";

export default async function TaskGovernancePage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const vm = await getTaskGovernanceViewModel(taskId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{vm.taskId}</CardTitle>
            <Badge variant={getTaskStateVariant(vm.currentState)}>
              {getTaskStateLabel(vm.currentState)}
            </Badge>
            <Badge variant="outline">{vm.stageState}</Badge>
          </div>
          <CardDescription>{vm.sceneId} · 任务治理与审计摘要</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            可恢复：{vm.canResume ? "是" : "否"}
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            可取消：{vm.canCancel ? "是" : "否"}
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            结果可用：{vm.resultAvailable ? "是" : "否"}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Missing Required Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            {vm.missingRequiredInputs.length === 0 ? (
              <p className="text-sm text-muted-foreground">无缺失输入</p>
            ) : (
              <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                {vm.missingRequiredInputs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Artifacts</CardTitle>
          </CardHeader>
          <CardContent>
            {vm.artifacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无工件</p>
            ) : (
              <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                {vm.artifacts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lifecycle Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {vm.lifecycleEvents.map((event) => (
            <p
              key={event}
              className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
            >
              {event}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audit Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{vm.auditSummary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
