import type {
  ReportDetailViewModel as ReportDetailDto,
  ReportListItemViewModel as ReportListDto,
} from "@/lib/mock/report";
import type { ReportListViewModel } from "@/components/pages/reports-list-client";
import type { ReportDetailViewModel } from "@/components/pages/report-detail-client";

export function toReportsListViewModel(
  reports: ReportListDto[],
): ReportListViewModel {
  return {
    reports: reports.map((item) => ({
      id: item.reportId,
      name: item.reportName ?? `${item.analysisType} Report`,
      sceneId: item.sceneId,
      taskId: item.taskId ?? "task-unknown",
      analysisType: item.analysisType,
      generatedAt: item.time,
      status: item.status ?? "Published",
      format: item.format ?? "PDF",
      pageCount: item.pageCount,
      fileSize: item.fileSize,
    })),
  };
}

export function toReportDetailViewModel(
  detail: ReportDetailDto,
): ReportDetailViewModel {
  return {
    id: detail.reportId,
    name: detail.reportName ?? `${detail.analysisType} Report`,
    sceneId: detail.sceneId,
    taskId: detail.taskId,
    analysisType: detail.analysisType,
    generatedAt: detail.time,
    status: detail.status ?? "Published",
    format: detail.format ?? "PDF",
    pageCount: detail.pageCount,
    fileSize: detail.fileSize,
    generatedBy: detail.generatedBy ?? detail.modelName,
    downloadUrl: detail.downloadUrl,
    description: detail.resultSummary,
    sections: [
      {
        id: "metrics",
        title: "Metrics",
        description: "关键指标摘要",
        contentPreview: detail.metrics
          .map((metric) => `${metric.name}: ${metric.value}`)
          .join("\n"),
      },
      {
        id: "explanation",
        title: "Explanation",
        description: "结果解释",
        contentPreview: detail.explanation,
      },
      {
        id: "exports",
        title: "Exports",
        description: "导出物清单",
        contentPreview: detail.exports.join("\n"),
      },
    ],
    metadata: {
      Model: detail.modelName,
      Result: detail.resultId,
      Manifest: detail.manifestSummary,
    },
  };
}
