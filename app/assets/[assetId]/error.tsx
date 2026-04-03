"use client";

import { PageErrorState } from "@/components/pages/page-error-state";

export default function AssetDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageErrorState
      title="Asset detail error"
      description={error.message || "资产详情加载失败，请重试。"}
      actionHref="/assets"
      actionLabel="Back to Assets"
      onRetry={reset}
    />
  );
}
