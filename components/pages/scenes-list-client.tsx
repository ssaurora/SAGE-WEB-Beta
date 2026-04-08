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
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Archived"
  >("Active");

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
      (a, b) =>
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
    );
  }, [items, searchQuery, filterStatus]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_auto]">
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
            <Link href="/scenes/scene-001/overview">
              <Button size="sm" className="h-10 w-full md:w-auto">
                + Create Scene
              </Button>
            </Link>
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
            <Card
              key={scene.sceneId}
              className="group h-full transition-all hover:border-primary hover:shadow-lg"
            >
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <p className="text-base font-semibold group-hover:text-primary">
                      {scene.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {scene.analysisTheme}
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

                <p className="text-xs text-muted-foreground">
                  最后修改：{scene.lastModified}
                </p>

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
