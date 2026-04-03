"use client";

import { useEffect } from "react";
import { DataStateCard } from "@/components/pages/data-state-card";

type TaskRunsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TaskRunsError({ error, reset }: TaskRunsErrorProps) {
  useEffect(() => {
    console.error("Task runs error:", error);
  }, [error]);

  return (
    <div className="space-y-4">
      <DataStateCard
        title="Task Runs load failed"
        description="任务运行记录暂时不可用，请稍后重试。"
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
