import { NextResponse } from "next/server";
import { reportDetailMockMap } from "@/lib/mock/report";

export async function GET(
  _request: Request,
  context: { params: Promise<{ resultId: string }> },
) {
  const { resultId } = await context.params;
  const result =
    reportDetailMockMap[resultId] ??
    Object.values(reportDetailMockMap).find(
      (item) => item.reportId === resultId,
    );

  if (!result) {
    return NextResponse.json({ message: "Result not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
