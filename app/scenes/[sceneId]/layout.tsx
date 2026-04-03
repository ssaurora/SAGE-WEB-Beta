import { SceneShell } from "@/components/layout/scene-shell";

export default async function SceneLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;
  return <SceneShell sceneId={sceneId}>{children}</SceneShell>;
}
