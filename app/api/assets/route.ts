import { NextResponse } from "next/server";
import { assetListMock } from "@/lib/mock/asset";

export async function GET() {
  return NextResponse.json(assetListMock);
}
