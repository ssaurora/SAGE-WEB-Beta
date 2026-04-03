export type SceneListItemViewModel = {
  sceneId: string;
  name: string;
  description: string;
  analysisTheme: string;
  lastModified: string;
  taskCount: number;
  resultCount: number;
  status: "Active" | "Archived";
};

export type ScenesListPageViewModel = {
  total: number;
  items: SceneListItemViewModel[];
};