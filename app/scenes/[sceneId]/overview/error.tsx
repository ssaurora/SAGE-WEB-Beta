"use client";

import { useEffect } from "react";
import { PageErrorState } from "@/components/pages/page-error-state";

type SceneOverviewErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SceneOverviewError({
  error,
  reset,
}: SceneOverviewErrorProps) {
  useEffect(() => {
    console.error("Scene overview error:", error);
  }, [error]);

  return (
    <PageErrorState
      title="Overview load failed"
      description="场景概览暂时不可用，请稍后重试。"
      actionHref="/scenes"
      actionLabel="Back to Scenes"
      onRetry={reset}
    />
  );
}
