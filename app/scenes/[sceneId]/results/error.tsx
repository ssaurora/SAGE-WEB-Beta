"use client";

import { useEffect } from "react";
import { DataStateCard } from "@/components/pages/data-state-card";

type SceneResultsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SceneResultsError({
  error,
  reset,
}: SceneResultsErrorProps) {
  useEffect(() => {
    console.error("Scene results error:", error);
  }, [error]);

  return (
    <div className="space-y-4">
      <DataStateCard
        title="Results load failed"
        description="结果列表暂时不可用，请稍后重试。"
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
