"use client";

import { useEffect } from "react";
import { DataStateCard } from "@/components/pages/data-state-card";

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
    <div className="space-y-4">
      <DataStateCard
        title="Report detail failed"
        description="报告详情暂时不可用，请稍后重试。"
        tone="error"
        actionLabel="Back to Reports"
        actionHref="/reports"
      />
      <button
        type="button"
        onClick={reset}
        className="text-sm font-medium text-primary hover:underline"
      >
        Retry
      </button>
    </div>
  );
}
