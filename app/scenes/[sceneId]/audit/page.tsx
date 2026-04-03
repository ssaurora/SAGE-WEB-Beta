import { SceneAuditPanel } from "@/components/pages/scene-audit-panel";
import { AppRoleBanner } from "@/components/pages/app-role-banner";
import { DataStateCard } from "@/components/pages/data-state-card";
import { getSceneAuditViewModel } from "@/lib/api/scene";

export default async function SceneAuditPage({
  params,
}: {
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;
  let vm;

  try {
    vm = await getSceneAuditViewModel(sceneId);
  } catch {
    return (
      <div className="space-y-4">
        <DataStateCard
          title="Audit load failed"
          description="审计记录暂时不可用，请稍后重试。"
          tone="error"
          actionHref={`/scenes/${sceneId}/audit`}
          actionLabel="Retry"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AppRoleBanner />
      <SceneAuditPanel vm={vm} />
    </div>
  );
}
