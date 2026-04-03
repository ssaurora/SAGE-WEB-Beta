import { NextResponse } from "next/server";
import { reportListMock } from "@/lib/mock/report";

export async function GET() {
  return NextResponse.json(reportListMock);
}
