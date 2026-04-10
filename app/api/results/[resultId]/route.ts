import { NextResponse } from "next/server";
import {
  legacyResultAliasToResultIdMap,
  resultDetailMockMap,
} from "@/lib/mock/result";

export async function GET(
  _request: Request,
  context: { params: Promise<{ resultId: string }> },
) {
  const { resultId } = await context.params;
  const normalizedResultId =
    resultId in resultDetailMockMap
      ? resultId
      : legacyResultAliasToResultIdMap[resultId];
  const result = normalizedResultId
    ? resultDetailMockMap[normalizedResultId]
    : undefined;

  if (!result) {
    return NextResponse.json({ message: "Result not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
