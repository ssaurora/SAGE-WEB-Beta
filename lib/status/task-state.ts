import type { BadgeProps } from '@/components/ui/badge';

export type TaskPrimaryState =
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

export const taskStateDisplay: Record<TaskPrimaryState, string> = {
  Draft: '草稿',
  Understanding: '需求理解中',
  Planning: '方案规划中',
  'Waiting for Required Input': '等待必需输入',
  'Ready to Run': '可运行',
  Queued: '排队中',
  Running: '运行中',
  'Processing Results': '结果处理中',
  'Action Required': '待处理',
  Completed: '已完成',
  Failed: '失败',
  Cancelled: '已取消',
};

export function getTaskStateVariant(state: string): BadgeProps['variant'] {
  const normalized = state as TaskPrimaryState;

  if (normalized === 'Completed' || normalized === 'Ready to Run') return 'secondary';
  if (normalized === 'Failed') return 'destructive';
  if (normalized === 'Running' || normalized === 'Processing Results' || normalized === 'Queued') return 'default';
  if (normalized === 'Cancelled') return 'outline';
  if (normalized === 'Action Required') return 'destructive';
  if (normalized === 'Waiting for Required Input') return 'outline';
  if (normalized === 'Draft' || normalized === 'Understanding' || normalized === 'Planning') return 'outline';
  return 'outline';
}

export function getTaskStateLabel(state: string): string {
  const normalized = state as TaskPrimaryState;
  return taskStateDisplay[normalized] ?? state;
}
