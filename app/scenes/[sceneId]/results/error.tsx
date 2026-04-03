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
      title="Results load failed"
      description="结果列表暂时不可用，请稍后重试。"
      actionHref="/tasks"
      actionLabel="Back to Tasks"
      onRetry={reset}
    />
  );
}
