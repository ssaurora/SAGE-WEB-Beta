export type {
  SceneAssetViewModel,
  SceneAssetsPageViewModel,
  SceneAuditEvent,
  SceneAuditEventLevel,
  SceneAuditEventType,
  SceneAuditPageViewModel,
  SceneOverviewPageViewModel,
  SceneResultDetailPageViewModel,
  SceneResultItemViewModel,
  SceneResultsPageViewModel,
  SceneTaskRunItemViewModel,
  SceneTaskRunsPageViewModel,
  WorkbenchPageViewModel,
} from "@/lib/contracts/scene";

import type {
  SceneAssetsPageViewModel,
  SceneAuditPageViewModel,
  SceneOverviewPageViewModel,
  SceneResultDetailPageViewModel,
  SceneResultsPageViewModel,
  SceneTaskRunsPageViewModel,
  WorkbenchPageViewModel,
} from "@/lib/contracts/scene";

export const sceneOverviewMock: SceneOverviewPageViewModel = {
  sceneName: "scene-001 · Watershed analysis",
  analysisTheme: "Water Yield",
  updatedAt: "2026-04-03 10:30",
  extent: {
    minLng: 116.05,
    minLat: 39.75,
    maxLng: 116.75,
    maxLat: 40.2,
  },
  latestTask: {
    id: "task-001",
    state: "Running",
    progressText: "Running model · 67%",
  },
  latestResult: {
    resultId: "result-2026-001",
    summary: "上次运行已生成水量分布图和分区摘要。",
    available: true,
  },
  pendingActions: [
    "补齐 LULC 2025 输入",
    "确认降水栅格版本",
    "检查结果解释草稿",
  ],
  recentActivities: [
    "10:22 · 资产上传完成：precip_2025.tif",
    "10:18 · 启动 task-001 运行",
    "10:12 · 绑定输入：watershed_boundary.geojson",
  ],
};

export const workbenchMock: WorkbenchPageViewModel = {
  header: {
    sceneName: "scene-001 · Watershed analysis",
    analysisType: "Water Yield",
    modelName: "InVEST water_yield",
    currentState: "Waiting for Required Input",
    requiredInputsReady: "3 / 5",
  },
  inputsPanel: {
    required: [
      {
        name: "Study Area Boundary",
        status: "Bound",
        expectedType: "Vector Polygon",
      },
      { name: "LULC Raster", status: "Missing", expectedType: "Raster" },
      { name: "Precipitation Raster", status: "Bound", expectedType: "Raster" },
    ],
    optional: [
      { name: "Biophysical Table", status: "Unbound", expectedType: "CSV" },
    ],
  },
  layersPanel: [
    { name: "Study Area", visible: true },
    { name: "Precipitation 2025", visible: true },
    { name: "Water Yield Result", visible: false },
  ],
  analysisPanel: {
    suggestedNextSteps: [
      "上传并绑定 LULC Raster",
      "运行前检查参数摘要",
      "进入 Task Tab 确认当前阻塞项",
    ],
    contextSummary: "当前任务可恢复，缺少 1 个必需输入。",
  },
  taskPanel: {
    canRun: false,
    lifecycleSummary:
      "Draft → Waiting for Required Input → Ready to Run → Running",
  },
};

export const sceneTaskRunsMock: SceneTaskRunsPageViewModel = {
  sceneId: "scene-001",
  items: [
    {
      taskId: "task-001",
      analysisType: "Water Yield",
      modelName: "InVEST water_yield",
      currentState: "Running",
      updatedAt: "2026-04-03 10:40",
      canResume: false,
      resultAvailable: false,
    },
    {
      taskId: "task-002",
      analysisType: "Water Yield",
      modelName: "InVEST water_yield",
      currentState: "Waiting for Required Input",
      updatedAt: "2026-04-03 09:55",
      canResume: true,
      resultAvailable: false,
    },
    {
      taskId: "task-000",
      analysisType: "Water Yield",
      modelName: "InVEST water_yield",
      currentState: "Completed",
      updatedAt: "2026-04-02 17:20",
      canResume: false,
      resultAvailable: true,
    },
  ],
};

export const sceneResultsMock: SceneResultsPageViewModel = {
  sceneId: "scene-001",
  latestState: "Completed",
  items: [
    {
      resultId: "result-2026-001",
      fromTaskId: "task-000",
      summary: "生成水量分布图、子流域统计表与结果解释摘要。",
      generatedAt: "2026-04-02 17:25",
      mapLayerReady: true,
      explanationReady: true,
    },
    {
      resultId: "result-2026-000",
      fromTaskId: "task-900",
      summary: "历史结果快照，仅包含指标表与基础图层。",
      generatedAt: "2026-03-28 14:09",
      mapLayerReady: true,
      explanationReady: false,
    },
  ],
};

