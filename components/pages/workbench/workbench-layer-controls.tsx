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

type LayerGroup = "inputs" | "results";

type InteractiveLayer = {
  name: string;
  visible: boolean;
  opacity: number;
};

type WorkbenchLayersCardProps = {
  visibleCount: number;
  onResetMapView: () => void;
  layerControlsNode: ReactNode;
};

export function WorkbenchLayersCard({
  visibleCount,
  onResetMapView,
  layerControlsNode,
}: WorkbenchLayersCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Layers</CardTitle>
            <CardDescription>图层可见性与交互管理</CardDescription>
          </div>
          <Badge variant="outline">{visibleCount} visible</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <details className="rounded-md border p-3">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            展开图层详细控制
          </summary>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-end">
              <Button size="sm" variant="outline" onClick={onResetMapView}>
                Reset View
              </Button>
            </div>

            {layerControlsNode}
          </div>
        </details>
      </CardContent>
    </Card>
  );
}

type WorkbenchLayerControlsProps = {
  layers: InteractiveLayer[];
  groupedLayers: Record<LayerGroup, InteractiveLayer[]>;
  collapsedGroups: Record<LayerGroup, boolean>;
  activeLayerName: string | null;
  onToggleGroupCollapse: (group: LayerGroup) => void;
  onMoveLayer: (layerName: string, direction: "up" | "down") => void;
  onToggleLayerVisibility: (layerName: string) => void;
  onZoomToLayer: (layerName: string) => void;
  onUpdateLayerOpacity: (layerName: string, opacity: number) => void;
};

export function WorkbenchLayerControls({
  layers,
  groupedLayers,
  collapsedGroups,
  activeLayerName,
  onToggleGroupCollapse,
  onMoveLayer,
  onToggleLayerVisibility,
  onZoomToLayer,
  onUpdateLayerOpacity,
}: WorkbenchLayerControlsProps) {
  const renderLayerRow = (
    layer: InteractiveLayer,
    index: number,
    totalCount: number,
  ) => (
    <div
      key={layer.name}
      className={`rounded-md border px-3 py-2 text-sm ${
        activeLayerName === layer.name ? "bg-accent/40" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Badge variant="outline">#{index + 1}</Badge>
          <span className="truncate">{layer.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            disabled={index === 0}
            onClick={() => onMoveLayer(layer.name, "up")}
          >
            ↑
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={index === totalCount - 1}
            onClick={() => onMoveLayer(layer.name, "down")}
          >
            ↓
          </Button>
          <Badge variant={layer.visible ? "secondary" : "outline"}>
            {layer.visible ? "Visible" : "Hidden"}
          </Badge>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onToggleLayerVisibility(layer.name)}
        >
          {layer.visible ? "Hide" : "Show"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onZoomToLayer(layer.name)}
        >
          Zoom to Layer
        </Button>
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Opacity</span>
          <span>{Math.round(layer.opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(layer.opacity * 100)}
          onChange={(event) =>
            onUpdateLayerOpacity(layer.name, Number(event.target.value) / 100)
          }
          className="w-full accent-primary"
        />
      </div>
    </div>
  );

  const renderLayerGroup = (group: LayerGroup, title: string) => (
    <div className="rounded-md border p-2">
      <button
        type="button"
        onClick={() => onToggleGroupCollapse(group)}
        className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-primary"
      >
        <span>{title}</span>
        <span>{collapsedGroups[group] ? "展开" : "收起"}</span>
      </button>
      {!collapsedGroups[group] ? (
        <div className="mt-2 space-y-2">
          {groupedLayers[group].map((layer) =>
            renderLayerRow(
              layer,
              layers.findIndex((item) => item.name === layer.name),
              layers.length,
            ),
          )}
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {renderLayerGroup("inputs", "Input Layers")}
      {renderLayerGroup("results", "Result Layers")}
    </>
  );
}
