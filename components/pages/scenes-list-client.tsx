"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SceneListItemViewModel } from "@/lib/contracts/scenes";

interface ScenesListPageProps {
  items: SceneListItemViewModel[];
}

export function ScenesListClient({ items }: ScenesListPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Archived">("Active");

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
          item.analysisTheme.toLowerCase().includes(query),
      );
    }

    return [...result].sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
    );
  }, [items, searchQuery, filterStatus]);

  const activeCount = items.filter((item) => item.status === "Active").length;
  const archivedCount = items.filter((item) => item.status === "Archived").length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Link href="/scenes/scene-001/overview">
                <Button size="sm">+ Create Scene</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
            <input
              type="text"
              placeholder="Search scenes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "All" | "Active" | "Archived")}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Active / Archived</p>
              <p className="font-semibold">
                {activeCount} / {archivedCount}
              </p>
            </div>
          </div>

          <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
            <p className="text-xs text-muted-foreground">Visible</p>
            <p className="font-semibold">{filteredItems.length}</p>
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
            <Card key={scene.sceneId} className="group h-full transition-all hover:border-primary hover:shadow-lg">
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <p className="text-base font-semibold group-hover:text-primary">{scene.name}</p>
                    <p className="text-sm text-muted-foreground">{scene.analysisTheme}</p>
                  </div>
                  <Badge variant={scene.status === "Active" ? "secondary" : "outline"}>
                    {scene.status === "Active" ? "活跃" : "归档"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">最后修改：{scene.lastModified}</p>

                <Link href={`/scenes/${scene.sceneId}/overview`}>
                  <Button size="sm" className="w-full">
                    Open Scene
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
