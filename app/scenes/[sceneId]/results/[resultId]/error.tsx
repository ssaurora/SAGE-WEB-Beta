"use client";

import { useEffect } from "react";
import { PageErrorState } from "@/components/pages/page-error-state";

type SceneResultDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SceneResultDetailError({
  error,
  reset,
}: SceneResultDetailErrorProps) {
  useEffect(() => {
    console.error("Scene result detail error:", error);
  }, [error]);

  return (
    <PageErrorState
      title="结果详情加载失败"
      description="结果详情暂时不可用，请稍后重试。"
      actionHref="/scenes"
      actionLabel="返回场景列表"
      onRetry={reset}
    />
  );
}
