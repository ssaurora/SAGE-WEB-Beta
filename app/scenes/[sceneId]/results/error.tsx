"use client";

import { useEffect } from "react";
import { PageErrorState } from "@/components/pages/page-error-state";

type SceneResultsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SceneResultsError({
  error,
  reset,
}: SceneResultsErrorProps) {
  useEffect(() => {
    console.error("Scene results error:", error);
  }, [error]);

  return (
    <PageErrorState
      title="结果加载失败"
      description="结果列表暂时不可用，请稍后重试。"
      actionHref="/tasks"
      actionLabel="返回任务列表"
      onRetry={reset}
    />
  );
}
