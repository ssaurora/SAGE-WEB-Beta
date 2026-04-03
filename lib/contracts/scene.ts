export type SceneOverviewPageViewModel = {
  sceneName: string;
  analysisTheme: string;
  updatedAt: string;
  extent: {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  };
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
    | "Draft"
    | "Understanding"
    | "Planning"
    | "Waiting for Required Input"
    | "Ready to Run"
    | "Queued"
    | "Running"
    | "Processing Results"
    | "Action Required"
    | "Completed"
    | "Failed"
    | "Cancelled";
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
  latestState: "Processing Results" | "Completed" | "Failed";
  items: SceneResultItemViewModel[];
};

export type SceneResultDetailPageViewModel = {
  sceneId: string;
  resultId: string;
  fromTaskId: string;
  summary: string;
  generatedAt: string;
  explanation: string;
  indicators: Array<{
    name: string;
    value: string;
    trend: "up" | "down" | "flat";
  }>;
  inputOutputMapping: Array<{ input: string; output: string }>;
  downloadableArtifacts: string[];
};

export type SceneAuditEventLevel = "info" | "warning" | "error";
export type SceneAuditEventType = "input" | "runtime" | "manifest" | "result";

export type SceneAuditEvent = {
  id: string;
  at: string;
  level: SceneAuditEventLevel;
  type: SceneAuditEventType;
  taskId: string;
  message: string;
};

export type SceneAuditPageViewModel = {
  sceneId: string;
  summary: {
    totalEvents: number;
    warningCount: number;
    errorCount: number;
    latestMessage: string;
  };
  events: SceneAuditEvent[];
};

export type SceneAssetViewModel = {
  assetId: string;
  name: string;
  type: "Vector" | "Raster" | "Table" | "Document";
  bindStatus: "Bound" | "Unbound" | "Missing";
  uploadedAt: string;
  visibility: "Public" | "Scene" | "Task";
};

export type SceneAssetsPageViewModel = {
  sceneId: string;
  items: SceneAssetViewModel[];
};
