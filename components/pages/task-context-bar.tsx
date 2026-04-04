import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatTaskContextFrom } from "@/lib/navigation/task-context";
import { cn } from "@/lib/utils";

export type TaskContextView =
  | "Overview"
  | "Workbench"
  | "Governance"
  | "Results"
  | "Result Detail"
  | "Assets"
  | "Settings";

type TaskContextBarProps = {
  sceneName?: string;
  sceneHref?: string;
  taskId?: string;
  taskHref?: string;
  stateLabel?: string;
  stateVariant?: "default" | "secondary" | "destructive" | "outline" | null;
  currentView: TaskContextView;
  roleLabel?: string;
  modeLabel?: string;
  fromLabel?: string;
  summary?: string;
  className?: string;
};

export function TaskContextBar({
  sceneName,
  sceneHref,
  taskId,
  taskHref,
  stateLabel,
  stateVariant,
  currentView,
  roleLabel,
  modeLabel,
  fromLabel,
  summary,
  className,
}: TaskContextBarProps) {
  const resolvedStateVariant = stateVariant ?? "outline";
  const resolvedFromLabel = formatTaskContextFrom(fromLabel);

  return (
    <div className={cn("rounded-lg border bg-muted/20 px-4 py-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {sceneName ? (
            sceneHref ? (
              <Link
                href={sceneHref}
                className="text-sm font-semibold text-foreground hover:underline"
              >
                Scene: {sceneName}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-foreground">
                Scene: {sceneName}
              </span>
            )
          ) : null}

          {taskId ? (
            taskHref ? (
              <Link href={taskHref}>
                <Badge variant="outline">Task: {taskId}</Badge>
              </Link>
            ) : (
              <Badge variant="outline">Task: {taskId}</Badge>
            )
          ) : null}

          {stateLabel ? (
            <Badge variant={resolvedStateVariant}>{stateLabel}</Badge>
          ) : null}
          <Badge variant="secondary">View: {currentView}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {resolvedFromLabel ? (
            <Badge variant="outline">From: {resolvedFromLabel}</Badge>
          ) : null}
          {roleLabel ? <Badge variant="outline">{roleLabel}</Badge> : null}
          {modeLabel ? <Badge variant="outline">{modeLabel}</Badge> : null}
        </div>
      </div>

      {summary ? (
        <p className="mt-2 text-xs text-muted-foreground">{summary}</p>
      ) : null}
    </div>
  );
}
