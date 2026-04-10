import { NextResponse } from "next/server";
import { resultListMock } from "@/lib/mock/result";

export async function GET() {
  return NextResponse.json(resultListMock);
}
