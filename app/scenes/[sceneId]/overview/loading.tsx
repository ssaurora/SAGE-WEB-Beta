export default function SceneOverviewLoading() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-lg border bg-muted/30" />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="h-56 animate-pulse rounded-lg border bg-muted/30" />
        <div className="h-56 animate-pulse rounded-lg border bg-muted/30" />
      </div>
    </div>
  );
}
