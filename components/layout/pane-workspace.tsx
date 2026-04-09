import { cn } from "@/lib/utils";

type SplitPaneWorkspaceProps = {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  className?: string;
  leftWidthClassName?: string;
};

export function SplitPaneWorkspace({
  leftPane,
  rightPane,
  className,
  leftWidthClassName = "xl:grid-cols-[420px_minmax(0,1fr)]",
}: SplitPaneWorkspaceProps) {
  return (
    <div
      className={cn(
        "hidden min-h-0 flex-1 xl:grid xl:gap-4",
        leftWidthClassName,
        className,
      )}
    >
      <div className="min-h-0 overflow-auto pr-1">{leftPane}</div>
      <div className="min-h-0 overflow-auto pr-1">{rightPane}</div>
    </div>
  );
}

type TriPaneWorkspaceProps = {
  leftPane: React.ReactNode;
  centerPane: React.ReactNode;
  rightPane: React.ReactNode;
  className?: string;
  widthClassName?: string;
};

export function TriPaneWorkspace({
  leftPane,
  centerPane,
  rightPane,
  className,
  widthClassName = "xl:grid-cols-[320px_minmax(0,1fr)_360px]",
}: TriPaneWorkspaceProps) {
  return (
    <div
      className={cn(
        "hidden min-h-0 flex-1 xl:grid xl:gap-4",
        widthClassName,
        className,
      )}
    >
      <div className="min-h-0 overflow-auto pr-1">{leftPane}</div>
      <div className="min-h-0 overflow-auto pr-1">{centerPane}</div>
      <div className="min-h-0 overflow-auto pr-1">{rightPane}</div>
    </div>
  );
}
