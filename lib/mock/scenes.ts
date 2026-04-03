export type {
  SceneListItemViewModel,
  ScenesListPageViewModel,
} from "@/lib/contracts/scenes";

import type { ScenesListPageViewModel } from "@/lib/contracts/scenes";

export const scenesListMock: ScenesListPageViewModel = {
  total: 5,
  items: [
    {
      sceneId: "scene-001",
      name: "Watershed Analysis - Region A",
      description: "水质评估与流域划分分析",
      analysisTheme: "Water Yield",
      lastModified: "2026-04-03 10:30",
      taskCount: 3,
      resultCount: 2,
      status: "Active",
    },
    {
      sceneId: "scene-002",
      name: "Carbon Sequestration Study",
      description: "碳汇评估与植被覆盖度分析",
      analysisTheme: "Carbon",
      lastModified: "2026-04-02 15:45",
      taskCount: 2,
      resultCount: 1,
      status: "Active",
    },
    {
      sceneId: "scene-003",
      name: "Pollination Service Mapping",
      description: "授粉服务空间分布与影响因素分析",
      analysisTheme: "Pollination",
      lastModified: "2026-03-31 09:20",
      taskCount: 1,
      resultCount: 0,
      status: "Active",
    },
    {
      sceneId: "scene-004",
      name: "NDR Analysis - Region B",
      description: "氮磷流失风险评估与负载模型",
      analysisTheme: "Nutrient Delivery Ratio",
      lastModified: "2026-03-28 14:00",
      taskCount: 5,
      resultCount: 3,
      status: "Active",
    },
    {
      sceneId: "scene-005",
      name: "Habitat Quality Assessment (Archive)",
      description: "生态环境质量评价 - 已归档",
      analysisTheme: "Habitat Quality",
      lastModified: "2026-03-15 11:30",
      taskCount: 4,
      resultCount: 2,
      status: "Archived",
    },
  ],
};
