"use client";

import { useEffect } from "react";
import { DataStateCard } from "@/components/pages/data-state-card";

type TaskGovernanceErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TaskGovernanceError({
  error,
  reset,
}: TaskGovernanceErrorProps) {
  useEffect(() => {
    console.error("Task governance error:", error);
  }, [error]);

  return (
    <div className="space-y-4">
      <DataStateCard
        title="Governance load failed"
        description="任务治理页暂时不可用，请稍后重试。"
        tone="error"
        actionHref="/tasks"
        actionLabel="Back to Tasks"
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
