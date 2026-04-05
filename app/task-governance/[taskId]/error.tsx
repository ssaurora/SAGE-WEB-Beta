"use client";

import { useEffect } from "react";
import { PageErrorState } from "@/components/pages/page-error-state";

type TaskGovernanceErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TaskGovernanceError({
  error,
  reset,
}: TaskGovernanceErrorProps) {
  useEffect(() => {
    console.error("Task governance error:", error);
  }, [error]);

  return (
    <PageErrorState
      title="治理页加载失败"
      description="任务治理页暂时不可用，请稍后重试。"
      actionHref="/tasks"
      actionLabel="返回任务列表"
      onRetry={reset}
    />
  );
}
