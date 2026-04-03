export default function TasksLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-40 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-md border bg-muted/40"
          />
        ))}
      </div>
    </div>
  );
}
