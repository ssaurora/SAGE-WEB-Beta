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
  return toReportsListViewModel(results);
}

export function toResultDetailViewModel(
  detail: ResultDetailDto,
): ResultDetailViewModel {
  return toReportDetailViewModel(detail);
}
