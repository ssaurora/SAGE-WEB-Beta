import type {
  ReportDetailDto,
  ReportDetailViewModel,
  ReportListItemDto,
  ReportListViewModel,
} from "@/lib/contracts/report";
import {
  toResultDetailViewModel,
  toResultsListViewModel,
} from "@/lib/adapters/result";

export function toReportsListViewModel(
  reports: ReportListItemDto[],
): ReportListViewModel {
  const vm = toResultsListViewModel(reports);
  return { reports: vm.results };
}

export function toReportDetailViewModel(
  detail: ReportDetailDto,
): ReportDetailViewModel {
  return toResultDetailViewModel(detail);
}
