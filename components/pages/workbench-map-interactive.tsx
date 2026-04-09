"use client";

import { useMemo, useState } from "react";
import { type PickedFeature } from "@/components/pages/maplibre-canvas";
import { InputsPanelInteractive } from "@/components/pages/inputs-panel-interactive";
import { canEditWorkbench, useAppRole } from "@/components/pages/app-role";
import {
  WorkbenchLayerControls,
  WorkbenchLayersCard,
} from "@/components/pages/workbench/workbench-layer-controls";
import {
  WorkbenchMapCard,
  WorkbenchObjectInspector,
  WorkbenchStateFocusCard,
  WorkbenchWorkspaceLayout,
} from "@/components/pages/workbench/workbench-main-panels";
import {
  WorkbenchCurrentStateCard,
  WorkbenchExecutionContextCard,
  WorkbenchInputsCard,
  WorkbenchNextStepsCard,
} from "@/components/pages/workbench/workbench-status-cards";
import type { InteractiveLayer } from "@/components/pages/workbench/types";
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

  const handleRequiredInputsChange = (updated: RequiredInputItem[]) => {
    updated.forEach((item) => {
      if (item.boundAssetId) {
        applyBinding("required", item.name, item.expectedType, item.boundAssetId);
      }
    });
  };

  const handleOptionalInputsChange = (updated: OptionalInputItem[]) => {
    updated.forEach((item) => {
      if (item.boundAssetId) {
        applyBinding("optional", item.name, item.expectedType, item.boundAssetId);
      }
    });
  };

  const handleUploadedAssetsChange = (assets: UploadedAsset[]) => {
    assets.forEach(() => uploadAsset());
  };

  const renderInputsPanel = () => (
    <InputsPanelInteractive
      requiredInputs={requiredInputs}
      optionalInputs={optionalInputs}
      uploadedAssets={uploadedUnboundAssets}
      isReadOnly={isInputReadOnly}
      onRequiredInputsChange={handleRequiredInputsChange}
      onOptionalInputsChange={handleOptionalInputsChange}
      onUploadedAssetsChange={handleUploadedAssetsChange}
    />
  );

  const inputsPanelNode = renderInputsPanel();

  const evidencePanel = (
    <>
      <WorkbenchLayersCard
        visibleCount={visibleCount}
        onResetMapView={resetMapView}
        layerControlsNode={
          <WorkbenchLayerControls
            layers={layers}
            groupedLayers={groupedLayers}
            collapsedGroups={collapsedGroups}
            activeLayerName={activeLayerName}
            onToggleGroupCollapse={toggleGroupCollapse}
            onMoveLayer={moveLayer}
            onToggleLayerVisibility={toggleLayerVisibility}
            onZoomToLayer={zoomToLayer}
            onUpdateLayerOpacity={updateLayerOpacity}
          />
        }
      />

      <WorkbenchNextStepsCard
        suggestedNextSteps={vm.analysisPanel.suggestedNextSteps}
      />

      <WorkbenchExecutionContextCard
        contextSummary={vm.analysisPanel.contextSummary}
        lifecycleSummary={vm.taskPanel.lifecycleSummary}
      />
    </>
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <WorkbenchCurrentStateCard
        workbenchState={workbenchState}
        isFailed={isFailed}
        isCompleted={isCompleted}
        layoutLabel={layoutLabel}
        stateHint={stateHint}
        contextFrom={contextFrom}
        contextTaskId={contextTaskId}
        requiredReadyCount={requiredReadyCount}
        requiredTotal={requiredTotal}
        requiredMissingCount={requiredMissingCount}
        invalidBindingCount={invalidBindingCount}
        canEdit={canEdit}
        role={role}
      />

      <WorkbenchWorkspaceLayout
        leftPanel={
          <WorkbenchInputsCard
            requiredReadyCount={requiredReadyCount}
            requiredTotal={requiredTotal}
            requiredMissingCount={requiredMissingCount}
            invalidBindingCount={invalidBindingCount}
            inputsPanelNode={inputsPanelNode}
          />
        }
        centerPanel={
          <WorkbenchMapCard
            layers={layers}
            focusLayerName={focusLayerName}
            focusSignal={focusSignal}
            resetSignal={resetSignal}
            activeLayerName={activeLayerName}
            mapHeightClassName={mapHeightClassName}
            onLayerPick={setActiveLayerName}
            onFeaturePick={setPickedFeature}
          />
        }
        rightPanel={
          <>
            <WorkbenchStateFocusCard
              isInputFocusState={isInputFocusState}
              requiredMissingCount={requiredMissingCount}
              invalidBindingCount={invalidBindingCount}
              contextTaskId={contextTaskId}
              isRuntimeFocusState={isRuntimeFocusState}
              runtimeProgressPercent={runtimeProgressPercent}
              runtimeStageIndex={runtimeStageIndex}
              isCompleted={isCompleted}
              sceneId={sceneId}
              isUnderstanding={isUnderstanding}
            />
            <WorkbenchObjectInspector
              pickedFeature={pickedFeature}
              sceneId={sceneId}
            />
          </>
        }
        evidencePanel={evidencePanel}
      />
    </div>
  );
}
