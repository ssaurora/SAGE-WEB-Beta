"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataStateCard } from "@/components/pages/data-state-card";
import type {
  AssetBindStatus,
  AssetDataType,
  AssetListItemViewModel,
  AssetVisibility,
} from "@/lib/contracts/asset";

type AssetsPanelProps = {
  items: AssetListItemViewModel[];
  initialSceneFilter?: string;
  contextFrom?: string;
};

function bindStatusLabel(status: AssetBindStatus) {
  if (status === "Bound") return "已绑定";
  if (status === "Unbound") return "未绑定";
  return "缺失";
}

function bindStatusVariant(status: AssetBindStatus) {
  if (status === "Bound") return "secondary" as const;
  if (status === "Missing") return "destructive" as const;
  return "outline" as const;
}

function visibilityLabel(visibility: AssetVisibility) {
  if (visibility === "Public") return "公开";
  if (visibility === "Scene") return "场景级";
  return "任务级";
}

export function AssetsPanel({
  items,
  initialSceneFilter,
  contextFrom,
}: AssetsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sceneFilter, setSceneFilter] = useState(initialSceneFilter ?? "");
  const [typeFilter, setTypeFilter] = useState<AssetDataType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AssetBindStatus | "all">(
    "all",
  );
  const [sortByTime, setSortByTime] = useState<"latest" | "oldest">("latest");

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...items]
      .filter((item) => {
        if (sceneFilter.trim()) {
          if (!item.sceneId.toLowerCase().includes(sceneFilter.toLowerCase())) {
            return false;
          }
        }

        if (typeFilter !== "all" && item.type !== typeFilter) {
          return false;
        }

        if (statusFilter !== "all" && item.bindStatus !== statusFilter) {
          return false;
        }

        if (!query) {
          return true;
        }

        return [
          item.assetId,
          item.name,
          item.sceneId,
          item.type,
          item.visibility,
          item.lastTaskId ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((left, right) => {
        const lt = new Date(left.uploadedAt).getTime();
        const rt = new Date(right.uploadedAt).getTime();
        return sortByTime === "latest" ? rt - lt : lt - rt;
      });
  }, [items, searchQuery, sceneFilter, typeFilter, statusFilter, sortByTime]);

  const boundCount = useMemo(
    () => filteredItems.filter((item) => item.bindStatus === "Bound").length,
    [filteredItems],
  );
  const missingCount = useMemo(
    () => filteredItems.filter((item) => item.bindStatus === "Missing").length,
    [filteredItems],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Summary
        </p>
        <p className="mt-1">
          当前筛选结果中共有 {filteredItems.length} 个资产，已绑定 {boundCount} 个，
          缺失 {missingCount} 个。建议优先修复缺失项。
        </p>
      </div>

      {initialSceneFilter ? (
        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
          当前由 {contextFrom ?? "external"} 带入场景筛选：
          <span className="ml-1 font-semibold text-foreground">
            {initialSceneFilter}
          </span>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search assetId / name / task"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm lg:col-span-2"
        />
        <input
          value={sceneFilter}
          onChange={(event) => setSceneFilter(event.target.value)}
          placeholder="Filter scene"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value as AssetDataType | "all")
          }
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Type: all</option>
          <option value="Vector">Vector</option>
          <option value="Raster">Raster</option>
          <option value="Table">Table</option>
          <option value="Document">Document</option>
        </select>
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as AssetBindStatus | "all")
          }
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Status: all</option>
          <option value="Bound">Bound</option>
          <option value="Unbound">Unbound</option>
          <option value="Missing">Missing</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          当前显示 <span className="font-semibold">{filteredItems.length}</span> / {items.length}
        </p>
        <select
          value={sortByTime}
          onChange={(event) =>
            setSortByTime(event.target.value as "latest" | "oldest")
          }
          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
        >
          <option value="latest">Time: latest first</option>
          <option value="oldest">Time: oldest first</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <DataStateCard
          title="No assets matched"
          description="没有符合当前筛选条件的资产，请调整筛选条件后重试。"
        />
      ) : (
        filteredItems.map((item) => (
          <div key={item.assetId} className="rounded-md border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.assetId} · {item.sceneId} · 上传于 {item.uploadedAt}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{item.type}</Badge>
                <Badge variant={bindStatusVariant(item.bindStatus)}>
                  {bindStatusLabel(item.bindStatus)}
                </Badge>
                <Badge variant="outline">
                  {visibilityLabel(item.visibility)}
                </Badge>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Last Task: {item.lastTaskId ?? "-"}
              </p>
              <Link
                href={`/assets/${item.assetId}?from=assets&sceneId=${item.sceneId}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Open Asset Detail
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
