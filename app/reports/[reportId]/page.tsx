import { Metadata } from "next";
import { ReportDetailClient } from "@/components/pages/report-detail-client";
import { getReportDetailViewModel as getReportDetailFromApi } from "@/lib/api/report";
import { toReportDetailViewModel } from "@/lib/adapters/report";
import type { ReportDetailViewModel } from "@/lib/contracts/report";

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

async function getReportDetailViewModel(
  reportId: string,
): Promise<ReportDetailViewModel> {
  const detail = await getReportDetailFromApi(reportId);
  return toReportDetailViewModel(detail);
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
