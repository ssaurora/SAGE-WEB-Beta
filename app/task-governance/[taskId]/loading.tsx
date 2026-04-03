export default function TaskGovernanceLoading() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-lg border bg-muted/30" />
      <div className="h-20 animate-pulse rounded-lg border bg-muted/30" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-lg border bg-muted/30" />
        <div className="h-56 animate-pulse rounded-lg border bg-muted/30" />
      </div>
      <div className="h-64 animate-pulse rounded-lg border bg-muted/30" />
    </div>
  );
}
