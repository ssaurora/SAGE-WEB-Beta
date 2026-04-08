import {
  getReportDetailViewModel as getReportDetail,
  getReportListViewModel as getReportList,
} from "@/lib/api/report";
import type { ResultDetailDto, ResultListItemDto } from "@/lib/contracts/result";

export async function getResultListViewModel(): Promise<ResultListItemDto[]> {
  return getReportList();
}

export async function getResultDetailViewModel(
  resultId: string,
): Promise<ResultDetailDto> {
  return getReportDetail(resultId);
}
