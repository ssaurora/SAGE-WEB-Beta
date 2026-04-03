"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SceneListItemViewModel = {
  sceneId: string;
  name: string;
  description: string;
  analysisTheme: string;
  lastModified: string;
  taskCount: number;
  resultCount: number;
  status: "Active" | "Archived";
};

interface ScenesListPageProps {
  items: SceneListItemViewModel[];
}

export function ScenesListClient({ items }: ScenesListPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Archived">("Active");
  const [sortBy, setSortBy] = useState<"recent" | "name">("recent");

  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by status
    if (filterStatus !== "All") {
      result = result.filter((item) => item.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.analysisTheme.toLowerCase().includes(query),
      );
    }

    // Sort
    if (sortBy === "recent") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
      );
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [items, searchQuery, filterStatus, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Scenes</h1>
          <p className="text-muted-foreground">
            管理您的分析场景与项目工作空间
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/scenes/scene-001/overview" className="inline-block">
            <Button>+ Create Scene</Button>
          </Link>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                搜索
              </label>
              <input
                type="text"
                placeholder="按名称、描述或分析主题搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Filter Status */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                状态
              </label>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as "All" | "Active" | "Archived")
                }
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">所有状态</option>
                <option value="Active">活跃项目</option>
                <option value="Archived">已归档</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                排序
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "name")}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="recent">最近修改优先</option>
                <option value="name">按名称排序</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            找到 <span className="font-semibold">{filteredItems.length}</span> 个场景
          </div>
        </CardContent>
      </Card>

      {/* Scenes Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">未找到匹配的场景</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((scene) => (
            <Link
              key={scene.sceneId}
              href={`/scenes/${scene.sceneId}/overview`}
              className="group"
            >
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2 group-hover:text-primary">
                        {scene.name}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {scene.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={scene.status === "Active" ? "secondary" : "outline"}
                    >
                      {scene.status === "Active" ? "活跃" : "归档"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Analysis Theme */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      分析主题
                    </p>
                    <p className="mt-1 text-sm font-medium">{scene.analysisTheme}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs text-muted-foreground">任务数</p>
                      <p className="mt-1 text-xl font-semibold">{scene.taskCount}</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs text-muted-foreground">结果数</p>
                      <p className="mt-1 text-xl font-semibold">{scene.resultCount}</p>
                    </div>
                  </div>

                  {/* Last Modified */}
                  <p className="text-xs text-muted-foreground">
                    最后修改：{scene.lastModified}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      <Card className="bg-muted">
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">提示</p>
            <p className="text-xs text-muted-foreground">
              单击任何场景卡片进入详情页，或使用顶部"Create Scene"按钮创建新项目
            </p>
          </div>
          <Link href="/scenes/scene-001/overview" className="inline-block">
            <Button variant="outline">新建场景</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
