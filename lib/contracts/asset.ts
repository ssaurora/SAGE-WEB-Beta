export type AssetDataType = "Vector" | "Raster" | "Table" | "Document";
export type AssetBindStatus = "Bound" | "Unbound" | "Missing";
export type AssetVisibility = "Public" | "Scene" | "Task";

export type AssetListItemViewModel = {
  assetId: string;
  name: string;
  type: AssetDataType;
  bindStatus: AssetBindStatus;
  uploadedAt: string;
  visibility: AssetVisibility;
  sceneId: string;
  lastTaskId?: string;
};

export type AssetDetailViewModel = AssetListItemViewModel & {
  source: string;
  format: string;
  size: string;
  checksum: string;
  tags: string[];
  usedBy: {
    sceneId: string;
    taskId?: string;
    resultId?: string;
    reportId?: string;
  };
  auditSummary: string;
};
