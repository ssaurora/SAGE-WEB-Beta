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
  { label: "Assets", href: "/assets", description: "输入资产与绑定素材" },
  { label: "Results", href: "/reports", description: "结果消费与解释" },
  { label: "Settings", href: "/settings", description: "角色与模式设置" },
];

export const scenePrimaryNav = (sceneId: string): NavItem[] => [
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
    label: "Results",
    href: `/scenes/${sceneId}/results`,
    description: "结果消费与判断",
  },
];

export const sceneSecondaryNav = (sceneId: string): NavItem[] => [
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

export const sceneNav = (sceneId: string): NavItem[] => [
  ...scenePrimaryNav(sceneId),
  ...sceneSecondaryNav(sceneId),
];
