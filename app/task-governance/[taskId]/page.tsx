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
  formatTaskContextFrom,
  TASK_CONTEXT_FROM,
} from "@/lib/navigation/task-context";
import {
  getTaskStateLabel,
  getTaskStateVariant,
} from "@/lib/status/task-state";
import Link from "next/link";
import { GovernanceRecoveryPanel } from "@/components/pages/governance-recovery-panel";
import { GovernanceManifestTab } from "@/components/pages/governance-manifest-tab";
import { GovernanceEvidenceTabs } from "@/components/pages/governance-evidence-tabs";
import { TaskContextBar } from "@/components/pages/task-context-bar";
import { ViewportWorkspace } from "@/components/layout/viewport-workspace";
import { SplitPaneWorkspace } from "@/components/layout/pane-workspace";

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
  const contextFromLabel = formatTaskContextFrom(from);
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
    <ViewportWorkspace>
      <TaskContextBar
        sceneName={vm.sceneId}
        sceneHref={`/scenes/${vm.sceneId}/overview`}
        taskId={vm.taskId}
        taskHref={`/task-governance/${vm.taskId}?from=${TASK_CONTEXT_FROM.TaskGovernance}&taskId=${vm.taskId}`}
        stateLabel={getTaskStateLabel(vm.currentState)}
        stateVariant={getTaskStateVariant(vm.currentState)}
        currentView="Governance"
        fromLabel={from}
        summary={nextActionText}
      />

      <Card>
        <CardHeader>
          <div className="space-y-1">
            <CardTitle className="text-base">Decision Zone</CardTitle>
            <CardDescription>
              先判断任务去向，再进入治理证据与恢复动作。
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold">{vm.taskId}</p>
            <Badge variant={getTaskStateVariant(vm.currentState)}>
              {getTaskStateLabel(vm.currentState)}
            </Badge>
            <Badge variant="outline">{vm.stageState}</Badge>
          </div>
          <CardDescription>
            {vm.sceneId} · 任务治理与审计摘要
            {contextFromLabel
              ? ` · via ${contextFromLabel}${contextTaskId ? ` / task ${contextTaskId}` : ""}`
              : ""}
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
              Primary Action
            </p>
            <p className="mt-1">{nextActionText}</p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Decision Evidence
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
                Decision Outcome
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

      <SplitPaneWorkspace
        leftPane={
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
        }
        rightPane={
          <GovernanceEvidenceTabs
            requiredActions={vm.requiredActions}
            missingRequiredInputs={vm.missingRequiredInputs}
            failureSummary={vm.failureSummary}
            suggestedFixes={vm.suggestedFixes}
            manifestSummary={vm.manifestSummary}
            artifacts={vm.artifacts}
            lifecycleEvents={vm.lifecycleEvents}
            auditSummary={vm.auditSummary}
          />
        }
      />

      <div className="space-y-4 xl:hidden">
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
        <GovernanceEvidenceTabs
          requiredActions={vm.requiredActions}
          missingRequiredInputs={vm.missingRequiredInputs}
          failureSummary={vm.failureSummary}
          suggestedFixes={vm.suggestedFixes}
          manifestSummary={vm.manifestSummary}
          artifacts={vm.artifacts}
          lifecycleEvents={vm.lifecycleEvents}
          auditSummary={vm.auditSummary}
        />
      </div>
    </ViewportWorkspace>
  );
}
