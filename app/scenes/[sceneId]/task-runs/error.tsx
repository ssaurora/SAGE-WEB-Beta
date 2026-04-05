"use client";

import { useEffect } from "react";
import { PageErrorState } from "@/components/pages/page-error-state";

type TaskRunsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TaskRunsError({ error, reset }: TaskRunsErrorProps) {
  useEffect(() => {
    console.error("Task runs error:", error);
  }, [error]);

  return (
    <PageErrorState
      title="Task Runs load failed"
      description="任务运行记录暂时不可用，请稍后重试。"
      actionHref="/tasks"
      actionLabel="返回任务列表"
      onRetry={reset}
    />
  );
}
