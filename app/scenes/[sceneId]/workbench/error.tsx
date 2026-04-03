"use client";

import { PageErrorState } from "@/components/pages/page-error-state";

export default function SceneWorkbenchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageErrorState
      title="Workbench error"
      description={error.message || "工作台加载失败，请重试。"}
      actionHref="/scenes"
      actionLabel="Back to Scenes"
      onRetry={reset}
    />
  );
}
