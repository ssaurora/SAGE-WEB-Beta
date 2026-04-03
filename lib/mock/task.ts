export type {
  TaskGovernanceViewModel,
  TaskListItem,
} from "@/lib/contracts/task";

import type {
  TaskGovernanceViewModel,
  TaskListItem,
} from "@/lib/contracts/task";

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
    requiredActions: [],
    suggestedFixes: [
      "持续观察 RUNNING 阶段日志，确认无输入漂移。",
      "如超时可进入取消并重试路径。",
    ],
    lifecycleEvents: [
      "10:18 · Task submitted",
      "10:20 · Workspace prepared",
      "10:24 · Model running",
    ],
    manifestSummary: {
      analysisType: "Water Yield",
      modelName: "InVEST water_yield",
      requiredInputsReady: "3/3",
      runtimeProfile: "standard-cpu · 4 cores",
    },
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
    requiredActions: [
      "上传 LULC Raster（2024 或 2025 版本）。",
      "完成 LULC Raster 到 required role 的绑定。",
      "重新校验并执行 Resume。",
    ],
    suggestedFixes: [
      "优先使用与研究区坐标系一致的 LULC 数据。",
      "若校验失败，检查 raster 分辨率和 NoData 约定。",
    ],
    lifecycleEvents: [
      "09:40 · Task created",
      "09:43 · Input validation failed",
    ],
    manifestSummary: {
      analysisType: "Water Yield",
      modelName: "InVEST water_yield",
      requiredInputsReady: "2/3",
      runtimeProfile: "standard-cpu · 4 cores",
    },
    artifacts: ["input.validation.report"],
    auditSummary: "任务可恢复，待补齐必需输入后继续运行。",
    failureSummary: "输入校验未通过：LULC Raster 缺失。",
  },
  "task-004": {
    taskId: "task-004",
    sceneId: "scene-003",
    currentState: "Failed",
    stageState: "FAILED_MODEL_RUNTIME",
    canResume: true,
    canCancel: true,
    resultAvailable: false,
    missingRequiredInputs: [],
    requiredActions: [
      "确认基础输入完整性并重新执行前置校验。",
      "切换 runtime profile 至 standard-cpu · 8 cores 后重试。",
      "保留当前失败工件用于审计比对。",
    ],
    suggestedFixes: [
      "优先复核输入栅格的投影与分辨率一致性。",
      "检查运行日志中的内存峰值，必要时分区后再执行。",
    ],
    lifecycleEvents: [
      "13:50 · Task submitted",
      "13:53 · Input validation passed",
      "14:08 · Model runtime error",
      "14:12 · Task marked as failed (recoverable)",
    ],
    manifestSummary: {
      analysisType: "Habitat Quality",
      modelName: "InVEST habitat_quality",
      requiredInputsReady: "3/3",
      runtimeProfile: "standard-cpu · 4 cores",
    },
    artifacts: ["run.log", "error.trace", "manifest.summary.json"],
    auditSummary: "检测到可恢复运行失败，允许修复后继续执行。",
    failureSummary: "模型运行失败：内存峰值超过当前资源配置阈值。",
  },
};
