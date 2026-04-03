"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type AppRole = "Viewer" | "Editor" | "Admin";

const STORAGE_KEY = "sage-web.appRole";
const DEFAULT_ROLE: AppRole = "Viewer";

const roleDescriptions: Record<AppRole, string> = {
  Viewer: "只读浏览场景、资产和结果。",
  Editor: "可创建和编辑场景，执行工作台操作。",
  Admin: "可管理全局配置与高权限操作。",
};

const roleCapabilities: Record<AppRole, string[]> = {
  Viewer: ["浏览场景", "查看结果", "查看资产"],
  Editor: ["创建场景", "运行工作台", "调整输入与绑定"],
  Admin: ["管理配置", "查看所有权限视图", "执行高权限操作"],
};

export function useAppRole() {
  const [role, setRole] = useState<AppRole>(DEFAULT_ROLE);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as AppRole | null;
    if (saved === "Viewer" || saved === "Editor" || saved === "Admin") {
      setRole(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  return { role, setRole };
}

export function canCreateScene(role: AppRole) {
  return role === "Editor" || role === "Admin";
}

export function canEditWorkbench(role: AppRole) {
  return role === "Editor" || role === "Admin";
}

export function canManageSystem(role: AppRole) {
  return role === "Admin";
}

export function RolePermissionCard() {
  const { role, setRole } = useAppRole();

  const capabilities = useMemo(() => roleCapabilities[role], [role]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role & Permissions</CardTitle>
        <CardDescription>
          当前权限视图基于本地角色配置，仅用于界面展示与功能可见性控制。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {(["Viewer", "Editor", "Admin"] as AppRole[]).map((item) => (
            <Button
              key={item}
              size="sm"
              variant={role === item ? "secondary" : "outline"}
              onClick={() => setRole(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="rounded-md border bg-muted/20 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Current Role</Badge>
            <span className="font-semibold">{role}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {roleDescriptions[role]}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Capabilities
          </p>
          <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            {capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
