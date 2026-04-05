import { RolePermissionCard } from "@/components/pages/app-role";
import { VisibilityPolicyCard } from "@/components/pages/visibility-policy-card";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>设置</CardTitle>
          <CardDescription>
            权限与可见性配置中心，用于切换角色并查看默认可见性策略。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RolePermissionCard />
          <VisibilityPolicyCard />
        </CardContent>
      </Card>
    </div>
  );
}
