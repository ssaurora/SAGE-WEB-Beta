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
  requiredActions: string[];
  suggestedFixes: string[];
  lifecycleEvents: string[];
  manifestSummary: {
    analysisType: string;
    modelName: string;
    requiredInputsReady: string;
    runtimeProfile: string;
  };
  artifacts: string[];
  auditSummary: string;
  failureSummary?: string;
};
