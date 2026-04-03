"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { canCreateScene, useAppRole } from "@/components/pages/app-role";
import type { SceneListItemViewModel } from "@/lib/contracts/scenes";

interface ScenesListPageProps {
  items: SceneListItemViewModel[];
}

export function ScenesListClient({ items }: ScenesListPageProps) {
  const { role } = useAppRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Archived"
  >("Active");
  const [sortBy, setSortBy] = useState<"recent" | "name">("recent");

  const filteredItems = useMemo(() => {
    let result = items;

    if (filterStatus !== "All") {
      result = result.filter((item) => item.status === filterStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.analysisTheme.toLowerCase().includes(query),
      );
    }

    if (sortBy === "recent") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime(),
      );
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [items, searchQuery, filterStatus, sortBy]);

  const activeCount = items.filter((item) => item.status === "Active").length;
  const archivedCount = items.filter(
    (item) => item.status === "Archived",
  ).length;
  const totalTasks = items.reduce((sum, item) => sum + item.taskCount, 0);
  const totalResults = items.reduce((sum, item) => sum + item.resultCount, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">Role: {role}</Badge>
              <Badge variant={canCreateScene(role) ? "secondary" : "outline"}>
                {canCreateScene(role) ? "Can Create Scene" : "Read Only"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {canCreateScene(role) ? (
                <Link href="/scenes/scene-001/overview">
                  <Button size="sm">+ Create Scene</Button>
                </Link>
              ) : (
                <Button size="sm" disabled>
                  + Create Scene
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.8fr]">
            <input
              type="text"
              placeholder="Search scenes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "All" | "Active" | "Archived")
              }
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "name")}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="recent">Recent</option>
              <option value="name">Name</option>
            </select>
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-semibold">{items.length}</p>
            </div>
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Active / Archived</p>
              <p className="font-semibold">
                {activeCount} / {archivedCount}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Filtered Scenes</p>
              <p className="font-semibold">{filteredItems.length}</p>
            </div>
            <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Task Count</p>
              <p className="font-semibold">{totalTasks}</p>
            </div>
            <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Result Count</p>
              <p className="font-semibold">{totalResults}</p>
            </div>
            <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Access</p>
              <p className="font-semibold">
                {canCreateScene(role) ? "Editable" : "Read Only"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <p className="line-clamp-2 text-base font-semibold group-hover:text-primary">
                        {scene.name}
                      </p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {scene.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        scene.status === "Active" ? "secondary" : "outline"
                      }
                    >
                      {scene.status === "Active" ? "活跃" : "归档"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      分析主题
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {scene.analysisTheme}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs text-muted-foreground">任务数</p>
                      <p className="mt-1 text-xl font-semibold">
                        {scene.taskCount}
                      </p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs text-muted-foreground">结果数</p>
                      <p className="mt-1 text-xl font-semibold">
                        {scene.resultCount}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    最后修改：{scene.lastModified}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
