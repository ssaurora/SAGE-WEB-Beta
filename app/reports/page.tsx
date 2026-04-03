import { Metadata } from "next";
import { ReportsListClient, type ReportListViewModel } from "@/components/pages/reports-list-client";
import { getReportListViewModel } from "@/lib/api/report";

export const metadata: Metadata = {
  title: "Reports",
  description: "Browse and download analysis reports",
};

async function getReportsViewModel(): Promise<ReportListViewModel> {
  const reports = await getReportListViewModel();

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

export default async function ReportsPage() {
  const vm = await getReportsViewModel();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="mt-2 text-muted-foreground">
          Browse, search, and download analysis reports from your projects.
        </p>
      </div>

      <ReportsListClient vm={vm} />
    </div>
  );
}
