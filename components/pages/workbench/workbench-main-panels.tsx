import Link from "next/link";
import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapLibreCanvas,
  type PickedFeature,
} from "@/components/pages/maplibre-canvas";
import type { InteractiveLayer } from "@/components/pages/workbench/types";
import { TASK_CONTEXT_FROM } from "@/lib/navigation/task-context";

const legendColorMap: Record<string, string> = {
  "Study Area": "#3B82F6",
  "Precipitation 2025": "#22C55E",
  "Water Yield Result": "#A855F7",
};

type WorkbenchWorkspaceLayoutProps = {
  centerPanel: ReactNode;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  evidencePanel: ReactNode;
};

export function WorkbenchWorkspaceLayout({
  centerPanel,
  leftPanel,
  rightPanel,
  evidencePanel,
}: WorkbenchWorkspaceLayoutProps) {
  return (
    <>
      <div className="hidden min-h-0 flex-1 xl:grid xl:grid-cols-[320px_minmax(0,1fr)_360px] xl:gap-4">
        <div className="min-h-0 space-y-4 overflow-auto pr-1">{leftPanel}</div>

        <div className="min-h-0 space-y-4 overflow-auto pr-1">{centerPanel}</div>

        <div className="min-h-0 space-y-4 overflow-auto pr-1">{rightPanel}</div>
      </div>

      <div className="hidden shrink-0 xl:block">
        <details className="rounded-lg border bg-card" open>
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground">
            Evidence Console
          </summary>
          <div className="max-h-64 overflow-auto px-4 pb-4">
            <div className="space-y-4">{evidencePanel}</div>
          </div>
        </details>
      </div>

      <div className="space-y-4 xl:hidden">
        {centerPanel}

        <details className="rounded-lg border bg-card p-3">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Inputs Console
          </summary>
          <div className="mt-3">{leftPanel}</div>
        </details>

        <details className="rounded-lg border bg-card p-3">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Inspector Console
          </summary>
          <div className="mt-3 space-y-3">{rightPanel}</div>
        </details>

        <details className="rounded-lg border bg-card p-3">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Evidence Console
          </summary>
          <div className="mt-3 space-y-3">{evidencePanel}</div>
        </details>
      </div>
    </>
  );
}

type WorkbenchMapCardProps = {
  layers: InteractiveLayer[];
  focusLayerName: string | null;
  focusSignal: number;
  resetSignal: number;
  activeLayerName: string | null;
  mapHeightClassName: string;
  onLayerPick: (layerName: string | null) => void;
  onFeaturePick: (feature: PickedFeature | null) => void;
};

