import { redirect } from "next/navigation";

export default async function ReportRedirectPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  redirect(`/results/${reportId}`);
}
