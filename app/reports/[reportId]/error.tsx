"use client";

import { useEffect } from "react";
import { PageErrorState } from "@/components/pages/page-error-state";

type ReportDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ReportDetailError({
  error,
  reset,
}: ReportDetailErrorProps) {
  useEffect(() => {
    console.error("Report detail error:", error);
  }, [error]);

  return (
    <PageErrorState
      title="报告详情加载失败"
      description="报告详情暂时不可用，请稍后重试。"
      actionHref="/results"
      actionLabel="返回结果列表"
      onRetry={reset}
    />
  );
}
