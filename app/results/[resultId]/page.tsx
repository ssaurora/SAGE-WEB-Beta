import { Metadata } from "next";
import { ResultDetailClient } from "@/components/pages/result-detail-client";
import { getReportDetailViewModel as getResultDetailFromApi } from "@/lib/api/report";
import { toReportDetailViewModel } from "@/lib/adapters/report";
import type { ReportDetailViewModel } from "@/lib/contracts/report";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resultId: string }>;
}): Promise<Metadata> {
  const { resultId } = await params;
  return {
    title: `Result ${resultId}`,
    description: "View and download analysis result",
  };
}

async function getResultDetailViewModel(
  resultId: string,
): Promise<ReportDetailViewModel> {
  const detail = await getResultDetailFromApi(resultId);
  return toReportDetailViewModel(detail);
}

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const { resultId } = await params;
  const vm = await getResultDetailViewModel(resultId);

  return (
    <div className="space-y-4">
      <ResultDetailClient vm={vm} />
    </div>
  );
}
