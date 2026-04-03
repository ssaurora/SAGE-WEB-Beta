import { SceneAuditPanel } from '@/components/pages/scene-audit-panel';
import { getSceneAuditViewModel } from '@/lib/api/scene';

export default async function SceneAuditPage({
  params,
}: {
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;
  const vm = await getSceneAuditViewModel(sceneId);

  return <SceneAuditPanel vm={vm} />;
}
