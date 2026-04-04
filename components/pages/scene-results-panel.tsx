"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DataStateCard } from "@/components/pages/data-state-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SceneResultItemViewModel } from "@/lib/contracts/scene";

type SceneResultsPanelProps = {
  sceneId: string;
  items: SceneResultItemViewModel[];
  initialTaskFilter?: string;
  contextFrom?: string;
};

export function SceneResultsPanel({
  sceneId,
  items,
  initialTaskFilter,
  contextFrom,
}: SceneResultsPanelProps) {
  const [taskFilter, setTaskFilter] = useState(initialTaskFilter ?? "");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");

  const filteredItems = useMemo(() => {
    let next = items;

    if (taskFilter.trim()) {
      const query = taskFilter.trim().toLowerCase();
      next = next.filter((item) =>
        item.fromTaskId.toLowerCase().includes(query),
      );
    }

    next = [...next].sort((left, right) => {
      const leftTime = new Date(left.generatedAt).getTime();
      const rightTime = new Date(right.generatedAt).getTime();
      return sortBy === "latest" ? rightTime - leftTime : leftTime - rightTime;
    });

    return next;
  }, [items, taskFilter, sortBy]);

  const latestResultId = useMemo(() => {
    const latest = [...items].sort((left, right) => {
      const leftTime = new Date(left.generatedAt).getTime();
      const rightTime = new Date(right.generatedAt).getTime();
      return rightTime - leftTime;
    })[0];
    return latest?.resultId;
  }, [items]);

  const recommendedResultId = useMemo(() => {
    const latest = items.find((item) => item.resultId === latestResultId);
    if (!latest) return undefined;
    if (latest.explanationReady && latest.mapLayerReady) return latest.resultId;
    return undefined;
  }, [items, latestResultId]);

  const displayItems = useMemo(() => {
    if (!recommendedResultId) return filteredItems;
    const recommended = filteredItems.find(
      (item) => item.resultId === recommendedResultId,
    );
    if (!recommended) return filteredItems;
    return [
      recommended,
      ...filteredItems.filter((item) => item.resultId !== recommendedResultId),
    ];
  }, [filteredItems, recommendedResultId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Result Packages</CardTitle>
        <CardDescription>先给结论，再查看结果证据。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Summary
          </p>
          <p className="mt-1">
            当前共有 {items.length} 个结果包，筛选后显示 {displayItems.length}{" "}
            个。
            {recommendedResultId
              ? "推荐结果已置顶，可直接进入。"
              : "当前无推荐结果，请先查看最新结果判断可消费性。"}
          </p>
        </div>

        {initialTaskFilter ? (
          <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
            当前由 {contextFrom ?? "external"} 带入任务上下文筛选：
            <span className="ml-1 font-semibold text-foreground">
              {initialTaskFilter}
            </span>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Filter by Task ID
            </label>
            <input
              value={taskFilter}
              onChange={(event) => setTaskFilter(event.target.value)}
              placeholder="例如 task-000"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sort by Time
            </label>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "latest" | "oldest")
              }
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="latest">最新优先</option>
              <option value="oldest">最早优先</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          当前显示 <span className="font-semibold">{displayItems.length}</span>{" "}
          条结果
        </p>

        {displayItems.length === 0 ? (
          <DataStateCard
            title="No results matched"
            description="当前筛选条件下没有结果包，请调整任务筛选或时间排序。"
          />
        ) : (
          displayItems.map((item) => (
            <div key={item.resultId} className="rounded-md border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{item.resultId}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    from {item.fromTaskId} · {item.generatedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.resultId === recommendedResultId ? (
                    <Badge variant="secondary">Recommended</Badge>
                  ) : null}
                  <Link href={`/scenes/${sceneId}/results/${item.resultId}`}>
                    <Badge variant="outline">Open Detail</Badge>
                  </Link>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {item.summary}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={item.mapLayerReady ? "secondary" : "outline"}>
                  {item.mapLayerReady ? "地图图层可用" : "地图图层未就绪"}
                </Badge>
                <Badge
                  variant={item.explanationReady ? "secondary" : "outline"}
                >
                  {item.explanationReady ? "解释可用" : "解释待生成"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
