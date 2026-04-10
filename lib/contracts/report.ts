import type {
  ResultDetailDto,
  ResultDetailSectionViewModel,
  ResultDetailViewModel,
  ResultFormat,
  ResultListItemDto,
  ResultListItemViewModel,
  ResultStatus,
} from "@/lib/contracts/result";

export type ReportStatus = ResultStatus;
export type ReportFormat = ResultFormat;

export type ReportListItemDto = ResultListItemDto & {
  reportId?: string;
  reportName?: string;
};

export type ReportDetailDto = ResultDetailDto & {
  reportId?: string;
  reportName?: string;
};

export type ReportListItemViewModel = ResultListItemViewModel;

export type ReportListViewModel = {
  reports: ReportListItemViewModel[];
};

export type ReportDetailSectionViewModel = ResultDetailSectionViewModel;
export type ReportDetailViewModel = ResultDetailViewModel;
