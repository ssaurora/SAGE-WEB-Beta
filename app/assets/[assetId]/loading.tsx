export default function AssetDetailLoading() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-1/2 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-md border bg-muted/40" />
        ))}
      </div>
    </div>
  );
}
