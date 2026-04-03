"use client";

import { PageErrorState } from "@/components/pages/page-error-state";

export default function SceneAssetsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageErrorState
      title="Scene assets error"
      description={error.message || "场景资产加载失败，请重试。"}
      actionHref="/scenes"
      actionLabel="Back to Scenes"
      onRetry={reset}
    />
  );
}
