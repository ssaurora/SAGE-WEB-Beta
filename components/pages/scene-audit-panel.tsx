"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataStateCard } from "@/components/pages/data-state-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SceneAuditEvent, SceneAuditEventLevel, SceneAuditEventType, SceneAuditPageViewModel } from "@/lib/contracts/scene";

type LevelFilter = "all" | SceneAuditEventLevel;
type TypeFilter = "all" | SceneAuditEventType;

function levelVariant(level: SceneAuditEventLevel) {
  if (level === "error") return "destructive" as const;
  if (level === "warning") return "outline" as const;
  return "secondary" as const;
}

function levelLabel(level: SceneAuditEventLevel) {
  if (level === "error") return "错误";
  if (level === "warning") return "警告";
  return "信息";
}

function typeLabel(type: SceneAuditEventType) {
  if (type === "input") return "输入";
  if (type === "runtime") return "运行";
  if (type === "manifest") return "清单";
  return "结果";
}

export function SceneAuditPanel({ vm }: { vm: SceneAuditPageViewModel }) {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filteredEvents = useMemo(() => {
    return vm.events.filter((event) => {
      const levelPass = levelFilter === "all" || event.level === levelFilter;
      const typePass = typeFilter === "all" || event.type === typeFilter;
      return levelPass && typePass;
    });
  }, [vm.events, levelFilter, typeFilter]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scene Audit</CardTitle>
          <CardDescription>{vm.sceneId} · 审计摘要与事件筛选</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Total Events</p>
            <p className="mt-1 text-sm font-semibold">
              {vm.summary.totalEvents}
            </p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Warnings</p>
            <p className="mt-1 text-sm font-semibold">
              {vm.summary.warningCount}
            </p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Errors</p>
            <p className="mt-1 text-sm font-semibold">
              {vm.summary.errorCount}
            </p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Latest</p>
            <p className="mt-1 text-sm font-semibold">
              {vm.summary.latestMessage}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={levelFilter === "all" ? "default" : "outline"}
              onClick={() => setLevelFilter("all")}
            >
              全部级别
            </Button>
            <Button
              size="sm"
              variant={levelFilter === "info" ? "default" : "outline"}
              onClick={() => setLevelFilter("info")}
            >
              信息
            </Button>
            <Button
              size="sm"
              variant={levelFilter === "warning" ? "default" : "outline"}
              onClick={() => setLevelFilter("warning")}
            >
              警告
            </Button>
            <Button
              size="sm"
              variant={levelFilter === "error" ? "default" : "outline"}
              onClick={() => setLevelFilter("error")}
            >
              错误
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={typeFilter === "all" ? "default" : "outline"}
              onClick={() => setTypeFilter("all")}
            >
              全部类型
            </Button>
            <Button
              size="sm"
              variant={typeFilter === "input" ? "default" : "outline"}
              onClick={() => setTypeFilter("input")}
            >
              输入
            </Button>
            <Button
              size="sm"
              variant={typeFilter === "runtime" ? "default" : "outline"}
              onClick={() => setTypeFilter("runtime")}
            >
              运行
            </Button>
            <Button
              size="sm"
              variant={typeFilter === "manifest" ? "default" : "outline"}
              onClick={() => setTypeFilter("manifest")}
            >
              清单
            </Button>
            <Button
              size="sm"
              variant={typeFilter === "result" ? "default" : "outline"}
              onClick={() => setTypeFilter("result")}
            >
              结果
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audit Events</CardTitle>
          <CardDescription>
            当前筛选结果：{filteredEvents.length} 条
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredEvents.length === 0 ? (
            <DataStateCard
              title="No audit events matched"
              description="当前筛选条件下没有审计事件，请调整级别或类型筛选。"
            />
          ) : (
            filteredEvents.map((event: SceneAuditEvent) => (
              <div key={event.id} className="rounded-md border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={levelVariant(event.level)}>
                    {levelLabel(event.level)}
                  </Badge>
                  <Badge variant="outline">{typeLabel(event.type)}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {event.at}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {event.taskId}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {event.message}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
