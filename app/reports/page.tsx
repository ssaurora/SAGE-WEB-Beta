import { Metadata } from "next";
import {
  ReportsListClient,
  type ReportListViewModel,
} from "@/components/pages/reports-list-client";
import { getReportListViewModel } from "@/lib/api/report";
import { toReportsListViewModel } from "@/lib/adapters/report";

export const metadata: Metadata = {
  title: "Reports",
  description: "Browse and download analysis reports",
};

async function getReportsViewModel(): Promise<ReportListViewModel> {
  const reports = await getReportListViewModel();
  return toReportsListViewModel(reports);
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
