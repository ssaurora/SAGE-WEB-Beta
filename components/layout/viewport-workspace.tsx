import { cn } from "@/lib/utils";

type ViewportWorkspaceProps = {
  children: React.ReactNode;
  className?: string;
};

export function ViewportWorkspace({
  children,
  className,
}: ViewportWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex h-[calc(100vh-11rem)] min-h-[680px] flex-col gap-4 overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
