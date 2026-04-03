export default function SceneWorkbenchLoading() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-1/2 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr_340px]">
        <div className="h-[520px] animate-pulse rounded-md border bg-muted/40" />
      </div>
    </div>
  );
}
