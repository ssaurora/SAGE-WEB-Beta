export default function SceneResultsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-lg border bg-muted/30" />
      <div className="h-16 animate-pulse rounded-lg border bg-muted/30" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-lg border bg-muted/30"
        />
      ))}
    </div>
  );
}
