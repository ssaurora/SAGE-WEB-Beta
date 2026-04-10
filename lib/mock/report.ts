import type {
  ReportDetailDto,
  ReportListItemDto,
} from "@/lib/contracts/report";
import {
  legacyReportIdToResultIdMap,
  resultDetailMockMap,
  resultListMock,
} from "@/lib/mock/result";

const toLegacyReportId = (resultId: string) =>
  resultId.startsWith("result-") ? resultId.replace("result-", "report-") : resultId;

export const reportListMock: ReportListItemDto[] = resultListMock.map((item) => ({
  ...item,
  reportId: toLegacyReportId(item.resultId),
  reportName: item.resultName,
}));

const detailEntries = Object.values(resultDetailMockMap).map((item) => {
  const legacyId = toLegacyReportId(item.resultId);
  const detail: ReportDetailDto = {
    ...item,
    reportId: legacyId,
    reportName: item.resultName,
  };
  return [item.resultId, detail] as const;
});

export const reportDetailMockMap: Record<string, ReportDetailDto> =
  Object.fromEntries(detailEntries);

export { legacyReportIdToResultIdMap };
