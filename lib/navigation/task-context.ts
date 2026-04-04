export const TASK_CONTEXT_FROM = {
  Overview: "overview",
  Workbench: "workbench",
  Governance: "governance",
  Results: "results",
  ResultDetail: "result-detail",
  TaskGovernance: "task-governance",
  SceneAssets: "scene-assets",
  AssetDetail: "asset-detail",
  Assets: "assets",
  TaskRuns: "task-runs",
  Tasks: "tasks",
} as const;

export type TaskContextFrom = (typeof TASK_CONTEXT_FROM)[keyof typeof TASK_CONTEXT_FROM];

const TASK_CONTEXT_FROM_LABELS: Record<TaskContextFrom, string> = {
  overview: "Overview",
  workbench: "Workbench",
  governance: "Governance",
  results: "Results",
  "result-detail": "Result Detail",
  "task-governance": "Task Governance",
  "scene-assets": "Scene Assets",
  "asset-detail": "Asset Detail",
  assets: "Assets",
  "task-runs": "Task Runs",
  tasks: "Tasks",
};

export function formatTaskContextFrom(from?: string | null): string | undefined {
  if (!from) return undefined;
  if (from in TASK_CONTEXT_FROM_LABELS) {
    return TASK_CONTEXT_FROM_LABELS[from as TaskContextFrom];
  }

  return from
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}