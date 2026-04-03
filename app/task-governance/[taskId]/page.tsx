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
import Link from "next/link";
import { TaskGovernanceActions } from "@/components/pages/task-governance-actions";

export default async function TaskGovernancePage({
  params,
  searchParams,
}: {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ from?: string; taskId?: string }>;
}) {
  const { taskId } = await params;
  const { from, taskId: contextTaskId } = await searchParams;
  const vm = await getTaskGovernanceViewModel(taskId);
  const isWaitingInput = vm.currentState === "Waiting for Required Input";
  const isActionRequired = vm.currentState === "Action Required";
  const isRunning = vm.currentState === "Running";
  const isFailed = vm.currentState === "Failed";
  const isCompleted = vm.currentState === "Completed";
  const isFailedRecoverable = isFailed && vm.canResume;
  const isFailedTerminal = isFailed && !vm.canResume;

  const statusTone = isFailedTerminal
    ? "border-destructive/60 bg-destructive/5"
    : isFailedRecoverable || isActionRequired || isWaitingInput
      ? "border-amber-500/60 bg-amber-500/5"
      : isRunning
        ? "border-blue-500/50 bg-blue-500/5"
        : "border-border bg-muted/30";

  const statusTitle = isWaitingInput
    ? "Waiting for Required Input"
    : isActionRequired
      ? "Action Required"
      : isFailedRecoverable
        ? "Recoverable Failure"
        : isFailedTerminal
          ? "Terminal Failure"
          : isRunning
            ? "Task Running"
            : isCompleted
              ? "Task Completed"
              : "Task Governance";

  const statusSummary = isWaitingInput
    ? "补齐并绑定必需输入后即可恢复任务。"
    : isActionRequired
      ? "任务等待人工操作，请优先完成 Required Actions。"
      : isFailedRecoverable
        ? "运行失败但可恢复，建议先执行修复动作后 Resume。"
        : isFailedTerminal
          ? "当前失败不可恢复，建议新建分析任务。"
          : isRunning
            ? "任务正在运行，建议观察生命周期与运行日志。"
            : isCompleted
              ? "任务已完成，可前往结果详情和报告消费。"
              : "查看治理建议并根据状态执行下一步操作。";
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

      {from ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Navigation Context</CardTitle>
            <CardDescription>
              当前治理页由 {from} 进入
              {contextTaskId ? ` · task ${contextTaskId}` : ""}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card className={statusTone}>
        <CardHeader>
          <CardTitle className="text-base">{statusTitle}</CardTitle>
          <CardDescription>{statusSummary}</CardDescription>
        </CardHeader>
      </Card>

      <TaskGovernanceActions
        sceneId={vm.sceneId}
        taskId={vm.taskId}
        isCompleted={isCompleted}
        resultAvailable={vm.resultAvailable}
        canResume={vm.canResume}
        canCancel={vm.canCancel}
        isRunning={isRunning}
        isWaitingInput={isWaitingInput}
        isActionRequired={isActionRequired}
        isFailedRecoverable={isFailedRecoverable}
        isFailedTerminal={isFailedTerminal}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Governance Access</CardTitle>
          <CardDescription>
            当前页面用于查看任务治理状态、建议与执行上下文；编辑类操作仍受角色与任务状态共同约束。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            Viewer 模式下建议仅查看治理信息并跳转至 Settings 调整角色；Editor /
            Admin 模式可继续执行恢复和取消。
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Governance Panel</CardTitle>
            <CardDescription>
              required actions / suggested fixes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Required Actions
              </p>
              {isWaitingInput || isActionRequired ? (
                <Badge variant="outline" className="mb-2">
                  Pending user actions
                </Badge>
              ) : null}
              {vm.requiredActions.length === 0 ? (
                <p className="text-sm text-muted-foreground">当前无必做动作</p>
              ) : (
                <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                  {vm.requiredActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Suggested Fixes
              </p>
              {vm.suggestedFixes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  当前无建议修复项
                </p>
              ) : (
                <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                  {vm.suggestedFixes.map((fix) => (
                    <li key={fix}>{fix}</li>
                  ))}
                </ul>
              )}
            </div>

            {vm.failureSummary ? (
              <div
                className={`rounded-md border p-3 text-sm text-muted-foreground ${
                  isFailedTerminal
                    ? "border-destructive/60 bg-destructive/5"
                    : "border-amber-500/60 bg-amber-500/5"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
                  Failure Summary
                </p>
                <p className="mt-1">{vm.failureSummary}</p>
              </div>
            ) : null}

            <TaskGovernanceActions
              sceneId={vm.sceneId}
              taskId={vm.taskId}
              isCompleted={isCompleted}
              resultAvailable={vm.resultAvailable}
              canResume={vm.canResume}
              canCancel={vm.canCancel}
              isRunning={isRunning}
              isWaitingInput={isWaitingInput}
              isActionRequired={isActionRequired}
              isFailedRecoverable={isFailedRecoverable}
              isFailedTerminal={isFailedTerminal}
            />
          </CardContent>
        </Card>

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
          <CardTitle className="text-base">Manifest (Read-only)</CardTitle>
          <CardDescription>分析上下文与运行配置摘要</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Analysis Type</p>
            <p className="mt-1 font-medium text-foreground">
              {vm.manifestSummary.analysisType}
            </p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Model</p>
            <p className="mt-1 font-medium text-foreground">
              {vm.manifestSummary.modelName}
            </p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Required Inputs Ready</p>
            <p className="mt-1 font-medium text-foreground">
              {vm.manifestSummary.requiredInputsReady}
            </p>
          </div>
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="text-xs">Runtime Profile</p>
            <p className="mt-1 font-medium text-foreground">
              {vm.manifestSummary.runtimeProfile}
            </p>
          </div>
        </CardContent>
      </Card>

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
