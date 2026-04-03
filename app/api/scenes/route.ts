import { NextResponse } from "next/server";
import { scenesListMock } from "@/lib/mock/scenes";

export async function GET() {
  return NextResponse.json(scenesListMock);
}
