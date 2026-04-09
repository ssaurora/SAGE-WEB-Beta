import {
  toReportDetailViewModel,
  toReportsListViewModel,
} from "@/lib/adapters/report";
import type {
  ResultDetailDto,
  ResultDetailViewModel,
  ResultListItemDto,
  ResultListViewModel,
} from "@/lib/contracts/result";

export function toResultsListViewModel(
  results: ResultListItemDto[],
): ResultListViewModel {
  const reportVm = toReportsListViewModel(results);
  return {
    results: reportVm.reports,
    reports: reportVm.reports,
  };
}

export function toResultDetailViewModel(
  detail: ResultDetailDto,
): ResultDetailViewModel {
  return toReportDetailViewModel(detail);
}
