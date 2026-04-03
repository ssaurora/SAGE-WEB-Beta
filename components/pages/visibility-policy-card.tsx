"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppRole } from "@/components/pages/app-role";

type VisibilityPreset = "Public" | "Scene" | "Task";

const STORAGE_KEY = "sage-web.visibilityPreset";

const presetDescriptions: Record<VisibilityPreset, string> = {
  Public: "公开：适合文档、参考图和通用模板。",
  Scene: "场景级：适合当前场景内可复用的输入与中间产物。",
  Task: "任务级：适合一次运行所产生的临时数据与私有结果。",
};

export function VisibilityPolicyCard() {
  const { role } = useAppRole();
  const [preset, setPreset] = useState<VisibilityPreset>("Scene");

  useEffect(() => {
    const saved = window.localStorage.getItem(
      STORAGE_KEY,
    ) as VisibilityPreset | null;
    if (saved === "Public" || saved === "Scene" || saved === "Task") {
      setPreset(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, preset);
  }, [preset]);

  const recommendedPreset: VisibilityPreset =
    role === "Admin" ? "Public" : role === "Editor" ? "Scene" : "Task";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibility Policy</CardTitle>
        <CardDescription>
          可见性配置建议基于当前角色，适用于场景资产、结果包和报告入口的默认策略。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {(["Public", "Scene", "Task"] as VisibilityPreset[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPreset(item)}
              className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                preset === item
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
            >
              <p className="font-medium">{item}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {presetDescriptions[item]}
              </p>
            </button>
          ))}
        </div>

        <div className="rounded-md border bg-muted/20 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Current Preset</Badge>
            <span className="font-semibold">{preset}</span>
            <Badge variant="secondary">Recommended: {recommendedPreset}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {presetDescriptions[preset]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
