"use client";

import { useEffect } from "react";
import { DataStateCard } from "@/components/pages/data-state-card";

type ReportsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ReportsError({ error, reset }: ReportsErrorProps) {
  useEffect(() => {
    console.error("Reports page error:", error);
  }, [error]);

  return (
    <div className="space-y-4">
      <DataStateCard
        title="Reports load failed"
        description="报告列表暂时不可用，请稍后重试。"
        tone="error"
        actionLabel="Retry"
        actionHref="#"
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
