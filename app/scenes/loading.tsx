export default function ScenesLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-44 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-md border bg-muted/40" />
        ))}
      </div>
    </div>
  );
}
