import { Metadata } from "next";
import { ResultsListClient } from "@/components/pages/results-list-client";
import { getReportListViewModel } from "@/lib/api/report";
import { toReportsListViewModel } from "@/lib/adapters/report";
import type { ReportListViewModel } from "@/lib/contracts/report";

export const metadata: Metadata = {
  title: "Results",
  description: "Browse and download analysis results",
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
        <h1 className="text-3xl font-bold tracking-tight">Results</h1>
        <p className="mt-2 text-muted-foreground">
          Browse, search, and download analysis results from your projects.
        </p>
      </div>

      <ResultsListClient vm={vm} />
    </div>
  );
}