export function WorkbenchMapCard({
  layers,
  focusLayerName,
  focusSignal,
  resetSignal,
  activeLayerName,
  mapHeightClassName,
  onLayerPick,
  onFeaturePick,
}: WorkbenchMapCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">Map Canvas</CardTitle>
          {activeLayerName ? (
            <Badge variant="outline">Active: {activeLayerName}</Badge>
          ) : null}
        </div>
        <CardDescription>GIS-first 主画布（MapLibre）</CardDescription>
      </CardHeader>
      <CardContent>
        <MapLibreCanvas
          layers={layers}
          focusLayerName={focusLayerName}
          focusSignal={focusSignal}
          resetSignal={resetSignal}
          activeLayerName={activeLayerName}
          onLayerPick={onLayerPick}
          onFeaturePick={onFeaturePick}
          mapHeightClassName={mapHeightClassName}
        />

        <div className="mt-3 rounded-md border bg-muted/20 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Legend
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {layers.map((layer) => (
              <div
                key={`legend-${layer.name}`}
                className="flex items-center gap-2 rounded-md border bg-background px-2 py-1 text-xs"
              >
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{
                    backgroundColor: legendColorMap[layer.name] ?? "#6B7280",
                    opacity: layer.opacity,
                  }}
                />
                <span className="truncate">{layer.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type WorkbenchObjectInspectorProps = {
  pickedFeature: PickedFeature | null;
  sceneId: string;
};

export function WorkbenchObjectInspector({
  pickedFeature,
  sceneId,
}: WorkbenchObjectInspectorProps) {
  return (
    <details className="rounded-lg border bg-card shadow-sm">
      <summary className="cursor-pointer list-none px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-foreground">
              Object Inspector
            </p>
            <p className="text-sm text-muted-foreground">
              地图对象的结构化摘要
            </p>
          </div>
          {pickedFeature ? (
            <Badge variant="outline">{pickedFeature.layerName}</Badge>
          ) : (
            <Badge variant="outline">No Selection</Badge>
          )}
        </div>
      </summary>
      <div className="px-6 pb-6">
        {pickedFeature ? (
          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <div className="rounded-md border bg-background p-2">
              <p className="font-medium text-foreground">Object Name</p>
              <p className="mt-1">{pickedFeature.objectName}</p>
            </div>
            <div className="rounded-md border bg-background p-2">
              <p className="font-medium text-foreground">Object Type</p>
              <p className="mt-1">{pickedFeature.objectType}</p>
            </div>
            <div className="rounded-md border bg-background p-2">
              <p className="font-medium text-foreground">Status</p>
              <p className="mt-1">{pickedFeature.status}</p>
            </div>
            <div className="rounded-md border bg-background p-2">
              <p className="font-medium text-foreground">Updated At</p>
              <p className="mt-1">{pickedFeature.updatedAt}</p>
            </div>
            <div className="rounded-md border bg-background p-2 sm:col-span-2">
              <p className="font-medium text-foreground">Clicked Coordinate</p>
              <p className="mt-1">
                Lng {pickedFeature.lng.toFixed(5)} · Lat{" "}
                {pickedFeature.lat.toFixed(5)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            点击地图中的任意图层对象后，这里会展示结构化属性摘要。
          </p>
        )}

        {pickedFeature ? (
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {pickedFeature.taskId ? (
              <Link
                href={`/task-governance/${pickedFeature.taskId}?from=${TASK_CONTEXT_FROM.Workbench}&taskId=${pickedFeature.taskId}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                Related Task Governance
              </Link>
            ) : null}
            {pickedFeature.resultId ? (
              <Link
                href={`/scenes/${sceneId}/results/${pickedFeature.resultId}?from=${TASK_CONTEXT_FROM.Workbench}&taskId=${pickedFeature.taskId ?? ""}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                Related Result Detail
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </details>
  );
}

type WorkbenchStateFocusCardProps = {
  isInputFocusState: boolean;
  requiredMissingCount: number;
  invalidBindingCount: number;
  contextTaskId?: string;
  isRuntimeFocusState: boolean;
  runtimeProgressPercent: number;
  runtimeStageIndex: number;
  isCompleted: boolean;
  sceneId: string;
  isUnderstanding: boolean;
};

export function WorkbenchStateFocusCard({
  isInputFocusState,
  requiredMissingCount,
  invalidBindingCount,
  contextTaskId,
  isRuntimeFocusState,
  runtimeProgressPercent,
  runtimeStageIndex,
  isCompleted,
  sceneId,
  isUnderstanding,
}: WorkbenchStateFocusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">State Focus</CardTitle>
        <CardDescription>当前阶段的首要决策与动作</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isInputFocusState ? (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
            <p className="font-semibold text-foreground">
              Input / Recovery Focus
            </p>
            <p className="mt-1 text-muted-foreground">
              缺失输入 {requiredMissingCount} 项，异常绑定 {invalidBindingCount}
              项。请先修复后恢复执行。
            </p>
            {contextTaskId ? (
              <Link
                href={`/task-governance/${contextTaskId}?from=${TASK_CONTEXT_FROM.Workbench}&taskId=${contextTaskId}`}
                className="mt-3 inline-flex"
              >
                <Button size="sm">Fix and Resume</Button>
              </Link>
            ) : (
              <Button size="sm" className="mt-3" disabled>
                Fix and Resume
              </Button>
            )}
          </div>
        ) : null}

        {isRuntimeFocusState ? (
          <div className="rounded-md border bg-muted/20 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Runtime Progress
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${runtimeProgressPercent}%` }}
              />
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2 text-[11px]">
              {["Understanding", "Queued", "Running", "Processing"].map(
                (stage, index) => (
                  <span
                    key={stage}
                    className={
                      index <= runtimeStageIndex
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {stage}
                  </span>
                ),
              )}
            </div>
            {contextTaskId ? (
              <Link
                href={`/task-governance/${contextTaskId}?from=${TASK_CONTEXT_FROM.Workbench}&taskId=${contextTaskId}`}
                className="mt-3 inline-flex"
              >
                <Button size="sm" variant="outline">
                  Open Governance
                </Button>
              </Link>
            ) : null}
          </div>
        ) : null}

        {isCompleted ? (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3 text-sm">
            <p className="font-semibold text-foreground">Result Ready</p>
            <p className="mt-1 text-muted-foreground">
              任务已完成，建议立即进入 Results 查看结果摘要与解释。
            </p>
            <Link
              href={`/scenes/${sceneId}/results?from=${TASK_CONTEXT_FROM.Workbench}&taskId=${contextTaskId ?? ""}`}
              className="mt-3 inline-flex"
            >
              <Button size="sm">View Results</Button>
            </Link>
          </div>
        ) : null}

        {isUnderstanding ? (
          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            Understanding 阶段暂无主动作，当前仅做状态观察。
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
