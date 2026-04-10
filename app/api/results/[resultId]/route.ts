import { NextResponse } from "next/server";
import { resultDetailMockMap } from "@/lib/mock/result";

export async function GET(
  _request: Request,
  context: { params: Promise<{ resultId: string }> },
) {
  const { resultId } = await context.params;
  const result =
    resultDetailMockMap[resultId] ??
    Object.values(resultDetailMockMap).find(
      (item) => item.reportId === resultId,
    );

  if (!result) {
    return NextResponse.json({ message: "Result not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
