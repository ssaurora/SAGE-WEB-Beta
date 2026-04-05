import { Metadata } from "next";
import { ResultsListClient } from "@/components/pages/results-list-client";
import { getReportListViewModel } from "@/lib/api/report";
import { toReportsListViewModel } from "@/lib/adapters/report";
import type { ReportListViewModel } from "@/lib/contracts/report";

export const metadata: Metadata = {
  title: "结果",
  description: "浏览与下载分析结果",
};

async function getResultsViewModel(): Promise<ReportListViewModel> {
  const reports = await getReportListViewModel();
  return toReportsListViewModel(reports);
}

export default async function ResultsPage() {
  const vm = await getResultsViewModel();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">结果</h1>
        <p className="mt-2 text-muted-foreground">
          浏览、检索并下载项目中的分析结果。
        </p>
      </div>

      <ResultsListClient vm={vm} />
    </div>
  );
}
