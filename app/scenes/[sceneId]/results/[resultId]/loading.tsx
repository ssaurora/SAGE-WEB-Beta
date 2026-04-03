export default function SceneResultDetailLoading() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-lg border bg-muted/30" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
        <div className="h-52 animate-pulse rounded-lg border bg-muted/30" />
        <div className="h-52 animate-pulse rounded-lg border bg-muted/30" />
      </div>
      <div className="h-44 animate-pulse rounded-lg border bg-muted/30" />
    </div>
  );
}
