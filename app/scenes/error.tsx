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
      title="场景页面异常"
      description={error.message || "场景页加载失败，请重试。"}
      actionHref="/scenes"
      actionLabel="返回场景列表"
      onRetry={reset}
    />
  );
}
