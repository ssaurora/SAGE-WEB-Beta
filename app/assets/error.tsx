"use client";

import { PageErrorState } from "@/components/pages/page-error-state";

export default function AssetsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageErrorState
      title="Assets page error"
      description={error.message || "资产页加载失败，请重试。"}
      actionHref="/assets"
      actionLabel="Back to Assets"
      onRetry={reset}
    />
  );
}
