"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canEditWorkbench, useAppRole } from "@/components/pages/app-role";

type TaskGovernanceActionsProps = {
  sceneId: string;
  taskId: string;
  isCompleted: boolean;
  resultAvailable: boolean;
  canResume: boolean;
  canCancel: boolean;
  isRunning: boolean;
  isWaitingInput: boolean;
  isActionRequired: boolean;
  isFailedRecoverable: boolean;
  isFailedTerminal: boolean;
};

export function TaskGovernanceActions({
  sceneId,
  taskId,
  isCompleted,
  resultAvailable,
  canResume,
  canCancel,
  isRunning,
  isWaitingInput,
  isActionRequired,
  isFailedRecoverable,
  isFailedTerminal,
}: TaskGovernanceActionsProps) {
  const { role } = useAppRole();
  const canEdit = canEditWorkbench(role);

  const primaryActionLabel = (() => {
    if (!canEdit) return "Read Only";
    if (isCompleted) return "View Results";
    if (isFailedTerminal) return "Start New Analysis";
    if (isWaitingInput || isActionRequired || isFailedRecoverable) return "Fix and Resume";
    return "Resume";
  })();

  const primaryActionDisabled =
    !canEdit || (!canResume && (isWaitingInput || isActionRequired || isFailedRecoverable));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Governance Actions</CardTitle>
          <CardDescription>
            当前角色：{role} · {canEdit ? "可执行治理动作" : "只读查看"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            {!canEdit
              ? "Viewer 模式下仅可查看治理信息；请前往 Settings 切换为 Editor 或 Admin 后再执行恢复、取消或新建分析。"
              : "Editor / Admin 模式下可执行治理动作，但仍受任务状态约束。"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
          <CardDescription>根据角色与任务状态控制可用动作</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {isCompleted && resultAvailable ? (
            <Link
              href={`/scenes/${sceneId}/results?taskId=${taskId}&from=governance`}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open Result Detail
            </Link>
          ) : (
            <Button size="sm" disabled={primaryActionDisabled}>
              {primaryActionLabel}
            </Button>
          )}

          <Button size="sm" variant="outline" disabled={!canEdit || !canCancel || isCompleted}>
            Cancel Task
          </Button>

          <Link
            href={`/scenes/${sceneId}/workbench?from=governance&taskId=${taskId}`}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Back to Workbench
          </Link>
        </CardContent>
      </Card>
    </>
  );
}
