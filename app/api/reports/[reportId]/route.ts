import { NextResponse } from "next/server";
import { reportDetailMockMap } from "@/lib/mock/report";

export async function GET(
  _request: Request,
  context: { params: Promise<{ reportId: string }> },
) {
  const { reportId } = await context.params;
  const report = reportDetailMockMap[reportId];

  if (!report) {
    return NextResponse.json({ message: "Report not found" }, { status: 404 });
  }

  return NextResponse.json(report);
}
