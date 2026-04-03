export default function ReportDetailLoading() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-lg border bg-muted/30" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-lg border bg-muted/30"
          />
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-lg border bg-muted/30" />
      <div className="h-40 animate-pulse rounded-lg border bg-muted/30" />
    </div>
  );
}
