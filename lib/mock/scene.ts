export type SceneOverviewPageViewModel = {
  sceneName: string;
  analysisTheme: string;
  updatedAt: string;
  latestTask: {
    id: string;
    state:
      | "Waiting for Required Input"
      | "Ready to Run"
      | "Running"
      | "Completed"
      | "Failed";
    progressText: string;
  };
  latestResult: {
    reportId: string;
    summary: string;
    available: boolean;
  };
  pendingActions: string[];
  recentActivities: string[];
};

export type WorkbenchPageViewModel = {
  header: {
    sceneName: string;
    analysisType: string;
    modelName: string;
    currentState: string;
    requiredInputsReady: string;
  };
  inputsPanel: {
    required: Array<{
      name: string;
      status: "Missing" | "Bound";
      expectedType: string;
    }>;
    optional: Array<{
      name: string;
      status: "Unbound" | "Bound";
      expectedType: string;
    }>;
  };
  layersPanel: Array<{ name: string; visible: boolean }>;
  analysisPanel: {
    suggestedNextSteps: string[];
    contextSummary: string;
  };
  taskPanel: {
    canRun: boolean;
    lifecycleSummary: string;
  };
};

export type SceneTaskRunItemViewModel = {
  taskId: string;
  analysisType: string;
  modelName: string;
  currentState:
    | 'Draft'
    | 'Understanding'
    | 'Planning'
    | 'Waiting for Required Input'
    | 'Ready to Run'
    | 'Queued'
    | 'Running'
    | 'Processing Results'
    | 'Action Required'
    | 'Completed'
    | 'Failed'
    | 'Cancelled';
  updatedAt: string;
  canResume: boolean;
  resultAvailable: boolean;
};

export type SceneTaskRunsPageViewModel = {
  sceneId: string;
  items: SceneTaskRunItemViewModel[];
};

export type SceneResultItemViewModel = {
  resultId: string;
  fromTaskId: string;
  summary: string;
  generatedAt: string;
  mapLayerReady: boolean;
  explanationReady: boolean;
};

export type SceneResultsPageViewModel = {
  sceneId: string;
  latestState: 'Processing Results' | 'Completed' | 'Failed';
  items: SceneResultItemViewModel[];
};

export const sceneOverviewMock: SceneOverviewPageViewModel = {
  sceneName: "scene-001 · Watershed analysis",
  analysisTheme: "Water Yield",
  updatedAt: "2026-04-03 10:30",
  latestTask: {
    id: "task-001",
    state: "Running",
    progressText: "Running model · 67%",
  },
  latestResult: {
    reportId: "report-2026-001",
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
  sceneId: 'scene-001',
  items: [
    {
      taskId: 'task-001',
      analysisType: 'Water Yield',
      modelName: 'InVEST water_yield',
      currentState: 'Running',
      updatedAt: '2026-04-03 10:40',
      canResume: false,
      resultAvailable: false,
    },
    {
      taskId: 'task-002',
      analysisType: 'Water Yield',
      modelName: 'InVEST water_yield',
      currentState: 'Waiting for Required Input',
      updatedAt: '2026-04-03 09:55',
      canResume: true,
      resultAvailable: false,
    },
    {
      taskId: 'task-000',
      analysisType: 'Water Yield',
      modelName: 'InVEST water_yield',
      currentState: 'Completed',
      updatedAt: '2026-04-02 17:20',
      canResume: false,
      resultAvailable: true,
    },
  ],
};

export const sceneResultsMock: SceneResultsPageViewModel = {
  sceneId: 'scene-001',
  latestState: 'Completed',
  items: [
    {
      resultId: 'result-2026-001',
      fromTaskId: 'task-000',
      summary: '生成水量分布图、子流域统计表与结果解释摘要。',
      generatedAt: '2026-04-02 17:25',
      mapLayerReady: true,
      explanationReady: true,
    },
    {
      resultId: 'result-2026-000',
      fromTaskId: 'task-900',
      summary: '历史结果快照，仅包含指标表与基础图层。',
      generatedAt: '2026-03-28 14:09',
      mapLayerReady: true,
      explanationReady: false,
    },
  ],
};
