export default function AssetsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-44 animate-pulse rounded-md bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-md border bg-muted/40" />
        ))}
      </div>
    </div>
  );
}
