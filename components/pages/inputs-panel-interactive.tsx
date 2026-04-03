"use client";

import { useState } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type RequiredInputItem = {
  name: string;
  expectedType: string;
  status: "Missing" | "Bound" | "Invalid";
  boundAssetId?: string;
  invalidReason?: string;
};

export type OptionalInputItem = {
  name: string;
  expectedType: string;
  status: "Unbound" | "Bound" | "Invalid";
  boundAssetId?: string;
  invalidReason?: string;
};

export type UploadedAsset = {
  id: string;
  name: string;
  type: "Vector Polygon" | "Raster" | "CSV";
  boundTo?: string;
};

export type InputsPanelInteractiveProps = {
  requiredInputs: RequiredInputItem[];
  optionalInputs: OptionalInputItem[];
  uploadedAssets: UploadedAsset[];
  isReadOnly?: boolean;
  onRequiredInputsChange?: (inputs: RequiredInputItem[]) => void;
  onOptionalInputsChange?: (inputs: OptionalInputItem[]) => void;
  onUploadedAssetsChange?: (assets: UploadedAsset[]) => void;
};

export function InputsPanelInteractive({
  requiredInputs,
  optionalInputs,
  uploadedAssets,
  isReadOnly = false,
  onRequiredInputsChange,
  onOptionalInputsChange,
  onUploadedAssetsChange,
}: InputsPanelInteractiveProps) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState<
    "Vector Polygon" | "Raster" | "CSV"
  >("Vector Polygon");
  const [bindDialogOpen, setBindDialogOpen] = useState(false);
  const [bindingTarget, setBindingTarget] = useState<{
    type: "required" | "optional";
    name: string;
  } | null>(null);

  const handleUpload = () => {
    if (!uploadName.trim()) return;

    const newAsset: UploadedAsset = {
      id: `asset-upload-${Date.now()}`,
      name: uploadName.trim(),
      type: uploadType,
    };

    onUploadedAssetsChange?.([newAsset, ...uploadedAssets]);
    setUploadName("");
    setUploadType("Vector Polygon");
    setUploadDialogOpen(false);
  };

  const handleBind = (assetId: string) => {
    if (!bindingTarget) return;

    const newAsset = uploadedAssets.find((a) => a.id === assetId);
    if (!newAsset) return;

    // 先解除旧绑定
    const releaseOldBinding = (oldAssetId?: string) => {
      if (!oldAssetId) return;
      onUploadedAssetsChange?.(
        uploadedAssets.map((asset) =>
          asset.id === oldAssetId ? { ...asset, boundTo: undefined } : asset,
        ),
      );
    };

    const { type, name } = bindingTarget;
    if (type === "required") {
      const oldAssetId = requiredInputs.find(
        (i) => i.name === name,
      )?.boundAssetId;
      releaseOldBinding(oldAssetId);

      const updatedInputs = requiredInputs.map((item) =>
        item.name === name
          ? {
              ...item,
              status: "Bound" as const,
              boundAssetId: assetId,
              invalidReason: undefined,
            }
          : item,
      );
      onRequiredInputsChange?.(updatedInputs);
    } else {
      const oldAssetId = optionalInputs.find(
        (i) => i.name === name,
      )?.boundAssetId;
      releaseOldBinding(oldAssetId);

      const updatedInputs = optionalInputs.map((item) =>
        item.name === name
          ? {
              ...item,
              status: "Bound" as const,
              boundAssetId: assetId,
              invalidReason: undefined,
            }
          : item,
      );
      onOptionalInputsChange?.(updatedInputs);
    }

    // 标记资源为已绑定
    onUploadedAssetsChange?.(
      uploadedAssets.map((asset) =>
        asset.id === assetId ? { ...asset, boundTo: `${type}:${name}` } : asset,
      ),
    );

    setBindingTarget(null);
    setBindDialogOpen(false);
  };

  const handleReplace = (
    inputType: "required" | "optional",
    inputName: string,
  ) => {
    setBindingTarget({ type: inputType, name: inputName });
    setBindDialogOpen(true);
  };

  const handleRemove = (
    inputType: "required" | "optional",
    inputName: string,
  ) => {
    const oldAssetId =
      inputType === "required"
        ? requiredInputs.find((i) => i.name === inputName)?.boundAssetId
        : optionalInputs.find((i) => i.name === inputName)?.boundAssetId;

    if (oldAssetId) {
      onUploadedAssetsChange?.(
        uploadedAssets.map((asset) =>
          asset.id === oldAssetId ? { ...asset, boundTo: undefined } : asset,
        ),
      );
    }

    if (inputType === "required") {
      const updatedInputs = requiredInputs.map((item) =>
        item.name === inputName
          ? {
              ...item,
              status: "Missing" as const,
              boundAssetId: undefined,
            }
          : item,
      );
      onRequiredInputsChange?.(updatedInputs);
    } else {
      const updatedInputs = optionalInputs.map((item) =>
        item.name === inputName
          ? {
              ...item,
              status: "Unbound" as const,
              boundAssetId: undefined,
            }
          : item,
      );
      onOptionalInputsChange?.(updatedInputs);
    }
  };

  const getAssetName = (assetId?: string) => {
    return (
      uploadedAssets.find((a) => a.id === assetId)?.name || "Unknown Asset"
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Bound":
        return "bg-green-50 border-green-200";
      case "Missing":
        return "bg-red-50 border-red-200";
      case "Invalid":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-white";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Bound":
        return "secondary" as const;
      case "Missing":
        return "destructive" as const;
      case "Invalid":
        return "outline" as const;
      case "Unbound":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="space-y-4">
      {/* 已上传资源区 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Uploaded Assets</CardTitle>
            {!isReadOnly && (
              <Dialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUploadDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Asset</DialogTitle>
                    <DialogDescription>
                      Choose asset type and name for your upload.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Asset Name</label>
                      <Input
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        placeholder="e.g., watershed_boundary.geojson"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Asset Type</label>
                      <Select
                        value={uploadType}
                        onValueChange={(v: any) => setUploadType(v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vector Polygon">
                            Vector Polygon
                          </SelectItem>
                          <SelectItem value="Raster">Raster</SelectItem>
                          <SelectItem value="CSV">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setUploadDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={!uploadName.trim()}
                    >
                      Upload
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <CardDescription>
            {uploadedAssets.length} asset(s) in workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedAssets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No assets uploaded yet.
            </p>
          ) : (
            <div className="space-y-2">
              {uploadedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {asset.type}
                    </p>
                  </div>
                  {asset.boundTo && (
                    <Badge variant="secondary" className="mr-2">
                      Bound
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 必需输入区 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Required Inputs</CardTitle>
          <CardDescription>
            {requiredInputs.filter((i) => i.status === "Bound").length} of{" "}
            {requiredInputs.length} bound
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {requiredInputs.map((input) => (
            <div
              key={input.name}
              className={`rounded-md border p-3 transition ${getStatusColor(input.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{input.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {input.expectedType}
                  </p>
                  {input.boundAssetId && (
                    <p className="mt-1 text-xs">
                      Bound to:{" "}
                      <strong>{getAssetName(input.boundAssetId)}</strong>
                    </p>
                  )}
                  {input.invalidReason && (
                    <p className="mt-1 text-xs text-red-600">
                      Issue: {input.invalidReason}
                    </p>
                  )}
                </div>
                <Badge variant={getStatusBadgeVariant(input.status)}>
                  {input.status}
                </Badge>
              </div>
              {!isReadOnly && (
                <div className="mt-2 flex gap-2">
                  {input.status === "Bound" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReplace("required", input.name)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" /> Replace
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemove("required", input.name)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleReplace("required", input.name)}
                    >
                      Bind
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 可选输入区 */}
      {optionalInputs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Optional Inputs</CardTitle>
            <CardDescription>
              {optionalInputs.filter((i) => i.status === "Bound").length} of{" "}
              {optionalInputs.length} bound
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {optionalInputs.map((input) => (
              <div
                key={input.name}
                className={`rounded-md border p-3 transition ${getStatusColor(input.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{input.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {input.expectedType}
                    </p>
                    {input.boundAssetId && (
                      <p className="mt-1 text-xs">
                        Bound to:{" "}
                        <strong>{getAssetName(input.boundAssetId)}</strong>
                      </p>
                    )}
                  </div>
                  <Badge variant={getStatusBadgeVariant(input.status)}>
                    {input.status}
                  </Badge>
                </div>
                {!isReadOnly && (
                  <div className="mt-2 flex gap-2">
                    {input.status === "Bound" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReplace("optional", input.name)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" /> Replace
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemove("optional", input.name)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReplace("optional", input.name)}
                      >
                        Bind
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 绑定对话框 */}
      <Dialog open={bindDialogOpen} onOpenChange={setBindDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bind Input</DialogTitle>
            <DialogDescription>
              Select an asset to bind to <strong>{bindingTarget?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {uploadedAssets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assets available. Please upload first.
              </p>
            ) : (
              uploadedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-md border p-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleBind(asset.id)}
                >
                  <div>
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {asset.type}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Select
                  </Button>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBindDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
