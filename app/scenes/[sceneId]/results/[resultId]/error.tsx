"use client";

import { useEffect } from "react";
import { DataStateCard } from "@/components/pages/data-state-card";

type SceneResultDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SceneResultDetailError({
  error,
  reset,
}: SceneResultDetailErrorProps) {
  useEffect(() => {
    console.error("Scene result detail error:", error);
  }, [error]);

  return (
    <div className="space-y-4">
      <DataStateCard
        title="Result detail failed"
        description="结果详情暂时不可用，请稍后重试。"
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
