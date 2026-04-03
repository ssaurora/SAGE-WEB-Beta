"use client";

import { PageErrorState } from "@/components/pages/page-error-state";

export default function ScenesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageErrorState
      title="Scenes page error"
      description={error.message || "场景页加载失败，请重试。"}
      actionHref="/scenes"
      actionLabel="Back to Scenes"
      onRetry={reset}
    />
  );
}
