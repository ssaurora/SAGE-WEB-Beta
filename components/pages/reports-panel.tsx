"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { ReportListItemViewModel } from "@/lib/mock/report";

type ReportsPanelProps = {
  items: ReportListItemViewModel[];
};

export function ReportsPanel({ items }: ReportsPanelProps) {
  const [sceneFilter, setSceneFilter] = useState("");
  const [analysisFilter, setAnalysisFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [sortByTime, setSortByTime] = useState<"latest" | "oldest">("latest");

  const filteredItems = useMemo(() => {
    let next = items.filter((item) => {
      const sceneOk =
        !sceneFilter ||
        item.sceneId.toLowerCase().includes(sceneFilter.toLowerCase());
      const analysisOk =
        !analysisFilter ||
        item.analysisType.toLowerCase().includes(analysisFilter.toLowerCase());
      const modelOk =
        !modelFilter ||
        item.modelName.toLowerCase().includes(modelFilter.toLowerCase());
      return sceneOk && analysisOk && modelOk;
    });

    next = [...next].sort((left, right) => {
      const lt = new Date(left.time).getTime();
      const rt = new Date(right.time).getTime();
      return sortByTime === "latest" ? rt - lt : lt - rt;
    });

    return next;
  }, [items, sceneFilter, analysisFilter, modelFilter, sortByTime]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <input
          value={sceneFilter}
          onChange={(event) => setSceneFilter(event.target.value)}
          placeholder="Filter scene"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
        <input
          value={analysisFilter}
          onChange={(event) => setAnalysisFilter(event.target.value)}
          placeholder="Filter analysis type"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
        <input
          value={modelFilter}
          onChange={(event) => setModelFilter(event.target.value)}
          placeholder="Filter model"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
        <select
          value={sortByTime}
          onChange={(event) =>
            setSortByTime(event.target.value as "latest" | "oldest")
          }
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="latest">Time: latest first</option>
          <option value="oldest">Time: oldest first</option>
        </select>
      </div>

      <p className="text-xs text-muted-foreground">
        当前显示 <span className="font-semibold">{filteredItems.length}</span>{" "}
        条报告
      </p>

      {filteredItems.length === 0 ? (
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          没有符合条件的报告。
        </div>
      ) : (
        filteredItems.map((item) => (
          <div key={item.reportId} className="rounded-md border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.reportId}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.sceneId} · {item.analysisType} · {item.modelName} ·{" "}
                  {item.time}
                </p>
              </div>
              <Link href={`/reports/${item.reportId}?from=reports`}>
                <Badge variant="outline">Open Report Detail</Badge>
              </Link>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {item.resultSummary}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
