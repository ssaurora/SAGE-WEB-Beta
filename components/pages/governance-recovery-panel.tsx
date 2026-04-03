"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type GovernanceRecoveryPanelProps = {
  sceneId: string;
  taskId: string;
  status:
    | "Waiting"
    | "Failed Recoverable"
    | "Failed Terminal"
    | "Cancelled"
    | "Completed";
  canResume: boolean;
  failureReason?: string;
  missingInputs?: string[];
  invalidBindings?: string[];
  suggestedFix?: string;
};

export function GovernanceRecoveryPanel({
  sceneId,
  taskId,
  status,
  canResume,
  failureReason,
  missingInputs = [],
  invalidBindings = [],
  suggestedFix,
}: GovernanceRecoveryPanelProps) {
  const isWaiting = status === "Waiting";
  const isFailedRecoverable = status === "Failed Recoverable";
  const isFailedTerminal = status === "Failed Terminal";
  const isCancelled = status === "Cancelled";
  const isCompleted = status === "Completed";

  if (isWaiting) {
    return (
      <Card className="border-blue-300 bg-blue-50">
        <CardHeader>
          <div className="flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <CardTitle className="text-base text-blue-900">
                In Progress or Waiting
              </CardTitle>
              <CardDescription className="text-blue-800">
                The task is waiting for input/action or still running. You can
                review context and continue in Workbench.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href={`/scenes/${sceneId}/workbench?taskId=${taskId}`}>
            <Button variant="outline">Open Workbench</Button>
          </Link>
          <Link href={`/task-governance/${taskId}`}>
            <Button variant="secondary">Refresh Status</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <CardTitle className="text-base text-green-900">
                Analysis Completed
              </CardTitle>
              <CardDescription className="text-green-800">
                The analysis has finished successfully. Results are available
                for review.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Link href={`/scenes/${sceneId}/results?taskId=${taskId}`}>
            <Button variant="default">View Results</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isFailedRecoverable) {
    return (
      <Card className="border-amber-300 bg-amber-50">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <CardTitle className="text-base text-amber-900">
                Recoverable Failure
              </CardTitle>
              <CardDescription className="text-amber-800">
                The analysis failed but can be recovered by fixing the issues
                below.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {failureReason && (
            <div className="rounded-md border border-amber-200 bg-white p-3">
              <p className="text-xs font-semibold text-amber-950">
                Failure Reason
              </p>
              <p className="mt-1 text-sm text-amber-900">{failureReason}</p>
            </div>
          )}

          {missingInputs.length > 0 && (
            <div className="rounded-md border border-amber-200 bg-white p-3">
              <p className="text-xs font-semibold text-amber-950">
                Missing Required Inputs
              </p>
              <ul className="mt-2 space-y-1">
                {missingInputs.map((input) => (
                  <li key={input} className="text-sm text-amber-900">
                    • {input}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {invalidBindings.length > 0 && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3">
              <p className="text-xs font-semibold text-red-950">
                Invalid Bindings
              </p>
              <ul className="mt-2 space-y-1">
                {invalidBindings.map((binding) => (
                  <li key={binding} className="text-sm text-red-900">
                    • {binding}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestedFix && (
            <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs font-semibold text-blue-950">
                Suggested Fix
              </p>
              <p className="mt-1 text-sm text-blue-900">{suggestedFix}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {canResume && (
              <Link href={`/scenes/${sceneId}/workbench?taskId=${taskId}`}>
                <Button variant="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Fix and Resume
                </Button>
              </Link>
            )}
            <Link href={`/scenes/${sceneId}/workbench`}>
              <Button variant="outline">Start New Analysis</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isFailedTerminal) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <CardTitle className="text-base text-destructive">
                Non-Recoverable Failure
              </CardTitle>
              <CardDescription className="text-destructive/80">
                This analysis cannot be resumed. Please start a new analysis.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {failureReason && (
            <div className="rounded-md border border-destructive/30 bg-white p-3">
              <p className="text-xs font-semibold text-destructive">
                Failure Reason
              </p>
              <p className="mt-1 text-sm text-destructive/80">
                {failureReason}
              </p>
            </div>
          )}

          {suggestedFix && (
            <div className="rounded-md border border-orange-200 bg-orange-50 p-3">
              <p className="text-xs font-semibold text-orange-950">
                Recommendation
              </p>
              <p className="mt-1 text-sm text-orange-900">{suggestedFix}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Link href={`/scenes/${sceneId}/workbench`}>
              <Button variant="default">Start New Analysis</Button>
            </Link>
            <Link href={`/task-governance/${taskId}`}>
              <Button variant="outline">View Task Details</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isCancelled) {
    return (
      <Card className="border-slate-300 bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base text-slate-900">
            Analysis Cancelled
          </CardTitle>
          <CardDescription className="text-slate-700">
            This analysis was cancelled and can be re-run if needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href={`/scenes/${sceneId}/workbench?taskId=${taskId}`}>
            <Button variant="secondary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-run Analysis
            </Button>
          </Link>
          <Link href={`/scenes/${sceneId}/workbench`}>
            <Button variant="outline">Start New Analysis</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return null;
}
