import type { TaskPrimaryState } from "@/lib/status/task-state";

export type TaskListItem = {
  id: string;
  sceneId: string;
  analysisType: string;
  modelName: string;
  currentState: TaskPrimaryState;
  updatedAt: string;
  canResume: boolean;
  resultAvailable: boolean;
};

export type TaskGovernanceViewModel = {
  taskId: string;
  sceneId: string;
  currentState: TaskPrimaryState;
  stageState: string;
  canResume: boolean;
  canCancel: boolean;
  resultAvailable: boolean;
  missingRequiredInputs: string[];
  lifecycleEvents: string[];
  artifacts: string[];
  auditSummary: string;
};

export const taskListMock: TaskListItem[] = [
  {
    id: "task-001",
    sceneId: "scene-001",
    analysisType: "Water Yield",
    modelName: "InVEST water_yield",
    currentState: "Running",
    updatedAt: "2026-04-03 10:40",
    canResume: false,
    resultAvailable: false,
  },
  {
    id: "task-002",
    sceneId: "scene-001",
    analysisType: "Water Yield",
    modelName: "InVEST water_yield",
    currentState: "Waiting for Required Input",
    updatedAt: "2026-04-03 09:55",
    canResume: true,
    resultAvailable: false,
  },
  {
    id: "task-003",
    sceneId: "scene-002",
    analysisType: "Sediment Delivery",
    modelName: "InVEST SDR",
    currentState: "Completed",
    updatedAt: "2026-04-02 17:20",
    canResume: false,
    resultAvailable: true,
  },
  {
    id: "task-004",
    sceneId: "scene-003",
    analysisType: "Habitat Quality",
    modelName: "InVEST habitat_quality",
    currentState: "Failed",
    updatedAt: "2026-04-02 14:12",
    canResume: true,
    resultAvailable: false,
  },
];

export const taskGovernanceMockMap: Record<string, TaskGovernanceViewModel> = {
  "task-001": {
    taskId: "task-001",
    sceneId: "scene-001",
    currentState: "Running",
    stageState: "RUNNING_MODEL",
    canResume: false,
    canCancel: true,
    resultAvailable: false,
    missingRequiredInputs: [],
    lifecycleEvents: [
      "10:18 · Task submitted",
      "10:20 · Workspace prepared",
      "10:24 · Model running",
    ],
    artifacts: ["run.log", "manifest.summary.json"],
    auditSummary: "当前执行链路正常，未发现阻断项。",
  },
  "task-002": {
    taskId: "task-002",
    sceneId: "scene-001",
    currentState: "Waiting for Required Input",
    stageState: "VALIDATING_INPUTS",
    canResume: true,
    canCancel: true,
    resultAvailable: false,
    missingRequiredInputs: ["LULC Raster"],
    lifecycleEvents: [
      "09:40 · Task created",
      "09:43 · Input validation failed",
    ],
    artifacts: ["input.validation.report"],
    auditSummary: "任务可恢复，待补齐必需输入后继续运行。",
  },
};
