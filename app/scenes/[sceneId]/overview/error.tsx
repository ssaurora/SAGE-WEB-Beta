"use client";

import { useEffect } from "react";
import { DataStateCard } from "@/components/pages/data-state-card";

type SceneOverviewErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SceneOverviewError({
  error,
  reset,
}: SceneOverviewErrorProps) {
  useEffect(() => {
    console.error("Scene overview error:", error);
  }, [error]);

  return (
    <div className="space-y-4">
      <DataStateCard
        title="Overview load failed"
        description="场景概览暂时不可用，请稍后重试。"
        tone="error"
        actionHref="/scenes"
        actionLabel="Back to Scenes"
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
