import { SceneAuditPanel } from "@/components/pages/scene-audit-panel";
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
          title="审计加载失败"
          description="审计记录暂时不可用，请稍后重试。"
          tone="error"
          actionHref={`/scenes/${sceneId}/audit`}
          actionLabel="重试"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SceneAuditPanel vm={vm} />
    </div>
  );
}
