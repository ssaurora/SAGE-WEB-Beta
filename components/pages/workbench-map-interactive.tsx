"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { InputsPanelInteractive } from "@/components/pages/inputs-panel-interactive";
import { canEditWorkbench, useAppRole } from "@/components/pages/app-role";
import { TaskContextBar } from "@/components/pages/task-context-bar";
import type { WorkbenchPageViewModel } from "@/lib/contracts/scene";
import {
  getTaskStateLabel,
  getTaskStateVariant,
} from "@/lib/status/task-state";
import type {
  OptionalInputItem,
  RequiredInputItem,
  UploadAssetType,
  UploadedAsset,
} from "@/lib/contracts/workbench-inputs";

type WorkbenchMapInteractiveProps = {
  vm: WorkbenchPageViewModel;
  sceneId: string;
  contextFrom?: string;
  contextTaskId?: string;
};

type InteractiveLayer = {
  name: string;
  visible: boolean;
  opacity: number;
};

const legendColorMap: Record<string, string> = {
  "Study Area": "#3B82F6",
  "Precipitation 2025": "#22C55E",
  "Water Yield Result": "#A855F7",
};

export function WorkbenchMapInteractive({
  vm,
  sceneId,
  contextFrom,
  contextTaskId,
}: WorkbenchMapInteractiveProps) {
  const { role } = useAppRole();
  const canEdit = canEditWorkbench(role);

  const [requiredInputs, setRequiredInputs] = useState<RequiredInputItem[]>(
    vm.inputsPanel.required.map((item) => ({
      name: item.name,
      expectedType: item.expectedType,
      status: item.status === "Bound" ? "Bound" : "Missing",
    })),
  );
  const [optionalInputs, setOptionalInputs] = useState<OptionalInputItem[]>(
    vm.inputsPanel.optional.map((item) => ({
      name: item.name,
      expectedType: item.expectedType,
      status: item.status === "Bound" ? "Bound" : "Unbound",
    })),
  );
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([
    {
      id: "asset-upload-001",
      name: "watershed_boundary.geojson",
      type: "Vector Polygon",
      boundTo: "required:Study Area Boundary",
    },
    {
      id: "asset-upload-002",
      name: "precip_2025.tif",
      type: "Raster",
      boundTo: "required:Precipitation Raster",
    },
    {
      id: "asset-upload-003",
      name: "biophysical_table_v2.csv",
      type: "CSV",
    },
  ]);

  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState<UploadAssetType>("Raster");
  const [layers, setLayers] = useState<InteractiveLayer[]>(
    vm.layersPanel.map((layer) => ({ ...layer, opacity: 0.6 })),
  );
  const [focusLayerName, setFocusLayerName] = useState<string | null>(null);
  const [focusSignal, setFocusSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [activeLayerName, setActiveLayerName] = useState<string | null>(null);
  const [pickedFeature, setPickedFeature] = useState<PickedFeature | null>(
    null,
  );
  const [collapsedGroups, setCollapsedGroups] = useState({
    inputs: false,
    results: false,
  });

  const visibleCount = useMemo(
    () => layers.filter((layer) => layer.visible).length,
    [layers],
  );
  const uploadedUnboundAssets = useMemo(
    () => uploadedAssets.filter((asset) => !asset.boundTo),
    [uploadedAssets],
  );
  const requiredReadyCount = useMemo(
    () => requiredInputs.filter((item) => item.status === "Bound").length,
    [requiredInputs],
  );

  const requiredTotal = requiredInputs.length;
  const canRunByInputs =
    requiredReadyCount === requiredTotal && requiredTotal > 0;
  const requiredMissingCount = requiredInputs.filter(
    (item) => item.status === "Missing",
  ).length;
  const invalidBindingCount =
    requiredInputs.filter((item) => item.status === "Invalid").length +
    optionalInputs.filter((item) => item.status === "Invalid").length;

  const workbenchState = vm.header.currentState;
  const isQueued = workbenchState === "Queued";
  const isRunning = workbenchState === "Running";
  const isProcessingResults = workbenchState === "Processing Results";
  const isUnderstanding = workbenchState === "Understanding";
  const isCompleted = workbenchState === "Completed";
  const isFailed = workbenchState === "Failed";
  const isWaitingInput = workbenchState === "Waiting for Required Input";
  const isActionRequired = workbenchState === "Action Required";

  const isInputFocusState = isWaitingInput || isActionRequired || isFailed;
  const isRuntimeFocusState = isQueued || isRunning || isProcessingResults;
  const layoutMode = isInputFocusState
    ? "input-recovery"
    : isCompleted
      ? "result-transition"
      : "runtime-monitoring";
  const layoutLabel =
    layoutMode === "input-recovery"
      ? "Input Recovery Layout"
      : layoutMode === "result-transition"
        ? "Result Transition Layout"
        : "Runtime Monitoring Layout";
  const mapHeightClassName =
    layoutMode === "input-recovery"
      ? "h-[280px]"
      : layoutMode === "result-transition"
        ? "h-[500px]"
        : "h-[420px]";

  const isInputReadOnly =
    !canEdit || isQueued || isRunning || isProcessingResults || isCompleted;
  const canRunAction = canRunByInputs && !isInputReadOnly;

  const stateHint = (() => {
    if (isUnderstanding)
      return "需求理解中，系统正在整理分析目标与输入约束，请稍候进入参数规划阶段。";
    if (isQueued) return "任务已排队，本轮输入与参数切换为只读快照。";
    if (isRunning)
      return "任务运行中，本轮输入不可修改，可进入治理页查看事件流。";
    if (isProcessingResults) return "结果处理中，最终产物尚未全部可下载。";
    if (isCompleted) return "任务已完成，可查看结果并进入报告消费链路。";
    if (!canEdit)
      return "当前角色为只读，若需执行上传、绑定或运行，请前往 Settings 切换角色。";
    if (isFailed || isActionRequired)
      return "当前任务需要修复后恢复，建议先处理缺失输入或无效绑定。";
    if (isWaitingInput) return "等待必需输入，请先完成绑定后再运行。";
    return "可在当前工作台继续分析与治理。";
  })();

  const runtimeProgressPercent = (() => {
    if (isUnderstanding) return 20;
    if (isQueued) return 40;
    if (isRunning) return 70;
    if (isProcessingResults) return 90;
    if (isCompleted) return 100;
    return 0;
  })();

  const runtimeStageIndex = (() => {
    if (isUnderstanding) return 0;
    if (isQueued) return 1;
    if (isRunning) return 2;
    if (isProcessingResults || isCompleted) return 3;
    return -1;
  })();

  const groupedLayers = useMemo(
    () => ({
      inputs: layers.filter(
        (layer) => !layer.name.toLowerCase().includes("result"),
      ),
      results: layers.filter((layer) =>
        layer.name.toLowerCase().includes("result"),
      ),
    }),
    [layers],
  );

  const isCompatible = (expectedType: string, assetType: UploadAssetType) => {
    const normalizedExpected = expectedType.toLowerCase();
    if (normalizedExpected.includes("vector"))
      return assetType === "Vector Polygon";
    if (normalizedExpected.includes("raster")) return assetType === "Raster";
    if (
      normalizedExpected.includes("csv") ||
      normalizedExpected.includes("table")
    ) {
      return assetType === "CSV";
    }
    return true;
  };

  const makeInputKey = (
    inputType: "required" | "optional",
    inputName: string,
  ) => `${inputType}:${inputName}`;

  const uploadAsset = () => {
    const nextName = uploadName.trim() || `uploaded_${Date.now()}`;
    const nextAsset: UploadedAsset = {
      id: `asset-upload-${Date.now()}`,
      name: nextName,
      type: uploadType,
    };
    setUploadedAssets((prev) => [nextAsset, ...prev]);
    setUploadName("");
  };

  const releaseOldBinding = (boundAssetId?: string) => {
    if (!boundAssetId) return;
    setUploadedAssets((prev) =>
      prev.map((asset) =>
        asset.id === boundAssetId ? { ...asset, boundTo: undefined } : asset,
      ),
    );
  };

  const applyBinding = (
    inputType: "required" | "optional",
    inputName: string,
    expectedType: string,
    selectedAssetId?: string,
  ) => {
    const targetAssetId = selectedAssetId ?? uploadedUnboundAssets[0]?.id;
    if (!targetAssetId) return;

    const selectedAsset = uploadedAssets.find(
      (asset) => asset.id === targetAssetId,
    );
    if (!selectedAsset) return;

    const inputKey = makeInputKey(inputType, inputName);
    const compatible = isCompatible(expectedType, selectedAsset.type);

    setUploadedAssets((prev) =>
      prev.map((asset) =>
        asset.id === targetAssetId ? { ...asset, boundTo: inputKey } : asset,
      ),
    );

    if (inputType === "required") {
      setRequiredInputs((prev) =>
        prev.map((item) => {
          if (item.name !== inputName) return item;
          releaseOldBinding(item.boundAssetId);
          return {
            ...item,
            boundAssetId: targetAssetId,
            status: compatible ? "Bound" : "Invalid",
            invalidReason: compatible
              ? undefined
              : `Expected ${expectedType}, got ${selectedAsset.type}`,
          };
        }),
      );
      return;
    }

    setOptionalInputs((prev) =>
      prev.map((item) => {
        if (item.name !== inputName) return item;
        releaseOldBinding(item.boundAssetId);
        return {
          ...item,
          boundAssetId: targetAssetId,
          status: compatible ? "Bound" : "Invalid",
          invalidReason: compatible
            ? undefined
            : `Expected ${expectedType}, got ${selectedAsset.type}`,
        };
      }),
    );
  };

  const toggleLayerVisibility = (layerName: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.name === layerName
          ? { ...layer, visible: !layer.visible }
          : layer,
      ),
    );
  };

  const moveLayer = (layerName: string, direction: "up" | "down") => {
    setLayers((prev) => {
      const currentIndex = prev.findIndex((layer) => layer.name === layerName);
      if (currentIndex === -1) return prev;
      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const [picked] = next.splice(currentIndex, 1);
      next.splice(targetIndex, 0, picked);
      return next;
    });
  };

  const zoomToLayer = (layerName: string) => {
    setFocusLayerName(layerName);
    setFocusSignal((prev) => prev + 1);
    setActiveLayerName(layerName);
  };

  const updateLayerOpacity = (layerName: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.name === layerName ? { ...layer, opacity } : layer,
      ),
    );
  };

  const resetMapView = () => {
    setResetSignal((prev) => prev + 1);
  };

  const toggleGroupCollapse = (group: "inputs" | "results") => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

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
            onClick={() => moveLayer(layer.name, "up")}
          >
            ↑
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={index === totalCount - 1}
            onClick={() => moveLayer(layer.name, "down")}
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
          onClick={() => toggleLayerVisibility(layer.name)}
        >
          {layer.visible ? "Hide" : "Show"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => zoomToLayer(layer.name)}
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
            updateLayerOpacity(layer.name, Number(event.target.value) / 100)
          }
          className="w-full accent-primary"
        />
      </div>
    </div>
  );

  const renderInputsCard = (mode: "expanded" | "collapsed") => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Inputs</CardTitle>
        <CardDescription>
          Required Ready {requiredReadyCount}/{requiredTotal} · Missing{" "}
          {requiredMissingCount} · Invalid {invalidBindingCount}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === "expanded" ? (
          <InputsPanelInteractive
            requiredInputs={requiredInputs}
            optionalInputs={optionalInputs}
            uploadedAssets={uploadedUnboundAssets}
            isReadOnly={isInputReadOnly}
            onRequiredInputsChange={(updated) => {
              updated.forEach((item) => {
                if (item.boundAssetId) {
                  applyBinding(
                    "required",
                    item.name,
                    item.expectedType,
                    item.boundAssetId,
                  );
                }
              });
            }}
            onOptionalInputsChange={(updated) => {
              updated.forEach((item) => {
                if (item.boundAssetId) {
                  applyBinding(
                    "optional",
                    item.name,
                    item.expectedType,
                    item.boundAssetId,
                  );
                }
              });
            }}
            onUploadedAssetsChange={(assets) => {
              assets.forEach(() => uploadAsset());
            }}
          />
        ) : (
          <details className="rounded-md border p-3">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              展开输入详情
            </summary>
            <div className="mt-3">
              <InputsPanelInteractive
                requiredInputs={requiredInputs}
                optionalInputs={optionalInputs}
                uploadedAssets={uploadedUnboundAssets}
                isReadOnly={isInputReadOnly}
                onRequiredInputsChange={(updated) => {
                  updated.forEach((item) => {
                    if (item.boundAssetId) {
                      applyBinding(
                        "required",
                        item.name,
                        item.expectedType,
                        item.boundAssetId,
                      );
                    }
                  });
                }}
                onOptionalInputsChange={(updated) => {
                  updated.forEach((item) => {
                    if (item.boundAssetId) {
                      applyBinding(
                        "optional",
                        item.name,
                        item.expectedType,
                        item.boundAssetId,
                      );
                    }
                  });
                }}
                onUploadedAssetsChange={(assets) => {
                  assets.forEach(() => uploadAsset());
                }}
              />
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );

  const renderStateFocusCard = () => (
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
                href={`/task-governance/${contextTaskId}?from=workbench&taskId=${contextTaskId}`}
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
                href={`/task-governance/${contextTaskId}?from=workbench&taskId=${contextTaskId}`}
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
              href={`/scenes/${sceneId}/results`}
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

  const renderMapCard = () => (
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
          onLayerPick={setActiveLayerName}
          onFeaturePick={setPickedFeature}
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

  const renderEvidenceCards = () => (
    <>
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
                <Button size="sm" variant="outline" onClick={resetMapView}>
                  Reset View
                </Button>
              </div>

              <div className="rounded-md border p-2">
                <button
                  type="button"
                  onClick={() => toggleGroupCollapse("inputs")}
                  className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-primary"
                >
                  <span>Input Layers</span>
                  <span>{collapsedGroups.inputs ? "展开" : "收起"}</span>
                </button>
                {!collapsedGroups.inputs ? (
                  <div className="mt-2 space-y-2">
                    {groupedLayers.inputs.map((layer) =>
                      renderLayerRow(
                        layer,
                        layers.findIndex((item) => item.name === layer.name),
                        layers.length,
                      ),
                    )}
                  </div>
                ) : null}
              </div>

              <div className="rounded-md border p-2">
                <button
                  type="button"
                  onClick={() => toggleGroupCollapse("results")}
                  className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-primary"
                >
                  <span>Result Layers</span>
                  <span>{collapsedGroups.results ? "展开" : "收起"}</span>
                </button>
                {!collapsedGroups.results ? (
                  <div className="mt-2 space-y-2">
                    {groupedLayers.results.map((layer) =>
                      renderLayerRow(
                        layer,
                        layers.findIndex((item) => item.name === layer.name),
                        layers.length,
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </details>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Next Steps</CardTitle>
          <CardDescription>只保留有行动含义的建议</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            {vm.analysisPanel.suggestedNextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Execution Context</CardTitle>
          <CardDescription>context / lifecycle summary</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-3 rounded-md border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
            {vm.analysisPanel.contextSummary}
          </p>
          <details className="rounded-md border p-3">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              展开执行上下文
            </summary>
            <div className="mt-3 space-y-3">
              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                {vm.taskPanel.lifecycleSummary}
              </div>
            </div>
          </details>
        </CardContent>
      </Card>
    </>
  );

  const renderObjectInspector = () => (
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
                href={`/task-governance/${pickedFeature.taskId}?from=workbench&taskId=${pickedFeature.taskId}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                Related Task Governance
              </Link>
            ) : null}
            {pickedFeature.resultId ? (
              <Link
                href={`/scenes/${sceneId}/results/${pickedFeature.resultId}?from=workbench&taskId=${pickedFeature.taskId ?? ""}`}
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

  return (
    <div className="space-y-4">
      <TaskContextBar
        sceneName={vm.header.sceneName}
        sceneHref={`/scenes/${sceneId}/overview`}
        taskId={contextTaskId}
        taskHref={
          contextTaskId
            ? `/task-governance/${contextTaskId}?from=workbench&taskId=${contextTaskId}`
            : undefined
        }
        stateLabel={getTaskStateLabel(workbenchState)}
        stateVariant={getTaskStateVariant(workbenchState)}
        currentView="Workbench"
        roleLabel={role}
        modeLabel={canEdit ? "Editable" : "Read Only"}
        summary={layoutLabel}
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">Current State</CardTitle>
              <Badge
                variant={
                  isFailed
                    ? "destructive"
                    : isCompleted
                      ? "secondary"
                      : "outline"
                }
              >
                {workbenchState}
              </Badge>
              <Badge variant="outline">{layoutLabel}</Badge>
            </div>
            <CardDescription>
              {stateHint}
              {contextFrom || contextTaskId
                ? ` · via ${contextFrom ?? "external"}${contextTaskId ? ` / task ${contextTaskId}` : ""}`
                : ""}
            </CardDescription>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>
                Required Ready {requiredReadyCount}/{requiredTotal}
              </span>
              <span>· Missing {requiredMissingCount}</span>
              <span>· Invalid {invalidBindingCount}</span>
            </div>
            {!canEdit ? (
              <p className="text-xs text-muted-foreground">
                Viewer 模式（{role}）下已禁用编辑操作。
              </p>
            ) : null}
          </div>
        </CardHeader>
      </Card>

      {layoutMode === "input-recovery" ? (
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-4">
            {renderInputsCard("expanded")}
            {renderEvidenceCards()}
          </div>
          <div className="space-y-4">
            {renderStateFocusCard()}
            {renderMapCard()}
            {renderObjectInspector()}
          </div>
        </div>
      ) : layoutMode === "result-transition" ? (
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            {renderStateFocusCard()}
            {renderEvidenceCards()}
          </div>
          <div className="space-y-4">
            {renderMapCard()}
            {renderInputsCard("collapsed")}
            {renderObjectInspector()}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {renderStateFocusCard()}
            {renderInputsCard("collapsed")}
          </div>
          <div className="space-y-4">
            {renderMapCard()}
            {renderEvidenceCards()}
            {renderObjectInspector()}
          </div>
        </div>
      )}
    </div>
  );
}
