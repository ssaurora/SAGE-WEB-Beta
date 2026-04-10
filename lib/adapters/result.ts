import type {
  ResultDetailDto,
  ResultDetailViewModel,
  ResultListItemDto,
  ResultListViewModel,
} from "@/lib/contracts/result";

export function toResultsListViewModel(
  results: ResultListItemDto[],
): ResultListViewModel {
  const mapped = results.map((item) => ({
    id: item.resultId,
    name: item.resultName ?? `${item.analysisType} Result`,
    sceneId: item.sceneId,
    taskId: item.taskId ?? "task-unknown",
    analysisType: item.analysisType,
    generatedAt: item.time,
    status: item.status ?? "Published",
    format: item.format ?? "PDF",
    pageCount: item.pageCount,
    fileSize: item.fileSize,
  }));

  return {
    results: mapped,
    reports: mapped,
  };
}

export function toResultDetailViewModel(
  detail: ResultDetailDto,
): ResultDetailViewModel {
  const resultId = detail.resultId;

  return {
    id: resultId,
    name: detail.resultName ?? `${detail.analysisType} Result`,
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
      Result: resultId,
      Manifest: detail.manifestSummary,
    },
  };
}
