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
import { canEditWorkbench, useAppRole } from "@/components/pages/app-role";
import type { WorkbenchPageViewModel } from "@/lib/mock/scene";

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

type UploadAssetType = "Vector Polygon" | "Raster" | "CSV";

type UploadedAsset = {
  id: string;
  name: string;
  type: UploadAssetType;
  boundTo?: string;
};

type RequiredInputItem = {
  name: string;
  expectedType: string;
  status: "Missing" | "Bound" | "Invalid";
  boundAssetId?: string;
  invalidReason?: string;
};

type OptionalInputItem = {
  name: string;
  expectedType: string;
  status: "Unbound" | "Bound" | "Invalid";
  boundAssetId?: string;
  invalidReason?: string;
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
  const [bindingSelection, setBindingSelection] = useState<
    Record<string, string>
  >({});

  const [layers, setLayers] = useState<InteractiveLayer[]>(
    vm.layersPanel.map((layer) => ({
      ...layer,
      opacity: 0.6,
    })),
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
  const workbenchState = vm.header.currentState;

  const isQueued = workbenchState === "Queued";
  const isRunning = workbenchState === "Running";
  const isProcessingResults = workbenchState === "Processing Results";
  const isCompleted = workbenchState === "Completed";
  const isFailed = workbenchState === "Failed";
  const isWaitingInput = workbenchState === "Waiting for Required Input";
  const isActionRequired = workbenchState === "Action Required";

  const isInputReadOnly =
    !canEdit || isQueued || isRunning || isProcessingResults || isCompleted;
  const canRunAction = canRunByInputs && !isInputReadOnly;

  const primaryActionLabel = (() => {
    if (isCompleted) return "View Results";
    if (isProcessingResults) return "Processing Results";
    if (isRunning) return "Running";
    if (isQueued) return "Queued";
    if (isFailed || isActionRequired) return "Fix and Resume";
    if (canRunAction) return "Run Analysis";
    if (isWaitingInput) return "Waiting for Required Input";
    return "Run Analysis";
  })();

  const stateHint = (() => {
    if (isQueued) return "任务已排队，本轮输入与参数切换为只读快照。";
    if (isRunning)
      return "任务运行中，本轮输入不可修改，可进入治理页查看事件流。";
    if (isProcessingResults) return "结果处理中，最终产物尚未全部可下载。";
    if (isCompleted) return "任务已完成，可查看结果并进入报告消费链路。";
    if (isFailed || isActionRequired)
      return "当前任务需要修复后恢复，建议先处理缺失输入或无效绑定。";
    if (isWaitingInput) return "等待必需输入，请先完成绑定后再运行。";
    return "可在当前工作台继续分析与治理。";
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

  const toggleLayerVisibility = (layerName: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.name === layerName
          ? { ...layer, visible: !layer.visible }
          : layer,
      ),
    );
  };

  const isCompatible = (expectedType: string, assetType: UploadAssetType) => {
    const normalizedExpected = expectedType.toLowerCase();

    if (normalizedExpected.includes("vector")) {
      return assetType === "Vector Polygon";
    }
    if (normalizedExpected.includes("raster")) {
      return assetType === "Raster";
    }
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
    if (!boundAssetId) {
      return;
    }
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

    if (!targetAssetId) {
      return;
    }

    const selectedAsset = uploadedAssets.find(
      (asset) => asset.id === targetAssetId,
    );
    if (!selectedAsset) {
      return;
    }

    const inputKey = makeInputKey(inputType, inputName);
    const compatible = isCompatible(expectedType, selectedAsset.type);

    setUploadedAssets((prev) =>
      prev.map((asset) => {
        if (asset.id === targetAssetId) {
          return { ...asset, boundTo: inputKey };
        }
        return asset;
      }),
    );

    if (inputType === "required") {
      setRequiredInputs((prev) =>
        prev.map((item) => {
          if (item.name !== inputName) {
            return item;
          }
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
        if (item.name !== inputName) {
          return item;
        }
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

  const removeBinding = (
    inputType: "required" | "optional",
    inputName: string,
  ) => {
    if (inputType === "required") {
      let oldAssetId: string | undefined;
      setRequiredInputs((prev) =>
        prev.map((item) => {
          if (item.name !== inputName) {
            return item;
          }
          oldAssetId = item.boundAssetId;
          return {
            ...item,
            status: "Missing",
            boundAssetId: undefined,
            invalidReason: undefined,
          };
        }),
      );
      releaseOldBinding(oldAssetId);
      return;
    }

    let oldAssetId: string | undefined;
    setOptionalInputs((prev) =>
      prev.map((item) => {
        if (item.name !== inputName) {
          return item;
        }
        oldAssetId = item.boundAssetId;
        return {
          ...item,
          status: "Unbound",
          boundAssetId: undefined,
          invalidReason: undefined,
        };
      }),
    );
    releaseOldBinding(oldAssetId);
  };

  const statusBadgeVariant = (
    status: "Missing" | "Unbound" | "Bound" | "Invalid",
  ) => {
    if (status === "Bound") {
      return "secondary" as const;
    }
    if (status === "Invalid") {
      return "destructive" as const;
    }
    return "outline" as const;
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
    setCollapsedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
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
            aria-label={`Move ${layer.name} up`}
          >
            ↑
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={index === totalCount - 1}
            onClick={() => moveLayer(layer.name, "down")}
            aria-label={`Move ${layer.name} down`}
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

  const moveLayer = (layerName: string, direction: "up" | "down") => {
    setLayers((prev) => {
      const currentIndex = prev.findIndex((layer) => layer.name === layerName);
      if (currentIndex === -1) {
        return prev;
      }

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [picked] = next.splice(currentIndex, 1);
      next.splice(targetIndex, 0, picked);
      return next;
    });
  };

  return (
    <>
      {contextFrom || contextTaskId ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Navigation Context</CardTitle>
            <CardDescription>
              当前工作台由 {contextFrom ?? "external"} 进入
              {contextTaskId ? ` · task ${contextTaskId}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {contextTaskId ? (
              <Link
                href={`/task-governance/${contextTaskId}?from=workbench&taskId=${contextTaskId}`}
              >
                <Button size="sm" variant="outline">
                  Open Task Governance
                </Button>
              </Link>
            ) : null}
            <Link
              href={`/scenes/${sceneId}/results${contextTaskId ? `?taskId=${contextTaskId}&from=workbench` : ""}`}
            >
              <Button size="sm" variant="secondary">
                Open Scene Results
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Workbench Permission Scope
          </CardTitle>
          <CardDescription>
            当前角色：{role} · {canEdit ? "可编辑" : "只读"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!canEdit ? (
            <div className="rounded-md border border-amber-500/50 bg-amber-500/5 p-3 text-sm text-muted-foreground">
              Viewer 模式下已禁用上传、绑定、移除和运行类操作；可切换到 Settings
              调整角色。
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inputs / Layers</CardTitle>
          <CardDescription>
            输入绑定与图层状态 · Required Ready {requiredReadyCount}/
            {requiredTotal}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Required Inputs
            </p>
            {isInputReadOnly ? (
              <p className="mb-2 text-xs text-muted-foreground">
                当前状态为 {workbenchState}，输入绑定区只读。
              </p>
            ) : null}
            <div className="space-y-2">
              {requiredInputs.map((item) => {
                const inputKey = makeInputKey("required", item.name);
                const selectedAssetId =
                  bindingSelection[inputKey] ?? uploadedUnboundAssets[0]?.id;

                return (
                  <div
                    key={item.name}
                    className={`rounded-md border p-3 ${
                      item.status === "Invalid"
                        ? "border-destructive/70 bg-destructive/5"
                        : item.status === "Missing"
                          ? "border-primary/40"
                          : ""
                    }`}
                  >
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.expectedType}
                    </p>
                    <Badge
                      className="mt-2"
                      variant={statusBadgeVariant(item.status)}
                    >
                      {item.status}
                    </Badge>
                    {item.invalidReason ? (
                      <p className="mt-1 text-xs text-destructive">
                        {item.invalidReason}
                      </p>
                    ) : null}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <select
                        value={selectedAssetId ?? ""}
                        onChange={(event) =>
                          setBindingSelection((prev) => ({
                            ...prev,
                            [inputKey]: event.target.value,
                          }))
                        }
                        disabled={isInputReadOnly}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        {uploadedUnboundAssets.length === 0 ? (
                          <option value="">No unbound asset</option>
                        ) : (
                          uploadedUnboundAssets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.name} ({asset.type})
                            </option>
                          ))
                        )}
                      </select>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={
                          uploadedUnboundAssets.length === 0 || isInputReadOnly
                        }
                        onClick={() =>
                          applyBinding(
                            "required",
                            item.name,
                            item.expectedType,
                            selectedAssetId,
                          )
                        }
                      >
                        {item.status === "Bound" ? "Replace" : "Bind"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!item.boundAssetId || isInputReadOnly}
                        onClick={() => removeBinding("required", item.name)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Optional Inputs
            </p>
            <div className="space-y-2">
              {optionalInputs.map((item) => {
                const inputKey = makeInputKey("optional", item.name);
                const selectedAssetId =
                  bindingSelection[inputKey] ?? uploadedUnboundAssets[0]?.id;

                return (
                  <div
                    key={item.name}
                    className={`rounded-md border p-3 ${
                      item.status === "Invalid"
                        ? "border-destructive/70 bg-destructive/5"
                        : ""
                    }`}
                  >
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.expectedType}
                    </p>
                    <Badge
                      className="mt-2"
                      variant={statusBadgeVariant(item.status)}
                    >
                      {item.status}
                    </Badge>
                    {item.invalidReason ? (
                      <p className="mt-1 text-xs text-destructive">
                        {item.invalidReason}
                      </p>
                    ) : null}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <select
                        value={selectedAssetId ?? ""}
                        onChange={(event) =>
                          setBindingSelection((prev) => ({
                            ...prev,
                            [inputKey]: event.target.value,
                          }))
                        }
                        disabled={isInputReadOnly}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        {uploadedUnboundAssets.length === 0 ? (
                          <option value="">No unbound asset</option>
                        ) : (
                          uploadedUnboundAssets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.name} ({asset.type})
                            </option>
                          ))
                        )}
                      </select>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={
                          uploadedUnboundAssets.length === 0 || isInputReadOnly
                        }
                        onClick={() =>
                          applyBinding(
                            "optional",
                            item.name,
                            item.expectedType,
                            selectedAssetId,
                          )
                        }
                      >
                        {item.status === "Bound" ? "Replace" : "Bind"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!item.boundAssetId || isInputReadOnly}
                        onClick={() => removeBinding("optional", item.name)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Uploaded but Unbound
            </p>
            <div className="rounded-md border p-3">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <input
                  value={uploadName}
                  onChange={(event) => setUploadName(event.target.value)}
                  placeholder="Asset name"
                  disabled={isInputReadOnly}
                  className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs"
                />
                <select
                  value={uploadType}
                  onChange={(event) =>
                    setUploadType(event.target.value as UploadAssetType)
                  }
                  disabled={isInputReadOnly}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                >
                  <option value="Raster">Raster</option>
                  <option value="Vector Polygon">Vector Polygon</option>
                  <option value="CSV">CSV</option>
                </select>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={uploadAsset}
                  disabled={isInputReadOnly}
                >
                  Upload
                </Button>
              </div>

              {uploadedUnboundAssets.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No uploaded unbound assets.
                </p>
              ) : (
                <div className="space-y-1">
                  {uploadedUnboundAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between rounded-md border px-2 py-1 text-xs"
                    >
                      <span className="truncate">{asset.name}</span>
                      <Badge variant="outline">{asset.type}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Layers
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{visibleCount} visible</Badge>
                <Button size="sm" variant="outline" onClick={resetMapView}>
                  Reset View
                </Button>
              </div>
            </div>

            <div className="space-y-3">
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
          </div>
        </CardContent>
      </Card>

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

          <div className="mt-3 rounded-md border bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Object Inspector
              </p>
              {pickedFeature ? (
                <Badge variant="outline">{pickedFeature.layerName}</Badge>
              ) : null}
            </div>

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
                  <p className="font-medium text-foreground">
                    Clicked Coordinate
                  </p>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analysis / Task / Context</CardTitle>
          <CardDescription>结构化事实优先于聊天流</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pickedFeature ? (
            <div className="rounded-md border bg-accent/40 p-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Selected Object Summary
              </p>
              <p className="mt-2 font-medium">{pickedFeature.objectName}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {pickedFeature.objectType} · {pickedFeature.status} ·{" "}
                {pickedFeature.layerName}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pickedFeature.taskId ? (
                  <Link
                    href={`/task-governance/${pickedFeature.taskId}?from=workbench&taskId=${pickedFeature.taskId}`}
                    className="inline-block"
                  >
                    <Button size="sm" variant="outline">
                      Open Task Governance
                    </Button>
                  </Link>
                ) : null}
                {pickedFeature.resultId ? (
                  <Link
                    href={`/scenes/${sceneId}/results/${pickedFeature.resultId}?from=workbench&taskId=${pickedFeature.taskId ?? ""}`}
                    className="inline-block"
                  >
                    <Button size="sm" variant="secondary">
                      Open Result Detail
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Suggested Next Steps
            </p>
            <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
              {vm.analysisPanel.suggestedNextSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            {vm.analysisPanel.contextSummary}
          </div>

          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            {vm.taskPanel.lifecycleSummary}
          </div>

          <div className="rounded-md border bg-muted/20 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">
              State Hint · {workbenchState}
            </p>
            <p className="mt-1">{stateHint}</p>
          </div>

          {isCompleted ? (
            <Link href={`/scenes/${sceneId}/results`}>
              <Button className="w-full" variant="secondary">
                {primaryActionLabel}
              </Button>
            </Link>
          ) : (
            <Button
              className="w-full"
              disabled={!canRunAction && !(isFailed || isActionRequired)}
              variant={isFailed || isActionRequired ? "outline" : "default"}
            >
              {primaryActionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
}
