"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { canCreateScene, canEditWorkbench, canManageSystem, useAppRole } from "@/components/pages/app-role";

export function AppRoleBanner() {
  const { role } = useAppRole();

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Role</Badge>
            <span className="font-semibold">{role}</span>
            <Badge variant={role === "Admin" ? "secondary" : "outline"}>
              {canManageSystem(role)
                ? "System Admin"
                : canEditWorkbench(role)
                  ? "Workbench Editor"
                  : "Read Only"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {role === "Viewer"
              ? "当前为只读视图，编辑类动作已收敛。"
              : role === "Editor"
                ? "当前可执行工作台编辑与场景创建。"
                : "当前可执行系统级配置与高权限操作。"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/settings" className="text-sm font-medium text-primary hover:underline">
            Adjust Role
          </Link>
          <Badge variant={canCreateScene(role) ? "secondary" : "outline"}>
            {canCreateScene(role) ? "Can Create Scene" : "No Create Permission"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
