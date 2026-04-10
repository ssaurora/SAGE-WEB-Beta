export type ResultStatus = "Draft" | "Published" | "Archived";
export type ResultFormat = "PDF" | "XLSX" | "JSON";

export type ResultListItemDto = {
  resultId: string;
  sceneId: string;
  taskId?: string;
  analysisType: string;
  modelName: string;
  time: string;
  resultName?: string;
  status?: ResultStatus;
  format?: ResultFormat;
  pageCount?: number;
  fileSize?: string;
  resultSummary: string;
};

export type ResultDetailDto = {
  resultId: string;
  sceneId: string;
  taskId: string;
  analysisType: string;
  modelName: string;
  time: string;
  resultName?: string;
  status?: ResultStatus;
  format?: ResultFormat;
  pageCount?: number;
  fileSize?: string;
  generatedBy?: string;
  downloadUrl?: string;
  resultSummary: string;
  metrics: Array<{ name: string; value: string }>;
  explanation: string;
  exports: string[];
  manifestSummary: string;
};

export type ResultListItemViewModel = {
  id: string;
  name: string;
  sceneId: string;
  taskId: string;
  analysisType: string;
  generatedAt: string;
  status: ResultStatus;
  format: ResultFormat;
  pageCount?: number;
  fileSize?: string;
};

export type ResultListViewModel = {
  results: ResultListItemViewModel[];
};

export type ResultDetailSectionViewModel = {
  id: string;
  title: string;
  description?: string;
  contentPreview?: string;
};

export type ResultDetailViewModel = {
  id: string;
  name: string;
  sceneId: string;
  taskId: string;
  analysisType: string;
  generatedAt: string;
  status: ResultStatus;
  format: ResultFormat;
  pageCount?: number;
  fileSize?: string;
  generatedBy?: string;
  description?: string;
  sections: ResultDetailSectionViewModel[];
  metadata?: Record<string, string>;
  downloadUrl?: string;
};
