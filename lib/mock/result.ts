import {
  reportDetailMockMap,
  reportListMock,
} from "@/lib/mock/report";
import type {
  ResultDetailDto,
  ResultListItemDto,
} from "@/lib/contracts/result";

export const resultListMock: ResultListItemDto[] = reportListMock.map((item) => ({
  resultId: item.resultId,
  sceneId: item.sceneId,
  taskId: item.taskId,
  analysisType: item.analysisType,
  modelName: item.modelName,
  time: item.time,
  resultName: item.resultName ?? item.reportName,
  status: item.status,
  format: item.format,
  pageCount: item.pageCount,
  fileSize: item.fileSize,
  resultSummary: item.resultSummary,
}));

const detailEntries = Object.values(reportDetailMockMap).map((item) => {
  const result: ResultDetailDto = {
    resultId: item.resultId,
    sceneId: item.sceneId,
    taskId: item.taskId,
    analysisType: item.analysisType,
    modelName: item.modelName,
    time: item.time,
    resultName: item.resultName ?? item.reportName,
    status: item.status,
    format: item.format,
    pageCount: item.pageCount,
    fileSize: item.fileSize,
    generatedBy: item.generatedBy,
    downloadUrl: item.downloadUrl,
    resultSummary: item.resultSummary,
    metrics: item.metrics,
    explanation: item.explanation,
    exports: item.exports,
    manifestSummary: item.manifestSummary,
  };

  return [result.resultId, result] as const;
});

export const resultDetailMockMap: Record<string, ResultDetailDto> =
  Object.fromEntries(detailEntries);

export const legacyReportIdToResultIdMap: Record<string, string> =
  Object.values(reportDetailMockMap).reduce<Record<string, string>>(
    (acc, item) => {
      if (item.reportId) {
        acc[item.reportId] = item.resultId;
      }
      return acc;
    },
    {},
  );
