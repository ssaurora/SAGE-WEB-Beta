export type NavItem = {
  label: string;
  href: string;
  description: string;
};

export const primaryNav: NavItem[] = [
  {
    label: "Scenes",
    href: "/scenes",
    description: "场景入口与工作容器",
  },
  { label: "Tasks", href: "/tasks", description: "任务列表与筛选" },
  { label: "Assets", href: "/assets", description: "输入资产与绑定素材" },
  { label: "Reports", href: "/reports", description: "结果消费与解释" },
  { label: "Settings", href: "/settings", description: "角色与模式设置" },
];

export const sceneNav = (sceneId: string): NavItem[] => [
  {
    label: "Overview",
    href: `/scenes/${sceneId}/overview`,
    description: "场景摘要",
  },
  {
    label: "Workbench",
    href: `/scenes/${sceneId}/workbench`,
    description: "分析主工作台",
  },
  {
    label: "Assets",
    href: `/scenes/${sceneId}/assets`,
    description: "场景资产",
  },
  {
    label: "Task Runs",
    href: `/scenes/${sceneId}/task-runs`,
    description: "任务运行轨迹",
  },
  {
    label: "Results",
    href: `/scenes/${sceneId}/results`,
    description: "场景结果",
  },
  { label: "Audit", href: `/scenes/${sceneId}/audit`, description: "审计视图" },
];
