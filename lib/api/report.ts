import type {
  ReportDetailDto,
  ReportListItemDto,
} from "@/lib/contracts/report";
import {
  getResultDetailViewModel,
  getResultListViewModel,
} from "@/lib/api/result";
import { legacyResultAliasToResultIdMap } from "@/lib/mock/result";

export async function getReportListViewModel() {
  return getResultListViewModel() as Promise<ReportListItemDto[]>;
}

export async function getReportDetailViewModel(reportId: string) {
  const normalized = legacyResultAliasToResultIdMap[reportId] ?? reportId;
  return getResultDetailViewModel(normalized) as Promise<ReportDetailDto>;
}