export const sceneAuditMock: SceneAuditPageViewModel = {
  sceneId: "scene-001",
  summary: {
    totalEvents: 7,
    warningCount: 2,
    errorCount: 1,
    latestMessage: "10:44 · Manifest check completed with 1 warning",
  },
  events: [
    {
      id: "audit-001",
      at: "10:44",
      level: "warning",
      type: "manifest",
      taskId: "task-001",
      message: "Manifest checksum drift detected on optional metadata.",
    },
    {
      id: "audit-002",
      at: "10:40",
      level: "info",
      type: "runtime",
      taskId: "task-001",
      message: "Runtime checks passed for preprocessing stage.",
    },
    {
      id: "audit-003",
      at: "10:31",
      level: "error",
      type: "input",
      taskId: "task-002",
      message: "Required input LULC Raster missing at validation.",
    },
    {
      id: "audit-004",
      at: "10:22",
      level: "info",
      type: "input",
      taskId: "task-001",
      message: "Asset uploaded and bound: precip_2025.tif",
    },
    {
      id: "audit-005",
      at: "10:18",
      level: "info",
      type: "runtime",
      taskId: "task-001",
      message: "Task submitted to execution queue.",
    },
    {
      id: "audit-006",
      at: "09:56",
      level: "warning",
      type: "result",
      taskId: "task-000",
      message: "Result explanation package partially generated.",
    },
    {
      id: "audit-007",
      at: "09:48",
      level: "info",
      type: "result",
      taskId: "task-000",
      message: "Map layer package published for result-2026-001.",
    },
  ],
};

export const sceneAssetsMock: SceneAssetsPageViewModel = {
  sceneId: "scene-001",
  items: [
    {
      assetId: "asset-001",
      name: "watershed_boundary.geojson",
      type: "Vector",
      bindStatus: "Bound",
      uploadedAt: "2026-04-02 14:30",
      visibility: "Scene",
    },
    {
      assetId: "asset-002",
      name: "precip_2025.tif",
      type: "Raster",
      bindStatus: "Bound",
      uploadedAt: "2026-04-03 10:22",
      visibility: "Task",
    },
    {
      assetId: "asset-003",
      name: "lulc_2024.tif",
      type: "Raster",
      bindStatus: "Missing",
      uploadedAt: "2026-03-28 09:15",
      visibility: "Scene",
    },
    {
      assetId: "asset-004",
      name: "biophysical_table_v2.csv",
      type: "Table",
      bindStatus: "Unbound",
      uploadedAt: "2026-04-01 16:45",
      visibility: "Public",
    },
  ],
};

export const sceneResultDetailsMock: Record<
  string,
  SceneResultDetailPageViewModel
> = {
  "result-2026-001": {
    sceneId: "scene-001",
    resultId: "result-2026-001",
    fromTaskId: "task-000",
    summary: "生成水量分布图、子流域统计表与结果解释摘要。",
    generatedAt: "2026-04-02 17:25",
    explanation:
      "本次结果显示中游子流域水量贡献最高，主要受降水分布与土地覆盖类型共同影响。建议优先关注北侧坡地的地表径流抑制策略。",
    indicators: [
      { name: "总水量", value: "1.26e8 m³", trend: "up" },
      { name: "高产水区占比", value: "34.2%", trend: "flat" },
      { name: "低产水区占比", value: "18.7%", trend: "down" },
    ],
    inputOutputMapping: [
      { input: "Precipitation Raster 2025", output: "Water Yield Layer" },
      { input: "LULC Raster 2024", output: "Sub-basin Statistics" },
    ],
    downloadableArtifacts: [
      "water_yield_2026_001.tif",
      "sub_basin_stats_2026_001.csv",
      "result_explanation_2026_001.md",
    ],
  },
  "result-2026-000": {
    sceneId: "scene-001",
    resultId: "result-2026-000",
    fromTaskId: "task-900",
    summary: "历史结果快照，仅包含指标表与基础图层。",
    generatedAt: "2026-03-28 14:09",
    explanation:
      "该历史快照用于对比基线，仅包含核心统计指标与基础图层，不包含完整解释包。",
    indicators: [
      { name: "总水量", value: "1.11e8 m³", trend: "flat" },
      { name: "高产水区占比", value: "30.8%", trend: "down" },
      { name: "低产水区占比", value: "21.1%", trend: "up" },
    ],
    inputOutputMapping: [
      {
        input: "Precipitation Raster 2024",
        output: "Water Yield Baseline Layer",
      },
      { input: "LULC Raster 2023", output: "Baseline Statistics" },
    ],
    downloadableArtifacts: [
      "baseline_stats_2026_000.csv",
      "baseline_layer_2026_000.tif",
    ],
  },
};
