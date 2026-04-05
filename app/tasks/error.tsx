"use client";

import { PageErrorState } from "@/components/pages/page-error-state";

export default function TasksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageErrorState
      title="任务页面异常"
      description={error.message || "任务页加载失败，请重试。"}
      actionHref="/tasks"
      actionLabel="返回任务列表"
      onRetry={reset}
    />
  );
}
