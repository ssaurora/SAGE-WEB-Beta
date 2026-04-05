"use client";

import { useEffect } from "react";
import { PageErrorState } from "@/components/pages/page-error-state";

type ReportsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ReportsError({ error, reset }: ReportsErrorProps) {
  useEffect(() => {
    console.error("Reports page error:", error);
  }, [error]);

  return (
    <PageErrorState
      title="结果加载失败"
      description="结果列表暂时不可用，请稍后重试。"
      actionHref="/results"
      actionLabel="返回结果列表"
      onRetry={reset}
    />
  );
}
