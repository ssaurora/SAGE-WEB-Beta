import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WorkbenchNextStepsCardProps = {
  suggestedNextSteps: string[];
};

export function WorkbenchNextStepsCard({
  suggestedNextSteps,
}: WorkbenchNextStepsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Next Steps</CardTitle>
        <CardDescription>只保留有行动含义的建议</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          {suggestedNextSteps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

type WorkbenchExecutionContextCardProps = {
  contextSummary: string;
  lifecycleSummary: string;
};

export function WorkbenchExecutionContextCard({
  contextSummary,
  lifecycleSummary,
}: WorkbenchExecutionContextCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Execution Context</CardTitle>
        <CardDescription>context / lifecycle summary</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-3 rounded-md border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
          {contextSummary}
        </p>
        <details className="rounded-md border p-3">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            展开执行上下文
          </summary>
          <div className="mt-3 space-y-3">
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
              {lifecycleSummary}
            </div>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}

type WorkbenchInputsCardProps = {
  requiredReadyCount: number;
  requiredTotal: number;
  requiredMissingCount: number;
  invalidBindingCount: number;
  inputsPanelNode: ReactNode;
};

export function WorkbenchInputsCard({
  requiredReadyCount,
  requiredTotal,
  requiredMissingCount,
  invalidBindingCount,
  inputsPanelNode,
}: WorkbenchInputsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Inputs</CardTitle>
        <CardDescription>
          Required Ready {requiredReadyCount}/{requiredTotal} · Missing{" "}
          {requiredMissingCount} · Invalid {invalidBindingCount}
        </CardDescription>
      </CardHeader>
      <CardContent>{inputsPanelNode}</CardContent>
    </Card>
  );
}

type WorkbenchCurrentStateCardProps = {
  workbenchState: string;
  isFailed: boolean;
  isCompleted: boolean;
  layoutLabel: string;
  stateHint: string;
  contextFrom?: string;
  contextTaskId?: string;
  requiredReadyCount: number;
  requiredTotal: number;
  requiredMissingCount: number;
  invalidBindingCount: number;
  canEdit: boolean;
  role: string;
};

export function WorkbenchCurrentStateCard({
  workbenchState,
  isFailed,
  isCompleted,
  layoutLabel,
  stateHint,
  contextFrom,
  contextTaskId,
  requiredReadyCount,
  requiredTotal,
  requiredMissingCount,
  invalidBindingCount,
  canEdit,
  role,
}: WorkbenchCurrentStateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">Current State</CardTitle>
            <Badge
              variant={
                isFailed ? "destructive" : isCompleted ? "secondary" : "outline"
              }
            >
              {workbenchState}
            </Badge>
            <Badge variant="outline">{layoutLabel}</Badge>
          </div>
          <CardDescription>
            {stateHint}
            {contextFrom || contextTaskId
              ? ` · via ${contextFrom ?? "external"}${contextTaskId ? ` / task ${contextTaskId}` : ""}`
              : ""}
          </CardDescription>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>
              Required Ready {requiredReadyCount}/{requiredTotal}
            </span>
            <span>· Missing {requiredMissingCount}</span>
            <span>· Invalid {invalidBindingCount}</span>
          </div>
          {!canEdit ? (
            <p className="text-xs text-muted-foreground">
              Viewer 模式（{role}）下已禁用编辑操作。
            </p>
          ) : null}
        </div>
      </CardHeader>
    </Card>
  );
}
