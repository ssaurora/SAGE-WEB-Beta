import { Metadata } from "next";
import { ReportDetailClient, type ReportDetailViewModel } from "@/components/pages/report-detail-client";
import { getReportDetailViewModel as getReportDetailFromApi } from "@/lib/api/report";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reportId: string }>;
}): Promise<Metadata> {
  const { reportId } = await params;
  return {
    title: `Report ${reportId}`,
    description: "View and download analysis report",
  };
}

async function getReportDetailViewModel(reportId: string): Promise<ReportDetailViewModel> {
  const detail = await getReportDetailFromApi(reportId);

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

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  const vm = await getReportDetailViewModel(reportId);

  return (
    <div className="space-y-4">
      <ReportDetailClient vm={vm} />
    </div>
  );
}
