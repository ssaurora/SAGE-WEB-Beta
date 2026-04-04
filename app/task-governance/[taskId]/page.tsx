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
import { GovernanceRecoveryPanel } from "@/components/pages/governance-recovery-panel";
import { GovernanceManifestTab } from "@/components/pages/governance-manifest-tab";

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
  const isCancelled = vm.currentState === "Cancelled";
  const isFailedRecoverable = isFailed && vm.canResume;
  const isFailedTerminal = isFailed && !vm.canResume;
  const decisionStatus = isCompleted
    ? "Completed"
    : isFailedTerminal
      ? "Failed Terminal"
      : isFailedRecoverable
        ? "Failed Recoverable"
        : isCancelled
          ? "Cancelled"
          : "Waiting";

  const nextActionText = (() => {
    if (isCompleted) return "结果已可用，建议进入 Results 做结论消费。";
    if (isFailedRecoverable)
      return "任务可恢复，优先修复阻塞项后执行 Fix and Resume。";
    if (isFailedTerminal) return "当前任务不可恢复，建议重新发起分析。";
    if (isCancelled) return "任务已取消，可按需重新运行或新建分析。";
    if (isWaitingInput || isActionRequired)
      return "当前需用户介入，优先处理必需输入与绑定问题。";
    return "任务处理中，建议继续观察运行阶段与治理事件。";
  })();

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
          <CardDescription>
            {vm.sceneId} · 任务治理与审计摘要
            {from ? ` · via ${from}${contextTaskId ? ` / task ${contextTaskId}` : ""}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
              可恢复：{vm.canResume ? "是" : "否"}
            </div>
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
              可取消：{vm.canCancel ? "是" : "否"}
            </div>
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
              结果可用：{vm.resultAvailable ? "是" : "否"}
            </div>
          </div>

          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Next Action
            </p>
            <p className="mt-1">{nextActionText}</p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Why this status
              </p>
              <p className="mt-1">
                {vm.failureSummary
                  ? vm.failureSummary
                  : vm.missingRequiredInputs.length > 0
                    ? `检测到 ${vm.missingRequiredInputs.length} 项缺失输入。`
                    : "当前状态由任务运行阶段与治理规则共同决定。"}
              </p>
            </div>
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Primary decision
              </p>
              <p className="mt-1">
                {isFailedRecoverable
                  ? "优先恢复"
                  : isFailedTerminal
                    ? "重新发起"
                    : isCompleted
                      ? "消费结果"
                      : "继续观察 / 补齐输入"}
              </p>
            </div>
          </div>

          <GovernanceRecoveryPanel
            sceneId={vm.sceneId}
            taskId={vm.taskId}
            status={decisionStatus}
            canResume={vm.canResume}
            failureReason={vm.failureSummary}
            missingInputs={vm.missingRequiredInputs}
            invalidBindings={vm.requiredActions}
            suggestedFix={vm.suggestedFixes[0]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evidence Zone</CardTitle>
          <CardDescription>
            证据后置：阻塞项、工件、时间线与审计分层阅读。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Blocking Evidence</CardTitle>
              <CardDescription>阻塞项优先于建议项</CardDescription>
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
                  Missing Required Inputs
                </p>
                {vm.missingRequiredInputs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">无缺失输入</p>
                ) : (
                  <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                    {vm.missingRequiredInputs.map((item) => (
                      <li key={item}>{item}</li>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Manifest & Artifacts</CardTitle>
              <CardDescription>只读参数视图与运行产物</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GovernanceManifestTab
                parameters={[
                  {
                    key: "analysisType",
                    value: vm.manifestSummary.analysisType,
                    type: "parameter",
                    isEditable: false,
                    description: "Analysis Type",
                    children: [],
                  },
                  {
                    key: "modelName",
                    value: vm.manifestSummary.modelName,
                    type: "parameter",
                    isEditable: false,
                    description: "Model",
                    children: [],
                  },
                  {
                    key: "requiredInputs",
                    value: vm.manifestSummary.requiredInputsReady,
                    type: "input",
                    isEditable: false,
                    description: "Required Inputs",
                    children: vm.missingRequiredInputs.map((input) => ({
                      key: `input-${input}`,
                      value: "missing",
                      type: "input",
                      isEditable: false,
                      description: input,
                      children: [],
                    })),
                  },
                  {
                    key: "runtimeProfile",
                    value: vm.manifestSummary.runtimeProfile,
                    type: "parameter",
                    isEditable: false,
                    description: "Runtime Profile",
                    children: [],
                  },
                ]}
              />

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  Artifacts
                </p>
                {vm.artifacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">暂无工件</p>
                ) : (
                  <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                    {vm.artifacts.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline & Audit</CardTitle>
              <CardDescription>时间线与审计分层阅读</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  Lifecycle Events
                </p>
                <div className="space-y-2">
                  {vm.lifecycleEvents.map((event) => (
                    <p
                      key={event}
                      className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
                    >
                      {event}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  Audit Summary
                </p>
                <p className="text-sm text-muted-foreground">{vm.auditSummary}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
