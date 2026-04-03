import { NextResponse } from "next/server";
import { assetDetailMockMap } from "@/lib/mock/asset";

export async function GET(
  _request: Request,
  context: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await context.params;
  const asset = assetDetailMockMap[assetId];

  if (!asset) {
    return NextResponse.json({ message: "Asset not found" }, { status: 404 });
  }

  return NextResponse.json(asset);
}
