export type ReportStatus = "Draft" | "Published" | "Archived";

export type ReportFormat = "PDF" | "XLSX" | "JSON";

export type ReportListItemDto = {
  resultId: string;
  reportId?: string;
  sceneId: string;
  taskId?: string;
  analysisType: string;
  modelName: string;
  time: string;
  resultName?: string;
  reportName?: string;
  status?: ReportStatus;
  format?: ReportFormat;
  pageCount?: number;
  fileSize?: string;
  resultSummary: string;
};

export type ReportDetailDto = {
  resultId: string;
  reportId?: string;
  sceneId: string;
  taskId: string;
  analysisType: string;
  modelName: string;
  time: string;
  resultName?: string;
  reportName?: string;
  status?: ReportStatus;
  format?: ReportFormat;
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

export type ReportListItemViewModel = {
  id: string;
  name: string;
  sceneId: string;
  taskId: string;
  analysisType: string;
  generatedAt: string;
  status: ReportStatus;
  format: ReportFormat;
  pageCount?: number;
  fileSize?: string;
};

export type ReportListViewModel = {
  reports: ReportListItemViewModel[];
};

export type ReportDetailSectionViewModel = {
  id: string;
  title: string;
  description?: string;
  contentPreview?: string;
};

export type ReportDetailViewModel = {
  id: string;
  name: string;
  sceneId: string;
  taskId: string;
  analysisType: string;
  generatedAt: string;
  status: ReportStatus;
  format: ReportFormat;
  pageCount?: number;
  fileSize?: string;
  generatedBy?: string;
  description?: string;
  sections: ReportDetailSectionViewModel[];
  metadata?: Record<string, string>;
  downloadUrl?: string;
};
