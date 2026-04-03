"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataStateCard } from "@/components/pages/data-state-card";
import type { TaskListItem } from "@/lib/mock/task";
import {
  getTaskStateLabel,
  getTaskStateVariant,
} from "@/lib/status/task-state";

type QuickFilter = "all" | "waiting" | "running" | "failed" | "succeeded";

type TasksPanelProps = {
  tasks: TaskListItem[];
};

function matchesQuickFilter(task: TaskListItem, quickFilter: QuickFilter) {
  if (quickFilter === "all") return true;
  if (quickFilter === "running") return task.currentState === "Running";
  if (quickFilter === "failed") return task.currentState === "Failed";
  if (quickFilter === "succeeded") return task.currentState === "Completed";
  if (quickFilter === "waiting") {
    return (
      task.currentState === "Waiting for Required Input" ||
      task.currentState === "Action Required"
    );
  }
  return true;
}

export function TasksPanel({ tasks }: TasksPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      if (!matchesQuickFilter(task, quickFilter)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [task.id, task.sceneId, task.analysisType, task.modelName]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [tasks, searchQuery, quickFilter]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Search
          </label>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="taskId / sceneId / analysis / model"
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          当前显示 <span className="font-semibold">{filteredTasks.length}</span>{" "}
          / {tasks.length}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={quickFilter === "all" ? "secondary" : "outline"}
          onClick={() => setQuickFilter("all")}
        >
          All
        </Button>
        <Button
          size="sm"
          variant={quickFilter === "waiting" ? "secondary" : "outline"}
          onClick={() => setQuickFilter("waiting")}
        >
          Waiting
        </Button>
        <Button
          size="sm"
          variant={quickFilter === "running" ? "secondary" : "outline"}
          onClick={() => setQuickFilter("running")}
        >
          Running
        </Button>
        <Button
          size="sm"
          variant={quickFilter === "failed" ? "secondary" : "outline"}
          onClick={() => setQuickFilter("failed")}
        >
          Failed
        </Button>
        <Button
          size="sm"
          variant={quickFilter === "succeeded" ? "secondary" : "outline"}
          onClick={() => setQuickFilter("succeeded")}
        >
          Succeeded
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <DataStateCard
          title="No tasks matched"
          description="没有符合当前筛选条件的任务，请调整搜索或状态筛选后重试。"
        />
      ) : (
        filteredTasks.map((task) => (
          <div key={task.id} className="rounded-md border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{task.id}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {task.sceneId} · {task.analysisType} · {task.modelName}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={getTaskStateVariant(task.currentState)}>
                  {getTaskStateLabel(task.currentState)}
                </Badge>
                <Badge variant={task.canResume ? "secondary" : "outline"}>
                  {task.canResume ? "可恢复" : "不可恢复"}
                </Badge>
                <Badge variant={task.resultAvailable ? "secondary" : "outline"}>
                  {task.resultAvailable ? "结果可用" : "无结果"}
                </Badge>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Updated at: {task.updatedAt}
              </p>
              <Link
                href={`/task-governance/${task.id}?from=tasks&taskId=${task.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                查看治理详情
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
