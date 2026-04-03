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

export type UploadAssetType = "Vector Polygon" | "Raster" | "CSV";

export type UploadedAsset = {
  id: string;
  name: string;
  type: UploadAssetType;
  boundTo?: string;
};
