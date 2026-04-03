"use client";

import Link from "next/link";

import { DataStateCard } from "@/components/pages/data-state-card";

type PageErrorStateProps = {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function PageErrorState({
  title,
  description,
  actionHref,
  actionLabel,
  retryLabel = "Retry",
  onRetry,
}: PageErrorStateProps) {
  return (
    <div className="space-y-4">
      <DataStateCard
        title={title}
        description={description}
        tone="error"
        actionHref={actionHref}
        actionLabel={actionLabel}
      />
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-medium text-primary hover:underline"
        >
          {retryLabel}
        </button>
      ) : (
        <Link href={actionHref} className="text-sm font-medium text-primary hover:underline">
          {retryLabel}
        </Link>
      )}
    </div>
  );
}
